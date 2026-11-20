import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey } from '../minigame-base';

const W = 300;
const HIT_X = 42;
const TRAVEL_MS = 1600;
const NOTE_COUNT = 14;

interface Note {
  id: number;
  time: number;
  judged: boolean;
}

/**
 * Ä-Buff Schritt 1, "Ä-Buff beruhigen": Echtes Rhythmusspiel. Schläge laufen
 * auf die Trefferzone zu und müssen im Takt mitgeklatscht werden. Je besser
 * man trifft, desto ruhiger wird Ä-Buff – und das Tempo wird langsamer.
 * Klatschen außerhalb des Takts bringt ihn wieder auf die Palme.
 */
@Component({
  selector: 'mg-beat',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="face">{{ face() }}</div>
    <div class="mg-area beat-track" (pointerdown)="tap()">
      <div class="hit-zone" [class.flash]="flash()"></div>
      @for (n of visibleNotes(); track n.id) {
        <div class="note" [style.left.px]="n.x"></div>
      }
    </div>
    <div class="mg-meter" [class.danger]="calm() < 35">
      <div class="mg-meter-fill" [style.width.%]="calm()"></div><span class="mg-meter-label">Ruhe · Ziel {{ goal }} %</span>
    </div>
    <div class="mg-stats"><span>Combo {{ combo() }}{{ combo() >= 5 ? ' 🔥' : '' }}</span></div>
    <button class="mg-btn" (pointerdown)="tap()">👏 Klatschen (Leertaste)</button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .face { font-size: 40px; line-height: 1; }
    .beat-track { height: 64px; background: linear-gradient(180deg, #2a1f14 0%, #1a130c 100%); cursor: pointer; }
    .hit-zone {
      position: absolute; left: 42px; top: 50%; width: 44px; height: 44px; transform: translate(-50%, -50%);
      border-radius: 50%; border: 3px solid var(--accent-color, #e0a458); transition: background 0.08s ease;
    }
    .hit-zone.flash { background: rgba(224, 164, 88, 0.45); }
    .note {
      position: absolute; top: 50%; width: 26px; height: 26px; transform: translate(-50%, -50%);
      border-radius: 50%; background: #f2d19a; box-shadow: 0 0 8px rgba(242, 209, 154, 0.7);
    }
  `],
})
export class BeatGame extends MinigameBase {
  readonly calm = signal(30);
  readonly combo = signal(0);
  readonly flash = signal(false);
  goal = 70;
  private readonly now = signal(0);
  private notes: Note[] = [];
  private readonly notesVersion = signal(0);
  private startAt = 0;
  private perfectWindow = 70;
  private goodWindow = 150;

  readonly face = computed(() => {
    const c = this.calm();
    return c < 35 ? '😡' : c < 60 ? '😠' : c < 85 ? '😐' : '😌';
  });

  readonly visibleNotes = computed(() => {
    this.notesVersion();
    const now = this.now();
    return this.notes
      .filter((n) => !n.judged && n.time - now < TRAVEL_MS && n.time - now > -250)
      .map((n) => ({ id: n.id, x: HIT_X + ((n.time - now) / TRAVEL_MS) * (W - HIT_X) }));
  });

  protected start(): void {
    this.goal = this.tune(65, 55);
    const scale = this.tune(1.1, 1.45);
    this.perfectWindow = 70 * scale;
    this.goodWindow = 150 * scale;

    // Tempo wird von hektisch (480 ms) zu gemütlich (820 ms) – Ä-Buff kommt runter.
    this.startAt = performance.now();
    let t = 1400;
    this.notes = Array.from({ length: NOTE_COUNT }, (_, i) => {
      const note = { id: i, time: t, judged: false };
      t += 480 + (340 * i) / (NOTE_COUNT - 1);
      return note;
    });

    this.loop(() => {
      const now = performance.now() - this.startAt;
      this.now.set(now);
      for (const n of this.notes) {
        if (!n.judged && now - n.time > this.goodWindow) {
          n.judged = true;
          this.notesVersion.update((v) => v + 1);
          this.judge(-8, 'Verpasst', true);
        }
      }
      const last = this.notes[this.notes.length - 1];
      if (last.judged && now > last.time + 400) {
        const ok = this.calm() >= this.goal;
        this.finish(ok, `${Math.round(this.calm())} % Ruhe`);
      }
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat || !isKey(event, ' ', 'Enter')) return;
    event.preventDefault();
    this.tap();
  }

  tap(): void {
    if (this.done) return;
    const now = performance.now() - this.startAt;
    this.flash.set(true);
    this.after(90, () => this.flash.set(false));

    let best: Note | null = null;
    for (const n of this.notes) {
      if (!n.judged && (!best || Math.abs(n.time - now) < Math.abs(best.time - now))) best = n;
    }
    const delta = best ? Math.abs(best.time - now) : Infinity;

    if (best && delta <= this.goodWindow) {
      best.judged = true;
      this.notesVersion.update((v) => v + 1);
      if (delta <= this.perfectWindow) {
        this.sfx.play('perfect');
        this.judge(11, 'Perfekt!', false);
      } else {
        this.sfx.play('hit');
        this.judge(6, 'Gut', false);
      }
    } else if (best && delta <= 280) {
      best.judged = true;
      this.notesVersion.update((v) => v + 1);
      this.judge(-6, 'Daneben', true);
    } else {
      this.judge(-5, 'Aus dem Takt!', true);
    }
  }

  private judge(delta: number, label: string, bad: boolean): void {
    if (bad) {
      this.combo.set(0);
      this.sfx.play('miss');
    } else {
      this.combo.update((c) => c + 1);
    }
    const bonus = !bad && this.combo() >= 5 ? 2 : 0;
    this.calm.update((c) => clamp(c + delta + bonus, 0, 100));
    this.pop(label, bad);
    if (this.calm() >= 100) this.finish(true, 'Ä-Buff ist tiefenentspannt.');
  }
}
