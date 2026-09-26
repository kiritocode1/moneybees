import * as THREE from "three";

/**
 * The philosophy tholos: six Ionic columns on a stepped round base, and the
 * camera path the section scrolls along. Plain three.js, no scene library.
 *
 * Units are metres-ish. The camera path follows the one sketched on the flat
 * version: down from high on the right, along the ring past each column in
 * turn, then in to the centre.
 */

export const COLUMN_COUNT = 6;
const RING = 3.2;
const STEP_TOP = 0.45;
const MARBLE = new THREE.Color("#f3f1ec");
const ORANGE = new THREE.Color("#F7A11A");
const LINE_INK = new THREE.Color("#000000");
const LINE_LIT = new THREE.Color("#9a6208");

/* ------------------------------------------------------------- path --- */

/** Progress where the descent ends and the orbit begins, and where the orbit hands over to the centre. */
export const DESCENT_END = 0.14;
export const ORBIT_END = 0.86;
const START_ANGLE = Math.PI / 4;
const ORBIT_RADIUS = 9.8;
/** Each column sits a little ahead of the camera at its pillar's moment, so it is seen three-quarter on. */
const LEAD = 0.26;

export const columnAngle = (index: number) => START_ANGLE - ((index + 0.5) * Math.PI * 2) / COLUMN_COUNT - LEAD;

