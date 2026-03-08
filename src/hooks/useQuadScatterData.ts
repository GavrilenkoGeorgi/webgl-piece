import { useMemo } from "react";
import type { ScatterPoint } from "../types";

/** Four distinct cluster colours */
const CLUSTER_COLORS: [number, number, number][] = [
  [65, 182, 196], // Cyan
  [254, 178, 76], // Orange
  [44, 162, 95], // Green
  [240, 59, 32], // Red
];

/** Label for each cluster */
export const CLUSTER_LABELS = [
  "Cluster A",
  "Cluster B",
  "Cluster C",
  "Cluster D",
] as const;

/**
 * Computes the four cluster centres from a single offset value.
 * Each cluster sits in a different octant so they partially overlap.
 */
function quadrantCentres(offset: number): [number, number, number][] {
  return [
    [-offset, -offset, -offset],
    [offset, -offset, offset],
    [-offset, offset, offset],
    [offset, offset, -offset],
  ];
}

/**
 * Box–Muller transform: returns a normally-distributed random value
 * with mean 0 and standard deviation 1.
 */
function randNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // avoid log(0)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Returns a random 3D point with Gaussian distribution (σ = radius / 3).
 * ~68 % of points fall within radius/3 of the centre,
 * ~95 % within 2σ, giving a dense core that fades toward the edges.
 */
function randomInSphere(radius: number): [number, number, number] {
  const sigma = radius / 3;
  return [randNormal() * sigma, randNormal() * sigma, randNormal() * sigma];
}

/**
 * Generates 4 spherical point clouds, each centred at a different
 * quadrant so they partially intersect.
 */
function generateQuadClusters(
  pointsPerCluster: number,
  spread: number,
  centerOffset: number,
): ScatterPoint[] {
  const total = pointsPerCluster * 4;
  const points: ScatterPoint[] = new Array(total);
  const centres = quadrantCentres(centerOffset);

  for (let q = 0; q < 4; q++) {
    const [cx, cy, cz] = centres[q];
    const color = CLUSTER_COLORS[q];

    for (let i = 0; i < pointsPerCluster; i++) {
      const idx = q * pointsPerCluster + i;
      const [dx, dy, dz] = randomInSphere(spread / 2);
      points[idx] = {
        id: idx,
        x: cx + dx,
        y: cy + dy,
        z: cz + dz,
        color: [color[0], color[1], color[2], 200],
        radius: 2 + Math.random() * 4,
      };
    }
  }

  return points;
}

/**
 * Hook that generates and memoises 4 clustered point clouds.
 * Data regenerates only when `pointsPerCluster`, `spread`, or `seed` changes.
 */
export function useQuadScatterData(
  pointsPerCluster: number,
  spread: number,
  centerOffset: number,
  seed = 0,
) {
  const data = useMemo(
    () => generateQuadClusters(pointsPerCluster, spread, centerOffset),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pointsPerCluster, spread, centerOffset, seed],
  );

  return { data, totalPoints: data.length };
}
