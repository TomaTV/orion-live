export async function analyzeCompetitors(url) {
  try {
    const response = await fetch(`/api/serp?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze competitors');
    }

    return data;
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    throw new Error('Failed to analyze competitors');
  }
}