import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey, pick, rand } from '../minigame-base';

const TRACK_W = 280;

/**
 * Dorf Schritt 1, "Helix zurückhalten": Helix zerrt mal leicht, mal mit
 * angekündigtem Ausfallschritt in eine Richtung. Mit der Gegenrichtung
 * (gedrückt halten) bleibt er in der ruhigen Mitte – aber Vorsicht vor dem
 * Überkorrigieren. Reißt er sich am Rand los, kostet das ein Leben.
 */
@Component({
  selector: 'mg-tug',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats"><span class="mg-hearts">{{ '❤️'.repeat(lives()) }}</span></div>
    <div class="mg-line" [class.alert]="warning() !== 0">
      {{ warning() > 0 ? '😤 Helix holt Schwung nach RECHTS!' : warning() < 0 ? '😤 Helix holt Schwung nach LINKS!' : 'Halte Helix in der Mitte.' }}
    </div>
    <div class="mg-area tug-track">
      <div class="calm-zone" [style.width.px]="zoneWidth()"></div>
      <div class="edge el">🔥</div>
      <div class="edge er">🔥</div>
      <div class="mg-sprite helix" [style.left.px]="markerX()">{{ calmNow() ? '😐' : '😠' }}</div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Beruhigt</span></div>
    <div class="mg-row">
      <button class="mg-pad" [class.pressed]="holdLeft" (pointerdown)="holdLeft = true" (pointerup)="holdLeft = false" (pointerleave)="holdLeft = false" (pointercancel)="holdLeft = false">
        ⬅️<small>halten · ← / A</small>
      </button>
      <button class="mg-pad" [class.pressed]="holdRight" (pointerdown)="holdRight = true" (pointerup)="holdRight = false" (pointerleave)="holdRight = false" (pointercancel)="holdRight = false">
        ➡️<small>halten · → / D</small>
      </button>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .tug-track { width: 280px; height: 70px; background: linear-gradient(90deg, #4a1e1e 0%, #1f3a24 30%, #1f3a24 70%, #4a1e1e 100%); }
    .calm-zone { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); background: rgba(143, 214, 138, 0.18); border-left: 1px dashed #8fd68a; border-right: 1px dashed #8fd68a; }
    .edge { position: absolute; top: 50%; transform: translateY(-50%); font-size: 18px; opacity: 0.7; }
    .el { left: 4px; }
    .er { right: 4px; }
    .helix { top: 50%; font-size: 34px; }
  `],
})
export class TugGame extends MinigameBase {
  readonly position = signal(0); // -1 … 1
  readonly progress = signal(0);
  readonly lives = signal(2);
  readonly warning = signal(0);
  holdLeft = false;
  holdRight = false;
  private keyLeft = false;
  private keyRight = false;
  private zone = 0.25;
  readonly zoneWidth = computed(() => this.zone * TRACK_W);
  readonly markerX = computed(() => TRACK_W / 2 + this.position() * (TRACK_W / 2 - 18));
  readonly calmNow = computed(() => Math.abs(this.position()) < this.zone);

  private velocity = 0;
  private drift = 0;
  private lunge = 0;

  protected start(): void {
    this.zone = this.easy ? 0.32 : 0.25;
    this.lives.set(this.easy ? 3 : 2);
    this.startClock(this.easy ? 16000 : 13000, () => this.finish(false, `Helix zu ${Math.round(this.progress())} % beruhigt`));

    this.loop((dt, elapsed) => {
      this.drift = clamp(this.drift + rand(-1, 1) * dt * 2, -0.6, 0.6);
      const left = this.holdLeft || this.keyLeft;
      const right = this.holdRight || this.keyRight;
      const player = ((right ? 1 : 0) - (left ? 1 : 0)) * 1.5;
      const force = this.drift + this.lunge * (1 + elapsed * 0.03) + player;

      this.velocity += force * 2.2 * dt;
      this.velocity *= Math.pow(0.12, dt);
      const p = this.position() + this.velocity * dt;

      if (Math.abs(p) >= 1) {
        this.lives.update((l) => l - 1);
        this.sfx.play('miss');
        this.pop('Helix reißt sich los!', true);
        this.position.set(0);
        this.velocity = 0;
        this.drift = 0;
        if (this.lives() <= 0) this.finish(false, 'Helix ist nicht mehr zu halten.');
        return;
      }
      this.position.set(p);

      const rate = Math.abs(p) < this.zone ? 20 : Math.abs(p) > 0.6 ? -12 : 0;
      this.progress.update((v) => clamp(v + rate * dt, 0, 100));
      if (this.progress() >= 100) this.finish(true, 'Helix atmet tief durch.');
    });
    this.scheduleLunge();
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (isKey(event, 'ArrowLeft', 'a')) this.keyLeft = true;
    else if (isKey(event, 'ArrowRight', 'd')) this.keyRight = true;
    else return;
    event.preventDefault();
  }

  protected override onKeyUp(event: KeyboardEvent): void {
    if (isKey(event, 'ArrowLeft', 'a')) this.keyLeft = false;
    if (isKey(event, 'ArrowRight', 'd')) this.keyRight = false;
  }

  private scheduleLunge(): void {
    this.after(rand(1500, 2600), () => {
      const dir = pick([-1, 1]);
      this.warning.set(dir);
      this.sfx.play('alert');
      this.after(this.easy ? 700 : 550, () => {
        this.lunge = dir * 1.2;
        this.after(700, () => {
          this.lunge = 0;
          this.warning.set(0);
          this.scheduleLunge();
        });
      });
    });
  }
}
