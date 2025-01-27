import React from "react";
import { Gauge, X } from "lucide-react";
import MetricCard from "@/components/app/analyze/components/MetricCard";
import {
  getMetricType,
  getPerformanceRecommendations,
} from "@/components/app/analyze/utils/performanceUtils";

const PerformanceModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const recommendations = getPerformanceRecommendations(
    data.performance.metrics
  );

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1b1e] w-full max-w-4xl rounded-xl shadow-2xl border border-[#2a2b2e] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 sticky top-0 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-semibold text-white">Performance</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2b2e] rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Core Web Vitals */}
          <div>
            <h4 className="text-white font-medium mb-4">Core Web Vitals</h4>
            <div className="grid gap-4">
              {Object.entries(data.performance.metrics).map(([key, value]) => (
                <MetricCard
                  key={key}
                  title={`${key}`}
                  value={value}
                  type={getMetricType(key, value)}
                  description={
                    key === "FCP"
                      ? "Premier affichage de contenu"
                      : key === "LCP"
                        ? "Chargement de l'élément principal"
                        : key === "TBT"
                          ? "Temps de blocage total"
                          : "Stabilité visuelle"
                  }
                />
              ))}
            </div>
          </div>

          {/* Recommandations */}
          <div>
            <h4 className="text-white font-medium mb-4">Recommandations</h4>
            <div className="grid gap-4">
              {recommendations.map((rec, index) => (
                <MetricCard
                  key={index}
                  title={rec.title}
                  description={rec.description}
                  type={rec.type}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal;
