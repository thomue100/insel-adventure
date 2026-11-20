import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, distance, localPos, rand } from '../minigame-base';

const W = 300;
const H = 180;

/**
 * Raschel-Tier, "Ruhig bleiben": Das zittrige Gebüsch wandert immer schneller
 * über die Fläche und muss verfolgt werden. Zwischendurch knackt ein Ast –
 * dann heißt es kurz komplett stillhalten (Bewegung kostet Fortschritt).
 */
@Component({
  selector: 'mg-focus-hold',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-line" [class.alert]="frozen()">
      {{ frozen() ? '❗ Knacks! Jetzt NICHT bewegen!' : 'Bleib mit dem Lichtpunkt am Gebüsch.' }}
    </div>
    <div class="mg-area focus-area" [class.frozen]="frozen()" (pointermove)="onMove($event)" (pointerdown)="onMove($event)">
      <div
        class="ring"
        [class.on]="onTarget()"
        [style.left.px]="target().x"
        [style.top.px]="target().y"
        [style.width.px]="radius * 2"
        [style.height.px]="radius * 2"
      ></div>
      <div class="mg-sprite bush" [class.shake]="!frozen()" [style.left.px]="target().x" [style.top.px]="target().y">🌿</div>
      <div class="mg-sprite cursor-dot" [style.left.px]="cursor().x" [style.top.px]="cursor().y"></div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Ruhe</span></div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .focus-area { cursor: none; }
    .focus-area.frozen { box-shadow: inset 0 0 0 2px #ffd27a, inset 0 0 30px rgba(255, 210, 122, 0.25); }
    .ring {
      position: absolute;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1px dashed rgba(224, 164, 88, 0.35);
      pointer-events: none;
    }
    .ring.on { border-color: #8fd68a; background: rgba(143, 214, 138, 0.08); }
    .bush { font-size: 30px; }
    .bush.shake { animation: bush-shake 0.18s linear infinite alternate; }
    .cursor-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent-color, #e0a458);
      box-shadow: 0 0 8px var(--accent-color, #e0a458);
    }
    @keyframes bush-shake {
      from { transform: translate(-52%, -50%) rotate(-4deg); }
      to { transform: translate(-48%, -50%) rotate(4deg); }
    }
  `],
})
export class FocusHoldGame extends MinigameBase {
  readonly cursor = signal({ x: W / 2, y: H / 2 });
  readonly target = signal({ x: W / 2, y: H / 2 });
  readonly progress = signal(0);
  readonly frozen = signal(false);
  readonly onTarget = computed(() => distance(this.cursor(), this.target()) <= this.radius);
  radius = 30;

  private readonly phaseX = rand(0, Math.PI * 2);
  private readonly phaseY = rand(0, Math.PI * 2);
  private pathT = 0;
  private movedWhileFrozen = 0;

  protected start(): void {
    this.radius = this.tune(34, 42);
    this.startClock(this.tune(12000, 15000), () => this.finish(false, `${Math.round(this.progress())} % Ruhe`));

    this.loop((dt, elapsed) => {
      if (this.frozen()) return;
      this.pathT += dt * (this.tune(0.75, 0.6) + elapsed * this.tune(0.06, 0.04)); // wird mit der Zeit nervöser
      const t = this.pathT;
      this.target.set({
        x: clamp(W / 2 + 108 * Math.sin(t * 0.9 + this.phaseX) + rand(-3, 3), 20, W - 20),
        y: clamp(H / 2 + 60 * Math.sin(t * 1.37 + this.phaseY) + rand(-3, 3), 20, H - 20),
      });
      const gainPerSec = this.onTarget() ? 26 : -this.tune(13, 9);
      this.progress.update((p) => clamp(p + gainPerSec * dt, 0, 100));
      this.checkWin();
    });
    this.scheduleFreeze();
  }

  onMove(event: PointerEvent): void {
    const pos = localPos(event);
    if (this.frozen()) this.movedWhileFrozen += distance(pos, this.cursor());
    this.cursor.set(pos);
  }

  private scheduleFreeze(): void {
    this.after(rand(1800, 3000), () => {
      this.frozen.set(true);
      this.movedWhileFrozen = 0;
      this.sfx.play('alert');
      this.after(this.tune(900, 750), () => {
        this.frozen.set(false);
        if (this.movedWhileFrozen > 14) {
          this.progress.update((p) => Math.max(0, p - 22));
          this.pop('Zu hektisch! −22', true);
          this.sfx.play('miss');
        } else {
          this.progress.update((p) => Math.min(100, p + 8));
          this.pop('Mucksmäuschenstill! +8');
          this.sfx.play('hit');
          this.checkWin();
        }
        this.scheduleFreeze();
      });
    });
  }

  private checkWin(): void {
    if (this.progress() >= 100) this.finish(true, 'Das Tier hat sich beruhigt.');
  }
}
