import { BiomeType } from '../core/models/biome.enum';
import { HexTile, HexCoordinates, hexId } from '../core/models/hex-tile.model';
import {
  axialToCube,
  cubeToAxial,
  hexDistance,
  hexLine,
  hexNeighbors,
  hexRing,
  hexSpiral,
} from '../core/utils/hex-math.util';

/**
 * Einfacher, deterministisch-seedbarer Zufallsgenerator (mulberry32).
 * Damit ist jede Insel bei gleichem Seed reproduzierbar, aber ohne
 * expliziten Seed jedes Mal wirklich zufällig (Seed = Date.now()).
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CENTER: HexCoordinates = { q: 0, r: 0 };

/**
 * Erzeugt eine zufällige Insel:
 * - Äußerster Ring = Strand
 * - Eine Bucht schneidet als echter Kanal von der Küste bis zu einer
 *   kleinen Innen-Bucht ins Land (dort liegen Piratenschiff & -lager)
 * - Der Rest der Insel wird per Voronoi-artiger Zufallsverteilung in
 *   Dschungel/See/Berge/Dorf aufgeteilt (mehrere Zufalls-Ankerpunkte,
 *   jedes Feld gehört zum nächstgelegenen Ankerpunkt)
 * - Landestelle liegt auf der der Bucht gegenüberliegenden Küstenseite
 *
 * Gibt sowohl die Tiles als auch die vorgeschlagene Landestelle zurück,
 * damit das Duo nie versehentlich mitten in der Piratenbucht strandet.
 */
export function generateIslandTiles(
  radius: number,
  seed: number = Date.now(),
): { tiles: HexTile[]; landingSpot: HexCoordinates } {
  const rng = mulberry32(seed);
  const allCoords = hexSpiral(CENTER, radius);

  // 1. Bucht-Mündung zufällig auf dem Küstenring wählen, Landestelle gegenüber.
  const ring = hexRing(CENTER, radius);
  const mouthIndex = Math.floor(rng() * ring.length);
  const bayMouth = ring[mouthIndex];
  const landingSpot = ring[(mouthIndex + Math.floor(ring.length / 2)) % ring.length];

  // 2. Kanal von der Mündung zu einer Innen-Bucht berechnen (Cube-Lerp = gerade Linie).
  const coveDistance = Math.max(2, Math.round(radius * 0.45));
  const mouthCube = axialToCube(bayMouth);
  const centerCube = axialToCube(CENTER);
  const t = 1 - coveDistance / radius;
  const cove = cubeToAxial({
    x: mouthCube.x + (centerCube.x - mouthCube.x) * t,
    y: mouthCube.y + (centerCube.y - mouthCube.y) * t,
    z: mouthCube.z + (centerCube.z - mouthCube.z) * t,
  });

  const bayTileSet = new Set<string>(hexLine(bayMouth, cove).map(hexId));
  // Innere Bucht etwas verbreitern, damit dort Platz für Schiff + Lager ist.
  for (const neighbor of hexNeighbors(cove)) {
    if (hexDistance(CENTER, neighbor) <= radius) {
      bayTileSet.add(hexId(neighbor));
    }
  }

  // 3. Restliche Felder per Zufalls-Ankerpunkten (Voronoi-artig) verteilen.
  const interiorCoords = allCoords.filter(
    (c) => hexDistance(CENTER, c) < radius && !bayTileSet.has(hexId(c)),
  );

  // Wichtig: EIN gemeinsamer, schrumpfender Pool für alle Biome-Ankerpunkte,
  // damit niemals zwei Gruppen (z.B. Dschungel und Dorf) denselben Punkt
  // bekommen – sonst würde die zuerst geprüfte Gruppe die andere bei jedem
  // Unentschieden verdecken und ein ganzes Biom könnte komplett verschwinden.
  const seedPool = [...interiorCoords];
  const pickRandomSeeds = (count: number): HexCoordinates[] => {
    const picked: HexCoordinates[] = [];
    for (let i = 0; i < count && seedPool.length > 0; i++) {
      const idx = Math.floor(rng() * seedPool.length);
      picked.push(seedPool.splice(idx, 1)[0]);
    }
    return picked;
  };

  const seedGroups: Array<{ biome: BiomeType; points: HexCoordinates[] }> = [
    { biome: BiomeType.Jungle, points: pickRandomSeeds(3) },
    { biome: BiomeType.Lake, points: pickRandomSeeds(1) },
    { biome: BiomeType.Mountain, points: pickRandomSeeds(2) },
    { biome: BiomeType.Village, points: pickRandomSeeds(1) },
  ];

  const nearestBiome = (coord: HexCoordinates): BiomeType => {
    let best: BiomeType = BiomeType.Jungle;
    let bestDist = Infinity;
    for (const group of seedGroups) {
      for (const point of group.points) {
        const d = hexDistance(coord, point);
        if (d < bestDist) {
          bestDist = d;
          best = group.biome;
        }
      }
    }
    return best;
  };

  const tiles: HexTile[] = allCoords.map((coord) => {
    const distance = hexDistance(CENTER, coord);
    let biome: BiomeType;

    if (bayTileSet.has(hexId(coord))) {
      biome = BiomeType.Bay; // auch an der Mündung im Küstenring -> "bricht" den Strand auf
    } else if (distance === radius) {
      biome = BiomeType.Beach;
    } else {
      biome = nearestBiome(coord);
    }

    return {
      id: hexId(coord),
      coordinates: coord,
      biome,
      discoveryStatus: 'hidden',
      visionBonus: biome === BiomeType.Mountain ? 2 : 0,
    };
  });

  attachSpecialPlacesAndEvents(tiles, cove, landingSpot);
  return { tiles, landingSpot };
}

