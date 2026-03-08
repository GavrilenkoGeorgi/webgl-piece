export interface ScatterPoint {
  id: number;
  x: number;
  y: number;
  z: number;
  color: [number, number, number, number];
  radius: number;
}

export interface ScatterDataConfig {
  pointCount: number;
  spread: number;
}
