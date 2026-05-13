import { create } from 'zustand';
import type { CurrentWeather, DailyForecast, AQIData } from '../types/weather';
import { fetchWeather } from '../services/weatherService';
import { fetchAQI } from '../services/aqiService';

interface WeatherState {
  // Data
  current: CurrentWeather | null;
  daily: DailyForecast[];
  aqi: AQIData | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWeatherData: (lat: number, lon: number, aqiKey?: string) => Promise<void>;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  current: null,
  daily: [],
  aqi: null,
  isLoading: false,
  error: null,

  fetchWeatherData: async (lat, lon, aqiKey) => {
    set({ isLoading: true, error: null });

    try {
      // Fetch weather and AQI in parallel
      const [weatherData, aqiData] = await Promise.all([
        fetchWeather(lat, lon),
        aqiKey ? fetchAQI(lat, lon, aqiKey) : Promise.resolve(null),
      ]);

      set({
        current: weatherData.current,
        daily: weatherData.daily,
        aqi: aqiData,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch weather',
        isLoading: false,
      });
    }
  },

  clearWeather: () => set({ current: null, daily: [], aqi: null, error: null }),
}));
