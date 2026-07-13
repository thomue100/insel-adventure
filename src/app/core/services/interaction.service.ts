import { Injectable } from '@angular/core';
import { HexCoordinates } from '../models/hex-tile.model';
import { IslandMapService } from './island-map.service';
import { CharacterService } from './character.service';
import { DialogueService } from './dialogue.service';
import { AdventureService } from './adventure.service';
import { DIALOGUE_SCENES } from '../../data/dialogue-scenes.data';

@Injectable({ providedIn: 'root' })
export class InteractionService {
  constructor(
    private readonly islandMap: IslandMapService,
    private readonly characters: CharacterService,
    private readonly dialogue: DialogueService,
    private readonly adventures: AdventureService,
  ) {}

  /**
   * Zentrale Aktion, wenn der Spieler auf ein Feld klickt:
   * 1. Bewegung des gesamten Duos versuchen
   * 2. Bei Erfolg: Feld-Event auslösen (einmalig)
   * 3. Zugriffsbeschränkte Orte werden anhand der Hauptfigur geprüft
   * 4. Ist das Feld ein Abenteuer-Trigger, versucht der AdventureService zu starten
   */
  movePartyTo(target: HexCoordinates): { moved: boolean; blockedReason?: string } {
    const tile = this.islandMap.getTile(target);
    if (!tile) return { moved: false, blockedReason: 'Kein gültiges Feld.' };

    const lead = this.characters.leadCharacter();
    if (tile.interactable?.restrictedTo && tile.interactable.restrictedTo !== lead) {
      return { moved: false, blockedReason: 'Diese Figur traut sich hier nicht hin.' };
    }

    const moved = this.characters.movePartyTo(target);
    if (!moved) return { moved: false, blockedReason: 'Zu weit entfernt.' };

    this.triggerTileEvent(target);
    this.triggerLocationAdventure(target);
    return { moved: true };
  }

  /** Löst das an ein Feld gebundene Event aus (falls vorhanden & noch nicht getriggert). */
  private triggerTileEvent(coord: HexCoordinates): void {
    const tile = this.islandMap.getTile(coord);
    if (!tile?.event || tile.event.triggered) return;

    tile.event.triggered = true; // einfacher Ansatz; bei Bedarf via IslandMapService.updateTile kapseln

    if (tile.event.dialogueSceneId) {
      const scene = DIALOGUE_SCENES[tile.event.dialogueSceneId];
      if (scene) this.dialogue.playScene(scene);
    }
  }

  /** Betritt das Duo ein Feld mit `adventureTrigger`, versucht das zugehörige Abenteuer zu starten. */
  private triggerLocationAdventure(coord: HexCoordinates): void {
    const tile = this.islandMap.getTile(coord);
    if (!tile?.adventureTrigger) return;
    this.adventures.tryStartFromLocation(tile.adventureTrigger);
  }

  /** Explizite Interaktion mit einem Ort, z.B. per Button "Betreten" statt reinem Draufklicken. */
  interactWithPlace(coord: HexCoordinates): void {
    const tile = this.islandMap.getTile(coord);
    if (!tile?.interactable) return;

    const lead = this.characters.leadCharacter();
    if (tile.interactable.restrictedTo && tile.interactable.restrictedTo !== lead) {
      return;
    }

    if (tile.interactable.dialogueSceneId) {
      const scene = DIALOGUE_SCENES[tile.interactable.dialogueSceneId];
      if (scene) this.dialogue.playScene(scene);
    }
  }
}

