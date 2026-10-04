"use client";

import { Terrain } from "@lucasmarkes/hairline/react";
import { useId, useState, type CSSProperties } from "react";
import styles from "./hero-terrain.module.css";

/** Hairline owns the geometry and motion. Its raised pillars receive our orange fill. */
export default function HeroTerrain() {
  const gradientId = `terrain-${useId().replace(/:/g, "")}`;
  const [active, setActive] = useState(false);
  const style: CSSProperties & { "--terrain-fill": string; "--terrain-idle-fill": string } = {
    "--terrain-fill": `url(#${gradientId})`,
    "--terrain-idle-fill": `url(#${gradientId}-idle)`,
  };

  return (
    <div className={styles.figure} style={style}>
      <svg className={styles.definitions} aria-hidden="true" width="0" height="0">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6A11A" />
            <stop offset="48%" stopColor="#FFD58F" />
            <stop offset="100%" stopColor="#FFF9EF" />
          </linearGradient>
          <linearGradient id={`${gradientId}-idle`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffcf83" />
            <stop offset="48%" stopColor="#ffe8c3" />
            <stop offset="100%" stopColor="#fffaf2" />
          </linearGradient>
        </defs>
      </svg>
      <Terrain
        theme="light"
        className={styles.terrain}
        data-active={active}
        data-bee="true"
        onRead={(value) => setActive(value !== "rest")}
      />
    </div>
  );
}
