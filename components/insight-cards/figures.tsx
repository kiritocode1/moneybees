"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import {
  arcPoints,
  barFaces,
  beamPath,
  dialTicks,
  onCircle,
  path,
  pieFaces,
  project,
  SQUASH,
  FRONT_FROM,
  FRONT_TO,
} from "@/components/iso/geometry";

/**
 * The figures are driven by hover, not by mount.
 *
 * Measured off the source capture: a resting card is still. Two frames 3.3s
 * apart differ by a mean of 0.4 grey levels, which is video compression, while
 * the same gap on a hovered card differs by 4.4 to 13.1. Letting a hovered card
 * go does not cut the motion either, it runs down over about 1.2s and freezes
 * wherever it stopped: card two falls from 4.68 to 0.62 within 72 frames of the
 * pointer leaving.
 *
 * So `energy` ramps toward 1 while hovered and decays after, and the clock
 * advances by `dt * energy`. Nothing resets, which is what leaves each figure
 * parked in its last pose instead of snapping back to a start state.
 */
const SPIN_UP = 0.1;
const SPIN_DOWN = 0.38;

export function useFigureFrame(active: boolean, draw: (seconds: number) => void) {
  const drawRef = useRef(draw);
  const activeRef = useRef(active);
  // Synced in effects rather than during render: the rAF loop reads both every
  // frame, and one frame of lag on the hover flag is imperceptible next to the
  // 100ms spin-up.
  useEffect(() => {
    drawRef.current = draw;
  });
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  const clock = useRef(START_PHASE);
  const energy = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion gets one composed pose and no clock at all.
    if (reduceMotion) {
      drawRef.current(1.35);
      return;
    }
    let raf = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      const target = activeRef.current ? 1 : 0;
      const tau = activeRef.current ? SPIN_UP : SPIN_DOWN;
      energy.current += (target - energy.current) * (1 - Math.exp(-dt / tau));
      clock.current += dt * energy.current;
      drawRef.current(clock.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);
}

/**
 * Ground-plane origin per figure, in card coordinates, measured off the capture.
 * They do not share a baseline: the pie's plate sits about 50px above the
 * beacon's dial, and the bar row's ground line lower still.
 */
const CENTRE_X = 225;
const BARS_CENTRE_Y = 398;
const PIE_CENTRE_Y = 375;
const BEACON_CENTRE_Y = 425;

/**
 * The clock does not start at zero. A resting card in the capture is frozen
 * wherever its animation last stopped, never in a blank pose, so the figures
 * open part-way through a cycle with a wedge lit and the beam off-axis.
 */
const START_PHASE = 1.6;

const easeInOut = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

export type FigureProps = { active: boolean };

/* ================================================================== bars === */

const BAR_HEIGHTS = [92, 110, 74, 104, 58, 36, 25] as const;
const BAR_SIZE = 27;
/**
 * The row is placed in screen space rather than along a plan axis. In the
 * capture it falls about 11px for every 48px it travels right, shallower than
 * either horizontal axis of this projection gives on its own.
 */
const ROW_DX = 37;
const ROW_DY = 9;
/** Out and back are not symmetric in the capture: about 1.0s then about 0.62s. */
const SWEEP_OUT = 1.0;
const SWEEP_BACK = 0.62;

