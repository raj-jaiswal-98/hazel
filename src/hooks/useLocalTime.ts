import { useState, useEffect, useRef } from 'react';
import { getLocalTimeString, getLocalHour } from '../services/timeService';
import { getTimeOfDay } from '../utils/atmosphere';
import type { TimeOfDay } from '../types/weather';
import { TIMING } from '../utils/constants';

interface LocalTimeResult {
  timeString: string;
  hour: number;
  timeOfDay: TimeOfDay;
}

/**
 * Hook for real-time local time in a given timezone
 * Updates every second
 */
export function useLocalTime(timezone: string | undefined): LocalTimeResult {
  const [timeString, setTimeString] = useState('--:--');
  const [hour, setHour] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!timezone) return;

    const update = () => {
      const time = getLocalTimeString(timezone);
      const h = getLocalHour(timezone);
      setTimeString(time);
      setHour(h);
      setTimeOfDay(getTimeOfDay(h));
    };

    // Initial update
    update();

    // Update every second
    intervalRef.current = setInterval(update, TIMING.CLOCK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timezone]);

  return { timeString, hour, timeOfDay };
}
