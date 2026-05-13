import { API } from '../utils/constants';
import type { CityIntelligence } from '../types/city';

/** Raw Wikipedia summary response */
interface WikipediaSummaryResponse {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

/** Fetch city summary from Wikipedia */
export async function fetchCitySummary(
  cityName: string,
  signal?: AbortSignal
): Promise<CityIntelligence | null> {
  try {
    const url = `${API.WIKIPEDIA}/${encodeURIComponent(cityName)}`;

    const response = await fetch(url, { signal });

    if (!response.ok) return null;

    const data: WikipediaSummaryResponse = await response.json();

    // Extract first 2-3 sentences
    const sentences = data.extract.match(/[^.!?]+[.!?]+/g) ?? [];
    const summary = sentences.slice(0, 3).join(' ').trim();

    return {
      summary: summary || data.extract.slice(0, 300),
      description: data.description,
      thumbnailUrl: data.thumbnail?.source,
      vibeTags: [],    // Filled by vibe generator
      landmarks: [],   // Filled by city intel component
    };
  } catch {
    return null;
  }
}
