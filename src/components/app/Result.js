import { ScoreCard, MetricCard } from "@/components/app/Cards";
import { useState, useEffect } from "react";

export default function Results({ results }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (results) {
      console.log("Results in component:", results);
      console.log("Core Web Vitals:", results.performance?.metrics?.labData);
      setIsLoading(false);
    }
  }, [results]);

  if (!results || isLoading) return null;

  // Fonction pour formater les nombres sans unités
  const formatValue = (value, isCoreWebVitals = false) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      // Si ce n'est pas dans "Core Web Vitals", retirer le "s" final
      if (!isCoreWebVitals) {
        return value
          .replace(/[a-zA-Z\s]/g, "")
          .trim()
          .replace(/s$/, "");
      }
      // Sinon, retourner la valeur telle quelle
      return value.replace(/[a-zA-Z\s]/g, "").trim();
    }
    return value;
  };

  // Formatter les métriques Core Web Vitals
  const formatMetric = (metric) => {
    if (!metric?.value) return null;
    return {
      ...metric,
      value: formatValue(metric.value),
    };
  };

  // Vérifier si nous avons des métriques Core Web Vitals
  const hasMetrics = Object.values(
    results.performance?.metrics?.labData || {}
  ).some((m) => m?.value);

  return (
    <div className="space-y-12">
      {/* Scores globaux */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Scores globaux
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(results.performance.scores).map(([key, value]) => (
            <ScoreCard key={key} label={key} score={value} />
          ))}
        </div>
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
                    value={formatValue(formattedMetric.value, true)} // Passer `true` pour Core Web Vitals
                    description={formattedMetric.description}
                    type={key.includes("Layout Shift") ? "cls" : "default"}
                  />
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Informations du domaine */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Informations du domaine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Pages indexées"
            value={formatValue(results.seo.domainInfo.indexation.indexedPages)}
            description="Nombre de pages indexées"
          />
          <MetricCard
            label="Résultats totaux"
            value={formatValue(results.seo.domainInfo.indexation.totalResults)}
            description="Nombre total de résultats"
          />
          <MetricCard
            label="Part de marché"
            value={`${formatValue(results.seo.metrics?.competition?.marketShare)}%`}
            description="Part de visibilité dans les résultats"
          />
        </div>
      </div>

      {/* Positions organiques */}
      {results.seo.metrics?.visibility?.organicPositions?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Positions dans les résultats de recherche
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {results.seo.metrics.visibility.organicPositions.map(
                (position, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {position.position}
                      </span>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {position.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {position.snippet}
                        </p>
                        <a
                          href={position.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-xs text-blue-600 hover:underline"
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
        </div>
      )}

      {/* Analyse du contenu */}
      {results.seo.contentAnalysis && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analyse du contenu
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mots-clés principaux */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Mots-clés principaux
              </h3>
              <div className="space-y-3">
                {results.seo.contentAnalysis.topKeywords.map(
                  (keyword, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span className="text-gray-700 font-medium">
                        {keyword.word}
                      </span>
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {keyword.count}{" "}
                        {keyword.count > 1 ? "occurrences" : "occurrence"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Types de contenu */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Types de contenu
              </h3>
              <div className="space-y-3">
                {Object.entries(
                  results.seo.contentAnalysis.contentTypes.byType
                ).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-700 capitalize font-medium">
                      {type}
                    </span>
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {count} {count > 1 ? "pages" : "page"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommandations SEO */}
      {results.seo.recommendations?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recommandations SEO
          </h2>
          <div className="space-y-4">
            {results.seo.recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
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
                <p className="text-gray-600 mb-4">{rec.description}</p>
                {rec.actions && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Actions recommandées :
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {rec.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-gray-600 text-sm">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
