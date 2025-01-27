import React, { useState } from "react";
import Header from "@/components/app/analyze/components/Header";
import PerformanceCard from "@/components/app/analyze/components/PerformanceCard";
import PerformanceModal from "@/components/app/analyze/components/PerformanceModal";

const AnalyzeResult = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  const handleReanalyze = () => {
    // Implémentation à venir
    console.log("Reanalyze clicked");
  };

  return (
    <div className="container mx-auto px-4">
      <Header data={data} onReanalyze={handleReanalyze} />

      <div className="grid grid-cols-1 gap-6">
        <PerformanceCard
          score={data.performance.score}
          onClick={() => setShowModal(true)}
        />
      </div>

      <PerformanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />
    </div>
  );
};

export default AnalyzeResult;
