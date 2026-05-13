import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCities } from '../services/geocodingService';
import type { GeocodingResult } from '../types/city';
import { TIMING } from '../utils/constants';

/**
 * Debounced geocoding search hook with AbortController
 * @param query - Current search query
 * @param delay - Debounce delay in ms
 */
export function useGeocodingSearch(query: string, delay: number = TIMING.DEBOUNCE_SEARCH) {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (q: string) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (q.trim().length < TIMING.MIN_SEARCH_CHARS) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      timeoutRef.current = setTimeout(async () => {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const data = await searchCities(q, controller.signal);
          if (!controller.signal.aborted) {
            setResults(data);
            setIsSearching(false);
          }
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          if (!controller.signal.aborted) {
            setError('Search failed');
            setIsSearching(false);
            setResults([]);
          }
        }
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    search(query);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query, search]);

  return { results, isSearching, error };
}
