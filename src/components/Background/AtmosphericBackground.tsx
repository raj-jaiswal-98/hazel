import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAtmosphericPalette, getCitySignatureColor } from '../../utils/atmosphere';
import type { WeatherCondition, TimeOfDay } from '../../types/weather';

interface AtmosphericBackgroundProps {
  condition?: WeatherCondition;
  timeOfDay: TimeOfDay;
  cloudCover?: number;
  imageUrl?: string;
  cityName?: string;
}

/** Multi-layered atmospheric background with Mesh Gradients */
export function AtmosphericBackground({
  condition,
  timeOfDay,
  cloudCover,
  imageUrl,
  cityName = 'Bloom',
}: AtmosphericBackgroundProps) {
  const palette = useMemo(
    () => getAtmosphericPalette(condition ?? 'clear', timeOfDay, cloudCover ?? 50),
    [condition, timeOfDay, cloudCover]
  );

  const cityColor = useMemo(() => getCitySignatureColor(cityName), [cityName]);

  const gradient = `linear-gradient(180deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 50%, ${palette.gradient[2]} 100%)`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" id="atmospheric-background">
      {/* Base Gradient Layer */}
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

      {/* Mesh Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div
          className="absolute w-[80vw] h-[80vh] rounded-full blur-[120px]"
          style={{ background: cityColor, top: '-10%', left: '-10%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-[100px]"
          style={{ background: palette.accent, bottom: '10%', right: '-5%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* City Image Layer (Unsplash) */}
      <AnimatePresence mode="wait">
        {imageUrl && (
          <motion.div
            key={imageUrl}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
          >
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover grayscale mix-blend-overlay brightness-110"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Noise + Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)`,
          opacity: palette.overlayOpacity + 0.2,
        }}
      />

      {/* Subtle noise texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
