import { AdventureDefinition } from '../core/models/adventure.model';
import { INVENTORY_ITEMS } from './inventory-items.data';

export const ADVENTURE_DEFINITIONS: AdventureDefinition[] = [
  {
    id: 'rustling-creature',
    order: 0,
    title: 'Das Raschel-Tier',
    introDialogueSceneId: 'rustling-creature-intro',
    requiresCompletedCount: 0,
    countsTowardProgress: false, // Tutorial – zählt nicht zum 4er-Fortschritt, liefert kein Item
    steps: [
      {
        id: 'confrontation',
        choices: [
          {
            id: 'stay-quiet',
            label: '🤫 Ruhig bleiben und beobachten',
            minigame: 'focus-hold',
            outcomeDialogueSceneId: 'rustling-creature-diplomacy-outcome',
            fallbackDialogueSceneId: 'rustling-creature-diplomacy-fallback',
          },
          {
            id: 'scare-it-off',
            label: '📢 Lautstark verscheuchen',
            minigame: 'click-mash',
            outcomeDialogueSceneId: 'rustling-creature-strength-outcome',
            fallbackDialogueSceneId: 'rustling-creature-strength-fallback',
          },
        ],
      },
    ],
  },

  {
    id: 'monkey-heist',
    order: 1,
    title: 'Der Raub durch die Affen',
    introDialogueSceneId: 'monkey-heist-intro',
    requiresCompletedCount: 0,
    steps: [
      // Schritt 1: Spurensuche
      {
        id: 'tracking',
        introDialogueSceneId: 'monkey-heist-step1-intro',
        choices: [
          {
            id: 'track-careful',
            label: '🔍 Vorsichtig den Spuren folgen',
            minigame: 'footprint-track',
            outcomeDialogueSceneId: 'monkey-heist-step1-diplomacy-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step1-diplomacy-fallback',
          },
          {
            id: 'track-force',
            label: '💪 Kraftvoll durchs Unterholz brechen',
            minigame: 'swipe-mash',
            outcomeDialogueSceneId: 'monkey-heist-step1-strength-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step1-strength-fallback',
          },
        ],
      },
      // Schritt 2: Erste Konfrontation
      {
        id: 'confrontation',
        introDialogueSceneId: 'monkey-heist-step2-intro',
        choices: [
          {
            id: 'fruit-diplomacy',
            label: '🍌 Mit Früchten locken',
            minigame: 'balance',
            outcomeDialogueSceneId: 'monkey-heist-step2-diplomacy-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step2-diplomacy-fallback',
          },
          {
            id: 'throw-coconuts',
            label: '🥥 Mit Kokosnüssen bewerfen',
            minigame: 'coconut-throw',
            outcomeDialogueSceneId: 'monkey-heist-step2-strength-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step2-strength-fallback',
          },
        ],
      },
      // Schritt 3: Das Versteck finden
      {
        id: 'hideout',
        introDialogueSceneId: 'monkey-heist-step3-intro',
        choices: [
          {
            id: 'follow-instinct',
            label: '🧭 Dem Bauchgefühl folgen',
            minigame: 'dig-search',
            outcomeDialogueSceneId: 'monkey-heist-step3-strength-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step3-strength-fallback',
            rewardItems: [INVENTORY_ITEMS['compass'], INVENTORY_ITEMS['provisions']],
          },
          {
            id: 'search-systematic',
            label: '📋 Systematisch das Gebiet absuchen',
            minigame: 'pattern-scan',
            outcomeDialogueSceneId: 'monkey-heist-step3-diplomacy-outcome',
            fallbackDialogueSceneId: 'monkey-heist-step3-diplomacy-fallback',
            rewardItems: [INVENTORY_ITEMS['compass'], INVENTORY_ITEMS['provisions']],
          },
        ],
      },
    ],
  },

  {
    id: 'cave-of-e-buff',
    order: 2,
    title: 'Die Höhle des Ä-Buff',
    introDialogueSceneId: 'cave-of-e-buff-intro',
    // Erst zugänglich, wenn die Affen-Sache erledigt ist (hält die Akt-Reihenfolge ein).
    requiresCompletedCount: 1,
    steps: [
      // Schritt 1: Die Box-Herausforderung
      {
        id: 'challenge',
        introDialogueSceneId: 'cave-step1-intro',
        choices: [
          {
            id: 'talk-him-down',
            label: '🗣️ Ä-Buff beruhigen',
            minigame: 'rhythm-tap',
            outcomeDialogueSceneId: 'cave-step1-diplomacy-outcome',
            fallbackDialogueSceneId: 'cave-step1-diplomacy-fallback',
          },
          {
            id: 'box-him',
            label: '🥊 Sich durchboxen',
            minigame: 'reaction-box',
            outcomeDialogueSceneId: 'cave-step1-strength-outcome',
            fallbackDialogueSceneId: 'cave-step1-strength-fallback',
          },
        ],
      },
      // Schritt 2: Vertrauen gewinnen, bevor er sein Wissen teilt
      {
        id: 'trust',
        introDialogueSceneId: 'cave-step2-intro',
        choices: [
          {
            id: 'flatter-trophies',
            label: '🏆 Seine Box-Trophäen bewundern',
            minigame: 'trophy-focus',
            outcomeDialogueSceneId: 'cave-step2-diplomacy-outcome',
            fallbackDialogueSceneId: 'cave-step2-diplomacy-fallback',
            rewardItems: [INVENTORY_ITEMS['castawayMap']],
          },
          {
            id: 'trade-war-stories',
            label: '⚔️ Eigene Kampfgeschichten austauschen',
            minigame: 'boast-mash',
            outcomeDialogueSceneId: 'cave-step2-strength-outcome',
            fallbackDialogueSceneId: 'cave-step2-strength-fallback',
            rewardItems: [INVENTORY_ITEMS['castawayMap']],
          },
        ],
      },
    ],
  },

  // Platzhalter für den letzten Akt.
  {
    id: 'native-village',
    order: 3,
    title: 'Das Eingeborenen-Dorf',
    introDialogueSceneId: 'native-village-intro',
    requiresCompletedCount: 2,
    steps: [
      // Schritt 1: Helix will angreifen, Laja muss vermitteln
      {
        id: 'confrontation',
        introDialogueSceneId: 'native-village-step1-intro',
        choices: [
          {
            id: 'restrain-helix',
            label: '🤚 Helix zurückhalten',
            minigame: 'calm-restraint',
            outcomeDialogueSceneId: 'native-village-step1-diplomacy-outcome',
            fallbackDialogueSceneId: 'native-village-step1-diplomacy-fallback',
          },
          {
            id: 'let-him-posture',
            label: '💢 Helix gewähren lassen',
            minigame: 'reckless-posture',
            outcomeDialogueSceneId: 'native-village-step1-strength-outcome',
            fallbackDialogueSceneId: 'native-village-step1-strength-fallback',
          },
        ],
      },
      // Schritt 2: Der Tanzwettbewerb (statt Kampf)
      {
        id: 'dance-off',
        introDialogueSceneId: 'native-village-step2-intro',
        choices: [
          {
            id: 'dance-battle-attempt',
            label: '💃 Am Tanzwettbewerb teilnehmen',
            minigame: 'dance-battle',
            outcomeDialogueSceneId: 'native-village-step2-outcome',
            fallbackDialogueSceneId: 'native-village-step2-fallback',
            rewardItems: [INVENTORY_ITEMS['kayakHint']],
          },
        ],
      },
    ],
  },
  {
    id: 'lost-treasure',
    order: 4,
    title: 'Der verlorene Königsschatz',
    introDialogueSceneId: 'lost-treasure-intro',
    requiresCompletedCount: 3,
    steps: [
      // Ein Schritt, eine Wahl: Logik-Rätsel vs. Hebel-Kraftakt
      {
        id: 'temple-mechanism',
        introDialogueSceneId: 'lost-treasure-step1-intro',
        choices: [
          {
            id: 'solve-mechanism',
            label: '🧩 Den Mechanismus entschlüsseln',
            minigame: 'logic-puzzle',
            outcomeDialogueSceneId: 'lost-treasure-outcome-logic',
            fallbackDialogueSceneId: 'lost-treasure-fallback-logic',
            rewardItems: [INVENTORY_ITEMS['royalTreasure']],
          },
          {
            id: 'force-lever',
            label: '🪨 Den Hebel mit Kraft bewegen',
            minigame: 'lever-heave',
            outcomeDialogueSceneId: 'lost-treasure-outcome-lever',
            fallbackDialogueSceneId: 'lost-treasure-fallback-lever',
            rewardItems: [INVENTORY_ITEMS['royalTreasure']],
          },
        ],
      },
    ],
  },
  {
    id: 'pirate-bay',
    order: 5,
    title: 'Die Piraten-Bucht',
    introDialogueSceneId: 'pirate-bay-intro',
    requiresCompletedCount: 4,
    steps: [
      // Einziger Schritt: Seeleute anwerben – Bilone und Bidate verlangen ein Domino-Spiel.
      // Das Schiff selbst bleibt bis zum Finale unbemannt (siehe 'finale-escape').
      {
        id: 'recruit-sailors',
        introDialogueSceneId: 'pirate-bay-step1-intro',
        choices: [
          {
            id: 'domino-challenge',
            label: '🁢 Das Domino-Spiel annehmen',
            minigame: 'domino-match',
            outcomeDialogueSceneId: 'pirate-bay-step1-outcome',
            fallbackDialogueSceneId: 'pirate-bay-step1-fallback',
            rewardItems: [INVENTORY_ITEMS['crew']],
          },
        ],
      },
    ],
  },
  {
    id: 'finale-escape',
    order: 6,
    title: 'Flucht von der Insel',
    introDialogueSceneId: 'finale-escape-intro',
    requiresCompletedCount: 5,
    steps: [
      // Schritt 1: Mit dem Kajak Ova unbemerkt über die Bucht
      {
        id: 'row-kayak',
        introDialogueSceneId: 'finale-step1-intro',
        choices: [
          {
            id: 'paddle-kayak',
            label: '🛶 Leise über die Bucht paddeln',
            minigame: 'kayak-paddle',
            outcomeDialogueSceneId: 'finale-step1-outcome',
            fallbackDialogueSceneId: 'finale-step1-fallback',
          },
        ],
      },
      // Schritt 2: Mit der Mannschaft das Schiff übernehmen und ablegen
      {
        id: 'seize-ship',
        introDialogueSceneId: 'finale-step2-intro',
        choices: [
          {
            id: 'anchor-heave',
            label: '⚓ Anker lichten und ablegen',
            minigame: 'anchor-heave',
            outcomeDialogueSceneId: 'finale-step2-outcome',
            fallbackDialogueSceneId: 'finale-step2-fallback',
          },
        ],
      },
    ],
  },
];
