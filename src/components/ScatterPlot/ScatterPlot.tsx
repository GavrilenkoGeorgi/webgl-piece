import { useMemo, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { OrbitView } from "@deck.gl/core";

import { SoftPointCloudLayer } from "../../layers/SoftPointCloudLayer";
import { useScatterStore } from "../../stores/scatterStore";
import { useScatterData } from "../../hooks/useScatterData";
import { useFpsMonitor } from "../../hooks/useFpsMonitor";
import { LAYER_IDS } from "../../utils/constants";
import type { ScatterPoint } from "../../types";
import styles from "./ScatterPlot.module.css";

const ORBIT_VIEW = new OrbitView({ id: "orbit", orbitAxis: "Y" });

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0] as [number, number, number],
  rotationOrbit: -30,
  rotationX: 25,
  zoom: 1.5,
  minZoom: -2,
  maxZoom: 10,
};

export default function ScatterPlot() {
  const pointCount = useScatterStore((s) => s.pointCount);
  const pointSize = useScatterStore((s) => s.pointSize);
  const seed = useScatterStore((s) => s.seed);
  const { data } = useScatterData(pointCount, seed);
  const fps = useFpsMonitor(500);

  const layers = useMemo(
    () => [
      new SoftPointCloudLayer<ScatterPoint>({
        id: LAYER_IDS.SCATTER,
        data,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getPosition: (d) => [d.x, d.y, d.z],
        getColor: (d) => d.color,
        getNormal: [0, 0, 1],
        pointSize: pointSize,
        pickable: true,
        sizeUnits: "pixels",
      }),
    ],
    [data, pointSize],
  );

  const handleViewStateChange = useCallback(() => {
    // Allow free orbit; no need to persist view state here
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.fpsCounter}>
        <span className={styles.fpsValue}>{fps}</span>
        <span className={styles.fpsLabel}>FPS</span>
      </div>

      <div className={styles.pointBadge}>
        {pointCount.toLocaleString()} points
      </div>

      <DeckGL
        views={ORBIT_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={layers}
        onViewStateChange={handleViewStateChange}
      />
    </div>
  );
}
