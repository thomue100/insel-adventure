import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, randInt } from '../minigame-base';

const SYMBOLS = ['☀️', '🌙', '⭐', '🔥'];
const RINGS = 4;

/**
 * Königsschatz, "Den Mechanismus entschlüsseln": Vier steinerne Drehringe
 * müssen auf die Symbolfolge an der Tempelwand gebracht werden. Der Haken:
 * Jeder Ring nimmt beim Drehen seinen rechten Nachbarn mit (🔗). Mit
 * begrenzten Zügen die richtige Reihenfolge finden – ein echtes Logikrätsel.
 */
@Component({
  selector: 'mg-wheels',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="wall">
      <span class="wall-label">Tempelwand</span>
      @for (s of target(); track $index) {
        <span class="glyph">{{ symbols[s] }}</span>
      }
    </div>
    <div class="rings">
      @for (s of current(); track $index) {
        <button class="ring" [class.match]="s === target()[$index]" (pointerdown)="rotate($index)" [style.--turns]="turns()[$index]">
          <span class="ring-symbol">{{ symbols[s] }}</span>
          <small>{{ $index + 1 }}</small>
        </button>
        @if ($index < ringCount - 1) {
          <span class="link">🔗</span>
        }
      }
    </div>
    <div class="mg-stats">
      <span>Züge übrig: <b>{{ movesLeft() }}</b></span>
      <span class="mg-line">Ring dreht den rechten Nachbarn mit!</span>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .wall { display: flex; gap: 10px; align-items: center; padding: 0.4rem 0.8rem; background: #3a3428; border: 2px solid #5b5a56; border-radius: 8px; }
    .wall-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; margin-right: 4px; }
    .glyph { font-size: 26px; }
    .rings { display: flex; align-items: center; gap: 2px; }
    .link { font-size: 12px; opacity: 0.7; }
    .ring {
      width: 60px; height: 60px; border-radius: 50%; cursor: pointer; touch-action: manipulation; position: relative;
      background: radial-gradient(circle, #6a6660 0%, #3a3833 70%); border: 3px solid #2a2824; font-family: inherit;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .ring-symbol { display: inline-block; font-size: 26px; transform: rotate(calc(var(--turns) * 360deg)); transition: transform 0.3s ease; }
    .ring small { position: absolute; bottom: -2px; right: 2px; font-size: 0.55rem; color: #f2ede3; opacity: 0.5; }
    .ring.match { border-color: #8fd68a; box-shadow: 0 0 10px rgba(143, 214, 138, 0.5); }
    .ring:active { scale: 0.95; }
  `],
})
export class WheelsGame extends MinigameBase {
  readonly symbols = SYMBOLS;
  readonly ringCount = RINGS;
  readonly target = signal<number[]>([]);
  readonly current = signal<number[]>([]);
  readonly turns = signal<number[]>(Array(RINGS).fill(0));
  readonly movesLeft = signal(0);
  readonly solved = computed(() => this.current().every((v, i) => v === this.target()[i]));

  protected start(): void {
    const target = Array.from({ length: RINGS }, () => randInt(0, SYMBOLS.length - 1));

    // Lösung rückwärts erzeugen: garantiert lösbar, mit bekannter Minimal-Zugzahl.
    let clicks: number[];
    do {
      clicks = Array.from({ length: RINGS }, () => randInt(0, 3));
    } while (clicks.reduce((a, b) => a + b, 0) < 4);
    const current = target.map((t, i) => {
      const offset = clicks[i] + (i > 0 ? clicks[i - 1] : 0);
      return (((t - offset) % 4) + 4) % 4;
    });
    const optimal = clicks.reduce((a, b) => a + b, 0);

    this.target.set(target);
    this.current.set(current);
    this.movesLeft.set(optimal + this.tuneInt(4, 7, 1));
    this.startClock(this.tune(40000, 50000), () => this.finish(false, 'Der Mechanismus rastet ein – zu spät.'));
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    const index = ['1', '2', '3', '4'].findIndex((k) => isKey(event, k));
    if (index < 0) return;
    event.preventDefault();
    this.rotate(index);
  }

  rotate(index: number): void {
    if (this.done || this.movesLeft() <= 0) return;
    const affected = index < RINGS - 1 ? [index, index + 1] : [index];
    this.current.update((c) => c.map((v, i) => (affected.includes(i) ? (v + 1) % SYMBOLS.length : v)));
    this.turns.update((t) => t.map((v, i) => (affected.includes(i) ? v + 0.25 : v)));
    this.movesLeft.update((m) => m - 1);
    this.sfx.play('click');

    if (this.solved()) {
      this.sfx.play('win');
      this.finish(true, 'Mit einem Grollen öffnet sich die Schatzkammer!');
    } else if (this.movesLeft() <= 0) {
      this.finish(false, 'Keine Züge mehr – der Mechanismus blockiert.');
    }
  }
}