/** Setzt feste Events/Interactables auf thematisch passende, jetzt zufällig platzierte Felder. */
function attachSpecialPlacesAndEvents(tiles: HexTile[], cove: HexCoordinates, landingSpot: HexCoordinates): void {
  const byId = new Map(tiles.map((t) => [t.id, t]));

  // Piratenschiff (still, unbemannt) + verstecktes Lager mit Bilone & Bidate in der Bucht.
  const shipTile = byId.get(hexId(cove));
  const campTile =
    hexNeighbors(cove)
      .map((c) => byId.get(hexId(c)))
      .find((t): t is HexTile => !!t && t.biome === BiomeType.Bay && t !== shipTile) ??
    tiles.find((t) => t.biome === BiomeType.Bay && t !== shipTile);

  if (shipTile) {
    shipTile.interactable = {
      id: 'pirate-ship',
      type: 'ship',
      name: 'Verlassenes Piratenschiff',
      description: 'Leer und still – ohne Mannschaft bringt dieses Schiff niemanden von der Insel.',
    };
    // Erst mit Mannschaft, Kajak-Hinweis und Schatz im Gepäck wird das Schiff zum Finale-Ort.
    shipTile.adventureTrigger = 'finale-escape';
  }
  if (campTile && campTile !== shipTile) {
    campTile.interactable = {
      id: 'pirate-camp',
      type: 'pirate_camp',
      name: 'Verstecktes Piratenlager',
      description: 'Zwischen den Klippen lugt ein Lagerfeuer hervor – und zwei wachsame Gestalten davor.',
    };
    campTile.adventureTrigger = 'pirate-bay';
  }

  // Dorf: der Dorf-Ankerpunkt selbst.
  const villageTile = tiles.find((t) => t.biome === BiomeType.Village);
  if (villageTile) {
    villageTile.interactable = {
      id: 'native-village',
      type: 'village',
      name: 'Eingeborenendorf',
      description: 'Rauch steigt zwischen den Hütten auf – hier lebt jemand.',
    };
    villageTile.adventureTrigger = 'native-village';
  }

  // Berge: der am weitesten vom Zentrum entfernte wird zum Aussichtspunkt, ein anderer zur Höhle.
  const mountainTiles = tiles
    .filter((t) => t.biome === BiomeType.Mountain)
    .sort((a, b) => hexDistance(CENTER, b.coordinates) - hexDistance(CENTER, a.coordinates));

  const mountainPeak = mountainTiles[0];
  if (mountainPeak) {
    mountainPeak.interactable = {
      id: 'viewpoint',
      type: 'viewpoint',
      name: 'Gipfel-Aussichtspunkt',
      description: 'Von hier oben sieht man einen guten Teil der Insel.',
      dialogueSceneId: 'mountain-viewpoint',
    };
    mountainPeak.visionBonus = 3;
  }

  const caveTile = mountainTiles.find((t) => t !== mountainPeak);
  if (caveTile) {
    caveTile.interactable = {
      id: 'castaway-cave',
      type: 'cave',
      name: 'Dunkle Höhle',
      description: 'Aus dem Inneren hallt rhythmisches Schnauben und Schattenboxen wider.',
    };
    caveTile.adventureTrigger = 'cave-of-e-buff';
  }

  // Raschel-Tier: der nächstgelegene Dschungel-Rand zur Landestelle (erster Schritt ins Grün).
  const jungleTiles = tiles.filter((t) => t.biome === BiomeType.Jungle);
  const rustlingTile = [...jungleTiles].sort(
    (a, b) => hexDistance(landingSpot, a.coordinates) - hexDistance(landingSpot, b.coordinates),
  )[0];
  if (rustlingTile) {
    rustlingTile.adventureTrigger = 'rustling-creature';
  }

  // Affen: ein Dschungel-Feld spürbar weiter von der Landestelle entfernt -> erfordert echtes Erkunden.
  const monkeyCandidates = jungleTiles.filter((t) => t.id !== rustlingTile?.id);
  const monkeyTile = [...monkeyCandidates].sort(
    (a, b) => hexDistance(landingSpot, b.coordinates) - hexDistance(landingSpot, a.coordinates),
  )[0];
  if (monkeyTile) {
    monkeyTile.adventureTrigger = 'monkey-heist';
  }

  // Tempelruine: tief im Inselinneren (größte Distanz zum Zentrum unter den verbliebenen Dschungelfeldern).
  const templeCandidates = jungleTiles.filter((t) => t.id !== rustlingTile?.id && t.id !== monkeyTile?.id);
  const templeTile = [...templeCandidates].sort(
    (a, b) => hexDistance(CENTER, b.coordinates) - hexDistance(CENTER, a.coordinates),
  )[0];
  if (templeTile) {
    templeTile.interactable = {
      id: 'temple-ruin',
      type: 'temple',
      name: 'Überwucherte Tempelruine',
      description: 'Von Ranken überwuchert, aber die Steinquader wirken zu gerade für einen Zufall.',
    };
    templeTile.adventureTrigger = 'lost-treasure';
  }

  // Ambiente-Events auf weiteren Feldern.
  const lakeTile = tiles.find((t) => t.biome === BiomeType.Lake);
  if (lakeTile) {
    lakeTile.event = {
      id: 'lake-splash',
      title: 'Etwas im Wasser',
      description: 'Die Wasseroberfläche kräuselt sich verdächtig...',
      triggerOnce: true,
      triggered: false,
      dialogueSceneId: 'lake-monster-tease',
    };
  }

  const jungleTeaseTile = jungleTiles.find(
    (t) => t.id !== rustlingTile?.id && t.id !== monkeyTile?.id && t.id !== templeTile?.id,
  );
  if (jungleTeaseTile) {
    jungleTeaseTile.event = {
      id: 'jungle-trap',
      title: 'Verdächtiges Rascheln',
      description: 'Irgendetwas hat sich hier bewegt, kurz bevor ihr ankamt.',
      triggerOnce: true,
      triggered: false,
      dialogueSceneId: 'jungle-danger-tease',
    };
  }
}
