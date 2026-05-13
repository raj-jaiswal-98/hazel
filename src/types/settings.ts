/** AI narration provider options */
export type NarrationProvider = 'openai' | 'gemini' | 'template';

/** Temperature unit */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/** Animation quality setting */
export type AnimationQuality = 'full' | 'reduced';

/** Application settings stored in localStorage */
export interface AppSettings {
  // API Keys
  openaiApiKey: string;
  geminiApiKey: string;
  unsplashApiKey: string;
  openaqApiKey: string;

  // Preferences
  narrationProvider: NarrationProvider;
  temperatureUnit: TemperatureUnit;
  animationQuality: AnimationQuality;

  // UI State
  settingsPanelOpen: boolean;
}

/** Default settings */
export const DEFAULT_SETTINGS: AppSettings = {
  openaiApiKey: '',
  geminiApiKey: '',
  unsplashApiKey: '',
  openaqApiKey: '',
  narrationProvider: 'template',
  temperatureUnit: 'celsius',
  animationQuality: 'full',
  settingsPanelOpen: false,
};
