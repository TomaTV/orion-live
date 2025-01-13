import { useState, useEffect } from 'react';
import { analyzeCompetitors } from '@/services/serpService';

export default function CompetitorAnalysis({ url }) {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitors = async () => {
      if (!url) return;
      
      setLoading(true);
      setError(null);
      try {
        const results = await analyzeCompetitors(url);
        setCompetitors(results);
      } catch (err) {
        console.error('Error fetching competitors:', err);
        setError('Impossible de récupérer les données des concurrents');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitors();
  }, [url]);

  if (!url) return null;

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!competitors.length) return null;

  return (
    <div className="mt-4 bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Analyse des concurrents</h2>
        
        {/* Liste des concurrents */}
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div key={competitor.link} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <a 
                  href={competitor.link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {competitor.title}
                </a>
                <span className="text-sm text-gray-500 font-medium">
                  Position: {competitor.position}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{competitor.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
