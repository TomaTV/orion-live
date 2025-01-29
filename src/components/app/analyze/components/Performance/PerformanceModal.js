import React from "react";
import { Gauge, X, AlertTriangle, Zap } from "lucide-react";

const PerformanceModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const translateMetric = (metric) => {
    const translations = {
      FCP: "Premier Affichage",
      LCP: "Plus Grand Élément",
      TBT: "Temps de Blocage",
      CLS: "Stabilité Visuelle",
    };
    return translations[metric] || metric;
  };

  const getStatusColor = (value, metric) => {
    switch (metric) {
      case "FCP":
      case "LCP":
        return parseFloat(value) <= 2.5
          ? "text-emerald-500"
          : parseFloat(value) <= 4
            ? "text-orange-500"
            : "text-red-500";
      case "TBT":
        return parseFloat(value) <= 200
          ? "text-emerald-500"
          : parseFloat(value) <= 600
            ? "text-orange-500"
            : "text-red-500";
      case "CLS":
        return parseFloat(value) <= 0.1
          ? "text-emerald-500"
          : parseFloat(value) <= 0.25
            ? "text-orange-500"
            : "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getAuditTagConfig = (audit) => {
    const type = audit.id || "";
    const score = audit.score || 0;

    // Configuration des priorités
    const getConfig = (score) => {
      if (score < 0.5) {
        return {
          style: "bg-red-500/10 text-red-400 font-medium",
          level: "critical",
        };
      } else if (score < 0.8) {
        return {
          style: "bg-orange-500/10 text-orange-400 font-medium",
          level: "warning",
        };
      } else {
        return {
          style: "bg-emerald-500/10 text-emerald-400 font-medium",
          level: "info",
        };
      }
    };

    let text = "À optimiser";
    if (type.includes("uses-webp-images")) text = "Convertir en WebP";
    if (type.includes("uses-responsive-images")) text = "Redimensionner";
    if (type.includes("render-blocking-resources"))
      text = "Différer chargement";
    if (type.includes("unminified")) text = "Minifier";
    if (type.includes("cache")) text = "Mettre en cache";
    if (type.includes("redirects")) text = "Redirection";
    if (type.includes("unused")) text = "Code inutilisé";

    const config = getConfig(score);
    return { text, ...config };
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " o";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " Ko";
    else return (bytes / 1048576).toFixed(1) + " Mo";
  };

  const getBorderColor = (level) => {
    switch (level) {
      case "critical":
        return "border-red-500/50";
      case "warning":
        return "border-orange-500/50";
      case "info":
        return "border-emerald-500/50";
      default:
        return "border-gray-500/50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#1a1b1e] w-full max-w-3xl rounded-xl shadow-2xl border border-[#2a2b2e] flex flex-col"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-semibold text-white font-spaceg">
              Performance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="bg-[#2a2b2e]/50 p-4 rounded-lg">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Métriques Principales
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.performance.metrics).map(
                  ([key, value]) => (
                    <div key={key} className="bg-[#2a2b2e] p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {translateMetric(key)}
                        </span>
                        <span
                          className={`font-mono font-medium ${getStatusColor(value, key)}`}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {data.performance.audits?.length > 0 && (
              <div>
                <h4 className="text-white font-medium text-lg mb-4 ">
                  Recommandations
                </h4>
                <div className="space-y-6">
                  {data.performance.audits.map((audit, index) => {
                    const tagConfig = getAuditTagConfig(audit);
                    return (
                      <div
                        key={index}
                        className={`bg-[#2a2b2e] p-4 rounded-lg border-l-4 ${getBorderColor(tagConfig.level)}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-white font-medium">
                            {audit.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${tagConfig.style}`}
                          >
                            {tagConfig.text}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-6">
                          {audit.description}
                        </p>

                        <div className="space-y-3">
                          {audit.details?.items?.map((item, i) => (
                            <div key={i}>
                              {item.url && (
                                <div className="font-mono text-xs bg-black/20 p-3 rounded flex items-center justify-between gap-4">
                                  <span className="text-white/60 truncate">
                                    {item.url}
                                  </span>
                                  <div className="flex items-center gap-4 text-gray-400 whitespace-nowrap">
                                    {item.totalBytes && (
                                      <span>
                                        {formatBytes(item.totalBytes)}
                                      </span>
                                    )}
                                    {item.wastedMs && (
                                      <span>
                                        +{parseFloat(item.wastedMs.toFixed(2))}
                                        ms
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal;
