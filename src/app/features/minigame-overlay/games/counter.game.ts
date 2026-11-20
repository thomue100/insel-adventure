import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, pick, rand } from '../minigame-base';

type Dir = 'left' | 'up' | 'right';

interface Opening {
  dir: Dir;
  feint: boolean;
}

const DIRS: Dir[] = ['left', 'up', 'right'];

/**
 * Ä-Buff Schritt 1, "Sich durchboxen": Lücken in seiner Deckung öffnen sich
 * links, oben oder rechts (🎯) und müssen mit der passenden Richtung
 * gekontert werden – immer kürzer. Grinst er dabei (😏), ist es eine Finte:
 * Wer zuschlägt, kassiert einen Konter.
 */
@Component({
  selector: 'mg-counter',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>🥊 {{ hits() }}/{{ required }} Konter</span>
      <span class="mg-hearts">{{ '❤️'.repeat(lives()) }}</span>
    </div>
    <div class="mg-area arena" [class.open]="opening() && !opening()!.feint" [class.feint]="opening()?.feint">
      <div class="mg-sprite boxer">{{ opening()?.feint ? '😏' : opening() ? '😲' : '😠' }}</div>
      <div class="mg-sprite glove gl">🥊</div>
      <div class="mg-sprite glove gr">🥊</div>
      @if (opening(); as o) {
        <div class="mg-sprite target" [class]="'at-' + o.dir">{{ o.feint ? '😏' : '🎯' }}</div>
      }
    </div>
    <div class="mg-row">
      <button class="mg-pad" (pointerdown)="punch('left')">⬅️<small>← / A</small></button>
      <button class="mg-pad" (pointerdown)="punch('up')">⬆️<small>↑ / W</small></button>
      <button class="mg-pad" (pointerdown)="punch('right')">➡️<small>→ / D</small></button>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .arena { height: 160px; transition: background 0.08s ease; }
    .arena.open { background: radial-gradient(ellipse at center, #5a2a2a 0%, #2b1414 100%); }
    .arena.feint { background: radial-gradient(ellipse at center, #2a3550 0%, #141a2b 100%); }
    .boxer { left: 50%; top: 52%; font-size: 52px; }
    .glove { top: 70%; font-size: 26px; }
    .gl { left: 34%; }
    .gr { left: 66%; transform: translate(-50%, -50%) scaleX(-1); }
    .target { font-size: 30px; animation: target-pop 0.12s ease-out; }
    .at-left { left: 15%; top: 50%; }
    .at-right { left: 85%; top: 50%; }
    .at-up { left: 50%; top: 16%; }
    @keyframes target-pop { from { scale: 0.4; } to { scale: 1; } }
  `],
})
export class CounterGame extends MinigameBase {
  readonly required = 5;
  readonly hits = signal(0);
  readonly lives = signal(3);
  readonly opening = signal<Opening | null>(null);
  private windowId: ReturnType<typeof setTimeout> | null = null;

  protected start(): void {
    this.lives.set(this.easy ? 4 : 3);
    this.startClock(this.easy ? 19000 : 16000, () => this.finish(false, `${this.hits()}/${this.required} Konter`));
    this.scheduleNext();
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    let dir: Dir | null = null;
    if (isKey(event, 'ArrowLeft', 'a')) dir = 'left';
    else if (isKey(event, 'ArrowUp', 'w')) dir = 'up';
    else if (isKey(event, 'ArrowRight', 'd')) dir = 'right';
    if (!dir) return;
    event.preventDefault();
    this.punch(dir);
  }

  punch(dir: Dir): void {
    if (this.done) return;
    const o = this.opening();
    if (!o) {
      this.penalizeTime(400);
      this.pop('Ins Leere!', true);
      this.sfx.play('click');
      return;
    }
    this.closeOpening();

    if (o.feint) {
      this.loseLife('Finte! Konter kassiert');
    } else if (o.dir !== dir) {
      this.loseLife('Geblockt!');
    } else {
      this.hits.update((h) => h + 1);
      this.sfx.play('perfect');
      this.pop('Treffer!');
      if (this.hits() >= this.required) {
        this.finish(true, 'Ä-Buff geht beeindruckt auf die Bretter!');
        return;
      }
    }
    if (!this.done) this.scheduleNext();
  }

  private loseLife(label: string): void {
    this.lives.update((l) => l - 1);
    this.sfx.play('miss');
    this.pop(label, true);
    if (this.lives() <= 0) this.finish(false, 'Ä-Buff war schneller.');
  }

  private closeOpening(): void {
    this.opening.set(null);
    this.cancel(this.windowId);
    this.windowId = null;
  }

  private scheduleNext(): void {
    this.after(rand(500, 1200), () => {
      const feint = this.hits() > 0 && Math.random() < 0.3;
      this.opening.set({ dir: pick(DIRS), feint });
      if (!feint) this.sfx.play('alert');
      const windowMs = feint ? 750 : Math.max(380, 760 - this.hits() * 70) + (this.easy ? 200 : 0);
      this.windowId = this.after(windowMs, () => {
        this.opening.set(null);
        this.windowId = null;
        this.scheduleNext();
      });
    });
  }
}
