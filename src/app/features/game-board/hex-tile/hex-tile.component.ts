import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HexTile } from '../../../core/models/hex-tile.model';
import { BIOME_META } from '../../../core/models/biome.enum';
import { hexCorners, hexToPixel } from '../../../core/utils/hex-math.util';

@Component({
  // "svg:" Namespace-Präfix ist nötig, da Angular den SVG-Kontext einer eigenen
  // Komponente nicht automatisch vom Elternteil übernimmt.
  selector: 'svg:g[app-hex-tile]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:polygon
      [attr.points]="points"
      [class.hidden-tile]="tile.discoveryStatus === 'hidden'"
      [class.revealed-tile]="tile.discoveryStatus === 'revealed'"
      [class.explored-tile]="tile.discoveryStatus === 'explored'"
      [style.--tile-color]="tile.discoveryStatus !== 'hidden' ? biomeColor : 'transparent'"
      (click)="tileClick.emit(tile)"
    />
    @if (tile.discoveryStatus !== 'hidden') {
      <svg:text [attr.x]="center.x" [attr.y]="center.y + 5" text-anchor="middle" class="tile-icon">
        {{ biomeIcon }}
      </svg:text>
      @if (tile.interactable || tile.event) {
        <svg:circle [attr.cx]="center.x + size * 0.5" [attr.cy]="center.y - size * 0.5" r="6" class="marker-dot" />
      }
    }
  `,
  styles: [`
    polygon {
      stroke: var(--grid-line, #2a2a35);
      stroke-width: 1.5;
      fill: var(--tile-color, transparent);
      cursor: pointer;
      transition: fill 0.25s ease, opacity 0.3s ease;
    }
    .hidden-tile {
      fill: var(--fog-color, #12121a);
      opacity: 0.95;
    }
    .revealed-tile { opacity: 0.85; }
    .explored-tile { opacity: 1; }
    .tile-icon {
      font-size: 18px;
      pointer-events: none;
      user-select: none;
    }
    .marker-dot {
      fill: var(--accent-color, #e0a458);
      stroke: #1a1a1a;
      stroke-width: 1;
    }
  `],
})
export class HexTileComponent {
  @Input({ required: true }) tile!: HexTile;
  @Input() size = 40;
  @Output() tileClick = new EventEmitter<HexTile>();

  get center() {
    return hexToPixel(this.tile.coordinates, this.size);
  }

  get points(): string {
    return hexCorners(this.center, this.size - 2);
  }

  get biomeIcon(): string {
    return BIOME_META[this.tile.biome].icon;
  }

  get biomeColor(): string {
    return `var(${BIOME_META[this.tile.biome].baseColorVar})`;
  }
}
