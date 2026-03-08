import { useMemo, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import { COORDINATE_SYSTEM, OrbitView } from "@deck.gl/core";

import { SoftPointCloudLayer } from "../../layers/SoftPointCloudLayer";
import { useQuadScatterStore } from "../../stores/quadScatterStore";
import { useQuadScatterData } from "../../hooks/useQuadScatterData";
import { useFpsMonitor } from "../../hooks/useFpsMonitor";
import type { ScatterPoint } from "../../types";
import styles from "./QuadScatterPlot.module.css";

const ORBIT_VIEW = new OrbitView({ id: "orbit", orbitAxis: "Y" });

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0] as [number, number, number],
  rotationOrbit: -45,
  rotationX: 30,
  zoom: 0.8,
  minZoom: -2,
  maxZoom: 10,
};

/** Wireframe cube edge data – 12 edges of a cube centred at origin */
const CUBE_HALF = 500;
const CUBE_VERTICES: [number, number, number][] = [
  [-CUBE_HALF, -CUBE_HALF, -CUBE_HALF],
  [CUBE_HALF, -CUBE_HALF, -CUBE_HALF],
  [CUBE_HALF, CUBE_HALF, -CUBE_HALF],
  [-CUBE_HALF, CUBE_HALF, -CUBE_HALF],
  [-CUBE_HALF, -CUBE_HALF, CUBE_HALF],
  [CUBE_HALF, -CUBE_HALF, CUBE_HALF],
  [CUBE_HALF, CUBE_HALF, CUBE_HALF],
  [-CUBE_HALF, CUBE_HALF, CUBE_HALF],
];

const CUBE_EDGES = [
  // Bottom face
  { from: CUBE_VERTICES[0], to: CUBE_VERTICES[1] },
  { from: CUBE_VERTICES[1], to: CUBE_VERTICES[2] },
  { from: CUBE_VERTICES[2], to: CUBE_VERTICES[3] },
  { from: CUBE_VERTICES[3], to: CUBE_VERTICES[0] },
  // Top face
  { from: CUBE_VERTICES[4], to: CUBE_VERTICES[5] },
  { from: CUBE_VERTICES[5], to: CUBE_VERTICES[6] },
  { from: CUBE_VERTICES[6], to: CUBE_VERTICES[7] },
  { from: CUBE_VERTICES[7], to: CUBE_VERTICES[4] },
  // Vertical edges
  { from: CUBE_VERTICES[0], to: CUBE_VERTICES[4] },
  { from: CUBE_VERTICES[1], to: CUBE_VERTICES[5] },
  { from: CUBE_VERTICES[2], to: CUBE_VERTICES[6] },
  { from: CUBE_VERTICES[3], to: CUBE_VERTICES[7] },
];

export default function QuadScatterPlot() {
  const pointsPerCluster = useQuadScatterStore((s) => s.pointsPerCluster);
  const clusterSpread = useQuadScatterStore((s) => s.clusterSpread);
  const centerOffset = useQuadScatterStore((s) => s.centerOffset);
  const pointSize = useQuadScatterStore((s) => s.pointSize);
  const seed = useQuadScatterStore((s) => s.seed);
  const { data, totalPoints } = useQuadScatterData(
    pointsPerCluster,
    clusterSpread,
    centerOffset,
    seed,
  );
  const fps = useFpsMonitor(500);

  const layers = useMemo(
    () => [
      // Wireframe cube
      new LineLayer({
        id: "cube-wireframe",
        data: CUBE_EDGES,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getSourcePosition: (d) => d.from,
        getTargetPosition: (d) => d.to,
        getColor: [255, 255, 255, 60],
        getWidth: 1,
      }),
      // Point clouds
      new SoftPointCloudLayer<ScatterPoint>({
        id: "quad-scatter-points",
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
    // Free orbit – nothing to persist
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.fpsCounter}>
        <span className={styles.fpsValue}>{fps}</span>
        <span className={styles.fpsLabel}>FPS</span>
      </div>

      <div className={styles.pointBadge}>
        {totalPoints.toLocaleString()} points (4 &times;{" "}
        {pointsPerCluster.toLocaleString()})
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
