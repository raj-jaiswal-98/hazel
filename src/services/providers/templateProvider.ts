import type { NarrationInput } from '../narrationService';

/** Template narration pools organized by weather condition */
const TEMPLATES: Record<string, string[]> = {
  clear: [
    '{city} breathes gently beneath open skies.',
    'The light falls softly across {city} today.',
    '{city} feels golden in the stillness.',
    'A calm clarity settles over {city}.',
    'The sky over {city} stretches wide and luminous.',
  ],
  cloudy: [
    '{city} drifts under a quiet silver canopy.',
    'Soft clouds wrap {city} in a thoughtful haze.',
    'The sky above {city} is a palette of greys.',
    '{city} hums gently beneath layered clouds.',
    'A muted calm blankets {city} this {timeOfDay}.',
  ],
  rain: [
    '{city} glistens beneath a steady rain.',
    'Raindrops trace quiet lines across {city}.',
    '{city} feels reflective under the downpour.',
    'The rain writes soft poems on {city} streets.',
    'Wet light bends through {city} this {timeOfDay}.',
  ],
  drizzle: [
    'A gentle mist descends on {city}.',
    '{city} shimmers under a fine drizzle.',
    'Light rain dusts {city} like whispered secrets.',
    'The air in {city} carries tiny droplets of calm.',
    '{city} feels delicate in the soft rain.',
  ],
  snow: [
    '{city} rests under a quiet white sky.',
    'Snow drifts silently through {city}.',
    '{city} wears winter like a soft blanket.',
    'The world around {city} feels muffled and still.',
    'Flakes fall like slow thoughts over {city}.',
  ],
  storm: [
    '{city} braces against the rumbling sky.',
    'Electric tension ripples through {city}.',
    'The storm reshapes the air above {city}.',
    '{city} pulses with the energy of thunder.',
    'Dark clouds coil above {city} with quiet fury.',
  ],
  fog: [
    '{city} dissolves into a soft haze.',
    'Fog wraps {city} in layers of mystery.',
    '{city} feels hidden from the world right now.',
    'The edges of {city} blur into the mist.',
    'A quiet fog drifts through {city} this {timeOfDay}.',
  ],
  dust: [
    '{city} glows amber through a veil of dust.',
    'Warm particles drift lazily through {city}.',
    '{city} breathes slowly under a dusty sky.',
    'The air in {city} feels textured and warm.',
    'Dust paints {city} in tones of ochre.',
  ],
};

/** Night-specific overrides */
const NIGHT_TEMPLATES = [
  '{city} glows quietly beneath midnight.',
  'The night settles deep over {city}.',
  '{city} hums with nocturnal energy.',
  'Stars scatter above {city} like distant thoughts.',
  'The city lights of {city} breathe in the dark.',
  '{city} feels infinite under the night sky.',
];

/** Generate a template-based narration (no API needed) */
export function generateTemplateNarration(input: NarrationInput): string {
  const isNight = input.timeOfDay === 'night' || input.timeOfDay === 'dusk';

  // Use night templates for nighttime
  const pool = isNight
    ? NIGHT_TEMPLATES
    : TEMPLATES[input.weather.toLowerCase()] ?? TEMPLATES.clear;

  // Pick a semi-random template based on city name (deterministic per city)
  const hash = input.city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dateIndex = new Date().getMinutes() % pool.length;
  const index = (hash + dateIndex) % pool.length;

  return pool[index]
    .replace(/\{city\}/g, input.city)
    .replace(/\{country\}/g, input.country)
    .replace(/\{timeOfDay\}/g, input.timeOfDay);
}
