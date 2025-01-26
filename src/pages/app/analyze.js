import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AnalyzeResult from '@/components/app/AnalyzeResult';

export default function AnalyzePage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (router.query.data) {
      try {
        const data = JSON.parse(router.query.data);
        setAnalysisData(data);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, [router.query.data]);

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orion-nebula"></div>
      </div>
    );
  }

  return <AnalyzeResult data={analysisData} />;
}