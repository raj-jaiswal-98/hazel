import { motion } from 'framer-motion';
import { useCityStore } from '../stores/useCityStore';
import { GlassCard } from './ui/GlassCard';

/** Discovery Section — Wikipedia summary and cultural context */
export function DiscoverySection() {
  const selectedCity = useCityStore((s: any) => s.selectedCity);
  const wikiSummary = useCityStore((s: any) => s.wikiSummary);
  const isLoading = useCityStore((s: any) => s.isWikiLoading);

  if (!selectedCity) return null;

  return (
    <motion.section
      id="discovery-section"
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-bloom-text-muted">
            City Discovery
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
          </div>
        ) : wikiSummary ? (
          <GlassCard className="p-8 relative overflow-hidden group">
            {/* Subtle background title */}
            <div className="absolute -bottom-4 -right-4 text-8xl font-display font-bold opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
              {wikiSummary.title}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {wikiSummary.thumbnail && (
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 shadow-2xl">
                  <img 
                    src={wikiSummary.thumbnail} 
                    alt={wikiSummary.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-2xl font-display font-medium mb-4" style={{ color: 'var(--color-bloom-text-primary)' }}>
                  Exploring {wikiSummary.title}
                </h3>
                <p className="text-lg leading-relaxed font-body text-bloom-text-secondary" style={{ opacity: 0.8 }}>
                  {wikiSummary.extract}
                </p>
                
                {wikiSummary.content_urls?.desktop.page && (
                  <motion.a
                    href={wikiSummary.content_urls.desktop.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-bloom-glow-blue hover:text-bloom-text-primary transition-colors group/link"
                    whileHover={{ x: 5 }}
                  >
                    Read full story on Wikipedia
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover/link:opacity-100">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <p className="text-sm text-bloom-text-muted italic">
              No further data found for this location. The city remains a mystery.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
