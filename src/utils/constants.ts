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
} as const;

export const MOCK_DATA_COUNT = 80;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const QUERY_KEYS = {
  MAP_DATA: "map-data",
} as const;

export const CATEGORIES = [
  "residential",
  "commercial",
  "industrial",
  "parks",
  "infrastructure",
] as const;

export type Category = (typeof CATEGORIES)[number];
