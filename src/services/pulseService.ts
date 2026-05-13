export interface PulseEvent {
  year: number;
  text: string;
  type: 'event' | 'birth' | 'death' | 'news';
}

/** 
 * Fetch 'On This Day' events from Wikipedia.
 * While Wikipedia doesn't have a direct 'per-city' feed, we can filter 
 * historical events that mention the city name to create a 'Local History' feel.
 */
/** 
 * Fetch 'In The News' and 'On This Day' events from Wikipedia.
 */
export async function fetchCityPulse(cityName: string): Promise<PulseEvent[]> {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // 1. Fetch 'In The News' (Featured Feed)
    const featuredResp = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`);
    const featuredData = await featuredResp.json();
    const newsItems = (featuredData.news || []).map((n: any) => ({
      year: year,
      text: n.story.replace(/<[^>]*>?/gm, ''), // Strip HTML
      type: 'news' as const
    }));

    // 2. Fetch 'On This Day'
    const onThisDayResp = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
    const onThisDayData = await onThisDayResp.json();
    const historyItems = (onThisDayData.events || []).map((e: any) => ({
      year: e.year,
      text: e.text,
      type: 'event' as const
    }));

    // Combine and Filter
    const all = [...newsItems, ...historyItems];
    
    // Prioritize news/history that mentions the city
    const local = all.filter(item => 
      item.text.toLowerCase().includes(cityName.toLowerCase())
    );

    // If no local found, just show a mix of world news and history
    if (local.length === 0) {
      return [...newsItems.slice(0, 2), ...historyItems.slice(0, 3)];
    }

    return local.slice(0, 5);
  } catch (error) {
    console.error('[Pulse Service] Failed to fetch city pulse:', error);
    return [];
  }
}
