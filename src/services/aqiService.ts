import { API } from '../utils/constants';
import type { AQIData, AQICategory } from '../types/weather';

/** Raw OpenAQ response */
interface OpenAQResponse {
  results: Array<{
    name: string;
    sensors: Array<{
      parameter: { name: string };
      summary: { avg: number } | null;
    }>;
  }>;
}

/** Get AQI category from value */
function getAQICategory(value: number): { category: AQICategory; color: string } {
  if (value <= 50) return { category: 'Good', color: '#4ade80' };
  if (value <= 100) return { category: 'Moderate', color: '#facc15' };
  if (value <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#fb923c' };
  if (value <= 200) return { category: 'Unhealthy', color: '#f87171' };
  if (value <= 300) return { category: 'Very Unhealthy', color: '#a78bfa' };
  return { category: 'Hazardous', color: '#9f1239' };
}

/** Fetch AQI data for coordinates */
export async function fetchAQI(
  lat: number,
  lon: number,
  apiKey: string,
  signal?: AbortSignal
): Promise<AQIData | null> {
  if (!apiKey) return null;

  try {
    const url = `${API.OPENAQ}?coordinates=${lat},${lon}&radius=25000&limit=1`;

    const response = await fetch(url, {
      headers: { 'X-API-Key': apiKey },
      signal,
    });

    if (!response.ok) return null;

    const data: OpenAQResponse = await response.json();

    if (!data.results || data.results.length === 0) return null;

    const station = data.results[0];
    const pm25Sensor = station.sensors?.find(
      (s) => s.parameter?.name === 'pm25' || s.parameter?.name === 'pm2.5'
    );

    const value = pm25Sensor?.summary?.avg ?? 0;
    const { category, color } = getAQICategory(value);

    return {
      value: Math.round(value),
      category,
      color,
      station: station.name,
    };
  } catch {
    return null;
  }
}
