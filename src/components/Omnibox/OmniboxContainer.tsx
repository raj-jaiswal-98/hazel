import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from './SearchInput';
import { SuggestionDropdown } from './SuggestionDropdown';
import { useGeocodingSearch } from '../../hooks/useGeocodingSearch';
import { useCityStore } from '../../stores/useCityStore';
import type { GeocodingResult } from '../../types/city';

/** Main Omnibox container — search + suggestions */
export function OmniboxContainer() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectCity = useCityStore((s) => s.selectCity);
  const selectedCity = useCityStore((s) => s.selectedCity);

  const { results, isSearching } = useGeocodingSearch(query);

  const showDropdown = isFocused && results.length > 0 && query.length >= 2;

  // Handle city selection
  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      selectCity(result);
      setQuery('');
      setSelectedIndex(-1);
    },
    [selectCity]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setQuery('');
          setSelectedIndex(-1);
          break;
      }
    },
    [showDropdown, results, selectedIndex, handleSelect]
  );

  // Global `/` shortcut to focus omnibox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const input = containerRef.current?.querySelector('input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      id="omnibox-container"
      className="relative z-30 flex flex-col items-center"
      style={{
        paddingTop: selectedCity ? '2rem' : '30vh',
        transition: 'padding-top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl px-6">
        {/* Logo / Title (shown when no city selected) */}
        <AnimatePresence>
          {!selectedCity && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-5xl font-bold tracking-tight mb-2"
                  style={{ color: 'var(--color-bloom-text-primary)' }}>
                Bloom
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-bloom-text-secondary)' }}>
                Feel the city
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Input */}
        <SearchInput
          value={query}
          onChange={setQuery}
          onFocus={() => setIsFocused(true)}
          isFocused={isFocused}
          isSearching={isSearching}
        />

        {/* Suggestion Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <SuggestionDropdown
              results={results}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onHover={setSelectedIndex}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