export function BarsFigure({ active }: FigureProps) {
  const topsRef = useRef<(SVGPathElement | null)[]>([]);
  const markerRef = useRef<SVGGElement | null>(null);

  const last = BAR_HEIGHTS.length - 1;
  const rowX = (i: number) => (i - last / 2) * ROW_DX;
  const rowY = (i: number) => (i - last / 2) * ROW_DY;

  useFigureFrame(active, (t) => {
    const cycle = SWEEP_OUT + SWEEP_BACK;
    const phase = t % cycle;
    const progress =
      phase < SWEEP_OUT
        ? easeInOut(phase / SWEEP_OUT)
        : 1 - easeInOut((phase - SWEEP_OUT) / SWEEP_BACK);
    const position = progress * last;

    for (let i = 0; i <= last; i += 1) {
      const el = topsRef.current[i];
      if (!el) continue;
      // Reddens as the marker arrives rather than switching, so the row does not
      // flicker as the marker crosses a boundary.
      el.style.opacity = Math.max(0, 1 - Math.abs(position - i) * 1.7).toFixed(3);
    }

    const marker = markerRef.current;
    if (!marker) return;
    const low = Math.floor(position);
    const high = Math.min(last, low + 1);
    const blend = position - low;
    const height = BAR_HEIGHTS[low] + (BAR_HEIGHTS[high] - BAR_HEIGHTS[low]) * blend;
    const [lx, ly] = project(BAR_SIZE / 2, BAR_SIZE / 2, height + 40);
    marker.setAttribute(
      "transform",
      `translate(${(rowX(position) + lx).toFixed(2)} ${(rowY(position) + ly).toFixed(2)})`,
    );
  });

  const bars = BAR_HEIGHTS.map((height, i) => ({
    i,
    faces: barFaces(0, 0, BAR_SIZE, height),
    x: rowX(i),
    y: rowY(i),
  }));

  return (
    <g transform={`translate(${CENTRE_X} ${BARS_CENTRE_Y})`}>
      <path
        className="fig-ground"
        d={path(
          [
            [rowX(-0.6), rowY(-0.6)],
            [rowX(last + 1.2), rowY(last + 1.2)],
          ],
          false,
        )}
        strokeDasharray="1 6"
      />
      {/* Near bars paint over far ones, and the near end of this row is the
          right-hand one, so the list is drawn left to right. */}
      {bars.map(({ i, faces, x, y }) => (
        <g key={i} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
          <path className="fig-face" d={faces.left} />
          <path className="fig-face fig-face--lit" d={faces.right} />
          <path className="fig-face" d={faces.top} />
          <path
            className="fig-accent-face"
            d={faces.top}
            style={{ opacity: 0 }}
            ref={(el) => {
              topsRef.current[i] = el;
            }}
          />
        </g>
      ))}
      <g ref={markerRef}>
        <circle className="fig-marker-glow" r="40" />
        <circle className="fig-marker" r="12" />
      </g>
    </g>
  );
}

/* =================================================================== pie === */

const PIE_SPANS = [0.28, 0.21, 0.17, 0.14, 0.12, 0.08] as const;
const PIE_RADIUS = 130;
const PIE_THICKNESS = 22;
/** Every wedge is eased apart a little; the highlighted one much further. */
const PIE_EXPLODE = 4;
const PIE_EXPLODE_LIT = 26;
/** Roughly 18 degrees a second while running, about a 20s revolution. */
const PIE_SPIN = (18 * Math.PI) / 180;
const PIE_DWELL = 2.4;
const PIE_FADE = 0.55;
/** How far the highlighted wedge rises out of the plate. */
const PIE_LIFT = 26;

