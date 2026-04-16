/**
 * Serper.dev Search Utility
 * Performance: Ultra-fast real-time web indexing for 2026 insights.
 */

export type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

export async function searchWeb(query: string, limit: number = 5): Promise<SearchResult[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) {
    console.warn('[Serper] API Key missing, skipping search.');
    return [];
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: limit }),
    });

    if (!response.ok) throw new Error(`Serper failed: ${response.statusText}`);

    const data = await response.json();
    
    // Sort and format organic results
    const results = (data.organic || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    return results;
  } catch (error) {
    console.error('[Serper] Search error:', error);
    return [];
  }
}
