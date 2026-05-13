import type { CanvasEffect, Vec2 } from '../types/canvas';
import { BuddyParticles } from './BuddyParticles';
import { lerp, distance, randomRange } from '../utils/helpers';

type BuddyState = 'idle' | 'preparing_jump' | 'jumping' | 'sleep';

export class BuddyEffect implements CanvasEffect {
  public id = 'buddy';
  private intensity: number = 1;
  private pos: Vec2 = { x: 0, y: 0 };
  private target: Vec2 = { x: 0, y: 0 };
  private jumpStart: Vec2 = { x: 0, y: 0 };
  private state: BuddyState = 'idle';
  private trail: BuddyParticles;
  private time: number = 0;
  private stateStartTime: number = 0;
  private stateDuration: number = 0;
  private mousePos: Vec2 = { x: -1000, y: -1000 };

  constructor(canvas: HTMLCanvasElement, trail: BuddyParticles) {
    this.trail = trail;
    this.pos = { x: canvas.width / 2, y: canvas.height / 2 };
    this.target = { ...this.pos };
    this.jumpStart = { ...this.pos };
    (window as any).__BUDDY_ENGINE__ = this;
    window.addEventListener('mousemove', (e) => {
      this.mousePos = { x: e.clientX, y: e.clientY };
    });
  }

  public update(dt: number): void {
    this.time += dt;
    const elapsed = this.time - this.stateStartTime;

    switch (this.state) {
      case 'idle':
        if (elapsed > this.stateDuration) {
          this.state = 'preparing_jump';
          this.stateStartTime = this.time;
          this.stateDuration = 0.5 + Math.random() * 0.5;
        }
        break;

      case 'preparing_jump':
        // Vibration effect
        this.pos.x += (Math.random() - 0.5) * 2;
        if (elapsed > this.stateDuration) {
          this.state = 'jumping';
          this.stateStartTime = this.time;
          this.stateDuration = 0.8 + Math.random() * 0.4;
          this.jumpStart = { ...this.pos };
          
          // Pick a cute target near center or near mouse if mouse is close
          const distToMouse = distance(this.pos.x, this.pos.y, this.mousePos.x, this.mousePos.y);
          if (distToMouse < 400 && Math.random() > 0.4) {
             // Jump near mouse but with some offset
             this.target = {
               x: this.mousePos.x + (Math.random() - 0.5) * 200,
               y: this.mousePos.y + (Math.random() - 0.5) * 200,
             };
          } else {
             // Random roam
             this.target = {
               x: randomRange(100, window.innerWidth - 100),
               y: randomRange(100, window.innerHeight - 100),
             };
          }
        }
        break;

      case 'jumping':
        const t = Math.min(elapsed / this.stateDuration, 1);
        const ease = t * (2 - t); // Simple ease out
        
        this.pos.x = lerp(this.jumpStart.x, this.target.x, ease);
        this.pos.y = lerp(this.jumpStart.y, this.target.y, ease);
        
        // Add a "jump" arc height
        const jumpHeight = 100 * Math.sin(t * Math.PI);
        this.pos.y -= jumpHeight;

        if (t >= 1) {
          this.state = 'idle';
          this.stateStartTime = this.time;
          this.stateDuration = 1 + Math.random() * 3;
        }

        // Emit trail more intensely during jump
        if (Math.random() > 0.2) {
          this.trail.emit(this.pos.x, this.pos.y, 1);
        }
        break;
    }

    // Gentle bobbing when not jumping
    if (this.state !== 'jumping') {
      this.pos.y += Math.sin(this.time * 2) * 0.3;
    }
  }

  public render(_ctx: CanvasRenderingContext2D): void {
    // Body rendering moved to BuddyComponent.tsx
  }

  public setIntensity(value: number): void {
    this.intensity = value;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public destroy(): void {
    // Cleanup if needed
  }
}
