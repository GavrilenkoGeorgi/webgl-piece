import { useState, useCallback } from "react";
import { useScatterStore } from "../../stores/scatterStore";
import { SCATTER_DEFAULTS } from "../../utils/constants";
import styles from "./DataControls.module.css";

const PRESETS = [1_000, 5_000, 10_000, 50_000, 100_000] as const;

export default function DataControls() {
  const pointCount = useScatterStore((s) => s.pointCount);
  const pointSize = useScatterStore((s) => s.pointSize);
  const setPointCount = useScatterStore((s) => s.setPointCount);
  const setPointSize = useScatterStore((s) => s.setPointSize);
  const regenerate = useScatterStore((s) => s.regenerate);

  const [inputValue, setInputValue] = useState(String(pointCount));
  const [sizeInputValue, setSizeInputValue] = useState(String(pointSize));

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setPointCount(val);
      setInputValue(String(val));
    },
    [setPointCount],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  const handleInputConfirm = useCallback(() => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= SCATTER_DEFAULTS.MIN_POINTS) {
      setPointCount(parsed);
      setInputValue(String(parsed));
    } else {
      setInputValue(String(pointCount));
    }
  }, [inputValue, pointCount, setPointCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleInputConfirm();
    },
    [handleInputConfirm],
  );

  const handlePreset = useCallback(
    (count: number) => {
      setPointCount(count);
      setInputValue(String(count));
    },
    [setPointCount],
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
    if (!isNaN(parsed) && parsed >= 2 && parsed <= 20) {
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
      <h3 className={styles.heading}>Data Controls</h3>

      {/* Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="point-slider">
          Point Count
        </label>
        <input
          id="point-slider"
          type="range"
          className={styles.slider}
          min={SCATTER_DEFAULTS.MIN_POINTS}
          max={SCATTER_DEFAULTS.MAX_POINTS}
          step={SCATTER_DEFAULTS.SLIDER_STEP}
          value={pointCount}
          onChange={handleSliderChange}
        />
      </div>

      {/* Custom input */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          min={SCATTER_DEFAULTS.MIN_POINTS}
          max={SCATTER_DEFAULTS.MAX_POINTS}
          step={SCATTER_DEFAULTS.SLIDER_STEP}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.inputHint}>points</span>
      </div>

      {/* Presets */}
      <div className={styles.presets}>
        {PRESETS.map((count) => (
          <button
            key={count}
            className={`${styles.presetBtn} ${count === pointCount ? styles.presetActive : ""}`}
            onClick={() => handlePreset(count)}
          >
            {count >= 1_000 ? `${(count / 1_000).toFixed(0)}K` : String(count)}
          </button>
        ))}
      </div>

      {/* Regenerate */}
      <button className={styles.regenerateBtn} onClick={regenerate}>
        Regenerate Data
      </button>

      {/* Point Size Slider */}
      <div className={styles.sliderGroup}>
        <label className={styles.label} htmlFor="size-slider">
          Point Size
        </label>
        <input
          id="size-slider"
          type="range"
          className={styles.slider}
          min="2"
          max="20"
          step="1"
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
          min="2"
          max="20"
          step="1"
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
