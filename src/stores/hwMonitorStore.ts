import { create } from "zustand";
import type {
  HWMonitorColumn,
  HWMonitorData,
  IngestPhase,
} from "../types/hwMonitor";

interface HWMonitorStoreState {
  // --- data ---
  data: HWMonitorData | null;
  selectedColumnIndices: number[];
  isModalOpen: boolean;

  // --- ingest lifecycle ---
  ingestPhase: IngestPhase;
  ingestProgress: number; // 0–1
  ingestError: string | null;

  // --- actions: data / modal ---
  setData: (data: HWMonitorData) => void;
  setSelectedColumnIndices: (indices: number[]) => void;
  openModal: () => void;
  closeModal: () => void;
  reset: () => void;

  // --- actions: ingest lifecycle ---
  startIngest: () => void;
  markParsing: () => void;
  setColumns: (columns: HWMonitorColumn[], totalRows: number) => void;
  appendRows: (rows: number[][], progress: number) => void;
  finalizeIngest: () => void;
  failIngest: (error: string) => void;
}

export const useHWMonitorStore = create<HWMonitorStoreState>((set, get) => ({
  data: null,
  selectedColumnIndices: [],
  isModalOpen: false,
  ingestPhase: "idle",
  ingestProgress: 0,
  ingestError: null,

  setData: (data) => set({ data }),
  setSelectedColumnIndices: (indices) =>
    set({ selectedColumnIndices: indices }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  reset: () =>
    set({
      data: null,
      selectedColumnIndices: [],
      isModalOpen: false,
      ingestPhase: "idle",
      ingestProgress: 0,
      ingestError: null,
    }),

  startIngest: () =>
    set({
      ingestPhase: "preparing",
      ingestProgress: 0,
      ingestError: null,
      data: null,
      selectedColumnIndices: [],
    }),

  markParsing: () => set({ ingestPhase: "parsing" }),

  setColumns: (columns, totalRows) => {
    set({
      data: { columns, rows: [] },
      ingestPhase: "columnsReady",
      isModalOpen: true,
    });
    // totalRows is informational; stored implicitly via progress
    void totalRows;
  },

  appendRows: (newRows, progress) => {
    const current = get().data;
    if (!current) return;
    set({
      data: { ...current, rows: [...current.rows, ...newRows] },
      ingestProgress: progress,
      ingestPhase: "rowsStreaming",
    });
  },

  finalizeIngest: () => set({ ingestPhase: "ready", ingestProgress: 1 }),

  failIngest: (error) => set({ ingestPhase: "error", ingestError: error }),
}));
