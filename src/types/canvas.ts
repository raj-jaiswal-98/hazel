/** Canvas effect interface — all effects implement this */
export interface CanvasEffect {
  id: string;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  setIntensity(value: number): void;
  getIntensity(): number;
  destroy(): void;
}

/** Effect options for configuration */
export interface EffectOptions {
  intensity?: number;
  color?: string;
  particleCount?: number;
  speed?: number;
}

/** Particle for particle-based effects */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

/** Canvas dimensions */
export interface CanvasDimensions {
  width: number;
  height: number;
  dpr: number;
}

/** 2D vector */
export interface Vec2 {
  x: number;
  y: number;
}
