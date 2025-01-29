import React from "react";
import { Search } from "lucide-react";
import ScoreCircle from "@/components/app/analyze/components/ScoreCircle";

const SEOCard = ({ score = 0, onClick }) => {
  // Ajout de vérification pour s'assurer que le score est un nombre
  const safeScore = typeof score === "number" ? score : 0;

  const getGradient = (score) => {
    if (score >= 90)
      return "from-emerald-500/10 via-emerald-500/5 to-transparent";
    if (score >= 50)
      return "from-orange-500/10 via-orange-500/5 to-transparent";
    return "from-red-500/10 via-red-500/5 to-transparent";
  };

  const getTextColor = (score) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getBorderColor = (score) => {
    if (score >= 90) return "border-emerald-500/20 hover:border-emerald-500";
    if (score >= 50) return "border-orange-500/20 hover:border-orange-500";
    return "border-red-500/20 hover:border-red-500";
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#1a1b1e] rounded-xl cursor-pointer overflow-hidden
                 border ${safeScore ? getBorderColor(safeScore) : "border-gray-500/20"} transition-all duration-500 group`}
    >
      {/* Fond avec gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getGradient(safeScore)} opacity-50`}
      />

      {/* Contenu */}
      <div className="relative p-8 flex flex-col items-center">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <Search className={`w-6 h-6 ${getTextColor(safeScore)}`} />
          <h3 className="text-xl font-semibold text-white">SEO Score</h3>
        </div>

        {/* Score */}
        <div className="transform group-hover:scale-105 transition-transform duration-500">
          <ScoreCircle percentage={safeScore} />
        </div>

        {/* Message de statut */}
        <div className={`mt-6 text-sm font-medium ${getTextColor(safeScore)}`}>
          {safeScore >= 90
            ? "Excellent"
            : safeScore >= 50
              ? "Nécessite des améliorations"
              : "Critique"}
        </div>

        {/* Indication d'action */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Cliquez pour plus de détails
        </div>
      </div>
    </div>
  );
};

export default SEOCard;
