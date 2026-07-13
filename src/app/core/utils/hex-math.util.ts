import { HexCoordinates } from '../models/hex-tile.model';

/** Die 6 Richtungsvektoren im axialen Koordinatensystem (flat-top). */
const HEX_DIRECTIONS: HexCoordinates[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexEquals(a: HexCoordinates, b: HexCoordinates): boolean {
  return a.q === b.q && a.r === b.r;
}

export function hexNeighbors(coord: HexCoordinates): HexCoordinates[] {
  return HEX_DIRECTIONS.map((dir) => ({ q: coord.q + dir.q, r: coord.r + dir.r }));
}

/** Distanz zwischen zwei Hex-Feldern (Anzahl Schritte). */
export function hexDistance(a: HexCoordinates, b: HexCoordinates): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Alle Felder im Ring mit gegebenem Radius um ein Zentrum. */
export function hexRing(center: HexCoordinates, radius: number): HexCoordinates[] {
  if (radius === 0) return [center];
  const results: HexCoordinates[] = [];
  let current: HexCoordinates = {
    q: center.q + HEX_DIRECTIONS[4].q * radius,
    r: center.r + HEX_DIRECTIONS[4].r * radius,
  };
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(current);
      const dir = HEX_DIRECTIONS[i];
      current = { q: current.q + dir.q, r: current.r + dir.r };
    }
  }
  return results;
}

/** Alle Felder innerhalb eines Radius (inklusive Zentrum) — nützlich für Sichtweite. */
export function hexSpiral(center: HexCoordinates, radius: number): HexCoordinates[] {
  const results: HexCoordinates[] = [];
  for (let r = 0; r <= radius; r++) {
    results.push(...hexRing(center, r));
  }
  return results;
}

/** Wandelt axiale Koordinaten in Pixel-Mittelpunkte um (flat-top Hexagons). */
export function hexToPixel(coord: HexCoordinates, size: number): { x: number; y: number } {
  const x = size * ((3 / 2) * coord.q);
  const y = size * ((Math.sqrt(3) / 2) * coord.q + Math.sqrt(3) * coord.r);
  return { x, y };
}

/** SVG-Punkte für ein flat-top Hexagon an gegebenem Mittelpunkt. */
export function hexCorners(center: { x: number; y: number }, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    points.push(`${center.x + size * Math.cos(angle)},${center.y + size * Math.sin(angle)}`);
  }
  return points.join(' ');
}

interface CubeCoordinates {
  x: number;
  y: number;
  z: number;
}

export function axialToCube(coord: HexCoordinates): CubeCoordinates {
  const x = coord.q;
  const z = coord.r;
  const y = -x - z;
  return { x, y, z };
}

export function cubeToAxial(cube: CubeCoordinates): HexCoordinates {
  return { q: Math.round(cube.x), r: Math.round(cube.z) };
}

function cubeRound(cube: CubeCoordinates): CubeCoordinates {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const xDiff = Math.abs(rx - cube.x);
  const yDiff = Math.abs(ry - cube.y);
  const zDiff = Math.abs(rz - cube.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  return { x: rx, y: ry, z: rz };
}

/**
 * Zeichnet eine gerade Linie aus Hex-Feldern zwischen zwei Punkten
 * (klassischer Cube-Coordinate-Lerp-Algorithmus). Wird für den
 * Bucht-Kanal genutzt, der die Küste mit der inneren Bucht verbindet.
 */
export function hexLine(a: HexCoordinates, b: HexCoordinates): HexCoordinates[] {
  const distance = hexDistance(a, b);
  if (distance === 0) return [a];

  const cubeA = axialToCube(a);
  const cubeB = axialToCube(b);
  const results: HexCoordinates[] = [];

  for (let i = 0; i <= distance; i++) {
    const t = i / distance;
    const lerped: CubeCoordinates = {
      x: cubeA.x + (cubeB.x - cubeA.x) * t,
      y: cubeA.y + (cubeB.y - cubeA.y) * t,
      z: cubeA.z + (cubeB.z - cubeA.z) * t,
    };
    results.push(cubeToAxial(cubeRound(lerped)));
  }
  return results;
}
