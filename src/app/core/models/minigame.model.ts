/**
 * Alle Minigame-Typen. Jeder Typ hat eine eigene Mechanik in
 * features/minigame-overlay/games/*.game.ts; Titel, Regeln, Steuerung und
 * der passende Skill stehen in data/minigames.data.ts.
 *
 * Raschel-Tier:   'focus-hold' (Gebüsch verfolgen + stillhalten) · 'click-mash' (Stampf-Rhythmus + Brüllen)
 * Affen 1:        'footprint-track' (verblassende Fährte, Täuschspuren) · 'swipe-mash' (Lianen schlagen, Dornen meiden)
 * Affen 2:        'balance' (Korb an der Feder, Windböen) · 'coconut-throw' (Vorhalten, begrenzte Munition)
 * Affen 3:        'dig-search' (Heiß-kalt-Graben) · 'pattern-scan' (Suchlicht, 3 Hinweise)
 * Ä-Buff 1:       'rhythm-tap' (Rhythmusspiel, Tempo sinkt) · 'reaction-box' (Richtungs-Konter, Finten)
 * Ä-Buff 2:       'trophy-focus' (passend auf Geschichten reagieren) · 'boast-mash' (Simon-Says)
 * Dorf 1:         'calm-restraint' (Gegenhalten/Tauziehen) · 'reckless-posture' (Kraftmesser, 3 Posen)
 * Dorf 2:         'dance-battle' (4-Bahnen-Tanzspiel gegen Rivalin)
 * Königsschatz:   'logic-puzzle' (gekoppelte Drehringe) · 'lever-heave' (Ausdauer-Hebel)
 * Piraten-Bucht:  'domino-match' (echte Domino-Partie)
 * Finale:         'kayak-paddle' (Paddeln/Lenken, Lärm) · 'anchor-heave' (Ziehen im Wellentakt)
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
