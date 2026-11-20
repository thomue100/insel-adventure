import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, clamp, isKey, shuffle } from '../minigame-base';

type Reaction = 'amazed' | 'sympathy' | 'curious';

const REACTIONS: Array<{ id: Reaction; icon: string; label: string; key: string }> = [
  { id: 'amazed', icon: '😮', label: 'Staunen', key: '1' },
  { id: 'sympathy', icon: '😔', label: 'Mitfühlen', key: '2' },
  { id: 'curious', icon: '🤔', label: 'Nachfragen', key: '3' },
];

const PHRASES: Record<Reaction, string[]> = {
  amazed: [
    'Diesen Pokal hab ich mit nur EINEM Schlag gewonnen!',
    'Drei Gegner gleichzeitig – und keiner stand mehr!',
    'Man nannte mich den Donner der Südsee!',
    'Den Gürtel hier hab ich zwölf Jahre verteidigt!',
    'Ich hab sogar einen Hai k.o. geboxt. Fast.',
    'Mein linker Haken ist legendär. Frag jeden Fisch!',
  ],
  sympathy: [
    'Den Endkampf damals … hat der Schiedsrichter verpfuscht.',
    'Meine Lieblingstrophäe hat die Flut geholt.',
    'Seit Jahren will keiner mehr gegen mich antreten …',
    'Mein alter Trainer … er fehlt mir sehr.',
    'Einmal bin ich über mein eigenes Seil gestolpert. Vor allen.',
  ],
  curious: [
    'Und weißt du, was dann passiert ist?',
    'Rätst du, wie schwer dieser Pokal ist?',
    'Willst du hören, woher ich diese Narbe habe?',
    'Hab ich dir schon von meinem Rückkampf erzählt?',
    'Na, was glaubst du, wer mein härtester Gegner war?',
  ],
};

interface Line {
  id: number;
  text: string;
  expected: Reaction;
  durationMs: number;
}

const LINE_COUNT = 9;

/**
 * Ä-Buff Schritt 2, "Seine Box-Trophäen bewundern": Ä-Buff erzählt, und man
 * muss jeweils passend reagieren – staunen bei Angeberei, mitfühlen bei
 * traurigen Geschichten, nachfragen bei Fragen. Die Zeit pro Satz wird kürzer.
 */
@Component({
  selector: 'mg-story-react',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="mg-stats"><span>Satz {{ lineNumber() }}/{{ lineCount }}</span></div>
    <div class="speaker">
      <span class="ebuff">🧔</span>
      @if (line(); as l) {
        <div class="bubble">
          „{{ l.text }}“
          <div class="line-timer"><div class="line-timer-fill" [style.animation-duration.ms]="l.durationMs"></div></div>
        </div>
      } @else {
        <div class="bubble muted">…</div>
      }
    </div>
    <div class="mg-meter" [class.danger]="mood() < 40">
      <div class="mg-meter-fill" [style.width.%]="mood()"></div><span class="mg-meter-label">Laune · Ziel {{ goal }} %</span>
    </div>
    <div class="mg-row">
      @for (r of reactions; track r.id) {
        <button class="mg-pad" [disabled]="!line()" (pointerdown)="react(r.id)">{{ r.icon }}<small>{{ r.key }} · {{ r.label }}</small></button>
      }
    </div>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .speaker { display: flex; align-items: flex-start; gap: 8px; width: 300px; max-width: 100%; min-height: 86px; }
    .ebuff { font-size: 36px; }
    .bubble {
      flex: 1; background: #f2ede3; color: #1a1a1a; border-radius: 12px; padding: 0.5rem 0.7rem;
      font-size: 0.88rem; line-height: 1.3; animation: bubble-in 0.15s ease-out;
    }
    .bubble.muted { opacity: 0.4; }
    .line-timer { height: 4px; margin-top: 6px; background: rgba(0, 0, 0, 0.12); border-radius: 2px; overflow: hidden; }
    .line-timer-fill { height: 100%; background: #c0504d; animation-name: mg-bar-drain; animation-timing-function: linear; animation-fill-mode: forwards; }
    @keyframes bubble-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `],
})
export class StoryReactGame extends MinigameBase {
  readonly reactions = REACTIONS;
  readonly lineCount = LINE_COUNT;
  readonly mood = signal(40);
  readonly line = signal<Line | null>(null);
  readonly lineNumber = signal(0);
  goal = 70;
  private script: Line[] = [];
  private lineShownAt = 0;
  private lineTimeoutId: ReturnType<typeof setTimeout> | null = null;

  protected start(): void {
    this.goal = this.tune(65, 55);
    const pool = shuffle(
      (Object.keys(PHRASES) as Reaction[]).flatMap((reaction) =>
        shuffle(PHRASES[reaction]).slice(0, 3).map((text) => ({ text, expected: reaction })),
      ),
    );
    this.script = pool.slice(0, LINE_COUNT).map((entry, i) => ({
      id: i,
      ...entry,
      durationMs: 2700 - (900 * i) / (LINE_COUNT - 1) + this.tune(200, 800),
    }));
    this.after(400, () => this.showLine(0));
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    const r = REACTIONS.find((x) => isKey(event, x.key));
    if (!r) return;
    event.preventDefault();
    this.react(r.id);
  }

  react(reaction: Reaction): void {
    const l = this.line();
    if (this.done || !l) return;
    this.cancel(this.lineTimeoutId);
    if (reaction === l.expected) {
      const fast = performance.now() - this.lineShownAt < l.durationMs / 2;
      this.adjustMood(fast ? 17 : 13, fast ? 'Genau richtig!' : 'Passt!', false);
    } else {
      this.adjustMood(-16, 'Unpassend …', true);
    }
    this.nextLine(l.id + 1);
  }

  private showLine(index: number): void {
    const l = this.script[index];
    this.line.set(l);
    this.lineNumber.set(index + 1);
    this.lineShownAt = performance.now();
    this.lineTimeoutId = this.after(l.durationMs, () => {
      this.adjustMood(-12, 'Zu langsam!', true);
      this.nextLine(index + 1);
    });
  }

  private nextLine(index: number): void {
    this.line.set(null);
    if (this.done) return;
    if (index >= this.script.length) {
      this.finish(this.mood() >= this.goal, `Laune: ${Math.round(this.mood())} %`);
      return;
    }
    this.after(350, () => this.showLine(index));
  }

  private adjustMood(delta: number, label: string, bad: boolean): void {
    this.mood.update((m) => clamp(m + delta, 0, 100));
    this.sfx.play(bad ? 'miss' : 'hit');
    this.pop(label, bad);
    if (this.mood() >= 100) this.finish(true, 'Ä-Buff hat einen neuen besten Freund.');
  }
}
