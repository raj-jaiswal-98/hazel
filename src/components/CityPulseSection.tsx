import { motion } from 'framer-motion';
import { useCityStore } from '../stores/useCityStore';
import { GlassCard } from './ui/GlassCard';

/** City Pulse Section — Historical news and local heartbeat */
export function CityPulseSection() {
  const selectedCity = useCityStore((s: any) => s.selectedCity);
  const events = useCityStore((s: any) => s.pulseEvents);
  const isLoading = useCityStore((s: any) => s.isPulseLoading);

  if (!selectedCity) return null;

  return (
    <motion.section
      id="city-pulse-section"
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bloom-glow-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bloom-glow-blue"></span>
            </span>
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-bloom-text-secondary">
              City Heartbeat
            </h2>
          </div>
          <div className="text-[10px] text-bloom-text-muted font-mono uppercase">
            Live History Feed
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-5 flex gap-6 items-start hover:border-white/20 transition-colors group">
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-display font-bold text-bloom-glow-blue">
                      {event.year}
                    </div>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-bloom-glow-blue/50 to-transparent mt-2" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-bloom-text-secondary group-hover:text-bloom-text-primary transition-colors">
                      {event.text}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-bloom-text-muted border border-white/10 uppercase tracking-tighter">
                        {event.type}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
        
        <p className="text-[10px] text-center text-bloom-text-muted mt-4 italic">
          Insights curated from the local cultural archive.
        </p>
      </div>
    </motion.section>
  );
}
