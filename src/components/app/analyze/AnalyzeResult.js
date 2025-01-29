import React, { useState } from "react";
import Header from "@/components/app/analyze/components/Header";
import PerformanceCard from "@/components/app/analyze/components/Performance/PerformanceCard";
import PerformanceModal from "@/components/app/analyze/components/Performance/PerformanceModal";
import SEOCard from "@/components/app/analyze/components/SEO/SEOCard";
import SEOModal from "@/components/app/analyze/components/SEO/SEOModal";

const AnalyzeResult = ({ data }) => {
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showSEOModal, setShowSEOModal] = useState(false);

  // Ajout de vérifications pour gérer les données potentiellement incomplètes
  const performanceScore = data?.performance?.score ?? 0;
  const seoScore = data?.seo?.score ?? 0;

  const handleReanalyze = () => {
    console.log("Reanalyze clicked");
  };

  const handleSEOClick = () => {
    if (data?.seo) {
      setShowSEOModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Header data={data} onReanalyze={handleReanalyze} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerformanceCard
          score={performanceScore}
          onClick={() => setShowPerformanceModal(true)}
        />
        <SEOCard score={seoScore} onClick={handleSEOClick} />
      </div>

      <PerformanceModal
        isOpen={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        data={data}
      />

      {data?.seo && (
        <SEOModal
          isOpen={showSEOModal}
          onClose={() => setShowSEOModal(false)}
          data={data}
        />
      )}
    </div>
  );
};

export default AnalyzeResult;
