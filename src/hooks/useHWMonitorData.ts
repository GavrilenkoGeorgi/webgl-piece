import { useCallback } from "react";
import { useHWMonitorStore } from "../stores/hwMonitorStore";
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
  // 1. Try mapping from the parsed unit (case-insensitive lookup)
  const byUnit =
    UNIT_TO_GROUP[unit] ??
    UNIT_TO_GROUP[
      Object.keys(UNIT_TO_GROUP).find(
        (k) => k.toLowerCase() === unit.toLowerCase(),
      ) ?? ""
    ];
  if (byUnit) return byUnit;

  // 2. Fallback: scan label for keyword patterns
  for (const [re, group] of LABEL_GROUP_PATTERNS) {
    if (re.test(label)) return group;
  }

  return "other";
}

const RECOMMENDED_PATTERNS: RegExp[] = [
  /cores \(max\) temperature/i,
  /* /package temperature/i,
  /^core #\d+ temperature/i,
  /ccd #\d+ temperature/i,
  /l3 cache temperature/i,
  /hot spot temperature/i,
  /cores \(max\) clock speed/i,
  /^core #\d+ clock speed/i,
  /processor utilization/i,
  /cpu rotation speed/i,
  /fan.*rotation speed/i,
  /^global temperature/i,
  /gpu.*temperature/i, */
];

function detectSeparator(line: string): string {
  const candidates: [string, number][] = [
    ["\t", (line.match(/\t/g) ?? []).length],
    [",", (line.match(/,/g) ?? []).length],
    [";", (line.match(/;/g) ?? []).length],
  ];
  return candidates.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

/** Split a CSV line respecting double-quoted fields. */
function csvSplitLine(line: string, sep: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        // Escaped quote (double-double) or end of quoted field
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
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

export function parseHWMonitorCSV(text: string): HWMonitorData {
  const lines = text.split(/\r?\n|\r/).filter((l) => l.trim() !== "");
  if (lines.length < 3) {
    throw new Error("File has fewer than 3 rows");
  }

  const sep = detectSeparator(lines[1]);
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

  const rows: number[][] = [];
  for (let r = 2; r < lines.length; r++) {
    const cells = csvSplitLine(lines[r], sep);
    const row: number[] = cells.map((c) => {
      const v = parseFloat(c.replace(",", "."));
      return isNaN(v) ? 0 : v;
    });
    rows.push(row);
  }

  return { columns, rows };
}

export function getRecommendedIndices(columns: HWMonitorColumn[]): number[] {
  return columns
    .filter((col) =>
      RECOMMENDED_PATTERNS.some((p) => p.test(col.label) || p.test(col.header)),
    )
    .map((col) => col.index);
}

export function useHWMonitorData() {
  const { setData, openModal } = useHWMonitorStore();

  const loadFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseHWMonitorCSV(text);
          // console.log("Parsed HWMonitor data:", data);
          setData(data);
          openModal();
        } catch (err) {
          console.error("Failed to parse HWMonitor CSV:", err);
          alert(
            "Failed to parse the file. Please ensure it is a valid HWMonitor log export.",
          );
        }
      };
      reader.readAsText(file);
    },
    [setData, openModal],
  );

  return { loadFile };
}
