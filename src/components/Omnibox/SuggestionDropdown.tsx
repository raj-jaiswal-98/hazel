import { motion } from 'framer-motion';
import { SuggestionItem } from './SuggestionItem';
import type { GeocodingResult } from '../../types/city';

interface SuggestionDropdownProps {
  results: GeocodingResult[];
  selectedIndex: number;
  onSelect: (result: GeocodingResult) => void;
  onHover: (index: number) => void;
}

/** Glassmorphic dropdown for city suggestions */
export function SuggestionDropdown({ results, selectedIndex, onSelect, onHover }: SuggestionDropdownProps) {
  return (
    <motion.div
      id="omnibox-dropdown"
      className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(15, 15, 25, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="py-2 max-h-80 overflow-y-auto">
        {results.map((result, index) => (
          <SuggestionItem
            key={result.id}
            result={result}
            isSelected={index === selectedIndex}
            onSelect={() => onSelect(result)}
            onHover={() => onHover(index)}
            delay={index * 0.03}
          />
        ))}
      </div>
    </motion.div>
  );
}
