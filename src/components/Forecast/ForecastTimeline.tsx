import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatTemperature } from '../../utils/helpers';
import { weatherCodeToIcon } from '../../types/weather';

/** 5-day cinematic forecast timeline */
export function ForecastTimeline() {
  const daily = useWeatherStore((s) => s.daily);
  const tempUnit = useSettingsStore((s) => s.temperatureUnit);

  if (daily.length === 0) return null;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <GlassCard animate={true} className="p-6" id="forecast-timeline">
      <div className="text-label mb-4">5-Day Forecast</div>

      <div className="flex gap-1 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
        {daily.map((day, i) => {
          const date = new Date(day.date);
          const dayName = i === 0 ? 'Today' : dayNames[date.getDay()];
          const icon = weatherCodeToIcon(day.weatherCode);

          return (
            <motion.div
              key={day.date}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl min-w-[80px]"
              style={{
                scrollSnapAlign: 'start',
                background: i === 0 ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: i === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                borderRadius: '12px',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: i === 0 ? 'var(--color-bloom-glow-blue)' : 'var(--color-bloom-text-secondary)' }}
              >
                {dayName}
              </span>

              <span className="text-2xl">{icon}</span>

              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium" style={{ color: 'var(--color-bloom-text-primary)' }}>
                  {formatTemperature(day.tempMax, tempUnit)}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-bloom-text-muted)' }}>
                  {formatTemperature(day.tempMin, tempUnit)}
                </span>
              </div>

              {day.precipProbability > 0 && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-1 rounded-full"
                    style={{
                      height: `${Math.max(8, day.precipProbability / 3)}px`,
                      background: `rgba(74, 158, 255, ${0.3 + day.precipProbability / 200})`,
                    }}
                  />
                  <span className="text-[10px]" style={{ color: 'var(--color-bloom-glow-blue)' }}>
                    {day.precipProbability}%
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
