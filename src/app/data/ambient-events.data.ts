import { BiomeType } from '../core/models/biome.enum';

export interface AmbientEventDefinition {
  id: string;
  biome: BiomeType;
  dialogueSceneId: string;
}

/**
 * Kleine, wiederverwendbare Ambiente-Momente gegen Leerlauf auf "leeren"
 * Feldern (kein Event, kein besonderer Ort). Werden von InteractionService
 * mit einer gewissen Wahrscheinlichkeit beim ERSTEN Betreten eines
 * passenden Feldes ausgelöst – rein narrativ, kein Minigame, kein Item.
 */
export const AMBIENT_EVENTS: AmbientEventDefinition[] = [
  { id: 'ambient-beach-shell', biome: BiomeType.Beach, dialogueSceneId: 'ambient-beach-shell' },
  { id: 'ambient-beach-bottle', biome: BiomeType.Beach, dialogueSceneId: 'ambient-beach-bottle' },

  { id: 'ambient-jungle-bird', biome: BiomeType.Jungle, dialogueSceneId: 'ambient-jungle-bird' },
  { id: 'ambient-jungle-fruit', biome: BiomeType.Jungle, dialogueSceneId: 'ambient-jungle-fruit' },
  { id: 'ambient-jungle-vine', biome: BiomeType.Jungle, dialogueSceneId: 'ambient-jungle-vine' },

  { id: 'ambient-lake-fish', biome: BiomeType.Lake, dialogueSceneId: 'ambient-lake-fish' },
  { id: 'ambient-lake-reflection', biome: BiomeType.Lake, dialogueSceneId: 'ambient-lake-reflection' },

  { id: 'ambient-mountain-wind', biome: BiomeType.Mountain, dialogueSceneId: 'ambient-mountain-wind' },
  { id: 'ambient-mountain-rocks', biome: BiomeType.Mountain, dialogueSceneId: 'ambient-mountain-rocks' },

  { id: 'ambient-bay-driftwood', biome: BiomeType.Bay, dialogueSceneId: 'ambient-bay-driftwood' },

  { id: 'ambient-village-chicken', biome: BiomeType.Village, dialogueSceneId: 'ambient-village-chicken' },
  { id: 'ambient-village-drums', biome: BiomeType.Village, dialogueSceneId: 'ambient-village-drums' },
];
