// Builds the proposed scale figures. Profile facing right, as in studies 05 to
// 08: a man in a suit, feet at the origin, 98.4 units tall (1 unit = 1.83 cm
// on a 180 cm man). Head, neck and jacket are outline points smoothed with
// Catmull-Rom; arms and legs are generated from joint positions and widths
// (front, back) measured perpendicular to each bone.
// usage: node build.mjs   (writes proposed/*.svg and proposed/figures.json)
import { readFileSync, writeFileSync } from "node:fs";

const f = (n) => {
  const s = (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return s === "-0" ? "0" : s;
};

/** A closed outline through the points; "c" marks a sharp corner. */
function contour(points) {
  const n = points.length;
  const P = (i) => points[(i + n) % n];
  let d = `M${f(P(0)[0])} ${f(P(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    if (p1[2] === "c" && p2[2] === "c") {
      d += `L${f(p2[0])} ${f(p2[1])}`;
      continue;
    }
    const c1 = p1[2] === "c" ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] === "c" ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

const rot = (points, [ox, oy], deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return points.map(([x, y, k]) => [ox + (x - ox) * c - (y - oy) * s, oy + (x - ox) * s + (y - oy) * c, k]);
};
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/**
 * A limb through joints [j0, j1, j2]; widths per bone are [t, front, back]
 * samples. "Front" is the bone's right-hand normal (towards +x for a bone
 * pointing down). Returns the front side top to bottom and the back side
 * bottom to top, ready to be capped.
 */
function limb(joints, widths) {
  const front = [], back = [];
  joints.slice(0, -1).forEach((a, bone) => {
    const b = joints[bone + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len];
    widths[bone].forEach(([t, wf, wb]) => {
      if (bone > 0 && t === 0) return; // the joint was placed by the bone above
      const p = lerp(a, b, t);
      front.push([p[0] + n[0] * wf, p[1] + n[1] * wf]);
      back.push([p[0] - n[0] * wb, p[1] - n[1] * wb]);
    });
  });
  return { front, back: back.reverse() };
}

// Head, upright: nape, the back of the skull under short hair, crown, the
// hair over the forehead, brow, nose, lips, chin, and the jaw to the throat.
const HEAD = [
  [-7.2, -87.6], [-8.6, -89.2], [-9.2, -91.8], [-8.9, -94.8], [-7.2, -97.4], [-4.4, -98.4], [-1.6, -98],
  [0.4, -96.8], [1, -95.6], [0.8, -95], [1.2, -93.6], [1.3, -92.6], [1.1, -91.9], [2.1, -90.1], [1.9, -89.4],
  [1.2, -89.2], [1.4, -88.4], [1.15, -87.8], [1.3, -87.1], [1.1, -86.2], [0.1, -85.5], [-1.6, -85.6],
  [-3.6, -86.4], [-5.2, -87.4],
];
// The neck overlaps the head and the jacket so no seam shows between them.
const NECK = [[-6.8, -89.6, "c"], [-2.6, -88, "c"], [-2.2, -85.8], [-1.2, -83.2], [0.2, -80.4, "c"], [-9, -80.4, "c"], [-8.2, -83], [-7.2, -85.6]];
// Jacket: collar, a flat upper back, the small of the back, the seat, the hem,
// the cut-away front, the button line and the chest up to the shirt collar.
const JACKET = [
  [-8.2, -84.8], [-9.8, -82.4], [-10.6, -79], [-10.7, -74.8], [-10, -68.8], [-9.2, -63.4], [-9.5, -57.4],
  [-10.1, -51.4], [-10.2, -46.6, "c"], [2.2, -47, "c"], [3.8, -49.4], [4, -54.6], [3.8, -60.6], [4.4, -66.8],
  [5, -72.4], [4.6, -76.8], [2.8, -80], [0.4, -81.8], [-2.4, -83.6], [-5.2, -84.8],
];

// Trouser legs. Widths: thigh 9.8 deep at the top, knee 5.8, calf 6.2, hem 5.
const THIGH = [[0, 4.6, 5.2], [0.3, 4.4, 4.8], [0.7, 3.6, 3.6], [1, 2.9, 2.9]];
const SHIN = [[0, 2.9, 2.9], [0.3, 2.6, 3.3], [0.65, 2.3, 2.8], [1, 2.5, 2.5]];
function leg(hip, knee, ankle) {
  const { front, back } = limb([hip, knee, ankle], [THIGH, SHIN]);
  return [...front.map((p, i) => (i === 0 ? [...p, "c"] : p)), [...front.at(-1), "c"], [...back[0], "c"], ...back.slice(1, -1), [...back.at(-1), "c"]];
}
// A dress shoe from the back of the heel at (0, 0): heel, sole, toe cap,
// vamp, and a collar that sits under the trouser hem. The leg ends at ANKLE.
const SHOE = [
  [1.2, -4.8, "c"], [0.1, -3.4], [-0.2, -1.6], [0.3, 0, "c"], [13.1, 0, "c"], [14.2, -0.8], [13.6, -2.1],
  [10.4, -2.9], [6.8, -3.8], [4.6, -4.8, "c"],
];
const ANKLE = [2.6, -3];
const BALL = 10.2;
const place = (points, [x, y]) => points.map(([px, py, k]) => [px + x, py + y, k]);
/** A foot flat on the ground with its heel at x. */
const flat = (x) => ({ shoe: place(SHOE, [x, 0]), ankle: [x + ANKLE[0], ANKLE[1]] });
/** A foot striking with the heel at x, toe raised by deg. */
function heelStrike(x, deg) {
  const turn = (pts) => rot(place(pts, [x, 0]), [x + 0.3, 0], -deg);
  return { shoe: turn(SHOE), ankle: turn([ANKLE])[0] };
}
/** A foot pushing off with the ball at x, heel raised by deg; the toes stay on the ground. */
function pushOff(x, deg) {
  const turn = (pts) => pts.map((p) => (p[0] > BALL ? place([p], [x - BALL, 0])[0] : rot(place([p], [x - BALL, 0]), [x, 0], deg)[0]));
  return { shoe: turn(SHOE), ankle: turn([ANKLE])[0] };
}

// Arms. Widths: sleeve 5 deep at the shoulder, 4.2 at the elbow, cuff 3.
const UPPER = [[0, 2.6, 2.6], [0.5, 2.4, 2.3], [1, 2.1, 2.1]];
const FORE = [[0, 2.1, 2.1], [0.5, 1.9, 1.8], [1, 1.5, 1.5]];
function arm(shoulder, elbow, wrist, hand) {
  const { front, back } = limb([shoulder, elbow, wrist], [UPPER, FORE]);
  if (!hand) return [...front, ...back];
  // The hand: a slightly cupped mitten from the cuff to the fingertips.
  const len = Math.hypot(hand[0] - wrist[0], hand[1] - wrist[1]);
  const d = [(hand[0] - wrist[0]) / len, (hand[1] - wrist[1]) / len], n = [d[1], -d[0]];
  const at = (t, w) => [wrist[0] + d[0] * len * t + n[0] * w, wrist[1] + d[1] * len * t + n[1] * w];
  const fingers = [at(0.35, 1.7), at(0.8, 1.2), at(1, 0.2), at(0.85, -1), at(0.4, -1.4)];
  return [...front, ...fingers, ...back];
}

/** One bone as a tapered capsule, for joints bent too sharply to share an outline. */
function bone(a, b, w0, w1) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n = [d[1], -d[0]];
  const at = (p, w, s = 0) => [p[0] + n[0] * w + d[0] * s, p[1] + n[1] * w + d[1] * s];
  return [at(a, w0), at(b, w1), at(b, w1 * 0.7, w1 * 0.7), at(b, 0, w1), at(b, -w1 * 0.7, w1 * 0.7), at(b, -w1), at(a, -w0), at(a, -w0 * 0.7, -w0 * 0.7), at(a, 0, -w0), at(a, w0 * 0.7, -w0 * 0.7)];
}

const HIP = [-3.4, -47.6];
const SHOULDER = [-3.6, -79.4];

// Standing: weight even, arms relaxed and a little forward so the hand clears the thigh.
const still = flat(-4.6);
const standing = [
  HEAD, NECK, JACKET,
  still.shoe, leg(HIP, [-2.6, -27.4], still.ankle),
  arm(SHOULDER, [-4.2, -62.8], [-1.8, -50.4], [0.4, -42]),
];

// Telescope: head tipped back, the near elbow forward at chest height and the
// fist at the eyepiece; the tube rising 20° to the right in four sections.
const pivot = [-4.6, -86.6];
const tilt = -13;
const eye = rot([[0.6, -92.2]], pivot, tilt)[0];
const ang = (-20 * Math.PI) / 180;
const along = (t, off = 0) => [eye[0] + Math.cos(ang) * t - Math.sin(ang) * off, eye[1] + Math.sin(ang) * t + Math.cos(ang) * off];
const tube = (t0, t1, r0, r1) => [along(t0, -r0), along(t1, -r1), along(t1, r1), along(t0, r0)].map((p) => [...p, "c"]);
// The fist closed round the tube: knuckles over the top, fingers wrapped under.
const FIST = [along(2.4, -1.5), along(4, -1.9), along(5.6, -1.5), along(6.2, 0.4), along(5.6, 2.4), along(3.8, 2.8), along(2.4, 2)];
const wristAt = along(4.2, 3.6);
const scope = [
  rot(HEAD, pivot, tilt), NECK, JACKET,
  still.shoe, leg(HIP, [-2.6, -27.4], still.ankle),
  tube(0.4, 5, 0.75, 0.75), tube(5, 13.2, 1.05, 1.05), tube(13.2, 25.8, 1.4, 1.55), tube(25.2, 28, 1.85, 1.85),
  bone(SHOULDER, [8, -75.2], 2.6, 2.2), bone([8, -75.2], wristAt, 2.1, 1.5), FIST,
];

// Walking: mid-stride, the front heel striking with the toe up, the back heel
// lifted off the ball of the foot; the near arm swings back against the near
// leg, the far arm forward.
const front = heelStrike(6.4, 14);
const back = pushOff(-3.2, 28);
const walker = [
  arm(SHOULDER, [-1.4, -63], [3.6, -51.6], [6.8, -44.6]),
  back.shoe, leg(HIP, [-7.2, -27.8], back.ankle),
  HEAD, NECK, JACKET,
  front.shoe, leg(HIP, [3.4, -27.4], front.ankle),
  arm(SHOULDER, [-7.6, -62.8], [-10.8, -50.4], [-11.6, -41.8]),
];

const parts = { scope, standing, walker };
const paths = Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, v.map(contour)]));
const bbox = Object.fromEntries(
  Object.entries(parts).map(([k, v]) => {
    const pts = v.flat();
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return [k, [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(f)];
  }),
);
const here = (p) => new URL(p, import.meta.url);
writeFileSync(here("./proposed/figures.json"), JSON.stringify({ paths, bbox }, null, 1));

const group = (ds, tf) => `<g transform="${tf}" fill="#000">${ds.map((d) => `<path d="${d}"/>`).join("")}</g>`;
const cur = readFileSync(here("./current/figures.svg"), "utf8").match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
const order = ["scope", "standing", "walker"];

// Large: current above, proposed below.
writeFileSync(here("./proposed/sheet.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="840" viewBox="-20 -120 300 280">
<rect x="-20" y="-120" width="300" height="280" fill="#fff"/>
<text x="-14" y="-110" font-size="5" font-family="Geist Mono" fill="#888">CURRENT</text>${cur}
<text x="-14" y="30" font-size="5" font-family="Geist Mono" fill="#888">PROPOSED</text>
${order.map((k, i) => group(paths[k], `translate(${40 + i * 90} 140)`)).join("")}
</svg>`);

// At the sizes they run at (about 40 px), on the page colour and on orange, beside the study crops.
const s = 40 / 98.4;
const row = (y, bg) => `<rect x="0" y="${y - 50}" width="560" height="64" fill="${bg}"/>
<g transform="translate(40 ${y}) scale(${s})">${cur}</g>
${order.map((k, i) => group(paths[k], `translate(${200 + i * 50} ${y}) scale(${s})`)).join("")}`;
writeFileSync(here("./proposed/small.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="128" viewBox="0 0 560 128">
${row(56, "#fff")}${row(120, "#F6A11A")}
</svg>`);
console.log(JSON.stringify(bbox));
