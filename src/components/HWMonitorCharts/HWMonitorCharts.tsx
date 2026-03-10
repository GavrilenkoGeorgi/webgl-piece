import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useHWMonitorStore } from "../../stores/hwMonitorStore";
import type { MetricGroup } from "../../types/hwMonitor";
import styles from "./HWMonitorCharts.module.css";

const LINE_COLORS = [
  "#4c6ef5",
  "#f03e3e",
  "#40c057",
  "#fd7e14",
  "#cc5de8",
  "#15aabf",
  "#fab005",
  "#e64980",
  "#74c0fc",
  "#63e6be",
  "#ff6b6b",
  "#a9e34b",
];

/** Render order for metric groups (temperature first, fan second, etc.) */
const GROUP_ORDER: MetricGroup[] = [
  "temperature",
  "fan",
  "clock",
  "utilization",
  "power",
  "voltage",
  "bandwidth",
  "current",
  "counter",
  "other",
];

const GROUP_LABEL: Record<MetricGroup, string> = {
  temperature: "Temperature (°C)",
  fan: "Fan Speed (RPM)",
  clock: "Clock Speed (MHz)",
  utilization: "Utilization (%)",
  power: "Power (W)",
  voltage: "Voltage (V)",
  bandwidth: "Bandwidth (Mbps)",
  current: "Current (A)",
  counter: "Counter",
  other: "Other metrics",
};

export default function HWMonitorCharts() {
  const { data, selectedColumnIndices } = useHWMonitorStore();

  if (!data || selectedColumnIndices.length === 0) return null;

  const selectedCols = data.columns.filter((c) =>
    selectedColumnIndices.includes(c.index),
  );

  // Group selected columns by metric group
  const metricGroups = new Map<MetricGroup, typeof selectedCols>();
  for (const col of selectedCols) {
    const key = col.metricGroup;
    if (!metricGroups.has(key)) metricGroups.set(key, []);
    metricGroups.get(key)!.push(col);
  }

  // Sort groups into deterministic render order
  const orderedGroups = GROUP_ORDER.filter((g) => metricGroups.has(g)).map(
    (g) => [g, metricGroups.get(g)!] as const,
  );

  // Build flat record array for Recharts; use column index as string key
  const chartData = data.rows.map((row) => {
    const record: Record<string, number> = { time: row[0] };
    for (const col of selectedCols) {
      record[String(col.index)] = row[col.index] ?? 0;
    }
    return record;
  });

  return (
    <div className={styles.charts}>
      {orderedGroups.map(([group, cols]) => (
        <div key={group} className={styles.chartCard}>
          <h3 className={styles.chartTitle}>{GROUP_LABEL[group]}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={chartData}
              margin={{ top: 6, right: 20, bottom: 6, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3140" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "#8b8fa3" }}
                label={{
                  value: "Time (s)",
                  position: "insideBottomRight",
                  offset: -4,
                  fontSize: 11,
                  fill: "#8b8fa3",
                }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#8b8fa3" }} width={54} />
              <Tooltip
                contentStyle={{
                  background: "#1a1d27",
                  border: "1px solid #2e3140",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                wrapperStyle={{ zIndex: 1000 }}
                labelStyle={{ color: "#8b8fa3", fontSize: 11 }}
                labelFormatter={(v) => `t = ${v}s`}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {cols.map((col, i) => (
                <Line
                  key={col.index}
                  type="monotone"
                  dataKey={String(col.index)}
                  name={col.label}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  dot={false}
                  strokeWidth={1.5}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
