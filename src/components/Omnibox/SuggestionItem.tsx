import { motion } from 'framer-motion';
import type { GeocodingResult } from '../../types/city';
import { countryCodeToFlag } from '../../types/city';

interface SuggestionItemProps {
  result: GeocodingResult;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
  delay: number;
}

/** Individual suggestion row */
export function SuggestionItem({ result, isSelected, onSelect, onHover, delay }: SuggestionItemProps) {
  const flag = countryCodeToFlag(result.country_code);

  return (
    <motion.button
      className="w-full px-5 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer"
      style={{
        background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
      }}
      onClick={onSelect}
      onMouseEnter={onHover}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay }}
    >
      <span className="text-xl flex-shrink-0">{flag}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate" style={{ color: 'var(--color-bloom-text-primary)' }}>
          {result.name}
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--color-bloom-text-secondary)' }}>
          {[result.admin1, result.country].filter(Boolean).join(', ')}
        </div>
      </div>
      {result.population && result.population > 0 && (
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-bloom-text-muted)' }}>
          {formatPop(result.population)}
        </span>
      )}
    </motion.button>
  );
}

function formatPop(pop: number): string {
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
  return pop.toString();
}
