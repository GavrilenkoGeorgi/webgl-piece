import { MapView } from "../components/Map";
import { Sidebar } from "../components/Sidebar";
import styles from "./MapPage.module.css";

export default function MapPage() {
  return (
    <div className={styles.page}>
      <MapView />
      <Sidebar />
    </div>
  );
}