/** The scroll progress at which pillar `index` is centred on screen. */
export const pillarCentre = (index: number) => DESCENT_END + ((index + 0.5) / COLUMN_COUNT) * (ORBIT_END - DESCENT_END);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smoothstep = (a: number, b: number, value: number) => {
  const t = clamp01((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function bezier(a: THREE.Vector3, control: THREE.Vector3, b: THREE.Vector3, t: number) {
  const u = 1 - t;
  return new THREE.Vector3()
    .addScaledVector(a, u * u)
    .addScaledVector(control, 2 * u * t)
    .addScaledVector(b, t * t);
}

function orbitPose(progress: number) {
  const s = clamp01((progress - DESCENT_END) / (ORBIT_END - DESCENT_END));
  const angle = START_ANGLE - s * Math.PI * 2;
  // Within each pillar's stretch the camera rises from the base toward the capital and back down.
  const local = (s * COLUMN_COUNT) % 1;
  const lift = 0.5 - 0.5 * Math.cos(Math.PI * 2 * local);
  // It also pushes in toward the column as it passes, then eases back out.
  const radius = ORBIT_RADIUS - 0.7 * lift;
  const position = new THREE.Vector3(radius * Math.cos(angle), 1.6 + 1.2 * lift, radius * Math.sin(angle));
  // Aim just inside the ring, a little behind the lit column, so the column
  // stands right of centre and the pillar text on the left stays clear.
  const aim = angle - 0.08;
  const target = new THREE.Vector3(RING * 0.55 * Math.cos(aim), 2.7 + 1.0 * lift, RING * 0.55 * Math.sin(aim));
  return { position, target };
}

const OPENING = new THREE.Vector3(9, 10.5, 9);
const OPENING_TARGET = new THREE.Vector3(0, 2.2, 0);
const DESCENT_BEND = new THREE.Vector3(9.4, 4.2, 6.6);
const CENTRE = new THREE.Vector3(0, 2.1, 0);
/** Level, across the ring, as the camera reaches the centre. */
const CENTRE_TARGET = new THREE.Vector3(-3 * Math.cos(START_ANGLE), 2.3, -3 * Math.sin(START_ANGLE));
/** Then straight up over the centre, looking down on the whole ring. */
const OVERHEAD = new THREE.Vector3(0, 15, 0);
const FLOOR = new THREE.Vector3(0, 0, 0);
/** "Up" on screen for the overhead shot: the direction the camera was travelling. */
export const OVERHEAD_UP = new THREE.Vector3(-Math.cos(START_ANGLE), 0, -Math.sin(START_ANGLE));
const OPENING_LENS = 36;
const ORBIT_LENS = 44;
const CLOSING_LENS = 40;

/** Field of view at `progress`, before the narrow-screen widening. */
export function lensAt(progress: number) {
  if (progress <= DESCENT_END) return OPENING_LENS + (ORBIT_LENS - OPENING_LENS) * easeInOut(clamp01(progress / DESCENT_END));
  if (progress <= ORBIT_END) return ORBIT_LENS;
  return ORBIT_LENS + (CLOSING_LENS - ORBIT_LENS) * easeInOut(clamp01((progress - ORBIT_END) / (1 - ORBIT_END)));
}

/** Where the camera is, and what it looks at, at scroll `progress` from 0 to 1. */
export function cameraPose(progress: number) {
  if (progress <= DESCENT_END) {
    const t = easeInOut(clamp01(progress / DESCENT_END));
    const end = orbitPose(DESCENT_END);
    return { position: bezier(OPENING, DESCENT_BEND, end.position, t), target: OPENING_TARGET.clone().lerp(end.target, t), rise: 0 };
  }
  if (progress <= ORBIT_END) return { ...orbitPose(progress), rise: 0 };
  const t = clamp01((progress - ORBIT_END) / (1 - ORBIT_END));
  const start = orbitPose(ORBIT_END);
  if (t < 0.5) {
    // In through the gap between two columns to the centre of the ring.
    const u = easeInOut(t / 0.5);
    const bend = new THREE.Vector3(ORBIT_RADIUS * 0.5 * Math.cos(START_ANGLE), 1.9, ORBIT_RADIUS * 0.5 * Math.sin(START_ANGLE));
    return { position: bezier(start.position, bend, CENTRE, u), target: start.target.clone().lerp(CENTRE_TARGET, u), rise: 0 };
  }
  const u = easeInOut((t - 0.5) / 0.5);
  return { position: CENTRE.clone().lerp(OVERHEAD, u), target: CENTRE_TARGET.clone().lerp(FLOOR, u), rise: u };
}

/** How lit each column is at `progress`: its own pillar's moment, then all six together at the centre. */
export function columnGlow(index: number, progress: number) {
  const width = (ORBIT_END - DESCENT_END) / COLUMN_COUNT;
  const own = 1 - smoothstep(width * 0.22, width * 0.55, Math.abs(progress - pillarCentre(index)));
  const together = smoothstep(ORBIT_END + 0.05, 0.98, progress) * 0.8;
  return Math.max(own, together);
}

/* --------------------------------------------------------- geometry --- */

type Profile = [radius: number, y: number][];

const lathe = (profile: Profile, segments = 72) =>
  new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);

/** Points on an elliptical arc, for torus and ovolo mouldings in a profile. */
function arc(cr: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 10): Profile {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cr + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
}

/** The Attic base: lower torus, fillet, scotia, fillet, upper torus, rising into the shaft. */
function atticBase() {
  const scotia: Profile = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    return [0.325 - 0.045 * Math.sin(Math.PI * t), 0.295 + 0.075 * t];
  });
  return lathe([
    [0.001, 0.14],
    [0.34, 0.14],
    ...arc(0.34, 0.21, 0.075, 0.07, -Math.PI / 2, Math.PI / 2),
    [0.325, 0.28],
    [0.325, 0.295],
    ...scotia,
    [0.31, 0.37],
    [0.31, 0.38],
    ...arc(0.31, 0.415, 0.045, 0.035, -Math.PI / 2, Math.PI / 2),
    [0.3, 0.45],
    [0.3, 0.475],
  ]);
}

const SHAFT_BOTTOM = 0.47;
const SHAFT_TOP = 5.0;

/**
 * The shaft: 24 flutes separated by flat fillets, tapering with a slight
 * swell (entasis), the fluting stopping short in rounded ends top and bottom.
 */
