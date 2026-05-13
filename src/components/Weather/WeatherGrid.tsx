import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatTemperature } from '../../utils/helpers';

/** Weather data grid with glassmorphic cards */
export function WeatherGrid() {
  const current = useWeatherStore((s) => s.current);
  const aqi = useWeatherStore((s) => s.aqi);
  const daily = useWeatherStore((s) => s.daily);
  const tempUnit = useSettingsStore((s) => s.temperatureUnit);

  if (!current) return null;

  const sunrise = daily[0]?.sunrise
    ? new Date(daily[0].sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    : '--:--';
  const sunset = daily[0]?.sunset
    ? new Date(daily[0].sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    : '--:--';

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
      subtitle: getWindDirection(current.windDirection),
    },
    {
      icon: '☀️',
      label: 'UV Index',
      value: current.uvIndex.toFixed(1),
      subtitle: getUVLabel(current.uvIndex),
    },
    {
      icon: '🌅',
      label: 'Sunrise',
      value: sunrise,
    },
    {
      icon: '🌇',
      label: 'Sunset',
      value: sunset,
    },
    ...(aqi
      ? [
          {
            icon: '🫁',
            label: 'Air Quality',
            value: `${aqi.value}`,
            subtitle: aqi.category,
            accentColor: aqi.color,
          },
        ]
      : []),
    {
      icon: '☁️',
      label: 'Cloud Cover',
      value: `${current.cloudCover}%`,
    },
  ];

  return (
    <motion.div
      id="weather-grid"
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      }}
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
          className="p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-xl font-display font-semibold" style={{ color: 'var(--color-bloom-text-primary)' }}>
              {card.value}
            </span>
          </div>
          <div className="text-label">{card.label}</div>
          {'subtitle' in card && card.subtitle && (
            <div className="text-xs mt-1" style={{ color: 'var(--color-bloom-text-muted)' }}>
              {card.subtitle}
            </div>
          )}
        </GlassCard>
      ))}
    </motion.div>
  );
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

function getUVLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}
