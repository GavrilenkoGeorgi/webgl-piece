/**
 * Format coordinates for display (e.g., "37.7749°N, 122.4194°W")
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

/**
 * Format a numeric value with optional units
 */
export function formatValue(value: number, unit = ""): string {
  return `${value.toLocaleString()}${unit ? ` ${unit}` : ""}`;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
