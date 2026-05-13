import { API, TIMING } from '../utils/constants';
import type { GeocodingResult } from '../types/city';

/** Raw API response shape */
interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

/** Memory cache for geocoding results */
const cache = new Map<string, GeocodingResult[]>();

/**
 * Search for cities by name using Open-Meteo Geocoding API
 * @param query - City name to search for
 * @param signal - AbortSignal for cancellation
 * @returns Array of geocoding results
 */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<GeocodingResult[]> {
  const trimmed = query.trim().toLowerCase();

  if (trimmed.length < TIMING.MIN_SEARCH_CHARS) {
    return [];
  }

  // Check cache
  if (cache.has(trimmed)) {
    return cache.get(trimmed)!;
  }

  const url = `${API.OPEN_METEO_GEOCODING}?name=${encodeURIComponent(trimmed)}&count=${TIMING.MAX_SUGGESTIONS}&language=en&format=json`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data: GeocodingResponse = await response.json();
  const results = data.results ?? [];

  // Cache results
  cache.set(trimmed, results);

  return results;
}

/** Clear the geocoding cache */
export function clearGeocodingCache(): void {
  cache.clear();
}
