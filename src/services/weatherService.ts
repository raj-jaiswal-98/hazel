import { API } from '../utils/constants';
import type { CurrentWeather, DailyForecast } from '../types/weather';
import { weatherCodeToCondition } from '../types/weather';

/** Raw current weather response from Open-Meteo */
interface CurrentWeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    uv_index: number;
    cloud_cover: number;
    is_day: number;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    time: string[];
  };
}

/** Fetch current weather and daily forecast for coordinates */
export async function fetchWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<{ current: CurrentWeather; daily: DailyForecast[] }> {
  const url = `${API.OPEN_METEO_WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index,cloud_cover,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=5`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: CurrentWeatherResponse = await response.json();
  const isDay = data.current.is_day === 1;

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    uvIndex: data.current.uv_index,
    cloudCover: data.current.cloud_cover,
    isDay,
    weatherCode: data.current.weather_code,
    condition: weatherCodeToCondition(data.current.weather_code, isDay),
  };

  const daily: DailyForecast[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    condition: weatherCodeToCondition(data.daily.weather_code[i], true),
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipProbability: data.daily.precipitation_probability_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  return { current, daily };
}
