import { Component } from '@angular/core';
import { GameBoardComponent } from './features/game-board/game-board.component';
import { CharacterSelectComponent } from './features/character-select/character-select.component';
import { CharacterService } from './core/services/character.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent, CharacterSelectComponent],
  template: `
    @if (characters.leadCharacter()) {
      <app-game-board />
    } @else {
      <app-character-select />
    }
  `,
})
export class AppComponent {
  constructor(readonly characters: CharacterService) {}
}
