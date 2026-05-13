import { create } from 'zustand';

interface UIState {
  // Loading states
  isInitialLoad: boolean;
  showHero: boolean;
  showWeather: boolean;
  showForecast: boolean;
  showCityIntel: boolean;

  // Narration
  narration: string;
  narrationSource: string;
  isNarrationLoading: boolean;

  // Actions
  setInitialLoad: (val: boolean) => void;
  revealSections: () => void;
  setNarration: (text: string, source: string) => void;
  setNarrationLoading: (val: boolean) => void;
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isInitialLoad: true,
  showHero: false,
  showWeather: false,
  showForecast: false,
  showCityIntel: false,
  narration: '',
  narrationSource: 'template',
  isNarrationLoading: false,

  setInitialLoad: (val) => set({ isInitialLoad: val }),

  revealSections: () => {
    // Staggered reveal
    set({ showHero: true });
    setTimeout(() => set({ showWeather: true }), 600);
    setTimeout(() => set({ showForecast: true }), 900);
    setTimeout(() => set({ showCityIntel: true }), 1200);
  },

  setNarration: (text, source) => set({ narration: text, narrationSource: source, isNarrationLoading: false }),
  setNarrationLoading: (val) => set({ isNarrationLoading: val }),

  resetUI: () =>
    set({
      showHero: false,
      showWeather: false,
      showForecast: false,
      showCityIntel: false,
      narration: '',
      narrationSource: 'template',
      isNarrationLoading: false,
    }),
}));
