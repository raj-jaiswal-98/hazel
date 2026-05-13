import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAtmosphericPalette } from '../../utils/atmosphere';
import type { WeatherCondition, TimeOfDay } from '../../types/weather';

interface AtmosphericBackgroundProps {
  condition?: WeatherCondition;
  timeOfDay: TimeOfDay;
  cloudCover?: number;
  imageUrl?: string;
}

/** Multi-layered atmospheric background */
export function AtmosphericBackground({
  condition,
  timeOfDay,
  cloudCover,
  imageUrl,
}: AtmosphericBackgroundProps) {
  const palette = useMemo(
    () => getAtmosphericPalette(condition ?? 'clear', timeOfDay, cloudCover ?? 50),
    [condition, timeOfDay, cloudCover]
  );

  const gradient = `linear-gradient(180deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 50%, ${palette.gradient[2]} 100%)`;

  return (
    <div className="fixed inset-0 z-0" id="atmospheric-background">
      {/* City Image Layer (Unsplash) */}
      <AnimatePresence mode="wait">
        {imageUrl && (
          <motion.div
            key={imageUrl}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover grayscale brightness-50"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${condition}-${timeOfDay}`}
          className="absolute inset-0"
          style={{ background: gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Noise + Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)`,
          opacity: palette.overlayOpacity + 0.3,
        }}
      />

      {/* Subtle noise texture via SVG filter */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Ambient glow spot */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vh',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${palette.glowColor} 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
