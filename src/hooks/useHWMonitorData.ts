import { useCallback, useRef } from "react";
import { useHWMonitorStore } from "../stores/hwMonitorStore";
import type { WorkerOutMessage } from "../types/hwMonitor";

// Re-export so existing consumers can keep importing from here
export { getRecommendedIndices } from "../utils/hwMonitorParser";

export function useHWMonitorData() {
  const {
    startIngest,
    markParsing,
    setColumns,
    appendRows,
    finalizeIngest,
    failIngest,
  } = useHWMonitorStore();
  const workerRef = useRef<Worker | null>(null);

  const loadFile = useCallback(
    (file: File) => {
      // Terminate any previous in-flight worker
      workerRef.current?.terminate();

      // Set phase to "preparing" — this triggers the loading UI immediately
      startIngest();
      // Switch to parsing right away so page-level loader replaces upload immediately.
      markParsing();

      // Yield one frame so the browser can paint the loading indicator
      // before we start posting to the worker
      requestAnimationFrame(() => {
        const worker = new Worker(
          new URL("../workers/hwmonitor.worker.ts", import.meta.url),
          { type: "module" },
        );
        workerRef.current = worker;

        worker.onmessage = (ev: MessageEvent<WorkerOutMessage>) => {
          const msg = ev.data;
          switch (msg.type) {
            case "columns":
              // Columns ready → store them and open modal immediately
              setColumns(msg.columns, msg.totalRows);
              break;
            case "rows":
              appendRows(msg.rows, msg.progress);
              break;
            case "done":
              finalizeIngest();
              worker.terminate();
              workerRef.current = null;
              break;
            case "error":
              console.error("Worker parse error:", msg.error);
              failIngest(msg.error);
              worker.terminate();
              workerRef.current = null;
              break;
          }
        };

        worker.postMessage({ file });
      });
    },
    [
      startIngest,
      markParsing,
      setColumns,
      appendRows,
      finalizeIngest,
      failIngest,
    ],
  );

  return { loadFile };
}
