import { Component, signal } from '@angular/core';
import { GameBoardComponent } from './features/game-board/game-board.component';
import { CharacterSelectComponent } from './features/character-select/character-select.component';
import { TitleScreenComponent } from './features/title-screen/title-screen.component';
import { IntroScreenComponent } from './features/intro-screen/intro-screen.component';
import { CharacterService } from './core/services/character.service';

type OnboardingScreen = 'title' | 'intro' | 'play';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent, CharacterSelectComponent, TitleScreenComponent, IntroScreenComponent],
  template: `
    @if (screen() === 'title') {
      <app-title-screen (start)="screen.set('intro')" />
    } @else if (screen() === 'intro') {
      <app-intro-screen (continue)="screen.set('play')" />
    } @else if (characters.leadCharacter()) {
      <app-game-board />
    } @else {
      <app-character-select />
    }
  `,
})
export class AppComponent {
  readonly screen = signal<OnboardingScreen>('title');

  constructor(readonly characters: CharacterService) {}
}
