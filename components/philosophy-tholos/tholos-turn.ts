import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/*
 * The tholos at Delphi as a model on a turntable, turning slowly, drawn in the anatomy
 * skill's look (skills.wheresryan.sh/anatomy) in its dark theme: an orthographic camera
 * 30° up, near-black fills banded into four tones by how each face meets a light fixed
 * to the camera, a pale silhouette and dim crease lines. Six of its twenty columns, about 60° apart,
 * stand for the six principles; the one turning through the front is lit orange.
 *
 * Truth (delphi.culture.gr, Perseus): Theodoros of Phocaea, 380 to 370 BC; a three-step
 * crepis 14.76 m across; twenty Doric columns 5.93 m tall; architrave, a frieze of
 * triglyphs over every column and every gap; a cella 8.41 m inside; about 13.5 m tall.
 * Units are metres, y up.
 */

/** The six principle columns, in order round the ring (index of the twenty). */
export const PRINCIPLE_COLUMNS = [0, 3, 7, 10, 13, 17] as const;
/** One turn every 48 s, so each principle has about eight seconds at the front. */
const TURN_SECONDS = 48;

const COLUMNS = 20;
const STEPS = [7.38, 7.06, 6.75];
const STEP_H = 0.35;
const STYLOBATE = STEP_H * STEPS.length;
const RC = 6.2;
const SHAFT_H = 5.52;
const R0 = 0.42;
const R1 = 0.33;
const ECHINUS_H = 0.23;
const ABACUS_H = 0.18;
const ABACUS_W = 1.04;
const COLUMN_TOP = STYLOBATE + SHAFT_H + ECHINUS_H + ABACUS_H;
const ARCH_H = 0.62;
const FRIEZE_H = 0.72;
const CORNICE_H = 0.26;
const CELLA_R = 4.6;
const ROOF_LOW = COLUMN_TOP + ARCH_H + FRIEZE_H + CORNICE_H;
const DRUM_TOP = ROOF_LOW + 2.55;

/** The anatomy kit's dark-theme tones, opened a little so the weathering reads: four side shades and the top. */
const STONE = ["#121212", "#171717", "#1d1d1d", "#242424", "#2e2e2e"].map((hex) => new THREE.Color(hex));
/** The lit column glows on the dark, as the kit's lit part does. */
const ORANGE = ["#b8680c", "#d27c12", "#e88f17", "#f39d1b", "#ffb64a"].map((hex) => new THREE.Color(hex));
/** The cella wall seen through the colonnade is a cavity, a step darker, so the columns stand in front of it. */
const DEEP = ["#0b0b0b", "#0f0f0f", "#131313", "#171717", "#1d1d1d"].map((hex) => new THREE.Color(hex));
/** The dark Eleusinian stone course at the foot of the cella wall. */
const DARK = ["#060606", "#080808", "#0a0a0a", "#0c0c0c", "#101010"].map((hex) => new THREE.Color(hex));
/** The kit's dark-theme lines: the silhouette near white, creases at its `lo`, ticks at `mid`. */
const INK = new THREE.Color("#c9c9c9");
const CREASE = new THREE.Color("#434343");
const CREASE_LIT = new THREE.Color("#ffd08a");
const TICK = new THREE.Color("#6a6a6a");

/* ------------------------------------------------------------ materials --- */

