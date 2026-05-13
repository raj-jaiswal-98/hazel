import { create } from 'zustand';
import type { City, GeocodingResult } from '../types/city';
import type { UnsplashImage } from '../services/imageService';
import { normalizeGeocodingResult } from '../types/city';
import { searchCities } from '../services/geocodingService';
import { fetchCityImage } from '../services/imageService';
import { STORAGE_KEYS } from '../utils/constants';

interface CityState {
  // Search state
  query: string;
  suggestions: GeocodingResult[];
  isSearching: boolean;
  searchError: string | null;

  // Selected city
  selectedCity: City | null;
  cityImage: UnsplashImage | null;
  isImageLoading: boolean;
  searchHistory: City[];

  // Actions
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  selectCity: (result: GeocodingResult) => void;
  fetchImage: (cityName: string, apiKey: string) => Promise<void>;
  clearSearch: () => void;
  clearSelection: () => void;
}

export const useCityStore = create<CityState>((set, get) => ({
  query: '',
  suggestions: [],
  isSearching: false,
  searchError: null,
  selectedCity: loadLastCity(),
  cityImage: null,
  isImageLoading: false,
  searchHistory: [],

  setQuery: (query) => set({ query }),

  search: async (query) => {
    if (query.trim().length < 2) {
      set({ suggestions: [], isSearching: false });
      return;
    }

    set({ isSearching: true, searchError: null });

    try {
      const results = await searchCities(query);
      set({ suggestions: results, isSearching: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      set({
        searchError: 'Failed to search cities',
        isSearching: false,
        suggestions: [],
      });
    }
  },

  selectCity: (result) => {
    const city = normalizeGeocodingResult(result);
    const history = get().searchHistory;

    // Add to history (avoid duplicates, max 10)
    const newHistory = [city, ...history.filter((c) => c.id !== city.id)].slice(0, 10);

    set({
      selectedCity: city,
      cityImage: null, // Clear old image
      searchHistory: newHistory,
      query: '',
      suggestions: [],
      isSearching: false,
    });

    // Persist last city
    saveLastCity(city);
  },

  fetchImage: async (cityName, apiKey) => {
    if (!apiKey) return;
    set({ isImageLoading: true });
    try {
      const image = await fetchCityImage(cityName, apiKey);
      set({ cityImage: image, isImageLoading: false });
    } catch {
      set({ isImageLoading: false });
    }
  },

  clearSearch: () => set({ query: '', suggestions: [], isSearching: false, searchError: null }),

  clearSelection: () => set({ selectedCity: null, cityImage: null }),
}));

/** Load last selected city from localStorage */
function loadLastCity(): City | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_CITY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/** Save selected city to localStorage */
function saveLastCity(city: City): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, JSON.stringify(city));
  } catch {
    // Silently fail
  }
}
