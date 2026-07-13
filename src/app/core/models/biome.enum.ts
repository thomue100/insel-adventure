/**
 * Alle Biome, die auf der Insel vorkommen können.
 * 'beach' bildet standardmäßig den Küstenring um die Insel.
 */
export enum BiomeType {
  Beach = 'beach',       // Strand – Startgebiet, ungefährlich
  Jungle = 'jungle',     // Dichter Urwald – Gefahren, versteckte Events
  Lake = 'lake',         // Binnensee – evtl. Monster
  Mountain = 'mountain', // Berge – Aussichtspunkte, decken Nebel großflächig auf
  Bay = 'bay',           // Bucht – Piratenschiff & Piratenlager
  Village = 'village',   // Eingeborenendorf – geheimnisvoll, NPCs/Quests
}

/** Rein kosmetische Metadaten pro Biome, z.B. für Icon/Farbe im UI. */
export interface BiomeMeta {
  label: string;
  icon: string;
  baseColorVar: string; // CSS-Variable, siehe styles/theme
  dangerLevel: 0 | 1 | 2 | 3;
}

export const BIOME_META: Record<BiomeType, BiomeMeta> = {
  [BiomeType.Beach]: { label: 'Strand', icon: '🏖️', baseColorVar: '--biome-beach', dangerLevel: 0 },
  [BiomeType.Jungle]: { label: 'Urwald', icon: '🌴', baseColorVar: '--biome-jungle', dangerLevel: 2 },
  [BiomeType.Lake]: { label: 'Binnensee', icon: '🌊', baseColorVar: '--biome-lake', dangerLevel: 2 },
  [BiomeType.Mountain]: { label: 'Berge', icon: '⛰️', baseColorVar: '--biome-mountain', dangerLevel: 1 },
  [BiomeType.Bay]: { label: 'Bucht', icon: '⚓', baseColorVar: '--biome-bay', dangerLevel: 1 },
  [BiomeType.Village]: { label: 'Dorf', icon: '🛖', baseColorVar: '--biome-village', dangerLevel: 0 },
};
