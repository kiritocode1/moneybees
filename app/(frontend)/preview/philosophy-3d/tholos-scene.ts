import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * PREVIEW ONLY. The philosophy tholos rebuilt for the pinned figure slot on
 * /our-approach: six Ionic columns in polished, veined marble under a studio
 * environment, with ambient occlusion so the flutes and capitals read as
 * carved. No ink outlines. The camera orbits to bring the selected pillar's
 * column forward, and that column turns to gilt. On the closing panel all six
 * are gilt and the entablature and dome lower onto them.
 */

export const COLUMN_COUNT = 6;
export const RING = 3.2;
export const STEP_TOP = 0.45;
export const SHAFT_BOTTOM = 0.47;
export const SHAFT_TOP = 5.0;
export const ABACUS_TOP = 5.335;

const MARBLE = new THREE.Color("#ffffff");
/** Gilt in the brand orange, lifted toward gold so the metal does not read as copper. */
const GILT = new THREE.Color("#F2B13E");

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Column `index` stands at this angle round the ring, counting clockwise from the front. */
export const columnAngle = (index: number) => Math.PI / 2 - (index * Math.PI * 2) / COLUMN_COUNT;

/* ---------------------------------------------------------- texture --- */

/** Smooth value noise on a lattice, for the marble's veins. */
function makeNoise(seed: number) {
  const size = 256;
  const lattice = new Float32Array(size * size);
  let s = seed;
  for (let i = 0; i < lattice.length; i += 1) {
    s = (s * 16807) % 2147483647;
    lattice[i] = s / 2147483647;
  }
  const at = (x: number, y: number) => lattice[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * u;
    const b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * u;
    return a + (b - a) * v;
  };
}

/**
 * Pale statuary marble: a warm white ground with soft grey veins drawn by a
 * turbulent sine, plus a matching roughness map so the veins catch light
 * slightly differently from the ground. Tileable left to right.
 */
export function marbleMaps(width = 512, height = 1024) {
  const noise = makeNoise(9);
  const turbulence = (x: number, y: number) => {
    let sum = 0;
    let amp = 1;
    let freq = 1;
    for (let o = 0; o < 5; o += 1) {
      sum += amp * Math.abs(noise(x * freq, y * freq) * 2 - 1);
      amp *= 0.5;
      freq *= 2.03;
    }
    return sum;
  };
  const colour = document.createElement("canvas");
  colour.width = width;
  colour.height = height;
  const rough = document.createElement("canvas");
  rough.width = width;
  rough.height = height;
  const c = colour.getContext("2d");
  const r = rough.getContext("2d");
  if (!c || !r) throw new Error("2D canvas unavailable");
  const colourData = c.createImageData(width, height);
  const roughData = r.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Wrap x through a circle so the texture tiles round the shaft.
      const a = (x / width) * Math.PI * 2;
      const nx = 6 + Math.cos(a) * 2.2;
      const ny = 6 + Math.sin(a) * 2.2;
      // Coordinates in the 1024-tall reference frame, so a smaller map keeps the same veining.
      const v = (y * 1024) / height;
      const t = turbulence(nx + v / 220, ny + v / 260);
      const vein = Math.abs(Math.sin(v / 70 + x / 900 + t * 3.2));
      const line = Math.pow(1 - vein, 7);
      const cloud = turbulence(nx * 2 + 3, ny * 2 + v / 120) * 0.5;
      const i = (y * width + x) * 4;
      const grey = 240 - line * 46 - cloud * 8;
      colourData.data[i] = grey + 2;
      colourData.data[i + 1] = grey;
      colourData.data[i + 2] = grey - 4;
      colourData.data[i + 3] = 255;
      const g = 104 + line * 70 + cloud * 18;
      roughData.data[i] = g;
      roughData.data[i + 1] = g;
      roughData.data[i + 2] = g;
      roughData.data[i + 3] = 255;
    }
  }
  c.putImageData(colourData, 0, 0);
  r.putImageData(roughData, 0, 0);
  const map = new THREE.CanvasTexture(colour);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(rough);
  for (const texture of [map, roughnessMap]) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
  }
  return { map, roughnessMap };
}

/* --------------------------------------------------------- geometry --- */

export type Profile = [radius: number, y: number][];

/** A lathe from a radius/height profile; repeated points give hard corners. */
export const lathe = (profile: Profile, segments = 96) => new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), segments);

export function arc(cr: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 14): Profile {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cr + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
}

