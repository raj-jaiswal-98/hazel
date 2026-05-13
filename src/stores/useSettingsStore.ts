import { create } from 'zustand';
import type { AppSettings, NarrationProvider, TemperatureUnit, AnimationQuality } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { STORAGE_KEYS } from '../utils/constants';

interface SettingsState extends AppSettings {
  // Actions
  setOpenAIKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  setUnsplashKey: (key: string) => void;
  setOpenAQKey: (key: string) => void;
  setNarrationProvider: (provider: NarrationProvider) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setAnimationQuality: (quality: AnimationQuality) => void;
  toggleSettingsPanel: () => void;
  resetSettings: () => void;
}

/** Load settings from localStorage */
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // Silently fail
  }

  // Try to load from env
  return {
    ...DEFAULT_SETTINGS,
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY ?? '',
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
    unsplashApiKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? '',
    openaqApiKey: import.meta.env.VITE_OPENAQ_API_KEY ?? '',
  };
}

/** Persist settings to localStorage */
function saveSettings(settings: Partial<AppSettings>): void {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...loadSettings(),

  setOpenAIKey: (key) => {
    set({ openaiApiKey: key });
    saveSettings({ openaiApiKey: key });
  },

  setGeminiKey: (key) => {
    set({ geminiApiKey: key });
    saveSettings({ geminiApiKey: key });
  },

  setUnsplashKey: (key) => {
    set({ unsplashApiKey: key });
    saveSettings({ unsplashApiKey: key });
  },

  setOpenAQKey: (key) => {
    set({ openaqApiKey: key });
    saveSettings({ openaqApiKey: key });
  },

  setNarrationProvider: (provider) => {
    set({ narrationProvider: provider });
    saveSettings({ narrationProvider: provider });
  },

  setTemperatureUnit: (unit) => {
    set({ temperatureUnit: unit });
    saveSettings({ temperatureUnit: unit });
  },

  setAnimationQuality: (quality) => {
    set({ animationQuality: quality });
    saveSettings({ animationQuality: quality });
  },

  toggleSettingsPanel: () =>
    set((state) => ({ settingsPanelOpen: !state.settingsPanelOpen })),

  resetSettings: () => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    set(DEFAULT_SETTINGS);
  },
}));