const TONE_VERTEX = `
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

/**
 * Four side tones by facing a light fixed to the camera, white on anything facing up; `uLit`
 * eases toward orange. Then the stone weathers, in the turntable's own frame so the wear turns
 * with the building: mottling, a warm patina, rain streaks down from under the entablature,
 * rising damp at the foot and sparse hairline cracks. With `uBanded` every column drum is its
 * own stone, warmer or whiter, as the restored columns at Delphi are. The stand doesn't weather.
 */
const TONE_FRAGMENT = `
uniform vec3 uStone[5];
uniform vec3 uOrange[5];
uniform vec3 uLight;
uniform float uLit;
uniform float uAngle;
uniform float uBanded;
uniform float uWeather;
varying vec3 vNormal;
varying vec3 vWorld;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 n = normalize(vNormal);
  float d = dot(n, uLight);
  int band = n.y > 0.72 ? 4 : d > 0.45 ? 3 : d > 0.12 ? 2 : d > -0.22 ? 1 : 0;
  vec3 stone = uStone[0];
  vec3 orange = uOrange[0];
  for (int i = 1; i < 5; i++) {
    if (i == band) { stone = uStone[i]; orange = uOrange[i]; }
  }
  vec3 c = mix(stone, orange, uLit);

  // The point in the turntable's frame, so the wear stays on the stone as it turns.
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec3 p = vec3(vWorld.x * ca - vWorld.z * sa, vWorld.y, vWorld.x * sa + vWorld.z * ca);
  float side = 1.0 - smoothstep(0.55, 0.92, abs(n.y));
  float ang = atan(p.z, p.x);

  float shade = 1.0 + (fbm(p * 1.6) - 0.5) * 0.2;
  float patina = smoothstep(0.38, 0.72, fbm(p * 0.55 + 7.0)) * side;
  if (uBanded > 0.5) {
    float column = floor(ang / (6.2831853 / 20.0) + 0.5);
    float drum = floor((p.y - STYLOBATE) / DRUM_H);
    float h = hash(vec3(column, drum, 3.1));
    shade *= 0.9 + 0.17 * h;
    patina = max(patina, smoothstep(0.5, 0.7, h) * side);
  }
  float streakZone = smoothstep(COLUMN_TOP - 3.6, COLUMN_TOP - 0.2, p.y) * step(p.y, COLUMN_TOP + 0.05) * side;
  float streak = pow(noise(vec3(ang * 38.0, p.y * 0.3, 1.7)), 2.6) * streakZone;
  float damp = (1.0 - smoothstep(STYLOBATE - 0.3, STYLOBATE + 1.6, p.y)) * (0.5 + 0.5 * fbm(p * 2.4)) * side;
  float crack = (1.0 - smoothstep(0.0, 0.03, abs(noise(p * 3.2 + 11.0) - 0.5))) * step(0.64, fbm(p * 0.7 + 3.0)) * side;
  // Up-facing stone, the roofs and treads, gathers lichen and dirt in patches.
  float lichen = smoothstep(0.4, 0.68, fbm(p * 0.9 + 19.0)) * (1.0 - side);
  // On the roofs each run of tiles between two battens has weathered on its own.
  if (p.y > ROOF_LOW) {
    float tile = hash(vec3(floor(ang / (6.2831853 / 60.0)), floor(length(p.xz) * 2.2), 5.3));
    shade *= 0.9 + 0.12 * tile;
    lichen = max(lichen, smoothstep(0.72, 0.95, tile) * 0.8);
  }

  vec3 weathered = mix(c, c * vec3(0.8, 0.7, 0.52), patina * 0.75) * shade;
  weathered *= 1.0 - 0.5 * streak - 0.3 * damp - 0.45 * crack;
  weathered = mix(weathered, weathered * vec3(0.76, 0.78, 0.66), lichen * 0.6);
  gl_FragColor = vec4(mix(c, weathered, uWeather), 1.0);
  #include <colorspace_fragment>
}`;

type ToneOptions = { tones?: THREE.Color[]; banded?: boolean; weather?: boolean; angle?: { value: number } };

function toneMaterial(light: THREE.Vector3, { tones = STONE, banded = false, weather = true, angle = { value: 0 } }: ToneOptions = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uStone: { value: tones },
      uOrange: { value: ORANGE },
      uLight: { value: light },
      uLit: { value: 0 },
      uAngle: angle,
      uBanded: { value: banded ? 1 : 0 },
      uWeather: { value: weather ? 1 : 0 },
    },
    defines: { STYLOBATE: STYLOBATE.toFixed(4), COLUMN_TOP: COLUMN_TOP.toFixed(4), DRUM_H: (SHAFT_H / 5).toFixed(4), ROOF_LOW: (ROOF_LOW - 0.02).toFixed(4) },
    vertexShader: TONE_VERTEX,
    fragmentShader: TONE_FRAGMENT,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
}

/** The silhouette: back faces pushed out along their normals by a fixed width, drawn in ink. */
const HULL_VERTEX = `
uniform float uWidth;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uWidth, 1.0);
}`;
const HULL_FRAGMENT = `
uniform vec3 uInk;
void main() {
  gl_FragColor = vec4(uInk, 1.0);
  #include <colorspace_fragment>
}`;

function hullMaterial(width: number) {
  return new THREE.ShaderMaterial({ uniforms: { uWidth: { value: width }, uInk: { value: INK } }, vertexShader: HULL_VERTEX, fragmentShader: HULL_FRAGMENT, side: THREE.BackSide });
}

/* ------------------------------------------------------------- geometry --- */

/** A turned profile of [radius, height] points, closed or open, `segments` round. */
function lathe(profile: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}

/** A ring band from `rIn` to `rOut`, `h` tall, standing on `y`. */
function ring(rIn: number, rOut: number, y: number, h: number, segments = 160) {
  return lathe([[rIn, y], [rOut, y], [rOut, y + h], [rIn, y + h], [rIn, y]], segments);
}

/** The shaft: twenty flutes meeting in sharp arrises, tapering with a slight swell. */
function flutedShaft() {
  const flutes = 20;
  const perFlute = 8;
  const radial = flutes * perFlute;
  const rows = 40;
  const positions: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const t = j / rows;
    const y = SHAFT_H * t;
    const radius = R0 + (R1 - R0) * t + 0.012 * Math.sin(Math.PI * t);
    for (let i = 0; i <= radial; i++) {
      const a = (i / radial) * Math.PI * 2;
      const u = (i % perFlute) / perFlute;
      const r = radius * (1 - 0.055 * Math.sin(Math.PI * u));
      positions.push(r * Math.cos(a), y, r * Math.sin(a));
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < radial; i++) {
      const a = j * (radial + 1) + i;
      const b = a + radial + 1;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

/** Drum joints, four seams up the shaft for five drums, and the three incised rings of the necking under the capital. */
function drumSeams() {
  const points: THREE.Vector3[] = [];
  const heights = [1, 2, 3, 4].map((k) => (SHAFT_H * k) / 5).concat([SHAFT_H - 0.3, SHAFT_H - 0.34, SHAFT_H - 0.38]);
  for (const y of heights) {
    const t = y / SHAFT_H;
    const radius = (R0 + (R1 - R0) * t + 0.012 * Math.sin(Math.PI * t)) * 1.002;
    for (let i = 0; i < 64; i++) {
      const a0 = (i / 64) * Math.PI * 2;
      const a1 = ((i + 1) / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(radius * Math.cos(a0), y, radius * Math.sin(a0)), new THREE.Vector3(radius * Math.cos(a1), y, radius * Math.sin(a1)));
    }
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

/** The echinus flaring from the shaft's top to under the abacus, on three annulets. */
function capital() {
  const echinus: [number, number][] = [[0.001, 0], [R1, 0]];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    echinus.push([R1 + 0.19 * Math.sin((Math.PI / 2) * t) ** 0.8, 0.05 + (ECHINUS_H - 0.05) * t]);
  }
  echinus.push([0.001, ECHINUS_H]);
  const echinusGeo = lathe(echinus, 48);
  const abacus = new THREE.BoxGeometry(ABACUS_W, ABACUS_H, ABACUS_W);
  abacus.translate(0, ECHINUS_H + ABACUS_H / 2, 0);
  return { echinus: echinusGeo, abacus };
}

/** Forty triglyphs round the frieze, each three bars standing proud of the metopes. */
function triglyphs(y: number) {
  const parts: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * Math.PI * 2 + Math.PI / 20 / 2 - Math.PI / 40;
    for (const offset of [-0.12, 0, 0.12]) {
      const bar = new THREE.BoxGeometry(0.09, FRIEZE_H - 0.06, 0.06);
      bar.translate(offset, y + FRIEZE_H / 2, 6.72);
      bar.rotateY(-a + Math.PI / 2);
      parts.push(bar);
    }
  }
  return mergeGeometries(parts);
}

/** Tile battens running down a cone from `r0` at `y0` to `r1` at `y1`. */
function battens(count: number, r0: number, y0: number, r1: number, y1: number) {
  const parts: THREE.BufferGeometry[] = [];
  const length = Math.hypot(r0 - r1, y1 - y0);
  const tilt = Math.atan2(y1 - y0, r0 - r1);
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    const batten = new THREE.BoxGeometry(length, 0.07, 0.08);
    // Tilt the outer end down the slope.
    batten.rotateZ(-tilt);
    batten.translate((r0 + r1) / 2, (y0 + y1) / 2 + 0.035, 0);
    batten.rotateY(-a);
    parts.push(batten);
  }
  return mergeGeometries(parts);
}

/** `count` copies of a part placed round the ring; `make(a)` builds the one at angle `a` (radians, from +x toward +z). */
function around(count: number, phase: number, make: (a: number) => THREE.BufferGeometry) {
  return mergeGeometries(Array.from({ length: count }, (_, k) => make(((k + phase) / count) * Math.PI * 2)));
}

/** Joint lines, as pairs of points for one LineSegments. */
function circle(points: THREE.Vector3[], r: number, y: number, segments = 160) {
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(r * Math.cos(a0), y, r * Math.sin(a0)), new THREE.Vector3(r * Math.cos(a1), y, r * Math.sin(a1)));
  }
}
function verticals(points: THREE.Vector3[], r: number, y0: number, y1: number, count: number, phase: number) {
  for (let k = 0; k < count; k++) {
    const a = ((k + phase) / count) * Math.PI * 2;
    points.push(new THREE.Vector3(r * Math.cos(a), y0, r * Math.sin(a)), new THREE.Vector3(r * Math.cos(a), y1, r * Math.sin(a)));
  }
}
function radials(points: THREE.Vector3[], r0: number, r1: number, y: number, count: number, phase: number) {
  for (let k = 0; k < count; k++) {
    const a = ((k + phase) / count) * Math.PI * 2;
    points.push(new THREE.Vector3(r0 * Math.cos(a), y, r0 * Math.sin(a)), new THREE.Vector3(r1 * Math.cos(a), y, r1 * Math.sin(a)));
  }
}

/** A soft round shadow for under the base, as the kit puts a halo under every plate. */
function shadowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.18, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(0,0,0,0.7)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.35)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

/* ---------------------------------------------------------------- scene --- */

export type TholosTurn = {
  resize(width: number, height: number): void;
  /** Draws a frame `seconds` after the last one; returns the principle now at the front (0 to 5). */
  frame(seconds: number): number;
  dispose(): void;
};

export function createTholosTurn(canvas: HTMLCanvasElement, { still = false }: { still?: boolean } = {}): TholosTurn {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  // The anatomy camera: azimuth 45°, elevation 30°.
  const azimuth = Math.PI / 4;
  const elevation = Math.PI / 6;
  const target = new THREE.Vector3(0, 5.2, 0);
  camera.position.set(Math.cos(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.sin(azimuth) * Math.cos(elevation)).multiplyScalar(60).add(target);
  camera.lookAt(target);
  // The light is fixed to the camera, up and to the left, as the kit's is.
  const toViewer = camera.position.clone().sub(target).normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), toViewer).normalize();
  const light = new THREE.Vector3().addScaledVector(right, -0.75).addScaledVector(new THREE.Vector3(0, 1, 0), 0.9).addScaledVector(toViewer, 0.55).normalize();

  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(item: T) => (disposables.push(item), item);
  const hull = keep(hullMaterial(0.035));
  const crease = keep(new THREE.LineBasicMaterial({ color: CREASE }));
  const ink = keep(new THREE.LineBasicMaterial({ color: TICK }));
  // Every stone material reads the turn from one shared uniform.
  const turnAngle = { value: 0 };
  const stone = keep(toneMaterial(light, { angle: turnAngle }));
  const stand = keep(toneMaterial(light, { weather: false }));
  const columnStone = keep(toneMaterial(light, { banded: true, angle: turnAngle }));

  /** A solid: tone fill, ink silhouette (unless `outline` is off) and faint creases over `threshold` degrees. */
  function solid(geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial = stone, threshold = 30, lines: THREE.LineBasicMaterial = crease, outline = true) {
    keep(geometry);
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, material));
    if (outline) group.add(new THREE.Mesh(geometry, hull));
    group.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(geometry, threshold)), lines));
    return group;
  }

  const shadow = new THREE.Mesh(keep(new THREE.PlaneGeometry(23, 23)), keep(new THREE.MeshBasicMaterial({ map: keep(shadowTexture()), transparent: true, depthWrite: false })));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.9;
  scene.add(shadow);
  // The base puck stays still; the platter and everything on it turns.
  scene.add(solid(new THREE.CylinderGeometry(8.6, 8.75, 0.55, 160).translate(0, -0.575, 0), stand));
  const turn = new THREE.Group();
  scene.add(turn);
  turn.add(solid(new THREE.CylinderGeometry(8.2, 8.2, 0.3, 160).translate(0, -0.15, 0), stand));
  const ticks: THREE.Vector3[] = [];
  for (let k = 0; k < 72; k++) {
    const a = (k / 72) * Math.PI * 2;
    const r0 = k % 6 === 0 ? 7.55 : 7.8;
    ticks.push(new THREE.Vector3(r0 * Math.cos(a), 0.005, r0 * Math.sin(a)), new THREE.Vector3(8.1 * Math.cos(a), 0.005, 8.1 * Math.sin(a)));
  }
  turn.add(new THREE.LineSegments(keep(new THREE.BufferGeometry().setFromPoints(ticks)), ink));

  // Crepis.
  STEPS.forEach((r, i) => turn.add(solid(new THREE.CylinderGeometry(r, r, STEP_H, 160).translate(0, STEP_H * i + STEP_H / 2, 0))));

  // Cella wall in the cavity tones, on its course of dark Eleusinian stone; the upper drum above the roof is in the light.
  const deep = keep(toneMaterial(light, { tones: DEEP, angle: turnAngle }));
  turn.add(solid(new THREE.CylinderGeometry(CELLA_R, CELLA_R, ROOF_LOW + 0.95 - STYLOBATE, 120, 1, true).translate(0, (ROOF_LOW + 0.95 + STYLOBATE) / 2, 0), deep));
  turn.add(solid(new THREE.CylinderGeometry(CELLA_R, CELLA_R, DRUM_TOP - ROOF_LOW - 0.95, 120, 1, true).translate(0, (DRUM_TOP + ROOF_LOW + 0.95) / 2, 0)));
  turn.add(solid(new THREE.CylinderGeometry(CELLA_R + 0.03, CELLA_R + 0.03, 0.5, 120, 1, true).translate(0, STYLOBATE + 0.25, 0), keep(toneMaterial(light, { tones: DARK, angle: turnAngle }))));
  // The doorway, between two columns: a dark opening framed by jambs and a lintel.
  const doorway = new THREE.Group();
  doorway.add(new THREE.Mesh(keep(new THREE.BoxGeometry(1.36, 3.3, 0.02).translate(0, STYLOBATE + 0.5 + 1.65, CELLA_R + 0.035)), keep(new THREE.MeshBasicMaterial({ color: "#030303" }))));
  for (const x of [-0.76, 0.76]) doorway.add(solid(new THREE.BoxGeometry(0.16, 3.42, 0.14).translate(x, STYLOBATE + 0.5 + 1.71, CELLA_R + 0.07)));
  doorway.add(solid(new THREE.BoxGeometry(1.9, 0.24, 0.16).translate(0, STYLOBATE + 0.5 + 3.54, CELLA_R + 0.08)));
  doorway.rotation.y = Math.PI / 20;
  turn.add(doorway);

  // Columns.
  const shaft = keep(flutedShaft());
  const seams = keep(drumSeams());
  const { echinus, abacus } = capital();
  keep(echinus);
  keep(abacus);
  const shaftEdges = keep(new THREE.EdgesGeometry(shaft, 24));
  const echinusEdges = keep(new THREE.EdgesGeometry(echinus, 30));
  const abacusEdges = keep(new THREE.EdgesGeometry(abacus, 30));
  const lit: { material: THREE.ShaderMaterial; lines: THREE.LineBasicMaterial; angle: number }[] = [];
  for (let n = 0; n < COLUMNS; n++) {
    const angle = (n / COLUMNS) * Math.PI * 2;
    const principle = PRINCIPLE_COLUMNS.indexOf(n as (typeof PRINCIPLE_COLUMNS)[number]);
    const material = principle >= 0 ? keep(toneMaterial(light, { banded: true, angle: turnAngle })) : columnStone;
    const lines = principle >= 0 ? keep(new THREE.LineBasicMaterial({ color: CREASE.clone() })) : crease;
    const column = new THREE.Group();
    column.position.set(RC * Math.cos(angle), STYLOBATE, RC * Math.sin(angle));
    column.rotation.y = -angle;
    const shaftGroup = new THREE.Group();
    shaftGroup.add(new THREE.Mesh(shaft, material), new THREE.Mesh(shaft, hull), new THREE.LineSegments(shaftEdges, lines), new THREE.LineSegments(seams, lines));
    column.add(shaftGroup);
    const top = new THREE.Group();
    top.position.y = SHAFT_H;
    top.add(new THREE.Mesh(echinus, material), new THREE.Mesh(echinus, hull), new THREE.LineSegments(echinusEdges, lines));
    top.add(new THREE.Mesh(abacus, material), new THREE.Mesh(abacus, hull), new THREE.LineSegments(abacusEdges, lines));
    column.add(top);
    turn.add(column);
    if (principle >= 0) lit[principle] = { material, lines, angle };
  }

  // Entablature: architrave and its taenia, the frieze with its triglyphs, the cornice.
  const zF = COLUMN_TOP + ARCH_H;
  const zC = zF + FRIEZE_H;
  turn.add(solid(ring(5.68, 6.72, COLUMN_TOP, ARCH_H - 0.07)));
  turn.add(solid(ring(5.68, 6.77, zF - 0.07, 0.07)));
  turn.add(solid(ring(5.68, 6.69, zF, FRIEZE_H)));
  turn.add(solid(triglyphs(zF), stone, 30));
  turn.add(solid(ring(5.6, 6.98, zC, CORNICE_H)));
  // Under each triglyph a regula below the taenia; over each a lion-head spout on the cornice; antefixes on the eaves.
  turn.add(solid(around(40, 0, (a) => new THREE.BoxGeometry(0.34, 0.04, 0.04).translate(0, zF - 0.09, 6.735).rotateY(Math.PI / 2 - a))));
  turn.add(solid(around(40, 0, (a) => new THREE.BoxGeometry(0.13, 0.1, 0.16).translate(0, zC + CORNICE_H * 0.5, 7.02).rotateY(Math.PI / 2 - a))));
  // Five antefixes have fallen from the eaves, as on any old roof.
  const lost = new Set([7, 19, 23, 38, 51]);
  turn.add(solid(mergeGeometries(Array.from({ length: 60 }, (_, k) => k).filter((k) => !lost.has(k)).map((k) => new THREE.BoxGeometry(0.15, 0.24, 0.05).translate(0, ROOF_LOW + 0.12, 6.93).rotateY(Math.PI / 2 - (k / 60) * Math.PI * 2)))));

  // Masonry: block joints on the steps' risers and treads, the stylobate's paving, the wall courses and the metopes.
  const joints: THREE.Vector3[] = [];
  STEPS.forEach((r, i) => {
    const phase = i % 2 === 0 ? 0 : 0.5;
    verticals(joints, r + 0.004, STEP_H * i, STEP_H * (i + 1), 80, phase);
    radials(joints, STEPS[i + 1] ?? CELLA_R, r, STEP_H * (i + 1) + 0.004, i === STEPS.length - 1 ? 40 : 80, phase + 0.25);
  });
  circle(joints, 5.42, STYLOBATE + 0.004);
  for (let y = STYLOBATE + 0.95, course = 0; y < ROOF_LOW + 0.9; y += 0.45, course++) {
    circle(joints, CELLA_R + 0.004, y);
    verticals(joints, CELLA_R + 0.004, y, Math.min(y + 0.45, ROOF_LOW + 0.95), 48, course % 2 ? 0.5 : 0);
  }
  for (let y = ROOF_LOW + 0.95, course = 0; y < DRUM_TOP - 0.3; y += 0.42, course++) {
    if (course > 0) circle(joints, CELLA_R + 0.004, y);
    verticals(joints, CELLA_R + 0.004, y, Math.min(y + 0.42, DRUM_TOP - 0.24), 40, course % 2 ? 0.5 : 0);
  }
  for (let k = 0; k < 40; k++) {
    const mid = ((k + 0.5) / 40) * Math.PI * 2;
    const half = 0.27 / 6.7;
    const r = 6.693;
    const y0 = zF + 0.09;
    const y1 = zC - 0.09;
    const at = (a: number, y: number) => new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a));
    joints.push(at(mid - half, y0), at(mid + half, y0), at(mid + half, y0), at(mid + half, y1), at(mid + half, y1), at(mid - half, y1), at(mid - half, y1), at(mid - half, y0));
  }
  turn.add(new THREE.LineSegments(keep(new THREE.BufferGeometry().setFromPoints(joints)), crease));

  // Roofs: the peristasis roof up to the cella drum, the drum, and the cone over the cella.
  turn.add(solid(lathe([[6.98, ROOF_LOW], [CELLA_R, ROOF_LOW + 0.95]], 160)));
  turn.add(solid(battens(60, 6.9, ROOF_LOW, CELLA_R + 0.05, ROOF_LOW + 0.95), stone, 30, crease, false));
  turn.add(solid(ring(CELLA_R - 0.05, CELLA_R + 0.18, DRUM_TOP - 0.24, 0.24)));
  turn.add(solid(lathe([[CELLA_R + 0.18, DRUM_TOP], [0.001, DRUM_TOP + 1.45]], 160)));
  // The battens stop on a cap ring short of the apex, so they never crowd into a grey blot; a turned finial crowns it.
  const capY = DRUM_TOP + 1.45 * (1 - 1.0 / (CELLA_R + 0.18));
  turn.add(solid(battens(36, CELLA_R + 0.12, DRUM_TOP, 1.0, capY - 0.03), stone, 30, crease, false));
  turn.add(solid(new THREE.CylinderGeometry(1.05, 1.08, 0.16, 64).translate(0, capY + 0.02, 0)));
  const f = capY + 0.1;
  turn.add(solid(lathe([[0.001, f], [0.46, f], [0.46, f + 0.08], [0.22, f + 0.16], [0.3, f + 0.36], [0.13, f + 0.62], [0.17, f + 0.7], [0.001, f + 0.86]], 40)));

  // Start with the first principle's column at the front (column angle minus turn equals the camera's azimuth).
  let angle = -azimuth;
  let front = 0;
  const glow = Array.from({ length: PRINCIPLE_COLUMNS.length }, () => 0);

  /** The principle whose column is nearest the front (the viewer's azimuth) at this turn. */
  const atFront = () => {
    let best = 0;
    let bestCos = -2;
    lit.forEach((column, i) => {
      // Turning by `angle` about y moves a column from `column.angle` to `column.angle - angle`.
      const c = Math.cos(column.angle - angle - azimuth);
      if (c > bestCos) {
        bestCos = c;
        best = i;
      }
    });
    return best;
  };

  return {
    resize(w, h) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      // Fit the base's rim and the finial, projected through the camera, with a margin.
      camera.updateMatrixWorld();
      const view = camera.matrixWorldInverse;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let k = 0; k < 64; k++) {
        const a = (k / 64) * Math.PI * 2;
        for (const y of [-0.85, 0.2]) {
          const v = new THREE.Vector3(8.75 * Math.cos(a), y, 8.75 * Math.sin(a)).applyMatrix4(view);
          minX = Math.min(minX, v.x);
          maxX = Math.max(maxX, v.x);
          minY = Math.min(minY, v.y);
          maxY = Math.max(maxY, v.y);
        }
      }
      maxY = Math.max(maxY, new THREE.Vector3(0, DRUM_TOP + 2.3, 0).applyMatrix4(view).y);
      const pad = 1.06;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      let halfW = ((maxX - minX) / 2) * pad;
      let halfH = ((maxY - minY) / 2) * pad;
      const aspect = w / h;
      if (halfW / halfH > aspect) halfH = halfW / aspect;
      else halfW = halfH * aspect;
      camera.left = cx - halfW;
      camera.right = cx + halfW;
      camera.top = cy + halfH;
      camera.bottom = cy - halfH;
      camera.updateProjectionMatrix();
    },
    frame(seconds) {
      if (!still) angle += (seconds / TURN_SECONDS) * Math.PI * 2;
      turn.rotation.y = angle;
      turnAngle.value = angle;
      front = atFront();
      // The front column eases to orange over about half a second; the others ease back.
      const k = still ? 1 : 1 - Math.exp(-seconds / 0.25);
      lit.forEach((column, i) => {
        glow[i] += ((i === front ? 1 : 0) - glow[i]) * k;
        column.material.uniforms.uLit.value = glow[i];
        column.lines.color.copy(CREASE).lerp(CREASE_LIT, glow[i]);
      });
      renderer.render(scene, camera);
      return front;
    },
    dispose() {
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    },
  };
}
