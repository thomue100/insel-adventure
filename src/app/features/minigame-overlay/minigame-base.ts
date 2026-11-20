import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SfxService } from '../../core/services/sfx.service';

export interface MinigameResult {
  success: boolean;
  /** Kurze Zusammenfassung für den Ergebnis-Bildschirm, z.B. "4/5 Treffer". */
  detail?: string;
}

export interface Point {
  x: number;
  y: number;
}

interface Pop {
  id: number;
  text: string;
  bad: boolean;
}

let popCounter = 0;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randInt(min: number, maxInclusive: number): number {
  return Math.floor(rand(min, maxInclusive + 1));
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Pointer-Position relativ zum Element, an dem der Listener hängt. */
export function localPos(event: PointerEvent | MouseEvent): Point {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/** Prüft eine Taste gegen eine Liste (Groß-/Kleinschreibung egal, z.B. 'a' und 'A'). */
export function isKey(event: KeyboardEvent, ...keys: string[]): boolean {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return keys.includes(key);
}

/**
 * Gemeinsame Basis aller Minigames: Timer, Spielschleife, Aufräumen der
 * Timer beim Zerstören, Tastatur-Weiterleitung und kleine Feedback-Popups.
 * Jedes Spiel implementiert nur `start()` und seine eigenen Eingaben.
 *
 * `easy` ist gesetzt, wenn die Hauptfigur genau im Skill dieses Minigames
 * stark ist – die Spiele geben dann etwas mehr Zeit/Toleranz.
 */
@Directive()
export abstract class MinigameBase implements OnInit, OnDestroy {
  @Input() easy = false;
  @Output() readonly finished = new EventEmitter<MinigameResult>();

  protected readonly sfx = inject(SfxService);

  readonly hasClock = signal(false);
  readonly remainingMs = signal(0);
  private readonly totalMs = signal(1);
  readonly timePct = computed(() => clamp((this.remainingMs() / this.totalMs()) * 100, 0, 100));
  readonly remainingSeconds = computed(() => Math.max(0, Math.ceil(this.remainingMs() / 1000)));
  readonly timeLow = computed(() => this.remainingMs() <= 3000);
  readonly pops = signal<Pop[]>([]);

  protected done = false;
  private readonly intervals = new Set<ReturnType<typeof setInterval>>();
  private readonly timeouts = new Set<ReturnType<typeof setTimeout>>();

  ngOnInit(): void {
    // Fokus von evtl. zuvor geklickten Buttons lösen, damit die Leertaste
    // nicht versehentlich einen Button "klickt".
    (document.activeElement as HTMLElement | null)?.blur?.();
    this.start();
  }

  ngOnDestroy(): void {
    this.done = true;
    this.clearAll();
  }

  protected abstract start(): void;
  protected onKeyDown(_event: KeyboardEvent): void {}
  protected onKeyUp(_event: KeyboardEvent): void {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.done) this.onKeyDown(event);
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (!this.done) this.onKeyUp(event);
  }

  /** Startet den sichtbaren Countdown; in den letzten 3 Sekunden tickt es hörbar. */
  protected startClock(ms: number, onTimeout: () => void): void {
    this.hasClock.set(true);
    this.totalMs.set(ms);
    this.remainingMs.set(ms);
    let last = performance.now();
    let lastSecond = Math.ceil(ms / 1000);
    this.every(100, () => {
      const now = performance.now();
      this.remainingMs.update((t) => t - (now - last));
      last = now;
      const second = Math.ceil(this.remainingMs() / 1000);
      if (second !== lastSecond) {
        lastSecond = second;
        if (second > 0 && second <= 3) this.sfx.play('tick');
      }
      if (this.remainingMs() <= 0) onTimeout();
    });
  }

  protected penalizeTime(ms: number): void {
    this.remainingMs.update((t) => t - ms);
  }

  protected every(ms: number, fn: () => void): void {
    const id = setInterval(() => {
      if (!this.done) fn();
    }, ms);
    this.intervals.add(id);
  }

  /** Flüssige Spielschleife (~33 fps) mit echter Delta-Zeit in Sekunden. */
  protected loop(fn: (dtSec: number, elapsedSec: number) => void): void {
    const startedAt = performance.now();
    let last = startedAt;
    this.every(30, () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      fn(dt, (now - startedAt) / 1000);
    });
  }

  protected after(ms: number, fn: () => void): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      this.timeouts.delete(id);
      if (!this.done) fn();
    }, ms);
    this.timeouts.add(id);
    return id;
  }

  protected cancel(id: ReturnType<typeof setTimeout> | null): void {
    if (id === null) return;
    clearTimeout(id);
    this.timeouts.delete(id);
  }

  /** Kurzes, aufsteigendes Text-Feedback über dem Spielfeld ("Perfekt!", "-1s" …). */
  protected pop(text: string, bad = false): void {
    const id = ++popCounter;
    this.pops.update((list) => [...list.slice(-2), { id, text, bad }]);
    setTimeout(() => this.pops.update((list) => list.filter((p) => p.id !== id)), 850);
  }

  protected finish(success: boolean, detail?: string): void {
    if (this.done) return;
    this.done = true;
    this.clearAll();
    this.finished.emit({ success, detail });
  }

  private clearAll(): void {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals.clear();
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts.clear();
  }
}

/** Zeitleiste + Feedback-Popups, von jedem Minigame unten eingebunden. */
@Component({
  selector: 'app-mg-status',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mg-pops">
      @for (p of game.pops(); track p.id) {
        <div class="mg-pop" [class.bad]="p.bad">{{ p.text }}</div>
      }
    </div>
    @if (game.hasClock()) {
      <div class="mg-timer" [class.low]="game.timeLow()">
        <div class="mg-timer-fill" [style.width.%]="game.timePct()"></div>
        <span class="mg-timer-label">⏳ {{ game.remainingSeconds() }}s</span>
      </div>
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class MgStatusComponent {
  @Input({ required: true }) game!: MinigameBase;
}
