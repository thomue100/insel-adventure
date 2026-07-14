import { Injectable, signal } from '@angular/core';
import { BiomeType } from '../models/biome.enum';
import { DialogueService } from './dialogue.service';
import { AMBIENT_EVENTS } from '../../data/ambient-events.data';
import { DIALOGUE_SCENES } from '../../data/dialogue-scenes.data';

/** Wahrscheinlichkeit, dass auf einem passenden, sonst leeren Feld etwas passiert. */
const AMBIENT_TRIGGER_CHANCE = 0.4;

@Injectable({ providedIn: 'root' })
export class AmbientEventService {
  private readonly _playedIds = signal<Set<string>>(new Set());

  constructor(private readonly dialogue: DialogueService) {}

  /**
   * Versucht, für das gegebene Biom einen noch nicht gezeigten Ambiente-Moment
   * auszulösen – zufällig, mit AMBIENT_TRIGGER_CHANCE Wahrscheinlichkeit.
   * Wird von InteractionService nur auf Feldern ohne eigenes Event/Interactable
   * und nur beim allerersten Betreten aufgerufen.
   */
  tryTrigger(biome: BiomeType): void {
    const candidates = AMBIENT_EVENTS.filter(
      (e) => e.biome === biome && !this._playedIds().has(e.id),
    );
    if (candidates.length === 0) return;
    if (Math.random() > AMBIENT_TRIGGER_CHANCE) return;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const scene = DIALOGUE_SCENES[chosen.dialogueSceneId];
    if (!scene) return;

    this._playedIds.update((set) => new Set(set).add(chosen.id));
    this.dialogue.playScene(scene);
  }
}
