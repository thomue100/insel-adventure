import { SkillType } from './character.model';
import { InventoryItem } from './inventory.model';
import { MinigameType } from './minigame.model';

/**
 * 'rustling-creature' ist das Tutorial (Akt 0): reine Einführung in die
 * Dialog-Entscheidungs-Mechanik, kein Item, zählt nicht zum 4er-Fortschritt.
 */
export type AdventureId =
  | 'rustling-creature'
  | 'monkey-heist'
  | 'cave-of-e-buff'
  | 'native-village'
  | 'lost-treasure'
  | 'pirate-bay'
  | 'finale-escape';

export const TOTAL_ADVENTURES = 6;

/** Eine wählbare Reaktion innerhalb eines Abenteuer-Schritts. */
export interface AdventureChoice {
  id: string;
  label: string;
  /**
   * Welcher Skill dieser Option "in die Karten spielt". Nur relevant, wenn
   * KEIN `minigame` gesetzt ist – dann entscheidet stattdessen dessen Ergebnis.
   */
  preferredSkill?: SkillType;
  /**
   * Wenn gesetzt, startet die Wahl ein echtes Minigame über den MinigameService.
   * Dessen Erfolg/Misserfolg bestimmt dann outcome- vs. fallbackDialogueSceneId
   * (statt des Skill-Vergleichs).
   */
  minigame?: MinigameType;
  outcomeDialogueSceneId: string;
  fallbackDialogueSceneId?: string;
  /** Items, die bei dieser Wahl ins Inventar wandern (meist nur beim letzten Schritt). */
  rewardItems?: InventoryItem[];
}

/** Ein Teilschritt innerhalb eines Abenteuers (z.B. Spurensuche, Konfrontation, Versteck finden). */
export interface AdventureStep {
  id: string;
  /** Optionale Dialog-Szene (Spannungsaufbau, Beratung zwischen den Charakteren) vor der Wahl. */
  introDialogueSceneId?: string;
  choices: AdventureChoice[];
}

export interface AdventureDefinition {
  id: AdventureId;
  order: number; // 0-4 (0 = Tutorial)
  title: string;
  /** Dialog-Szene, die das gesamte Abenteuer einführt, bevor der erste Schritt startet. */
  introDialogueSceneId: string;
  steps: AdventureStep[];
  /**
   * Wie viele (zählende) Abenteuer vorher abgeschlossen sein müssen, bevor
   * dieses per Kachel-Betreten überhaupt auslösen kann (hält die Akt-Reihenfolge ein).
   */
  requiresCompletedCount: number;
  /**
   * Zählt dieses Abenteuer zum sichtbaren 4er-Fortschritt (HUD "Abenteuer x/4")?
   * Standard: true. Das Tutorial ("Raschel-Tier") setzt dies auf false.
   */
  countsTowardProgress?: boolean;
}
