import { motion } from 'framer-motion';
import { useCityStore } from '../../stores/useCityStore';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useUIStore } from '../../stores/useUIStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useLocalTime } from '../../hooks/useLocalTime';
import { formatTemperature } from '../../utils/helpers';
import { getMoodTextColor } from '../../utils/atmosphere';
import { weatherCodeToIcon, weatherCodeToLabel } from '../../types/weather';
import { countryCodeToFlag } from '../../types/city';

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
  item: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  },
} as const;

/** Hero section — city name, clock, weather, narration */
export function HeroSection() {
  const selectedCity = useCityStore((s) => s.selectedCity);
  const current = useWeatherStore((s) => s.current);
  const narration = useUIStore((s) => s.narration);
  const temperatureUnit = useSettingsStore((s) => s.temperatureUnit);
  const { timeString } = useLocalTime(selectedCity?.timezone);

  if (!selectedCity || !current) return null;

  const textColor = getMoodTextColor(current.condition, current.isDay);
  const icon = weatherCodeToIcon(current.weatherCode, current.isDay);
  const condition = weatherCodeToLabel(current.weatherCode);
  const flag = countryCodeToFlag(selectedCity.countryCode);

  return (
    <motion.section
      id="hero-section"
      className="flex flex-col items-center justify-center text-center px-6 py-12"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* City Name */}
      <motion.h1
        className="font-display text-hero leading-none tracking-tighter"
        style={{ color: textColor }}
        variants={stagger.item}
      >
        {selectedCity.name}
      </motion.h1>

      {/* Country */}
      <motion.p
        className="mt-2 text-lg font-body"
        style={{ color: 'var(--color-bloom-text-secondary)' }}
        variants={stagger.item}
      >
        {flag} {selectedCity.country}
      </motion.p>

      {/* Live Clock */}
      <motion.div
        className="mt-6 font-display text-4xl font-light tracking-widest"
        style={{ color: textColor, opacity: 0.85 }}
        variants={stagger.item}
      >
        {timeString}
      </motion.div>

      {/* Weather Badge */}
      <motion.div
        className="mt-4 glass-pill flex items-center gap-2 text-sm"
        style={{ color: 'var(--color-bloom-text-primary)' }}
        variants={stagger.item}
      >
        <span className="text-xl">{icon}</span>
        <span>{condition}</span>
        <span className="mx-1 opacity-30">·</span>
        <span className="font-medium">
          {formatTemperature(current.temperature, temperatureUnit)}
        </span>
      </motion.div>

      {/* Narration */}
      {narration && (
        <motion.p
          className="mt-8 text-narration max-w-xl text-center"
          style={{ color: textColor, opacity: 0.75 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          "{narration}"
        </motion.p>
      )}
    </motion.section>
  );
}
