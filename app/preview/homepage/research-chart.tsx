"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import manifest from "./orange-chart-manifest.json";
import s from "./preview.module.css";

export default function ResearchChart({ progress, stage }: { progress: MotionValue<number>; stage: number }) {
  const imageRef = useRef<SVGImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decoded = new Map<number, Promise<HTMLImageElement>>();
    let request = 0;
    let stopped = false;
    let visible = false;
    let lastIndex = -1;

    function load(index: number) {
      const existing = decoded.get(index);
      if (existing) return existing;
      const image = new Image();
      image.src = manifest.frames[index].src;
      const promise = image.decode().then(() => image);
      decoded.set(index, promise);
      // Keep decoded memory bounded. The browser can reuse the downloaded PNGs.
      if (decoded.size > 12) decoded.delete(decoded.keys().next().value!);
      return promise;
    }

    function paint() {
      if (!visible || stopped) return;
      const value = compact.matches || reduced.matches ? stage / 2 : progress.get();
      const time = Math.min(manifest.end - 0.001, Math.max(manifest.start, value * manifest.end));
      const index = manifest.frames.findIndex(frame => time >= frame.start && time < frame.end);
      if (index < 0 || index === lastIndex) return;
      lastIndex = index;
      const ticket = ++request;
      void load(index).then(image => {
        if (stopped || request !== ticket || !imageRef.current) return;
        imageRef.current.setAttribute("href", image.src);
        svgRef.current?.setAttribute("data-frame", String(index));
      }).catch(() => { if (request === ticket) lastIndex = -1; });
      for (const offset of [-2, -1, 1, 2, 3]) {
        const neighbor = index + offset;
        if (neighbor >= 0 && neighbor < manifest.frames.length) void load(neighbor).catch(() => {});
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) paint();
    }, { rootMargin: "500px" });
    if (svgRef.current) observer.observe(svgRef.current);
    const unsubscribe = progress.on("change", paint);
    compact.addEventListener("change", paint);
    reduced.addEventListener("change", paint);
    return () => {
      stopped = true;
      observer.disconnect();
      unsubscribe();
      compact.removeEventListener("change", paint);
      reduced.removeEventListener("change", paint);
      decoded.clear();
    };
  }, [progress, stage]);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${manifest.width} ${manifest.height}`} preserveAspectRatio="xMidYMid slice" className={s.researchChart} data-frame="0" aria-hidden="true">
      <rect width={manifest.width} height={manifest.height} fill="#e4e4e4" />
      <g transform={`translate(282 270) scale(${manifest.scale}) translate(-282 -270)`}>
        <image ref={imageRef} href={manifest.frames[0].src} width={manifest.width} height={manifest.height} />

      </g>
    </svg>
  );
}