function flutedShaft() {
  const flutes = 24;
  const perFlute = 10;
  const radial = flutes * perFlute;
  const rows = 64;
  const positions: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= rows; j += 1) {
    const t = j / rows;
    const y = SHAFT_BOTTOM + (SHAFT_TOP - SHAFT_BOTTOM) * t;
    const radius = 0.3 - 0.045 * t ** 1.5 + 0.006 * Math.sin(Math.PI * t);
    const ends = smoothstep(0, 0.035, t) * (1 - smoothstep(0.965, 1, t));
    for (let i = 0; i <= radial; i += 1) {
      const a = (i / radial) * Math.PI * 2;
      const u = (i % perFlute) / perFlute;
      const fillet = 0.2;
      const depth = u < fillet ? 0 : Math.sin((Math.PI * (u - fillet)) / (1 - fillet)) * 0.03 * (radius / 0.3) * ends;
      const r = radius - depth;
      positions.push(r * Math.cos(a), y, r * Math.sin(a));
    }
  }
  for (let j = 0; j < rows; j += 1) {
    for (let i = 0; i < radial; i += 1) {
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

/** The echinus under the volutes: a quarter-round ovolo. */
function echinus() {
  const ovolo: Profile = Array.from({ length: 13 }, (_, i) => {
    const a = (i / 12) * (Math.PI / 2);
    return [0.265 + 0.08 * Math.sin(a), 5.06 + 0.14 * (1 - Math.cos(a))];
  });
  return lathe([[0.001, 5.04], [0.262, 5.04], ...ovolo, [0.345, 5.21], [0.001, 5.21]]);
}

/** A bolster (pulvinus): the spool that joins a pair of volutes, narrowest at its middle. */
function bolster() {
  const profile: Profile = [[0.001, -0.3]];
  for (let i = 0; i <= 16; i += 1) {
    const t = -0.3 + (0.6 * i) / 16;
    profile.push([0.125 + 0.035 * (t / 0.3) ** 2, t]);
  }
  profile.push([0.001, 0.3]);
  const geometry = lathe(profile, 40);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

/**
 * One volute face: a raised spiral band winding three turns into the eye, as
 * a logarithmic spiral. `hand` is 1 for the right-hand volute and -1 for the
 * left, which winds the other way.
 */
function voluteFace(hand: 1 | -1) {
  const turns = 3;
  const outer = 0.16;
  const k = Math.log(outer / 0.03) / (turns * Math.PI * 2);
  const steps = 180;
  const point = (phi: number, scale: number) => {
    const r = outer * Math.exp(-k * phi) * scale;
    const theta = Math.PI / 2 - hand * phi;
    return new THREE.Vector2(r * Math.cos(theta), r * Math.sin(theta));
  };
  const shape = new THREE.Shape();
  for (let i = 0; i <= steps; i += 1) {
    const p = point((i / steps) * turns * Math.PI * 2, 1);
    if (i === 0) shape.moveTo(p.x, p.y);
    else shape.lineTo(p.x, p.y);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const p = point((i / steps) * turns * Math.PI * 2, 0.8);
    shape.lineTo(p.x, p.y);
  }
  return new THREE.ExtrudeGeometry(shape, { depth: 0.022, bevelEnabled: false, curveSegments: 1 });
}

/** The abacus: a thin square slab with a small rounded edge. */
function abacus() {
  const size = 0.38;
  const shape = new THREE.Shape();
  shape.moveTo(-size, -size);
  shape.lineTo(size, -size);
  shape.lineTo(size, size);
  shape.lineTo(-size, size);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 5.3, 0);
  return geometry;
}

/** Every column shares these; only materials differ per column. */
function columnParts() {
  const plinth = new THREE.BoxGeometry(0.84, 0.14, 0.84);
  plinth.translate(0, 0.07, 0);
  const neck = lathe([[0.001, 4.98], [0.258, 4.98], [0.258, 5.04], [0.001, 5.04]]);
  const astragal = new THREE.TorusGeometry(0.262, 0.024, 12, 72);
  astragal.rotateX(Math.PI / 2);
  astragal.translate(0, 5.0, 0);
  const canalis = new THREE.BoxGeometry(0.74, 0.07, 0.6);
  canalis.translate(0, 5.255, 0);
  const balteus = new THREE.TorusGeometry(0.127, 0.012, 8, 36);
  const eye = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 20);
  eye.rotateX(Math.PI / 2);
  return {
    plinth,
    base: atticBase(),
    shaft: flutedShaft(),
    neck,
    astragal,
    echinus: echinus(),
    canalis,
    bolster: bolster(),
    balteus,
    eye,
    rightFace: voluteFace(1),
    leftFace: voluteFace(-1),
    abacus: abacus(),
    bead: new THREE.SphereGeometry(0.018, 10, 8),
    egg: new THREE.SphereGeometry(1, 14, 10),
    dart: new THREE.ConeGeometry(0.011, 0.07, 6).rotateX(Math.PI),
  };
}

type Parts = ReturnType<typeof columnParts>;

/* ------------------------------------------------------------ scene --- */

type Column = {
  group: THREE.Group;
  marble: THREE.MeshStandardMaterial;
  lines: THREE.LineBasicMaterial;
  glow: THREE.Sprite;
  light: THREE.PointLight;
};

const VOLUTE_X = 0.37;
const VOLUTE_Y = 5.13;

function buildColumn(parts: Parts, edges: Map<THREE.BufferGeometry, THREE.EdgesGeometry>, glowTexture: THREE.Texture): Column {
  const marble = new THREE.MeshStandardMaterial({ color: MARBLE, roughness: 0.62, metalness: 0 });
  const lines = new THREE.LineBasicMaterial({ color: LINE_INK, transparent: true, opacity: 0.32 });
  const group = new THREE.Group();

  const add = (geometry: THREE.BufferGeometry, place?: (object: THREE.Object3D) => void, outline = true) => {
    const mesh = new THREE.Mesh(geometry, marble);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (outline) {
      let edge = edges.get(geometry);
      if (!edge) {
        edge = new THREE.EdgesGeometry(geometry, 24);
        edges.set(geometry, edge);
      }
      mesh.add(new THREE.LineSegments(edge, lines));
    }
    place?.(mesh);
    group.add(mesh);
  };

  add(parts.plinth);
  add(parts.base);
  add(parts.shaft);
  add(parts.neck, undefined, false);
  add(parts.astragal);
  add(parts.echinus);
  add(parts.canalis);
  add(parts.abacus);
  for (const side of [1, -1] as const) {
    add(parts.bolster, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
    add(parts.balteus, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0), false);
    const face = side === 1 ? parts.rightFace : parts.leftFace;
    // Front faces stand proud of the bolster; back faces are the same spiral seen from behind.
    add(face, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0.3));
    add(face, (m) => {
      m.position.set(side * VOLUTE_X, VOLUTE_Y, -0.3);
      m.scale.z = -1;
    });
    for (const z of [0.33, -0.33]) add(parts.eye, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, z), false);
  }

  // Bead-and-reel on the astragal, egg-and-dart on the echinus.
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const beads = new THREE.InstancedMesh(parts.bead, marble, 36);
  for (let i = 0; i < 36; i += 1) {
    const a = (i / 36) * Math.PI * 2;
    matrix.makeTranslation(0.284 * Math.cos(a), 5.0, 0.284 * Math.sin(a));
    beads.setMatrixAt(i, matrix);
  }
  const eggs = new THREE.InstancedMesh(parts.egg, marble, 18);
  const darts = new THREE.InstancedMesh(parts.dart, marble, 18);
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    quaternion.setFromAxisAngle(up, -a - Math.PI / 2);
    matrix.compose(new THREE.Vector3(0.318 * Math.cos(a), 5.135, 0.318 * Math.sin(a)), quaternion, new THREE.Vector3(0.04, 0.058, 0.022));
    eggs.setMatrixAt(i, matrix);
    const between = a + Math.PI / 18;
    matrix.makeTranslation(0.33 * Math.cos(between), 5.13, 0.33 * Math.sin(between));
    darts.setMatrixAt(i, matrix);
  }
  for (const instanced of [beads, eggs, darts]) {
    instanced.castShadow = true;
    group.add(instanced);
  }

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture, color: ORANGE, transparent: true, depthWrite: false, opacity: 0 }),
  );
  glow.scale.set(2.4, 6.4, 1);
  glow.position.set(0, 2.8, 0);
  group.add(glow);
  const light = new THREE.PointLight(ORANGE, 0, 5, 1.6);
  light.position.set(0, 2.6, 0.9);
  group.add(light);

  return { group, marble, lines, glow, light };
}

