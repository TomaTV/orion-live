export async function analyzePageSpeed(url, strategy = "mobile") {
  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    throw new Error("Clé API Google manquante");
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&strategy=${strategy}&key=${API_KEY}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `PageSpeed API Error: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  if (!data.lighthouseResult) {
    throw new Error("Format de réponse PageSpeed invalide");
  }

  const result = data.lighthouseResult;

  const getMetric = (metricId) => {
    const metric = result.audits[metricId];
    if (!metric) return null;

    return {
      title: metric.title || "",
      value:
        metric.displayValue?.replace("s", "").replace("ms", "").trim() || "0",
      description: metric.description?.split("[")[0]?.trim() || "",
      numericValue: Number(metric.numericValue || 0),
    };
  };

  const normalized = {
    categories: {
      performance: {
        score: Math.round((result.categories.performance?.score || 0) * 100),
      },
      accessibility: {
        score: Math.round((result.categories.accessibility?.score || 0) * 100),
      },
      bestPractices: {
        score: Math.round(
          (result.categories["best-practices"]?.score || 0) * 100
        ),
      },
      seo: {
        score: Math.round((result.categories.seo?.score || 0) * 100),
      },
    },
    audits: {
      "first-contentful-paint": getMetric("first-contentful-paint"),
      "largest-contentful-paint": getMetric("largest-contentful-paint"),
      "total-blocking-time": getMetric("total-blocking-time"),
      "cumulative-layout-shift": getMetric("cumulative-layout-shift"),
      "speed-index": getMetric("speed-index"),
      interactive: getMetric("interactive"),
      "first-meaningful-paint": getMetric("first-meaningful-paint"),
    },
  };

  return normalized;
}
