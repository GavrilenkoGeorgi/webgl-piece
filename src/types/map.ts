export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface MapFilters {
  category?: string;
  minValue?: number;
  maxValue?: number;
}
