import type { Particle } from '../types/canvas';


/**
 * Base class for particle-based effects.
 * Implements an object pool for performance.
 */
export abstract class ParticleSystem<P extends Particle> {
  protected particles: P[] = [];
  protected pool: P[] = [];
  protected canvas: HTMLCanvasElement;
  protected maxParticles: number;

  constructor(canvas: HTMLCanvasElement, maxParticles: number = 500) {
    this.canvas = canvas;
    this.maxParticles = maxParticles;
  }

  /** Initialize a single particle */
  protected abstract createParticle(): P;

  /** Update a single particle */
  protected abstract updateParticle(p: P, dt: number): boolean;

  /** Render a single particle */
  protected abstract renderParticle(ctx: CanvasRenderingContext2D, p: P): void;

  /** Spawn new particles */
  protected spawn(count: number): void {
    const space = this.maxParticles - this.particles.length;
    const toSpawn = Math.min(count, space);

    for (let i = 0; i < toSpawn; i++) {
      const p = this.pool.pop() ?? this.createParticle();
      // Reset properties in case of pooling
      Object.assign(p, this.createParticle());
      this.particles.push(p);
    }
  }

  /** Update all particles */
  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const alive = this.updateParticle(p, dt);

      if (!alive) {
        this.pool.push(this.particles.splice(i, 1)[0]);
      }
    }
  }

  /** Render all particles */
  public render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      this.renderParticle(ctx, p);
    }
  }

  /** Reset the system */
  public reset(): void {
    this.pool.push(...this.particles);
    this.particles = [];
  }
}
