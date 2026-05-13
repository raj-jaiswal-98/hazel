import { API } from '../../utils/constants';
import type { NarrationInput } from '../narrationService';

const SYSTEM_PROMPT = `You are Bloom, a cinematic atmospheric narrator. Generate exactly one short, poetic sentence about a city's current atmosphere. Be minimalist, present-tense, emotionally intelligent. Never use weather report language, statistics, questions, or exclamation marks. Sound futuristic and calm.`;

function buildUserPrompt(input: NarrationInput): string {
  return `City: ${input.city}, ${input.country}
Weather: ${input.weather}, ${input.temp}°C
Time: ${input.timeOfDay}
Humidity: ${input.humidity}%
Wind: ${input.windSpeed} km/h`;
}

/** Generate narration using OpenAI GPT-4o-mini */
export async function generateOpenAINarration(
  input: NarrationInput,
  apiKey: string
): Promise<string> {
  const response = await fetch(API.OPENAI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      max_tokens: 60,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[OpenAI Provider] API Error:', {
      status: response.status,
      error: errorData
    });
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? '';
  
  console.log('[OpenAI Provider] Success:', { text });
  
  return text;
}
