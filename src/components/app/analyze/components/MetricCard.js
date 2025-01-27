import React from "react";

const MetricCard = ({
  title,
  value,
  type = "neutral",
  description,
  icon: Icon,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
      case "warning":
        return "bg-orange-500/10 border-orange-500/20 text-orange-500";
      case "error":
        return "bg-red-500/10 border-red-500/20 text-red-500";
      case "info":
        return "bg-blue-500/10 border-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <div className="font-medium">{title}</div>
          </div>
          {description && (
            <p className="text-sm mt-1 opacity-80">{description}</p>
          )}
        </div>
        {value && <div className="text-lg font-semibold">{value}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