export function PieFigure({ active }: FigureProps) {
  const groupRef = useRef<SVGGElement | null>(null);
  const wedgeRefs = useRef<(SVGGElement | null)[]>([]);

  useFigureFrame(active, (t) => {
    const spin = t * PIE_SPIN;
    const cycle = PIE_SPANS.length * PIE_DWELL;
    const lit = Math.floor((t % cycle) / PIE_DWELL);
    const intoDwell = (t % cycle) - lit * PIE_DWELL;

    let cursor = spin;
    const drawn = PIE_SPANS.map((span, i) => {
      const from = cursor;
      const to = cursor + span * Math.PI * 2;
      cursor = to;
      const rising = Math.min(1, intoDwell / PIE_FADE);
      const falling = Math.min(1, (PIE_DWELL - intoDwell) / PIE_FADE);
      const strength = i === lit ? Math.max(0, Math.min(rising, falling)) : 0;
      return {
        index: i,
        strength,
        faces: pieFaces(
          from,
          to,
          PIE_RADIUS,
          PIE_THICKNESS,
          PIE_EXPLODE + strength * PIE_EXPLODE_LIT,
          strength * PIE_LIFT,
        ),
      };
    });

    for (const { index, faces, strength } of drawn) {
      const wedge = wedgeRefs.current[index];
      if (!wedge) continue;
      // Six children: each face plus an accent copy that fades in over it, so
      // a highlighted wedge turns red on its walls as well as its top rather
      // than sitting as a red lid on a neutral solid.
      const [rim, rimLit, cut, cutLit, top, topLit] =
        wedge.children as unknown as SVGPathElement[];
      const alpha = strength.toFixed(3);
      rim.setAttribute("d", faces.rim);
      rimLit.setAttribute("d", faces.rim);
      rimLit.style.opacity = alpha;
      cut.setAttribute("d", faces.cut);
      cutLit.setAttribute("d", faces.cut);
      cutLit.style.opacity = alpha;
      top.setAttribute("d", faces.top);
      topLit.setAttribute("d", faces.top);
      topLit.style.opacity = alpha;
    }

    // Painter's algorithm. Without re-ordering, far wedges paint over near ones
    // as soon as the plate turns past a quarter.
    const group = groupRef.current;
    if (!group) return;
    for (const { index } of drawn.slice().sort((a, b) => a.faces.depth - b.faces.depth)) {
      const wedge = wedgeRefs.current[index];
      if (wedge) group.appendChild(wedge);
    }
  });

  return (
    <g transform={`translate(${CENTRE_X} ${PIE_CENTRE_Y})`}>
      <ellipse className="fig-bloom" rx={PIE_RADIUS * 0.8} ry={PIE_RADIUS * 0.3} cy={34} />
      <ellipse
        className="fig-ground"
        rx={PIE_RADIUS + 24}
        ry={(PIE_RADIUS + 24) * SQUASH}
        cy={30}
        strokeDasharray="2 9"
      />
      <g ref={groupRef}>
        {PIE_SPANS.map((_, i) => (
          <g
            key={i}
            ref={(el) => {
              wedgeRefs.current[i] = el;
            }}
          >
            <path className="fig-face fig-face--lit" />
            <path className="fig-accent-wall" style={{ opacity: 0 }} />
            <path className="fig-face fig-face--lit" />
            <path className="fig-accent-wall" style={{ opacity: 0 }} />
            <path className="fig-face" />
            <path className="fig-accent-face" style={{ opacity: 0 }} />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ================================================================ beacon === */

/*
 * Taken off the tower silhouette in frame 544, where the card is lit and the
 * beam points away so nothing overlaps the solid. Widths are read from the
 * widest row of each part; heights are that row's distance above the dial
 * centre line, which is z = 0.
 */
const DIAL_RADIUS = 116;
const DIAL_TICK_COUNT = 24;
const COLLAR_RADIUS = 30.5;
const COLLAR_TOP = 14;
const SHAFT_RADIUS = 21.5;
const SHAFT_TOP = 137;
const GALLERY_RADIUS = 28.5;
const GALLERY_TOP = 145;
const LAMP_RADIUS = 13.5;
const LAMP_TOP = 174;
const ROOF_RADIUS = 20.5;
const ROOF_BASE = 174;
const DIAL_TICK_LENGTH = 12;
const ROOF_APEX = 198;
const BEAM_SPREAD = 0.28;
/** One revolution every six seconds while running. */
const BEAM_PERIOD = 6;

/** The viewer-facing half of a cylinder wall, from `top` down to `bottom`. */
function cylinderWall(radius: number, bottom: number, top: number) {
  return path([
    ...arcPoints(radius, FRONT_FROM, FRONT_TO, top, 24),
    ...arcPoints(radius, FRONT_TO, FRONT_FROM, bottom, 24),
  ]);
}

export function BeaconFigure({ active }: FigureProps) {
  const beamRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const tickRefs = useRef<(SVGPathElement | null)[]>([]);

  useFigureFrame(active, (t) => {
    const angle = (t / BEAM_PERIOD) * Math.PI * 2;
    // Facing is +1 pointing at the viewer, -1 pointing away, where the tower
    // itself hides the cone.
    const visible = Math.max(0, Math.min(1, (Math.sin(angle) + 0.5) / 0.55));

    const beam = beamRef.current;
    if (beam) {
      beam.setAttribute("d", beamPath(0, 0, (GALLERY_TOP + LAMP_TOP) / 2, angle, BEAM_SPREAD, DIAL_RADIUS));
      beam.style.opacity = visible.toFixed(3);
    }

    const dot = dotRef.current;
    if (dot) {
      const [x, y] = onCircle(DIAL_RADIUS - 7, angle, 0);
      dot.setAttribute("cx", x.toFixed(2));
      dot.setAttribute("cy", y.toFixed(2));
      dot.style.opacity = visible.toFixed(3);
    }

    for (let i = 0; i < DIAL_TICK_COUNT; i += 1) {
      const el = tickRefs.current[i];
      if (!el) continue;
      const tickAngle = (i / DIAL_TICK_COUNT) * Math.PI * 2;
      const delta = Math.abs(((tickAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      el.style.opacity = (0.4 + 0.6 * Math.max(0, 1 - (Math.PI - delta) * 3.2)).toFixed(3);
    }
  });

  const ticks = dialTicks(DIAL_RADIUS, DIAL_TICK_LENGTH, DIAL_TICK_COUNT);

  return (
    <g transform={`translate(${CENTRE_X} ${BEACON_CENTRE_Y})`}>
      <ellipse className="fig-outline" rx={DIAL_RADIUS} ry={DIAL_RADIUS * SQUASH} />
      {ticks.map((tick, i) => (
        <path
          key={i}
          className="fig-tick"
          d={tick.d}
          ref={(el) => {
            tickRefs.current[i] = el;
          }}
        />
      ))}
      <ellipse
        className="fig-ground"
        rx={DIAL_RADIUS - 56}
        ry={(DIAL_RADIUS - 56) * SQUASH}
        strokeDasharray="2 8"
      />
      <circle className="fig-beam-dot" r="4" ref={dotRef} />
      <path className="fig-beam" ref={beamRef} />

      {/* base collar sitting on the dial */}
      <path className="fig-face fig-face--lit" d={cylinderWall(COLLAR_RADIUS, 0, COLLAR_TOP)} />
      <path className="fig-face" d={path(arcPoints(COLLAR_RADIUS, 0, Math.PI * 2, COLLAR_TOP, 40))} />
      {/* shaft */}
      <path className="fig-face fig-face--lit" d={cylinderWall(SHAFT_RADIUS, COLLAR_TOP, SHAFT_TOP)} />
      {/* gallery ring, wider than the shaft, carrying the lamp */}
      <path className="fig-face fig-face--lit" d={cylinderWall(GALLERY_RADIUS, SHAFT_TOP, GALLERY_TOP)} />
      <path className="fig-face" d={path(arcPoints(GALLERY_RADIUS, 0, Math.PI * 2, GALLERY_TOP, 40))} />
      {/* lamp */}
      <path className="fig-lamp-wall" d={cylinderWall(LAMP_RADIUS, GALLERY_TOP, LAMP_TOP)} />
      {/* cone roof, overhanging the lamp it sits on. The base ellipse is drawn
          as its own closed curve so the underside reads as a rim rather than a
          straight cut across the lamp. */}
      <path
        className="fig-face"
        d={path([project(0, 0, ROOF_APEX), ...arcPoints(ROOF_RADIUS, FRONT_TO, FRONT_FROM, ROOF_BASE, 28)])}
      />
      <path
        className="fig-outline"
        d={path(arcPoints(ROOF_RADIUS, FRONT_FROM, FRONT_TO, ROOF_BASE, 28), false)}
      />
    </g>
  );
}
