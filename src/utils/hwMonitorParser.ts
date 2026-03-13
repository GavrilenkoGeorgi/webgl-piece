import type {
  HWMonitorColumn,
  HWMonitorData,
  MetricGroup,
} from "../types/hwMonitor";

const UNIT_RE = /\[([^[\]]+)\]$/;

/** Map a raw unit string to a canonical metric group. */
const UNIT_TO_GROUP: Record<string, MetricGroup> = {
  "°C": "temperature",
  C: "temperature",
  RPM: "fan",
  MHz: "clock",
  "%": "utilization",
  W: "power",
  V: "voltage",
  Mbps: "bandwidth",
  A: "current",
  Counter: "counter",
};

/** Normalize common unit encoding issues (e.g., replace � with °). */
function normalizeUnit(unit: string): string {
  return unit.replace(/\uFFFD/g, "°"); // � is \uFFFD
}

const LABEL_GROUP_PATTERNS: [RegExp, MetricGroup][] = [
  [/temperature|temp\b/i, "temperature"],
  [/fan|rotation\s*speed/i, "fan"],
  [/clock\s*speed|frequency/i, "clock"],
  [/utilization|usage|load/i, "utilization"],
  [/power|watt/i, "power"],
  [/voltage|volt\b/i, "voltage"],
  [/bandwidth/i, "bandwidth"],
  [/current\b/i, "current"],
];

function inferMetricGroup(unit: string, label: string): MetricGroup {
  const byUnit =
    UNIT_TO_GROUP[unit] ??
    UNIT_TO_GROUP[
      Object.keys(UNIT_TO_GROUP).find(
        (k) => k.toLowerCase() === unit.toLowerCase(),
      ) ?? ""
    ];
  if (byUnit) return byUnit;

  for (const [re, group] of LABEL_GROUP_PATTERNS) {
    if (re.test(label)) return group;
  }

  return "other";
}

const RECOMMENDED_PATTERNS: RegExp[] = [/cores \(max\) temperature/i];

export function detectSeparator(line: string): string {
  const candidates: [string, number][] = [
    ["\t", (line.match(/\t/g) ?? []).length],
    [",", (line.match(/,/g) ?? []).length],
    [";", (line.match(/;/g) ?? []).length],
  ];
  return candidates.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

/** Split a CSV line respecting double-quoted fields. */
export function csvSplitLine(line: string, sep: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === sep) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/** Parse header rows only — returns columns metadata without row data. */
export function parseHWMonitorHeaders(
  lines: string[],
  sep: string,
): HWMonitorColumn[] {
  const deviceRow = csvSplitLine(lines[0], sep);
  const headerRow = csvSplitLine(lines[1], sep);

  const columns: HWMonitorColumn[] = [];
  for (let i = 1; i < headerRow.length; i++) {
    const header = headerRow[i];
    if (!header) continue;
    const unitMatch = UNIT_RE.exec(header);
    const rawUnit = unitMatch ? unitMatch[1] : "";
    const unit = normalizeUnit(rawUnit);
    const label = header.replace(/\s*\[[^[\]]+\]$/, "").trim();
    const device = deviceRow[i] || "Other";
    const metricGroup = inferMetricGroup(unit, label);
    columns.push({ index: i, header, label, unit, device, metricGroup });
  }
  return columns;
}

/** Parse a range of data rows into numeric arrays. */
export function parseRowChunk(
  lines: string[],
  sep: string,
  startIdx: number,
  endIdx: number,
): number[][] {
  const rows: number[][] = [];
  for (let r = startIdx; r < endIdx; r++) {
    const cells = csvSplitLine(lines[r], sep);
    const row: number[] = cells.map((c) => {
      const v = parseFloat(c.replace(",", "."));
      return isNaN(v) ? 0 : v;
    });
    rows.push(row);
  }
  return rows;
}

/** Full parse in one shot (kept for compatibility). */
export function parseHWMonitorCSV(text: string): HWMonitorData {
  const lines = text.split(/\r?\n|\r/).filter((l) => l.trim() !== "");
  if (lines.length < 3) {
    throw new Error("File has fewer than 3 rows");
  }

  const sep = detectSeparator(lines[1]);
  const columns = parseHWMonitorHeaders(lines, sep);
  const rows = parseRowChunk(lines, sep, 2, lines.length);
  return { columns, rows };
}

export function getRecommendedIndices(columns: HWMonitorColumn[]): number[] {
  return columns
    .filter((col) =>
      RECOMMENDED_PATTERNS.some((p) => p.test(col.label) || p.test(col.header)),
    )
    .map((col) => col.index);
}
