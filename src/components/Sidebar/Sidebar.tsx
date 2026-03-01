import { useMapStore } from "../../stores/mapStore";
import { useUIStore } from "../../stores/uiStore";
import { useMapData } from "../../hooks/useMapData";
import {
  formatCoordinates,
  formatValue,
  capitalize,
} from "../../utils/formatters";
import type { GeoFeature } from "../../types";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const selectedFeatureId = useMapStore((s) => s.selectedFeatureId);
  const selectFeature = useMapStore((s) => s.selectFeature);
  const showLegend = useUIStore((s) => s.showLegend);
  const toggleLegend = useUIStore((s) => s.toggleLegend);

  const { data: response, isLoading } = useMapData();

  const features = response?.data?.features ?? [];
  const selectedFeature: GeoFeature | undefined = features.find(
    (f) => f.properties.id === selectedFeatureId,
  );

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>WebGL Demo</h2>

      {/* Dataset info */}
      <section className={styles.section}>
        <h3>Dataset</h3>
        {isLoading ? (
          <p className={styles.muted}>Loading…</p>
        ) : (
          <>
            <p>
              <strong>Features:</strong>{" "}
              {formatValue(response?.metadata.totalCount ?? 0)}
            </p>
            <p className={styles.muted}>
              Fetched:{" "}
              {response?.metadata.fetchedAt
                ? new Date(response.metadata.fetchedAt).toLocaleTimeString()
                : "—"}
            </p>
          </>
        )}
      </section>

      {/* Selected feature */}
      <section className={styles.section}>
        <h3>Selected Feature</h3>
        {selectedFeature ? (
          <div className={styles.card}>
            <p>
              <strong>{selectedFeature.properties.name}</strong>
            </p>
            <p>
              Category:{" "}
              <span className={styles.badge}>
                {capitalize(selectedFeature.properties.category)}
              </span>
            </p>
            <p>Value: {formatValue(selectedFeature.properties.value)}</p>
            <p className={styles.muted}>
              {formatCoordinates(
                selectedFeature.geometry.coordinates[1],
                selectedFeature.geometry.coordinates[0],
              )}
            </p>
            <button
              className={styles.btnSecondary}
              onClick={() => selectFeature(null)}
            >
              Deselect
            </button>
          </div>
        ) : (
          <p className={styles.muted}>Click a point on the map</p>
        )}
      </section>

      {/* Legend toggle */}
      <section className={styles.section}>
        <button className={styles.btn} onClick={toggleLegend}>
          {showLegend ? "Hide" : "Show"} Legend
        </button>

        {showLegend && (
          <ul className={styles.legend}>
            <li>
              <span
                className={styles.dot}
                style={{ background: "rgb(65,182,196)" }}
              />{" "}
              Residential
            </li>
            <li>
              <span
                className={styles.dot}
                style={{ background: "rgb(254,178,76)" }}
              />{" "}
              Commercial
            </li>
            <li>
              <span
                className={styles.dot}
                style={{ background: "rgb(240,59,32)" }}
              />{" "}
              Industrial
            </li>
            <li>
              <span
                className={styles.dot}
                style={{ background: "rgb(44,162,95)" }}
              />{" "}
              Parks
            </li>
            <li>
              <span
                className={styles.dot}
                style={{ background: "rgb(123,104,238)" }}
              />{" "}
              Infrastructure
            </li>
          </ul>
        )}
      </section>
    </aside>
  );
}
