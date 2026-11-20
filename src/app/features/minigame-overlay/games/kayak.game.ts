import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey, rand } from '../minigame-base';

type Side = 'left' | 'right';

const W = 300;
const H = 240;
const KAYAK_Y = 205;
const ROCK_RADIUS = 20;

interface Rock {
  id: number;
  x: number;
  d: number; // Position entlang der Strecke (px)
  icon: string;
}

/**
 * Finale Schritt 1, "Leise über die Bucht paddeln": Jeder Paddelschlag gibt
 * Fahrt und versetzt das Kajak leicht zur Seite des Schlags – abwechselnd
 * paddeln fährt geradeaus, zweimal dieselbe Seite lenkt. Felsen und Krokodilen
 * ausweichen. Hektisches Paddeln oder Zusammenstöße machen Lärm; zu viel
 * Lärm und die Flucht fliegt auf.
 */
@Component({
  selector: 'mg-kayak',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-area bay" [style.background-position-y.px]="scroll() % 40">
      <div class="mg-sprite ship" [style.top.px]="shipY()">🚢</div>
      @for (r of visibleRocks(); track r.id) {
        <div class="mg-sprite rock" [style.left.px]="r.x" [style.top.px]="r.y">{{ r.icon }}</div>
      }
      <div class="mg-sprite kayak" [class.bump]="invulnerable()" [style.left.px]="x()" [style.top.px]="kayakY">🛶</div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="distancePct()"></div><span class="mg-meter-label">Strecke</span></div>
    <div class="mg-meter" [class.danger]="noise() > 60"><div class="mg-meter-fill" [style.width.%]="noise()"></div><span class="mg-meter-label">Lärm</span></div>
    <div class="mg-row">
      <button class="mg-pad" (pointerdown)="paddle('left')">🚣⬅️<small>← / A</small></button>
      <button class="mg-pad" (pointerdown)="paddle('right')">➡️🚣<small>→ / D</small></button>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .bay {
      height: 240px;
      background-color: #12304a;
      background-image: repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 40px);
    }
    .ship { left: 50%; font-size: 40px; }
    .rock { font-size: 26px; }
    .kayak { font-size: 30px; rotate: -90deg; }
    .kayak.bump { animation: mg-blink 0.15s linear infinite alternate; }
  `],
})
export class KayakGame extends MinigameBase {
  readonly kayakY = KAYAK_Y;
  readonly x = signal(W / 2);
  readonly travelled = signal(0);
  readonly noise = signal(0);
  readonly invulnerable = signal(false);
  private trackLength = 1700;
  private rocks: Rock[] = [];
  private speed = 0;
  private lateral = 0;
  private lastStrokeAt = 0;
  private noiseGain = 1;

  readonly scroll = computed(() => this.travelled());
  readonly distancePct = computed(() => clamp((this.travelled() / this.trackLength) * 100, 0, 100));
  /** Das Schiff taucht gegen Ende oben auf und kommt näher. */
  readonly shipY = computed(() => -30 + (this.distancePct() / 100) * 70);
  readonly visibleRocks = computed(() => {
    const travelled = this.travelled();
    return this.rocks
      .map((r) => ({ ...r, y: KAYAK_Y - (r.d - travelled) }))
      .filter((r) => r.y > -30 && r.y < H + 30);
  });

  protected start(): void {
    this.noiseGain = this.tune(0.9, 0.65);
    let d = 260;
    let id = 0;
    while (d < this.trackLength - 120) {
      this.rocks.push({ id: id++, x: rand(25, W - 25), d, icon: Math.random() < 0.7 ? '⛰️' : '🐊' });
      if (Math.random() < 0.35) this.rocks.push({ id: id++, x: rand(25, W - 25), d: d + rand(-20, 20), icon: '⛰️' });
      d += rand(110, 170);
    }

    this.startClock(this.tune(24000, 28000), () => this.finish(false, 'Zu langsam – der Morgen graut.'));

    this.loop((dt) => {
      this.speed *= Math.pow(0.5, dt);
      this.lateral *= Math.pow(0.15, dt);
      this.x.update((x) => clamp(x + this.lateral * dt, 18, W - 18));
      this.travelled.update((t) => t + this.speed * dt);
      this.noise.update((n) => Math.max(0, n - 8 * dt));

      if (!this.invulnerable()) {
        const hit = this.visibleRocks().find((r) => Math.abs(r.x - this.x()) < ROCK_RADIUS && Math.abs(r.y - KAYAK_Y) < ROCK_RADIUS);
        if (hit) {
          this.addNoise(30, 'PLATSCH!');
          this.speed *= 0.3;
          this.invulnerable.set(true);
          this.after(1000, () => this.invulnerable.set(false));
        }
      }
      if (this.travelled() >= this.trackLength) this.finish(true, 'Unbemerkt am Schiff angekommen!');
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    if (isKey(event, 'ArrowLeft', 'a')) this.paddle('left');
    else if (isKey(event, 'ArrowRight', 'd')) this.paddle('right');
    else return;
    event.preventDefault();
  }

  paddle(side: Side): void {
    if (this.done) return;
    const now = performance.now();
    const sinceLast = now - this.lastStrokeAt;
    this.lastStrokeAt = now;

    if (sinceLast < 230) {
      this.addNoise(12, 'Zu hektisch!');
      return;
    }
    this.speed = Math.min(150, this.speed + 55);
    this.lateral += side === 'left' ? -70 : 70;
    this.sfx.tone(side === 'left' ? 300 : 340, 0.05, 'triangle', 0.03);
  }

  private addNoise(amount: number, label: string): void {
    this.noise.update((n) => n + amount * this.noiseGain);
    this.sfx.play('miss');
    this.pop(label, true);
    if (this.noise() >= 100) this.finish(false, 'Zu laut – ihr wurdet entdeckt!');
  }
}
