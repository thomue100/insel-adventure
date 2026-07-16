import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, computed, effect, signal } from '@angular/core';
import { MinigameService } from '../../core/services/minigame.service';

// Spielfeld-Maße (px), für Jitter-Grenzen und Klick-Fläche verwendet.
const GAME_WIDTH = 300;
const GAME_HEIGHT = 180;

// Fokus-Halten (Diplomatie)
const FOCUS_DURATION_MS = 6000;
const FOCUS_TICK_MS = 100;
const FOCUS_RADIUS = 34;
const FOCUS_GAIN_PER_TICK = 3;
const FOCUS_LOSS_PER_TICK = 2;
const FOCUS_JITTER_EVERY_N_TICKS = 4; // alle ~400ms neu wackeln
const FOCUS_JITTER_RANGE = 22;

// Klick-Rasen (Stärke, Raschel-Tier)
// Abwechselndes Stampfen (Raschel-Tier, Stärke)
const STOMP_DURATION_MS = 6000;
const STOMP_TICK_MS = 100;
const STOMP_GAIN_PER_HIT = 10;
const STOMP_DECAY_PER_TICK = 1.2;

// Kraftmesser halten & loslassen (Dorf, Stärke)
const POWER_DURATION_MS = 8000;
const POWER_TICK_MS = 50;
const POWER_RISE_PER_TICK = 4;
const POWER_TARGET_MIN = 65;
const POWER_TARGET_MAX = 85;

// Anker per Zug-Drag lichten (Finale, Schiff übernehmen)
const ANCHOR_DURATION_MS = 7000;
const ANCHOR_TICK_MS = 100;
const ANCHOR_DECAY_PER_TICK = 2;
const ANCHOR_PULL_THRESHOLD = 25; // Mindest-Zugstrecke in px, damit ein Zug zählt
const ANCHOR_GAIN_PER_PULL = 18;

// Steinblöcke schieben (Königsschatz, Stärke)
const BLOCK_DURATION_MS = 10000;
const BLOCK_TICK_MS = 100;

// Balance-Spiel (Diplomatie, Affen)
const BALANCE_DURATION_MS = 7000;
const BALANCE_TICK_MS = 100;
const BALANCE_TRACK_WIDTH = 260;
const BALANCE_ZONE_HALF_WIDTH = 30;
const BALANCE_GAIN_PER_TICK = 3;
const BALANCE_LOSS_PER_TICK = 2;
const BALANCE_WIND_STRENGTH = 7;
const BALANCE_PULL_FACTOR = 0.06;
const BALANCE_DAMPING = 0.88;

// Kokosnuss-Wurfspiel (Stärke, Affen Schritt 2)
const COCONUT_DURATION_MS = 7000;
const COCONUT_TICK_MS = 50;
const COCONUT_TRACK_WIDTH = 260;
const COCONUT_ZONE_HALF_WIDTH = 26;
const COCONUT_OSCILLATION_PERIOD_MS = 1400;
const COCONUT_HITS_REQUIRED = 3;
const COCONUT_PROGRESS_PER_HIT = Math.ceil(100 / COCONUT_HITS_REQUIRED);

// Spuren lesen (Diplomatie, Affen Schritt 1)
const FOOTPRINT_DURATION_MS = 8000;
const FOOTPRINT_TICK_MS = 100;
const FOOTPRINT_HITS_REQUIRED = 5;
const FOOTPRINT_HIT_RADIUS = 26;
const FOOTPRINT_REPOSITION_EVERY_N_TICKS = 15; // alle 1.5s neu, auch ohne Treffer
const FOOTPRINT_PROGRESS_PER_HIT = Math.ceil(100 / FOOTPRINT_HITS_REQUIRED);

// Durchs Unterholz brechen (Stärke, Affen Schritt 1)
const SWIPE_DURATION_MS = 6000;
const SWIPE_TICK_MS = 100;
const SWIPE_DECAY_PER_TICK = 3;
const SWIPE_GAIN_FACTOR = 0.6; // Fortschritt pro Pixel Mausbewegung

// Im Rhythmus bleiben (Diplomatie, Ä-Buff-Boxkampf)
const RHYTHM_DURATION_MS = 7000;
const RHYTHM_TICK_MS = 50;
const RHYTHM_TRACK_WIDTH = 260;
const RHYTHM_ZONE_HALF_WIDTH = 24;
const RHYTHM_OSCILLATION_PERIOD_MS = 900; // schneller als der Kokosnuss-Affe, wirkt wie Klatschen im Takt
const RHYTHM_HITS_REQUIRED = 3;
const RHYTHM_PROGRESS_PER_HIT = Math.ceil(100 / RHYTHM_HITS_REQUIRED);

// Blitzschnell kontern (Stärke, Ä-Buff-Boxkampf)
const REACTION_DURATION_MS = 8000;
const REACTION_TICK_MS = 100;
const REACTION_HITS_REQUIRED = 4;
const REACTION_MIN_DELAY_MS = 600;
const REACTION_MAX_DELAY_MS = 1500;
const REACTION_WINDOW_MS = 650; // wie lange die Lücke offen bleibt
const REACTION_PROGRESS_PER_HIT = Math.ceil(100 / REACTION_HITS_REQUIRED);

// Bauchgefühl folgen: Grabe-Suchspiel (Stärke, Affen Schritt 3)
const DIG_CELL_COUNT = 6;
const DIG_ATTEMPTS = 3;
const DIG_DURATION_MS = 9000;
const DIG_TICK_MS = 100;

// Systematisch absuchen: Scanner-Spiel (Diplomatie, Affen Schritt 3)
const SCAN_CELL_COUNT = 6;
const SCAN_STEP_MS = 700;
const SCAN_DURATION_MS = 9000;
const SCAN_TICK_MS = 100;

// Kurze Pause nach jedem Minigame, in der Erfolg/Misserfolg sichtbar angezeigt wird,
// bevor die Story mit der passenden Dialog-Szene weitergeht.
const RESULT_FEEDBACK_DURATION_MS = 1100;

// Tanzwettbewerb (Dorf, Schritt 2) – Pfeiltasten-Rhythmusspiel
const DANCE_SEQUENCE_LENGTH = 8;
const DANCE_STEP_TIMEOUT_MS = 1100; // so lange bleibt ein Schritt "aktiv"
const DANCE_TICK_MS = 100;
const DANCE_HITS_REQUIRED = 5; // von 8 – ein paar Fehltritte sind erlaubt
const DANCE_KEYS: ReadonlyArray<'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown'> = [
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
];
const DANCE_ICONS: Record<string, string> = {
  ArrowLeft: '⬅️',
  ArrowUp: '⬆️',
  ArrowRight: '➡️',
  ArrowDown: '⬇️',
};

// Domino gegen Bilone & Bidate (Piraten-Bucht, Seeleute anwerben)
interface DominoTile {
  id: string;
  a: number;
  b: number;
}
const DOMINO_MAX_PIP = 6;
const DOMINO_HAND_SIZE = 4;
const DOMINO_ROUNDS_REQUIRED = 5;
const DOMINO_DURATION_MS = 16000;
const DOMINO_TICK_MS = 100;

// Logik-Rätsel: Tempel-Mechanismus (Diplomatie, Königsschatz)
const LOGIC_SYMBOLS = ['☀️', '🌙', '⭐', '🔥'];
const LOGIC_SEQUENCE_LENGTH = 4;
const LOGIC_PREVIEW_STEP_MS = 700;
const LOGIC_PREVIEW_GAP_MS = 250;
const LOGIC_DURATION_MS = 16000;
const LOGIC_TICK_MS = 100;

