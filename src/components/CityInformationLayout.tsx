import { motion } from 'framer-motion';
import { useCityStore } from '../stores/useCityStore';
import { GlassCard } from './ui/GlassCard';
import { CityMap } from './CityMap/CityMap';
import { useEffect, useState } from 'react';
import { fetchCityLandmarks } from '../services/landmarkService';
import { scrapeCityFacts } from '../services/visualService';
import { fetchCitySummary } from '../services/cityService';
import type { CityIntelligence } from '../types/city';

/**
 * Reorganized City Information Layout
 * Left: Photo, Summary, Fast Intel
 * Right: Map, Latest Feed (Landmarks, Pulse)
 */
export function CityInformationLayout() {
  const { selectedCity, cityImage, wikiSummary, pulseEvents } = useCityStore();
  const [intel, setIntel] = useState<CityIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [focussedLocation, setFocussedLocation] = useState<[number, number] | null>(null);

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
          summaryData.landmarks = landmarkData;
          summaryData.facts = factData;
          setIntel(summaryData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    setFocussedLocation(null); // Reset focus on city change
    return () => controller.abort();
  }, [selectedCity]);

  if (!selectedCity) return null;

  return (
    <div className="w-full max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: City Info & Photo (5/12) */}
      <div className="lg:col-span-5 space-y-8">
        {/* City Photo Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard className="p-0 overflow-hidden group aspect-[4/3] relative">
            {cityImage ? (
              <img 
                src={cityImage.url} 
                alt={selectedCity.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-125"
              />
            ) : (
              <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center text-bloom-text-muted italic">
                Gathering visual signature...
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-6">
              <span className="text-white font-display text-2xl drop-shadow-lg uppercase tracking-widest">
                {selectedCity.name}
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Wikipedia Summary & Facts Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlassCard className="p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50"></div>
            
            <div className="space-y-4">
              <h3 className="text-label uppercase tracking-[0.2em]">Regional Profile</h3>
              <p className="text-lg leading-relaxed text-bloom-text-secondary">
                {wikiSummary?.extract || 'Loading summary...'}
              </p>
            </div>

            {intel && intel.facts.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-label uppercase tracking-[0.2em] text-cyan-400">Fast Intel</h3>
                <div className="space-y-3">
                  {intel.facts.map((fact, i) => (
                    <div key={i} className="flex gap-3 items-start group/fact">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 group-hover/fact:scale-150 transition-transform shadow-[0_0_8px_cyan]"></div>
                      <p className="text-sm italic opacity-80 group-hover:opacity-100 transition-opacity">"{fact}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Map & Latest Feed (7/12) */}
      <div className="lg:col-span-7 space-y-8">
        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CityMap 
            lat={selectedCity.latitude} 
            lon={selectedCity.longitude} 
            landmarks={intel?.landmarks || []}
            focussedLocation={focussedLocation}
            className="h-[400px]" // Larger map as requested
          />
        </motion.div>

        {/* Latest Feed: Landmarks & Heartbeat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Landmarks Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full border-l-cyan-500/30 border-l-2 relative group/section">
              <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 transition-opacity">
                <a 
                  href="https://www.openstreetmap.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] uppercase tracking-tighter text-cyan-500 hover:underline"
                >
                  Source: OSM
                </a>
              </div>
              <h3 className="text-label mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]"></div>
                Local Points
              </h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded w-full" />)}
                  </div>
                ) : (
                  intel?.landmarks.slice(0, 5).map((poi, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between text-xs group/poi cursor-pointer p-1 rounded transition-colors ${focussedLocation?.[0] === poi.lat && focussedLocation?.[1] === poi.lon ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onClick={() => setFocussedLocation([poi.lat, poi.lon])}
                    >
                      <span className="text-bloom-text-primary group-hover/poi:text-cyan-400 transition-colors">{poi.name}</span>
                      <span className="opacity-40 uppercase tracking-tighter text-[9px]">{poi.type}</span>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Pulse/Heartbeat Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlassCard className="p-6 h-full border-l-purple-500/30 border-l-2 relative group/section">
              <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 transition-opacity">
                <a 
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedCity.name)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] uppercase tracking-tighter text-purple-500 hover:underline"
                >
                  Source: Wiki
                </a>
              </div>
              <h3 className="text-label mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_purple]"></div>
                Latest Heartbeat
              </h3>
              <div className="space-y-4">
                {pulseEvents.length > 0 ? (
                  pulseEvents.slice(0, 3).map((event: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{event.year}</div>
                      <p className="text-[11px] leading-relaxed opacity-70 line-clamp-2 hover:line-clamp-none transition-all">{event.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic opacity-40">Scanning local archive...</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
