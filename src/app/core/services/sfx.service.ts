import { Injectable } from '@angular/core';

export type SfxKind = 'hit' | 'perfect' | 'miss' | 'tick' | 'go' | 'win' | 'lose' | 'alert' | 'click';

/**
 * Winzige, selbst erzeugte Retro-Soundeffekte für die Minigames (Web Audio,
 * keine Audiodateien). Rein dekorativ: Ist Audio blockiert oder nicht
 * verfügbar, bleibt das Spiel einfach stumm.
 */
@Injectable({ providedIn: 'root' })
export class SfxService {
  private ctx: AudioContext | null = null;

  play(kind: SfxKind): void {
    switch (kind) {
      case 'hit':
        this.tone(660, 0.07, 'square', 0.06);
        this.tone(880, 0.07, 'square', 0.05, 0.05);
        break;
      case 'perfect':
        this.tone(784, 0.06, 'square', 0.06);
        this.tone(1046, 0.06, 'square', 0.06, 0.05);
        this.tone(1318, 0.08, 'square', 0.05, 0.1);
        break;
      case 'miss':
        this.tone(180, 0.16, 'sawtooth', 0.06);
        break;
      case 'tick':
        this.tone(1000, 0.04, 'square', 0.04);
        break;
      case 'go':
        this.tone(1318, 0.18, 'square', 0.06);
        break;
      case 'alert':
        this.tone(520, 0.08, 'triangle', 0.09);
        this.tone(520, 0.08, 'triangle', 0.09, 0.12);
        break;
      case 'click':
        this.tone(420, 0.03, 'square', 0.04);
        break;
      case 'win':
        [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.12, 'square', 0.06, i * 0.09));
        break;
      case 'lose':
        [392, 330, 262].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.08, i * 0.14));
        break;
    }
  }

  /** Einzelner Ton, z.B. für die Simon-Says-Pads. */
  tone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.06, delay = 0): void {
    try {
      const ctx = this.ctx ?? new AudioContext();
      this.ctx = ctx;
      if (ctx.state === 'suspended') void ctx.resume();

      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.01);
      gain.gain.linearRampToValueAtTime(0, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    } catch {
      // Audio nicht verfügbar – stumm weiterspielen.
    }
  }
}
