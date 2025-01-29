import { rateLimit } from "@/lib/rateLimit";
import * as cheerio from "cheerio";
import { parse } from "node-html-parser";
import https from "https";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const PSI_API_KEY = process.env.GOOGLE_PSI_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const PSI_API_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const SERP_API_URL = "https://serpapi.com/search.json";

// Fonction pour analyser le SEO d'une URL
async function analyzeSEO(url) {
  try {
    // 1. Analyse avec SERP API pour les données de recherche
    const serpParams = new URLSearchParams({
      api_key: SERP_API_KEY,
      engine: "google",
      q: `site:${url}`,
      num: 100,
    });

    const serpResponse = await fetch(
      `${SERP_API_URL}?${serpParams.toString()}`
    );
    const serpData = await serpResponse.json();

    // 2. Analyse de la page elle-même
    const pageResponse = await fetch(url);
    const pageContent = await pageResponse.text();

    const $ = cheerio.load(pageContent);

    // Analyse des balises meta
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const keywords =
      $('meta[name="keywords"]')
        .attr("content")
        ?.split(",")
        .map((k) => k.trim()) || [];

    // Analyse des en-têtes
    const headings = ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => ({
      tag,
      count: $(tag).length,
      items: $(tag)
        .map((_, el) => $(el).text())
        .get(),
    }));

    // Analyse des images
    const images = $("img")
      .map((_, el) => ({
        src: $(el).attr("src"),
        alt: $(el).attr("alt"),
        hasAlt: !!$(el).attr("alt"),
      }))
      .get();

    // Analyse des liens
    const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
    const externalLinks = $('a[href^="http"]').not(`a[href^="${url}"]`).length;

    // Calcul des scores
    const titleScore = calculateTitleScore(title);
    const descriptionScore = calculateDescriptionScore(description);
    const headingsScore = calculateHeadingsScore(headings);
    const imagesScore = calculateImagesScore(images);
    const linksScore = calculateLinksScore(internalLinks, externalLinks);

    // Score global SEO
    const seoScore = Math.round(
      (titleScore +
        descriptionScore +
        headingsScore +
        imagesScore +
        linksScore) /
        5
    );

    return {
      score: seoScore,
      metrics: {
        title: {
          content: title,
          score: titleScore,
          recommendation: getTitleRecommendation(title),
        },
        description: {
          content: description,
          score: descriptionScore,
          recommendation: getDescriptionRecommendation(description),
        },
        keywords: {
          content: keywords,
          count: keywords.length,
        },
        headings: headings,
        images: {
          total: images.length,
          withAlt: images.filter((img) => img.hasAlt).length,
          score: imagesScore,
          details: images,
        },
        links: {
          internal: internalLinks,
          external: externalLinks,
          score: linksScore,
        },
        serpResults: {
          position: serpData.organic_results?.[0]?.position || null,
          snippet: serpData.organic_results?.[0]?.snippet || null,
          visibleUrls: serpData.organic_results?.length || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error in SEO analysis:", error);
    return {
      score: 0,
      error: error.message,
    };
  }
}

// Fonctions utilitaires pour les calculs de score
function calculateTitleScore(title) {
  if (!title) return 0;
  const length = title.length;
  if (length < 10) return 30;
  if (length > 70) return 60;
  return 100;
}

function calculateDescriptionScore(description) {
  if (!description) return 0;
  const length = description.length;
  if (length < 50) return 30;
  if (length > 160) return 60;
  return 100;
}

function calculateHeadingsScore(headings) {
  const h1Count = headings.find((h) => h.tag === "h1")?.count || 0;
  if (h1Count !== 1) return 50;
  return 100;
}

function calculateImagesScore(images) {
  if (images.length === 0) return 100;
  const withAlt = images.filter((img) => img.hasAlt).length;
  return Math.round((withAlt / images.length) * 100);
}

function calculateLinksScore(internal, external) {
  if (internal + external === 0) return 0;
  const ratio = internal / (internal + external);
  return Math.round(ratio * 100);
}

function getTitleRecommendation(title) {
  if (!title) return "Ajoutez un titre à votre page";
  if (title.length < 10) return "Le titre est trop court (min. 10 caractères)";
  if (title.length > 70) return "Le titre est trop long (max. 70 caractères)";
  return null;
}

function getDescriptionRecommendation(description) {
  if (!description) return "Ajoutez une meta description";
  if (description.length < 50)
    return "La description est trop courte (min. 50 caractères)";
  if (description.length > 160)
    return "La description est trop longue (max. 160 caractères)";
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await limiter.check(res, 10, "CACHE_TOKEN");
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Format d'URL invalide" });
    }

    // Analyse SERP avant les autres analyses
    const serpParams = new URLSearchParams({
      api_key: SERP_API_KEY,
      engine: "google",
      q: `site:${url}`,
      num: 100,
    });

    const serpResponse = await fetch(
      `${SERP_API_URL}?${serpParams.toString()}`
    );
    const serpData = await serpResponse.json();

    const params = new URLSearchParams({
      url: url,
      key: PSI_API_KEY,
      strategy: "mobile",
      category: ["performance"],
    });

    // Analyse de performance avec PageSpeed Insights
    const psiResponse = await fetch(`${PSI_API_URL}?${params.toString()}`);
    const psiData = await psiResponse.json();

    if (!psiResponse.ok) {
      throw new Error(
        psiData.error?.message || "Échec de l'analyse de performance"
      );
    }

    // Analyse SEO avec SERP API et analyse de la page
    const seoData = await analyzeSEO(url);

    // Ajoutez cette fonction à votre fichier
    async function enrichSerpData(serpData, url) {
      try {
        return {
          // Données existantes
          position: serpData.organic_results?.[0]?.position || null,
          snippet: serpData.organic_results?.[0]?.snippet || null,
          visibleUrls: serpData.organic_results?.length || 0,

          // Nouvelles données enrichies
          relatedQueries:
            serpData.related_questions?.map((q) => q.question) || [],
          peopleAlsoAsk: serpData.people_also_ask?.slice(0, 5) || [],

          // Informations supplémentaires sur les résultats organiques
          organicResults:
            serpData.organic_results?.map((result) => ({
              title: result.title,
              link: result.link,
              snippet: result.snippet,
              date: result.publication_date,
            })) || [],

          // Informations sur les liens et domaines
          domain: new URL(url).hostname,
          domainAuthority: serpData.domain_authority || null,

          // Métadonnées supplémentaires
          searchMetadata: {
            totalResults: serpData.search_metadata?.total_results,
            queryTime: serpData.search_metadata?.query_time,
            createdAt: serpData.search_metadata?.created_at,
          },
        };
      } catch (error) {
        console.error(
          "Erreur lors de l'enrichissement des données SERP:",
          error
        );
        return null;
      }
    }

    const enrichedSerpData = await enrichSerpData(serpData, url);

    // On ne garde que les audits qui ont un score non parfait et des éléments à optimiser
    const relevantAudits = Object.entries(
      psiData.lighthouseResult?.audits || {}
    )
      .filter(
        ([_, audit]) =>
          audit.score !== null &&
          audit.score < 1 &&
          audit.details?.items?.length > 0
      )
      .map(([id, audit]) => ({
        id,
        title: audit.title,
        description: audit.description,
        details: {
          items: audit.details.items.map((item) => ({
            url: item.url || item.source || item.node?.selector,
            totalBytes: item.totalBytes,
            wastedMs: item.wastedMs,
          })),
        },
      }));

    const result = {
      url: url,
      performance: {
        score:
          psiData.lighthouseResult?.categories?.performance?.score * 100 || 0,
        metrics: {
          FCP: psiData.lighthouseResult?.audits?.["first-contentful-paint"]
            ?.displayValue,
          LCP: psiData.lighthouseResult?.audits?.["largest-contentful-paint"]
            ?.displayValue,
          TBT: psiData.lighthouseResult?.audits?.["total-blocking-time"]
            ?.displayValue,
          CLS: psiData.lighthouseResult?.audits?.["cumulative-layout-shift"]
            ?.displayValue,
        },
        audits: relevantAudits,
      },
      seo: {
        ...seoData,
        serpDetails: enrichedSerpData,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error analyzing URL:", error);
    return res.status(500).json({ error: "Échec de l'analyse" });
  }
}
