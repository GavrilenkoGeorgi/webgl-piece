import type { MapDataResponse } from "../types";
import { getMockMapData } from "../mocks/mockApi";

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches map data from the backend API or mock.
 * When VITE_API_BASE_URL is not set, falls back to mock data.
 */
export async function fetchMapData(): Promise<MapDataResponse> {
  if (USE_MOCK) {
    console.info("[mapDataService] Using mock data (no VITE_API_BASE_URL set)");
    return getMockMapData(50000);
  }

  // When a real backend is available, use the API client
  const { apiFetch } = await import("./api");
  return apiFetch<MapDataResponse>("/api/map-data");
}