/** The Attic base: lower torus, scotia, upper torus, then the apophyge rising into the shaft. */
function atticBase() {
  const scotia: Profile = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    return [0.325 - 0.05 * Math.sin(Math.PI * t), 0.295 + 0.075 * t];
  });
  return lathe([
    [0.001, 0.14],
    [0.34, 0.14],
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

/**
 * The shaft: 24 semicircular flutes between flat fillets, with entasis and
 * rounded flute ends top and bottom. Twelve vertices per flute and 128 rows so
 * the flutes stay round in close-up. UVs wrap once round and twice up.
 */
function flutedShaft() {
  const flutes = 24;
  const perFlute = 12;
  const radial = flutes * perFlute;
  const rows = 128;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= rows; j += 1) {
    const t = j / rows;
    const y = SHAFT_BOTTOM + (SHAFT_TOP - SHAFT_BOTTOM) * t;
    const radius = 0.3 - 0.045 * t ** 1.5 + 0.007 * Math.sin(Math.PI * t);
    const ends = Math.sqrt(clamp01(t / 0.035)) * Math.sqrt(clamp01((1 - t) / 0.035));
    for (let i = 0; i <= radial; i += 1) {
      const a = (i / radial) * Math.PI * 2;
      const u = (i % perFlute) / perFlute;
      const fillet = 0.18;
      const depth = u < fillet ? 0 : Math.sqrt(Math.max(0, Math.sin((Math.PI * (u - fillet)) / (1 - fillet)))) * 0.034 * (radius / 0.3) * ends;
      const r = radius - depth;
      positions.push(r * Math.cos(a), y, r * Math.sin(a));
      uvs.push(i / radial, t * 2.2);
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
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function echinus() {
  const ovolo: Profile = Array.from({ length: 17 }, (_, i) => {
    const a = (i / 16) * (Math.PI / 2);
    return [0.265 + 0.08 * Math.sin(a), 5.06 + 0.14 * (1 - Math.cos(a))];
  });
  return lathe([[0.001, 5.04], [0.262, 5.04], [0.262, 5.04], ...ovolo, [0.345, 5.21], [0.345, 5.21], [0.001, 5.21]]);
}

/** The bolster joining each pair of volutes, waisted by its balteus. */
function bolster() {
  const profile: Profile = [[0.001, -0.3]];
  for (let i = 0; i <= 24; i += 1) {
    const t = -0.3 + (0.6 * i) / 24;
    profile.push([0.13 + 0.04 * (t / 0.3) ** 2, t]);
  }
  profile.push([0.001, 0.3]);
  const geometry = lathe(profile, 48);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

/** The volute disc each spiral is carved on. */
function voluteDisc() {
  const geometry = new THREE.CylinderGeometry(0.168, 0.168, 0.05, 64, 1);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

/** The volute's raised spiral band, three turns into the eye, with a bevel so it reads as carved. */
function voluteSpiral(hand: 1 | -1) {
  const turns = 3;
  const outer = 0.165;
  const k = Math.log(outer / 0.032) / (turns * Math.PI * 2);
  const steps = 240;
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
    const p = point((i / steps) * turns * Math.PI * 2, 0.82);
    shape.lineTo(p.x, p.y);
  }
  return new THREE.ExtrudeGeometry(shape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.003, bevelSegments: 3, curveSegments: 1 });
}

function abacus() {
  const size = 0.37;
  const shape = new THREE.Shape();
  shape.moveTo(-size, -size);
  shape.lineTo(size, -size);
  shape.lineTo(size, size);
  shape.lineTo(-size, size);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.022, bevelSegments: 5 });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 5.235, 0);
  return geometry;
}

export function columnParts() {
  const plinth = new THREE.BoxGeometry(0.84, 0.14, 0.84, 1, 1, 1);
  plinth.translate(0, 0.07, 0);
  const neck = lathe([[0.001, 4.98], [0.258, 4.98], [0.258, 5.04], [0.001, 5.04]]);
  const astragal = new THREE.TorusGeometry(0.262, 0.026, 16, 96);
  astragal.rotateX(Math.PI / 2);
  astragal.translate(0, 5.0, 0);
  const canalis = new THREE.BoxGeometry(0.74, 0.07, 0.6);
  canalis.translate(0, 5.255, 0);
  const balteus = new THREE.TorusGeometry(0.135, 0.014, 10, 48);
  const eye = new THREE.SphereGeometry(0.032, 20, 14);
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
    disc: voluteDisc(),
    eye,
    rightSpiral: voluteSpiral(1),
    leftSpiral: voluteSpiral(-1),
    abacus: abacus(),
    bead: new THREE.SphereGeometry(0.019, 12, 10),
    egg: new THREE.SphereGeometry(1, 18, 14),
    dart: new THREE.ConeGeometry(0.011, 0.07, 8).rotateX(Math.PI),
  };
}

