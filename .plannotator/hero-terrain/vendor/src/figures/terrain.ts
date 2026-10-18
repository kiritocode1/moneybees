import { Cam, clamp, facing, fit, prism, proj, rings, unproj, type Ring } from "../core/iso";
import { reducedMotion, spring, stepS, type Spring } from "../core/motion";
import { makeBee } from "./moneybee-bee";
import { flatDot, mk, place, pointer, put, register, disposer, solid, type FigureMount, type Solid } from "../core/stage";

/**
 * Terrain (Fig 9.2): Fig 0.3's falloff in two dimensions. The pointer is
 * projected back onto the ground, and each of 81 pillars on a rounded plinth
 * takes its height from its radial distance to it, each on its own spring. At
 * rest the field is a designed dune with two rises. A 3 × 3 dot mark rides the
 * lid of the pillar under the pointer, or the peak at rest; pillars above half
 * height take the bright stroke. The slider is the radius, in cells.
 * Ported from the study's `#terrain` (design/lab-hairline/cartilha-v2.html).
 */

const N = 9, CELL = 14, FOOT = 11, HMAX = 58, EXT = N * CELL, PB = 5;

/** Linear's ratios, as a fraction of the radius: 1 → .31 at 42% → .09 at the edge and beyond. */
const falloff = (u: number) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

type Col = { i: number; j: number; h0: number; ring: Ring; inner: Ring; sp: Spring; el: Solid; drawn: number };

