import React from 'react';

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
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className="text-3xl font-bold"
          style={{ color: getColor(percentage) }}
        >
          {percentage}
        </span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreCircle;