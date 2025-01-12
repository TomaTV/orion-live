export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  let { url, strategy = "mobile" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "L'URL est requise." });
  }

  try {
    url = new URL(url.startsWith("http") ? url : `https://${url}`).toString();
  } catch (error) {
    return res.status(400).json({ error: "URL invalide." });
  }

  try {
    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) {
      throw new Error("Clé API manquante");
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${API_KEY}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.lighthouseResult) {
      throw new Error("Format de réponse invalide");
    }

    // Fonction utilitaire pour extraire les scores
    const getScore = (categoryName) => {
      try {
        return Math.round(
          (data.lighthouseResult.categories[categoryName]?.score || 0) * 100
        );
      } catch (e) {
        return 0;
      }
    };

    // Fonction pour extraire les métriques de performance
    const getMetricValue = (metricName) => {
      try {
        const audit = data.lighthouseResult.audits[metricName];
        if (!audit) return null;
        const value = audit.numericValue;
        if (typeof value !== "number") return null;
        return metricName === "cumulative-layout-shift"
          ? value.toFixed(3)
          : (value / 1000).toFixed(2);
      } catch (e) {
        return null;
      }
    };

    // Liste enrichie des keyMetrics
    const keyMetrics = {
      "server-response-time": "Temps de réponse serveur trop long",
      "render-blocking-resources": "Ressources bloquant le rendu",
      "unminified-javascript": "JavaScript non minifié",
      "unused-javascript": "JavaScript non utilisé",
      "unused-css-rules": "CSS non utilisé",
      "modern-image-formats": "Formats d'image non optimisés",
      "offscreen-images": "Images hors écran chargées",
      "total-byte-weight": "Poids total de la page",
      "uses-text-compression": "Compression de texte non utilisée",
      "uses-responsive-images": "Images non adaptées au responsive",
      "efficient-animated-content": "Contenus animés peu efficaces",
      "uses-optimized-images": "Images non optimisées",
      "uses-long-cache-ttl": "Absence de mise en cache longue",
      "third-party-summary": "Impact des scripts tiers",
      "bootup-time": "Temps de démarrage trop long",
      "mainthread-work-breakdown": "Temps CPU principal excessif",
      "dom-size": "Taille du DOM trop grande",
      "network-requests": "Trop de requêtes réseau",
      "uses-rel-preload": "Ressources critiques non préchargées",
      "uses-rel-preconnect": "Absence de préconnexion réseau",
    };

    // Fonction pour extraire les problèmes de performance
    const getPerformanceIssues = () => {
      const audits = data.lighthouseResult.audits;
      const issues = [];

      for (const [key, description] of Object.entries(keyMetrics)) {
        const audit = audits[key];
        if (audit && audit.score !== undefined && audit.score < 0.9) {
          issues.push({
            title: description,
            description: audit.description || "",
            value: audit.displayValue || "Non spécifié",
            solution:
              audit.details?.items?.[0]?.suggestion ||
              "Consultez la documentation pour plus de détails.",
          });
        }
      }

      return issues;
    };

    const getDetailedAnalysis = () => {
      const audits = data.lighthouseResult.audits;
      const categories = {
        performance: [],
        seo: [],
        accessibility: [],
        bestPractices: [],
      };

      // Performance
      if (audits["largest-contentful-paint"].numericValue > 2500) {
        categories.performance.push({
          type: "issue",
          title: "Chargement lent du contenu principal",
          description: "Le contenu principal met trop de temps à s'afficher",
          solution: "Optimisez vos images et réduisez le JavaScript bloquant",
        });
      }

      if (audits["speed-index"].numericValue > 3000) {
        categories.performance.push({
          type: "issue",
          title: "Vitesse d'affichage lente",
          description: "Votre page met trop de temps à s'afficher visuellement",
          solution:
            "Réduisez le temps de chargement des ressources critiques et optimisez le rendu",
        });
      }

      // Pour chaque clé dans keyMetrics
      for (const [key, metricInfo] of Object.entries(keyMetrics)) {
        const audit = audits[key];
        if (audit && audit.score < 0.9) {
          categories.performance.push({
            type: "issue",
            title: metricInfo,
            description: audit.description,
            solution:
              audit.details?.items?.[0]?.suggestion ||
              "Consultez la documentation Lighthouse pour plus de détails.",
            value: audit.displayValue,
          });
        }
      }

      // SEO
      if (audits["meta-description"]?.score < 1) {
        categories.seo.push({
          type: "issue",
          title: "Meta description manquante",
          description: "Votre page n'a pas de meta description",
          solution:
            "Ajoutez une meta description pertinente décrivant le contenu de votre page",
        });
      }

      if (audits["document-title"]?.score < 1) {
        categories.seo.push({
          type: "issue",
          title: "Titre de page non optimisé",
          description: "Le titre de votre page n'est pas optimisé pour le SEO",
          solution:
            "Ajoutez un titre unique et descriptif entre 50-60 caractères",
        });
      }

      // Accessibilité
      if (audits["color-contrast"]?.score < 1) {
        categories.accessibility.push({
          type: "issue",
          title: "Contraste insuffisant",
          description:
            "Certains textes manquent de contraste avec leur arrière-plan",
          solution:
            "Augmentez le contraste entre le texte et l'arrière-plan pour améliorer la lisibilité",
        });
      }

      return categories;
    };

    // Fonction pour extraire les problèmes SEO
    const getSEODetails = () => {
      const audits = data.lighthouseResult.audits;
      const currentState = [];

      // Liste des aspects SEO à vérifier (même si le score est bon)
      const seoCheckList = {
        "document-title": {
          title: "Titre de la page",
          description: "Analyse du titre de la page",
          what: "Le titre est un élément crucial pour le SEO",
        },
        "meta-description": {
          title: "Meta description",
          description: "Analyse de la meta description",
          what: "La meta description influence le taux de clic dans les résultats de recherche",
        },
        "link-text": {
          title: "Textes des liens",
          description: "Qualité des textes de liens",
          what: "Les textes de liens aident les moteurs de recherche à comprendre votre structure",
        },
        "crawlable-anchors": {
          title: "Liens indexables",
          description: "État des liens pour le crawl",
          what: "Les liens doivent être crawlables pour une bonne indexation",
        },
        "robots-txt": {
          title: "Robots.txt",
          description: "Configuration du robots.txt",
          what: "Le fichier robots.txt contrôle l'accès des robots",
        },
        canonical: {
          title: "URL canonique",
          description: "Gestion des URL canoniques",
          what: "Les URL canoniques évitent le contenu dupliqué",
        },
        "structured-data": {
          title: "Données structurées",
          description: "Présence de données structurées",
          what: "Les données structurées améliorent la visibilité dans les résultats",
        },
      };

      // Analyser chaque aspect SEO
      for (const [key, info] of Object.entries(seoCheckList)) {
        const audit = audits[key];
        currentState.push({
          title: info.title,
          status: audit?.score === 1,
          value: audit?.displayValue || "Non détecté",
          details: audit?.description,
          importance: info.what,
          recommendations:
            audit?.score === 1
              ? "Bien configuré, continuez ainsi"
              : "Optimisation possible: " +
                (audit?.details?.items?.[0]?.suggestion ||
                  "Vérifiez la documentation"),
        });
      }

      // Statistiques supplémentaires
      const stats = {
        titleLength: {
          value: audits["document-title"]?.details?.items?.[0]?.length || 0,
          recommendation: "Idéalement entre 50 et 60 caractères",
        },
        descriptionLength: {
          value: audits["meta-description"]?.details?.items?.[0]?.length || 0,
          recommendation: "Idéalement entre 140 et 160 caractères",
        },
        totalLinks: {
          value: audits["link-text"]?.details?.items?.length || 0,
          recommendation: "Vérifiez que chaque lien a un texte descriptif",
        },
      };

      return {
        currentState,
        stats,
        additionalInfo: {
          isHttps: audits["is-crawlable"]?.score === 1,
          hasSitemap: audits["xml-sitemap"]?.score === 1,
          isMobileFriendly: audits["mobile-friendly"]?.score === 1,
          hasSchema: audits["structured-data"]?.score === 1,
        },
      };
    };

    // Résultats finaux
    const results = {
      url,
      timestamp: new Date().toISOString(),
      metrics: {
        performance: {
          score: getScore("performance"),
          metrics: {
            FCP: {
              value: getMetricValue("first-contentful-paint"),
              title: "First Contentful Paint",
              description: "Premier affichage de contenu",
            },
            LCP: {
              value: getMetricValue("largest-contentful-paint"),
              title: "Largest Contentful Paint",
              description: "Plus gros élément affiché",
            },
            TBT: {
              value: getMetricValue("total-blocking-time"),
              title: "Total Blocking Time",
              description: "Temps total de blocage",
            },
            CLS: {
              value: getMetricValue("cumulative-layout-shift"),
              title: "Cumulative Layout Shift",
              description: "Stabilité visuelle",
            },
            SI: {
              value: getMetricValue("speed-index"),
              title: "Speed Index",
              description: "Vitesse d'affichage",
            },
          },
          issues: getPerformanceIssues(),
        },
        seo: {
          score: getScore("seo"),
          details: getSEODetails(),
          recommendations: {
            critical: [
              "Vérifiez régulièrement votre sitemap",
              "Maintenez vos meta descriptions à jour",
              "Surveillez les liens cassés",
            ],
            advanced: [
              "Optimisez vos balises de titre pour chaque page",
              "Enrichissez vos données structurées",
              "Améliorez les textes des liens internes",
            ],
          },
        },
        accessibility: {
          score: getScore("accessibility"),
        },
        bestPractices: {
          score: getScore("best-practices"),
        },
      },
    };

    res.status(200).json(results);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de l'analyse.",
      details: error.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
