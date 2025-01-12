import { analyzePageSpeed } from "@/services/pagespeedService";
import { analyzeSEO } from "@/services/seoService";
import { validateUrl, formatError } from "@/services/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { url, strategy = "mobile" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "L'URL est requise." });
  }

  try {
    const validatedUrl = validateUrl(url);

    try {
      // Récupérer les données
      const [pagespeedData, seoData] = await Promise.all([
        analyzePageSpeed(validatedUrl, strategy),
        analyzeSEO(validatedUrl),
      ]);

      console.log(
        "PageSpeed Data:",
        JSON.stringify(pagespeedData.audits, null, 2)
      );

      const coreWebVitals = {
        "First Contentful Paint":
          pagespeedData.audits["first-contentful-paint"],
        "Largest Contentful Paint":
          pagespeedData.audits["largest-contentful-paint"],
        "Total Blocking Time": pagespeedData.audits["total-blocking-time"],
        "Cumulative Layout Shift":
          pagespeedData.audits["cumulative-layout-shift"],
        "Speed Index": pagespeedData.audits["speed-index"],
        "Time To Interactive": pagespeedData.audits["interactive"],
      };

      console.log("Core Web Vitals:", JSON.stringify(coreWebVitals, null, 2));

      // Construction du résultat
      const results = {
        url: validatedUrl,
        timestamp: new Date().toISOString(),
        performance: {
          scores: {
            Performance: pagespeedData.categories.performance.score,
            Accessibility: pagespeedData.categories.accessibility.score,
            "Best Practices": pagespeedData.categories.bestPractices.score,
            SEO: pagespeedData.categories.seo.score,
          },
          metrics: {
            labData: coreWebVitals,
          },
        },
        seo: {
          domainInfo: {
            domain: seoData.domainInfo.domain,
            indexation: {
              totalResults: Number(seoData.domainInfo.indexation.totalResults),
              indexedPages: Number(seoData.domainInfo.indexation.indexedPages),
            },
          },
          metrics: {
            visibility: seoData.metrics.visibility,
            competition: {
              marketShare: Number(seoData.metrics.competition?.marketShare),
            },
          },
          contentAnalysis: seoData.contentAnalysis,
          recommendations: seoData.recommendations,
        },
      };

      console.log(
        "Données finales:",
        JSON.stringify(
          {
            scores: results.performance.scores,
            metrics: results.performance.metrics,
          },
          null,
          2
        )
      );

      return res.status(200).json(results);
    } catch (error) {
      console.error("Erreur générale d'analyse:", error);
      return res.status(500).json(formatError(error));
    }
  } catch (error) {
    console.error("Erreur de validation d'URL:", error);
    return res.status(400).json(formatError(error));
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
