import { QuadScatterPlot } from "../components/QuadScatterPlot";
import { QuadDataControls } from "../components/QuadDataControls";
import { CLUSTER_LABELS } from "../hooks/useQuadScatterData";
import styles from "./QuadScatterPage.module.css";

const CLUSTER_COLORS = [
  "rgb(65, 182, 196)",
  "rgb(254, 178, 76)",
  "rgb(44, 162, 95)",
  "rgb(240, 59, 32)",
];

export default function QuadScatterPage() {
  return (
    <div className={styles.page}>
      <QuadScatterPlot />
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Clustered Point Cloud</h2>
        <QuadDataControls />

        {/* Cluster legend */}
        <div className={styles.legend}>
          <h3 className={styles.legendHeading}>Clusters</h3>
          <ul className={styles.legendList}>
            {CLUSTER_LABELS.map((label, i) => (
              <li key={label} className={styles.legendItem}>
                <span
                  className={styles.dot}
                  style={{ background: CLUSTER_COLORS[i] }}
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.info}>
          <h3 className={styles.infoHeading}>About</h3>
          <p>
            Four distinct point clouds are placed in separate quadrants of a
            wireframe cube. Adjust the number of points per cluster to stress
            test WebGL rendering performance.
          </p>
          <p>Drag to orbit, scroll to zoom, and right-drag to pan.</p>
        </div>
      </aside>
    </div>
  );
}
