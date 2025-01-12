export async function analyzeSEO(url) {
  const SERP_API_KEY = process.env.SERP_API_KEY;
  if (!SERP_API_KEY) {
    throw new Error("Clé API SERP manquante");
  }

  try {
    const domain = new URL(url).hostname;
    const searchQuery = `site:${domain}`;

    // Requête principale à l'API SerpApi
    const params = new URLSearchParams({
      engine: "google",
      q: searchQuery,
      api_key: SERP_API_KEY,
      num: 100,
      gl: "fr",
    });

    const response = await fetch(`https://serpapi.com/search.json?${params}`);
    if (!response.ok) {
      throw new Error(`SerpAPI Error: ${response.status}`);
    }

    const data = await response.json();
    const organicResults = data.organic_results || [];

    // Extraire et formater les métriques SEO
    return {
      domainInfo: {
        domain,
        indexation: {
          totalResults: data.search_information?.total_results || 0,
          indexedPages: organicResults.length || 0,
          timeTaken: data.search_information?.time_taken_displayed || 0,
        },
      },
      searchAppearance: {
        organicResults: processOrganicResults(organicResults),
        richResults: extractRichResults(data),
        featuredSnippets: !!data.answer_box,
        knowledgeGraph: !!data.knowledge_graph,
        localResults: processLocalResults(data.local_results),
      },
      contentAnalysis: {
        topKeywords: extractKeywords(organicResults),
        contentTypes: analyzeContentTypes(organicResults),
      },
      metrics: {
        visibility: {
          organicPositions: organicResults.map((result, index) => ({
            position: index + 1,
            title: result.title,
            snippet: result.snippet,
            url: result.link,
          })),
          richResults: extractRichResults(data),
          featuredSnippets: !!data.answer_box,
          bestPosition: organicResults.length > 0 ? 1 : null,
        },
        content: {
          indexedPages: organicResults.length,
          contentTypes: analyzeContentTypes(organicResults),
        },
        competition: {
          marketShare: calculateMarketShare(organicResults, domain),
          mainCompetitors: extractCompetitors(organicResults, domain),
        },
      },
      recommendations: generateRecommendations({
        hasRichResults: !!extractRichResults(data).length,
        indexedPages: organicResults.length,
        hasStructuredData: !!data.rich_snippets,
      }),
    };
  } catch (error) {
    throw new Error(`Erreur d'analyse SEO: ${error.message}`);
  }
}

function processOrganicResults(results) {
  return results.map((result) => ({
    position: result.position,
    title: result.title,
    link: result.link,
    snippet: result.snippet,
    displayedUrl: result.displayed_link,
    sitelinks: result.sitelinks,
  }));
}

function extractRichResults(data) {
  const richResults = [];

  if (data.answer_box)
    richResults.push({
      type: "Featured Snippet",
      content: data.answer_box.snippet,
    });

  if (data.knowledge_graph)
    richResults.push({
      type: "Knowledge Graph",
      content: data.knowledge_graph.title,
    });

  if (data.shopping_results)
    richResults.push({
      type: "Shopping",
      count: data.shopping_results.length,
    });

  if (data.image_results)
    richResults.push({
      type: "Images",
      count: data.image_results.length,
    });

  return richResults;
}

function processLocalResults(results) {
  if (!results) return [];

  return results.map((result) => ({
    title: result.title,
    address: result.address,
    rating: result.rating,
    reviews: result.reviews,
  }));
}

function extractKeywords(results) {
  const text = results.map((r) => `${r.title} ${r.snippet}`).join(" ");

  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3);

  const frequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

function analyzeContentTypes(results) {
  const types = {
    total: results.length,
    byType: {},
  };

  results.forEach((result) => {
    const url = result.link;
    let type = "page";

    if (url.includes("/blog/")) type = "blog";
    else if (url.includes("/products/")) type = "product";
    else if (url.includes("/category/")) type = "category";
    else if (url.includes("/news/")) type = "news";

    types.byType[type] = (types.byType[type] || 0) + 1;
  });

  return types;
}

function calculateMarketShare(results, domain) {
  if (!results || !results.length) return 0;

  const totalResults = results.length;
  const domainResults = results.filter((r) => r.link.includes(domain)).length;

  return Math.round((domainResults / totalResults) * 100);
}

function extractCompetitors(results, mainDomain) {
  return results
    .filter((r) => !r.link.includes(mainDomain))
    .map((r) => ({
      domain: new URL(r.link).hostname,
      title: r.title,
      description: r.snippet,
    }))
    .slice(0, 5);
}

function generateRecommendations(metrics) {
  const recommendations = [];

  if (!metrics.hasRichResults) {
    recommendations.push({
      priority: "medium",
      category: "Rich Results",
      title: "Implémentation de données structurées",
      description: "Votre site pourrait bénéficier de rich results",
      actions: [
        "Implémenter Schema.org pour votre type de contenu",
        "Tester avec l'outil Rich Results de Google",
        "Ajouter des données structurées pour les articles/produits",
      ],
    });
  }

  if (metrics.indexedPages < 10) {
    recommendations.push({
      priority: "high",
      category: "Indexation",
      title: "Améliorer l'indexation du site",
      description: "Votre site a peu de pages indexées",
      actions: [
        "Créer plus de contenu de qualité",
        "Vérifier le fichier robots.txt",
        "Soumettre un sitemap XML à Google",
      ],
    });
  }

  if (!metrics.hasStructuredData) {
    recommendations.push({
      priority: "medium",
      category: "SEO technique",
      title: "Ajouter des données structurées",
      description: "Aucune donnée structurée détectée",
      actions: [
        "Implémenter les données structurées appropriées",
        "Utiliser l'outil de test des données structurées de Google",
        "Suivre les recommandations de Schema.org",
      ],
    });
  }

  return recommendations;
}
