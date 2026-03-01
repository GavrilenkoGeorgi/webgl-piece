import { create } from "zustand";
import type { MapViewState } from "../types";
import { DEFAULT_VIEW_STATE } from "../utils/constants";

interface MapStoreState {
  viewState: MapViewState;
  selectedFeatureId: string | null;
  updateViewState: (viewState: Partial<MapViewState>) => void;
  selectFeature: (id: string | null) => void;
}

export const useMapStore = create<MapStoreState>((set) => ({
  viewState: DEFAULT_VIEW_STATE,
  selectedFeatureId: null,

  updateViewState: (viewState) =>
    set((state) => ({
      viewState: { ...state.viewState, ...viewState },
    })),

  selectFeature: (id) => set({ selectedFeatureId: id }),
}));
