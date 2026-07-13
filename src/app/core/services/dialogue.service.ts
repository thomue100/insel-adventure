import { Injectable, computed, signal } from '@angular/core';
import { DialogueLine, DialogueScene } from '../models/dialogue.model';

@Injectable({ providedIn: 'root' })
export class DialogueService {
  private readonly _activeScene = signal<DialogueScene | null>(null);
  private readonly _lineIndex = signal(0);
  /** Szenen, die als "once" markiert sind und bereits gespielt wurden (per ID). */
  private readonly _playedSceneIds = signal<Set<string>>(new Set());
  /** Callback, der aufgerufen wird, sobald die aktuelle Szene beendet ist. */
  private onSceneEnd: (() => void) | null = null;

  readonly activeScene = this._activeScene.asReadonly();
  readonly currentLine = computed<DialogueLine | null>(() => {
    const scene = this._activeScene();
    if (!scene) return null;
    return scene.lines[this._lineIndex()] ?? null;
  });
  readonly isSceneActive = computed(() => this._activeScene() !== null);
  readonly isLastLine = computed(() => {
    const scene = this._activeScene();
    if (!scene) return true;
    return this._lineIndex() >= scene.lines.length - 1;
  });

  /**
   * Spielt eine Szene ab. `onComplete` wird garantiert aufgerufen, sobald die
   * Szene zu Ende ist – auch dann, wenn die Szene "once" ist und bereits
   * gespielt wurde (dann sofort, ohne erneute Anzeige). So lassen sich
   * Abenteuer-Schritte sauber aneinanderreihen, ohne auf Signal-Effects
   * angewiesen zu sein.
   */
  playScene(scene: DialogueScene, onComplete?: () => void): void {
    if (scene.once && this._playedSceneIds().has(scene.id)) {
      onComplete?.();
      return;
    }
    this._activeScene.set(scene);
    this._lineIndex.set(0);
    this.onSceneEnd = onComplete ?? null;
  }

  /** Klick auf die Sprechblase: zur nächsten Zeile, oder Szene beenden. */
  advance(): void {
    const scene = this._activeScene();
    if (!scene) return;

    if (this.isLastLine()) {
      this.endScene();
      return;
    }
    this._lineIndex.update((i) => i + 1);
  }

  endScene(): void {
    const scene = this._activeScene();
    if (scene?.once) {
      this._playedSceneIds.update((set) => new Set(set).add(scene.id));
    }
    this._activeScene.set(null);
    this._lineIndex.set(0);

    const callback = this.onSceneEnd;
    this.onSceneEnd = null;
    callback?.();
  }

  hasPlayed(sceneId: string): boolean {
    return this._playedSceneIds().has(sceneId);
  }
}

