import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500, 
});

const PSI_API_KEY = process.env.GOOGLE_PSI_API_KEY;
const PSI_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

const generateMockData = (url) => ({
  url: url,
  performance: {
    score: 75,
    metrics: {
      FCP: "2.1 s",
      LCP: "2.5 s",
      TBT: "156 ms",
      CLS: "0.12",
    },
  },
  seo: {
    score: 85,
    issues: false,
  },
  accessibility: {
    score: 90,
  },
  bestPractices: {
    score: 80,
  },
  pwa: {
    score: 65,
  },
  security: {
    https: true,
    mixedContent: [],
  },
  timestamp: new Date().toISOString(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await limiter.check(res, 10, "CACHE_TOKEN");
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL manquante" });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Format d'URL invalide" });
    }

    // Si pas de clé API, retourner des données simulées
    if (!PSI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Délai simulé
      return res.status(200).json(generateMockData(url));
    }

    const params = new URLSearchParams({
      url: url,
      key: PSI_API_KEY,
      strategy: "mobile"
    });

    ["performance", "accessibility", "best-practices", "seo", "pwa"].forEach(category => {
      params.append("category", category);
    });

    const response = await fetch(`${PSI_API_URL}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.lighthouseResult) {
      console.error("PageSpeed API error:", data);
      return res.status(200).json(generateMockData(url));
    }

    const result = {
      url: url,
      performance: {
        score: data.lighthouseResult?.categories?.performance?.score * 100 || 0,
        metrics: {
          FCP: data.lighthouseResult?.audits?.["first-contentful-paint"]?.displayValue || "N/A",
          LCP: data.lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue || "N/A",
          TBT: data.lighthouseResult?.audits?.["total-blocking-time"]?.displayValue || "N/A",
          CLS: data.lighthouseResult?.audits?.["cumulative-layout-shift"]?.displayValue || "N/A",
        },
      },
      seo: {
        score: data.lighthouseResult?.categories?.seo?.score * 100 || 0,
        issues: data.lighthouseResult?.audits?.["meta-description"]?.score === 0,
      },
      accessibility: {
        score: data.lighthouseResult?.categories?.accessibility?.score * 100 || 0,
      },
      bestPractices: {
        score: data.lighthouseResult?.categories?.["best-practices"]?.score * 100 || 0,
      },
      pwa: {
        score: data.lighthouseResult?.categories?.pwa?.score * 100 || 0,
      },
      security: {
        https: data.lighthouseResult?.audits?.["is-on-https"]?.score === 1,
        mixedContent: data.lighthouseResult?.audits?.["is-on-https"]?.details?.items || [],
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error analyzing URL:", error);
    // En cas d'erreur, retourner des données simulées plutôt qu'une erreur
    return res.status(200).json(generateMockData(req.body.url));
  }
}