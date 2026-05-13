import { ParticleSystem } from '../ParticleSystem';
import type { CanvasEffect, Particle } from '../../types/canvas';
import { randomRange } from '../../utils/helpers';

/** Snow atmospheric effect */
export class SnowEffect extends ParticleSystem<Particle> implements CanvasEffect {
  public id = 'snow';
  private intensity: number = 0;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 200);
  }

  protected createParticle(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: -10,
      vx: randomRange(-0.5, 0.5),
      vy: randomRange(30, 80),
      size: randomRange(2, 5),
      opacity: randomRange(0.4, 0.8),
      life: 1,
      maxLife: 1,
    };
  }

  protected updateParticle(p: Particle, dt: number): boolean {
    // Gentle sine-wave drift
    p.x += p.vx + Math.sin(this.time + p.x * 0.01) * 0.5;
    p.y += p.vy * dt;

    return p.y < this.canvas.height + 10;
  }

  protected renderParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * this.intensity})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  public setIntensity(value: number): void {
    this.intensity = value;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public update(dt: number): void {
    this.time += dt;
    if (this.intensity > 0) {
      this.spawn(Math.floor(2 * this.intensity));
    }
    super.update(dt);
  }

  public destroy(): void {
    this.reset();
  }
}
