import { API } from '../utils/constants';

/** Unsplash image result */
export interface UnsplashImage {
  url: string;
  thumbUrl: string;
  altDescription: string;
  photographer: string;
  photographerUrl: string;
}

/** Raw Unsplash API response */
interface UnsplashSearchResponse {
  results: Array<{
    urls: { regular: string; small: string };
    alt_description: string | null;
    user: { name: string; links: { html: string } };
  }>;
}

/** Fetch a city background image from Unsplash */
export async function fetchCityImage(
  cityName: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<UnsplashImage | null> {
  if (!apiKey) return null;

  try {
    const query = `${cityName} cityscape`;
    const url = `${API.UNSPLASH}/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`;

    console.log(`[Unsplash] Attempting to fetch image for: ${cityName}...`);

    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${apiKey}` },
      signal,
    });

    if (!response.ok) {
      console.error(`[Unsplash] Connection failed. Status: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: UnsplashSearchResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn(`[Unsplash] Connected, but no images found for: ${cityName}`);
      return null;
    }

    const photo = data.results[0];
    console.log(`[Unsplash] Connection successful. Fetched image by: ${photo.user.name}`);
    
    return {
      url: photo.urls.regular,
      thumbUrl: photo.urls.small,
      altDescription: photo.alt_description ?? `${cityName} cityscape`,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null;
    console.error('[Unsplash] Connection error:', error);
    return null;
  }
}
