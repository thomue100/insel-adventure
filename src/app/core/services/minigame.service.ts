import { Injectable, signal } from '@angular/core';
import { MinigameType } from '../models/minigame.model';

@Injectable({ providedIn: 'root' })
export class MinigameService {
  private readonly _activeMinigame = signal<MinigameType | null>(null);
  private onResult: ((success: boolean) => void) | null = null;

  readonly activeMinigame = this._activeMinigame.asReadonly();

  /**
   * Startet ein Minigame. `onResult` wird genau einmal aufgerufen, sobald
   * das Minigame beendet ist (Erfolg oder Misserfolg) – analog zum
   * `onComplete`-Muster von DialogueService/AdventureService.
   */
  play(type: MinigameType, onResult: (success: boolean) => void): void {
    this._activeMinigame.set(type);
    this.onResult = onResult;
  }

  /** Wird von der Minigame-Komponente aufgerufen, sobald Erfolg/Misserfolg feststeht. */
  reportResult(success: boolean): void {
    this._activeMinigame.set(null);
    const callback = this.onResult;
    this.onResult = null;
    callback?.(success);
  }
}
