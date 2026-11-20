import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey, rand } from '../minigame-base';

const HEAVY_FROM = 45;
const HEAVY_TO = 65;

/**
 * Königsschatz, "Den Hebel mit Kraft bewegen": Gedrückt halten stemmt den
 * Hebel, verbraucht aber Ausdauer – bei null ist man kurz erschöpft. Loslassen
 * erholt, doch der Hebel rutscht zurück. Im Mittelteil klemmt er (halbe
 * Kraft), und manchmal rutscht der Stein: Wer dann hält, verliert nur Ausdauer.
 */
@Component({
  selector: 'mg-lever',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-line" [class.alert]="slipWarning() || exhausted()">
      {{ exhausted() ? '😫 Erschöpft!' : slipWarning() ? '⚠️ Der Stein rutscht – festhalten!' : heavy() ? 'Schwerer Abschnitt …' : 'Stemmen und Luft holen.' }}
    </div>
    <div class="mg-area lever-area">
      <div class="door" [style.height.%]="100 - progress() * 0.8">🗿</div>
      <div class="pivot"></div>
      <div class="lever" [style.rotate.deg]="-60 + progress() * 1.2" [class.strain]="pushing()"></div>
    </div>
    <div class="mg-meter heavy-meter">
      <div class="heavy-band"></div>
      <div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Hebel</span>
    </div>
    <div class="mg-meter" [class.danger]="stamina() < 30">
      <div class="mg-meter-fill" [style.width.%]="stamina()"></div><span class="mg-meter-label">Ausdauer</span>
    </div>
    <button class="mg-btn" (pointerdown)="holding = true" (pointerup)="holding = false" (pointerleave)="holding = false" (pointercancel)="holding = false">
      💪 Stemmen (halten / Leertaste)
    </button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .lever-area { height: 150px; background: linear-gradient(180deg, #3a3428 0%, #1f1c16 100%); }
    .door { position: absolute; left: 18px; bottom: 0; width: 80px; display: flex; align-items: flex-start; justify-content: center; font-size: 34px; background: #5b5a56; border: 2px solid #3a3833; border-bottom: none; overflow: hidden; transition: height 0.1s linear; }
    .pivot { position: absolute; left: 200px; bottom: 30px; width: 16px; height: 16px; border-radius: 50%; background: #2a2824; transform: translate(-50%, 50%); }
    .lever { position: absolute; left: 200px; bottom: 30px; width: 10px; height: 100px; background: linear-gradient(#a0784a, #6a4a2a); border-radius: 5px; transform-origin: bottom center; translate: -50% 0; }
    .lever.strain { box-shadow: 0 0 10px rgba(255, 210, 122, 0.6); }
    .heavy-meter .heavy-band { position: absolute; top: 0; bottom: 0; left: 45%; width: 20%; background: rgba(224, 110, 110, 0.25); }
  `],
})
export class LeverGame extends MinigameBase {
  readonly progress = signal(0);
  readonly stamina = signal(100);
  readonly exhausted = signal(false);
  readonly slipWarning = signal(false);
  readonly pushing = signal(false);
  readonly heavy = computed(() => this.progress() >= HEAVY_FROM && this.progress() <= HEAVY_TO);
  holding = false;
  private keyHolding = false;

  protected start(): void {
    const pushRate = this.tune(28, 32);
    const drain = this.tune(33, 27);
    this.startClock(this.tune(18000, 21000), () => this.finish(false, `Hebel zu ${Math.round(this.progress())} % bewegt`));

    this.loop((dt) => {
      const active = (this.holding || this.keyHolding) && !this.exhausted();
      this.pushing.set(active);
      if (active) {
        const rate = this.heavy() ? pushRate * 0.5 : pushRate;
        this.progress.update((p) => clamp(p + rate * dt, 0, 100));
        this.stamina.update((s) => s - drain * dt);
        if (this.stamina() <= 0) this.exhaust();
      } else {
        this.stamina.update((s) => Math.min(100, s + 45 * dt));
        this.progress.update((p) => Math.max(0, p - 9 * dt));
      }
      if (this.progress() >= 100) this.finish(true, 'Der Hebel rastet ein – die Kammer öffnet sich!');
    });
    this.scheduleSlip();
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (!isKey(event, ' ', 'Enter')) return;
    event.preventDefault();
    this.keyHolding = true;
  }

  protected override onKeyUp(event: KeyboardEvent): void {
    if (isKey(event, ' ', 'Enter')) this.keyHolding = false;
  }

  private exhaust(): void {
    this.stamina.set(0);
    this.exhausted.set(true);
    this.sfx.play('miss');
    this.after(900, () => this.exhausted.set(false));
  }

  private scheduleSlip(): void {
    this.after(rand(2200, 3500), () => {
      this.slipWarning.set(true);
      this.sfx.play('alert');
      this.after(650, () => {
        this.slipWarning.set(false);
        if (this.pushing()) {
          this.stamina.update((s) => Math.max(0, s - 25));
          this.pop('Gehalten! Ausdauer −25');
          this.sfx.play('hit');
        } else {
          this.progress.update((p) => Math.max(0, p - 18));
          this.pop('Abgerutscht! −18', true);
          this.sfx.play('miss');
        }
        this.scheduleSlip();
      });
    });
  }
}
