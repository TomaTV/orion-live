import { useState, useEffect } from "react";
import { MetricCard } from "@/components/app/Cards";
import CompetitorAnalysis from "./CompetitorAnalysis";

export default function Results({ results }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (results) {
      // Debug du résultat
      console.log("Full results:", results);
      console.log("Core Web Vitals:", results.performance?.metrics?.labData);
      console.log("URL from results:", results.url);
      setIsLoading(false);
    }
  }, [results]);

  if (!results || isLoading) return null;

  // Fonction pour formater les nombres
  const formatNumber = (number) => {
    if (!number && number !== 0) return "-";
    return new Intl.NumberFormat("fr-FR").format(number);
  };

  // Fonction pour formater les nombres sans unités
  const formatValue = (value, isCoreWebVitals = false) => {
    if (typeof value === "number") return value;

    if (typeof value === "string") {
      // Cas spécifique pour Core Web Vitals
      if (isCoreWebVitals) {
        // 1. Gérer le cas où la valeur est "0" pour Cumulative Layout Shift
        if (value === "0") {
          return value; // Retourne "0" sans ajouter d'unité
        }

        // 2. Corriger l'unité de Total Blocking Time (de "m" à "ms")
        if (value.includes("m")) {
          return value.replace("m", ""); // Remplacer "m" par "ms"
        }

        // Sinon, retourner la valeur telle quelle
        return value.trim();
      }

      // Pour les autres valeurs non Core Web Vitals, retirer les lettres et "s" final
      return value
        .replace(/[a-zA-Z\s]/g, "")
        .trim()
        .replace(/s$/, "");
    }

    return value;
  };

  // Formatter les métriques Core Web Vitals
  const formatMetric = (metric) => {
    if (!metric?.value) return null;
    return {
      ...metric,
      value: formatValue(metric.value, true),
    };
  };

  // Vérifier si nous avons des métriques Core Web Vitals
  const hasMetrics = Object.values(
    results.performance?.metrics?.labData || {}
  ).some((m) => m?.value);

  // Nettoyage des mots-clés
  const cleanKeyword = (keyword) => {
    return keyword.replace(/\d+x$/, "").trim();
  };

  // Préparation et tri des mots-clés
  const prepareKeywords = (keywords) => {
    if (!keywords) return [];

    // Nettoyer et regrouper les mots-clés
    const cleanedKeywords = keywords.reduce((acc, curr) => {
      const word = cleanKeyword(curr.word);
      if (!word) return acc;

      const existing = acc.find((k) => k.word === word);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push({ word, count: curr.count });
      }
      return acc;
    }, []);

    // Trier par compte décroissant
    return cleanedKeywords.sort((a, b) => b.count - a.count);
  };

  // Vérifier si l'URL est valide avant de la passer
  const ensureValidUrl = (url) => {
    if (!url) return null;
    try {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      new URL(fullUrl); // Test si l'URL est valide
      return fullUrl;
    } catch (error) {
      console.error("Invalid URL:", url, error);
      return null;
    }
  };

  // Préparation des mots-clés pour l'affichage
  const keywords = prepareKeywords(results.seo.contentAnalysis?.topKeywords);

  // Préparer l'URL pour l'analyse des concurrents
  const validUrl = ensureValidUrl(results.url);
  console.log("Prepared URL:", validUrl);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Section Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Performance Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(results.performance.scores).map(([key, value]) => {
            // Convertir la valeur en nombre et multiplier par 100 si nécessaire
            let score = typeof value === "string" ? parseFloat(value) : value;
            score = score > 1 ? Math.round(score) : Math.round(score * 100);
            return (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {score}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Core Web Vitals */}
        {hasMetrics && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Core Web Vitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(results.performance.metrics.labData).map(
                ([key, metric]) => {
                  const formattedMetric = formatMetric(metric);
                  if (!formattedMetric) return null;

                  return (
                    <MetricCard
                      key={key}
                      label={key}
                      value={formattedMetric.value} // Utiliser la valeur formatée
                      description={formattedMetric.description}
                      type={key.includes("Layout Shift") ? "cls" : "default"}
                    />
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section SEO */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Overview</h2>

        {/* Informations du domaine */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">
              Pages indexées
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {formatNumber(results.seo.domainInfo.indexation.indexedPages)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">
              Résultats totaux
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {formatNumber(results.seo.domainInfo.indexation.totalResults)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">
              Part de marché
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {results.seo.metrics?.competition?.marketShare}%
            </div>
          </div>
        </div>

        {/* Mots-clés et contenu */}
        {results.seo.contentAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mots-clés principaux */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Mots-clés principaux
              </h3>
              <div className="space-y-2">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{keyword.word}</span>
                    <span className="text-gray-500">{keyword.count}x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types de contenu */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Types de contenu
              </h3>
              <div className="space-y-2">
                {Object.entries(
                  results.seo.contentAnalysis.contentTypes.byType
                ).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-gray-500">
                      {count} page{count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section positions organiques */}
      {results.seo.metrics?.visibility?.organicPositions?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Positions organiques
          </h2>
          <div className="space-y-4">
            {results.seo.metrics.visibility.organicPositions.map(
              (position, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {position.position}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {position.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {position.snippet}
                      </p>
                      <a
                        href={position.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-blue-600 hover:underline inline-block"
                      >
                        {position.url}
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Section recommandations */}
      {results.seo.recommendations?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recommandations
          </h2>
          <div className="space-y-4">
            {results.seo.recommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : rec.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
                {rec.actions && (
                  <ul className="mt-2 pl-5 space-y-1 text-sm text-gray-600 list-disc">
                    {rec.actions.map((action, actionIndex) => (
                      <li key={actionIndex}>{action}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyse des concurrents */}
      {validUrl && <CompetitorAnalysis url={validUrl} />}
    </div>
  );
}
