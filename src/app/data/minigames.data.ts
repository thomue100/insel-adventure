import { SkillType } from '../core/models/character.model';
import { MinigameType } from '../core/models/minigame.model';

export interface MinigameInfo {
  icon: string;
  title: string;
  /** Kurze Spielregeln für die Anleitungskarte vor dem Start. */
  rules: string[];
  /** Steuerung in einer Zeile (Maus/Touch und Tastatur). */
  controls: string;
  /**
   * Skill, zu dem das Minigame passt. Ist die Hauptfigur darin stark, wird
   * das Spiel etwas leichter (mehr Zeit/Toleranz) – so wirkt sich die
   * Figurenwahl auf jede Entscheidung aus.
   */
  skill?: SkillType;
}

export const MINIGAME_INFO: Record<MinigameType, MinigameInfo> = {
  'focus-hold': {
    icon: '🤫',
    title: 'Ruhig bleiben',
    rules: [
      'Halte den Lichtpunkt am zitternden Gebüsch – es wird immer flinker.',
      'Knackt ein Ast (❗), bewege dich für einen Moment gar nicht!',
    ],
    controls: 'Maus / Finger bewegen',
    skill: 'diplomacy',
  },
  'click-mash': {
    icon: '🦶',
    title: 'Lautstark verscheuchen',
    rules: [
      'Stampfe abwechselnd links und rechts – dieselbe Seite zweimal lässt dich stolpern.',
      'Bei „📢 JETZT brüllen!“ gibt es einen Bonus, zu frühes Brüllen kostet Lärm.',
    ],
    controls: '← / → (oder A / D), Leertaste zum Brüllen – oder die Buttons',
    skill: 'strength',
  },
  'footprint-track': {
    icon: '👣',
    title: 'Spuren lesen',
    rules: [
      'Tippe jede Fußspur 👣 an, bevor ihr Ring verblasst – sonst verlierst du die Fährte.',
      'Falsche Tierspuren 🐾 kosten Zeit.',
    ],
    controls: 'Klicken / Tippen',
    skill: 'diplomacy',
  },
  'swipe-mash': {
    icon: '🔪',
    title: 'Durchs Unterholz brechen',
    rules: ['Halte die Maustaste gedrückt und schlage durch die Lianen 🌿.', 'Dornen 🌵 unbedingt auslassen!'],
    controls: 'Gedrückt halten und wischen',
    skill: 'strength',
  },
  balance: {
    icon: '🍌',
    title: 'Mit Früchten locken',
    rules: [
      'Halte den Früchtekorb unter dem wandernden Affen.',
      'Windböen werden kurz vorher angekündigt (💨) – gegensteuern!',
    ],
    controls: 'Maus / Finger seitlich bewegen',
    skill: 'diplomacy',
  },
  'coconut-throw': {
    icon: '🥥',
    title: 'Kokosnüsse werfen',
    rules: [
      'Die Kokosnuss fliegt eine Weile – wirf, kurz bevor der Affe über der Linie ist.',
      'Nur wenige Kokosnüsse: 3 Treffer nötig.',
    ],
    controls: 'Leertaste oder Button',
    skill: 'strength',
  },
  'dig-search': {
    icon: '🧭',
    title: 'Dem Bauchgefühl folgen',
    rules: [
      'Grabe nach dem Versteck. Jedes Loch zeigt, wie nah du bist (auch diagonal gezählt).',
      '🔥 direkt daneben · ♨️ 2 Felder · 🌤️ 3 Felder · ❄️ weiter weg',
    ],
    controls: 'Klicken / Tippen',
    skill: 'strength',
  },
  'pattern-scan': {
    icon: '📋',
    title: 'Systematisch absuchen',
    rules: [
      'Das Suchlicht geht Feld für Feld durch. Drück „Hier!“, wenn es den gesuchten Hinweis zeigt.',
      'Drei Hinweise in Folge, jedes Mal schneller. Falsch zugreifen kostet ein Leben.',
    ],
    controls: 'Leertaste oder Button',
    skill: 'diplomacy',
  },
  'rhythm-tap': {
    icon: '👏',
    title: 'Ä-Buff beruhigen',
    rules: [
      'Klatsche genau dann, wenn ein Schlag die Trefferzone erreicht.',
      'Gute Treffer beruhigen Ä-Buff, Klatschen außerhalb des Takts regt ihn auf.',
    ],
    controls: 'Leertaste, Klick auf die Bahn oder Button',
    skill: 'diplomacy',
  },
  'reaction-box': {
    icon: '🥊',
    title: 'Sich durchboxen',
    rules: [
      'Öffnet sich eine Lücke 🎯, kontere in genau diese Richtung.',
      'Grinst er 😏, ist es eine Finte – dann NICHT schlagen!',
    ],
    controls: '← ↑ → (oder A W D) – oder die Buttons',
    skill: 'strength',
  },
  'trophy-focus': {
    icon: '🏆',
    title: 'Trophäen bewundern',
    rules: [
      'Ä-Buff erzählt. Reagiere passend: 😮 bei Angeberei, 😔 bei traurigen Geschichten, 🤔 bei Fragen.',
      'Schnelle, passende Reaktionen heben seine Laune am meisten.',
    ],
    controls: 'Tasten 1 / 2 / 3 oder Buttons',
    skill: 'diplomacy',
  },
  'boast-mash': {
    icon: '⚔️',
    title: 'Kampfgeschichten überbieten',
    rules: [
      'Ä-Buff erzählt eine immer längere Folge von Heldentaten – spiel sie exakt nach.',
      'Jede Runde ein Schritt mehr und etwas schneller.',
    ],
    controls: 'Tasten 1–4 oder Buttons',
    skill: 'strength',
  },
  'calm-restraint': {
    icon: '🤚',
    title: 'Helix zurückhalten',
    rules: [
      'Helix drängt mal hierhin, mal dorthin. Halte die Gegenrichtung, damit er in der Mitte bleibt.',
      'Vorsicht vor dem Überkorrigieren – am Rand reißt er sich los.',
    ],
    controls: '← / → gedrückt halten (oder A / D) – oder Buttons halten',
    skill: 'diplomacy',
  },
  'reckless-posture': {
    icon: '💪',
    title: 'Groß aufplustern',
    rules: [
      'Halten lädt den Kraftmesser – immer schneller. Lass in der grünen Zone los.',
      'Drei Posen nötig; die Zone springt und wird schmaler.',
    ],
    controls: 'Leertaste oder Button halten',
    skill: 'strength',
  },
  'dance-battle': {
    icon: '💃',
    title: 'Tanzwettbewerb',
    rules: [
      'Drück den passenden Pfeil, wenn er die Trefferlinie erreicht.',
      'Schaffe mindestens so viele Schritte wie die Tänzerin des Dorfes.',
    ],
    controls: 'Pfeiltasten (oder A S W D) – oder die Buttons',
  },
  'domino-match': {
    icon: '🎲',
    title: 'Domino gegen Bilone & Bidate',
    rules: [
      'Lege Steine an eines der beiden offenen Enden. Passt keiner, ziehst du vom Stapel.',
      'Wer zuerst alle Steine los ist, gewinnt. Bei Blockade zählt die kleinere Augensumme.',
    ],
    controls: 'Klicken / Tippen',
    skill: 'diplomacy',
  },
  'anchor-heave': {
    icon: '⚓',
    title: 'Anker lichten',
    rules: [
      'Zieh die Kette nach oben – am besten auf dem Wellenkamm („HAU-RUCK!“).',
      'Im Wellental klemmt die Kette, und ohne Ziehen rutscht der Anker zurück.',
    ],
    controls: 'Nach oben wischen oder Leertaste / ↑',
    skill: 'strength',
  },
  'logic-puzzle': {
    icon: '🧩',
    title: 'Tempel-Mechanismus',
    rules: [
      'Bring die vier Drehringe auf die Symbolfolge der Tempelwand.',
      'Jeder Ring dreht seinen rechten Nachbarn mit (🔗). Die Züge sind begrenzt!',
    ],
    controls: 'Klicken / Tippen oder Tasten 1–4',
    skill: 'diplomacy',
  },
  'lever-heave': {
    icon: '🗿',
    title: 'Hebel mit Kraft bewegen',
    rules: [
      'Halten stemmt den Hebel, kostet aber Ausdauer. Loslassen erholt, doch der Hebel rutscht zurück.',
      'Bei „⚠️ Der Stein rutscht“ festhalten, sonst geht Fortschritt verloren.',
    ],
    controls: 'Leertaste oder Button halten',
    skill: 'strength',
  },
  'kayak-paddle': {
    icon: '🛶',
    title: 'Leise paddeln',
    rules: [
      'Abwechselnd links/rechts paddeln fährt geradeaus, dieselbe Seite lenkt dorthin.',
      'Felsen ⛰️ und Krokodilen 🐊 ausweichen, nicht hektisch paddeln – zu viel Lärm verrät euch.',
    ],
    controls: '← / → (oder A / D) – oder die Buttons',
    skill: 'diplomacy',
  },
};
