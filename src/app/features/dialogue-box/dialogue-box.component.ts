import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogueService } from '../../core/services/dialogue.service';

@Component({
  selector: 'app-dialogue-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dialogue.isSceneActive() && dialogue.currentLine(); as line) {
      <div
        class="dialogue-overlay"
        (click)="dialogue.advance()"
        [attr.aria-label]="'Weiter im Dialog'"
      >
        <div class="dialogue-box" [class]="'speaker-' + line.speaker">
          @if (line.speaker !== 'narrator') {
            <div class="portrait" [class]="'portrait-' + line.speaker">
              {{ line.speaker === 'princess' ? '👑' : '🏴‍☠️' }}
            </div>
          }
          <div class="text-area">
            <div class="speaker-name">
              {{ speakerLabel(line.speaker) }}
            </div>
            <p class="line-text">{{ line.text }}</p>
          </div>
          <div class="advance-hint">
            {{ dialogue.isLastLine() ? '✕ schließen' : '▶ weiter' }}
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialogue-overlay {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      display: flex;
      justify-content: center;
      padding: 1rem 1rem 1.5rem;
      cursor: pointer;
      z-index: 50;
    }
    .dialogue-box {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      max-width: 640px;
      width: 100%;
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid var(--dialogue-border, #e0a458);
      border-radius: 14px;
      padding: 0.85rem 1.1rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      animation: pop-in 0.18s ease-out;
    }
    .speaker-princess { border-color: #c98fd6; }
    .speaker-helix { border-color: #6fa8dc; }
    .speaker-narrator { border-color: #5b5b66; font-style: italic; }

    .portrait {
      font-size: 28px;
      flex-shrink: 0;
      width: 42px; height: 42px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }
    .text-area { flex: 1; min-width: 0; }
    .speaker-name {
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.15rem;
    }
    .line-text {
      margin: 0;
      color: var(--text-primary, #f2ede3);
      line-height: 1.4;
      font-size: 0.98rem;
    }
    .advance-hint {
      align-self: flex-end;
      font-size: 0.7rem;
      opacity: 0.55;
      white-space: nowrap;
    }
    @keyframes pop-in {
      from { transform: translateY(8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class DialogueBoxComponent {
  constructor(readonly dialogue: DialogueService) {}

  speakerLabel(speaker: string): string {
    switch (speaker) {
      case 'princess': return 'Prinzessin Laja';
      case 'helix': return 'Schlimm Helix Kisten';
      default: return 'Erzähler';
    }
  }
}
