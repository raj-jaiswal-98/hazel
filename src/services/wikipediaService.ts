import { API } from '../utils/constants';

/** Wikipedia Summary Interface */
export interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: string;
  content_urls?: {
    desktop: {
      page: string;
    };
  };
}

/** Fetch a brief summary of a city from Wikipedia */
export async function fetchWikiSummary(cityName: string): Promise<WikiSummary | null> {
  try {
    // Normalize city name for Wikipedia (e.g., 'New York' -> 'New_York')
    const normalizedName = encodeURIComponent(cityName.replace(/\s+/g, '_'));
    const response = await fetch(`${API.WIKIPEDIA}/${normalizedName}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      content_urls: data.content_urls
    };
  } catch (error) {
    console.error('[Wiki Service] Failed to fetch summary:', error);
    return null;
  }
}