type Parts = ReturnType<typeof columnParts>;

/**
 * The entablature on the ring: architrave in three fasciae, a plain frieze,
 * then the cornice's bed moulding, corona and cyma. One closed lathe profile
 * round the whole ring, inner face plain.
 */
export function entablature() {
  const o = RING;
  const base = ABACUS_TOP;
  const outer: Profile = [
    [o + 0.33, base],
    [o + 0.33, base + 0.13],
    [o + 0.35, base + 0.13],
    [o + 0.35, base + 0.26],
    [o + 0.37, base + 0.26],
    [o + 0.37, base + 0.4],
    [o + 0.39, base + 0.4],
    [o + 0.39, base + 0.44],
    [o + 0.35, base + 0.44],
    [o + 0.35, base + 0.82],
    [o + 0.4, base + 0.82],
    [o + 0.4, base + 0.88],
    ...arc(o + 0.4, base + 0.92, 0.04, 0.04, -Math.PI / 2, 0, 6),
    [o + 0.56, base + 0.96],
    [o + 0.56, base + 1.12],
    ...arc(o + 0.56, base + 1.2, 0.08, 0.08, -Math.PI / 2, Math.PI / 2, 10),
    [o + 0.5, base + 1.28],
    [o + 0.5, base + 1.28],
  ];
  const inner: Profile = [
    [o - 0.5, base + 1.28],
    [o - 0.5, base + 1.28],
    [o - 0.33, base + 0.9],
    [o - 0.33, base],
    [o - 0.33, base],
  ];
  // Lathe profiles run bottom to top on the outside; close back down the inside.
  return lathe([...outer, ...inner, [o + 0.33, base]], 192);
}

/** A ribbed dome on a low drum, finished with a lantern finial. */
export function dome() {
  const base = ABACUS_TOP + 1.28;
  const drum: Profile = [
    [RING + 0.42, base],
    [RING + 0.42, base + 0.18],
    [RING + 0.3, base + 0.18],
    [RING + 0.3, base + 0.18],
  ];
  const shell: Profile = Array.from({ length: 33 }, (_, i) => {
    const a = (i / 32) * (Math.PI / 2);
    return [(RING + 0.3) * Math.cos(a), base + 0.18 + 1.9 * Math.sin(a)];
  });
  return lathe([[0.001, base], ...drum, ...shell.slice(1), [0.001, base + 2.08]], 192);
}

export function finial() {
  const top = ABACUS_TOP + 1.28 + 2.06;
  return lathe(
    [
      [0.001, top],
      [0.32, top],
      [0.32, top + 0.08],
      [0.22, top + 0.1],
      [0.18, top + 0.42],
      [0.26, top + 0.46],
      ...arc(0, top + 0.62, 0.16, 0.16, -Math.PI / 2, Math.PI / 2, 12),
      [0.001, top + 0.78],
    ],
    64,
  );
}

/* ------------------------------------------------------------ scene --- */

type Column = { group: THREE.Group; material: THREE.MeshPhysicalMaterial; light: THREE.PointLight; glow: number };

export const VOLUTE_X = 0.37;
export const VOLUTE_Y = 5.13;

export function marbleMaterial(maps: ReturnType<typeof marbleMaps>) {
  return new THREE.MeshPhysicalMaterial({
    color: MARBLE.clone(),
    map: maps.map,
    roughnessMap: maps.roughnessMap,
    roughness: 1,
    metalness: 0,
    clearcoat: 0.25,
    clearcoatRoughness: 0.32,
    envMapIntensity: 0.9,
  });
}

