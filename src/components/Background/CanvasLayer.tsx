import { useEffect, useRef } from 'react';
import { CanvasManager } from '../../canvas/CanvasManager';
import { RainEffect } from '../../canvas/effects/RainEffect';
import { SnowEffect } from '../../canvas/effects/SnowEffect';
import { BuddyEffect } from '../../canvas/BuddyEffect';
import { BuddyParticles } from '../../canvas/BuddyParticles';
import { useWeatherStore } from '../../stores/useWeatherStore';


/**
 * React wrapper for the CanvasManager.
 * Manages the lifecycle of the canvas and registers weather effects.
 */
export function CanvasLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const condition = useWeatherStore((s) => s.current?.condition);

  // Initialize CanvasManager
  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new CanvasManager(canvasRef.current);
    managerRef.current = manager;

    // Initialize Buddy system
    const trail = new BuddyParticles(canvasRef.current);
    const buddy = new BuddyEffect(canvasRef.current, trail);
    manager.addEffect(trail);
    manager.addEffect(buddy);

    manager.start();

    return () => {
      manager.destroy();
      managerRef.current = null;
    };
  }, []);

  // Sync effects with weather condition
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    // Simple transition logic: enable/disable effects based on condition
    // In a more advanced version, we'd crossfade intensities
    
    // Clear previous effects or reset them
    manager.removeEffect('rain');
    manager.removeEffect('snow');

    if (condition === 'rain' || condition === 'drizzle') {
      const rain = new RainEffect(canvasRef.current!);
      rain.setIntensity(1);
      manager.addEffect(rain);
    } else if (condition === 'snow') {
      const snow = new SnowEffect(canvasRef.current!);
      snow.setIntensity(1);
      manager.addEffect(snow);
    }
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
