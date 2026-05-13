import type { WeatherCondition, TimeOfDay } from '../types/weather';

/**
 * Generates a unique 'signature color' for a city based on its name.
 * This ensures every city has a distinct 'mood' even in the same weather.
 */
export function getCitySignatureColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  const s = 50 + (Math.abs(hash % 40)); // 50-90% saturation
  const l = 60 + (Math.abs(hash % 20)); // 60-80% lightness
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Atmospheric palette for backgrounds */
export interface AtmosphericPalette {
  gradient: [string, string, string];
  accent: string;
  overlayOpacity: number;
  glowColor: string;
}

/** Get atmospheric palette for a given weather/time combination */
export function getAtmosphericPalette(
  condition: WeatherCondition,
  timeOfDay: TimeOfDay,
  _cloudCover: number = 50,
  _temp: number = 20
): AtmosphericPalette {
  // Night override for clear/cloudy conditions
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk';

  const palettes: Record<WeatherCondition, AtmosphericPalette> = {
    clear: {
      gradient: isNight
        ? ['#05050f', '#0a0a1a', '#10102a']
        : ['#1a1410', '#2d1f0e', '#4a3520'],
      accent: isNight ? '#a78bfa' : '#ffb347',
      overlayOpacity: isNight ? 0.3 : 0.15,
      glowColor: isNight ? 'rgba(167,139,250,0.15)' : 'rgba(255,179,71,0.15)',
    },
    cloudy: {
      gradient: ['#12141a', '#1e2230', '#2a2f40'],
      accent: '#8899aa',
      overlayOpacity: 0.2,
      glowColor: 'rgba(136,153,170,0.1)',
    },
    rain: {
      gradient: ['#0a0e18', '#101828', '#1a2540'],
      accent: '#4a9eff',
      overlayOpacity: 0.25,
      glowColor: 'rgba(74,158,255,0.12)',
    },
    drizzle: {
      gradient: ['#0e1220', '#182030', '#222e45'],
      accent: '#6495ed',
      overlayOpacity: 0.2,
      glowColor: 'rgba(100,149,237,0.1)',
    },
    snow: {
      gradient: ['#0f1520', '#182030', '#1f2838'],
      accent: '#c8dcff',
      overlayOpacity: 0.2,
      glowColor: 'rgba(200,220,255,0.12)',
    },
    storm: {
      gradient: ['#08080f', '#0e0e1a', '#1a0a0a'],
      accent: '#ff6b6b',
      overlayOpacity: 0.35,
      glowColor: 'rgba(255,107,107,0.1)',
    },
    fog: {
      gradient: ['#14141a', '#1e1e24', '#28282f'],
      accent: '#ccccdd',
      overlayOpacity: 0.3,
      glowColor: 'rgba(204,204,221,0.08)',
    },
    dust: {
      gradient: ['#1a1508', '#2d200a', '#4a3010'],
      accent: '#d4a574',
      overlayOpacity: 0.2,
      glowColor: 'rgba(212,165,116,0.1)',
    },
  };

  // Apply golden hour override
  if (timeOfDay === 'golden') {
    return {
      gradient: ['#1a1008', '#2d1a0a', '#4a2a10'],
      accent: '#ff8c42',
      overlayOpacity: 0.15,
      glowColor: 'rgba(255,140,66,0.15)',
    };
  }

  // Apply dawn tint
  if (timeOfDay === 'dawn') {
    const base = palettes[condition];
    return {
      ...base,
      accent: '#e8a0b0',
      glowColor: 'rgba(232,160,176,0.12)',
    };
  }

  return palettes[condition];
}

/** Determine time of day from hour (0-23) */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 18) return 'golden';
  if (hour >= 18 && hour < 20) return 'dusk';
  return 'night';
}

/** Get text color based on weather mood */
export function getMoodTextColor(condition: WeatherCondition, isDay: boolean): string {
  if (!isDay) return 'rgba(200, 200, 255, 0.92)';

  const colors: Record<WeatherCondition, string> = {
    clear: 'rgba(255, 248, 230, 0.95)',
    cloudy: 'rgba(220, 225, 235, 0.92)',
    rain: 'rgba(200, 215, 240, 0.92)',
    drizzle: 'rgba(210, 220, 240, 0.92)',
    snow: 'rgba(230, 240, 255, 0.95)',
    storm: 'rgba(240, 210, 210, 0.9)',
    fog: 'rgba(220, 220, 230, 0.85)',
    dust: 'rgba(240, 220, 190, 0.92)',
  };

  return colors[condition];
}
