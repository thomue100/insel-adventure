import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MgStatusComponent, MinigameBase, pick, shuffle } from '../minigame-base';

interface Tile {
  id: number;
  a: number;
  b: number;
}

type Side = 'left' | 'right';
type Turn = 'player' | 'opponent' | 'over';

const HAND_SIZE = 6;
const CHAIN_VISIBLE = 7;

function pips(tiles: Tile[]): number {
  return tiles.reduce((sum, t) => sum + t.a + t.b, 0);
}

/**
 * Piraten-Bucht, Domino gegen Bilone & Bidate: Eine echte (kurze) Partie
 * Domino mit Doppel-Sechs-Satz. Steine an eines der beiden offenen Enden
 * anlegen, sonst vom Stapel ziehen. Wer zuerst alle Steine los ist, gewinnt;
 * ist das Spiel blockiert, gewinnt die kleinere Augensumme.
 */
@Component({
  selector: 'mg-domino',
  standalone: true,
  imports: [MgStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mg-game' },
  template: `
    <div class="opponent">
      <span>🏴‍☠️ Bilone & Bidate</span>
      <span class="backs">{{ '▮'.repeat(opponentHand().length) }}</span>
      <span class="boneyard">Stapel: {{ boneyard().length }}</span>
    </div>
    <div class="mg-line" [class.alert]="turn() === 'player'">{{ message() }}</div>

    <div class="chain">
      <button class="end-btn" [class.choosable]="selected() && fits(selected()!, 'left')" (pointerdown)="playSelected('left')">
        ◀ {{ leftEnd() }}
      </button>
      <div class="chain-tiles">
        @if (hiddenCount() > 0) {
          <span class="more">+{{ hiddenCount() }}</span>
        }
        @for (t of visibleChain(); track t.id) {
          <span class="tile small" [class.double]="t.a === t.b"><span>{{ t.a }}</span><i></i><span>{{ t.b }}</span></span>
        }
      </div>
      <button class="end-btn" [class.choosable]="selected() && fits(selected()!, 'right')" (pointerdown)="playSelected('right')">
        {{ rightEnd() }} ▶
      </button>
    </div>

    <div class="hand">
      @for (t of hand(); track t.id) {
        <button
          class="tile"
          [class.playable]="turn() === 'player' && playable(t)"
          [class.selected]="selected()?.id === t.id"
          [disabled]="turn() !== 'player'"
          (pointerdown)="onTile(t)"
        >
          <span>{{ t.a }}</span><i></i><span>{{ t.b }}</span>
        </button>
      }
    </div>
    <button class="mg-btn" [disabled]="turn() !== 'player' || hasPlayable()" (pointerdown)="drawOrPass()">
      {{ boneyard().length > 0 ? '➕ Ziehen' : '✋ Passen' }}
    </button>
    <app-mg-status [game]="this" />
  `,
  styles: [`
    .opponent { display: flex; gap: 0.8rem; align-items: center; font-size: 0.82rem; color: #cfcabe; }
    .backs { color: #f2ede3; letter-spacing: 1px; }
    .boneyard { opacity: 0.7; }
    .chain { display: flex; align-items: center; gap: 6px; width: 320px; max-width: 100%; justify-content: center; }
    .chain-tiles { display: flex; gap: 3px; align-items: center; flex-wrap: nowrap; overflow: hidden; }
    .more { font-size: 0.7rem; opacity: 0.6; margin-right: 2px; }
    .end-btn {
      min-width: 46px; height: 40px; font-size: 1rem; font-weight: bold; font-family: inherit;
      background: rgba(224, 164, 88, 0.15); color: var(--text-primary, #f2ede3);
      border: 2px solid #3a3a45; border-radius: 8px; cursor: pointer;
    }
    .end-btn.choosable { border-color: #8fd68a; background: rgba(143, 214, 138, 0.25); animation: mg-blink 0.5s ease-in-out infinite alternate; }
    .hand { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; max-width: 320px; }
    .tile {
      display: inline-flex; align-items: center; background: #f2ede3; color: #1a1a1a; font-weight: bold; font-family: inherit;
      border: 2px solid #3a3a45; border-radius: 7px; padding: 3px 4px; font-size: 16px; cursor: pointer;
      touch-action: manipulation; transition: transform 0.08s ease, border-color 0.1s ease;
    }
    .tile span { width: 18px; text-align: center; }
    .tile i { width: 2px; height: 20px; background: #1a1a1a; margin: 0 2px; }
    .tile:disabled { cursor: default; opacity: 0.75; }
    .tile.playable { border-color: #8fd68a; transform: translateY(-3px); }
    .tile.selected { border-color: var(--accent-color, #e0a458); box-shadow: 0 0 10px var(--accent-color, #e0a458); }
    .tile.small { font-size: 12px; padding: 1px 2px; cursor: default; }
    .tile.small span { width: 12px; }
    .tile.small i { height: 14px; }
  `],
})
export class DominoGame extends MinigameBase {
  readonly hand = signal<Tile[]>([]);
  readonly opponentHand = signal<Tile[]>([]);
  readonly boneyard = signal<Tile[]>([]);
  readonly chain = signal<Tile[]>([]);
  readonly turn = signal<Turn>('player');
  readonly selected = signal<Tile | null>(null);
  readonly message = signal('Du beginnst!');
  private passesInRow = 0;

  readonly leftEnd = computed(() => this.chain()[0]?.a ?? 0);
  readonly rightEnd = computed(() => this.chain()[this.chain().length - 1]?.b ?? 0);
  readonly visibleChain = computed(() => this.chain().slice(-CHAIN_VISIBLE));
  readonly hiddenCount = computed(() => Math.max(0, this.chain().length - CHAIN_VISIBLE));
  readonly hasPlayable = computed(() => this.hand().some((t) => this.playable(t)));

  protected start(): void {
    const set: Tile[] = [];
    let id = 0;
    for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) set.push({ id: id++, a, b });
    const deck = shuffle(set);
    this.hand.set(deck.splice(0, HAND_SIZE));
    this.opponentHand.set(deck.splice(0, HAND_SIZE));
    this.chain.set([deck.pop()!]);
    this.boneyard.set(deck);
    this.startPlayerTurn();
  }

  fits(tile: Tile, side: Side): boolean {
    const end = side === 'left' ? this.leftEnd() : this.rightEnd();
    return tile.a === end || tile.b === end;
  }

  playable(tile: Tile): boolean {
    return this.fits(tile, 'left') || this.fits(tile, 'right');
  }

  onTile(tile: Tile): void {
    if (this.done || this.turn() !== 'player') return;
    const left = this.fits(tile, 'left');
    const right = this.fits(tile, 'right');
    if (!left && !right) {
      this.sfx.play('miss');
      this.pop('Passt nicht', true);
      return;
    }
    if (left && right && this.leftEnd() !== this.rightEnd()) {
      this.selected.set(tile);
      this.message.set('An welches Ende? ◀ oder ▶');
      return;
    }
    this.place(tile, left ? 'left' : 'right', 'player');
  }

  playSelected(side: Side): void {
    const tile = this.selected();
    if (!tile || this.turn() !== 'player' || !this.fits(tile, side)) return;
    this.place(tile, side, 'player');
  }

  drawOrPass(): void {
    if (this.done || this.turn() !== 'player' || this.hasPlayable()) return;
    const pile = this.boneyard();
    if (pile.length > 0) {
      this.hand.update((h) => [...h, pile[pile.length - 1]]);
      this.boneyard.set(pile.slice(0, -1));
      this.sfx.play('click');
      this.startPlayerTurn();
      return;
    }
    this.passesInRow++;
    this.pop('Gepasst', true);
    if (!this.checkBlocked()) this.startOpponentTurn();
  }

  private startPlayerTurn(): void {
    this.turn.set('player');
    this.selected.set(null);
    this.message.set(this.hasPlayable() ? 'Dein Zug – leg einen grün markierten Stein an.' : 'Kein passender Stein – zieh vom Stapel.');
  }

  private place(tile: Tile, side: Side, who: 'player' | 'opponent'): void {
    const placed =
      side === 'left'
        ? tile.b === this.leftEnd() ? { ...tile } : { id: tile.id, a: tile.b, b: tile.a }
        : tile.a === this.rightEnd() ? { ...tile } : { id: tile.id, a: tile.b, b: tile.a };
    this.chain.update((c) => (side === 'left' ? [placed, ...c] : [...c, placed]));
    this.passesInRow = 0;
    this.selected.set(null);

    if (who === 'player') {
      this.hand.update((h) => h.filter((t) => t.id !== tile.id));
      this.sfx.play('hit');
      if (this.hand().length === 0) {
        this.turn.set('over');
        this.finish(true, 'Domino! Bilone & Bidate sind sprachlos.');
        return;
      }
      this.startOpponentTurn();
    } else {
      this.opponentHand.update((h) => h.filter((t) => t.id !== tile.id));
      this.sfx.play('click');
      if (this.opponentHand().length === 0) {
        this.turn.set('over');
        this.finish(false, 'Bilone & Bidate haben zuerst alle Steine gelegt.');
        return;
      }
      this.startPlayerTurn();
    }
  }

  private startOpponentTurn(): void {
    this.turn.set('opponent');
    this.message.set('Bilone & Bidate überlegen …');
    this.after(900, () => this.opponentMove());
  }

  private opponentMove(): void {
    const options = this.opponentHand().filter((t) => this.playable(t));
    if (options.length === 0) {
      const pile = this.boneyard();
      if (pile.length > 0) {
        this.opponentHand.update((h) => [...h, pile[pile.length - 1]]);
        this.boneyard.set(pile.slice(0, -1));
        this.message.set('Bilone zieht einen Stein …');
        this.after(550, () => this.opponentMove());
        return;
      }
      this.passesInRow++;
      this.pop('Bidate passt!');
      if (!this.checkBlocked()) this.startPlayerTurn();
      return;
    }
    // Normal: Bilone legt geschickt den schwersten Stein ab. Leicht: eher zufällig.
    const choice = this.tune(0, 1) >= 1 ? pick(options) : options.reduce((best, t) => (t.a + t.b > best.a + best.b ? t : best));
    const side: Side = this.fits(choice, 'left') ? 'left' : 'right';
    this.place(choice, side, 'opponent');
  }

  /** Beide haben nacheinander gepasst → Augensumme entscheidet. */
  private checkBlocked(): boolean {
    if (this.passesInRow < 2) return false;
    this.turn.set('over');
    const mine = pips(this.hand());
    const theirs = pips(this.opponentHand());
    const win = this.tune(0, 1) >= 1 ? mine <= theirs : mine < theirs;
    this.finish(win, `Blockiert! Deine Augen: ${mine}, ihre: ${theirs}.`);
    return true;
  }
}
