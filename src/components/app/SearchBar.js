import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Results from "@/components/app/Result";

export default function SearchBar() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [strategy, setStrategy] = useState("mobile");

  const isValidUrl = (value) => {
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`);
      return true;
    } catch {
      return false;
    }
  };

  const analyzeUrl = async () => {
    if (!url) {
      setError("Veuillez entrer une URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Veuillez entrer une URL valide (ex: example.com)");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          placeholder="Entrez l'URL de votre site (ex: example.com)"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
        >
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <button
          onClick={analyzeUrl}
          disabled={!url || isLoading}
          className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 text-white ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              Analyser
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Résultats */}
      {results && !error && <Results results={results} />}
    </div>
  );
}
