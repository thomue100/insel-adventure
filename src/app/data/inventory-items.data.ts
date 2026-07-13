import { InventoryItem } from '../core/models/inventory.model';

export const INVENTORY_ITEMS: Record<string, InventoryItem> = {
  compass: {
    id: 'compass',
    name: 'Schiffskompass',
    description: 'Stammt aus der Ausrüstung der „Wappen von Herford" – leicht verrostet, aber die Nadel zittert immerhin in eine Richtung.',
    icon: '🧭',
  },
  provisions: {
    id: 'provisions',
    name: 'Geretteter Proviant',
    description: 'Ebenfalls aus der Schiffsausrüstung – etwas angeknabbert von den Affen, aber noch essbar. Wahrscheinlich.',
    icon: '🍞',
  },
  castawayMap: {
    id: 'castawayMap',
    name: 'Ä-Buffs Insel-Skizze',
    description: 'Grob aus dem Gedächtnis gezeichnet, aber überraschend genau – zeigt versteckte Wege quer über die Insel.',
    icon: '🗺️',
  },
  kayakHint: {
    id: 'kayakHint',
    name: 'Hinweis auf Kajak Ova',
    description: 'Eine mündlich überlieferte Wegbeschreibung – zeigt, wo das legendäre Kajak „Ova" versteckt liegt.',
    icon: '🛶',
  },
  crew: {
    id: 'crew',
    name: 'Mannschaft',
    description: 'Bilone, Bidate und ihre Leute – überzeugt durch ein Dominospiel, bereit, das Schiff zu segeln.',
    icon: '👥',
  },
  royalTreasure: {
    id: 'royalTreasure',
    name: 'Königsschatz',
    description: 'Endlich gefunden – genau der Grund, warum diese ganze Reise überhaupt begann.',
    icon: '💰',
  },
};
