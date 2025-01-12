import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  FolderSearch,
  FileWarning,
  Shield,
  Zap,
  ArrowUpRight,
} from "lucide-react";

function MetricCard({ label, value, description, type = "time" }) {
  const getColorClass = (value, type) => {
    if (type === "time") {
      if (value <= 1) return "border-green-500 bg-green-50";
      if (value <= 3) return "border-yellow-500 bg-yellow-50";
      return "border-red-500 bg-red-50";
    }
    if (type === "cls") {
      if (value <= 0.1) return "border-green-500 bg-green-50";
      if (value <= 0.25) return "border-yellow-500 bg-yellow-50";
      return "border-red-500 bg-red-50";
    }
    return "border-gray-500 bg-gray-50";
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${getColorClass(parseFloat(value), type)}`}
    >
      <div className="flex flex-col">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <span className="text-2xl font-bold mt-1">
          {value}
          {type === "time" ? "s" : ""}
        </span>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

function ScoreCard({ label, score }) {
  const getScoreInfo = (score) => {
    if (score >= 90) {
      return {
        color: "bg-green-50 border-green-500",
        textColor: "text-green-700",
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        message: "Excellent",
      };
    }
    if (score >= 50) {
      return {
        color: "bg-yellow-50 border-yellow-500",
        textColor: "text-yellow-700",
        icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
        message: "À améliorer",
      };
    }
    return {
      color: "bg-red-50 border-red-500",
      textColor: "text-red-700",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      message: "À corriger",
    };
  };

  const { color, textColor, icon, message } = getScoreInfo(score);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{label}</h3>
          <span className={`text-3xl font-bold ${textColor}`}>{score}%</span>
          <p className="text-sm mt-1 text-gray-600">{message}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function IssueCard({ issue }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <FileWarning className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-900">{issue.title}</h3>
          {issue.value && (
            <p className="text-sm text-gray-500 mt-1">
              Valeur actuelle : {issue.value}
            </p>
          )}
          <p className="text-gray-600 mt-2">{issue.description}</p>
          {issue.solution && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">{issue.solution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiagnosticCard({ diagnostic }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-900">
            {diagnostic.description}
          </h3>
          <p className="text-sm text-gray-600 mt-2">{diagnostic.value}</p>
          <div className="mt-4">
            {diagnostic.status ? (
              <span className="inline-flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Optimal
              </span>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4 mr-1.5" />À optimiser
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchBar() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [strategy, setStrategy] = useState("mobile");

  const isValidUrl = (value) => {
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`);
      return true;
    } catch {
      return false;
    }
  };

  const analyzeUrl = async () => {
    if (!url) {
      setError("Veuillez entrer une URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Veuillez entrer une URL valide (ex: example.com)");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          placeholder="Entrez l'URL de votre site (ex: example.com)"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
        >
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <button
          onClick={analyzeUrl}
          disabled={!url || isLoading}
          className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 text-white ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              Analyser
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Résultats */}
      {results && !error && (
        <div className="space-y-12">
          {/* Scores principaux */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scores globaux
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard
                label="Performance"
                score={results.metrics.performance.score}
              />
              <ScoreCard label="SEO" score={results.metrics.seo.score} />
              <ScoreCard
                label="Accessibilité"
                score={results.metrics.accessibility.score}
              />
              <ScoreCard
                label="Bonnes pratiques"
                score={results.metrics.bestPractices.score}
              />
            </div>
          </div>

          {/* Métriques détaillées */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Métriques de performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                label="First Contentful Paint"
                value={results.metrics.performance.metrics.FCP.value}
                description="Temps d'affichage du premier contenu"
              />
              <MetricCard
                label="Largest Contentful Paint"
                value={results.metrics.performance.metrics.LCP.value}
                description="Temps d'affichage du plus gros élément"
              />
              <MetricCard
                label="Total Blocking Time"
                value={results.metrics.performance.metrics.TBT.value}
                description="Temps total de blocage"
              />
              <MetricCard
                label="Cumulative Layout Shift"
                value={results.metrics.performance.metrics.CLS.value}
                description="Stabilité visuelle"
                type="cls"
              />
              <MetricCard
                label="Speed Index"
                value={results.metrics.performance.metrics.SI.value}
                description="Vitesse d'affichage globale"
              />
            </div>
          </div>

          {/* Problèmes et recommandations */}
          {results.metrics.performance.issues?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Problèmes détectés
                </h2>
                <div className="text-sm text-gray-500">
                  {results.metrics.performance.issues.length} problèmes trouvés
                </div>
              </div>
              <div className="grid gap-6">
                {results.metrics.performance.issues.map((issue, index) => (
                  <IssueCard key={index} issue={issue} />
                ))}
              </div>
            </div>
          )}

          {/* Diagnostics techniques */}
          {results.metrics.performance.diagnostics && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Diagnostics techniques
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(results.metrics.performance.diagnostics).map(
                  ([key, diagnostic]) => (
                    <DiagnosticCard key={key} diagnostic={diagnostic} />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
