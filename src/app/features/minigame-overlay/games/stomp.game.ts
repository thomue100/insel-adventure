import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey, rand } from '../minigame-base';

type Side = 'left' | 'right';

/**
 * Raschel-Tier, "Lautstark verscheuchen": Abwechselnd links/rechts stampfen
 * füllt den Lärm-Pegel, der immer schneller abfällt. Zweimal dieselbe Seite
 * = Stolpern. Ruft das Spiel "JETZT brüllen!", gibt's einen dicken Bonus –
 * zu frühes Brüllen kostet dagegen Pegel.
 */
@Component({
  selector: 'mg-stomp',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-line" [class.alert]="roarWindow()">
      {{ stunned() ? '😵 Gestolpert!' : roarWindow() ? '📢 JETZT brüllen!' : 'Links, rechts, links, rechts …' }}
    </div>
    <div class="mg-area stomp-area" [class.roar]="roarWindow()">
      <div class="mg-sprite creature" [style.font-size.px]="creatureSize()">{{ progress() > 70 ? '🙀' : '👀' }}</div>
      <div class="mg-sprite bushes">🌿🌿🌿</div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Lärm</span></div>
    <div class="mg-row">
      <button class="mg-pad" [class.hint]="nextSide() === 'left'" [disabled]="stunned()" (pointerdown)="stomp('left')">🦶<small>← / A</small></button>
      <button class="mg-pad roar-btn" [class.hint]="roarWindow()" (pointerdown)="roar()">📢<small>Leertaste</small></button>
      <button class="mg-pad" [class.hint]="nextSide() === 'right'" [disabled]="stunned()" (pointerdown)="stomp('right')">🦶<small>→ / D</small></button>
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .stomp-area { height: 120px; }
    .stomp-area.roar { box-shadow: inset 0 0 0 2px #ffd27a; }
    .creature { left: 50%; top: 45%; transition: font-size 0.15s ease; }
    .bushes { left: 50%; top: 78%; font-size: 34px; letter-spacing: -8px; }
  `],
})
export class StompGame extends MinigameBase {
  readonly progress = signal(0);
  readonly stunned = signal(false);
  readonly roarWindow = signal(false);
  private lastSide: Side | null = null;
  readonly nextSide = signal<Side | null>(null);
  readonly creatureSize = computed(() => 46 - this.progress() * 0.25);
  private gain = 8;

  protected start(): void {
    this.gain = this.tune(9, 10.5);
    this.startClock(this.tune(9000, 11000), () => this.finish(false, `Lärm-Pegel: ${Math.round(this.progress())} %`));
    this.loop((dt, elapsed) => {
      const decayPerSec = this.tune(8, 6) + elapsed * this.tune(2.5, 1.8); // das Tier gewöhnt sich an den Lärm
      this.progress.update((p) => Math.max(0, p - decayPerSec * dt));
    });
    this.scheduleRoar();
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    if (isKey(event, 'ArrowLeft', 'a')) this.stomp('left');
    else if (isKey(event, 'ArrowRight', 'd')) this.stomp('right');
    else if (isKey(event, ' ', 'ArrowUp', 'w')) this.roar();
    else return;
    event.preventDefault();
  }

  stomp(side: Side): void {
    if (this.done || this.stunned()) return;
    if (side === this.lastSide) {
      this.stunned.set(true);
      this.progress.update((p) => Math.max(0, p - 12));
      this.sfx.play('miss');
      this.lastSide = null;
      this.nextSide.set(null);
      this.after(450, () => this.stunned.set(false));
      return;
    }
    this.lastSide = side;
    this.nextSide.set(side === 'left' ? 'right' : 'left');
    this.sfx.play('click');
    this.add(this.gain);
  }

  roar(): void {
    if (this.done) return;
    if (this.roarWindow()) {
      this.roarWindow.set(false);
      this.pop('BRÜLL! +18');
      this.sfx.play('perfect');
      this.add(18);
    } else {
      this.pop('Zu früh! −6', true);
      this.sfx.play('miss');
      this.progress.update((p) => Math.max(0, p - 6));
    }
  }

  private add(amount: number): void {
    this.progress.update((p) => clamp(p + amount, 0, 100));
    if (this.progress() >= 100) this.finish(true, 'Das Raschel-Tier flüchtet!');
  }

  private scheduleRoar(): void {
    this.after(rand(1600, 2600), () => {
      this.roarWindow.set(true);
      this.sfx.play('alert');
      this.after(this.tune(800, 1000), () => {
        this.roarWindow.set(false);
        this.scheduleRoar();
      });
    });
  }
}
