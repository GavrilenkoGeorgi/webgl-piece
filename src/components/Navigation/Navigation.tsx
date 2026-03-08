import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";

const LINKS = [
  { to: "/", label: "Map" },
  { to: "/scatter", label: "3D Scatter" },
  { to: "/clusters", label: "Clustered" },
] as const;

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
