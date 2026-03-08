import { useState, useCallback } from "react";
import { useQuadScatterStore } from "../../stores/quadScatterStore";
import styles from "./QuadDataControls.module.css";

const MIN = 25;
const MAX = 50_000;
const STEP = 25;
const MIN_SPREAD = 5;
const MAX_SPREAD = 500;
const SPREAD_STEP = 5;
const MIN_SIZE = 2;
const MAX_SIZE = 20;
const SIZE_STEP = 1;
const MIN_OFFSET = 10;
const MAX_OFFSET = 400;
const OFFSET_STEP = 5;

const PRESETS = [250, 500, 2_500, 10_000, 25_000] as const;

export default function QuadDataControls() {
  const pointsPerCluster = useQuadScatterStore((s) => s.pointsPerCluster);
  const clusterSpread = useQuadScatterStore((s) => s.clusterSpread);
  const centerOffset = useQuadScatterStore((s) => s.centerOffset);
  const pointSize = useQuadScatterStore((s) => s.pointSize);
  const setPointsPerCluster = useQuadScatterStore((s) => s.setPointsPerCluster);
  const setClusterSpread = useQuadScatterStore((s) => s.setClusterSpread);
  const setCenterOffset = useQuadScatterStore((s) => s.setCenterOffset);
  const setPointSize = useQuadScatterStore((s) => s.setPointSize);
  const regenerate = useQuadScatterStore((s) => s.regenerate);

  const [inputValue, setInputValue] = useState(String(pointsPerCluster));
  const [spreadInputValue, setSpreadInputValue] = useState(
    String(clusterSpread),
  );
  const [offsetInputValue, setOffsetInputValue] = useState(
    String(centerOffset),
  );
  const [sizeInputValue, setSizeInputValue] = useState(String(pointSize));

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setPointsPerCluster(val);
      setInputValue(String(val));
    },
    [setPointsPerCluster],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  const handleInputConfirm = useCallback(() => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= MIN) {
      setPointsPerCluster(parsed);
      setInputValue(String(parsed));
    } else {
      setInputValue(String(pointsPerCluster));
    }
  }, [inputValue, pointsPerCluster, setPointsPerCluster]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleInputConfirm();
    },
    [handleInputConfirm],
  );

  const handlePreset = useCallback(
    (count: number) => {
      setPointsPerCluster(count);
      setInputValue(String(count));
    },
    [setPointsPerCluster],
  );

  const handleSpreadChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setClusterSpread(val);
      setSpreadInputValue(String(val));
    },
    [setClusterSpread],
  );

  const handleSpreadInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpreadInputValue(e.target.value);
    },
    [],
  );

  const handleSpreadInputConfirm = useCallback(() => {
    const parsed = parseInt(spreadInputValue, 10);
    if (!isNaN(parsed) && parsed >= MIN_SPREAD) {
      setClusterSpread(parsed);
      setSpreadInputValue(String(parsed));
    } else {
      setSpreadInputValue(String(clusterSpread));
    }
  }, [spreadInputValue, clusterSpread, setClusterSpread]);

  const handleSpreadKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSpreadInputConfirm();
    },
    [handleSpreadInputConfirm],
  );

  const handleOffsetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setCenterOffset(val);
      setOffsetInputValue(String(val));
    },
    [setCenterOffset],
  );

  const handleOffsetInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOffsetInputValue(e.target.value);
    },
    [],
  );

  const handleOffsetInputConfirm = useCallback(() => {
    const parsed = parseInt(offsetInputValue, 10);
    if (!isNaN(parsed) && parsed >= MIN_OFFSET && parsed <= MAX_OFFSET) {
      setCenterOffset(parsed);
      setOffsetInputValue(String(parsed));
    } else {
      setOffsetInputValue(String(centerOffset));
    }
  }, [offsetInputValue, centerOffset, setCenterOffset]);

  const handleOffsetKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleOffsetInputConfirm();
    },
    [handleOffsetInputConfirm],
  );

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setPointSize(val);
      setSizeInputValue(String(val));
    },
    [setPointSize],
  );

  const handleSizeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSizeInputValue(e.target.value);
    },
    [],
  );

  const handleSizeInputConfirm = useCallback(() => {
    const parsed = parseInt(sizeInputValue, 10);
    if (!isNaN(parsed) && parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
      setPointSize(parsed);
      setSizeInputValue(String(parsed));
    } else {
      setSizeInputValue(String(pointSize));
    }
  }, [sizeInputValue, pointSize, setPointSize]);

  const handleSizeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSizeInputConfirm();
    },
    [handleSizeInputConfirm],
  );

  return (
    <div className={styles.controls}>
      <h3 className={styles.heading}>Cluster Controls</h3>

      {/* Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="quad-slider">
          Points per Cluster
        </label>
        <input
          id="quad-slider"
          type="range"
          className={styles.slider}
          min={MIN}
          max={MAX}
          step={STEP}
          value={pointsPerCluster}
          onChange={handleSliderChange}
        />
        <span className={styles.total}>
          Total: {(pointsPerCluster * 4).toLocaleString()}
        </span>
      </div>

      {/* Custom input */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          min={MIN}
          max={MAX}
          step={STEP}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.inputHint}>per cluster</span>
      </div>

      {/* Presets */}
      <div className={styles.presets}>
        {PRESETS.map((count) => (
          <button
            key={count}
            className={`${styles.presetBtn} ${count === pointsPerCluster ? styles.presetActive : ""}`}
            onClick={() => handlePreset(count)}
          >
            {count >= 1_000
              ? `${(count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1)}K`
              : String(count)}
          </button>
        ))}
      </div>

      {/* Regenerate */}
      <button className={styles.regenerateBtn} onClick={regenerate}>
        Regenerate Clusters
      </button>

      {/* Spread Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="spread-slider">
          Cluster Spread (Radius)
        </label>
        <input
          id="spread-slider"
          type="range"
          className={styles.slider}
          min={MIN_SPREAD}
          max={MAX_SPREAD}
          step={SPREAD_STEP}
          value={clusterSpread}
          onChange={handleSpreadChange}
        />
        <span className={styles.total}>Spread: {clusterSpread}px</span>
      </div>

      {/* Custom spread input */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          min={MIN_SPREAD}
          max={MAX_SPREAD}
          step={SPREAD_STEP}
          value={spreadInputValue}
          onChange={handleSpreadInputChange}
          onBlur={handleSpreadInputConfirm}
          onKeyDown={handleSpreadKeyDown}
        />
        <span className={styles.inputHint}>px</span>
      </div>

      {/* Center Offset Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="offset-slider">
          Center Offset
        </label>
        <input
          id="offset-slider"
          type="range"
          className={styles.slider}
          min={MIN_OFFSET}
          max={MAX_OFFSET}
          step={OFFSET_STEP}
          value={centerOffset}
          onChange={handleOffsetChange}
        />
        <span className={styles.total}>Offset: {centerOffset}</span>
      </div>

      {/* Custom offset input */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          min={MIN_OFFSET}
          max={MAX_OFFSET}
          step={OFFSET_STEP}
          value={offsetInputValue}
          onChange={handleOffsetInputChange}
          onBlur={handleOffsetInputConfirm}
          onKeyDown={handleOffsetKeyDown}
        />
        <span className={styles.inputHint}>units</span>
      </div>

      {/* Point Size Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="size-slider">
          Point Size
        </label>
        <input
          id="size-slider"
          type="range"
          className={styles.slider}
          min={MIN_SIZE}
          max={MAX_SIZE}
          step={SIZE_STEP}
          value={pointSize}
          onChange={handleSizeChange}
        />
        <span className={styles.total}>{pointSize}px</span>
      </div>

      {/* Custom size input */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          min={MIN_SIZE}
          max={MAX_SIZE}
          step={SIZE_STEP}
          value={sizeInputValue}
          onChange={handleSizeInputChange}
          onBlur={handleSizeInputConfirm}
          onKeyDown={handleSizeKeyDown}
        />
        <span className={styles.inputHint}>px</span>
      </div>
    </div>
  );
}
