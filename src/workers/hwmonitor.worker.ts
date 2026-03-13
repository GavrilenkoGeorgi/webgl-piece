import {
  detectSeparator,
  parseHWMonitorHeaders,
  parseRowChunk,
} from "../utils/hwMonitorParser";
import type { WorkerOutMessage } from "../types/hwMonitor";

const ROW_CHUNK_SIZE = 2000;

function post(msg: WorkerOutMessage) {
  self.postMessage(msg);
}

self.addEventListener("message", async (ev) => {
  try {
    const file: File = ev.data.file;
    const text = await file.text();
    const lines = text.split(/\r?\n|\r/).filter((l) => l.trim() !== "");

    if (lines.length < 3) {
      throw new Error("File has fewer than 3 rows");
    }

    const sep = detectSeparator(lines[1]);

    // 1. Send columns immediately so the modal can open early
    const columns = parseHWMonitorHeaders(lines, sep);
    const totalDataRows = lines.length - 2;
    post({ type: "columns", columns, totalRows: totalDataRows });

    // 2. Parse rows in chunks and stream progress
    let parsedRows = 0;
    const dataStart = 2;
    while (parsedRows < totalDataRows) {
      const chunkEnd = Math.min(
        dataStart + parsedRows + ROW_CHUNK_SIZE,
        lines.length,
      );
      const rows = parseRowChunk(lines, sep, dataStart + parsedRows, chunkEnd);
      parsedRows += rows.length;
      post({
        type: "rows",
        rows,
        progress: parsedRows / totalDataRows,
      });

      // Yield to let the main thread process progress updates between chunks.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    // 3. Signal completion
    post({ type: "done" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err ?? "Unknown error");
    post({
      type: "error",
      error: message,
    });
  }
});
