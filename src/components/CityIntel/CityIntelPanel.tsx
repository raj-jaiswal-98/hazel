import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useCityStore } from '../../stores/useCityStore';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { fetchCitySummary } from '../../services/cityService';
import { formatPopulation } from '../../utils/helpers';
import { countryCodeToFlag } from '../../types/city';
import type { CityIntelligence } from '../../types/city';

/** City Intelligence panel */
export function CityIntelPanel() {
  const selectedCity = useCityStore((s) => s.selectedCity);
  const current = useWeatherStore((s) => s.current);
  const [intel, setIntel] = useState<CityIntelligence | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCity) return;

    setLoading(true);
    const controller = new AbortController();

    fetchCitySummary(selectedCity.name, controller.signal)
      .then((data) => {
        if (data) {
          // Generate vibe tags based on conditions
          data.vibeTags = generateVibeTags(selectedCity, current);
          setIntel(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, [selectedCity, current]);

  if (!selectedCity) return null;

  return (
    <GlassCard animate={true} delay={0.2} className="p-6" id="city-intel-panel">
      <div className="text-label mb-4">City Intelligence</div>

      {loading && (
        <div className="text-sm" style={{ color: 'var(--color-bloom-text-muted)' }}>
          Loading city data...
        </div>
      )}

      {intel && (
        <div className="space-y-5">
          {/* Summary */}
          {intel.summary && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-bloom-text-secondary)' }}>
              {intel.summary}
            </p>
          )}

          {/* Vibe Tags */}
          {intel.vibeTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {intel.vibeTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="glass-pill text-xs"
                  style={{ color: 'var(--color-bloom-text-primary)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-label block mb-1">Country</span>
              <span style={{ color: 'var(--color-bloom-text-primary)' }}>
                {countryCodeToFlag(selectedCity.countryCode)} {selectedCity.country}
              </span>
            </div>
            <div>
              <span className="text-label block mb-1">Timezone</span>
              <span style={{ color: 'var(--color-bloom-text-primary)' }}>
                {selectedCity.timezone}
              </span>
            </div>
            {selectedCity.population && (
              <div>
                <span className="text-label block mb-1">Population</span>
                <span style={{ color: 'var(--color-bloom-text-primary)' }}>
                  {formatPopulation(selectedCity.population)}
                </span>
              </div>
            )}
            {selectedCity.elevation !== undefined && (
              <div>
                <span className="text-label block mb-1">Elevation</span>
                <span style={{ color: 'var(--color-bloom-text-primary)' }}>
                  {selectedCity.elevation}m
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !intel && (
        <p className="text-sm" style={{ color: 'var(--color-bloom-text-muted)' }}>
          No city data available.
        </p>
      )}
    </GlassCard>
  );
}

/** Generate vibe tags from city data and weather */
function generateVibeTags(
  city: { population?: number; latitude: number; name: string },
  weather: { condition: string; isDay: boolean } | null
): string[] {
  const tags: string[] = [];

  // Population-based
  if (city.population && city.population > 10_000_000) {
    tags.push('megacity', 'bustling');
  } else if (city.population && city.population > 1_000_000) {
    tags.push('metropolitan');
  } else if (city.population && city.population < 100_000) {
    tags.push('intimate');
  }

  // Latitude-based
  if (Math.abs(city.latitude) > 55) {
    tags.push('nordic');
  } else if (Math.abs(city.latitude) < 25) {
    tags.push('tropical');
  }

  // Weather-based
  if (weather) {
    switch (weather.condition) {
      case 'rain':
      case 'drizzle':
        tags.push('rainy', 'reflective');
        break;
      case 'snow':
        tags.push('winter', 'cozy');
        break;
      case 'clear':
        tags.push(weather.isDay ? 'sunny' : 'starlit');
        break;
      case 'fog':
        tags.push('misty', 'mysterious');
        break;
      case 'storm':
        tags.push('electric', 'dramatic');
        break;
    }
  }

  return tags.slice(0, 5);
}
