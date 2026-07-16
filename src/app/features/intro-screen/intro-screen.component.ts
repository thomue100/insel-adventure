import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="intro-screen">
      <div class="intro-card">
        <h1>Willkommen an Bord, Abenteurer!</h1>
        <p class="intro-lead">
          Prinzessin Laja und Schlimm Helix Kisten sind auf einer geheimnisvollen Insel gestrandet –
          irgendwo dort draußen liegt der gestohlene Königsschatz verborgen.
        </p>
        <ul class="intro-points">
          <li>🗺️ Erkunde die Insel Feld für Feld und lüfte den Nebel</li>
          <li>🎮 Bestehe kleine, knifflige Spiele auf dem Weg</li>
          <li>😄 Erlebe die frotzelnden Abenteuer von Laja &amp; Helix</li>
          <li>💰 Finde alle Hinweise – und segle am Ende mit dem Schatz davon</li>
        </ul>
        <button class="continue-button" (click)="onContinue()">Los geht's! ▶</button>
      </div>
    </div>
  `,
  styles: [`
    .intro-screen {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--map-bg, #0c0c12);
    }
    .intro-card {
      max-width: 560px;
      width: 100%;
      padding: 2.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.1rem;
    }
    h1 {
      margin: 0;
      font-size: 1.6rem;
      color: var(--text-primary, #f2ede3);
    }
    .intro-lead {
      margin: 0;
      color: #cfcabe;
      line-height: 1.5;
      font-size: 0.98rem;
    }
    .intro-points {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      text-align: left;
      width: 100%;
      background: var(--dialogue-bg, #1c1a24);
      border: 1px solid #3a3a45;
      border-radius: 12px;
      padding: 1.1rem 1.4rem;
    }
    .intro-points li {
      color: var(--text-primary, #f2ede3);
      font-size: 0.92rem;
    }
    .continue-button {
      background: var(--accent-color, #e0a458);
      color: #1a1a1a;
      border: none;
      border-radius: 999px;
      padding: 0.75rem 2.1rem;
      font-size: 1.05rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.1s ease;
      margin-top: 0.4rem;
    }
    .continue-button:hover {
      transform: translateY(-2px);
    }
    .continue-button:active {
      transform: translateY(0) scale(0.97);
    }
  `],
})
export class IntroScreenComponent {
  @Output() continue = new EventEmitter<void>();

  onContinue(): void {
    this.continue.emit();
  }
}