// Wachsende Merk-Sequenz (Ä-Buff Schritt 2, Stärke) - Simon-Says-artig
const MEMORY_SYMBOLS = ['🏆', '⚔️', '🔥', '💥'];
const MEMORY_MAX_ROUND = 4;
const MEMORY_PREVIEW_STEP_MS = 650;
const MEMORY_PREVIEW_GAP_MS = 300;
const MEMORY_DURATION_MS = 18000;
const MEMORY_TICK_MS = 100;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

@Component({
  selector: 'app-minigame-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (minigames.activeMinigame(); as type) {
      <div class="minigame-overlay">
        <div class="minigame-panel">
          @if (resultFeedback(); as result) {
            <div class="result-feedback" [class.success]="result === 'success'" [class.failure]="result === 'failure'">
              <div class="result-icon">{{ result === 'success' ? '✅' : '❌' }}</div>
              <div class="result-text">{{ result === 'success' ? 'Geschafft!' : 'Nicht geschafft...' }}</div>
            </div>
          } @else {
            @if (type === 'focus-hold') {
              <div class="minigame-title">🤫 Ruhig bleiben</div>
              <div class="minigame-hint">Halte den Cursor über dem zittrigen Gebüsch.</div>
              <div class="game-area focus-area" (mousemove)="onFocusMouseMove($event)">
                <div class="jitter-target" [style.left.px]="targetPos().x" [style.top.px]="targetPos().y">🌿</div>
                <div class="cursor-dot" [style.left.px]="cursorPos().x" [style.top.px]="cursorPos().y"></div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="focusProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'click-mash') {
              <div class="minigame-title">🦶 Abwechselnd stampfen</div>
              <div class="minigame-hint">Klick abwechselnd links und rechts – nicht zweimal dieselbe Seite hintereinander!</div>
              <div class="stomp-buttons">
                <button class="stomp-btn" (click)="onStompClick('left')">⬅️ Stampf!</button>
                <button class="stomp-btn" (click)="onStompClick('right')">➡️ Stampf!</button>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="stompProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'balance') {
              <div class="minigame-title">🍌 Balance halten</div>
              <div class="minigame-hint">Bewege die Maus, um den Früchtekorb im Gleichgewicht zu halten.</div>
              <div class="game-area balance-track" (mousemove)="onBalanceMouseMove($event)">
                <div class="balance-zone"></div>
                <div class="balance-ball" [style.left.px]="ballX()">🧺</div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="balanceProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'coconut-throw') {
              <div class="minigame-title">🥥 Kokosnüsse werfen</div>
              <div class="minigame-hint">
                Klick "Werfen", sobald der Affe in der markierten Zone ist! ({{ coconutHits() }}/{{ coconutHitsRequired }} Treffer)
              </div>
              <div class="game-area coconut-track">
                <div class="coconut-zone"></div>
                <div class="coconut-marker" [style.left.px]="throwerPos()">🐒</div>
              </div>
              <button class="throw-button" (click)="onCoconutThrow()">🥥 Werfen!</button>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="coconutProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'footprint-track') {
              <div class="minigame-title">👣 Spuren lesen</div>
              <div class="minigame-hint">Klick die Fußspur, bevor sie weiterzieht! ({{ trackHits() }}/{{ trackHitsRequired }})</div>
              <div class="game-area track-area" (click)="onFootprintAreaClick($event)">
                <div class="footprint" [style.left.px]="footprintPos().x" [style.top.px]="footprintPos().y">👣</div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="trackProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'swipe-mash') {
              <div class="minigame-title">🔪 Durchs Unterholz brechen</div>
              <div class="minigame-hint">Wedel wild mit der Maus über die Fläche, um dich durchzuschlagen!</div>
              <div class="game-area swipe-area" (mousemove)="onSwipeMouseMove($event)">🌴💨</div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="swipeProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'dig-search') {
              <div class="minigame-title">🧭 Bauchgefühl folgen</div>
              <div class="minigame-hint">Grabe an den Stellen, die dir richtig erscheinen. Noch {{ digAttemptsLeft() }} Versuche.</div>
              <div class="dig-grid">
                @for (cell of digCells(); track $index) {
                  <button
                    class="dig-cell"
                    [class.empty]="cell === 'empty'"
                    [class.found]="cell === 'found'"
                    [disabled]="cell !== 'hidden'"
                    (click)="onDigCellClick($index)"
                  >
                    {{ cell === 'found' ? '🧭' : cell === 'empty' ? '❌' : '⛰️' }}
                  </button>
                }
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'pattern-scan') {
              <div class="minigame-title">📋 Systematisch absuchen</div>
              <div class="minigame-hint">Klick "Hier!", wenn der Leuchtpunkt auf der richtigen Stelle steht.</div>
              <div class="scan-row">
                @for (i of scanIndices; track i) {
                  <div class="scan-cell" [class.active]="scanActiveIndex() === i">🌿</div>
                }
              </div>
              <button class="throw-button" (click)="onScanCheck()">🔎 Hier!</button>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'rhythm-tap') {
              <div class="minigame-title">👏 Im Rhythmus bleiben</div>
              <div class="minigame-hint">
                Klick "Mitklatschen", wenn die Faust die markierte Zone erreicht! ({{ rhythmHits() }}/{{ rhythmHitsRequired }})
              </div>
              <div class="game-area rhythm-track">
                <div class="rhythm-zone"></div>
                <div class="rhythm-marker" [style.left.px]="rhythmMarkerPos()">🥊</div>
              </div>
              <button class="throw-button" (click)="onRhythmTap()">👏 Mitklatschen!</button>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="rhythmProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'reaction-box') {
              <div class="minigame-title">🥊 Blitzschnell kontern</div>
              <div class="minigame-hint">
                Klick, sobald sich eine Lücke in seiner Deckung öffnet! ({{ reactionHits() }}/{{ reactionHitsRequired }})
              </div>
              <button class="game-area reaction-area" [class.opening]="openingVisible()" (click)="onReactionClick()">
                {{ openingVisible() ? '💥 JETZT!' : '🥊' }}
              </button>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="reactionProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'trophy-focus') {
              <div class="minigame-title">🏆 Trophäen bewundern</div>
              <div class="minigame-hint">Halte den Blick ruhig auf die Trophäe gerichtet, während Ä-Buff erzählt.</div>
              <div class="game-area focus-area" (mousemove)="onFocusMouseMove($event)">
                <div class="jitter-target" [style.left.px]="targetPos().x" [style.top.px]="targetPos().y">🏆</div>
                <div class="cursor-dot" [style.left.px]="cursorPos().x" [style.top.px]="cursorPos().y"></div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="focusProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'boast-mash') {
              <div class="minigame-title">🏆 Geschichten überbieten</div>
              <div class="minigame-hint">
                @if (memoryPhase() === 'preview') {
                  Merk dir die Reihenfolge! (Runde {{ memoryRound() }}/{{ memoryMaxRound }})
                } @else {
                  Wiederhole sie! ({{ memoryInputIndex() }}/{{ memoryRound() }})
                }
              </div>
              <div class="logic-preview">{{ memoryPreviewIndex() >= 0 ? memorySymbols[memoryPreviewIndex()] : '❔' }}</div>
              <div class="logic-grid">
                @for (symbol of memorySymbols; track $index) {
                  <button
                    class="logic-symbol-btn"
                    [disabled]="memoryPhase() !== 'input'"
                    (click)="onMemorySymbolClick($index)"
                  >
                    {{ symbol }}
                  </button>
                }
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'calm-restraint') {
              <div class="minigame-title">🤚 Helix zurückhalten</div>
              <div class="minigame-hint">Halte ruhig Kurs, während Helix unruhig hin und her drängt.</div>
              <div class="game-area focus-area" (mousemove)="onFocusMouseMove($event)">
                <div class="jitter-target" [style.left.px]="targetPos().x" [style.top.px]="targetPos().y">✋</div>
                <div class="cursor-dot" [style.left.px]="cursorPos().x" [style.top.px]="cursorPos().y"></div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="focusProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'reckless-posture') {
              <div class="minigame-title">💪 Groß aufplustern</div>
              <div class="minigame-hint">Halte gedrückt, bis der Kraftmesser in der markierten Zone steht – dann loslassen!</div>
              <div class="power-gauge-track">
                <div class="power-gauge-zone"></div>
                <div class="power-gauge-fill" [style.height.%]="powerValue()"></div>
              </div>
              <button
                class="throw-button"
                (mousedown)="onPowerHoldStart()"
                (mouseup)="onPowerHoldEnd()"
                (mouseleave)="onPowerHoldEnd()"
              >
                💪 Halten!
              </button>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'dance-battle') {
              <div class="minigame-title">💃 Tanzwettbewerb</div>
              <div class="minigame-hint">
                Drück die passende Pfeiltaste, sobald sie hervorgehoben ist! ({{ danceHits() }}/{{ danceHitsRequired }} Treffer)
              </div>
              <div class="dance-current">{{ currentDanceIcon() }}</div>
              <div class="dance-row">
                @for (key of danceSequence(); track $index) {
                  <div
                    class="dance-cell"
                    [class.active]="danceActiveIndex() === $index"
                    [class.hit]="danceResolved()[$index] === 'hit'"
                    [class.miss]="danceResolved()[$index] === 'miss'"
                  >
                    {{ danceIcon(key) }}
                  </div>
                }
              </div>
            }

            @if (type === 'domino-match') {
              <div class="minigame-title">🁢 Domino gegen Bilone & Bidate</div>
              <div class="minigame-hint">
                Wähle den Stein, der zur offenen Zahl passt! ({{ dominoRoundsWon() }}/{{ dominoRoundsRequired }})
              </div>
              <div class="domino-open">
                <span class="domino-open-label">Offene Zahl</span>
                <div class="domino-half open-value">{{ dominoOpenEnd() }}</div>
              </div>
              <div class="domino-hand">
                @for (tile of dominoHand(); track tile.id) {
                  <button class="domino-tile" (click)="onDominoTileClick(tile)">
                    <span class="domino-half">{{ tile.a }}</span>
                    <span class="domino-divider"></span>
                    <span class="domino-half">{{ tile.b }}</span>
                  </button>
                }
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'anchor-heave') {
              <div class="minigame-title">⚓ Anker lichten</div>
              <div class="minigame-hint">Klick, zieh nach oben und lass los – immer wieder, um die Kette hochzuziehen!</div>
              <div
                class="game-area anchor-drag-area"
                (mousedown)="onAnchorDragStart($event)"
                (mouseup)="onAnchorDragEnd($event)"
                (mouseleave)="onAnchorDragCancel()"
              >
                ⚓
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="anchorProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'logic-puzzle') {
              <div class="minigame-title">🧩 Tempel-Mechanismus</div>
              <div class="minigame-hint">
                @if (logicPhase() === 'preview') {
                  Merk dir die Reihenfolge der Symbole!
                } @else {
                  Gib die Reihenfolge nach! ({{ logicInputIndex() }}/{{ logicSequenceLength }})
                }
              </div>
              <div class="logic-preview">{{ logicPreviewIndex() >= 0 ? logicSymbols[logicPreviewIndex()] : '❔' }}</div>
              <div class="logic-grid">
                @for (symbol of logicSymbols; track $index) {
                  <button
                    class="logic-symbol-btn"
                    [disabled]="logicPhase() !== 'input'"
                    (click)="onLogicSymbolClick($index)"
                  >
                    {{ symbol }}
                  </button>
                }
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'lever-heave') {
              <div class="minigame-title">🗿 Steinblöcke schieben</div>
              <div class="minigame-hint">Klick die Blöcke, bis alle drei einrasten!</div>
              <div class="block-row">
                @for (pos of blockPositions(); track $index) {
                  <button
                    class="block-btn"
                    [class.aligned]="blockAligned()[$index]"
                    [style.transform]="'rotate(' + pos * 90 + 'deg)'"
                    (click)="onBlockShoveClick($index)"
                  >
                    🗿
                  </button>
                }
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
            }

            @if (type === 'kayak-paddle') {
              <div class="minigame-title">🛶 Leise paddeln</div>
              <div class="minigame-hint">
                Klick "Paddeln", wenn das Ruder die markierte Zone erreicht! ({{ rhythmHits() }}/{{ rhythmHitsRequired }})
              </div>
              <div class="game-area rhythm-track">
                <div class="rhythm-zone"></div>
                <div class="rhythm-marker" [style.left.px]="rhythmMarkerPos()">🛶</div>
              </div>
              <button class="throw-button" (click)="onRhythmTap()">🚣 Paddeln!</button>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="rhythmProgress()"></div>
              </div>
              <div class="time-hint">⏳ {{ remainingSeconds() }}s</div>
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
      background: rgba(8, 8, 12, 0.65);
      z-index: 60;
    }
    .minigame-panel {
      background: var(--dialogue-bg, #1c1a24);
      border: 2px solid var(--accent-color, #e0a458);
      border-radius: 16px;
      padding: 1.25rem 1.5rem 1.5rem;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      animation: pop-in 0.18s ease-out;
    }
    .minigame-title {
      font-size: 1.05rem;
      font-weight: bold;
      color: var(--text-primary, #f2ede3);
    }
    .minigame-hint {
      font-size: 0.85rem;
      color: #cfcabe;
      opacity: 0.85;
      margin-bottom: 0.3rem;
      text-align: center;
    }
    .game-area {
      position: relative;
      width: 300px;
      height: 180px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      overflow: hidden;
    }
    .focus-area {
      cursor: crosshair;
    }
    .jitter-target {
      position: absolute;
      transform: translate(-50%, -50%);
      font-size: 30px;
      pointer-events: none;
      filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));
    }
    .cursor-dot {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent-color, #e0a458);
      box-shadow: 0 0 8px var(--accent-color, #e0a458);
      pointer-events: none;
    }
    .mash-button {
      font-size: 42px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.05s ease;
    }
    .mash-button:active {
      transform: scale(0.96);
    }
    .stomp-buttons {
      display: flex;
      gap: 14px;
    }
    .stomp-btn {
      font-size: 18px;
      padding: 1rem 1.3rem;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      color: var(--text-primary, #f2ede3);
      cursor: pointer;
      transition: transform 0.05s ease, border-color 0.1s ease;
    }
    .stomp-btn:active {
      transform: scale(0.94);
    }
    .power-gauge-track {
      position: relative;
      width: 56px;
      height: 170px;
      background: #1a130c;
      border: 1px solid #3a3a45;
      border-radius: 8px;
      display: flex;
      flex-direction: column-reverse;
      overflow: hidden;
    }
    .power-gauge-zone {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 65%;
      height: 20%;
      background: rgba(224, 164, 88, 0.22);
      border-top: 1px dashed var(--accent-color, #e0a458);
      border-bottom: 1px dashed var(--accent-color, #e0a458);
    }
    .power-gauge-fill {
      width: 100%;
      background: linear-gradient(0deg, var(--accent-color, #e0a458), #f2d19a);
      transition: height 0.05s linear;
    }
    .anchor-drag-area {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 46px;
      cursor: grab;
      user-select: none;
    }
    .anchor-drag-area:active {
      cursor: grabbing;
    }
    .block-row {
      display: flex;
      gap: 14px;
    }
    .block-btn {
      width: 58px;
      height: 58px;
      font-size: 28px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .block-btn.aligned {
      border-color: #8fd68a;
      background: rgba(143, 214, 138, 0.2);
    }
    .balance-track, .coconut-track, .rhythm-track {
      width: 260px;
      height: 70px;
      background: linear-gradient(180deg, #2a1f14 0%, #1a130c 100%);
    }
    .balance-zone, .coconut-zone, .rhythm-zone {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(50% - 30px);
      width: 60px;
      background: rgba(224, 164, 88, 0.18);
      border-left: 1px dashed var(--accent-color, #e0a458);
      border-right: 1px dashed var(--accent-color, #e0a458);
    }
    .coconut-zone, .rhythm-zone {
      left: calc(50% - 26px);
      width: 52px;
    }
    .rhythm-zone {
      left: calc(50% - 24px);
      width: 48px;
    }
    .balance-ball, .coconut-marker, .rhythm-marker {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 28px;
      pointer-events: none;
      filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));
    }
    .throw-button {
      background: var(--accent-color, #e0a458);
      color: #1a1a1a;
      border: none;
      border-radius: 999px;
      padding: 0.5rem 1.2rem;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: transform 0.05s ease;
    }
    .throw-button:active {
      transform: scale(0.95);
    }
    .track-area {
      position: relative;
      cursor: crosshair;
    }
    .footprint {
      position: absolute;
      transform: translate(-50%, -50%);
      font-size: 26px;
      pointer-events: none;
      filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));
    }
    .swipe-area {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      cursor: none;
      user-select: none;
    }
    .reaction-area {
      font-size: 40px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.08s ease, transform 0.05s ease;
    }
    .reaction-area.opening {
      background: radial-gradient(ellipse at center, #5a2a2a 0%, #2b1414 100%);
      border-color: var(--accent-color, #e0a458);
    }
    .reaction-area:active {
      transform: scale(0.97);
    }
    .result-feedback {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem 2rem;
      animation: pop-in 0.2s ease-out;
    }
    .result-icon {
      font-size: 3rem;
    }
    .result-text {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--text-primary, #f2ede3);
    }
    .result-feedback.success .result-text {
      color: #8fd68a;
    }
    .result-feedback.failure .result-text {
      color: #e08f8f;
    }
    .dig-grid {
      display: grid;
      grid-template-columns: repeat(3, 70px);
      gap: 10px;
    }
    .dig-cell {
      width: 70px;
      height: 70px;
      font-size: 26px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.05s ease, opacity 0.2s ease;
    }
    .dig-cell:active:not(:disabled) {
      transform: scale(0.94);
    }
    .dig-cell.empty {
      opacity: 0.35;
      cursor: default;
    }
    .dig-cell.found {
      opacity: 1;
      border-color: var(--accent-color, #e0a458);
      background: rgba(224, 164, 88, 0.25);
    }
    .scan-row {
      display: flex;
      gap: 8px;
    }
    .scan-cell {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: #1a2a1a;
      border: 1px solid #3a3a45;
      border-radius: 6px;
      opacity: 0.4;
      transition: opacity 0.1s ease, background 0.1s ease, border-color 0.1s ease;
    }
    .scan-cell.active {
      opacity: 1;
      background: rgba(224, 164, 88, 0.25);
      border-color: var(--accent-color, #e0a458);
    }
    .dance-current {
      font-size: 56px;
      line-height: 1;
      margin-bottom: 0.2rem;
      filter: drop-shadow(0 0 6px rgba(224, 164, 88, 0.4));
    }
    .dance-row {
      display: flex;
      gap: 6px;
    }
    .dance-cell {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: #1a2a1a;
      border: 1px solid #3a3a45;
      border-radius: 6px;
      opacity: 0.45;
      transition: opacity 0.1s ease, transform 0.1s ease, background 0.1s ease, border-color 0.1s ease;
    }
    .dance-cell.active {
      opacity: 1;
      border-color: var(--accent-color, #e0a458);
      background: rgba(224, 164, 88, 0.2);
      transform: scale(1.15);
    }
    .dance-cell.hit {
      opacity: 1;
      background: rgba(143, 214, 138, 0.25);
      border-color: #8fd68a;
    }
    .dance-cell.miss {
      opacity: 0.6;
      background: rgba(224, 143, 143, 0.2);
      border-color: #e08f8f;
    }
    .domino-open {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 0.3rem;
    }
    .domino-open-label {
      font-size: 0.7rem;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-primary, #f2ede3);
    }
    .domino-half.open-value {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: bold;
      background: rgba(224, 164, 88, 0.2);
      border: 2px solid var(--accent-color, #e0a458);
      border-radius: 8px;
      color: var(--text-primary, #f2ede3);
    }
    .domino-hand {
      display: flex;
      gap: 10px;
    }
    .domino-tile {
      display: flex;
      align-items: center;
      background: #f2ede3;
      border: 1px solid #3a3a45;
      border-radius: 8px;
      padding: 4px;
      cursor: pointer;
      transition: transform 0.05s ease;
    }
    .domino-tile:active {
      transform: scale(0.94);
    }
    .domino-tile .domino-half {
      width: 28px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .domino-divider {
      width: 2px;
      height: 28px;
      background: #1a1a1a;
      margin: 0 3px;
    }
    .logic-preview {
      font-size: 48px;
      line-height: 1;
      margin-bottom: 0.3rem;
      min-height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logic-grid {
      display: flex;
      gap: 10px;
    }
    .logic-symbol-btn {
      width: 54px;
      height: 54px;
      font-size: 26px;
      background: radial-gradient(ellipse at center, #1f3a24 0%, #142016 100%);
      border: 1px solid #3a3a45;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.05s ease, border-color 0.1s ease;
    }
    .logic-symbol-btn:active:not(:disabled) {
      transform: scale(0.94);
    }
    .logic-symbol-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .progress-bar {
      width: 300px;
      height: 10px;
      background: rgba(255,255,255,0.08);
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color, #e0a458), #f2d19a);
      transition: width 0.1s linear;
    }
    .time-hint {
      font-size: 0.8rem;
      color: #cfcabe;
      opacity: 0.7;
    }
    @keyframes pop-in {
      from { transform: scale(0.94); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `],
})
export class MinigameOverlayComponent implements OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tickCount = 0;

  // Nur intern für die Physik/Timing gebraucht, nicht im Template gerendert -> normale Felder statt Signals.
  private balanceCursorX = BALANCE_TRACK_WIDTH / 2;
  private balanceVelocity = 0;
  private coconutElapsedMs = 0;
  private rhythmElapsedMs = 0;
  private lastSwipePos: { x: number; y: number } | null = null;
  private openingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private resultTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private digTargetIndex = 0;
  private scanTargetIndex = 0;
  private danceCellElapsedMs = 0;
  private dominoTileIdCounter = 0;
  private previewTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastStompSide: 'left' | 'right' | null = null;
  private powerHeld = false;
  private anchorDragStartY: number | null = null;
  private blockTargets: number[] = [0, 0, 0];

  readonly scanIndices = Array.from({ length: SCAN_CELL_COUNT }, (_, i) => i);
  readonly logicSymbols = LOGIC_SYMBOLS;
  readonly logicSequenceLength = LOGIC_SEQUENCE_LENGTH;
  readonly memorySymbols = MEMORY_SYMBOLS;
  readonly memoryMaxRound = MEMORY_MAX_ROUND;

  readonly focusProgress = signal(0);
  readonly cursorPos = signal({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  readonly targetPos = signal({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  readonly ballX = signal(BALANCE_TRACK_WIDTH / 2);
  readonly balanceProgress = signal(0);
  readonly throwerPos = signal(COCONUT_TRACK_WIDTH / 2);
  readonly coconutProgress = signal(0);
  readonly coconutHits = signal(0);
  readonly coconutHitsRequired = COCONUT_HITS_REQUIRED;
  readonly footprintPos = signal({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  readonly trackProgress = signal(0);
  readonly trackHits = signal(0);
  readonly trackHitsRequired = FOOTPRINT_HITS_REQUIRED;
  readonly swipeProgress = signal(0);
  readonly digCells = signal<Array<'hidden' | 'empty' | 'found'>>(Array(DIG_CELL_COUNT).fill('hidden'));
  readonly digAttemptsLeft = signal(DIG_ATTEMPTS);
  readonly scanActiveIndex = signal(0);
  readonly rhythmMarkerPos = signal(RHYTHM_TRACK_WIDTH / 2);
  readonly rhythmProgress = signal(0);
  readonly rhythmHits = signal(0);
  readonly rhythmHitsRequired = RHYTHM_HITS_REQUIRED;
  readonly openingVisible = signal(false);
  readonly reactionProgress = signal(0);
  readonly reactionHits = signal(0);
  readonly reactionHitsRequired = REACTION_HITS_REQUIRED;
  readonly danceSequence = signal<Array<'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown'>>([]);
  readonly danceActiveIndex = signal(0);
  readonly danceResolved = signal<Array<'pending' | 'hit' | 'miss'>>([]);
  readonly danceHits = signal(0);
  readonly danceHitsRequired = DANCE_HITS_REQUIRED;
  readonly dominoOpenEnd = signal(0);
  readonly dominoHand = signal<DominoTile[]>([]);
  readonly dominoRoundsWon = signal(0);
  readonly dominoRoundsRequired = DOMINO_ROUNDS_REQUIRED;
  readonly logicSequence = signal<number[]>([]);
  readonly logicPreviewIndex = signal(-1);
  readonly logicInputIndex = signal(0);
  readonly logicPhase = signal<'preview' | 'input'>('preview');
  readonly stompProgress = signal(0);
  readonly memorySequence = signal<number[]>([]);
  readonly memoryRound = signal(1);
  readonly memoryPreviewIndex = signal(-1);
  readonly memoryInputIndex = signal(0);
  readonly memoryPhase = signal<'preview' | 'input'>('preview');
  readonly powerValue = signal(0);
  readonly anchorProgress = signal(0);
  readonly blockPositions = signal<number[]>([0, 0, 0]);
  readonly blockAligned = signal<boolean[]>([false, false, false]);
  readonly remainingMs = signal(0);
  /** Zeigt nach Abschluss eines Minigames kurz "Geschafft!" oder "Nicht geschafft...", bevor die Story weitergeht. */
  readonly resultFeedback = signal<'success' | 'failure' | null>(null);

  readonly remainingSeconds = computed(() => Math.max(0, Math.ceil(this.remainingMs() / 1000)));

  constructor(readonly minigames: MinigameService) {
    // Reagiert auf Minigame-Wechsel: startet/stoppt die passende Spielschleife.
    effect(
      () => {
        const type = this.minigames.activeMinigame();
        this.stopLoop();
        if (type === 'focus-hold') this.startFocusHold();
        if (type === 'balance') this.startBalance();
        if (type === 'coconut-throw') this.startCoconutThrow();
        if (type === 'footprint-track') this.startFootprintTrack();
        if (type === 'swipe-mash') this.startSwipeMash();
        if (type === 'dig-search') this.startDigSearch();
        if (type === 'pattern-scan') this.startPatternScan();
        if (type === 'rhythm-tap') this.startRhythmTap();
        if (type === 'reaction-box') this.startReactionBox();
        // Wiederverwendung bestehender Mechaniken mit neuer Beschriftung:
        if (type === 'trophy-focus') this.startFocusHold();
        if (type === 'calm-restraint') this.startFocusHold();
        // Vormals ebenfalls 'click-mash'-Kopien, jetzt jeweils eigene Mechanik:
        if (type === 'click-mash') this.startStompAlternate();
        if (type === 'boast-mash') this.startMemorySequence();
        if (type === 'reckless-posture') this.startPowerGauge();
        if (type === 'anchor-heave') this.startAnchorPullDrag();
        if (type === 'lever-heave') this.startBlockShove();
        if (type === 'dance-battle') this.startDanceBattle();
        if (type === 'domino-match') this.startDominoMatch();
        if (type === 'logic-puzzle') this.startLogicPuzzle();
        if (type === 'kayak-paddle') this.startRhythmTap();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  /**
   * Reagiert nur, wenn gerade der Tanzwettbewerb aktiv ist – verhindert
   * gleichzeitig das Scrollen der Seite durch die Pfeiltasten.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (this.minigames.activeMinigame() !== 'dance-battle') return;
    if (!DANCE_KEYS.includes(event.key as (typeof DANCE_KEYS)[number])) return;
    event.preventDefault();

    const idx = this.danceActiveIndex();
    const resolved = this.danceResolved();
    if (resolved[idx] !== 'pending') return; // dieser Schritt ist schon entschieden

    const expected = this.danceSequence()[idx];
    const next = [...resolved];
    if (event.key === expected) {
      next[idx] = 'hit';
      this.danceHits.update((h) => h + 1);
    } else {
      next[idx] = 'miss';
    }
    this.danceResolved.set(next);
    this.advanceDanceStep();
  }

  danceIcon(key: string): string {
    return DANCE_ICONS[key] ?? '❓';
  }

  readonly currentDanceIcon = computed(() => {
    const seq = this.danceSequence();
    const idx = this.danceActiveIndex();
    return seq[idx] ? this.danceIcon(seq[idx]) : '💃';
  });

  onDominoTileClick(tile: DominoTile): void {
    const openEnd = this.dominoOpenEnd();
    if (tile.a !== openEnd && tile.b !== openEnd) return; // passt nicht: einfach nochmal versuchen

    const newOpenEnd = tile.a === openEnd ? tile.b : tile.a;
    this.dominoRoundsWon.update((r) => r + 1);

    if (this.dominoRoundsWon() >= DOMINO_ROUNDS_REQUIRED) {
      this.finishWithResult(true);
      return;
    }

    this.dominoOpenEnd.set(newOpenEnd);
    this.dominoHand.set(this.generateDominoHand(newOpenEnd));
  }

  onLogicSymbolClick(symbolIndex: number): void {
    if (this.logicPhase() !== 'input') return;

    const sequence = this.logicSequence();
    const position = this.logicInputIndex();

    if (symbolIndex === sequence[position]) {
      const next = position + 1;
      if (next >= sequence.length) {
        this.finishWithResult(true);
        return;
      }
      this.logicInputIndex.set(next);
    } else {
      this.logicInputIndex.set(0); // falsch geraten: von vorn eingeben, die Zeit läuft aber weiter
    }
  }

  onStompClick(side: 'left' | 'right'): void {
    if (side === this.lastStompSide) return; // dieselbe Seite zweimal hintereinander zählt nicht
    this.lastStompSide = side;
    this.stompProgress.update((p) => Math.min(100, p + STOMP_GAIN_PER_HIT));
    if (this.stompProgress() >= 100) {
      this.finishWithResult(true);
    }
  }

  onMemorySymbolClick(symbolIndex: number): void {
    if (this.memoryPhase() !== 'input') return;

    const round = this.memoryRound();
    const sequence = this.memorySequence();
    const position = this.memoryInputIndex();

    if (symbolIndex !== sequence[position]) {
      this.memoryInputIndex.set(0); // falsch: diese Runde nochmal von vorn eingeben
      return;
    }

    const next = position + 1;
    if (next < round) {
      this.memoryInputIndex.set(next);
      return;
    }

    // Runde geschafft.
    if (round >= MEMORY_MAX_ROUND) {
      this.finishWithResult(true);
      return;
    }
    const nextRound = round + 1;
    this.memoryRound.set(nextRound);
    this.memoryInputIndex.set(0);
    this.memoryPhase.set('preview');
    this.runMemoryPreviewForRound(nextRound);
  }

  onPowerHoldStart(): void {
    this.powerHeld = true;
  }

  onPowerHoldEnd(): void {
    if (!this.powerHeld) return; // z.B. mouseleave nach bereits erfolgtem mouseup
    this.powerHeld = false;

    const value = this.powerValue();
    if (value >= POWER_TARGET_MIN && value <= POWER_TARGET_MAX) {
      this.finishWithResult(true);
    } else {
      this.powerValue.set(0); // daneben: nochmal versuchen, Zeit läuft weiter
    }
  }

  onAnchorDragStart(event: MouseEvent): void {
    this.anchorDragStartY = event.clientY;
  }

  onAnchorDragEnd(event: MouseEvent): void {
    if (this.anchorDragStartY === null) return;
    const pulled = this.anchorDragStartY - event.clientY;
    this.anchorDragStartY = null;

    if (pulled > ANCHOR_PULL_THRESHOLD) {
      this.anchorProgress.update((p) => Math.min(100, p + ANCHOR_GAIN_PER_PULL));
      if (this.anchorProgress() >= 100) {
        this.finishWithResult(true);
      }
    }
  }

  onAnchorDragCancel(): void {
    this.anchorDragStartY = null; // Maus verlässt den Bereich während gehalten -> Zug verworfen
  }

  onBlockShoveClick(index: number): void {
    const positions = [...this.blockPositions()];
    positions[index] = (positions[index] + 1) % 4;
    this.blockPositions.set(positions);

    const aligned = positions.map((p, i) => p === this.blockTargets[i]);
    this.blockAligned.set(aligned);

    if (aligned.every((a) => a)) {
      this.finishWithResult(true);
    }
  }

  onFocusMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.cursorPos.set({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  onBalanceMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.balanceCursorX = clamp(event.clientX - rect.left, 0, BALANCE_TRACK_WIDTH);
  }

  onCoconutThrow(): void {
    const center = COCONUT_TRACK_WIDTH / 2;
    const hit = Math.abs(this.throwerPos() - center) <= COCONUT_ZONE_HALF_WIDTH;
    if (!hit) return; // Fehlwurf: kein Fortschritt, aber auch kein Rückschritt

    this.coconutHits.update((h) => h + 1);
    this.coconutProgress.update((p) => Math.min(100, p + COCONUT_PROGRESS_PER_HIT));

    if (this.coconutHits() >= COCONUT_HITS_REQUIRED) {
      this.finishWithResult(true);
    }
  }

  onFootprintAreaClick(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickPos = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (distance(clickPos, this.footprintPos()) > FOOTPRINT_HIT_RADIUS) return; // daneben geklickt

    this.trackHits.update((h) => h + 1);
    this.trackProgress.update((p) => Math.min(100, p + FOOTPRINT_PROGRESS_PER_HIT));
    this.footprintPos.set(this.randomFootprintPos());

    if (this.trackHits() >= FOOTPRINT_HITS_REQUIRED) {
      this.finishWithResult(true);
    }
  }

  onSwipeMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    if (this.lastSwipePos) {
      const moved = distance(pos, this.lastSwipePos);
      this.swipeProgress.update((p) => Math.min(100, p + moved * SWIPE_GAIN_FACTOR));
    }
    this.lastSwipePos = pos;

    if (this.swipeProgress() >= 100) {
      this.finishWithResult(true);
    }
  }

  onDigCellClick(index: number): void {
    const cells = this.digCells();
    if (cells[index] !== 'hidden') return; // schon versucht

    if (index === this.digTargetIndex) {
      const next = [...cells];
      next[index] = 'found';
      this.digCells.set(next);
      this.finishWithResult(true);
      return;
    }

    const next = [...cells];
    next[index] = 'empty';
    this.digCells.set(next);
    this.digAttemptsLeft.update((a) => a - 1);

    if (this.digAttemptsLeft() <= 0) {
      this.finishWithResult(false);
    }
  }

  onScanCheck(): void {
    if (this.scanActiveIndex() === this.scanTargetIndex) {
      this.finishWithResult(true);
    }
    // Falscher Zeitpunkt: kein Fehlschlag, der Scanner läuft einfach weiter.
  }

  onRhythmTap(): void {
    const center = RHYTHM_TRACK_WIDTH / 2;
    const hit = Math.abs(this.rhythmMarkerPos() - center) <= RHYTHM_ZONE_HALF_WIDTH;
    if (!hit) return; // aus dem Takt: kein Fortschritt

    this.rhythmHits.update((h) => h + 1);
    this.rhythmProgress.update((p) => Math.min(100, p + RHYTHM_PROGRESS_PER_HIT));

    if (this.rhythmHits() >= RHYTHM_HITS_REQUIRED) {
      this.finishWithResult(true);
    }
  }

  onReactionClick(): void {
    if (!this.openingVisible()) return; // Schlag ins Leere: keine Konsequenz

    this.openingVisible.set(false);
    if (this.openingTimeoutId !== null) {
      clearTimeout(this.openingTimeoutId);
      this.openingTimeoutId = null;
    }

    this.reactionHits.update((h) => h + 1);
    this.reactionProgress.update((p) => Math.min(100, p + REACTION_PROGRESS_PER_HIT));

    if (this.reactionHits() >= REACTION_HITS_REQUIRED) {
      this.finishWithResult(true);
      return;
    }
    this.scheduleNextOpening();
  }

  private randomFootprintPos(): { x: number; y: number } {
    return {
      x: 24 + Math.random() * (GAME_WIDTH - 48),
      y: 24 + Math.random() * (GAME_HEIGHT - 48),
    };
  }

  private scheduleNextOpening(): void {
    const delay = REACTION_MIN_DELAY_MS + Math.random() * (REACTION_MAX_DELAY_MS - REACTION_MIN_DELAY_MS);
    this.openingTimeoutId = setTimeout(() => {
      this.openingVisible.set(true);
      this.openingTimeoutId = setTimeout(() => {
        this.openingVisible.set(false);
        this.scheduleNextOpening();
      }, REACTION_WINDOW_MS);
    }, delay);
  }

  private startFocusHold(): void {
    this.focusProgress.set(0);
    this.remainingMs.set(FOCUS_DURATION_MS);
    this.targetPos.set({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    this.cursorPos.set({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    this.tickCount = 0;

    this.intervalId = setInterval(() => {
      this.tickCount++;

      if (this.tickCount % FOCUS_JITTER_EVERY_N_TICKS === 0) {
        const current = this.targetPos();
        const dx = (Math.random() - 0.5) * 2 * FOCUS_JITTER_RANGE;
        const dy = (Math.random() - 0.5) * 2 * FOCUS_JITTER_RANGE;
        this.targetPos.set({
          x: clamp(current.x + dx, 24, GAME_WIDTH - 24),
          y: clamp(current.y + dy, 24, GAME_HEIGHT - 24),
        });
      }

      const isFocused = distance(this.cursorPos(), this.targetPos()) <= FOCUS_RADIUS;
      this.focusProgress.update((p) =>
        isFocused ? Math.min(100, p + FOCUS_GAIN_PER_TICK) : Math.max(0, p - FOCUS_LOSS_PER_TICK),
      );
      this.remainingMs.update((t) => t - FOCUS_TICK_MS);

      if (this.focusProgress() >= 100) {
        this.finishWithResult(true);
      } else if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, FOCUS_TICK_MS);
  }

  private startBalance(): void {
    this.balanceProgress.set(0);
    this.remainingMs.set(BALANCE_DURATION_MS);
    this.balanceCursorX = BALANCE_TRACK_WIDTH / 2;
    this.balanceVelocity = 0;
    this.ballX.set(BALANCE_TRACK_WIDTH / 2);

    const center = BALANCE_TRACK_WIDTH / 2;

    this.intervalId = setInterval(() => {
      // Etwas "Wind" plus sanfter Zug in Richtung Cursor, mit Dämpfung gegen Aufschaukeln.
      this.balanceVelocity += (Math.random() - 0.5) * BALANCE_WIND_STRENGTH;
      this.balanceVelocity += (this.balanceCursorX - this.ballX()) * BALANCE_PULL_FACTOR;
      this.balanceVelocity *= BALANCE_DAMPING;

      let nextX = this.ballX() + this.balanceVelocity;
      if (nextX < 0 || nextX > BALANCE_TRACK_WIDTH) {
        this.balanceVelocity = 0;
        nextX = clamp(nextX, 0, BALANCE_TRACK_WIDTH);
      }
      this.ballX.set(nextX);

      const inZone = Math.abs(nextX - center) <= BALANCE_ZONE_HALF_WIDTH;
      this.balanceProgress.update((p) =>
        inZone ? Math.min(100, p + BALANCE_GAIN_PER_TICK) : Math.max(0, p - BALANCE_LOSS_PER_TICK),
      );
      this.remainingMs.update((t) => t - BALANCE_TICK_MS);

      if (this.balanceProgress() >= 100) {
        this.finishWithResult(true);
      } else if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, BALANCE_TICK_MS);
  }

  private startCoconutThrow(): void {
    this.coconutProgress.set(0);
    this.coconutHits.set(0);
    this.remainingMs.set(COCONUT_DURATION_MS);
    this.coconutElapsedMs = 0;

    const center = COCONUT_TRACK_WIDTH / 2;
    const amplitude = center - 16;

    this.intervalId = setInterval(() => {
      this.coconutElapsedMs += COCONUT_TICK_MS;
      const angle = (2 * Math.PI * this.coconutElapsedMs) / COCONUT_OSCILLATION_PERIOD_MS;
      this.throwerPos.set(center + amplitude * Math.sin(angle));
      this.remainingMs.update((t) => t - COCONUT_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.coconutHits() >= COCONUT_HITS_REQUIRED);
      }
    }, COCONUT_TICK_MS);
  }

  private startFootprintTrack(): void {
    this.trackHits.set(0);
    this.trackProgress.set(0);
    this.remainingMs.set(FOOTPRINT_DURATION_MS);
    this.tickCount = 0;
    this.footprintPos.set(this.randomFootprintPos());

    this.intervalId = setInterval(() => {
      this.tickCount++;
      if (this.tickCount % FOOTPRINT_REPOSITION_EVERY_N_TICKS === 0) {
        this.footprintPos.set(this.randomFootprintPos());
      }
      this.remainingMs.update((t) => t - FOOTPRINT_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.trackHits() >= FOOTPRINT_HITS_REQUIRED);
      }
    }, FOOTPRINT_TICK_MS);
  }

  private startSwipeMash(): void {
    this.swipeProgress.set(0);
    this.remainingMs.set(SWIPE_DURATION_MS);
    this.lastSwipePos = null;

    this.intervalId = setInterval(() => {
      this.swipeProgress.update((p) => Math.max(0, p - SWIPE_DECAY_PER_TICK));
      this.remainingMs.update((t) => t - SWIPE_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.swipeProgress() >= 100);
      }
    }, SWIPE_TICK_MS);
  }

  private startRhythmTap(): void {
    this.rhythmProgress.set(0);
    this.rhythmHits.set(0);
    this.remainingMs.set(RHYTHM_DURATION_MS);
    this.rhythmElapsedMs = 0;

    const center = RHYTHM_TRACK_WIDTH / 2;
    const amplitude = center - 16;

    this.intervalId = setInterval(() => {
      this.rhythmElapsedMs += RHYTHM_TICK_MS;
      const angle = (2 * Math.PI * this.rhythmElapsedMs) / RHYTHM_OSCILLATION_PERIOD_MS;
      this.rhythmMarkerPos.set(center + amplitude * Math.sin(angle));
      this.remainingMs.update((t) => t - RHYTHM_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.rhythmHits() >= RHYTHM_HITS_REQUIRED);
      }
    }, RHYTHM_TICK_MS);
  }

  private startReactionBox(): void {
    this.reactionHits.set(0);
    this.reactionProgress.set(0);
    this.remainingMs.set(REACTION_DURATION_MS);
    this.openingVisible.set(false);
    this.scheduleNextOpening();

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - REACTION_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.reactionHits() >= REACTION_HITS_REQUIRED);
      }
    }, REACTION_TICK_MS);
  }

  private startDanceBattle(): void {
    const sequence = Array.from(
      { length: DANCE_SEQUENCE_LENGTH },
      () => DANCE_KEYS[Math.floor(Math.random() * DANCE_KEYS.length)],
    );
    this.danceSequence.set(sequence);
    this.danceResolved.set(Array(DANCE_SEQUENCE_LENGTH).fill('pending'));
    this.danceActiveIndex.set(0);
    this.danceHits.set(0);
    this.danceCellElapsedMs = 0;

    this.intervalId = setInterval(() => {
      this.danceCellElapsedMs += DANCE_TICK_MS;
      if (this.danceCellElapsedMs >= DANCE_STEP_TIMEOUT_MS) {
        // Zeit für diesen Schritt abgelaufen, ohne (rechtzeitigen) Tastendruck -> Fehltritt.
        const idx = this.danceActiveIndex();
        const resolved = this.danceResolved();
        if (resolved[idx] === 'pending') {
          const next = [...resolved];
          next[idx] = 'miss';
          this.danceResolved.set(next);
        }
        this.advanceDanceStep();
      }
    }, DANCE_TICK_MS);
  }

  /** Geht zum nächsten Tanzschritt über oder wertet die gesamte Sequenz aus, falls das Ende erreicht ist. */
  private advanceDanceStep(): void {
    this.danceCellElapsedMs = 0;
    const nextIndex = this.danceActiveIndex() + 1;

    if (nextIndex >= DANCE_SEQUENCE_LENGTH) {
      this.finishWithResult(this.danceHits() >= DANCE_HITS_REQUIRED);
      return;
    }
    this.danceActiveIndex.set(nextIndex);
  }

  private startDominoMatch(): void {
    this.dominoRoundsWon.set(0);
    this.remainingMs.set(DOMINO_DURATION_MS);
    const startEnd = Math.floor(Math.random() * (DOMINO_MAX_PIP + 1));
    this.dominoOpenEnd.set(startEnd);
    this.dominoHand.set(this.generateDominoHand(startEnd));

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - DOMINO_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.dominoRoundsWon() >= DOMINO_ROUNDS_REQUIRED);
      }
    }, DOMINO_TICK_MS);
  }

  /** Erzeugt eine neue Hand mit garantiert mindestens einem zur offenen Zahl passenden Stein. */
  private generateDominoHand(matchValue: number): DominoTile[] {
    const randomPip = () => Math.floor(Math.random() * (DOMINO_MAX_PIP + 1));
    const nextId = () => `domino-${this.dominoTileIdCounter++}`;

    const hand: DominoTile[] = [{ id: nextId(), a: matchValue, b: randomPip() }];
    for (let i = 1; i < DOMINO_HAND_SIZE; i++) {
      hand.push({ id: nextId(), a: randomPip(), b: randomPip() });
    }
    // Reihenfolge mischen, damit der passende Stein nicht immer zuerst liegt.
    for (let i = hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hand[i], hand[j]] = [hand[j], hand[i]];
    }
    return hand;
  }

  private startLogicPuzzle(): void {
    const sequence = Array.from({ length: LOGIC_SEQUENCE_LENGTH }, () =>
      Math.floor(Math.random() * LOGIC_SYMBOLS.length),
    );
    this.logicSequence.set(sequence);
    this.logicInputIndex.set(0);
    this.logicPreviewIndex.set(-1);
    this.logicPhase.set('preview');
    this.remainingMs.set(LOGIC_DURATION_MS);

    let previewStep = 0;
    const revealNext = () => {
      if (previewStep >= sequence.length) {
        this.logicPreviewIndex.set(-1);
        this.logicPhase.set('input');
        return;
      }
      this.logicPreviewIndex.set(sequence[previewStep]);
      previewStep++;
      this.previewTimeoutId = setTimeout(() => {
        this.logicPreviewIndex.set(-1);
        this.previewTimeoutId = setTimeout(revealNext, LOGIC_PREVIEW_GAP_MS);
      }, LOGIC_PREVIEW_STEP_MS);
    };
    revealNext();

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - LOGIC_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, LOGIC_TICK_MS);
  }

  private startStompAlternate(): void {
    this.stompProgress.set(0);
    this.remainingMs.set(STOMP_DURATION_MS);
    this.lastStompSide = null;

    this.intervalId = setInterval(() => {
      this.stompProgress.update((p) => Math.max(0, p - STOMP_DECAY_PER_TICK));
      this.remainingMs.update((t) => t - STOMP_TICK_MS);

      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.stompProgress() >= 100);
      }
    }, STOMP_TICK_MS);
  }

  private startMemorySequence(): void {
    const fullSequence = Array.from({ length: MEMORY_MAX_ROUND }, () =>
      Math.floor(Math.random() * MEMORY_SYMBOLS.length),
    );
    this.memorySequence.set(fullSequence);
    this.memoryRound.set(1);
    this.memoryInputIndex.set(0);
    this.memoryPhase.set('preview');
    this.remainingMs.set(MEMORY_DURATION_MS);

    this.runMemoryPreviewForRound(1);

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - MEMORY_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, MEMORY_TICK_MS);
  }

  /** Zeigt die ersten `round` Symbole der Sequenz nacheinander, dann geht's in die Eingabe-Phase. */
  private runMemoryPreviewForRound(round: number): void {
    const sequence = this.memorySequence();
    let previewStep = 0;

    const revealNext = () => {
      if (previewStep >= round) {
        this.memoryPreviewIndex.set(-1);
        this.memoryPhase.set('input');
        return;
      }
      this.memoryPreviewIndex.set(sequence[previewStep]);
      previewStep++;
      this.previewTimeoutId = setTimeout(() => {
        this.memoryPreviewIndex.set(-1);
        this.previewTimeoutId = setTimeout(revealNext, MEMORY_PREVIEW_GAP_MS);
      }, MEMORY_PREVIEW_STEP_MS);
    };
    revealNext();
  }

  private startPowerGauge(): void {
    this.powerValue.set(0);
    this.powerHeld = false;
    this.remainingMs.set(POWER_DURATION_MS);

    this.intervalId = setInterval(() => {
      if (this.powerHeld) {
        this.powerValue.update((v) => {
          const next = v + POWER_RISE_PER_TICK;
          return next > 100 ? 0 : next; // Überlastet: platzt und muss neu anfangen
        });
      }
      this.remainingMs.update((t) => t - POWER_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, POWER_TICK_MS);
  }

  private startAnchorPullDrag(): void {
    this.anchorProgress.set(0);
    this.remainingMs.set(ANCHOR_DURATION_MS);
    this.anchorDragStartY = null;

    this.intervalId = setInterval(() => {
      this.anchorProgress.update((p) => Math.max(0, p - ANCHOR_DECAY_PER_TICK));
      this.remainingMs.update((t) => t - ANCHOR_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.anchorProgress() >= 100);
      }
    }, ANCHOR_TICK_MS);
  }

  private startBlockShove(): void {
    this.blockTargets = [
      1 + Math.floor(Math.random() * 3),
      1 + Math.floor(Math.random() * 3),
      1 + Math.floor(Math.random() * 3),
    ];
    this.blockPositions.set([0, 0, 0]);
    this.blockAligned.set([false, false, false]);
    this.remainingMs.set(BLOCK_DURATION_MS);

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - BLOCK_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(this.blockAligned().every((a) => a));
      }
    }, BLOCK_TICK_MS);
  }

  private startDigSearch(): void {
    this.digCells.set(Array(DIG_CELL_COUNT).fill('hidden'));
    this.digAttemptsLeft.set(DIG_ATTEMPTS);
    this.digTargetIndex = Math.floor(Math.random() * DIG_CELL_COUNT);
    this.remainingMs.set(DIG_DURATION_MS);

    this.intervalId = setInterval(() => {
      this.remainingMs.update((t) => t - DIG_TICK_MS);
      if (this.remainingMs() <= 0) {
        this.finishWithResult(false); // Zeit um, egal wie viele Versuche noch übrig waren
      }
    }, DIG_TICK_MS);
  }

  private startPatternScan(): void {
    this.scanTargetIndex = Math.floor(Math.random() * SCAN_CELL_COUNT);
    this.scanActiveIndex.set(0);
    this.remainingMs.set(SCAN_DURATION_MS);
    let stepElapsedMs = 0;

    this.intervalId = setInterval(() => {
      stepElapsedMs += SCAN_TICK_MS;
      this.remainingMs.update((t) => t - SCAN_TICK_MS);

      if (stepElapsedMs >= SCAN_STEP_MS) {
        stepElapsedMs = 0;
        this.scanActiveIndex.update((i) => (i + 1) % SCAN_CELL_COUNT);
      }

      if (this.remainingMs() <= 0) {
        this.finishWithResult(false);
      }
    }, SCAN_TICK_MS);
  }

  /**
   * Beendet die Spielschleife und zeigt kurz ein Erfolgs-/Misserfolgs-Feedback,
   * bevor `MinigameService.reportResult()` tatsächlich aufgerufen wird (das
   * löst dann die passende outcome- bzw. fallback-Dialogszene aus).
   */
  private finishWithResult(success: boolean): void {
    this.stopLoop();
    this.resultFeedback.set(success ? 'success' : 'failure');
    this.resultTimeoutId = setTimeout(() => {
      this.resultFeedback.set(null);
      this.minigames.reportResult(success);
    }, RESULT_FEEDBACK_DURATION_MS);
  }

  private stopLoop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.openingTimeoutId !== null) {
      clearTimeout(this.openingTimeoutId);
      this.openingTimeoutId = null;
    }
    if (this.resultTimeoutId !== null) {
      clearTimeout(this.resultTimeoutId);
      this.resultTimeoutId = null;
    }
    if (this.previewTimeoutId !== null) {
      clearTimeout(this.previewTimeoutId);
      this.previewTimeoutId = null;
    }
    this.resultFeedback.set(null);
  }
}
