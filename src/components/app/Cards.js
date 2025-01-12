const getStatus = (score) => {
  if (score >= 90)
    return { text: "Excellent", color: "text-green-600 bg-green-100" };
  if (score >= 50)
    return { text: "À améliorer", color: "text-yellow-600 bg-yellow-100" };
  return { text: "À corriger", color: "text-red-600 bg-red-100" };
};

export function ScoreCard({ label, score }) {
  const status = getStatus(score);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-2">
        <h3 className="font-medium text-gray-700">{label}</h3>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-bold text-gray-900">{score}%</span>
        <span
          className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${status.color}`}
        >
          {status.text}
        </span>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, description, type = "default" }) {
  const displayValue = value || "0";

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-2">
        <h3 className="font-medium text-gray-700">{label}</h3>
      </div>
      <div className="flex items-baseline mt-2">
        <span className="text-2xl font-bold text-gray-900">{displayValue}</span>
        {type === "default" && value && (
          <span className="ml-1 text-gray-500"> s</span>
        )}
        {type === "cls" && <span className="ml-1 text-gray-500">unités</span>}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

export function IssueCard({ issue }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-medium text-gray-900 mb-2">{issue.title}</h3>
      {issue.description && (
        <p className="text-gray-600 mb-4">{issue.description}</p>
      )}
      {issue.solution && (
        <div className="text-sm text-gray-500">{issue.solution}</div>
      )}
    </div>
  );
}
