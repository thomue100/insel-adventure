import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CharacterService } from '../../core/services/character.service';
import { CHARACTER_PROFILES, CharacterId } from '../../core/models/character.model';

@Component({
  selector: 'app-character-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="select-screen">
      <div class="select-panel">
        <h1>Wer seid Ihr?</h1>
        <p class="subtitle">
          Egal wen Ihr wählt – das Duo bleibt zusammen. Eure Wahl bestimmt nur,
          wer meistens den Ton angibt (und wessen Fähigkeiten den Ausschlag geben).
        </p>
        <div class="options">
          <button class="option-card" (click)="choose('princess')">
            <span class="icon">{{ profiles.princess.spriteIcon }}</span>
            <span class="name">{{ profiles.princess.displayName }}</span>
            <span class="tagline">{{ profiles.princess.tagline }}</span>
          </button>
          <button class="option-card" (click)="choose('helix')">
            <span class="icon">{{ profiles.helix.spriteIcon }}</span>
            <span class="name">{{ profiles.helix.displayName }}</span>
            <span class="tagline">{{ profiles.helix.tagline }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .select-screen {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--map-bg, #0c0c12);
    }
    .select-panel {
      max-width: 520px;
      width: 100%;
      padding: 2rem;
      text-align: center;
    }
    h1 {
      margin: 0 0 0.5rem;
      color: var(--text-primary, #f2ede3);
      font-size: 1.8rem;
    }
    .subtitle {
      color: #cfcabe;
      font-size: 0.95rem;
      line-height: 1.4;
      margin-bottom: 1.75rem;
    }
    .options {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .option-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid #3a3a45;
      border-radius: 14px;
      padding: 1.5rem 1rem;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.15s ease;
      color: var(--text-primary, #f2ede3);
    }
    .option-card:hover {
      border-color: var(--accent-color, #e0a458);
      transform: translateY(-2px);
    }
    .icon { font-size: 2.4rem; }
    .name { font-weight: bold; font-size: 1.05rem; }
    .tagline { font-size: 0.8rem; opacity: 0.7; }
  `],
})
export class CharacterSelectComponent {
  readonly profiles = CHARACTER_PROFILES;

  constructor(private readonly characters: CharacterService) {}

  choose(id: CharacterId): void {
    this.characters.chooseLeadCharacter(id);
  }
}
