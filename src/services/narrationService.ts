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

/** Result of narration generation */
export interface NarrationResult {
  text: string;
  source: NarrationProvider;
}

let isProcessing = false;

/**
 * Generate a cinematic narration using the selected provider
 * Falls back to template if API call fails
 */
export async function generateNarration(
  input: NarrationInput,
  provider: NarrationProvider,
  apiKey: string
): Promise<NarrationResult> {
  if (isProcessing) {
    console.warn('[Narration Service] Generation already in progress. Blocking concurrent request.');
    return { text: '', source: 'template' };
  }

  isProcessing = true;
  console.log(`[Narration Service] Attempting ${provider} generation...`);

  try {
    let result: NarrationResult;

    switch (provider) {
      case 'openai':
        if (!apiKey) {
          console.warn('[Narration Service] No OpenAI key, falling back to template.');
          result = { text: generateTemplateNarration(input), source: 'template' };
        } else {
          result = { text: await generateOpenAINarration(input, apiKey), source: 'openai' };
        }
        break;

      case 'gemini':
        if (!apiKey) {
          console.warn('[Narration Service] No Gemini key, falling back to template.');
          result = { text: generateTemplateNarration(input), source: 'template' };
        } else {
          result = { text: await generateGeminiNarration(input, apiKey), source: 'gemini' };
        }
        break;

      case 'template':
      default:
        result = { text: generateTemplateNarration(input), source: 'template' };
        break;
    }
    
    return result;
  } catch (error) {
    console.error(`[Narration Service] ${provider} failed, falling back to template:`, error);
    return { text: generateTemplateNarration(input), source: 'template' };
  } finally {
    // Add a 3-second cooling period to prevent quota spamming
    setTimeout(() => {
      isProcessing = false;
      console.log('[Narration Service] Cooldown complete. Ready for next request.');
    }, 3000);
  }
}
