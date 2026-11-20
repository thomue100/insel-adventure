import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, Point, clamp, distance, rand } from '../minigame-base';

const W = 300;
const H = 180;
const MARGIN = 22;

interface Print {
  id: number;
  x: number;
  y: number;
  rot: number;
  decoy: boolean;
  life: number;
}

/**
 * Affen Schritt 1, "Vorsichtig den Spuren folgen": Die Fußspuren bilden eine
 * zusammenhängende Fährte. Jeder Abdruck verblasst schnell (der Ring
 * schrumpft) – wer zu langsam ist, verliert die Spur (Leben). Falsche
 * Tierspuren 🐾 kosten Zeit.
 */
@Component({
  selector: 'mg-track',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>👣 {{ hits() }}/{{ required }}</span>
      <span class="mg-hearts">{{ '❤️'.repeat(lives()) }}{{ '🖤'.repeat(maxLives - lives()) }}</span>
    </div>
    <div class="mg-area track-area">
      @for (t of trail(); track $index) {
        <div class="mg-sprite old-print" [style.left.px]="t.x" [style.top.px]="t.y">👣</div>
      }
      @for (p of prints(); track p.id) {
        <div class="fade-ring" [style.left.px]="p.x" [style.top.px]="p.y" [style.animation-duration.ms]="p.life"></div>
        <button
          class="print"
          [class.decoy]="p.decoy"
          [style.left.px]="p.x"
          [style.top.px]="p.y"
          [style.transform]="'translate(-50%, -50%) rotate(' + p.rot + 'deg)'"
          (pointerdown)="onPrint(p, $event)"
        >
          {{ p.decoy ? '🐾' : '👣' }}
        </button>
      }
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .track-area { background: radial-gradient(ellipse at center, #3a3020 0%, #1f1a10 100%); }
    .old-print { font-size: 16px; opacity: 0.22; }
    .print {
      position: absolute;
      width: 44px;
      height: 44px;
      font-size: 24px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      touch-action: manipulation;
      filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.7));
    }
    .fade-ring {
      position: absolute;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 2px solid rgba(224, 164, 88, 0.8);
      pointer-events: none;
      animation-name: mg-shrink;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }
  `],
})
export class TrackGame extends MinigameBase {
  readonly required = 7;
  maxLives = 3;
  readonly hits = signal(0);
  readonly lives = signal(3);
  readonly prints = signal<Print[]>([]);
  readonly trail = signal<Point[]>([]);

  private idCounter = 0;
  private heading = rand(0, Math.PI * 2);
  private last: Point = { x: W / 2, y: H / 2 };
  private expiryId: ReturnType<typeof setTimeout> | null = null;

  protected start(): void {
    this.maxLives = this.easy ? 4 : 3;
    this.lives.set(this.maxLives);
    this.startClock(this.easy ? 20000 : 16000, () => this.finish(false, `${this.hits()}/${this.required} Spuren`));
    this.spawnNext();
  }

  onPrint(print: Print, event: PointerEvent): void {
    event.stopPropagation();
    if (this.done) return;

    if (print.decoy) {
      this.penalizeTime(1500);
      this.pop('Falsche Spur! −1,5 s', true);
      this.sfx.play('miss');
      this.prints.update((list) => list.filter((p) => p.id !== print.id));
      return;
    }

    this.cancel(this.expiryId);
    this.sfx.play('hit');
    this.hits.update((h) => h + 1);
    this.last = { x: print.x, y: print.y };
    this.trail.update((t) => [...t.slice(-5), this.last]);
    if (this.hits() >= this.required) {
      this.finish(true, 'Die Fährte führt direkt zu den Affen!');
      return;
    }
    this.spawnNext();
  }

  private spawnNext(): void {
    // Nächster Abdruck liegt in Laufrichtung, die Richtung driftet leicht.
    this.heading += rand(-0.9, 0.9);
    const step = rand(55, 85);
    let x = this.last.x + Math.cos(this.heading) * step;
    let y = this.last.y + Math.sin(this.heading) * step;
    if (x < MARGIN || x > W - MARGIN || y < MARGIN || y > H - MARGIN) {
      this.heading += Math.PI; // am Rand umkehren
      x = this.last.x + Math.cos(this.heading) * step;
      y = this.last.y + Math.sin(this.heading) * step;
    }
    x = clamp(x, MARGIN, W - MARGIN);
    y = clamp(y, MARGIN, H - MARGIN);

    const life = Math.max(800, 1500 - this.hits() * 90) + (this.easy ? 400 : 0);
    const rot = (this.heading * 180) / Math.PI + 90;
    const prints: Print[] = [{ id: ++this.idCounter, x, y, rot, decoy: false, life }];

    if (this.hits() > 0 && Math.random() < 0.5) {
      let decoyPos: Point;
      let tries = 0;
      do {
        decoyPos = { x: rand(MARGIN, W - MARGIN), y: rand(MARGIN, H - MARGIN) };
        tries++;
      } while (distance(decoyPos, { x, y }) < 70 && tries < 20);
      prints.push({ id: ++this.idCounter, ...decoyPos, rot: rand(0, 360), decoy: true, life });
    }
    this.prints.set(prints);

    this.expiryId = this.after(life, () => {
      this.lives.update((l) => l - 1);
      this.sfx.play('miss');
      this.pop('Spur verloren!', true);
      if (this.lives() <= 0) {
        this.finish(false, 'Die Fährte ist kalt geworden.');
        return;
      }
      this.spawnNext();
    });
  }
}
