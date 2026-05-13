import { useEffect, useRef, useState } from 'react';
import { OMNIBOX_PLACEHOLDERS } from '../../utils/constants';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  isFocused: boolean;
  isSearching: boolean;
}

/** Cinematic search input with ambient glow */
export function SearchInput({ value, onChange, onFocus, isFocused, isSearching }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % OMNIBOX_PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative" id="omnibox-search">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          boxShadow: isFocused
            ? '0 0 30px rgba(74,158,255,0.25), 0 0 80px rgba(74,158,255,0.1)'
            : '0 0 20px rgba(74,158,255,0.1)',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)',
        }}
      />

      <input
        ref={inputRef}
        id="omnibox-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={OMNIBOX_PLACEHOLDERS[placeholderIndex]}
        autoComplete="off"
        spellCheck={false}
        className="relative w-full px-6 py-4 text-lg font-body rounded-2xl outline-none transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${isFocused ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'var(--color-bloom-text-primary)',
          fontSize: '1.1rem',
        }}
      />

      {/* Searching indicator */}
      {isSearching && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-bloom-glow-blue/30 border-t-bloom-glow-blue rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
