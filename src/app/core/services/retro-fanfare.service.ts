import { Injectable } from '@angular/core';

/** Standard-Frequenzen (Hz, gleichstufige Stimmung) für die verwendeten Töne. */
const NOTE = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
} as const;

interface FanfareNote {
  freq: number;
  duration: number;
}

/**
 * Eröffnungsphrase von "Adeste Fideles" (traditionelles Kirchenlied, gemeinfrei),
 * grob transkribiert in G-Dur: "O come, all ye faithful, joyfully triumphant".
 */
const ADESTE_FIDELES_OPENING: FanfareNote[] = [
  { freq: NOTE.G4, duration: 0.26 },
  { freq: NOTE.G4, duration: 0.26 },
  { freq: NOTE.D5, duration: 0.26 },
  { freq: NOTE.D5, duration: 0.26 },
  { freq: NOTE.E5, duration: 0.26 },
  { freq: NOTE.D5, duration: 0.26 },
  { freq: NOTE.C5, duration: 0.26 },
  { freq: NOTE.B4, duration: 0.4 },
  { freq: NOTE.A4, duration: 0.26 },
  { freq: NOTE.A4, duration: 0.26 },
  { freq: NOTE.D5, duration: 0.26 },
  { freq: NOTE.C5, duration: 0.26 },
  { freq: NOTE.B4, duration: 0.26 },
  { freq: NOTE.A4, duration: 0.26 },
  { freq: NOTE.G4, duration: 0.6 },
];

/**
 * Kleine, selbst erzeugte Chiptune-Fanfäre im 90er-PC-Spiel-Stil (Rechteck-Welle,
 * wie ein PC-Speaker/Soundblaster-Jingle) – keine externe Audiodatei nötig.
 * Browser blockieren Audio-Autoplay teils ohne vorherige Nutzer-Interaktion;
 * das ist rein dekorativ und schadet dem Spiel nicht, falls es stumm bleibt.
 */
@Injectable({ providedIn: 'root' })
export class RetroFanfareService {
  private audioContext: AudioContext | null = null;

  playAdesteFidelesFanfare(): void {
    try {
      const ctx = this.audioContext ?? new AudioContext();
      this.audioContext = ctx;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      let time = ctx.currentTime + 0.05;
      for (const note of ADESTE_FIDELES_OPENING) {
        this.playNote(ctx, note.freq, time, note.duration);
        time += note.duration;
      }
    } catch {
      // Web Audio nicht verfügbar oder blockiert – Fanfäre bleibt einfach stumm.
    }
  }

  private playNote(ctx: AudioContext, freq: number, startTime: number, duration: number): void {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'square'; // klassischer, leicht "piepsiger" Chiptune-Klang
    oscillator.frequency.value = freq;

    // Kurze Attack/Release-Hüllkurve, damit die Töne nicht klicken/knallen.
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
    gain.gain.setValueAtTime(0.16, startTime + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
}
