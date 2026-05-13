import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatTemperature } from '../../utils/helpers';

/** Weather data grid with glassmorphic cards */
export function WeatherGrid() {
  const current = useWeatherStore((s) => s.current);
  const aqi = useWeatherStore((s) => s.aqi);
  const tempUnit = useSettingsStore((s) => s.temperatureUnit);

  if (!current) return null;

  const cards = [
    {
      icon: '🌡️',
      label: 'Feels Like',
      value: formatTemperature(current.feelsLike, tempUnit),
    },
    {
      icon: '💧',
      label: 'Humidity',
      value: `${current.humidity}%`,
    },
    {
      icon: '💨',
      label: 'Wind',
      value: `${Math.round(current.windSpeed)} km/h`,
    },
    ...(aqi
      ? [
          {
            icon: '🫁',
            label: 'Air Quality',
            value: `${aqi.value}`,
            accentColor: aqi.color,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      id="weather-grid"
      className="flex flex-wrap gap-4 justify-center"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {cards.map((card, i) => (
        <GlassCard
          key={card.label}
          delay={i * 0.08}
          glowColor={'accentColor' in card ? (card as { accentColor: string }).accentColor + '20' : undefined}
          className="px-6 py-3 flex items-center gap-4 min-w-[160px]"
        >
          <span className="text-xl">{card.icon}</span>
          <div className="flex flex-col">
            <span className="text-sm font-display font-semibold" style={{ color: 'var(--color-bloom-text-primary)' }}>
              {card.value}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-bloom-text-muted">{card.label}</span>
          </div>
        </GlassCard>
      ))}
    </motion.div>
  );
}
