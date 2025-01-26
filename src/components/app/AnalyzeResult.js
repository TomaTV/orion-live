import React, { useState } from "react";
import {
  Gauge,
  Lock,
  Search,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink,
} from "lucide-react";

const ScoreCircle = ({ percentage }) => {
  const radius = 45;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (score) => {
    if (score >= 90) return "#22c55e";
    if (score >= 50) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          stroke="rgba(255,255,255,0.1)"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          stroke={getColor(percentage)}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "all 1s ease-in-out",
            filter: `drop-shadow(0 0 6px ${getColor(percentage)})`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className="text-4xl font-bold"
          style={{ color: getColor(percentage) }}
        >
          {percentage}
        </span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
};

const Stat = ({ label, value, trend }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-white">{value}</span>
      {trend && (
        <span
          className={`text-xs ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}
        >
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
  </div>
);

const BentoBox = ({
  title,
  icon: Icon,
  score,
  metrics,
  diagnostics,
  onClick,
  isSelected,
}) => {
  const getBgGradient = (score) => {
    if (score >= 90) return "from-emerald-500/5 to-emerald-500/0";
    if (score >= 50) return "from-orange-500/5 to-orange-500/0";
    return "from-red-500/5 to-red-500/0";
  };

  return (
    <div
      onClick={onClick}
      className={`
      group cursor-pointer rounded-xl transition-all duration-300 h-full overflow-hidden
      ${isSelected ? "bg-[#1a1b1e]" : "bg-[#1a1b1e] hover:bg-[#1f2023]"}
      ${isSelected ? "ring-2 ring-orion-nebula" : "border border-[#2a2b2e]"}
    `}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon
              className={`w-5 h-5 ${score >= 90 ? "text-emerald-500" : score >= 50 ? "text-orange-500" : "text-red-500"}`}
            />
            <h3 className="text-lg font-semibold text-white leading-none">
              {title}
            </h3>
          </div>
          <span
            className={`text-2xl font-bold ${score >= 90 ? "text-emerald-500" : score >= 50 ? "text-orange-500" : "text-red-500"}`}
          >
            {score}
          </span>
        </div>

        {metrics && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <Stat key={index} {...metric} />
            ))}
          </div>
        )}

        {diagnostics && (
          <div className="space-y-2">
            {diagnostics.map((diagnostic, index) => (
              <div
                key={index}
                className={`py-2 px-3 rounded-lg text-sm flex items-start gap-2
                  ${
                    diagnostic.type === "success"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : diagnostic.type === "warning"
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-red-500/10 text-red-500"
                  }`}
              >
                {diagnostic.type === "success" ? (
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                ) : diagnostic.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 mt-0.5" />
                )}
                <span>{diagnostic.message}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {score >= 90
              ? "Excellent"
              : score >= 50
                ? "Nécessite des améliorations"
                : "Critique"}
          </span>
          <button className="text-xs text-orion-nebula hover:underline">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#1a1b1e] w-full max-w-4xl rounded-xl shadow-2xl border border-[#2a2b2e]
                   transform transition-all duration-300"
      >
        <div className="flex justify-between items-center p-6 border-b border-[#2a2b2e]">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2b2e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const AnalyzeResult = ({ data }) => {
  const [selectedBox, setSelectedBox] = useState(null);

  const boxes = [
    {
      id: "performance",
      title: "Performance",
      icon: Gauge,
      score: data.performance.score,
      metrics: [
        {
          label: "First Paint",
          value: data.performance.metrics.FCP,
          trend: -2.5,
        },
        {
          label: "Largest Paint",
          value: data.performance.metrics.LCP,
          trend: 3.8,
        },
        { label: "Total Blocking", value: data.performance.metrics.TBT },
        { label: "Layout Shift", value: data.performance.metrics.CLS },
      ],
      diagnostics: [
        { type: "error", message: "Images non optimisées détectées" },
        { type: "warning", message: "Ressources bloquantes" },
        { type: "success", message: "Compression Gzip active" },
      ],
    },
    {
      id: "seo",
      title: "SEO",
      icon: Search,
      score: data.seo.score,
      metrics: [
        { label: "Meta tags", value: "8/10" },
        { label: "Alt texts", value: "95%" },
        { label: "Structure", value: "Valide" },
        { label: "Robots.txt", value: "OK" },
      ],
      diagnostics: [
        { type: "warning", message: "Meta description manquante" },
        { type: "success", message: "Structure des titres correcte" },
      ],
    },
    {
      id: "security",
      title: "Sécurité",
      icon: Lock,
      score: data.security.https ? 100 : 0,
      metrics: [
        { label: "HTTPS", value: data.security.https ? "Actif" : "Inactif" },
        { label: "SSL/TLS", value: "v1.3" },
        { label: "Headers", value: "6/7" },
        { label: "Vulnérabilités", value: "0" },
      ],
      diagnostics: [
        { type: "success", message: "Certificat SSL valide" },
        { type: "warning", message: "Header CSP manquant" },
      ],
    },
    {
      id: "bestPractices",
      title: "Bonnes Pratiques",
      icon: CheckCircle,
      score: data.bestPractices.score,
      metrics: [
        { label: "Doctype", value: "HTML5" },
        { label: "Encoding", value: "UTF-8" },
        { label: "JS errors", value: "None" },
        { label: "Console", value: "Clean" },
      ],
      diagnostics: [
        { type: "success", message: "Code HTML valide" },
        { type: "warning", message: "Attributs ARIA manquants" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 p-4 bg-[#1a1b1e] rounded-xl border border-[#2a2b2e]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {data.url}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Analysé le {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-sm text-white bg-[#2a2b2e] rounded-lg hover:bg-orion-nebula transition-colors">
              Réanalyser
            </button>
            <button className="px-4 py-2 text-sm text-orion-nebula border border-orion-nebula rounded-lg hover:bg-orion-nebula hover:text-white transition-colors">
              Exporter PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boxes.map((box) => (
          <BentoBox
            key={box.id}
            {...box}
            isSelected={selectedBox === box.id}
            onClick={() => setSelectedBox(box.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyzeResult;
