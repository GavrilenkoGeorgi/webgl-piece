import { HWMonitorUpload } from "../components/HWMonitorUpload";
import { HWMonitorColumnModal } from "../components/HWMonitorColumnModal";
import { HWMonitorCharts } from "../components/HWMonitorCharts";
import { useHWMonitorStore } from "../stores";
import styles from "./HWMonitorPage.module.css";

export default function HWMonitorPage() {
  const { data, selectedColumnIndices, openModal, reset } = useHWMonitorStore();

  const hasData = data !== null;
  const hasSelection = selectedColumnIndices.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>HWMonitor Log Analyser</h1>
        {hasData && (
          <div className={styles.actions}>
            <button className={styles.btn} onClick={openModal}>
              Edit columns ({selectedColumnIndices.length})
            </button>
            <button className={styles.btnSecondary} onClick={reset}>
              Clear
            </button>
          </div>
        )}
      </div>

      {!hasData && (
        <div className={styles.uploadWrap}>
          <HWMonitorUpload />
        </div>
      )}

      {hasData && !hasSelection && (
        <div className={styles.empty}>
          <p>
            No metrics selected.{" "}
            <button className={styles.textBtn} onClick={openModal}>
              Choose columns
            </button>{" "}
            to display charts.
          </p>
        </div>
      )}

      {hasData && hasSelection && <HWMonitorCharts />}

      <HWMonitorColumnModal />
    </div>
  );
}
