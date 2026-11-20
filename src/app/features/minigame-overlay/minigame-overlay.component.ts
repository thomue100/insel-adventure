import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, computed, effect, signal, untracked } from '@angular/core';
import { MinigameService } from '../../core/services/minigame.service';
import { CharacterService } from '../../core/services/character.service';
import { SfxService } from '../../core/services/sfx.service';
import { MINIGAME_INFO } from '../../data/minigames.data';
import { MinigameResult } from './minigame-base';
import { FocusHoldGame } from './games/focus-hold.game';
import { StompGame } from './games/stomp.game';
import { TrackGame } from './games/track.game';
import { SlashGame } from './games/slash.game';
import { BalanceGame } from './games/balance.game';
import { CoconutGame } from './games/coconut.game';
import { DigGame } from './games/dig.game';
import { ScanGame } from './games/scan.game';
import { BeatGame } from './games/beat.game';
import { CounterGame } from './games/counter.game';
import { StoryReactGame } from './games/story-react.game';
import { SimonGame } from './games/simon.game';
import { TugGame } from './games/tug.game';
import { PowerGame } from './games/power.game';
import { DanceGame } from './games/dance.game';
import { DominoGame } from './games/domino.game';
import { AnchorGame } from './games/anchor.game';
import { WheelsGame } from './games/wheels.game';
import { LeverGame } from './games/lever.game';
import { KayakGame } from './games/kayak.game';

type Phase = 'intro' | 'countdown' | 'play' | 'result';

const COUNTDOWN_FROM = 3;
const COUNTDOWN_STEP_MS = 550;
const RESULT_DURATION_MS = 2200;

/**
 * Rahmen für alle Minigames: Anleitungskarte → 3-2-1-Countdown → Spiel →
 * Ergebnis. Die eigentlichen Spiele liegen jeweils in `games/*.game.ts` und
 * melden sich nur über `(finished)` zurück. Der Timer startet erst, wenn der
 * Spieler die Regeln gelesen und auf "Los" gedrückt hat.
 */
