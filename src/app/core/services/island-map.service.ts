import { Injectable, computed, signal } from '@angular/core';
import { BiomeType } from '../models/biome.enum';
import { HexCoordinates, HexTile, hexId } from '../models/hex-tile.model';
import { hexDistance, hexSpiral } from '../utils/hex-math.util';
import { generateIslandTiles } from '../../data/island-generator';

@Injectable({ providedIn: 'root' })
export class IslandMapService {
  /** Interner State: Map von Tile-ID -> HexTile. Signal, damit Components reaktiv aktualisieren. */
  private readonly _tiles = signal<Map<string, HexTile>>(new Map());

  /** Öffentlich nur lesbar. */
  readonly tiles = this._tiles.asReadonly();

  /** Alle Tiles als Array, für *ngFor / @for im Template. */
  readonly tileList = computed(() => Array.from(this._tiles().values()));

  readonly revealedTileCount = computed(
    () => this.tileList().filter((t) => t.discoveryStatus !== 'hidden').length,
  );

  /**
   * Erzeugt eine neue Insel mit gegebenem Radius.
   * Die Biome-Verteilung passiert in island-generator.ts (Trennung Daten/Logik).
   * Gibt die vorgeschlagene Landestelle zurück (immer auf der der
   * Piratenbucht gegenüberliegenden Küstenseite).
   */
  generateIsland(radius: number, seed?: number): HexCoordinates {
    const { tiles, landingSpot } = generateIslandTiles(radius, seed);
    const map = new Map<string, HexTile>();
    for (const tile of tiles) {
      map.set(tile.id, tile);
    }
    this._tiles.set(map);
    return landingSpot;
  }

  getTile(coord: HexCoordinates): HexTile | undefined {
    return this._tiles().get(hexId(coord));
  }

  /**
   * Deckt ein einzelnes Feld auf (Status hidden -> revealed).
   * Löst KEINE Events aus – das übernimmt InteractionService beim "Betreten".
   */
  revealTile(coord: HexCoordinates): void {
    const tile = this.getTile(coord);
    if (!tile || tile.discoveryStatus !== 'hidden') return;
    this.updateTile({ ...tile, discoveryStatus: 'revealed' });
  }

  /**
   * Deckt alle Felder im gegebenen Radius um eine Position auf.
   * Wird nach jeder Charakterbewegung aufgerufen (Nebel-des-Krieges-Logik).
   */
  revealAround(center: HexCoordinates, radius: number): void {
    for (const coord of hexSpiral(center, radius)) {
      this.revealTile(coord);
    }
  }

  /** Markiert ein Feld als "explored", wenn ein Charakter tatsächlich darauf steht. */
  markExplored(coord: HexCoordinates): void {
    const tile = this.getTile(coord);
    if (!tile) return;
    this.updateTile({ ...tile, discoveryStatus: 'explored' });
  }

  /** Liefert alle Tiles eines bestimmten Biome-Typs (z.B. für Debug/Minimap). */
  tilesByBiome(biome: BiomeType): HexTile[] {
    return this.tileList().filter((t) => t.biome === biome);
  }

  /** Distanz-Hilfsfunktion direkt am Service verfügbar, für Bewegungs-Validierung. */
  distanceBetween(a: HexCoordinates, b: HexCoordinates): number {
    return hexDistance(a, b);
  }

  private updateTile(tile: HexTile): void {
    const map = new Map(this._tiles());
    map.set(tile.id, tile);
    this._tiles.set(map);
  }
}
