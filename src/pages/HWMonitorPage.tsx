import { HWMonitorUpload } from "../components/HWMonitorUpload";
import { HWMonitorColumnModal } from "../components/HWMonitorColumnModal";
import { HWMonitorCharts } from "../components/HWMonitorCharts";
import { useHWMonitorStore } from "../stores";
import styles from "./HWMonitorPage.module.css";

export default function HWMonitorPage() {
  const data = useHWMonitorStore((s) => s.data);
  const selectedColumnIndices = useHWMonitorStore(
    (s) => s.selectedColumnIndices,
  );
  const openModal = useHWMonitorStore((s) => s.openModal);
  const reset = useHWMonitorStore((s) => s.reset);
  const ingestPhase = useHWMonitorStore((s) => s.ingestPhase);
  const ingestProgress = useHWMonitorStore((s) => s.ingestProgress);
  const ingestError = useHWMonitorStore((s) => s.ingestError);

  const hasData = data !== null && data.columns.length > 0;
  const hasSelection = selectedColumnIndices.length > 0;
  const isIngesting =
    ingestPhase === "preparing" ||
    ingestPhase === "parsing" ||
    ingestPhase === "columnsReady" ||
    ingestPhase === "rowsStreaming";

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

      {/* Page-level loading overlay — stays visible even when upload unmounts */}
      {isIngesting && (
        <div className={styles.ingestOverlay}>
          <div className={styles.spinner} />
          <p className={styles.ingestStatus}>
            {ingestPhase === "preparing" && "Preparing…"}
            {ingestPhase === "parsing" && "Parsing headers…"}
            {ingestPhase === "columnsReady" &&
              "Columns ready — opening selector…"}
            {ingestPhase === "rowsStreaming" &&
              `Loading rows… ${Math.round(ingestProgress * 100)}%`}
            {ingestPhase !== "preparing" &&
              ingestPhase !== "parsing" &&
              ingestPhase !== "columnsReady" &&
              ingestPhase !== "rowsStreaming" &&
              "Loading file..."}
          </p>
        </div>
      )}

      {ingestPhase === "error" && (
        <div className={styles.ingestError}>
          <p>Error: {ingestError}</p>
          <button className={styles.btnSecondary} onClick={reset}>
            Dismiss
          </button>
        </div>
      )}

      {!hasData && ingestPhase === "idle" && (
        <div className={styles.uploadWrap}>
          <HWMonitorUpload />
        </div>
      )}

      {hasData && !hasSelection && !isIngesting && (
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