export const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.58);
  fit(C, [[-6, -6, -PB], [EXT + 6, EXT + 6, -PB], [EXT + 6, -6, -PB], [-6, EXT + 6, -PB], [0, 0, HMAX * 0.75]], 200, 166);
  const P = proj(C), front = facing(C);
  let R = value * CELL, over: [number, number] | null = null;
  const withBee = stage.dataset.bee === "true";
  const flightX = spring(97, { k: 90, c: 19 });
  const flightY = spring(63, { k: 90, c: 19 });
  const flightZ = spring(44, { k: 110, c: 21 });
  let phase = 0, flightTime = 0, heading = 0;
  let [oldX, oldY] = P(flightX.x, flightY.x, 0);

  const g = mk("g", {}, svg), cols: Col[] = [];
  const [pr, pi] = rings(-6, -6, EXT + 6, EXT + 6, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  // Diagonal by diagonal from the back corner, so appending is painting back to front.
  for (let s = 0; s <= 2 * (N - 1); s++) for (let i = 0; i < N; i++) {
    const j = s - i;
    if (j < 0 || j >= N) continue;
    const u = i / (N - 1), v = j / (N - 1);
    const h0 = 4 + 25 * Math.exp(-((u - 0.22) ** 2 + (v - 0.74) ** 2) / 0.07) + 12 * Math.exp(-((u - 0.8) ** 2 + (v - 0.26) ** 2) / 0.035);
    const x0 = i * CELL + (CELL - FOOT) / 2, y0 = j * CELL + (CELL - FOOT) / 2;
    const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.6, 0.9);
    cols.push({ i, j, h0, ring, inner, sp: spring(h0, { eps: 0.04 }), el: solid(g), drawn: NaN });
  }

  // The mark: a 3 × 3 of dots riding the lid of one pillar, moved in the paint
  // order to just after it, so the pillars in front still cover it.
  const mark = mk("g", {}, g), md: SVGEllipseElement[] = [];
  for (let k = 0; k < 9; k++) md.push(flatDot(mark, C, 0.55, k === 4 ? "dot" : "dot m"));
  const peak = cols.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  const byCell = new Map<string, Col>();
  cols.forEach((c) => byCell.set(c.i + "," + c.j, c));
  let mc: Col | null = null, want = peak;
  const bee = withBee ? mk("g", { "data-terrain-bee": "", "pointer-events": "none" }, svg) : null;
  const shadow = bee ? mk("ellipse", { rx: 7, ry: 2.5, style: "fill:#936013;stroke:none;opacity:.14" }, bee) : null;
  const beeBody = bee ? mk("g", {}, bee) : null;
  const wings = beeBody ? makeBee(beeBody) : null;

  function drawMark() {
    if (want !== mc) { mc = want; mc.el.g.after(mark); }
    const cx = (mc.i + 0.5) * CELL, cy = (mc.j + 0.5) * CELL, h = Math.max(0.6, mc.sp.x);
    md.forEach((el, k) => place(el, P(cx + ((k % 3) - 1) * 2.5, cy + (Math.floor(k / 3) - 1) * 2.5, h)));
  }
  // A pillar whose spring hasn't moved keeps its paths: most of the 81 are still on most frames.
  function drawCol(c: Col) {
    const h = Math.max(0.6, c.sp.x);
    if (h === c.drawn) return;
    c.drawn = h;
    put(c.el, prism(P, front, c.ring, c.inner, 0, h));
    c.el.sil.classList.toggle("hi", h > (withBee && !over ? 18 : HMAX * 0.5));
  }

  const B = register(stage, (dt) => {
    if (withBee) {
      if (!reducedMotion()) flightTime += dt;
      if (!over && !reducedMotion()) phase += dt * 0.32;
      flightX.t = over ? clamp(over[0], 5, EXT - 5) : 63 + Math.cos(phase) * 34;
      flightY.t = over ? clamp(over[1], 5, EXT - 5) : 63 + Math.sin(phase) * 34;
      stepS(flightX, dt);
      stepS(flightY, dt);
      aim([flightX.x, flightY.x], over ? 1.18 : 0.58);
      stage.dataset.flight = over ? "hover" : "idle";
    }
    let m = false;
    for (const c of cols) { if (stepS(c.sp, dt)) m = true; drawCol(c); }
    drawMark();
    if (beeBody && shadow) {
      const height = Math.max(...cols.map((c) => c.sp.x));
      flightZ.t = height + (over ? 19 : 14);
      stepS(flightZ, dt);
      const [x, y] = P(flightX.x, flightY.x, flightZ.x);
      const [groundX, groundY] = P(flightX.x, flightY.x, 0);
      const dx = groundX - oldX, dy = groundY - oldY;
      if (Math.hypot(dx, dy) > 0.05) {
        const desired = Math.atan2(dy, dx);
        const turn = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
        heading += turn * (reducedMotion() ? 1 : 1 - Math.exp(-dt * 7));
      }
      oldX = groundX; oldY = groundY;
      const bob = reducedMotion() ? 0 : Math.sin(flightTime * 7.5) * 1.2;
      beeBody.setAttribute("transform", `translate(${x} ${y + bob}) rotate(${heading * 180 / Math.PI + 52}) scale(${over ? 1.08 : 0.9})`);
      if (wings) {
        const flap = reducedMotion() ? 1 : 0.76 + Math.sin(flightTime * Math.PI * 24) * 0.24;
        wings.left.setAttribute("transform", `translate(532 330) rotate(18) scale(${flap} 1) rotate(-18) translate(-532 -330)`);
        wings.right.setAttribute("transform", `translate(603 378) rotate(54) scale(${flap} 1) rotate(-54) translate(-603 -378)`);
      }
      place(shadow, P(flightX.x, flightY.x, Math.max(0, height - 1)));
    }
    return m || (withBee && !reducedMotion());
  });
  bag.add(B.unregister);
  if (withBee) bag.add(() => stage.removeAttribute("data-flight"));

  function aim(at: [number, number] | null, lift = 1) {
    for (const c of cols) {
      if (!at) { c.sp.t = c.h0; continue; }
      const dx = (c.i + 0.5) * CELL - at[0], dy = (c.j + 0.5) * CELL - at[1];
      c.sp.t = HMAX * lift * falloff(Math.hypot(dx, dy) / R);
    }
    if (at) {
      const i = clamp(Math.floor(at[0] / CELL), 0, N - 1), j = clamp(Math.floor(at[1] / CELL), 0, N - 1);
      want = byCell.get(i + "," + j)!;
      read.textContent = `cell ${i}·${j}`;
    } else { want = peak; read.textContent = "rest"; }
  }

  function retarget() {
    if (!withBee) aim(over);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v * CELL; if (over) retarget(); },
    destroy: bag.dispose,
  };
};