function buildColumn(parts: Parts, maps: ReturnType<typeof marbleMaps>): Column {
  const material = marbleMaterial(maps);
  const group = new THREE.Group();
  const add = (geometry: THREE.BufferGeometry, place?: (object: THREE.Object3D) => void) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    place?.(mesh);
    group.add(mesh);
  };
  for (const part of [parts.plinth, parts.base, parts.shaft, parts.neck, parts.astragal, parts.echinus, parts.canalis, parts.abacus]) add(part);
  for (const side of [1, -1] as const) {
    add(parts.bolster, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
    add(parts.balteus, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
    const spiral = side === 1 ? parts.rightSpiral : parts.leftSpiral;
    for (const face of [1, -1] as const) {
      add(parts.disc, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.3));
      add(spiral, (m) => {
        m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.325);
        m.scale.z = face;
      });
      add(parts.eye, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.345));
    }
  }
  // Bead-and-reel on the astragal, egg-and-dart on the echinus.
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const beads = new THREE.InstancedMesh(parts.bead, material, 40);
  for (let i = 0; i < 40; i += 1) {
    const a = (i / 40) * Math.PI * 2;
    matrix.makeTranslation(0.286 * Math.cos(a), 5.0, 0.286 * Math.sin(a));
    beads.setMatrixAt(i, matrix);
  }
  const eggs = new THREE.InstancedMesh(parts.egg, material, 20);
  const darts = new THREE.InstancedMesh(parts.dart, material, 20);
  for (let i = 0; i < 20; i += 1) {
    const a = (i / 20) * Math.PI * 2;
    quaternion.setFromAxisAngle(up, -a - Math.PI / 2);
    matrix.compose(new THREE.Vector3(0.32 * Math.cos(a), 5.135, 0.32 * Math.sin(a)), quaternion, new THREE.Vector3(0.036, 0.056, 0.022));
    eggs.setMatrixAt(i, matrix);
    const between = a + Math.PI / 20;
    matrix.makeTranslation(0.332 * Math.cos(between), 5.13, 0.332 * Math.sin(between));
    darts.setMatrixAt(i, matrix);
  }
  for (const instanced of [beads, eggs, darts]) {
    instanced.castShadow = true;
    instanced.receiveShadow = true;
    group.add(instanced);
  }
  const light = new THREE.PointLight(GILT, 0, 6, 1.6);
  light.position.set(0, 2.4, 1.1);
  group.add(light);
  return { group, material, light, glow: 0 };
}

/** Unveined statuary marble for the steps and the roof, where the vein texture would smear across the lathe. */
export function plainMarble() {
  return new THREE.MeshPhysicalMaterial({ color: "#f7f6f3", roughness: 0.48, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.4, envMapIntensity: 0.85 });
}

