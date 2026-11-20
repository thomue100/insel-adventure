import { Injectable, computed } from '@angular/core';
import { AdventureService } from './adventure.service';
import { CharacterService } from './character.service';
import { IslandMapService } from './island-map.service';
import { ADVENTURE_DEFINITIONS } from '../../data/adventures.data';
import { hexDistance, hexToPixel } from '../utils/hex-math.util';
import { HexTile } from '../models/hex-tile.model';

/** Bildschirm-Richtungen im Uhrzeigersinn, beginnend bei "rechts" (Winkel 0). */
// '︎' erzwingt die Text-Darstellung (Windows zeigt ↖/↗ sonst als Emoji).
const ARROWS = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'].map((a) => a + '︎');

export interface QuestHint {
  /** Kurzer Text für das HUD. */
  text: string;
  /** Richtungspfeil zum Ziel (leer, wenn das Duo schon dort steht oder es kein Ziel-Feld gibt). */
  arrow: string;
  distance: number | null;
}

/**
 * Wegweiser zum nächsten Abenteuer: Abenteuer starten nur beim Betreten
 * eines bestimmten Feldes, das oft noch im Nebel liegt. Ohne Hinweis findet
 * man es kaum – daher zeigt das HUD Ziel, Richtung und Entfernung.
 */
@Injectable({ providedIn: 'root' })
export class QuestService {
  constructor(
    private readonly adventures: AdventureService,
    private readonly characters: CharacterService,
    private readonly islandMap: IslandMapService,
  ) {}

  /** Das Feld, auf dem das nächste startbereite Abenteuer wartet. */
  readonly targetTile = computed<HexTile | null>(() => {
    this.adventures.completedCount(); // neu berechnen, sobald ein Abenteuer abgeschlossen ist
    const next = [...ADVENTURE_DEFINITIONS]
      .sort((a, b) => a.order - b.order)
      .find((def) => this.adventures.isReadyToTrigger(def.id));
    if (!next) return null;
    return this.islandMap.tileList().find((t) => t.adventureTrigger === next.id) ?? null;
  });

  readonly hint = computed<QuestHint | null>(() => {
    if (this.adventures.activeAdventureId()) return null;
    if (this.adventures.isJourneyComplete()) return null;
    if (!this.characters.hasMoved()) {
      return { text: 'Klick auf ein Nachbarfeld, um loszugehen', arrow: '', distance: null };
    }

    const tile = this.targetTile();
    if (!tile) return null;
    const def = ADVENTURE_DEFINITIONS.find((d) => d.id === tile.adventureTrigger);
    const from = this.characters.partyPosition();
    const distance = hexDistance(from, tile.coordinates);

    const a = hexToPixel(from, 1);
    const b = hexToPixel(tile.coordinates, 1);
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const sector = ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8;

    return {
      text: def?.title ?? 'Nächstes Abenteuer',
      arrow: distance > 0 ? ARROWS[sector] : '',
      distance,
    };
  });
}
