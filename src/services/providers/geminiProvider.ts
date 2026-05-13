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
  const url = `${API.GEMINI}?key=${apiKey}`;

  const response = await fetch(url, {
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

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
}
