import type { MapViewState } from "../types";

export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: -122.4194,
  latitude: 37.7749,
  zoom: 11,
  pitch: 45,
  bearing: 0,
};

export const LAYER_IDS = {
  POINTS: "points-layer",
  SELECTED: "selected-layer",
  SCATTER: "scatter-layer",
} as const;

export const MOCK_DATA_COUNT = 80;

export const SCATTER_DEFAULTS = {
  MIN_POINTS: 100,
  MAX_POINTS: 200_000,
  DEFAULT_POINTS: 1_000,
  SLIDER_STEP: 100,
  SPREAD: 1_000,
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const QUERY_KEYS = {
  MAP_DATA: "map-data",
  SCATTER_DATA: "scatter-data",
} as const;

export const CATEGORIES = [
  "residential",
  "commercial",
  "industrial",
  "parks",
  "infrastructure",
] as const;

export type Category = (typeof CATEGORIES)[number];
