import type { CanvasEffect, Vec2 } from '../types/canvas';
import { BuddyParticles } from './BuddyParticles';
import { lerp, distance, randomRange } from '../utils/helpers';
import { CANVAS } from '../utils/constants';

type BuddyState = 'idle' | 'follow' | 'sleep' | 'scared';

/**
 * Ambient Buddy logic — manages movement, state machine, and trail emission.
 */
export class BuddyEffect implements CanvasEffect {
  public id = 'buddy';
  private intensity: number = 1;
  private pos: Vec2 = { x: 0, y: 0 };
  private target: Vec2 = { x: 0, y: 0 };
  private state: BuddyState = 'idle';
  private trail: BuddyParticles;
  private time: number = 0;
  private nextStateTime: number = 0;
  private mousePos: Vec2 = { x: -1000, y: -1000 };
  private lastMousePos: Vec2 = { x: 0, y: 0 };
  private mouseVelocity: number = 0;

  constructor(canvas: HTMLCanvasElement, trail: BuddyParticles) {
    this.trail = trail;
    this.pos = { x: canvas.width / 2, y: canvas.height / 2 };
    this.target = { ...this.pos };

    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private handleMouseMove = (e: MouseEvent) => {
    const now = { x: e.clientX, y: e.clientY };
    this.mouseVelocity = distance(now.x, now.y, this.lastMousePos.x, this.lastMousePos.y);
    this.lastMousePos = now;
    this.mousePos = now;
  };

  public update(dt: number): void {
    this.time += dt;

    // State Machine
    const distToMouse = distance(this.pos.x, this.pos.y, this.mousePos.x, this.mousePos.y);

    // Get scared only if mouse moves very fast near the buddy
    if (this.mouseVelocity > 50 && distToMouse < 150) {
      this.state = 'scared';
      this.nextStateTime = this.time + 1.5;
    } else if (distToMouse < 500) {
      // If we were scared, wait for nextStateTime to finish before following again
      if (this.state !== 'scared' || this.time > this.nextStateTime) {
        this.state = 'follow';
        this.target = { ...this.mousePos };
      }
    } else if (this.time > this.nextStateTime) {
      this.state = Math.random() > 0.3 ? 'idle' : 'sleep';
      this.nextStateTime = this.time + randomRange(3, 8);
      
      if (this.state === 'idle') {
        this.target = {
          x: randomRange(100, window.innerWidth - 100),
          y: randomRange(100, window.innerHeight - 100),
        };
      }
    }

    // Movement Logic
    let lerpSpeed = 0.05;
    
    if (this.state === 'scared') {
      lerpSpeed = 0.12;
      const angle = Math.atan2(this.pos.y - this.mousePos.y, this.pos.x - this.mousePos.x);
      this.target = {
        x: this.pos.x + Math.cos(angle) * 400,
        y: this.pos.y + Math.sin(angle) * 400,
      };
    } else if (this.state === 'follow') {
      // Faster follow when close to "meet" the pointer
      lerpSpeed = distToMouse < 50 ? 0.15 : 0.08;
    } else if (this.state === 'sleep') {
      lerpSpeed = 0.01;
    }

    this.pos.x = lerp(this.pos.x, this.target.x, lerpSpeed);
    this.pos.y = lerp(this.pos.y, this.target.y, lerpSpeed);

    // Subtle bobbing
    if (this.state !== 'sleep') {
      this.pos.y += Math.sin(this.time * 2) * 0.5;
      this.pos.x += Math.cos(this.time * 1.5) * 0.3;
    }

    // Emit trail particles
    if (this.state !== 'sleep' && Math.random() > 0.4) {
      this.trail.emit(this.pos.x, this.pos.y, 1);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const size = CANVAS.BUDDY_SIZE;
    const isSleeping = this.state === 'sleep';
    const opacity = isSleeping ? 0.4 : 0.8;

    ctx.save();
    
    // Outer Glow
    const gradient = ctx.createRadialGradient(
      this.pos.x, this.pos.y, 0,
      this.pos.x, this.pos.y, CANVAS.BUDDY_GLOW_OUTER
    );
    gradient.addColorStop(0, `rgba(167, 139, 250, ${0.3 * this.intensity * opacity})`);
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, CANVAS.BUDDY_GLOW_OUTER, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.fillStyle = `rgba(167, 139, 250, ${opacity * this.intensity})`;
    ctx.shadowBlur = isSleeping ? 5 : 20;
    ctx.shadowColor = 'rgba(167, 139, 250, 0.8)';
    ctx.arc(this.pos.x, this.pos.y, isSleeping ? size * 0.7 : size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public setIntensity(value: number): void {
    this.intensity = value;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public destroy(): void {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }
}
