import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CharacterService } from '../../core/services/character.service';
import { IslandMapService } from '../../core/services/island-map.service';
import { InventoryService } from '../../core/services/inventory.service';
import { AdventureService } from '../../core/services/adventure.service';
import { QuestService } from '../../core/services/quest.service';

@Component({
  selector: 'app-hud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hud">
      @if (characters.leadProfile(); as lead) {
        <div class="party-tag lead">{{ lead.spriteIcon }} {{ lead.displayName }}</div>
      }
      @if (characters.companionProfile(); as companion) {
        <div class="party-tag">{{ companion.spriteIcon }} {{ companion.displayName }}</div>
      }
      <div class="fog-status">🧭 {{ islandMap.revealedTileCount() }} Felder erkundet</div>
      <div class="adventure-status">
        📜 Abenteuer {{ adventures.completedCount() }}/{{ adventures.totalAdventures }}
        @if (adventures.currentStepProgress(); as progress) {
          <span class="step-progress">(Schritt {{ progress.current }}/{{ progress.total }})</span>
        }
      </div>
      @if (quest.hint(); as hint) {
        <div class="quest-hint" title="Dorthin, um das nächste Abenteuer zu starten – das Zielfeld leuchtet auf der Karte.">
          🎯 {{ hint.text }}
          @if (hint.distance !== null) {
            <span class="quest-dir"><b>{{ hint.arrow }}</b> {{ hint.distance }} {{ hint.distance === 1 ? 'Feld' : 'Felder' }}</span>
          }
        </div>
      }
      @if (inventory.items().length > 0) {
        <div class="inventory-bar">
          @for (item of inventory.items(); track item.id) {
            <span class="inventory-item" [title]="item.name + ' – ' + item.description">
              {{ item.icon }}
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .hud {
      position: fixed;
      top: 1rem; left: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      z-index: 40;
      flex-wrap: wrap;
      max-width: calc(100vw - 2rem);
    }
    .party-tag {
      background: rgba(20,20,28,0.85);
      border: 1px solid #3a3a45;
      color: #f2ede3;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .party-tag.lead {
      border-color: var(--accent-color, #e0a458);
    }
    .fog-status, .adventure-status {
      color: #cfcabe;
      font-size: 0.8rem;
      margin-left: 0.25rem;
      opacity: 0.8;
      white-space: nowrap;
    }
    .step-progress {
      opacity: 0.7;
      margin-left: 0.15rem;
    }
    .quest-hint {
      background: rgba(224, 164, 88, 0.15);
      border: 1px solid var(--accent-color, #e0a458);
      color: #f2ede3;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      font-size: 0.82rem;
      white-space: nowrap;
    }
    .quest-dir {
      margin-left: 0.4rem;
      opacity: 0.9;
    }
    .quest-dir b {
      font-size: 1.05rem;
      color: var(--accent-color, #e0a458);
    }
    .inventory-bar {
      display: flex;
      gap: 0.35rem;
      background: rgba(20,20,28,0.85);
      border: 1px solid #3a3a45;
      border-radius: 999px;
      padding: 0.35rem 0.6rem;
    }
    .inventory-item {
      font-size: 1.1rem;
      cursor: default;
    }
  `],
})
export class HudComponent {
  constructor(
    readonly characters: CharacterService,
    readonly islandMap: IslandMapService,
    readonly inventory: InventoryService,
    readonly adventures: AdventureService,
    readonly quest: QuestService,
  ) {}
}
