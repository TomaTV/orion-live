import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

// ... [garder les mêmes fonctions de validation]

export default function SearchBar({ onAnalyzeComplete }) {
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const searchQuery = router.query.search;
    if (searchQuery) setSearch(searchQuery);
  }, [router.query.search]);

  const handleAnalyze = async () => {
    const validation = validateUrl(search);
    if (!validation.isValid) {
      setAnalyzeError(validation.error);
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      router.push(`/app?search=${encodeURIComponent(validation.url)}`, undefined, { shallow: true });
      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validation.url })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'analyse");
      onAnalyzeComplete?.(data);
    } catch (error) {
      setAnalyzeError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative bg-[#1a1b1e] rounded-xl p-1.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setAnalyzeError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              disabled={isAnalyzing}
              placeholder="Entrez une URL à analyser (ex: google.com)"
              className="w-full h-12 bg-[#2a2b2e] rounded-lg pl-12 pr-4 text-gray-100 placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-orion-nebula transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 text-orion-nebula animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !search.trim()}
            className="h-12 px-8 bg-orion-nebula hover:bg-orion-nebula/90 text-white rounded-lg font-medium
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-orion-nebula/20"
          >
            {isAnalyzing ? 'Analyse...' : 'Analyser'}
          </button>
        </div>
        {analyzeError && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <p className="text-sm text-red-500 bg-red-500/10 py-1 px-4 rounded-lg inline-block">
              {analyzeError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