@Component({
  selector: 'app-minigame-overlay',
  standalone: true,
  imports: [
    FocusHoldGame,
    StompGame,
    TrackGame,
    SlashGame,
    BalanceGame,
    CoconutGame,
    DigGame,
    ScanGame,
    BeatGame,
    CounterGame,
    StoryReactGame,
    SimonGame,
    TugGame,
    PowerGame,
    DanceGame,
    DominoGame,
    AnchorGame,
    WheelsGame,
    LeverGame,
    KayakGame,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (minigames.activeMinigame(); as type) {
      <div class="minigame-overlay">
        <div class="minigame-panel" [class.success]="result()?.success === true" [class.failure]="result()?.success === false">
          <div class="mg-header">
            <span class="mg-title">{{ info()!.icon }} {{ info()!.title }}</span>
            @if (easy()) {
              <span class="mg-badge" [title]="badgeTitle()">{{ characters.leadProfile()?.spriteIcon }} Vorteil</span>
            }
          </div>

          @switch (phase()) {
            @case ('intro') {
              <ul class="mg-rules">
                @for (rule of info()!.rules; track $index) {
                  <li>{{ rule }}</li>
                }
              </ul>
              <div class="mg-controls">🎮 {{ info()!.controls }}</div>
              @if (easy()) {
                <div class="mg-advantage">{{ badgeTitle() }}</div>
              }
              <button class="mg-btn" (click)="startCountdown()">Los geht's! <small>(Leertaste)</small></button>
            }
            @case ('countdown') {
              <div class="mg-countdown">{{ countdown() > 0 ? countdown() : 'Los!' }}</div>
            }
            @case ('play') {
              @switch (type) {
                @case ('focus-hold') { <mg-focus-hold [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('click-mash') { <mg-stomp [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('footprint-track') { <mg-track [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('swipe-mash') { <mg-slash [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('balance') { <mg-balance [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('coconut-throw') { <mg-coconut [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('dig-search') { <mg-dig [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('pattern-scan') { <mg-scan [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('rhythm-tap') { <mg-beat [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('reaction-box') { <mg-counter [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('trophy-focus') { <mg-story-react [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('boast-mash') { <mg-simon [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('calm-restraint') { <mg-tug [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('reckless-posture') { <mg-power [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('dance-battle') { <mg-dance [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('domino-match') { <mg-domino [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('anchor-heave') { <mg-anchor [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('logic-puzzle') { <mg-wheels [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('lever-heave') { <mg-lever [easy]="easy()" (finished)="onFinished($event)" /> }
                @case ('kayak-paddle') { <mg-kayak [easy]="easy()" (finished)="onFinished($event)" /> }
              }
            }
            @case ('result') {
              @if (result(); as r) {
                <div class="result-feedback" (click)="continueStory()">
                  <div class="result-icon">{{ r.success ? '✅' : '❌' }}</div>
                  <div class="result-text">{{ r.success ? 'Geschafft!' : 'Nicht geschafft …' }}</div>
                  @if (r.detail) {
                    <div class="result-detail">{{ r.detail }}</div>
                  }
                  <div class="result-hint">Klicken oder Leertaste zum Weiterspielen</div>
                </div>
              }
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .minigame-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 8, 12, 0.7);
      z-index: 60;
      padding: 0.5rem;
    }
    .minigame-panel {
      width: 360px;
      max-width: 100%;
      max-height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid var(--accent-color, #e0a458);
      border-radius: 16px;
      padding: 1rem 1.1rem 1.2rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      animation: pop-in 0.18s ease-out;
      transition: border-color 0.2s ease;
    }
    .minigame-panel.success { border-color: #8fd68a; }
    .minigame-panel.failure { border-color: #e08f8f; }
    .mg-header { display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap; }
    .mg-title { font-size: 1.05rem; font-weight: bold; color: var(--text-primary, #f2ede3); }
    .mg-badge {
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background: rgba(143, 214, 138, 0.18);
      border: 1px solid #8fd68a;
      color: #cfeccc;
    }
    .mg-rules { margin: 0; padding-left: 1.1rem; font-size: 0.88rem; line-height: 1.4; color: #e6e1d6; }
    .mg-rules li + li { margin-top: 0.35rem; }
    .mg-controls { font-size: 0.78rem; color: #cfcabe; opacity: 0.85; text-align: center; }
    .mg-advantage { font-size: 0.75rem; color: #cfeccc; text-align: center; }
    .mg-btn small { font-weight: normal; opacity: 0.7; }
    .mg-countdown { font-size: 4rem; font-weight: bold; color: var(--accent-color, #e0a458); min-height: 180px; display: flex; align-items: center; animation: pop-in 0.25s ease-out; }
    .result-feedback { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 1rem 0.5rem; cursor: pointer; animation: pop-in 0.2s ease-out; text-align: center; }
    .result-icon { font-size: 3rem; }
    .result-text { font-size: 1.15rem; font-weight: bold; }
    .success .result-text { color: #8fd68a; }
    .failure .result-text { color: #e08f8f; }
    .result-detail { font-size: 0.88rem; color: #e6e1d6; }
    .result-hint { font-size: 0.7rem; opacity: 0.5; margin-top: 0.3rem; }
    @keyframes pop-in {
      from { transform: scale(0.94); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `],
})
export class MinigameOverlayComponent implements OnDestroy {
  readonly phase = signal<Phase>('intro');
  readonly countdown = signal(COUNTDOWN_FROM);
  readonly result = signal<MinigameResult | null>(null);
  private timerId: ReturnType<typeof setTimeout> | null = null;

  readonly info = computed(() => {
    const type = this.minigames.activeMinigame();
    return type ? MINIGAME_INFO[type] : null;
  });

  /** Passt der Skill der Hauptfigur zum Minigame, wird es etwas leichter. */
  readonly easy = computed(() => {
    const skill = this.info()?.skill;
    return skill ? this.characters.matchesLeadSkill(skill) : false;
  });

  readonly badgeTitle = computed(() => {
    const lead = this.characters.leadProfile();
    return lead ? `Vorteil durch ${lead.displayName} (${lead.tagline}): etwas mehr Zeit und Spielraum.` : '';
  });

  constructor(
    readonly minigames: MinigameService,
    readonly characters: CharacterService,
    private readonly sfx: SfxService,
  ) {
    effect(
      () => {
        this.minigames.activeMinigame(); // bei jedem neuen Minigame wieder mit der Anleitung beginnen
        untracked(() => {
          this.clearTimer();
          this.phase.set('intro');
          this.result.set(null);
        });
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.minigames.activeMinigame() || event.repeat) return;
    if (event.key !== ' ' && event.key !== 'Enter') return;
    if (this.phase() === 'intro') {
      event.preventDefault();
      this.startCountdown();
    } else if (this.phase() === 'result') {
      event.preventDefault();
      this.continueStory();
    }
  }

  startCountdown(): void {
    if (this.phase() !== 'intro') return;
    this.phase.set('countdown');
    this.countdown.set(COUNTDOWN_FROM);
    this.sfx.play('tick');
    const step = () => {
      this.countdown.update((c) => c - 1);
      if (this.countdown() > 0) {
        this.sfx.play('tick');
        this.timerId = setTimeout(step, COUNTDOWN_STEP_MS);
      } else {
        this.sfx.play('go');
        this.timerId = setTimeout(() => this.phase.set('play'), COUNTDOWN_STEP_MS * 0.6);
      }
    };
    this.timerId = setTimeout(step, COUNTDOWN_STEP_MS);
  }

  onFinished(result: MinigameResult): void {
    this.result.set(result);
    this.phase.set('result');
    this.sfx.play(result.success ? 'win' : 'lose');
    this.timerId = setTimeout(() => this.continueStory(), RESULT_DURATION_MS);
  }

  /** Übergibt das Ergebnis an den Service – der spielt dann die passende Story-Szene. */
  continueStory(): void {
    const result = this.result();
    if (this.phase() !== 'result' || !result) return;
    this.clearTimer();
    this.result.set(null);
    this.minigames.reportResult(result.success);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
