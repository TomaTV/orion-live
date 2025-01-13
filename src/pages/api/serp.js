export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mainDomain = new URL(url).hostname;
    // Extraire les parties significatives du domaine
    const domainParts = mainDomain
      .replace('www.', '')
      .split('.')
      .slice(0, -1)[0]  // Prendre la première partie avant le TLD
      .split('-')       // Séparer les mots avec tirets
      .map(part => part.toLowerCase());

    // Construire la requête pour trouver des sites similaires en excluant le domaine actuel
    const searchQuery = encodeURIComponent(`"web agency" OR "studio créatif" OR "agence web" OR "web development" -site:${mainDomain}`);
    const apiUrl = `https://serpapi.com/search.json?engine=google&q=${searchQuery}&api_key=${process.env.SERP_API_KEY}&num=15&gl=fr`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Filtrer et formater les résultats
    const competitors = data.organic_results 
      ? data.organic_results
          .filter(result => {
            try {
              const resultDomain = new URL(result.link).hostname.toLowerCase();
              const resultTitle = result.title.toLowerCase();
              const resultSnippet = result.snippet ? result.snippet.toLowerCase() : '';

              // Vérifier qu'aucune partie du nom de domaine principal n'apparaît
              return !domainParts.some(part => 
                resultDomain.includes(part) || 
                resultTitle.includes(part) || 
                resultSnippet.includes(part)
              );
            } catch (e) {
              return false;
            }
          })
          .slice(0, 5)  // Prendre les 5 premiers résultats valides
          .map((result, index) => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet || '',
            position: index + 1
          }))
      : [];

    res.status(200).json(competitors);
  } catch (error) {
    console.error('SERP API error:', error);
    res.status(500).json({ error: error.message });
  }
}