import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, randInt } from '../minigame-base';

const LANES = [
  { icon: '⬅️', keys: ['ArrowLeft', 'a'], label: '←' },
  { icon: '⬇️', keys: ['ArrowDown', 's'], label: '↓' },
  { icon: '⬆️', keys: ['ArrowUp', 'w'], label: '↑' },
  { icon: '➡️', keys: ['ArrowRight', 'd'], label: '→' },
];
const LANE_W = 62;
const AREA_H = 220;
const HIT_Y = 188;
const NOTE_COUNT = 18;

interface Note {
  id: number;
  lane: number;
  time: number;
  travel: number;
  judged: boolean;
}

/**
 * Dorf Schritt 2, Tanzwettbewerb: Pfeile fallen in vier Bahnen auf die
 * Trefferlinie und müssen im richtigen Moment gedrückt werden (Tastatur oder
 * Tippen auf die Bahn-Buttons). Das Tempo zieht an, später kommen
 * Doppelschritte. Ziel: mehr Schritte schaffen als die Tänzerin des Dorfes.
 */
@Component({
  selector: 'mg-dance',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>💃 Deine Schritte: <b>{{ hits() }}</b></span>
      <span>🥁 Zu schlagen: <b>{{ rivalScore }}</b></span>
      <span>Combo {{ combo() }}{{ combo() >= 5 ? ' 🔥' : '' }}</span>
    </div>
    <div class="mg-area dance-floor">
      @for (lane of lanes; track $index) {
        <div class="lane" [style.left.px]="$index * laneWidth" [class.pressed]="pressedLane() === $index"></div>
        <div class="target" [style.left.px]="$index * laneWidth + laneWidth / 2" [style.top.px]="hitY">{{ lane.icon }}</div>
      }
      @for (n of visibleNotes(); track n.id) {
        <div class="mg-sprite arrow" [style.left.px]="n.lane * laneWidth + laneWidth / 2" [style.top.px]="n.y">{{ lanes[n.lane].icon }}</div>
      }
    </div>
    <div class="mg-row">
      @for (lane of lanes; track $index) {
        <button class="mg-pad lane-btn" (pointerdown)="hitLane($index)">{{ lane.icon }}<small>{{ lane.label }}</small></button>
      }
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .dance-floor { width: 248px; height: 220px; background: linear-gradient(180deg, #2a1830 0%, #1a1020 100%); }
    .lane { position: absolute; top: 0; bottom: 0; width: 62px; border-right: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.06s ease; }
    .lane.pressed { background: rgba(224, 164, 88, 0.15); }
    .target { position: absolute; transform: translate(-50%, -50%); font-size: 26px; opacity: 0.3; filter: grayscale(1); }
    .arrow { font-size: 28px; }
    .lane-btn { min-width: 54px; }
  `],
})
export class DanceGame extends MinigameBase {
  readonly lanes = LANES;
  readonly laneWidth = LANE_W;
  readonly hitY = HIT_Y;
  rivalScore = 12;
  readonly hits = signal(0);
  readonly combo = signal(0);
  readonly pressedLane = signal(-1);
  private readonly now = signal(0);
  private readonly version = signal(0);
  private notes: Note[] = [];
  private startAt = 0;
  private perfectWindow = 70;
  private goodWindow = 130;

  readonly visibleNotes = computed(() => {
    this.version();
    const now = this.now();
    return this.notes
      .filter((n) => !n.judged && n.time - now < n.travel && n.time - now > -200)
      .map((n) => ({ id: n.id, lane: n.lane, y: HIT_Y - ((n.time - now) / n.travel) * HIT_Y }));
  });

  protected start(): void {
    this.rivalScore = randInt(12, 14) - (this.easy ? 2 : 0);
    const scale = this.easy ? 1.3 : 1;
    this.perfectWindow = 70 * scale;
    this.goodWindow = 130 * scale;

    let t = 1500;
    let id = 0;
    let lastLane = -1;
    for (let i = 0; i < NOTE_COUNT && this.notes.length < NOTE_COUNT; i++) {
      const progress = i / (NOTE_COUNT - 1);
      const travel = 1500 - 350 * progress;
      let lane = randInt(0, 3);
      if (lane === lastLane) lane = (lane + randInt(1, 3)) % 4;
      lastLane = lane;
      this.notes.push({ id: id++, lane, time: t, travel, judged: false });
      // Ab der zweiten Hälfte gelegentlich Doppelschritte (zwei Bahnen gleichzeitig).
      if (progress > 0.5 && Math.random() < 0.3 && this.notes.length < NOTE_COUNT) {
        this.notes.push({ id: id++, lane: (lane + 2) % 4, time: t, travel, judged: false });
      }
      t += 650 - 230 * progress;
    }

    this.startAt = performance.now();
    this.loop(() => {
      const now = performance.now() - this.startAt;
      this.now.set(now);
      let changed = false;
      for (const n of this.notes) {
        if (!n.judged && now - n.time > this.goodWindow) {
          n.judged = true;
          changed = true;
          this.combo.set(0);
          this.pop('Verpasst', true);
        }
      }
      if (changed) {
        this.version.update((v) => v + 1);
        this.checkEnd();
      }
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    const lane = LANES.findIndex((l) => isKey(event, ...l.keys));
    if (lane < 0) return;
    event.preventDefault();
    this.hitLane(lane);
  }

  hitLane(lane: number): void {
    if (this.done) return;
    this.pressedLane.set(lane);
    this.after(100, () => {
      if (this.pressedLane() === lane) this.pressedLane.set(-1);
    });

    const now = performance.now() - this.startAt;
    let best: Note | null = null;
    for (const n of this.notes) {
      if (n.lane !== lane || n.judged) continue;
      if (!best || Math.abs(n.time - now) < Math.abs(best.time - now)) best = n;
    }
    const delta = best ? Math.abs(best.time - now) : Infinity;
    if (!best || delta > this.goodWindow) {
      this.combo.set(0);
      this.sfx.play('miss');
      this.pop('Fehltritt', true);
      return;
    }
    best.judged = true;
    this.version.update((v) => v + 1);
    this.hits.update((h) => h + 1);
    this.combo.update((c) => c + 1);
    if (delta <= this.perfectWindow) {
      this.sfx.play('perfect');
      this.pop('Perfekt!');
    } else {
      this.sfx.play('hit');
      this.pop('Gut');
    }
    this.checkEnd();
  }

  private checkEnd(): void {
    const remaining = this.notes.filter((n) => !n.judged).length;
    if (this.hits() + remaining < this.rivalScore) {
      this.finish(false, `${this.hits()} Schritte – die Tänzerin schaffte ${this.rivalScore}.`);
    } else if (remaining === 0) {
      this.finish(true, `${this.hits()} Schritte – das ganze Dorf jubelt!`);
    }
  }
}
