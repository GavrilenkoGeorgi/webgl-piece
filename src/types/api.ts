import type { GeoFeatureCollection } from "./layers";

export interface MapDataResponse {
  data: GeoFeatureCollection;
  metadata: {
    totalCount: number;
    fetchedAt: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}
