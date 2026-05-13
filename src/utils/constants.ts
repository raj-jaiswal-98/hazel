/** Application-wide constants */

/** API base URLs */
export const API = {
  OPEN_METEO_WEATHER: 'https://api.open-meteo.com/v1/forecast',
  OPEN_METEO_GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
  OPENAQ: 'https://api.openaq.org/v3/locations',
  UNSPLASH: 'https://api.unsplash.com',
  WIKIPEDIA: 'https://en.wikipedia.org/api/rest_v1/page/summary',
  WORLDTIME: 'https://worldtimeapi.org/api/timezone',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
} as const;

/** Timing constants */
export const TIMING = {
  DEBOUNCE_SEARCH: 300,
  MIN_SEARCH_CHARS: 2,
  MAX_SUGGESTIONS: 8,
  CLOCK_INTERVAL: 1000,
  NARRATION_REFRESH: 10 * 60 * 1000, // 10 minutes
  CURSOR_IDLE_TIMEOUT: 3000,
  EFFECT_CROSSFADE: 2000,
} as const;

/** Canvas constants */
export const CANVAS = {
  MAX_PARTICLES: 500,
  TARGET_FPS: 60,
  BUDDY_SIZE: 20,
  BUDDY_GLOW_OUTER: 60,
  BUDDY_GLOW_MID: 40,
} as const;

/** Placeholder phrases for the omnibox */
export const OMNIBOX_PLACEHOLDERS = [
  'Search a city to feel its atmosphere...',
  'Where does the rain fall tonight?',
  'Discover Tokyo after midnight...',
  'What does Barcelona feel like today?',
  'Find the city that matches your mood...',
  'Where is the sun setting right now?',
  'Explore the world, one city at a time...',
] as const;

/** localStorage keys */
export const STORAGE_KEYS = {
  SETTINGS: 'bloom-settings',
  LAST_CITY: 'bloom-last-city',
  NARRATION_CACHE: 'bloom-narration-cache',
} as const;
