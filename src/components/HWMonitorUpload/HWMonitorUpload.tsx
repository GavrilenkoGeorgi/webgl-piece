import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { useHWMonitorData } from "../../hooks/useHWMonitorData";
import styles from "./HWMonitorUpload.module.css";

export default function HWMonitorUpload() {
  const { loadFile } = useHWMonitorData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // Reset so the same file can be selected again
    e.target.value = "";
  }

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,.tsv"
        className={styles.hidden}
        onChange={handleChange}
      />
      <div className={styles.icon}>📂</div>
      <p className={styles.primary}>Drop your HWMonitor CSV here</p>
      <p className={styles.secondary}>
        or click to browse — .csv / .txt / .tsv
      </p>
    </div>
  );
}
