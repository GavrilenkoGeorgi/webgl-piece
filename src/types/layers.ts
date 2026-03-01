export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
}

export interface GeoFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    category: string;
    value: number;
  };
}

export interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}
