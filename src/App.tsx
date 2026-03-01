import { MapView } from "./components/Map";
import { Sidebar } from "./components/Sidebar";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <MapView />
      <Sidebar />
    </div>
  );
}
