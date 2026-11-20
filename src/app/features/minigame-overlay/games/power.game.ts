import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, rand } from '../minigame-base';

const POSES_REQUIRED = 3;
const ZONE_WIDTHS = [22, 17, 13];

/**
 * Dorf Schritt 1, "Helix gewähren lassen": Drei Imponier-Posen. Gedrückt
 * halten lädt den Kraftmesser – immer schneller, je länger man hält.
 * In der Zone loslassen! Die Zone springt nach jeder Pose woandershin
 * und wird schmaler; Überladen kostet Zeit.
 */
@Component({
  selector: 'mg-power',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>Posen: {{ '💪'.repeat(poses()) }}<span class="todo">{{ '💪'.repeat(posesRequired - poses()) }}</span></span>
    </div>
    <div class="power-stage">
      <div class="gauge">
        <div class="zone" [style.bottom.%]="zoneMin()" [style.height.%]="zoneMax() - zoneMin()"></div>
        <div class="fill" [class.hot]="value() > zoneMax()" [style.height.%]="value()"></div>
      </div>
      <div class="helix" [style.transform]="'scale(' + (1 + value() / 140) + ')'">🏴‍☠️</div>
    </div>
    <button
      class="mg-btn"
      (pointerdown)="press()"
      (pointerup)="release()"
      (pointerleave)="release()"
      (pointercancel)="release()"
    >
      💪 Halten & loslassen (Leertaste)
    </button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .todo { opacity: 0.2; }
    .power-stage { display: flex; align-items: flex-end; gap: 28px; height: 180px; }
    .gauge { position: relative; width: 52px; height: 170px; background: #1a130c; border: 1px solid #3a3a45; border-radius: 8px; overflow: hidden; }
    .zone { position: absolute; left: 0; right: 0; background: rgba(143, 214, 138, 0.25); border-top: 2px dashed #8fd68a; border-bottom: 2px dashed #8fd68a; z-index: 1; transition: bottom 0.25s ease, height 0.25s ease; }
    .fill { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(0deg, var(--accent-color, #e0a458), #f2d19a); }
    .fill.hot { background: linear-gradient(0deg, #c0504d, #ff9b9b); }
    .helix { font-size: 44px; transform-origin: bottom center; transition: transform 0.05s linear; margin-bottom: 8px; }
  `],
})
export class PowerGame extends MinigameBase {
  readonly posesRequired = POSES_REQUIRED;
  readonly poses = signal(0);
  readonly value = signal(0);
  readonly zoneMin = signal(60);
  readonly zoneMax = signal(82);
  private holding = false;
  private holdTime = 0;

  protected start(): void {
    this.placeZone();
    this.startClock(this.tune(15000, 18000), () => this.finish(false, `${this.poses()}/${POSES_REQUIRED} Posen`));
    this.loop((dt) => {
      if (!this.holding) return;
      this.holdTime += dt;
      const rate = 35 + this.holdTime * 70; // beschleunigt, je länger gehalten wird
      const next = this.value() + rate * dt;
      if (next > 100) {
        this.holding = false;
        this.value.set(0);
        this.penalizeTime(1000);
        this.sfx.play('miss');
        this.pop('Übernommen! −1 s', true);
        return;
      }
      this.value.set(next);
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (!isKey(event, ' ', 'Enter')) return;
    event.preventDefault();
    if (!event.repeat) this.press();
  }

  protected override onKeyUp(event: KeyboardEvent): void {
    if (isKey(event, ' ', 'Enter')) this.release();
  }

  press(): void {
    if (this.done || this.holding) return;
    this.holding = true;
    this.holdTime = 0;
    this.value.set(0);
  }

  release(): void {
    if (this.done || !this.holding) return;
    this.holding = false;
    const v = this.value();
    if (v >= this.zoneMin() && v <= this.zoneMax()) {
      this.poses.update((p) => p + 1);
      this.sfx.play('perfect');
      this.pop('Imposant!');
      if (this.poses() >= POSES_REQUIRED) {
        this.finish(true, 'Die Dorfwächter weichen beeindruckt zurück.');
        return;
      }
      this.placeZone();
    } else {
      this.sfx.play('miss');
      this.pop(v < this.zoneMin() ? 'Zu schwach!' : 'Zu viel!', true);
    }
    this.after(150, () => this.value.set(0));
  }

  private placeZone(): void {
    const width = ZONE_WIDTHS[Math.min(this.poses(), ZONE_WIDTHS.length - 1)] + this.tune(2, 7);
    const min = rand(35, 95 - width);
    this.zoneMin.set(min);
    this.zoneMax.set(min + width);
  }
}
