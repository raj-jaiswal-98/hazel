/** Weather condition categories derived from WMO weather codes */
export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'snow'
  | 'storm'
  | 'fog'
  | 'dust';

/** Time of day periods for atmospheric theming */
export type TimeOfDay =
  | 'dawn'
  | 'morning'
  | 'afternoon'
  | 'golden'
  | 'dusk'
  | 'night';

/** Current weather snapshot from Open-Meteo */
export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  cloudCover: number;
  isDay: boolean;
  weatherCode: number;
  condition: WeatherCondition;
}

/** Daily forecast entry */
export interface DailyForecast {
  date: string;
  weatherCode: number;
  condition: WeatherCondition;
  tempMax: number;
  tempMin: number;
  precipProbability: number;
  sunrise: string;
  sunset: string;
}

/** Sunrise/sunset times */
export interface SunTimes {
  sunrise: string;
  sunset: string;
}

/** AQI data from OpenAQ */
export interface AQIData {
  value: number;
  category: AQICategory;
  color: string;
  station: string;
}

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

/** WMO weather code to condition mapping */
export function weatherCodeToCondition(code: number, isDay: boolean): WeatherCondition {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 66 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'storm';
  if (!isDay && code === 0) return 'clear';
  return 'cloudy';
}

/** WMO weather code to human-readable label */
export function weatherCodeToLabel(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return map[code] ?? 'Unknown';
}

/** WMO weather code to emoji */
export function weatherCodeToIcon(code: number, isDay: boolean = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code >= 1 && code <= 2) return isDay ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 56 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}
