import { create } from "zustand";
import type { HWMonitorData } from "../types/hwMonitor";

interface HWMonitorStoreState {
  data: HWMonitorData | null;
  selectedColumnIndices: number[];
  isModalOpen: boolean;
  setData: (data: HWMonitorData) => void;
  setSelectedColumnIndices: (indices: number[]) => void;
  openModal: () => void;
  closeModal: () => void;
  reset: () => void;
}

export const useHWMonitorStore = create<HWMonitorStoreState>((set) => ({
  data: null,
  selectedColumnIndices: [],
  isModalOpen: false,

  setData: (data) => set({ data }),
  setSelectedColumnIndices: (indices) =>
    set({ selectedColumnIndices: indices }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  reset: () =>
    set({ data: null, selectedColumnIndices: [], isModalOpen: false }),
}));
