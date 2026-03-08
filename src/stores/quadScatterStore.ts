import { create } from "zustand";

interface QuadScatterStoreState {
  /** Number of points per cluster (total = this × 4) */
  pointsPerCluster: number;
  /** Spread radius of points within each cluster (5-500) */
  clusterSpread: number;
  /** Distance of each cluster centre from origin (10-400) */
  centerOffset: number;
  /** Point size in pixels (2-20) */
  pointSize: number;
  /** Incrementing seed to force data regeneration */
  seed: number;
  setPointsPerCluster: (count: number) => void;
  setClusterSpread: (spread: number) => void;
  setCenterOffset: (offset: number) => void;
  setPointSize: (size: number) => void;
  regenerate: () => void;
}

export const useQuadScatterStore = create<QuadScatterStoreState>((set) => ({
  pointsPerCluster: 500,
  clusterSpread: 150,
  centerOffset: 120,
  pointSize: 4,
  seed: 0,

  setPointsPerCluster: (count) =>
    set((state) => ({
      pointsPerCluster: Math.max(25, Math.min(50_000, count)),
      seed: state.seed + 1,
    })),

  setClusterSpread: (spread) =>
    set({
      clusterSpread: Math.max(5, Math.min(500, spread)),
    }),

  setCenterOffset: (offset) =>
    set({
      centerOffset: Math.max(10, Math.min(400, offset)),
    }),

  setPointSize: (size) =>
    set({
      pointSize: Math.max(2, Math.min(20, size)),
    }),

  regenerate: () => set((state) => ({ seed: state.seed + 1 })),
}));
