import type { CanvasEffect, CanvasDimensions } from '../types/canvas';

/**
 * CanvasManager — singleton managing the RAF loop and effect registry.
 * Coordinates all canvas-based visual effects (weather particles, buddy, glow).
 */
export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private effects: Map<string, CanvasEffect> = new Map();
  private animationId: number | null = null;
  private lastTime: number = 0;
  private dimensions: CanvasDimensions;
  private running: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');
    this.ctx = ctx;

    this.dimensions = this.calculateDimensions();
    this.handleResize();

    // Listen for window resize
    window.addEventListener('resize', this.handleResize);
  }

  /** Calculate canvas dimensions accounting for DPI */
  private calculateDimensions(): CanvasDimensions {
    const dpr = window.devicePixelRatio || 1;
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr,
    };
  }

  /** Handle window resize — update canvas size */
  private handleResize = () => {
    this.dimensions = this.calculateDimensions();
    const { width, height, dpr } = this.dimensions;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(dpr, dpr);
  };

  /** Register an effect */
  addEffect(effect: CanvasEffect): void {
    this.effects.set(effect.id, effect);
  }

  /** Remove an effect */
  removeEffect(id: string): void {
    const effect = this.effects.get(id);
    if (effect) {
      effect.destroy();
      this.effects.delete(id);
    }
  }

  /** Get an effect by ID */
  getEffect(id: string): CanvasEffect | undefined {
    return this.effects.get(id);
  }

  /** Check if an effect exists */
  hasEffect(id: string): boolean {
    return this.effects.has(id);
  }

  /** Start the render loop */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  /** Stop the render loop */
  stop(): void {
    this.running = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /** Main render loop */
  private tick = (time: number): void => {
    if (!this.running) return;

    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1); // Cap at 100ms
    this.lastTime = time;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);

    // Update and render all effects
    for (const effect of this.effects.values()) {
      effect.update(deltaTime);
      effect.render(this.ctx);
    }

    this.animationId = requestAnimationFrame(this.tick);
  };

  /** Get current canvas dimensions */
  getDimensions(): CanvasDimensions {
    return { ...this.dimensions };
  }

  /** Get canvas context */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /** Cleanup everything */
  destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);

    for (const effect of this.effects.values()) {
      effect.destroy();
    }
    this.effects.clear();
  }
}
