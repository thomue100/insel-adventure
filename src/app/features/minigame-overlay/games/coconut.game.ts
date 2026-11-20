import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, isKey, rand } from '../minigame-base';

const W = 280;
const AIM_X = W / 2;
const FLIGHT_MS = 420;

/**
 * Affen Schritt 2, "Mit Kokosnüssen bewerfen": Die Kokosnuss braucht eine
 * Weile nach oben – man muss also vorhalten! Der Affe wechselt unberechenbar
 * die Richtung, legt Pausen ein und wird nach jedem Treffer flinker.
 * Begrenzte Munition statt Dauerklicken.
 */
@Component({
  selector: 'mg-coconut',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats">
      <span>🎯 {{ hits() }}/{{ required }} Treffer</span>
      <span>{{ '🥥'.repeat(ammo()) }}<span class="spent">{{ '🥥'.repeat(maxAmmo - ammo()) }}</span></span>
    </div>
    <div class="mg-area coconut-area">
      <div class="branch"></div>
      <div class="mg-sprite monkey" [style.left.px]="monkeyX()">{{ monkeyFace() }}</div>
      <div class="aim-line"></div>
      @if (inFlight()) {
        <div class="mg-sprite nut flying" [style.animation-duration.ms]="flightMs">🥥</div>
      }
      <div class="mg-sprite thrower">🧍</div>
    </div>
    <button class="mg-btn" [disabled]="inFlight() || ammo() === 0" (pointerdown)="throwNut()">🥥 Werfen! (Leertaste)</button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .coconut-area { width: 280px; height: 150px; background: linear-gradient(180deg, #24402a 0%, #1a2a1a 60%, #2a1f14 100%); }
    .branch { position: absolute; left: 0; right: 0; top: 38px; height: 6px; background: #5a3d22; border-radius: 3px; }
    .monkey { top: 22px; font-size: 28px; }
    .aim-line { position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed rgba(224, 164, 88, 0.35); }
    .thrower { left: 50%; top: 128px; font-size: 26px; }
    .nut { left: 50%; font-size: 20px; }
    .nut.flying { animation-name: nut-fly; animation-timing-function: ease-out; animation-fill-mode: forwards; }
    .spent { opacity: 0.2; }
    @keyframes nut-fly {
      from { top: 115px; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
      to { top: 26px; transform: translate(-50%, -50%) rotate(540deg) scale(0.8); }
    }
  `],
})
export class CoconutGame extends MinigameBase {
  readonly required = 3;
  readonly flightMs = FLIGHT_MS;
  maxAmmo = 6;
  readonly ammo = signal(6);
  readonly hits = signal(0);
  readonly monkeyX = signal(40);
  readonly monkeyFace = signal('🐒');
  readonly inFlight = signal(false);

  private direction = 1;
  private pausedFor = 0;
  private nextTurnIn = 1;
  private hitTolerance = 22;

  protected start(): void {
    this.maxAmmo = this.easy ? 8 : 6;
    this.ammo.set(this.maxAmmo);
    this.hitTolerance = this.easy ? 28 : 22;
    this.startClock(16000, () => this.finish(false, `${this.hits()}/${this.required} Treffer`));

    this.loop((dt) => {
      if (this.pausedFor > 0) {
        this.pausedFor -= dt;
        if (this.pausedFor <= 0) this.monkeyFace.set('🐒');
        return;
      }
      this.nextTurnIn -= dt;
      if (this.nextTurnIn <= 0) {
        this.nextTurnIn = rand(0.5, 1.3);
        const roll = Math.random();
        if (roll < 0.25) {
          this.pausedFor = rand(0.25, 0.5); // Affe bleibt stehen und schneidet Grimassen
          this.monkeyFace.set('😝');
        } else if (roll < 0.65) {
          this.direction *= -1;
        }
      }
      const speed = 110 + this.hits() * 50;
      let x = this.monkeyX() + this.direction * speed * dt;
      if (x < 16 || x > W - 16) {
        this.direction *= -1;
        x = Math.max(16, Math.min(W - 16, x));
      }
      this.monkeyX.set(x);
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat || !isKey(event, ' ', 'Enter', 'ArrowUp')) return;
    event.preventDefault();
    this.throwNut();
  }

  throwNut(): void {
    if (this.done || this.inFlight() || this.ammo() === 0) return;
    this.ammo.update((a) => a - 1);
    this.inFlight.set(true);
    this.sfx.play('click');

    this.after(FLIGHT_MS, () => {
      this.inFlight.set(false);
      if (Math.abs(this.monkeyX() - AIM_X) <= this.hitTolerance) {
        this.hits.update((h) => h + 1);
        this.monkeyFace.set('🙊');
        this.pausedFor = 0.45;
        this.pop('Treffer!');
        this.sfx.play('perfect');
        if (this.hits() >= this.required) {
          this.finish(true, 'Die Affen ergreifen die Flucht!');
          return;
        }
      } else {
        this.pop('Daneben!', true);
        this.sfx.play('miss');
      }
      if (this.ammo() === 0) this.finish(false, 'Keine Kokosnüsse mehr …');
    });
  }
}
