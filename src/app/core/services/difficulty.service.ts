import { Injectable, signal } from '@angular/core';

export type DifficultyLevel = 'relaxed' | 'normal' | 'tricky';

export const DIFFICULTY_LEVELS: ReadonlyArray<{ id: DifficultyLevel; icon: string; label: string }> = [
  { id: 'relaxed', icon: '😌', label: 'Entspannt' },
  { id: 'normal', icon: '🙂', label: 'Normal' },
  { id: 'tricky', icon: '😤', label: 'Knifflig' },
];

const STORAGE_KEY = 'insel-adventure.difficulty';

/** Vom Spieler gewählte Minigame-Schwierigkeit, im Browser gemerkt. */
@Injectable({ providedIn: 'root' })
export class DifficultyService {
  private readonly _level = signal<DifficultyLevel>(this.load());
  readonly level = this._level.asReadonly();

  setLevel(level: DifficultyLevel): void {
    this._level.set(level);
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // Speicher nicht verfügbar – Wahl gilt dann nur für diese Sitzung.
    }
  }

  private load(): DifficultyLevel {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'relaxed' || stored === 'normal' || stored === 'tricky') return stored;
    } catch {
      // ignorieren
    }
    return 'normal';
  }
}
