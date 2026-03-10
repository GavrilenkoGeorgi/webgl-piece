import { useState } from "react";
import { useHWMonitorStore } from "../../stores/hwMonitorStore";
import { getRecommendedIndices } from "../../hooks/useHWMonitorData";
import type { HWMonitorColumn } from "../../types/hwMonitor";
import styles from "./HWMonitorColumnModal.module.css";

export default function HWMonitorColumnModal() {
  const { data, isModalOpen, closeModal, setSelectedColumnIndices } =
    useHWMonitorStore();

  const [prevData, setPrevData] = useState(data);
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(data ? getRecommendedIndices(data.columns) : []),
  );
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  if (isModalOpen && data !== prevData) {
    setPrevData(data);
    setChecked(new Set(data ? getRecommendedIndices(data.columns) : []));
    // Open the first group when data changes
    const devices = new Set(data?.columns.map((col) => col.device));
    const firstDevice = devices.values().next().value ?? null;
    setOpenGroup(firstDevice);
  }

  if (!isModalOpen || !data) return null;

  // Group columns by device name
  const groups = new Map<string, HWMonitorColumn[]>();
  for (const col of data.columns) {
    const key = col.device;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(col);
  }

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleGroup(device: string) {
    setOpenGroup((prev) => (prev === device ? null : device));
  }

  function toggleDevice(cols: HWMonitorColumn[], on: boolean) {
    setChecked((prev) => {
      const next = new Set(prev);
      for (const col of cols) {
        if (on) next.add(col.index);
        else next.delete(col.index);
      }
      return next;
    });
  }

  function confirm() {
    setSelectedColumnIndices(Array.from(checked));
    closeModal();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeModal();
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="modal-title">
            Select Metrics to Display
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closeModal}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <p className={styles.hint}>
          {checked.size} of {data.columns.length} columns selected
        </p>
        <div className={styles.body}>
          {Array.from(groups.entries()).map(([device, cols]) => {
            const allOn = cols.every((c) => checked.has(c.index));
            const someOn = cols.some((c) => checked.has(c.index));
            return (
              <div key={device} className={styles.group}>
                <div
                  className={styles.groupHeader}
                  onClick={() => toggleGroup(device)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={allOn}
                    ref={(el: HTMLInputElement | null) => {
                      if (el) el.indeterminate = someOn && !allOn;
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleDevice(cols, e.target.checked)}
                  />
                  <span className={styles.groupLabel}>{device}</span>
                  <span className={styles.groupCount}>{cols.length}</span>
                  <span className={styles.expandIcon}>
                    {openGroup === device ? "▼" : "▶"}
                  </span>
                </div>
                {openGroup === device && (
                  <div className={styles.columnList}>
                    {cols.map((col) => (
                      <label key={col.index} className={styles.colItem}>
                        <input
                          type="checkbox"
                          checked={checked.has(col.index)}
                          onChange={() => toggle(col.index)}
                        />
                        <span className={styles.colLabel}>{col.label}</span>
                        <span className={styles.colUnit}>{col.unit}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={closeModal}>
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={confirm}
            disabled={checked.size === 0}
          >
            Show {checked.size} metric{checked.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
