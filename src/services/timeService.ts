import { API } from '../utils/constants';

/** Raw WorldTime response */
interface WorldTimeResponse {
  datetime: string;
  timezone: string;
  utc_offset: string;
  abbreviation: string;
}

/** Time data for a city */
export interface CityTime {
  datetime: string;
  timezone: string;
  utcOffset: string;
  abbreviation: string;
}

/** Fetch local time for a timezone */
export async function fetchLocalTime(
  timezone: string,
  signal?: AbortSignal
): Promise<CityTime | null> {
  try {
    const url = `${API.WORLDTIME}/${encodeURIComponent(timezone)}`;
    const response = await fetch(url, { signal });

    if (!response.ok) return null;

    const data: WorldTimeResponse = await response.json();

    return {
      datetime: data.datetime,
      timezone: data.timezone,
      utcOffset: data.utc_offset,
      abbreviation: data.abbreviation,
    };
  } catch {
    return null;
  }
}

/** Get current hour in a timezone (fallback using Intl) */
export function getLocalHour(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(formatter.format(now), 10);
  } catch {
    return new Date().getHours();
  }
}

/** Get formatted local time string for a timezone */
export function getLocalTimeString(timezone: string): string {
  try {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
