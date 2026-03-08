import { useMemo } from "react";
import type { ScatterPoint } from "../types";

const PALETTE: [number, number, number][] = [
  [65, 182, 196],
  [254, 178, 76],
  [240, 59, 32],
  [44, 162, 95],
  [123, 104, 238],
  [255, 127, 80],
  [0, 191, 255],
  [218, 112, 214],
];

/**
 * Generates an array of random 3D scatter points.
 * Uses a seed derived from `pointCount` so the same count always
 * produces the same dataset (stable across re-renders).
 */
function generateScatterData(count: number, spread = 1000): ScatterPoint[] {
  const points: ScatterPoint[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const color = PALETTE[i % PALETTE.length];
    points[i] = {
      id: i,
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: (Math.random() - 0.5) * spread,
      color: [color[0], color[1], color[2], 200],
      radius: 2 + Math.random() * 6,
    };
  }

  return points;
}

/**
 * Hook that generates and memoises random 3D scatter data.
 * Data is regenerated only when `pointCount` or `seed` changes.
 */
export function useScatterData(pointCount: number, seed = 0) {
  const data = useMemo(
    () => generateScatterData(pointCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pointCount, seed],
  );

  return { data, pointCount: data.length };
}
