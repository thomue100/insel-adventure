import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed } from '@angular/core';
import { HexTileComponent } from '../hex-tile/hex-tile.component';
import { IslandMapService } from '../../../core/services/island-map.service';
import { CharacterService } from '../../../core/services/character.service';
import { CHARACTER_PROFILES } from '../../../core/models/character.model';
import { HexTile } from '../../../core/models/hex-tile.model';
import { hexToPixel } from '../../../core/utils/hex-math.util';

const TILE_SIZE = 40;

@Component({
  selector: 'app-hex-grid',
  standalone: true,
  imports: [HexTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="hex-grid-svg"
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="xMidYMid meet"
    >
      <g [attr.transform]="'translate(' + offset().x + ',' + offset().y + ')'">
        @for (tile of islandMap.tileList(); track tile.id) {
          <g app-hex-tile [tile]="tile" [size]="tileSize" (tileClick)="onTileClick($event)"></g>
        }

        <!-- Das Duo: immer gemeinsam auf einem Feld, nie getrennt -->
        @if (partyVisible()) {
          <text
            [attr.x]="partyPixel().x - 12"
            [attr.y]="partyPixel().y - tileSize * 0.1"
            text-anchor="middle"
            class="character-marker"
            [class.active-character]="characters.leadCharacter() === 'princess'"
          >
            {{ princessIcon }}
          </text>
          <text
            [attr.x]="partyPixel().x + 12"
            [attr.y]="partyPixel().y - tileSize * 0.1"
            text-anchor="middle"
            class="character-marker"
            [class.active-character]="characters.leadCharacter() === 'helix'"
          >
            {{ helixIcon }}
          </text>
        }
      </g>
    </svg>
  `,
  styles: [`
    .hex-grid-svg {
      width: 100%;
      height: 100%;
      display: block;
      background: var(--map-bg, #0c0c12);
    }
    .character-marker {
      font-size: 24px;
      pointer-events: none;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.6));
    }
    .active-character {
      filter: drop-shadow(0 0 6px var(--accent-color, #e0a458));
    }
  `],
})
export class HexGridComponent {
  readonly tileSize = TILE_SIZE;
  readonly princessIcon = CHARACTER_PROFILES.princess.spriteIcon;
  readonly helixIcon = CHARACTER_PROFILES.helix.spriteIcon;

  @Output() tileSelected = new EventEmitter<HexTile>();

  constructor(
    readonly islandMap: IslandMapService,
    readonly characters: CharacterService,
  ) {}

  readonly partyVisible = computed(() => {
    const tile = this.islandMap.getTile(this.characters.partyPosition());
    return !!tile && tile.discoveryStatus !== 'hidden';
  });

  readonly partyPixel = computed(() => hexToPixel(this.characters.partyPosition(), this.tileSize));

  readonly viewBox = computed(() => {
    const tiles = this.islandMap.tileList();
    if (tiles.length === 0) return '0 0 800 600';
    const points = tiles.map((t) => hexToPixel(t.coordinates, this.tileSize));
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const pad = this.tileSize * 2;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  });

  readonly offset = computed(() => ({ x: 0, y: 0 })); // Platzhalter für spätere Pan/Zoom-Logik

  onTileClick(tile: HexTile): void {
    this.tileSelected.emit(tile);
  }
}
