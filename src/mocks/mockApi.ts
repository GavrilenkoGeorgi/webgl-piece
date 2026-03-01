import type { GeoFeature, GeoFeatureCollection } from "../types";
import type { MapDataResponse } from "../types";
import { CATEGORIES, MOCK_DATA_COUNT } from "../utils/constants";

/**
 * Generates random GeoJSON point features around San Francisco
 */
function generateMockFeatures(count: number): GeoFeatureCollection {
  const SF_CENTER = { lng: -122.4194, lat: 37.7749 };
  const SPREAD = 0.8; // 0.08 is ~8km spread

  const features: GeoFeature[] = Array.from({ length: count }, (_, i) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        SF_CENTER.lng + (Math.random() - 0.5) * SPREAD * 2,
        SF_CENTER.lat + (Math.random() - 0.5) * SPREAD * 2,
      ],
    },
    properties: {
      id: `feature-${i}`,
      name: `Location ${i + 1}`,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      value: Math.floor(Math.random() * 1000) + 50,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Simulates a REST API response with artificial latency
 * @param count - Optional: number of features to generate (defaults to MOCK_DATA_COUNT)
 */
export function getMockMapData(count?: number): Promise<MapDataResponse> {
  return new Promise((resolve) => {
    const delay = 300 + Math.random() * 700; // 300-1000ms
    const dataCount = count ?? MOCK_DATA_COUNT;
    setTimeout(() => {
      const data = generateMockFeatures(dataCount);
      resolve({
        data,
        metadata: {
          totalCount: data.features.length,
          fetchedAt: new Date().toISOString(),
        },
      });
    }, delay);
  });
}
