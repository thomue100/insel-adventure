import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdventureService } from '../../core/services/adventure.service';
import { DialogueService } from '../../core/services/dialogue.service';
import { MinigameService } from '../../core/services/minigame.service';

@Component({
  selector: 'app-victory-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shouldShow()) {
      <div class="victory-overlay">
        <div class="victory-panel">
          <div class="victory-title">🏝️ Insel verlassen!</div>
          <div class="victory-subtitle">
            Prototyp abgeschlossen – Prinzessin Laja &amp; Schlimm Helix Kisten segeln davon.
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .victory-overlay {
      position: fixed;
      top: 5rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 45;
      pointer-events: none;
    }
    .victory-panel {
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid var(--accent-color, #e0a458);
      border-radius: 14px;
      padding: 0.9rem 1.6rem;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      animation: pop-in 0.25s ease-out;
    }
    .victory-title {
      font-size: 1.15rem;
      font-weight: bold;
      color: var(--text-primary, #f2ede3);
    }
    .victory-subtitle {
      font-size: 0.82rem;
      color: #cfcabe;
      opacity: 0.85;
      margin-top: 0.2rem;
    }
    @keyframes pop-in {
      from { transform: translateY(-8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class VictoryBannerComponent {
  constructor(
    private readonly adventures: AdventureService,
    private readonly dialogue: DialogueService,
    private readonly minigames: MinigameService,
  ) {}

  /** Erst zeigen, wenn wirklich alles (inkl. letzter Dialogzeile) abgeschlossen ist. */
  shouldShow(): boolean {
    return (
      this.adventures.isJourneyComplete() &&
      !this.dialogue.isSceneActive() &&
      !this.minigames.activeMinigame() &&
      !this.adventures.pendingChoices()
    );
  }
}
