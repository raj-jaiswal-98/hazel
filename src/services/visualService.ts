/**
 * Visual & Intelligence Scraper Service
 * Uses a CORS proxy to fetch and parse data from various sources.
 */

export interface CityVisual {
  url: string;
  source: string;
  description: string;
}

/**
 * Fetch scenic visuals for a city (simulated/enhanced imagery search)
 */
export async function fetchScenicVisuals(cityName: string): Promise<CityVisual[]> {
  try {
    // In a real scenario, we might scrape a specific travel site.
    // Here we'll use a public search to find scenic images.
    // For this implementation, we'll leverage the Unsplash API as a reliable source
    // but we could also use a CORS proxy to scrape sites like Pexels if needed.
    
    // Simulating a scrape of a scenic visual collection
    const query = encodeURIComponent(`${cityName} cinematic landscape atmospheric`);
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://www.bing.com/images/search?q=${query}&form=HDRSC2`)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) return [];

    // This is a simplified "scraping" demonstration.
    // In a real app, you'd parse the HTML (data.contents) to find image tags.
    // For now, we'll return a message indicating the source found.
    
    return [
      {
        url: '', // Would be parsed from HTML
        source: 'Bing Visuals (Scraped)',
        description: `Cinematic views of ${cityName}`
      }
    ];
  } catch (error) {
    console.error('[Visual Service] Scrape failed:', error);
    return [];
  }
}

/**
 * Scrape "Did you know?" facts for a city from Wikipedia
 */
export async function scrapeCityFacts(cityName: string): Promise<string[]> {
  try {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Proxy failed');

    const html = await response.text();
    
    if (!html) return [];
    
    // Very basic regex scraping to find interesting snippets
    // We look for the first few paragraphs and extract sentences containing "first", "oldest", "famous", or "largest"
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = Array.from(doc.querySelectorAll('p')).slice(0, 10);
    
    const facts: string[] = [];
    const keywords = ['first', 'oldest', 'famous', 'largest', 'known for', 'capital'];
    
    for (const p of paragraphs) {
      const text = p.textContent || '';
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (keywords.some(k => sentence.toLowerCase().includes(k)) && sentence.length > 30 && sentence.length < 150) {
          facts.push(sentence.trim() + '.');
        }
      }
    }
    
    return [...new Set(facts)].slice(0, 3);
  } catch (error) {
    console.error('[Fact Scraper] Failed:', error);
    return [];
  }
}
