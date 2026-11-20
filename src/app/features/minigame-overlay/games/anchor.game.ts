import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey } from '../minigame-base';

const PULL_COOLDOWN_MS = 280;
const DRAG_THRESHOLD_PX = 30;

/**
 * Finale Schritt 2, "Anker lichten": Die Kette wird per Zug nach oben
 * (Maus/Finger ziehen) oder Taste eingeholt. Am kräftigsten wirkt ein Zug,
 * wenn das Schiff gerade auf dem Wellenkamm ist ("HAU-RUCK!"). Im Wellental
 * klemmt die Kette. Lässt man nach, rutscht der Anker wieder ab.
 */
@Component({
  selector: 'mg-anchor',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-line" [class.alert]="crest()">{{ crest() ? '🌊 HAU-RUCK! Jetzt ziehen!' : trough() ? 'Wellental – Kette klemmt …' : 'Warte auf den Wellenkamm …' }}</div>
    <div class="mg-area anchor-area" (pointerdown)="onDown($event)" (pointerup)="onUp($event)" (pointercancel)="dragStartY = null">
      <div class="mg-sprite ship" [style.top.px]="60 - wave() * 18" [style.rotate.deg]="wave() * 6">⛵</div>
      <div class="water" [style.top.px]="84 - wave() * 14"></div>
      <div class="shaft">
        <div class="chain" [style.height.%]="100 - progress()"></div>
        <div class="anchor" [style.bottom.%]="progress()">⚓</div>
      </div>
      <div class="drag-hint">⬆️ ziehen</div>
    </div>
    <div class="mg-meter"><div class="mg-meter-fill" [style.width.%]="progress()"></div><span class="mg-meter-label">Anker</span></div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .anchor-area { height: 190px; background: linear-gradient(180deg, #1c2a40 0%, #0f1a2a 100%); cursor: ns-resize; }
    .ship { left: 36%; font-size: 52px; }
    .water { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(58, 110, 160, 0.75), rgba(20, 40, 70, 0.95)); border-top: 2px solid rgba(160, 200, 255, 0.5); }
    .shaft { position: absolute; right: 26px; top: 10px; bottom: 10px; width: 36px; }
    .chain { position: absolute; left: 50%; top: 0; transform: translateX(-50%); border-left: 3px dotted #9aa; }
    .anchor { position: absolute; left: 50%; transform: translate(-50%, 0); font-size: 26px; }
    .drag-hint { position: absolute; left: 8px; bottom: 6px; font-size: 0.7rem; opacity: 0.6; color: #fff; }
  `],
})
export class AnchorGame extends MinigameBase {
  readonly progress = signal(0);
  readonly wave = signal(0); // -1 … 1
  private crestThreshold = 0.55;
  readonly crest = computed(() => this.wave() > this.crestThreshold);
  readonly trough = computed(() => this.wave() < -0.45);
  dragStartY: number | null = null;
  private lastPullAt = 0;
  private wavePhase = 0;

  protected start(): void {
    this.crestThreshold = this.easy ? 0.4 : 0.55;
    this.startClock(this.easy ? 16000 : 13000, () => this.finish(false, `Anker zu ${Math.round(this.progress())} % oben`));
    this.loop((dt, elapsed) => {
      const period = Math.max(1.25, 1.7 - elapsed * 0.03);
      this.wavePhase += (dt / period) * Math.PI * 2;
      this.wave.set(Math.sin(this.wavePhase));
      const slip = 6 + elapsed * 0.8;
      this.progress.update((p) => Math.max(0, p - slip * dt));
    });
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat || !isKey(event, ' ', 'ArrowUp', 'w')) return;
    event.preventDefault();
    this.pull();
  }

  onDown(event: PointerEvent): void {
    this.dragStartY = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  onUp(event: PointerEvent): void {
    if (this.dragStartY === null) return;
    const pulled = this.dragStartY - event.clientY;
    this.dragStartY = null;
    if (pulled >= DRAG_THRESHOLD_PX) this.pull();
  }

  private pull(): void {
    if (this.done) return;
    const now = performance.now();
    if (now - this.lastPullAt < PULL_COOLDOWN_MS) return;
    this.lastPullAt = now;

    if (this.crest()) {
      this.add(16);
      this.sfx.play('perfect');
      this.pop('HAU-RUCK! +16');
    } else if (this.trough()) {
      this.add(-6);
      this.sfx.play('miss');
      this.pop('Kette klemmt! −6', true);
    } else {
      this.add(5);
      this.sfx.play('click');
    }
  }

  private add(amount: number): void {
    this.progress.update((p) => clamp(p + amount, 0, 100));
    if (this.progress() >= 100) this.finish(true, 'Anker gelichtet – Leinen los!');
  }
}
