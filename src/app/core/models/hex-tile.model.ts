import { BiomeType } from './biome.enum';
import { CharacterId } from './character.model';
import { AdventureId } from './adventure.model';

/** Axiale Hex-Koordinaten (q, r). Siehe https://www.redblobgames.com/grids/hexagons/ */
export interface HexCoordinates {
  q: number;
  r: number;
}

export type DiscoveryStatus =
  | 'hidden'    // komplett im Nebel des Krieges, keine Infos
  | 'revealed'  // aufgedeckt, Biome sichtbar, kein Charakter je dort gewesen
  | 'explored'; // von einem Charakter betreten, Events ggf. ausgelöst

export interface HexEvent {
  id: string;
  title: string;
  description: string;
  /** Wird beim ersten Betreten des Feldes ausgelöst. */
  triggerOnce: boolean;
  triggered: boolean;
  /** Optionaler Dialogue-Scene-Verweis, der beim Trigger abgespielt wird. */
  dialogueSceneId?: string;
}

export interface HexItem {
  id: string;
  name: string;
  description: string;
  collected: boolean;
}

export type InteractableType = 'ship' | 'pirate_camp' | 'village' | 'viewpoint' | 'cave' | 'temple';

export interface InteractablePlace {
  id: string;
  type: InteractableType;
  name: string;
  description: string;
  /** Manche Orte lassen sich nur von einer bestimmten Figur betreten (z.B. nur Helix traut sich aufs Schiff). */
  restrictedTo?: CharacterId;
  dialogueSceneId?: string;
}

export interface HexTile {
  id: string; // deterministisch aus Koordinaten: `${q}_${r}`
  coordinates: HexCoordinates;
  biome: BiomeType;
  discoveryStatus: DiscoveryStatus;
  /** Reine Sicht-Reichweite, z.B. Berge decken mehr Nachbarfelder auf. */
  visionBonus: number;
  event?: HexEvent;
  item?: HexItem;
  interactable?: InteractablePlace;
  /**
   * Wenn gesetzt: Betritt das Duo dieses Feld, versucht der AdventureService,
   * das zugehörige Abenteuer zu starten (sofern Voraussetzungen erfüllt sind).
   * So werden Abenteuer durch Exploration statt durch Zufall/manuell ausgelöst.
   */
  adventureTrigger?: AdventureId;
}

export function hexId(coords: HexCoordinates): string {
  return `${coords.q}_${coords.r}`;
}
