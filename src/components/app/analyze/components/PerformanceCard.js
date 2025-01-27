import React from "react";
import { Gauge } from "lucide-react";
import ScoreCircle from "@/components/app/analyze/components/ScoreCircle";

const PerformanceCard = ({ score, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1a1b1e] rounded-xl p-6 cursor-pointer transition-all duration-300
                border border-emerald-500/20 hover:border-emerald-500 group"
    >
      <div className="flex flex-col items-center gap-4">
        <Gauge className="w-6 h-6 text-emerald-500" />
        <ScoreCircle percentage={score} />
        <h3 className="text-lg font-semibold text-white">Performance</h3>
      </div>
    </div>
  );
};

export default PerformanceCard;
