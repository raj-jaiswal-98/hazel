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

/** Load settings from localStorage with Env fallback */
function loadSettings(): AppSettings {
  // 1. Get defaults from Env
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY ?? '';
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  
  let defaultProvider: NarrationProvider = 'template';
  if (geminiKey) defaultProvider = 'gemini';
  else if (openaiKey) defaultProvider = 'openai';

  const baseSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    openaiApiKey: openaiKey,
    geminiApiKey: geminiKey,
    unsplashApiKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? '',
    openaqApiKey: import.meta.env.VITE_OPENAQ_API_KEY ?? '',
    narrationProvider: defaultProvider,
  };

  // 2. Override with LocalStorage if exists, but don't overwrite valid env keys with empty strings
  let finalSettings = { ...baseSettings };
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Merge carefully
      finalSettings = {
        ...baseSettings,
        ...parsed,
        // Re-apply Env keys if they are missing in stored or stored is empty
        openaiApiKey: parsed.openaiApiKey || baseSettings.openaiApiKey,
        geminiApiKey: parsed.geminiApiKey || baseSettings.geminiApiKey,
        unsplashApiKey: parsed.unsplashApiKey || baseSettings.unsplashApiKey,
        openaqApiKey: parsed.openaqApiKey || baseSettings.openaqApiKey,
        // Only use stored provider if it's not template OR if we don't have an env default
        narrationProvider: (parsed.narrationProvider !== 'template' ? parsed.narrationProvider : baseSettings.narrationProvider) || 'template',
      };
    }
  } catch {
    // Fallback to base
  }

  console.log('[Bloom] Final Settings State:', {
    provider: finalSettings.narrationProvider,
    hasOpenAI: !!finalSettings.openaiApiKey,
    hasGemini: !!finalSettings.geminiApiKey,
    envGemini: !!geminiKey
  });

  return finalSettings;
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
