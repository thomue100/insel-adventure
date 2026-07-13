/**
 * Die aktuell verfügbaren Minigame-Typen.
 * - 'focus-hold' / 'click-mash': Raschel-Tier-Tutorial
 * - 'balance' / 'coconut-throw': Affen, Schritt 2 (Konfrontation)
 * - 'footprint-track' / 'swipe-mash': Affen, Schritt 1 (Spurensuche)
 * - 'dig-search' / 'pattern-scan': Affen, Schritt 3 (Versteck finden)
 * - 'rhythm-tap' / 'reaction-box': Ä-Buff, Boxkampf-Herausforderung
 * - 'trophy-focus' / 'boast-mash': Ä-Buff, Schritt 2 (Vertrauen gewinnen) –
 *   nutzen bewusst dieselbe Mechanik wie 'focus-hold'/'click-mash' mit neuer
 *   Beschriftung, da inhaltlich passend (ruhig bleiben / Konkurrenz-Prahlen).
 * - 'calm-restraint' / 'reckless-posture': Dorf, Schritt 1 (Konfrontation) –
 *   ebenfalls Wiederverwendung von 'focus-hold'/'click-mash'.
 * - 'dance-battle': Dorf, Schritt 2 (Tanzwettbewerb) – Pfeiltasten-Rhythmusspiel.
 * - 'domino-match': Piraten-Bucht, Seeleute anwerben (Domino gegen Bilone & Bidate).
 * - 'anchor-heave': Piraten-Bucht, Schiff kapern (Anker lichten) – Wiederverwendung
 *   von 'click-mash' mit neuer Beschriftung.
 * - 'logic-puzzle' / 'lever-heave': Verlorener Königsschatz, Tempel-Mechanismus.
 * - 'kayak-paddle': Finale, Kajak über die Bucht paddeln – Wiederverwendung
 *   von 'rhythm-tap' mit neuer Beschriftung.
 */
export type MinigameType =
  | 'focus-hold'
  | 'click-mash'
  | 'balance'
  | 'coconut-throw'
  | 'footprint-track'
  | 'swipe-mash'
  | 'dig-search'
  | 'pattern-scan'
  | 'rhythm-tap'
  | 'reaction-box'
  | 'trophy-focus'
  | 'boast-mash'
  | 'calm-restraint'
  | 'reckless-posture'
  | 'dance-battle'
  | 'domino-match'
  | 'anchor-heave'
  | 'logic-puzzle'
  | 'lever-heave'
  | 'kayak-paddle';
