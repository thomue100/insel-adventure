import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RetroFanfareService } from '../../core/services/retro-fanfare.service';

@Component({
  selector: 'app-title-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="title-screen">
      <div class="title-overlay"></div>
      <div class="title-content">
        <div class="title-card">
          <div class="title-main">Das Inselspiel</div>
          <div class="title-sub">Prinzessin Laja &amp; Schlimm Helix Kisten</div>
          <div class="title-tagline">Aufbruch zur Schatzinsel</div>
          <button class="start-button" (click)="onStart()">▶ Spiel starten</button>
          <div class="title-footnote">Ein Abenteuer für kluge Köpfe ab 6 Jahren</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .title-screen {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: url('/title-artwork.jpg') center center / cover no-repeat;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .title-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(12,12,18,0) 40%, rgba(12,12,18,0.85) 85%, rgba(12,12,18,0.96) 100%);
    }
    .title-content {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      padding-bottom: 6vh;
    }
    .title-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      text-align: center;
      padding: 0 1.5rem;
    }
    .title-main {
      font-family: Georgia, 'Iowan Old Style', serif;
      font-size: clamp(2.2rem, 6vw, 3.4rem);
      font-weight: bold;
      color: #f2d19a;
      text-shadow: 0 3px 10px rgba(0,0,0,0.7), 0 0 24px rgba(224,164,88,0.35);
      letter-spacing: 0.02em;
    }
    .title-sub {
      font-size: clamp(0.95rem, 2.4vw, 1.2rem);
      color: var(--text-primary, #f2ede3);
      text-shadow: 0 2px 6px rgba(0,0,0,0.7);
    }
    .title-tagline {
      font-style: italic;
      font-size: clamp(0.85rem, 2vw, 1rem);
      color: var(--accent-color, #e0a458);
      text-shadow: 0 2px 6px rgba(0,0,0,0.7);
      margin-bottom: 0.4rem;
    }
    .start-button {
      background: var(--accent-color, #e0a458);
      color: #1a1a1a;
      border: none;
      border-radius: 999px;
      padding: 0.75rem 2rem;
      font-size: 1.05rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.4);
      transition: transform 0.1s ease;
    }
    .start-button:hover {
      transform: translateY(-2px);
    }
    .start-button:active {
      transform: translateY(0) scale(0.97);
    }
    .title-footnote {
      font-size: 0.75rem;
      color: #cfcabe;
      opacity: 0.85;
      margin-top: 0.3rem;
    }
  `],
})
export class TitleScreenComponent implements OnInit {
  @Output() start = new EventEmitter<void>();

  constructor(private readonly fanfare: RetroFanfareService) {}

  ngOnInit(): void {
    // Best-effort: manche Browser blockieren Audio-Autoplay ohne vorherige
    // Nutzer-Interaktion. Falls das hier stumm bleibt, hört man sie beim Klick
    // auf "Spiel starten" nicht erneut - das ist rein dekorativ, kein Problem.
    this.fanfare.playAdesteFidelesFanfare();
  }

  onStart(): void {
    this.start.emit();
  }
}
