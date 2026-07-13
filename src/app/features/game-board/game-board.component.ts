import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HexGridComponent } from './hex-grid/hex-grid.component';
import { HudComponent } from '../hud/hud.component';
import { DialogueBoxComponent } from '../dialogue-box/dialogue-box.component';
import { AdventureChoiceComponent } from '../adventure-choice/adventure-choice.component';
import { MinigameOverlayComponent } from '../minigame-overlay/minigame-overlay.component';
import { VictoryBannerComponent } from '../victory-banner/victory-banner.component';
import { IslandMapService } from '../../core/services/island-map.service';
import { CharacterService } from '../../core/services/character.service';
import { InteractionService } from '../../core/services/interaction.service';
import { DialogueService } from '../../core/services/dialogue.service';
import { AdventureService } from '../../core/services/adventure.service';
import { MinigameService } from '../../core/services/minigame.service';
import { HexTile } from '../../core/models/hex-tile.model';
import { DIALOGUE_SCENES } from '../../data/dialogue-scenes.data';

const ISLAND_RADIUS = 6; // größere Insel als zuvor (radius 4)

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HexGridComponent, HudComponent, DialogueBoxComponent, AdventureChoiceComponent, MinigameOverlayComponent, VictoryBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="board-wrapper">
      <app-hud />
      <app-hex-grid (tileSelected)="onTileSelected($event)" />
      <app-dialogue-box />
      <app-adventure-choices />
      <app-minigame-overlay />
      <app-victory-banner />
    </div>
  `,
  styles: [`
    .board-wrapper {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: var(--map-bg, #0c0c12);
    }
  `],
})
export class GameBoardComponent implements OnInit {
  constructor(
    private readonly islandMap: IslandMapService,
    private readonly characters: CharacterService,
    private readonly interaction: InteractionService,
    private readonly dialogue: DialogueService,
    private readonly adventures: AdventureService,
    private readonly minigames: MinigameService,
  ) {}

  ngOnInit(): void {
    const landingSpot = this.islandMap.generateIsland(ISLAND_RADIUS);
    this.characters.placePartyAt(landingSpot);

    // Nur der Strand-Dialog läuft automatisch an. Alle Abenteuer (auch das
    // Raschel-Tier-Tutorial und die Affen) werden ab jetzt ausschließlich
    // durch Erkunden ausgelöst – also durch tatsächliches Betreten der
    // jeweiligen Kachel (siehe adventureTrigger in island-generator.ts).
    this.dialogue.playScene(DIALOGUE_SCENES['intro']);
  }

  onTileSelected(tile: HexTile): void {
    // Solange ein Dialog läuft, eine Entscheidung ansteht oder ein Minigame aktiv ist, keine Bewegung zulassen.
    if (this.dialogue.isSceneActive() || this.adventures.pendingChoices() || this.minigames.activeMinigame()) return;
    this.interaction.movePartyTo(tile.coordinates);
  }
}

