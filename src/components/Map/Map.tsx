import { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map as MapLibreMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMapStore } from "../../stores/mapStore";
import { useMapData } from "../../hooks/useMapData";
import { useMapInteraction } from "../../hooks/useMapInteraction";
import { useFpsMonitor } from "../../hooks/useFpsMonitor";
import { LAYER_IDS } from "../../utils/constants";
import styles from "./Map.module.css";

const MAPLIBRE_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  residential: [65, 182, 196],
  commercial: [254, 178, 76],
  industrial: [240, 59, 32],
  parks: [44, 162, 95],
  infrastructure: [123, 104, 238],
};

export default function MapView() {
  const viewState = useMapStore((s) => s.viewState);
  const selectedFeatureId = useMapStore((s) => s.selectedFeatureId);
  const updateViewState = useMapStore((s) => s.updateViewState);
  const { handleClick } = useMapInteraction();
  const fps = useFpsMonitor(500);

  const { data: response, isLoading, isError, error } = useMapData();

  const layers = useMemo(() => {
    if (!response?.data) return [];

    return [
      new GeoJsonLayer({
        id: LAYER_IDS.POINTS,
        data: response.data,
        pickable: true,
        stroked: true,
        filled: true,
        pointRadiusMinPixels: 6,
        pointRadiusMaxPixels: 20,
        getPointRadius: (d) => {
          const props = (d as unknown as { properties: { value: number } })
            .properties;
          return Math.sqrt(props.value) * 2;
        },
        getFillColor: (d) => {
          const props = (
            d as unknown as { properties: { id: string; category: string } }
          ).properties;
          const base = CATEGORY_COLORS[props.category] ?? [128, 128, 128];
          const isSelected = props.id === selectedFeatureId;
          return isSelected
            ? ([255, 255, 0, 220] as [number, number, number, number])
            : ([...base, 180] as [number, number, number, number]);
        },
        getLineColor: [255, 255, 255, 200] as [number, number, number, number],
        getLineWidth: 1,
        updateTriggers: {
          getFillColor: [selectedFeatureId],
        },
      }),
    ];
  }, [response, selectedFeatureId]);

  return (
    <div className={styles.container}>
      <div className={styles.fpsCounter}>
        <span className={styles.fpsValue}>{fps}</span>
        <span className={styles.fpsLabel}>FPS</span>
      </div>

      {isLoading && (
        <div className={styles.overlay}>
          <span className={styles.spinner} />
          Loading map data…
        </div>
      )}
      {isError && (
        <div className={styles.overlay}>Error: {(error as Error).message}</div>
      )}
      <DeckGL
        initialViewState={viewState}
        controller
        layers={layers}
        onClick={(info) => handleClick(info as never)}
        onViewStateChange={(e) => updateViewState(e.viewState as never)}
      >
        <MapLibreMap mapStyle={MAPLIBRE_STYLE} />
      </DeckGL>
    </div>
  );
}
