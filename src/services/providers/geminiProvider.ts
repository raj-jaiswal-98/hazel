import { API } from '../../utils/constants';
import type { NarrationInput } from '../narrationService';

const PROMPT_PREFIX = `You are Bloom, a cinematic atmospheric narrator. Generate exactly one short, poetic sentence about a city's current atmosphere. Be minimalist, present-tense, emotionally intelligent. Never use weather report language, statistics, questions, or exclamation marks. Sound futuristic and calm.

`;

function buildPrompt(input: NarrationInput): string {
  return `${PROMPT_PREFIX}City: ${input.city}, ${input.country}
Weather: ${input.weather}, ${input.temp}°C
Time: ${input.timeOfDay}
Humidity: ${input.humidity}%
Wind: ${input.windSpeed} km/h`;
}

/** Generate narration using Google Gemini */
export async function generateGeminiNarration(
  input: NarrationInput,
  apiKey: string
): Promise<string> {
  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    const response = await fetch(`${API.GEMINI}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: {
          maxOutputTokens: 60,
          temperature: 0.8,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
      console.log('[Gemini Provider] Success:', { text });
      return text;
    }

    if (response.status === 429 && attempt < maxRetries) {
      attempt++;
      const waitTime = 2000;
      console.warn(`[Gemini Provider] Rate limited (429). Retrying in ${waitTime}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || 'Unknown Gemini Error';
    console.error('[Gemini Provider] API Error:', {
      status: response.status,
      message: errorMessage,
      details: errorData
    });
    throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
  }

  return '';
}
