# Insel-Adventure – Architekturübersicht

## Setup & Start

Voraussetzung: Node.js 18+ (empfohlen 20 LTS).

```bash
npm install
npm start        # entspricht "ng serve", läuft auf http://localhost:4200
```

Production-Build:

```bash
npm run build     # Output in dist/insel-adventure
```

Enthaltene Angular-Grundgerüst-Dateien: `angular.json`, `package.json`,
`tsconfig*.json`, `src/main.ts`, `src/index.html`, `src/styles.scss`
(bindet `src/styles/theme.scss` ein). Das Projekt nutzt ausschließlich
**standalone components** (kein `AppModule` nötig) – passend zu Angular 18+.

## Ordnerstruktur

```
src/app/
├── core/
│   ├── models/                  Reine Datenschemas (Interfaces/Enums), keine Logik
│   │   ├── biome.enum.ts        BiomeType + Meta (Label, Icon, Farbe, Gefahr)
│   │   ├── hex-tile.model.ts    HexTile, HexCoordinates, HexEvent, InteractablePlace
│   │   ├── character.model.ts   Character, CharacterId, Startwerte
│   │   └── dialogue.model.ts    DialogueLine, DialogueScene
│   ├── services/                State-Management (Angular Signals)
│   │   ├── island-map.service.ts       Hex-Tiles, Nebel des Krieges, Insel-Generierung
│   │   ├── character.service.ts        Positionen, Bewegung, aktiver Charakter
│   │   ├── dialogue.service.ts         Abspielen von Dialog-Szenen
│   │   └── interaction.service.ts      Verknüpft Bewegung <-> Events <-> Dialoge
│   └── utils/
│       └── hex-math.util.ts     Axiale Hex-Koordinaten-Mathematik (Nachbarn, Distanz, Pixel)
├── data/
│   ├── island-generator.ts      Erzeugt Tiles + platziert Biome/Events/Orte
│   └── dialogue-scenes.data.ts  Alle Dialog-Texte, inkl. Intro-Szenario
├── features/
│   ├── game-board/
│   │   ├── game-board.component.ts     Haupt-Container, verdrahtet alles
│   │   ├── hex-grid/hex-grid.component.ts    SVG-Rendering des gesamten Grids
│   │   └── hex-tile/hex-tile.component.ts    Einzelnes Hexagon (SVG <g>)
│   ├── dialogue-box/dialogue-box.component.ts   Sprechblasen am unteren Rand
│   └── hud/hud.component.ts             Charakter-Umschalter, Fortschrittsanzeige
└── app.component.ts
```

## Architektur-Prinzipien

- **Trennung Daten/Logik/Darstellung:** `core/models` kennt keine Services, `data/` enthält
  reine Inhalte (Insel-Layout, Dialogtexte), `core/services` orchestriert den State,
  `features/` ist "dumm" und reagiert nur auf Signals.
- **Signals statt Subjects:** Alle Services nutzen Angular Signals (`signal`, `computed`)
  für reaktiven State ohne RxJS-Boilerplate – passt zu Angular 18+.
- **Ein Wahrheits-Ort pro Zustand:** `IslandMapService` besitzt die Tiles,
  `CharacterService` besitzt die Positionen, `DialogueService` besitzt die aktive Szene.
  `InteractionService` verbindet die drei, ohne selbst State zu halten.

## Datenfluss: Feld aufdecken & Interaktion

1. Klick auf ein Hexagon im `HexGridComponent` → `GameBoardComponent.onTileSelected()`
2. → `InteractionService.moveActiveCharacterTo(coord)`
   - prüft Zugriffsbeschränkungen (`interactable.restrictedTo`)
   - ruft `CharacterService.moveCharacter()` auf (validiert Reichweite)
   - bei Erfolg: `CharacterService` ruft intern `IslandMapService.revealAround()`
     und `markExplored()` auf → Nebel des Krieges verschwindet
   - `InteractionService.triggerTileEvent()` prüft, ob das Feld ein `HexEvent` hat,
     und spielt bei Bedarf eine `DialogueScene` über `DialogueService.playScene()` ab
3. `DialogueBoxComponent` reagiert automatisch über `dialogue.currentLine()` (Signal)

## Intro-Szenario

Das komplette Strand-Intro liegt in `data/dialogue-scenes.data.ts` unter der ID `'intro'`
und wird beim ersten `ngOnInit()` von `GameBoardComponent` automatisch abgespielt
(`dialogue.playScene(DIALOGUE_SCENES['intro'])`), bevor der Spieler Züge ausführen kann.

## Nächste sinnvolle Schritte

1. `HexTile`-Updates in `IslandMapService` kapseln (aktuell mutiert `interaction.service.ts`
   `tile.event.triggered` direkt – für Persistenz/Undo besser über einen Service-Setter).
2. Speichern/Laden: Tiles + Charakterpositionen sind reine POJOs → leicht per
   `JSON.stringify` in `localStorage` sicherbar.
3. Zufalls-Insel: `island-generator.ts` nutzt aktuell eine deterministische Zonen-Logik;
   für echte Varianz einen seeded RNG (z.B. `mulberry32`) einbauen.
4. Kampfsystem/Inventar: `HexItem` und `HexEvent` sind bereits vorbereitet, aber noch
   nicht mit einer Inventar-UI verbunden.
5. Zoom/Pan im `HexGridComponent`: `offset()` ist aktuell ein Platzhalter für spätere
   Kamera-Steuerung.
