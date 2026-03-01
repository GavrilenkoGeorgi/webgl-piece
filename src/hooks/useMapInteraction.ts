import { useCallback } from "react";
import { useMapStore } from "../stores/mapStore";
import type { GeoFeature } from "../types";

interface PickInfo {
  object?: GeoFeature;
  x: number;
  y: number;
}

/**
 * Hook encapsulating deck.gl interaction handlers.
 * Uses Zustand store directly to avoid re-render cascades in animation frames.
 */
export function useMapInteraction() {
  const selectFeature = useMapStore((s) => s.selectFeature);

  const handleClick = useCallback(
    (info: PickInfo) => {
      if (info.object) {
        selectFeature(info.object.properties.id);
      } else {
        selectFeature(null);
      }
    },
    [selectFeature],
  );

  const handleHover = useCallback((_info: PickInfo) => {
    // Placeholder for hover tooltip logic
  }, []);

  return { handleClick, handleHover };
}
