import { ParticleSystem } from '../ParticleSystem';
import type { CanvasEffect, Particle } from '../../types/canvas';
import { randomRange } from '../../utils/helpers';

interface RainParticle extends Particle {
  length: number;
}

/** Rain atmospheric effect */
export class RainEffect extends ParticleSystem<RainParticle> implements CanvasEffect {
  public id = 'rain';
  private intensity: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 400);
  }

  protected createParticle(): RainParticle {
    return {
      x: Math.random() * this.canvas.width,
      y: -20,
      vx: 2, // Slight slant
      vy: randomRange(800, 1200),
      size: randomRange(1, 2),
      length: randomRange(15, 30),
      opacity: randomRange(0.2, 0.5),
      life: 1,
      maxLife: 1,
    };
  }

  protected updateParticle(p: RainParticle, dt: number): boolean {
    p.x += p.vx;
    p.y += p.vy * dt;

    // Remove if off screen
    return p.y < this.canvas.height + 30;
  }

  protected renderParticle(ctx: CanvasRenderingContext2D, p: RainParticle): void {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(180, 200, 255, ${p.opacity * this.intensity})`;
    ctx.lineWidth = p.size;
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx, p.y + p.length);
    ctx.stroke();
  }

  public setIntensity(value: number): void {
    this.intensity = value;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public update(dt: number): void {
    if (this.intensity > 0) {
      this.spawn(Math.floor(20 * this.intensity));
    }
    super.update(dt);
  }

  public destroy(): void {
    this.reset();
  }
}
