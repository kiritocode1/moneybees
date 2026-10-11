"use client";

import { useEffect, useRef } from "react";
import FactSection, { Bloom, LINE_GLOW, PanelTitle } from "@/components/fact-sections/fact-section";
import { PERIOD_RETURNS, PILLARS } from "@/lib/insights";
import type { DrawnView } from "./tholos-drawn";

/*
 * PREVIEW ONLY. The six pillars as the drawn 3D tholos: three.js renders the
 * model in the site's 2D figure style (./tholos-drawn.ts), and the 2D parts sit
 * around the canvas as SVG, the dashed ground ellipse and bloom behind it and
 * the lit column's leader and label in front, exactly as the pyramid draws
 * them. The ring turns with the scroll itself, not panel by panel.
 */

const ROOF = PILLARS.length;
const SINCE_INCEPTION = PERIOD_RETURNS.find((row) => row.period === "Since Inception");
const MONO = "ui-monospace, Menlo, monospace";

/** Where the viewport's centre line sits among the panels: 0 at the first panel's centre, 1 at the second's, and so on. */
function panelPosition(section: HTMLElement) {
  const centres = [...section.querySelectorAll<HTMLElement>("article[data-part]")].map((article) => {
    const rect = article.getBoundingClientRect();
    return rect.top + rect.height / 2;
  });
  if (centres.length < 2) return 0;
  const line = window.innerHeight / 2;
  if (line <= centres[0]) return (line - centres[0]) / (centres[1] - centres[0]);
  for (let i = 0; i < centres.length - 1; i += 1) {
    if (line < centres[i + 1]) return i + (line - centres[i]) / (centres[i + 1] - centres[i]);
  }
  return centres.length - 1;
}

/** The figure ignores the panel state: it reads the scroll position itself. */
function DrawnFigure({ view }: { view: DrawnView }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const groundRef = useRef<SVGEllipseElement>(null);
  const bloomRef = useRef<SVGEllipseElement>(null);
  const leaderRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = wrapRef.current?.closest("section");
    if (!canvas || !section) return;
    let disposed = false;
    let cleanup = () => {};
    void import("./tholos-drawn").then(({ createDrawnTholos }) => {
      if (disposed) return;
      const tholos = createDrawnTholos(canvas, view);
      let drawnAt = Number.NaN;
      const size = () => {
        tholos.resize(canvas.clientWidth, canvas.clientHeight);
        drawnAt = Number.NaN;
      };
      size();
      const resizer = new ResizeObserver(size);
      resizer.observe(canvas);
      let raf = 0;
      const tick = () => {
        const at = panelPosition(section);
        // NaN after a resize, which no comparison matches, so test for 'not unchanged'.
        if (!(Math.abs(at - drawnAt) <= 1e-4)) {
          drawnAt = at;
          const pose = tholos.frame(at);
          const g = groundRef.current;
          if (g) {
            g.style.display = pose.ground ? "" : "none";
            if (pose.ground) {
              g.setAttribute("cx", String(pose.ground.cx));
              g.setAttribute("cy", String(pose.ground.cy));
              g.setAttribute("rx", String(pose.ground.rx));
              g.setAttribute("ry", String(pose.ground.ry));
            }
          }
          const b = bloomRef.current;
          if (b) {
            b.setAttribute("cx", String(pose.bloom.cx));
            b.setAttribute("cy", String(pose.bloom.cy));
            b.setAttribute("rx", String(pose.bloom.rx));
            b.setAttribute("ry", String(pose.bloom.ry));
            b.style.opacity = String(pose.bloom.opacity);
          }
          const leader = leaderRef.current;
          const label = labelRef.current;
          if (leader && label) {
            const focus = Math.round(Math.min(Math.max(at, 0), ROOF - 1));
            if (pose.lit) {
              const end = pose.lit.right - 132;
              leader.setAttribute("d", `M${pose.lit.x + 26} ${pose.lit.y}H${end}`);
              label.setAttribute("x", String(end + 8));
              label.setAttribute("y", String(pose.lit.y + 4));
              label.textContent = PILLARS[focus].name.toUpperCase();
            }
            leader.style.opacity = pose.lit ? "1" : "0";
            label.style.opacity = pose.lit ? "1" : "0";
          }
        }
        raf = requestAnimationFrame(tick);
      };
      // Only run while the figure is on screen.
      const io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) raf = requestAnimationFrame(tick);
      });
      io.observe(canvas);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizer.disconnect();
        tholos.dispose();
      };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [view]);

  return (
    <div ref={wrapRef} className="relative h-[82svh] w-full max-[900px]:h-full">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <Bloom id="tholos-bloom" />
        </defs>
        <ellipse ref={bloomRef} fill="url(#tholos-bloom)" style={{ opacity: 0, transition: "opacity 400ms ease" }} />
        <ellipse ref={groundRef} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" strokeDasharray="2 9" strokeLinecap="round" />
      </svg>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path ref={leaderRef} stroke="#F6A11A" strokeWidth="1" fill="none" style={{ filter: LINE_GLOW, opacity: 0, transition: "opacity 240ms ease" }} />
        <text ref={labelRef} fontSize="12" fill="#000" fontFamily={MONO} letterSpacing=".04em" style={{ opacity: 0, transition: "opacity 240ms ease" }} />
      </svg>
    </div>
  );
}

const BODY = "mt-[24px] max-w-[34ch] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[clamp(1.1rem,1.4vw,1.35rem)] leading-[1.45] text-[rgba(0,0,0,.78)]";

function PillarPanel({ index }: { index: number }) {
  const pillar = PILLARS[index];
  return (
    <div>
      <PanelTitle size="medium">{pillar.name}</PanelTitle>
      <p className={BODY}>{pillar.text}</p>
    </div>
  );
}

function RoofPanel() {
  return (
    <div>
      {/* Group profile slide 11: "Robust strategy for consistent performance". */}
      <PanelTitle size="medium">Consistent performance</PanelTitle>
      <p className={BODY}>
        {SINCE_INCEPTION?.queenbee.toFixed(2)}% a year since August 2007, against {SINCE_INCEPTION?.benchmark.toFixed(2)}% for the S&amp;P BSE 500 TRI.
        The six principles carry every portfolio we run.
      </p>
    </div>
  );
}

const OutsideFigure = () => <DrawnFigure view="outside" />;
const InsideFigure = () => <DrawnFigure view="inside" />;

export function PillarsDrawnSection({ view = "outside" }: { view?: DrawnView }) {
  return (
    <FactSection
      id="pillars"
      label="Our philosophy"
      heading="Our investment philosophy"
      panels={[...PILLARS.map((_, index) => ({ part: index, content: <PillarPanel index={index} /> })), { part: ROOF, content: <RoofPanel /> }]}
      figure={view === "inside" ? InsideFigure : OutsideFigure}
    />
  );
}
