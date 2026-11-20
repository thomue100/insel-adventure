import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, randInt } from '../minigame-base';

const PADS = [
  { icon: '🏆', color: '#e0a458', freq: 392, key: '1' },
  { icon: '⚔️', color: '#6fa8dc', freq: 494, key: '2' },
  { icon: '🔥', color: '#e07a5f', freq: 587, key: '3' },
  { icon: '💥', color: '#8fd68a', freq: 659, key: '4' },
];

/**
 * Ä-Buff Schritt 2, "Kampfgeschichten austauschen": Simon-Says-artiges
 * Überbieten. Ä-Buff erzählt eine immer längere Abfolge von Heldentaten,
 * die man exakt nachspielen muss – jede Runde etwas schneller. Fehler
 * kosten ein Leben, die Runde wird dann wiederholt.
 */
@Component({
  selector: 'mg-simon',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>Runde {{ round() }}/{{ maxRound }}</span>
      <span class="mg-hearts">{{ '❤️'.repeat(lives()) }}</span>
    </div>
    <div class="mg-line" [class.alert]="phase() === 'input'">
      {{ phase() === 'preview' ? '👂 Ä-Buff erzählt … gut merken!' : phase() === 'input' ? '🗣️ Du bist dran! (' + inputIndex() + '/' + round() + ')' : '' }}
    </div>
    <div class="pads">
      @for (pad of pads; track $index) {
        <button
          class="pad"
          [style.--pad-color]="pad.color"
          [class.lit]="lit() === $index"
          [disabled]="phase() !== 'input'"
          (pointerdown)="press($index)"
        >
          {{ pad.icon }}<small>{{ pad.key }}</small>
        </button>
      }
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .pads { display: grid; grid-template-columns: repeat(2, 92px); gap: 10px; }
    .pad {
      height: 74px; font-size: 30px; border-radius: 14px; cursor: pointer; touch-action: manipulation;
      background: color-mix(in srgb, var(--pad-color) 22%, #141418);
      border: 2px solid color-mix(in srgb, var(--pad-color) 55%, transparent);
      transition: transform 0.06s ease, background 0.08s ease, box-shadow 0.08s ease;
    }
    .pad small { display: block; font-size: 0.6rem; opacity: 0.55; color: #f2ede3; }
    .pad.lit { background: var(--pad-color); box-shadow: 0 0 18px var(--pad-color); transform: scale(1.05); }
    .pad:disabled { cursor: default; }
  `],
})
export class SimonGame extends MinigameBase {
  readonly pads = PADS;
  maxRound = 5;
  readonly round = signal(1);
  readonly lives = signal(2);
  readonly phase = signal<'preview' | 'input' | 'pause'>('pause');
  readonly lit = signal(-1);
  readonly inputIndex = signal(0);
  private sequence: number[] = [];

  protected start(): void {
    this.maxRound = this.tuneInt(5, 4, 3);
    this.lives.set(this.tuneInt(2, 3));
    this.sequence = Array.from({ length: this.maxRound }, () => randInt(0, PADS.length - 1));
    this.startClock(this.tune(45000, 55000), () => this.finish(false, `Runde ${this.round()} nicht geschafft`));
    this.after(500, () => this.playPreview());
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    const index = PADS.findIndex((p) => isKey(event, p.key));
    if (index < 0) return;
    event.preventDefault();
    this.press(index);
  }

  press(index: number): void {
    if (this.done || this.phase() !== 'input') return;
    this.light(index, 180);

    if (index !== this.sequence[this.inputIndex()]) {
      this.lives.update((l) => l - 1);
      this.sfx.play('miss');
      this.pop('Falsche Geschichte!', true);
      if (this.lives() <= 0) {
        this.finish(false, `In Runde ${this.round()} den Faden verloren.`);
        return;
      }
      this.phase.set('pause');
      this.after(900, () => this.playPreview());
      return;
    }

    this.inputIndex.update((i) => i + 1);
    if (this.inputIndex() < this.round()) return;

    if (this.round() >= this.maxRound) {
      this.sfx.play('win');
      this.finish(true, 'Ä-Buff ist sprachlos – du hast ihn überboten!');
      return;
    }
    this.phase.set('pause');
    this.pop('Überboten!');
    this.after(700, () => {
      this.round.update((r) => r + 1);
      this.playPreview();
    });
  }

  private playPreview(): void {
    this.phase.set('preview');
    this.inputIndex.set(0);
    const stepMs = Math.max(330, 680 - this.round() * 70);
    let i = 0;
    const next = () => {
      if (i >= this.round()) {
        this.phase.set('input');
        return;
      }
      this.light(this.sequence[i], stepMs * 0.7);
      i++;
      this.after(stepMs, next);
    };
    next();
  }

  private light(index: number, ms: number): void {
    this.lit.set(index);
    this.sfx.tone(PADS[index].freq, ms / 1000, 'triangle', 0.08);
    this.after(ms, () => {
      if (this.lit() === index) this.lit.set(-1);
    });
  }
}
