export type CharacterId = 'princess' | 'helix';

/** Die beiden Skill-Achsen, gegen die Abenteuer-Entscheidungen geprüft werden. */
export type SkillType = 'diplomacy' | 'strength';

export interface CharacterProfile {
  id: CharacterId;
  displayName: string;
  spriteIcon: string;
  portrait: string;
  /** Der Skill, in dem diese Figur besonders gut ist – bestimmt Erfolgs-Nuancen bei Entscheidungen. */
  primarySkill: SkillType;
  /** Kurzbeschreibung für den Auswahlbildschirm. */
  tagline: string;
}

export const CHARACTER_PROFILES: Record<CharacterId, CharacterProfile> = {
  princess: {
    id: 'princess',
    displayName: 'Prinzessin Laja',
    spriteIcon: '👑',
    portrait: 'princess_neutral',
    primarySkill: 'diplomacy',
    tagline: 'Diplomatie & Geschick',
  },
  helix: {
    id: 'helix',
    displayName: 'Schlimm Helix Kisten',
    spriteIcon: '🏴‍☠️',
    portrait: 'helix_neutral',
    primarySkill: 'strength',
    tagline: 'Kraft & Einschüchterung',
  },
};
