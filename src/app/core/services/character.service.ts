import { Injectable, computed, signal } from '@angular/core';
import { CHARACTER_PROFILES, CharacterId, SkillType } from '../models/character.model';
import { HexCoordinates } from '../models/hex-tile.model';
import { IslandMapService } from './island-map.service';
import { hexDistance } from '../utils/hex-math.util';

const PARTY_MOVEMENT_RANGE = 2;
const PARTY_VISION_RANGE = 1;

/**
 * Verwaltet Laja & Helix als untrennbares Duo: eine gemeinsame Position,
 * dazu die zu Spielbeginn gewählte Hauptfigur (bestimmt Skill-Vorteile).
 */
@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly _leadCharacter = signal<CharacterId | null>(null);
  private readonly _partyPosition = signal<HexCoordinates>({ q: 0, r: 0 });
  private readonly _hasMoved = signal(false);

  readonly leadCharacter = this._leadCharacter.asReadonly();
  readonly partyPosition = this._partyPosition.asReadonly();
  /** Wird true, sobald das Duo sich ein einziges Mal bewegt hat (für den garantierten ersten-Schritt-Trigger). */
  readonly hasMoved = this._hasMoved.asReadonly();

  readonly companionCharacter = computed<CharacterId | null>(() => {
    const lead = this._leadCharacter();
    if (!lead) return null;
    return lead === 'princess' ? 'helix' : 'princess';
  });

  readonly leadProfile = computed(() => {
    const lead = this._leadCharacter();
    return lead ? CHARACTER_PROFILES[lead] : null;
  });

  readonly companionProfile = computed(() => {
    const companion = this.companionCharacter();
    return companion ? CHARACTER_PROFILES[companion] : null;
  });

  constructor(private readonly islandMap: IslandMapService) {}

  /** Einmalige Wahl zu Spielbeginn: welche Figur führt das Duo an? */
  chooseLeadCharacter(id: CharacterId): void {
    this._leadCharacter.set(id);
  }

  /** Ist die aktuelle Hauptfigur in diesem Skill besonders stark? Steuert Entscheidungs-Ausgänge. */
  matchesLeadSkill(skill: SkillType): boolean {
    const lead = this._leadCharacter();
    return lead ? CHARACTER_PROFILES[lead].primarySkill === skill : false;
  }

  /** Bewegt das gesamte Duo gemeinsam zu einem Zielfeld (sofern in Reichweite). */
  movePartyTo(target: HexCoordinates): boolean {
    const distance = hexDistance(this._partyPosition(), target);
    if (distance === 0 || distance > PARTY_MOVEMENT_RANGE) return false;

    this._partyPosition.set(target);
    this._hasMoved.set(true);
    this.islandMap.revealAround(target, PARTY_VISION_RANGE);
    this.islandMap.markExplored(target);
    return true;
  }

  /** Setzt das Duo auf eine Startposition (z.B. Strandabschnitt beim Intro). */
  placePartyAt(coord: HexCoordinates): void {
    this._partyPosition.set(coord);
    this.islandMap.revealAround(coord, PARTY_VISION_RANGE);
  }
}
