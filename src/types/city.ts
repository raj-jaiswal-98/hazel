/** City result from geocoding API */
export interface City {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
  elevation?: number;
  admin1?: string; // State/Province
}

/** Geocoding search result from Open-Meteo */
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  country: string;
  timezone: string;
  population?: number;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

/** Normalize geocoding result to City */
export function normalizeGeocodingResult(result: GeocodingResult): City {
  return {
    id: result.id,
    name: result.name,
    country: result.country,
    countryCode: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    population: result.population,
    elevation: result.elevation,
    admin1: result.admin1,
  };
}

/** City intelligence data from Wikipedia */
export interface CityIntelligence {
  summary: string;
  description?: string;
  thumbnailUrl?: string;
  vibeTags: string[];
  landmarks: Array<{
    name: string;
    lat: number;
    lon: number;
    type: string;
  }>;
  facts: string[];
}

/** Country code to flag emoji */
export function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}
