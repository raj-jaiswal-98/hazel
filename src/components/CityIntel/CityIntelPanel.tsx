import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useCityStore } from '../../stores/useCityStore';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { fetchCitySummary } from '../../services/cityService';
import { fetchCityLandmarks } from '../../services/landmarkService';
import { scrapeCityFacts } from '../../services/visualService';
import { formatPopulation } from '../../utils/helpers';
import { countryCodeToFlag } from '../../types/city';
import { CityMap } from '../CityMap/CityMap';
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

    const loadData = async () => {
      try {
        const [summaryData, landmarkData, factData] = await Promise.all([
          fetchCitySummary(selectedCity.name, controller.signal),
          fetchCityLandmarks(selectedCity.latitude, selectedCity.longitude),
          scrapeCityFacts(selectedCity.name)
        ]);

        if (summaryData) {
          summaryData.vibeTags = generateVibeTags(selectedCity, current);
          summaryData.landmarks = landmarkData;
          summaryData.facts = factData;
          setIntel(summaryData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [selectedCity, current]);

  if (!selectedCity) return null;

  return (
    <GlassCard animate={true} delay={0.2} className="p-6 relative overflow-hidden group" id="city-intel-panel">
      {/* Colorful Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-70"></div>
      
      <div className="text-label mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        City Intelligence
      </div>

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

          {/* Map */}
          <CityMap 
            lat={selectedCity.latitude} 
            lon={selectedCity.longitude} 
            landmarks={intel.landmarks}
          />

          {/* Landmarks List */}
          {intel.landmarks.length > 0 && (
            <div className="space-y-3">
              <span className="text-label block">Key Landmarks</span>
              <div className="grid grid-cols-1 gap-2">
                {intel.landmarks.slice(0, 4).map((poi, i) => {
                  const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={poi.name} className="flex items-center gap-2 text-xs group/item cursor-default">
                      <div 
                        className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-transform group-hover/item:scale-150" 
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                      ></div>
                      <span className="transition-colors group-hover/item:text-white" style={{ color: 'var(--color-bloom-text-primary)' }}>{poi.name}</span>
                      <span className="opacity-40 ml-auto uppercase tracking-widest" style={{ fontSize: '9px', color }}>{poi.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vibe Tags */}
          {intel.vibeTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {intel.vibeTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="glass-pill text-xs border-white/5 bg-white/5"
                  style={{ 
                    color: 'var(--color-bloom-text-primary)',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  transition={{ delay: i * 0.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Scraped Facts */}
          {intel.facts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-label block">Fast Intelligence</span>
              {intel.facts.map((fact, i) => (
                <p key={i} className="text-xs italic leading-relaxed opacity-70" style={{ color: 'var(--color-bloom-text-secondary)' }}>
                  "{fact}"
                </p>
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
