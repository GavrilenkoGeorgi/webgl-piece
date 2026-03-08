import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import MapPage from "./pages/MapPage";
import ScatterPage from "./pages/ScatterPage";
import QuadScatterPage from "./pages/QuadScatterPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Navigation />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/scatter" element={<ScatterPage />} />
          <Route path="/clusters" element={<QuadScatterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
