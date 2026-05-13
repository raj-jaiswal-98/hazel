import type { NarrationProvider } from '../types/settings';
import { generateOpenAINarration } from './providers/openaiProvider';
import { generateGeminiNarration } from './providers/geminiProvider';
import { generateTemplateNarration } from './providers/templateProvider';

/** Input data for narration generation */
export interface NarrationInput {
  city: string;
  country: string;
  weather: string;
  temp: number;
  timeOfDay: string;
  humidity: number;
  windSpeed: number;
}

/**
 * Generate a cinematic narration using the selected provider
 * Falls back to template if API call fails
 */
export async function generateNarration(
  input: NarrationInput,
  provider: NarrationProvider,
  apiKey: string
): Promise<string> {
  try {
    switch (provider) {
      case 'openai':
        if (!apiKey) return generateTemplateNarration(input);
        return await generateOpenAINarration(input, apiKey);

      case 'gemini':
        if (!apiKey) return generateTemplateNarration(input);
        return await generateGeminiNarration(input, apiKey);

      case 'template':
      default:
        return generateTemplateNarration(input);
    }
  } catch {
    // Fallback to template on any error
    return generateTemplateNarration(input);
  }
}
