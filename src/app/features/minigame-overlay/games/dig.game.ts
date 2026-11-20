import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, randInt } from '../minigame-base';

const COLS = 5;
const ROWS = 4;

type Cell = { state: 'hidden' } | { state: 'dug'; dist: number } | { state: 'found' };

const HINTS: Array<{ icon: string; label: string }> = [
  { icon: '🧭', label: 'Gefunden!' },
  { icon: '🔥', label: 'direkt daneben' },
  { icon: '♨️', label: '2 Felder entfernt' },
  { icon: '🌤️', label: '3 Felder entfernt' },
  { icon: '❄️', label: 'weit weg' },
];

/**
 * Affen Schritt 3, "Dem Bauchgefühl folgen": Heiß-kalt-Suche. Jedes
 * gegrabene Loch verrät, wie weit das Versteck entfernt ist (auch diagonal
 * gezählt). Mit wenigen Versuchen aus den Hinweisen auf das Versteck schließen.
 */
@Component({
  selector: 'mg-dig',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats"><span>⛏️ Noch {{ attempts() }} Versuche</span></div>
    <div class="dig-grid">
      @for (cell of cells(); track $index) {
        <button
          class="dig-cell"
          [class.dug]="cell.state === 'dug'"
          [class.found]="cell.state === 'found'"
          [disabled]="cell.state !== 'hidden'"
          [title]="cell.state === 'dug' ? hintFor(cell.dist).label : ''"
          (pointerdown)="dig($index)"
        >
          {{ cell.state === 'found' ? '🧭' : cell.state === 'dug' ? hintFor(cell.dist).icon : '⛰️' }}
        </button>
      }
    </div>
    <div class="legend">🔥 daneben · ♨️ 2 Felder · 🌤️ 3 Felder · ❄️ weiter</div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .dig-grid { display: grid; grid-template-columns: repeat(5, 52px); gap: 6px; }
    .dig-cell {
      width: 52px; height: 52px; font-size: 22px;
      background: radial-gradient(ellipse at center, #4a3a22 0%, #2a2014 100%);
      border: 1px solid #3a3a45; border-radius: 8px; cursor: pointer;
      touch-action: manipulation; transition: transform 0.05s ease;
    }
    .dig-cell:active:not(:disabled) { transform: scale(0.92); }
    .dig-cell.dug { background: #1a140c; cursor: default; }
    .dig-cell.found { border-color: var(--accent-color, #e0a458); background: rgba(224, 164, 88, 0.3); }
    .legend { font-size: 0.72rem; opacity: 0.7; }
  `],
})
export class DigGame extends MinigameBase {
  readonly cells = signal<Cell[]>(Array.from({ length: COLS * ROWS }, () => ({ state: 'hidden' as const })));
  readonly attempts = signal(5);
  private target = 0;

  protected start(): void {
    this.target = randInt(0, COLS * ROWS - 1);
    this.attempts.set(this.tuneInt(5, 6, 3));
    this.startClock(this.tune(30000, 36000), () => this.finish(false, 'Die Zeit ist um.'));
  }

  hintFor(dist: number): { icon: string; label: string } {
    return HINTS[Math.min(dist, HINTS.length - 1)];
  }

  dig(index: number): void {
    if (this.done || this.cells()[index].state !== 'hidden') return;
    const dist = Math.max(
      Math.abs((index % COLS) - (this.target % COLS)),
      Math.abs(Math.floor(index / COLS) - Math.floor(this.target / COLS)),
    );
    const next = [...this.cells()];
    if (dist === 0) {
      next[index] = { state: 'found' };
      this.cells.set(next);
      this.sfx.play('perfect');
      this.finish(true, `Versteck nach ${this.usedAttempts() + 1} Versuchen gefunden!`);
      return;
    }
    next[index] = { state: 'dug', dist };
    this.cells.set(next);
    this.attempts.update((a) => a - 1);
    this.sfx.play(dist === 1 ? 'hit' : 'click');
    this.pop(this.hintFor(dist).label, dist > 2);

    if (this.attempts() <= 0) {
      // Zur Auflösung das Versteck zeigen.
      const reveal = [...this.cells()];
      reveal[this.target] = { state: 'found' };
      this.cells.set(reveal);
      this.finish(false, 'Knapp daneben – das Versteck lag woanders.');
    }
  }

  private usedAttempts(): number {
    return this.cells().filter((c) => c.state === 'dug').length;
  }
}
