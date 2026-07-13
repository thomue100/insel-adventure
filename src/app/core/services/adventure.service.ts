import { Injectable, computed, signal } from '@angular/core';
import {
  AdventureChoice,
  AdventureDefinition,
  AdventureId,
  AdventureStep,
  TOTAL_ADVENTURES,
} from '../models/adventure.model';
import { DialogueService } from './dialogue.service';
import { InventoryService } from './inventory.service';
import { CharacterService } from './character.service';
import { MinigameService } from './minigame.service';
import { ADVENTURE_DEFINITIONS } from '../../data/adventures.data';
import { DIALOGUE_SCENES } from '../../data/dialogue-scenes.data';

@Injectable({ providedIn: 'root' })
export class AdventureService {
  private readonly _completedCount = signal(0);
  private readonly _completedAdventureIds = signal<Set<AdventureId>>(new Set());
  private readonly _activeAdventureId = signal<AdventureId | null>(null);
  private readonly _currentStepIndex = signal(0);
  private readonly _pendingChoices = signal<AdventureChoice[] | null>(null);
  /** Callback, der aufgerufen wird, sobald das aktuelle Abenteuer abgeschlossen ist. */
  private onAdventureComplete: (() => void) | null = null;

  readonly completedCount = this._completedCount.asReadonly();
  readonly activeAdventureId = this._activeAdventureId.asReadonly();
  /** Wenn gesetzt, wartet die UI auf eine Spielerentscheidung. */
  readonly pendingChoices = this._pendingChoices.asReadonly();
  readonly totalAdventures = TOTAL_ADVENTURES;
  readonly isJourneyComplete = computed(() => this._completedCount() >= TOTAL_ADVENTURES);

  readonly activeAdventure = computed<AdventureDefinition | null>(() => {
    const id = this._activeAdventureId();
    return id ? (ADVENTURE_DEFINITIONS.find((a) => a.id === id) ?? null) : null;
  });

  /** Fortschritt innerhalb des aktiven Abenteuers, z.B. "2/3" für die UI. */
  readonly currentStepProgress = computed(() => {
    const def = this.activeAdventure();
    if (!def) return null;
    return { current: this._currentStepIndex() + 1, total: def.steps.length };
  });

  constructor(
    private readonly dialogue: DialogueService,
    private readonly inventory: InventoryService,
    private readonly characters: CharacterService,
    private readonly minigames: MinigameService,
  ) {}

  hasCompleted(id: AdventureId): boolean {
    return this._completedAdventureIds().has(id);
  }

  /**
   * Wird beim Betreten einer Kachel mit `adventureTrigger` aufgerufen.
   * Startet das Abenteuer nur, wenn gerade kein anderes läuft, es noch nicht
   * abgeschlossen ist und die Voraussetzungen (vorherige Akte) erfüllt sind.
   * Sind die Bedingungen nicht erfüllt, passiert bewusst nichts – kein Fehler,
   * kein Hinweis, das Feld bleibt einfach für später "aufgehoben".
   */
  tryStartFromLocation(id: AdventureId): void {
    if (this._activeAdventureId()) return;
    if (this.hasCompleted(id)) return;

    const definition = ADVENTURE_DEFINITIONS.find((a) => a.id === id);
    if (!definition || definition.steps.length === 0) return; // noch nicht implementiertes Abenteuer
    if (this._completedCount() < definition.requiresCompletedCount) return;

    this.startAdventure(id);
  }

  /**
   * Startet ein Abenteuer: spielt zunächst die übergeordnete Einführungs-Szene,
   * danach automatisch den ersten Schritt. `onComplete` wird aufgerufen, sobald
   * das gesamte Abenteuer abgeschlossen ist (z.B. um direkt das nächste zu starten).
   */
  startAdventure(id: AdventureId, onComplete?: () => void): void {
    const definition = ADVENTURE_DEFINITIONS.find((a) => a.id === id);
    if (!definition) return;

    this._activeAdventureId.set(id);
    this._currentStepIndex.set(0);
    this._pendingChoices.set(null);
    this.onAdventureComplete = onComplete ?? null;

    const introScene = DIALOGUE_SCENES[definition.introDialogueSceneId];
    if (introScene) {
      this.dialogue.playScene(introScene, () => this.presentStep(definition, 0));
    } else {
      this.presentStep(definition, 0);
    }
  }

  /** Spielt die Einführung eines einzelnen Schritts ab (Spannungsaufbau/Beratung) und zeigt danach die Wahl. */
  private presentStep(definition: AdventureDefinition, stepIndex: number): void {
    const step: AdventureStep | undefined = definition.steps[stepIndex];
    if (!step) {
      this.finishAdventure();
      return;
    }

    const stepIntro = step.introDialogueSceneId ? DIALOGUE_SCENES[step.introDialogueSceneId] : undefined;
    if (stepIntro) {
      this.dialogue.playScene(stepIntro, () => this._pendingChoices.set(step.choices));
    } else {
      this._pendingChoices.set(step.choices);
    }
  }

  /**
   * Wird von der UI aufgerufen, wenn der Spieler eine Option wählt.
   * Hat die Wahl ein `minigame`, entscheidet dessen Ergebnis über Erfolg/Misserfolg;
   * sonst der klassische Skill-Vergleich mit der Hauptfigur.
   */
  chooseOption(choice: AdventureChoice): void {
    this._pendingChoices.set(null);

    if (choice.minigame) {
      this.minigames.play(choice.minigame, (success) => this.resolveChoice(choice, success));
      return;
    }

    const skillMatches = choice.preferredSkill ? this.characters.matchesLeadSkill(choice.preferredSkill) : true;
    this.resolveChoice(choice, skillMatches);
  }

  /**
   * Gemeinsame Auswertung für beide Entscheidungswege: spielt die passende
   * Ergebnis-Szene, vergibt eine eventuelle Belohnung und geht zum nächsten
   * Schritt über (oder schließt das Abenteuer ab, wenn es der letzte war).
   */
  private resolveChoice(choice: AdventureChoice, success: boolean): void {
    const sceneId = success || !choice.fallbackDialogueSceneId
      ? choice.outcomeDialogueSceneId
      : choice.fallbackDialogueSceneId;
    const outcomeScene = DIALOGUE_SCENES[sceneId];

    const advance = () => {
      for (const item of choice.rewardItems ?? []) {
        this.inventory.addItem(item);
      }

      const definition = this.activeAdventure();
      const nextIndex = this._currentStepIndex() + 1;
      if (definition && nextIndex < definition.steps.length) {
        this._currentStepIndex.set(nextIndex);
        this.presentStep(definition, nextIndex);
      } else {
        this.finishAdventure();
      }
    };

    if (outcomeScene) {
      this.dialogue.playScene(outcomeScene, advance);
    } else {
      advance();
    }
  }

  private finishAdventure(): void {
    const id = this._activeAdventureId();
    const definition = this.activeAdventure();

    if (id) {
      this._completedAdventureIds.update((set) => new Set(set).add(id));
    }
    if (definition?.countsTowardProgress !== false) {
      this._completedCount.update((c) => c + 1);
    }

    this._activeAdventureId.set(null);
    this._currentStepIndex.set(0);

    const callback = this.onAdventureComplete;
    this.onAdventureComplete = null;
    callback?.();
  }
}
