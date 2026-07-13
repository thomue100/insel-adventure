import { CharacterId } from './character.model';

export type Emotion =
  | 'neutral'
  | 'sarcastic'
  | 'smug'
  | 'panicked'
  | 'confused'
  | 'annoyed'
  | 'triumphant';

export interface DialogueLine {
  speaker: CharacterId | 'narrator';
  text: string;
  emotion?: Emotion;
}

export type DialogueTrigger = 'intro' | 'tile-reveal' | 'interaction' | 'manual';

export interface DialogueScene {
  id: string;
  trigger: DialogueTrigger;
  /** Läuft die Szene nur einmal ab? (z.B. Intro) */
  once: boolean;
  hasPlayed: boolean;
  lines: DialogueLine[];
}
