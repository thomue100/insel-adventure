import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdventureService } from '../../core/services/adventure.service';
import { AdventureChoice } from '../../core/models/adventure.model';

@Component({
  selector: 'app-adventure-choices',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (adventures.pendingChoices(); as choices) {
      <div class="choice-overlay">
        <div class="choice-panel">
          <div class="choice-title">Was tut ihr?</div>
          <div class="choice-buttons">
            @for (choice of choices; track choice.id) {
              <button class="choice-btn" (click)="select(choice)">{{ choice.label }}</button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .choice-overlay {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      display: flex;
      justify-content: center;
      padding: 1rem 1rem 1.5rem;
      z-index: 55;
    }
    .choice-panel {
      max-width: 640px;
      width: 100%;
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid var(--accent-color, #e0a458);
      border-radius: 14px;
      padding: 0.9rem 1.1rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      animation: pop-in 0.18s ease-out;
    }
    .choice-title {
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.55rem;
    }
    .choice-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .choice-btn {
      text-align: left;
      background: rgba(255,255,255,0.06);
      border: 1px solid #3a3a45;
      color: var(--text-primary, #f2ede3);
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .choice-btn:hover {
      border-color: var(--accent-color, #e0a458);
      background: rgba(224,164,88,0.12);
    }
    @keyframes pop-in {
      from { transform: translateY(8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class AdventureChoiceComponent {
  constructor(readonly adventures: AdventureService) {}

  select(choice: AdventureChoice): void {
    this.adventures.chooseOption(choice);
  }
}
