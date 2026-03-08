import { ScatterPlot } from "../components/ScatterPlot";
import { DataControls } from "../components/DataControls";
import styles from "./ScatterPage.module.css";

export default function ScatterPage() {
  return (
    <div className={styles.page}>
      <ScatterPlot />
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>3D Scatter Plot</h2>
        <DataControls />
        <div className={styles.info}>
          <h3 className={styles.infoHeading}>About</h3>
          <p>
            This view renders abstract 3D point cloud data using WebGL via
            deck.gl. Adjust the number of points to observe rendering
            performance at different scales.
          </p>
          <p>Drag to orbit, scroll to zoom, and right-drag to pan.</p>
        </div>
      </aside>
    </div>
  );
}
