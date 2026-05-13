/**
 * Landmark Service
 * Fetches Points of Interest (POIs) from OpenStreetMap using the Overpass API.
 */

export interface Landmark {
  id: number;
  name: string;
  type: string;
  lat: number;
  lon: number;
}

/**
 * Fetch top landmarks for a given city and coordinates
 */
export async function fetchCityLandmarks(
  lat: number,
  lon: number,
  radius: number = 5000, // 5km radius
  limit: number = 10
): Promise<Landmark[]> {
  try {
    // Overpass QL query: find tourism attractions and historic landmarks
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"attraction|museum|viewpoint"](around:${radius},${lat},${lon});
        node["historic"~"landmark|monument|castle"](around:${radius},${lat},${lon});
        way["tourism"~"attraction|museum|viewpoint"](around:${radius},${lat},${lon});
        way["historic"~"landmark|monument|castle"](around:${radius},${lat},${lon});
      );
      out center;
      out ${limit};
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Overpass API failed');

    const data = await response.json();
    
    if (!data.elements) return [];

    return data.elements
      .filter((el: any) => el.tags && el.tags.name) // Ensure it has a name
      .map((el: any) => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.tourism || el.tags.historic || 'landmark',
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
      }))
      .slice(0, limit);
  } catch (error) {
    console.error('[Landmark Service] Error:', error);
    return [];
  }
}