function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function stylobate(edges: THREE.LineBasicMaterial) {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: "#f6f5f2", roughness: 0.75 });
  [4.1, 3.85, 3.6].forEach((radius, step) => {
    const geometry = new THREE.CylinderGeometry(radius, radius, 0.15, 160);
    geometry.translate(0, 0.075 + step * 0.15, 0);
    const mesh = new THREE.Mesh(geometry, stone);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 30), edges));
    group.add(mesh);
  });
  // Joint lines on the top step, the paving ring the columns stand on.
  for (const radius of [2.55, 3.85 - 0.5]) {
    const points = Array.from({ length: 161 }, (_, i) => {
      const a = (i / 160) * Math.PI * 2;
      return new THREE.Vector3(radius * Math.cos(a), STEP_TOP + 0.002, radius * Math.sin(a));
    });
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), edges));
  }
  return group;
}

function groundRing() {
  const points = Array.from({ length: 241 }, (_, i) => {
    const a = (i / 240) * Math.PI * 2;
    return new THREE.Vector3(5.3 * Math.cos(a), 0.003, 5.3 * Math.sin(a));
  });
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineDashedMaterial({ color: "#000000", transparent: true, opacity: 0.3, dashSize: 0.06, gapSize: 0.22 }),
  );
  line.computeLineDistances();
  return line;
}

