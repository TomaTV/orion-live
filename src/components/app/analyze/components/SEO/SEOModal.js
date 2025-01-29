import React from "react";
import {
  X,
  ExternalLink,
  AlertTriangle,
  Search,
  Globe,
  CheckCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";

const MetaItem = ({ label, value, score, recommendation, maxLength }) => {
  const getStatusColor = (score) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  // Tronquer la valeur si elle est trop longue
  const truncatedValue =
    maxLength && value?.length > maxLength
      ? `${value.slice(0, maxLength)}...`
      : value;

  return (
    <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className={`${getStatusColor(score)} font-bold`}>{score}%</span>
      </div>
      <p className="text-white text-sm mb-2">
        {truncatedValue || "Non défini"}
      </p>
      {recommendation && (
        <div className="flex items-center gap-2 text-yellow-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{recommendation}</span>
        </div>
      )}
    </div>
  );
};

const SEOModal = ({ isOpen, onClose, data }) => {
  // Ajout de logs de débogage
  console.log("SEOModal data:", data);
  console.log("SEOModal isOpen:", isOpen);

  // Vérification explicite des données
  if (!isOpen) return null;

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-red-500 p-4 rounded text-white">
          Aucune donnée disponible pour l&apos;analyse SEO
        </div>
      </div>
    );
  }

  // Vérification des différents niveaux de données
  if (!data.seo) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-red-500 p-4 rounded text-white">
          Données SEO manquantes
        </div>
      </div>
    );
  }

  // Valeurs par défaut avec une vérification plus robuste
  const metrics = data.seo?.metrics || {
    title: { content: "Non disponible", score: 0, recommendation: null },
    description: { content: "Non disponible", score: 0, recommendation: null },
    keywords: { content: [], count: 0 },
    headings: [],
    images: { total: 0, withAlt: 0, score: 0 },
    links: { internal: 0, external: 0 },
    serpResults: { position: null, visibleUrls: 0, snippet: null },
  };

  const url = data.url || "URL non disponible";

  // Calcul du ratio de liens internes vs externes
  const totalLinks = metrics.links.internal + metrics.links.external;
  const internalLinkRatio =
    totalLinks > 0
      ? Math.round((metrics.links.internal / totalLinks) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1b1e] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">
              Analyse SEO Détaillée
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-96px)] space-y-8">
          {/* Meta Tags Section */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              Meta Tags
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <MetaItem
                label="Title"
                value={metrics.title.content}
                score={metrics.title.score}
                recommendation={metrics.title.recommendation}
                maxLength={70}
              />
              <MetaItem
                label="Description"
                value={metrics.description.content}
                score={metrics.description.score}
                recommendation={metrics.description.recommendation}
                maxLength={160}
              />
              <MetaItem
                label="Keywords"
                value={metrics.keywords.content.join(", ")}
                score={metrics.keywords.count * 10}
              />
            </div>
          </section>

          {/* Sections supplémentaires */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Content Structure */}
            <section>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                Structure du Contenu
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Hiérarchie des En-têtes
                  </h4>
                  {metrics.headings.map((heading, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm mb-1"
                    >
                      <span className="text-gray-500">{heading.tag}</span>
                      <span className="text-white truncate max-w-[200px]">
                        {heading.items[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Images Section */}
            <section>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Optimisation des Images
              </h3>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-300 text-sm">Total Images</span>
                    <div className="text-white text-xl font-bold">
                      {metrics.images.total}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">
                      Images avec Alt
                    </span>
                    <div className="text-white text-xl font-bold">
                      {metrics.images.withAlt}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Score d&apos;optimisation : {metrics.images.score}%
                </div>
              </div>
            </section>
          </div>

          {/* Liens et SERP */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Liens */}
            <section>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                Analyse des Liens
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Liens Internes
                  </h4>
                  <div className="text-2xl font-semibold text-white">
                    {metrics.links.internal}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Liens Externes
                  </h4>
                  <div className="text-2xl font-semibold text-white">
                    {metrics.links.external}
                  </div>
                </div>
                <div className="col-span-2 p-4 rounded-lg bg-white/5">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Ratio de Liens Internes
                  </h4>
                  <div className="text-xl font-semibold text-white">
                    {internalLinkRatio}%
                  </div>
                </div>
              </div>
            </section>

            {/* SERP Results */}
            <section>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                Résultats de Recherche
              </h3>
              <div className="p-4 rounded-lg bg-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Position</span>
                  <span className="text-white">
                    {metrics.serpResults.position || "Non classé"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">URLs Indexées</span>
                  <span className="text-white">
                    {metrics.serpResults.visibleUrls || 0}
                  </span>
                </div>
                {metrics.serpResults.snippet && (
                  <div>
                    <span className="text-gray-300 block mb-1">Snippet</span>
                    <p className="text-white text-sm italic">
                      {metrics.serpResults.snippet}
                    </p>
                  </div>
                )}
                {metrics.serpResults.position && (
                  <a
                    href={`https://www.google.com/search?q=site:${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-2"
                  >
                    Voir sur Google <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {metrics.serpResults.relatedQueries && (
                  <section>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Requêtes Associées
                    </h3>
                    <div className="space-y-2">
                      {metrics.serpResults.relatedQueries.map(
                        (query, index) => (
                          <div
                            key={index}
                            className="bg-white/5 p-3 rounded-lg text-sm text-gray-300"
                          >
                            {query}
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}

                {metrics.serpResults.organicResults && (
                  <section>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Résultats Organiques Détaillés
                    </h3>
                    {metrics.serpResults.organicResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white/5 p-4 rounded-lg mb-4"
                      >
                        <h4 className="text-white font-medium mb-2">
                          {result.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {result.snippet}
                        </p>
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs"
                        >
                          {result.link}
                        </a>
                      </div>
                    ))}
                  </section>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOModal;
