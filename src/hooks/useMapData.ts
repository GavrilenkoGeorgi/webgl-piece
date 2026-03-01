import { useQuery } from "@tanstack/react-query";
import { fetchMapData } from "../services/mapDataService";
import { QUERY_KEYS } from "../utils/constants";

/**
 * TanStack Query hook for fetching map data from the backend.
 * Falls back to mock data when no API URL is configured.
 */
export function useMapData() {
  return useQuery({
    queryKey: [QUERY_KEYS.MAP_DATA],
    queryFn: fetchMapData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
