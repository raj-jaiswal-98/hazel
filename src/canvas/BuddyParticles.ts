import type { CanvasEffect, Particle } from '../types/canvas';
import { ParticleSystem } from './ParticleSystem';
import { randomRange } from '../utils/helpers';

/** Particle trail for the Ambient Buddy */
export class BuddyParticles extends ParticleSystem<Particle> implements CanvasEffect {
  public id = 'buddy-particles';
  private intensity: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 100);
  }

  protected createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: randomRange(-20, 20),
      vy: randomRange(-20, 20),
      size: randomRange(2, 6),
      opacity: 0.6,
      life: 0,
      maxLife: randomRange(0.5, 1.2),
    };
  }

  protected updateParticle(p: Particle, dt: number): boolean {
    p.life += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.opacity = (1 - p.life / p.maxLife) * 0.6;

    return p.life < p.maxLife;
  }

  protected renderParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.beginPath();
    ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity * this.intensity})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Emit particles at a specific position */
  public emit(x: number, y: number, count: number): void {
    const space = this.maxParticles - this.particles.length;
    const toSpawn = Math.min(count, space);

    for (let i = 0; i < toSpawn; i++) {
      const p = this.pool.pop() ?? this.createParticle();
      Object.assign(p, this.createParticle());
      p.x = x;
      p.y = y;
      this.particles.push(p);
    }
  }

  public setIntensity(value: number): void {
    this.intensity = value;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public destroy(): void {
    this.reset();
  }
}
