import { create } from "zustand";

interface ScatterStoreState {
  pointCount: number;
  /** Point size in pixels (2-20) */
  pointSize: number;
  /** Incrementing seed to force data regeneration at the same point count */
  seed: number;
  setPointCount: (count: number) => void;
  setPointSize: (size: number) => void;
  regenerate: () => void;
}

export const useScatterStore = create<ScatterStoreState>((set) => ({
  pointCount: 1000,
  pointSize: 4,
  seed: 0,

  setPointCount: (count) =>
    set((state) => ({
      pointCount: Math.max(100, Math.min(200_000, count)),
      seed: state.seed + 1,
    })),

  setPointSize: (size) =>
    set({
      pointSize: Math.max(2, Math.min(20, size)),
    }),

  regenerate: () => set((state) => ({ seed: state.seed + 1 })),
}));
