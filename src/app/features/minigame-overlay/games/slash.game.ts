import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, Point, localPos, rand } from '../minigame-base';

const W = 300;
const H = 200;
const HIT_RADIUS = 22;
const THING_LIFETIME_S = 2.2;

interface Thing {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  thorn: boolean;
}

interface TrailPoint extends Point {
  t: number;
}

function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * Affen Schritt 1, "Kraftvoll durchs Unterholz brechen": Lianen tauchen auf
 * und müssen mit gedrückter Maustaste/Finger durchgeschlagen werden.
 * Dornenbüsche 🌵 dabei unbedingt auslassen.
 */
@Component({
  selector: 'mg-slash',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats"><span>🌿 {{ cut() }}/{{ required }} durchgeschlagen</span></div>
    <div
      class="mg-area slash-area"
      (pointerdown)="onDown($event)"
      (pointermove)="onMove($event)"
      (pointerup)="slashing = false"
      (pointerleave)="slashing = false"
      (pointercancel)="slashing = false"
    >
      @for (t of things(); track t.id) {
        <div class="mg-sprite thing" [class.thorn]="t.thorn" [style.left.px]="t.x" [style.top.px]="t.y" [style.opacity]="1.15 - t.age / lifetime">
          {{ t.thorn ? '🌵' : '🌿' }}
        </div>
      }
      <svg class="trail" [attr.viewBox]="'0 0 ' + width + ' ' + height">
        <polyline [attr.points]="trailPoints()" />
      </svg>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .slash-area { height: 200px; cursor: crosshair; }
    .thing { font-size: 30px; }
    .thing.thorn { font-size: 28px; }
    .trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .trail polyline { fill: none; stroke: #f2ede3; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
  `],
})
export class SlashGame extends MinigameBase {
  readonly width = W;
  readonly height = H;
  readonly lifetime = THING_LIFETIME_S;
  required = 14;
  readonly cut = signal(0);
  readonly things = signal<Thing[]>([]);
  private readonly trail = signal<TrailPoint[]>([]);
  readonly trailPoints = computed(() => this.trail().map((p) => `${p.x},${p.y}`).join(' '));
  slashing = false;
  private lastPos: Point | null = null;
  private idCounter = 0;
  private spawnTimer = 0;

  protected start(): void {
    this.required = this.tuneInt(12, 9, 6);
    this.startClock(12000, () => this.finish(false, `${this.cut()}/${this.required} Lianen`));

    this.loop((dt, elapsed) => {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = Math.max(0.28, 0.45 - elapsed * 0.015);
        this.spawn(elapsed);
      }
      this.things.update((list) =>
        list
          .map((t) => ({ ...t, x: t.x + t.vx * dt, y: t.y + t.vy * dt, age: t.age + dt }))
          .filter((t) => t.age < THING_LIFETIME_S),
      );
      const now = performance.now();
      this.trail.update((list) => list.filter((p) => now - p.t < 160));
    });
  }

  onDown(event: PointerEvent): void {
    this.slashing = true;
    this.lastPos = localPos(event);
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  onMove(event: PointerEvent): void {
    if (!this.slashing || this.done) return;
    const pos = localPos(event);
    const from = this.lastPos ?? pos;
    this.lastPos = pos;
    this.trail.update((list) => [...list.slice(-10), { ...pos, t: performance.now() }]);

    const hit = this.things().filter((t) => distToSegment(t, from, pos) <= HIT_RADIUS);
    if (hit.length === 0) return;
    const hitIds = new Set(hit.map((t) => t.id));
    this.things.update((list) => list.filter((t) => !hitIds.has(t.id)));

    for (const t of hit) {
      if (t.thorn) {
        this.cut.update((c) => Math.max(0, c - 2));
        this.pop('Autsch! −2', true);
        this.sfx.play('miss');
      } else {
        this.cut.update((c) => c + 1);
        this.sfx.play('hit');
      }
    }
    if (this.cut() >= this.required) this.finish(true, 'Der Weg ist frei!');
  }

  private spawn(elapsed: number): void {
    const thorn = Math.random() < Math.min(0.4, 0.22 + elapsed * 0.015);
    const speed = 18 + elapsed * 3;
    this.things.update((list) => [
      ...list,
      {
        id: ++this.idCounter,
        x: rand(28, W - 28),
        y: rand(28, H - 28),
        vx: rand(-speed, speed),
        vy: rand(-speed, speed),
        age: 0,
        thorn,
      },
    ]);
  }
}