export function stylobate() {
  const group = new THREE.Group();
  const material = plainMarble();
  [4.15, 3.88, 3.62].forEach((radius, step) => {
    const y = step * 0.15;
    const geometry = lathe(
      [
        [0.001, y],
        [radius, y],
        [radius, y],
        [radius, y + 0.13],
        ...arc(radius - 0.02, y + 0.13, 0.02, 0.02, 0, Math.PI / 2, 4),
        [radius - 0.02, y + 0.15],
        [0.001, y + 0.15],
      ],
      192,
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add(mesh);
  });
  return group;
}

export type TholosState = { progress: number; selected: number };

/** Builds the scene on `canvas`. Call `frame` every animation frame with the section's state. */
export function createTholos(canvas: HTMLCanvasElement, onPick: (index: number) => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  // Transparent, so the page's white shows through rather than a tone-mapped grey.
  renderer.setClearColor("#ffffff", 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);

  // A high key from the left: steep enough that shadows stay on the base as the camera orbits, angled
  // enough that the flutes and mouldings throw shade. Little fill, so the white reads as form.
  const sun = new THREE.DirectionalLight("#fffaf2", 3.4);
  sun.position.set(-3.5, 18, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 9, bottom: -5, near: 1, far: 40 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 5;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#ffffff", "#e4e2dd", 0.3));

  const ground = new THREE.Mesh(new THREE.CircleGeometry(7, 96), new THREE.ShadowMaterial({ opacity: 0.06 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const maps = marbleMaps();
  scene.add(stylobate());

  const parts = columnParts();
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const column = buildColumn(parts, maps);
    const angle = columnAngle(index);
    column.group.position.set(RING * Math.cos(angle), STEP_TOP, RING * Math.sin(angle));
    // Volute faces look out from the ring.
    column.group.rotation.y = Math.PI / 2 - angle;
    column.group.userData.index = index;
    scene.add(column.group);
    return column;
  });

  const roofMaterial = plainMarble();
  const roof = new THREE.Group();
  for (const geometry of [entablature(), dome(), finial()]) {
    const mesh = new THREE.Mesh(geometry, roofMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    roof.add(mesh);
  }
  // Dentils under the corona.
  const dentil = new THREE.BoxGeometry(0.07, 0.09, 0.08);
  const dentils = new THREE.InstancedMesh(dentil, roofMaterial, 150);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  for (let i = 0; i < 150; i += 1) {
    const a = (i / 150) * Math.PI * 2;
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
    matrix.compose(new THREE.Vector3((RING + 0.44) * Math.cos(a), ABACUS_TOP + 0.9, (RING + 0.44) * Math.sin(a)), quaternion, new THREE.Vector3(1, 1, 1));
    dentils.setMatrixAt(i, matrix);
  }
  dentils.castShadow = true;
  roof.add(dentils);
  roof.visible = false;
  scene.add(roof);

  // The composer renders off screen, where the canvas antialias does not reach: multisample its target.
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType }));
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, 1, 1);
  ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.4, thickness: 1.4, scale: 1.25, samples: 16 });
  ao.blendIntensity = 1;
  composer.addPass(ao);
  composer.addPass(new OutputPass());

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const onClick = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(columns.map((column) => column.group), true)[0];
    let object: THREE.Object3D | null = hit?.object ?? null;
    while (object && object.userData.index === undefined) object = object.parent;
    if (object) onPick(object.userData.index as number);
  };
  canvas.addEventListener("click", onClick);

  // Eased camera state.
  let azimuth = Number.NaN;
  let elevation = 0;
  let distance = 0;
  let lookY = 0;
  let roofDrop = 1;
  let spin = 0;
  let dirty = true;

  return {
    resize(width: number, height: number) {
      const ratio = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      composer.setPixelRatio(ratio);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dirty = true;
    },
    /** One frame. `seconds` since the last; `still` snaps everything (reduced motion). */
    frame({ progress, selected }: TholosState, seconds: number, still: boolean) {
      const together = selected >= COLUMN_COUNT;
      const build = easeOut(clamp01(progress));
      // The lit column sits a little left of front, three-quarter on, with its neighbours either side.
      const focus = Math.min(selected, COLUMN_COUNT - 1);
      if (together && !still) spin += seconds * 0.12;
      const targetAzimuth = columnAngle(focus) + 0.42 - (together ? spin : 0);
      const targetElevation = together ? 0.3 : 0.2 + (1 - build) * 0.75;
      const targetDistance = (together ? 25 : 19.5) + (1 - build) * 6;
      const targetLookY = together ? 4.1 : 2.6;
      const k = still || Number.isNaN(azimuth) ? 1 : 1 - Math.exp(-seconds * 3.2);
      const before = azimuth + elevation + distance + lookY + roofDrop;
      if (Number.isNaN(azimuth)) azimuth = targetAzimuth;
      azimuth += (targetAzimuth - azimuth) * k;
      elevation += (targetElevation - elevation) * k;
      distance += (targetDistance - distance) * k;
      lookY += (targetLookY - lookY) * k;
      roofDrop += ((together ? 0 : 1) - roofDrop) * (still ? 1 : 1 - Math.exp(-seconds * 2.4));

      let glowMoving = false;
      columns.forEach((column, index) => {
        const target = build > 0.9 && (together || index === focus) ? 1 : 0;
        const next = still ? target : column.glow + (target - column.glow) * (1 - Math.exp(-seconds * 4));
        if (Math.abs(next - column.glow) > 1e-4) glowMoving = true;
        column.glow = next;
        // Marble to gilt: warm the colour, raise the metal, polish it, and lift the veining.
        column.material.color.lerpColors(MARBLE, GILT, next);
        column.material.metalness = next * 0.9;
        column.material.roughness = 1 - next * 0.62;
        column.material.clearcoat = 0.25 + next * 0.35;
        column.light.intensity = next * 2.2;
      });

      const moving = Math.abs(azimuth + elevation + distance + lookY + roofDrop - before) > 1e-5 || glowMoving || (together && !still);
      if (!moving && !dirty) return;

      roof.visible = roofDrop < 0.995;
      roof.position.y = roofDrop * 5;
      camera.position.set(
        distance * Math.cos(elevation) * Math.cos(azimuth),
        lookY + distance * Math.sin(elevation),
        distance * Math.cos(elevation) * Math.sin(azimuth),
      );
      camera.lookAt(0, lookY, 0);
      composer.render();
      dirty = false;
    },
    dispose() {
      canvas.removeEventListener("click", onClick);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
        }
      });
      maps.map.dispose();
      maps.roughnessMap.dispose();
      environment.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