/** Builds the scene on `canvas`. Call `frame` with scroll progress each animation frame. */
export function createTholos(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor("#ffffff", 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#ffffff", 16, 34);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 100);

  scene.add(new THREE.HemisphereLight("#ffffff", "#d9d4ca", 1.5));
  const sun = new THREE.DirectionalLight("#ffffff", 1.7);
  sun.position.set(-4, 18, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.08 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  scene.add(groundRing());

  const stepLines = new THREE.LineBasicMaterial({ color: LINE_INK, transparent: true, opacity: 0.4 });
  scene.add(stylobate(stepLines));

  const parts = columnParts();
  const edges = new Map<THREE.BufferGeometry, THREE.EdgesGeometry>();
  const texture = glowTexture();
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const column = buildColumn(parts, edges, texture);
    const angle = columnAngle(index);
    column.group.position.set(RING * Math.cos(angle), STEP_TOP, RING * Math.sin(angle));
    // Turn each column so its volute faces look out from the ring, as on a real tholos.
    column.group.rotation.y = Math.PI / 2 - angle;
    scene.add(column.group);
    return column;
  });

  let narrow = false;
  const eye = new THREE.Vector3();
  const look = new THREE.Vector3();
  let first = true;

  return {
    resize(width: number, height: number) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Narrow screens pull the lens wider so the ring still fits.
      narrow = width / height < 0.8;
    },
    /** Draws one frame at scroll `progress`, easing the camera toward its pose over `seconds`. */
    frame(progress: number, seconds: number) {
      const pose = cameraPose(progress);
      const k = first ? 1 : 1 - Math.exp(-seconds * 7);
      first = false;
      eye.lerp(pose.position, k);
      look.lerp(pose.target, k);
      camera.position.copy(eye);
      // Looking straight down, world up is undefined; hand "up" to the travel direction as the camera rises.
      camera.up.set(0, 1, 0).lerp(OVERHEAD_UP, pose.rise).normalize();
      camera.lookAt(look);
      camera.fov = lensAt(progress) + (narrow ? 26 : 0);
      camera.updateProjectionMatrix();

      columns.forEach((column, index) => {
        const glow = columnGlow(index, progress);
        column.marble.color.lerpColors(MARBLE, ORANGE, glow * 0.92);
        column.marble.emissive.copy(ORANGE).multiplyScalar(glow * 0.18);
        column.lines.color.lerpColors(LINE_INK, LINE_LIT, glow);
        column.glow.material.opacity = glow * 0.5;
        column.light.intensity = glow * 3;
      });
      renderer.render(scene, camera);
    },
    dispose() {
      renderer.dispose();
      texture.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line) {
          object.geometry.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
        }
      });
    },
  };
}
