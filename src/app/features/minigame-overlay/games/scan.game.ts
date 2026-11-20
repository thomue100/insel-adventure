import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, pick, randInt } from '../minigame-base';

const CELLS = 12;

const ROUNDS: Array<{ icon: string; name: string; decoys: string[] }> = [
  { icon: '🐾', name: 'Affenpfote', decoys: ['🍂', '🥥', '🐚', '🍃', '🌾', '🌰'] },
  { icon: '🍌', name: 'Bananenschale', decoys: ['🌙', '🍂', '🥒', '🌽', '🌾', '🍃'] },
  { icon: '✨', name: 'Kompass-Glitzern', decoys: ['⭐', '💫', '🌟', '🍂', '🥥', '🐚'] },
];

/**
 * Affen Schritt 3, "Systematisch absuchen": Ein Suchlicht geht Feld für Feld
 * durch das Gebiet und zeigt kurz, was unter dem Busch liegt. Drei Hinweise
 * in Folge finden – jede Runde schneller, ähnlich aussehende Täuschungen
 * inklusive. Falsches Zugreifen kostet ein Leben.
 */
@Component({
  selector: 'mg-scan',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>Gesucht: <b class="wanted">{{ round().icon }}</b> {{ round().name }}</span>
      <span>{{ roundIndex() + 1 }}/{{ totalRounds }}</span>
      <span class="mg-hearts">{{ '❤️'.repeat(lives()) }}</span>
    </div>
    <div class="scan-grid">
      @for (content of contents(); track $index) {
        <div class="scan-cell" [class.active]="active() === $index" [class.done]="active() === -1">
          {{ active() === $index ? content : '🌿' }}
        </div>
      }
    </div>
    <button class="mg-btn" (pointerdown)="check()">🔎 Hier! (Leertaste)</button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .wanted { font-size: 1.15rem; }
    .scan-grid { display: grid; grid-template-columns: repeat(4, 54px); gap: 6px; }
    .scan-cell {
      width: 54px; height: 46px; display: flex; align-items: center; justify-content: center;
      font-size: 22px; background: #1a2a1a; border: 1px solid #3a3a45; border-radius: 8px; opacity: 0.55;
      transition: opacity 0.08s ease, background 0.08s ease;
    }
    .scan-cell.active { opacity: 1; background: rgba(255, 230, 160, 0.28); border-color: #ffe6a0; box-shadow: 0 0 12px rgba(255, 230, 160, 0.4); }
  `],
})
export class ScanGame extends MinigameBase {
  readonly totalRounds = ROUNDS.length;
  readonly roundIndex = signal(0);
  readonly round = signal(ROUNDS[0]);
  readonly contents = signal<string[]>([]);
  readonly active = signal(0);
  readonly lives = signal(3);
  private stepAccumulator = 0;
  private paused = false;

  protected start(): void {
    this.lives.set(this.easy ? 4 : 3);
    this.startClock(this.easy ? 36000 : 30000, () => this.finish(false, `${this.roundIndex()}/${this.totalRounds} Hinweise`));
    this.setupRound(0);

    this.loop((dt) => {
      if (this.paused) return;
      this.stepAccumulator += dt * 1000;
      const stepMs = [560, 450, 360][this.roundIndex()] + (this.easy ? 120 : 0);
      if (this.stepAccumulator >= stepMs) {
        this.stepAccumulator = 0;
        this.active.update((i) => (i + 1) % CELLS);
      }
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat || !isKey(event, ' ', 'Enter')) return;
    event.preventDefault();
    this.check();
  }

  check(): void {
    if (this.done || this.paused) return;
    const found = this.contents()[this.active()] === this.round().icon;
    if (!found) {
      this.lives.update((l) => l - 1);
      this.pop('Falsch! ❤️ −1', true);
      this.sfx.play('miss');
      if (this.lives() <= 0) this.finish(false, 'Zu oft daneben gegriffen.');
      return;
    }
    this.sfx.play('perfect');
    this.pop(`${this.round().icon} gefunden!`);
    const next = this.roundIndex() + 1;
    if (next >= ROUNDS.length) {
      this.finish(true, 'Alle Hinweise gefunden – das Versteck ist klar!');
      return;
    }
    // Kurze Pause, damit der Fund sichtbar bleibt, dann neue Runde.
    this.paused = true;
    this.after(600, () => this.setupRound(next));
  }

  private setupRound(index: number): void {
    const round = ROUNDS[index];
    const targetCell = randInt(0, CELLS - 1);
    this.contents.set(Array.from({ length: CELLS }, (_, i) => (i === targetCell ? round.icon : pick(round.decoys))));
    this.roundIndex.set(index);
    this.round.set(round);
    this.active.set(0);
    this.stepAccumulator = 0;
    this.paused = false;
  }
}
