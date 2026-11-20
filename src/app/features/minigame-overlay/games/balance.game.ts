import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, localPos, pick, rand } from '../minigame-base';

const W = 280;

/**
 * Affen Schritt 2, "Mit Früchten locken": Der Früchtekorb hängt an einer
 * Feder hinter dem Mauszeiger und muss unter dem wandernden Affen gehalten
 * werden. Windböen werden kurz vorher angekündigt (💨) und drücken kräftig.
 */
@Component({
  selector: 'mg-balance',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-line" [class.alert]="gustWarning() !== 0">
      {{ gustWarning() < 0 ? '💨 ⬅ Böe von rechts!' : gustWarning() > 0 ? 'Böe von links! ➡ 💨' : 'Halte den Korb unter dem Affen.' }}
    </div>
    <div class="mg-area balance-track" (pointermove)="onMove($event)" (pointerdown)="onMove($event)">
      <div class="zone" [class.on]="inZone()" [style.left.px]="zoneCenter() - zoneHalf" [style.width.px]="zoneHalf * 2"></div>
      <div class="mg-sprite monkey" [style.left.px]="zoneCenter()">🐒</div>
      <div class="mg-sprite basket" [style.left.px]="ballX()">🧺</div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Vertrauen</span></div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .balance-track { width: 280px; height: 96px; background: linear-gradient(180deg, #1f3a24 0%, #2a1f14 100%); cursor: ew-resize; }
    .zone { position: absolute; top: 0; bottom: 0; background: rgba(224, 164, 88, 0.16); border-left: 1px dashed var(--accent-color, #e0a458); border-right: 1px dashed var(--accent-color, #e0a458); }
    .zone.on { background: rgba(143, 214, 138, 0.2); }
    .monkey { top: 22px; font-size: 26px; }
    .basket { top: 66px; font-size: 28px; }
  `],
})
export class BalanceGame extends MinigameBase {
  readonly ballX = signal(W / 2);
  readonly zoneCenter = signal(W / 2);
  readonly progress = signal(0);
  readonly gustWarning = signal(0);
  zoneHalf = 30;
  readonly inZone = computed(() => Math.abs(this.ballX() - this.zoneCenter()) <= this.zoneHalf);

  private cursorX = W / 2;
  private velocity = 0;
  private gustForce = 0;
  private readonly phase = rand(0, Math.PI * 2);

  protected start(): void {
    this.zoneHalf = this.easy ? 38 : 30;
    this.startClock(this.easy ? 14000 : 11000, () => this.finish(false, `${Math.round(this.progress())} % Vertrauen`));

    this.loop((dt, elapsed) => {
      // Affe wandert, anfangs kaum, später deutlich.
      const amplitude = Math.min(80, elapsed * 25);
      this.zoneCenter.set(W / 2 + amplitude * Math.sin(elapsed * 0.95 + this.phase));

      // Feder zum Cursor + Dämpfung + leichter Wind + Böen.
      const accel = (this.cursorX - this.ballX()) * 30 - this.velocity * 7 + rand(-150, 150) + this.gustForce;
      this.velocity += accel * dt;
      let x = this.ballX() + this.velocity * dt;
      if (x < 14 || x > W - 14) {
        this.velocity = 0;
        x = clamp(x, 14, W - 14);
      }
      this.ballX.set(x);

      const rate = this.inZone() ? 22 : -15;
      this.progress.update((p) => clamp(p + rate * dt, 0, 100));
      if (this.progress() >= 100) this.finish(true, 'Die Affen kommen neugierig näher.');
    });
    this.scheduleGust();
  }

  onMove(event: PointerEvent): void {
    this.cursorX = clamp(localPos(event).x, 0, W);
  }

  private scheduleGust(): void {
    this.after(rand(1800, 3200), () => {
      const dir = pick([-1, 1]);
      this.gustWarning.set(dir);
      this.sfx.play('alert');
      this.after(650, () => {
        this.gustForce = dir * (this.easy ? 700 : 950);
        this.after(550, () => {
          this.gustForce = 0;
          this.gustWarning.set(0);
          this.scheduleGust();
        });
      });
    });
  }
}
