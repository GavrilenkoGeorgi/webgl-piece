import { create } from "zustand";

interface UIStoreState {
  sidebarOpen: boolean;
  showLegend: boolean;
  toggleSidebar: () => void;
  toggleLegend: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  sidebarOpen: true,
  showLegend: true,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleLegend: () => set((state) => ({ showLegend: !state.showLegend })),
}));
