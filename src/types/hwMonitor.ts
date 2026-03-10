export type MetricGroup =
  | "temperature"
  | "fan"
  | "clock"
  | "utilization"
  | "power"
  | "voltage"
  | "bandwidth"
  | "current"
  | "counter"
  | "other";

export interface HWMonitorColumn {
  /** 1-based column index in the raw CSV row (index 0 is Time) */
  index: number;
  /** Full header text, e.g. "CPU Rotation Speed [RPM]" */
  header: string;
  /** Header without unit, e.g. "CPU Rotation Speed" */
  label: string;
  /** Unit extracted from brackets, e.g. "RPM" */
  unit: string;
  /** Hardware device name from row 0, e.g. "AMD Ryzen 7 9800X3D" */
  device: string;
  /** Semantic metric group inferred from unit + label keywords */
  metricGroup: MetricGroup;
}

export interface HWMonitorData {
  /** All data columns, excluding the Time column at index 0 */
  columns: HWMonitorColumn[];
  /**
   * Data rows. Each row is a flat array of numbers where:
   *   row[0]         = Time [s]
   *   row[col.index] = value for that column
   */
  rows: number[][];
}
