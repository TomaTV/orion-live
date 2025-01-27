import React from "react";
import { ExternalLink, Download } from "lucide-react";
import { exportPerformanceReport } from "@/components/app/analyze/utils/exportPDF";

const Header = ({ data, onReanalyze }) => {
  return (
    <div className="mb-8 p-4 bg-[#1a1b1e] rounded-xl border border-[#2a2b2e]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orion-nebula hover:text-orion-nebula/80 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <div>
            <h2 className="text-lg font-medium text-white">{data.url}</h2>
            <p className="text-sm text-gray-500">
              Analysé le {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onReanalyze}
            className="px-4 py-2 text-sm text-white bg-orion-nebula rounded-lg hover:bg-orion-nebula/90 transition-colors"
          >
            <span>Réanalyser</span>
          </button>
          <button
            onClick={() => exportPerformanceReport(data)}
            className="px-4 py-2 text-sm text-orion-nebula border border-orion-nebula rounded-lg hover:bg-orion-nebula hover:text-white transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
