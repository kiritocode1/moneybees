import * as THREE from "three";
import { COLUMN_COUNT, DESCENT_END, ORBIT_END, pillarCentre } from "@/components/philosophy/tholos-path";
import { COMPOSITE_FRAGMENT, COLOUR_ONLY, EDGES_ONLY, stylobateGeometry } from "./tholos-drawn";
import { RING, SHAFT_BOTTOM, SHAFT_TOP, STEP_TOP, VOLUTE_X, VOLUTE_Y, columnParts, lathe } from "./tholos-scene";

/*
 * PREVIEW ONLY. The homepage fly-through's camera move, kept: down from
 * straight overhead, round the ring past each column with its pillar lit, in
 * through the gap to the centre and up at all six. The tholos is the detailed
 * model, drawn in the site's 2D style: paper faces shaded by angle with the
 * pyramid's colours, the lit column in its orange, ink hairlines traced from
 * silhouettes and creases. The mouldings (beads, egg-and-dart, bolsters,
 * volute spirals) shade without lines, so close passes stay clean.
 *
 * The camera is tuned for the scene's own frame, beside the text rather than
 * under it: at each pillar's moment the lit column stands whole and centred,
 * the camera craning gently up its shaft and back as it passes.
 *
 * The columns are old stone, each weathered differently: shafts built of
 * uneven drums whose joints draw as hairlines, eroded and chipped surfaces,
 * broken corners on the abacus and plinth, fine cracks inked down some shafts,
 * and faint stains that darken toward the base.
 */

const START_ANGLE = Math.PI / 4;
/** Each column sits a little ahead of the camera at its pillar's moment, so it is seen three-quarter on. */
const LEAD = 0.26;
export const columnAngle = (index: number) => START_ANGLE - ((index + 0.5) * Math.PI * 2) / COLUMN_COUNT - LEAD;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smoothstep = (a: number, b: number, value: number) => {
  const t = clamp01((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------- weathering --- */

/** A deterministic 3D lattice hash in [0, 1). */
function hash(x: number, y: number, z: number, seed: number) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177) ^ Math.imul(seed | 0, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function noise(x: number, y: number, z: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = x - xi;
  const fy = y - yi;
  const fz = z - zi;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);
  const at = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz, seed);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  return mix(
    mix(mix(at(0, 0, 0), at(1, 0, 0), u), mix(at(0, 1, 0), at(1, 1, 0), u), v),
    mix(mix(at(0, 0, 1), at(1, 0, 1), u), mix(at(0, 1, 1), at(1, 1, 1), u), v),
    w,
  );
}

/**
 * Erodes a copy of a part: every vertex moves in along its normal by
 * low-frequency noise (soft wear), and further where a second noise peaks (a
 * chip). Vertices sharing a position move together, so seams stay closed.
 */
export function weather(source: THREE.BufferGeometry, seed: number, wear: number, chip: number, scale = 7) {
  const geometry = source.clone();
  if (!geometry.attributes.normal) geometry.computeVertexNormals();
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    p.fromBufferAttribute(position, i);
    n.fromBufferAttribute(normal, i);
    const soft = noise(p.x * scale, p.y * scale, p.z * scale, seed) * 0.65 + noise(p.x * scale * 2.3, p.y * scale * 2.3, p.z * scale * 2.3, seed + 7) * 0.35;
    const c = noise(p.x * scale * 1.6 + 11, p.y * scale * 1.6, p.z * scale * 1.6, seed + 3);
    const cut = c > 0.72 ? ((c - 0.72) / 0.28) ** 0.6 * chip : 0;
    p.addScaledVector(n, -(soft * wear + cut));
    position.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Where each column's drum joints fall along the shaft, uneven as cut stone is. */
export function drumJoints(seed: number) {
  const joints: number[] = [];
  let t = 0;
  for (let k = 0; k < 5; k += 1) {
    t += (1 / 6) * (0.75 + 0.5 * hash(k, 3, 9, seed));
    joints.push(Math.min(0.92, t));
  }
  return joints;
}

/** Radius of the shaft at height fraction t: taper, entasis, and a shallow V at each drum joint. */
function shaftRadius(t: number, joints: readonly number[]) {
  let r = 0.3 - 0.045 * t ** 1.5 + 0.007 * Math.sin(Math.PI * t);
  for (const joint of joints) r -= 0.007 * Math.max(0, 1 - Math.abs(t - joint) / 0.006);
  return r;
}

/** The fluted shaft built for one column: its own drums, erosion and broken arrises. */
export function weatheredShaft(seed: number, joints: readonly number[], perFlute = 12, rows = 160) {
  const flutes = 24;
  const radial = flutes * perFlute;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= rows; j += 1) {
    const t = j / rows;
    const y = SHAFT_BOTTOM + (SHAFT_TOP - SHAFT_BOTTOM) * t;
    const base = shaftRadius(t, joints);
    const ends = Math.sqrt(clamp01(t / 0.035)) * Math.sqrt(clamp01((1 - t) / 0.035));
    for (let i = 0; i <= radial; i += 1) {
      const a = ((i % radial) / radial) * Math.PI * 2;
      const u = (i % perFlute) / perFlute;
      const fillet = 0.18;
      const depth = u < fillet ? 0 : Math.sqrt(Math.max(0, Math.sin((Math.PI * (u - fillet)) / (1 - fillet)))) * 0.034 * (base / 0.3) * ends;
      const x = Math.cos(a);
      const z = Math.sin(a);
      // Wear: soft erosion everywhere, and chips that bite deepest on the fillets, the flute arrises.
      const soft = noise(x * 2.2, y * 1.4, z * 2.2, seed) * 0.006;
      const c = noise(x * 5 + 4, y * 3.2, z * 5, seed + 5);
      const arris = u < fillet ? 1 : 0.35;
      const chip = c > 0.74 ? ((c - 0.74) / 0.26) ** 0.7 * 0.03 * arris : 0;
      const r = base - depth - soft - chip;
      positions.push(r * x, y, r * z);
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

/** The shaft's outline without flutes, for the edge pass: its drum joints are the hairlines. */
export function jointedProxy(joints: readonly number[]) {
  const stops = new Set<number>();
  for (let j = 0; j <= 48; j += 1) stops.add(j / 48);
  for (const joint of joints) for (const d of [-0.006, 0, 0.006]) stops.add(joint + d);
  const profile: [number, number][] = [[0.001, SHAFT_BOTTOM]];
  for (const t of [...stops].sort((a, b) => a - b)) profile.push([shaftRadius(t, joints) - 0.012, SHAFT_BOTTOM + (SHAFT_TOP - SHAFT_BOTTOM) * t]);
  profile.push([0.001, SHAFT_TOP]);
  return lathe(profile, 72);
}

/**
 * The stone shader: the pyramid's paper-and-orange fill, with faint weathering
 * stains that gather toward the base and fine cracks inked into some shafts.
 * Noise runs in world space, so every column weathers differently.
 */
const STONE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * n;
    #endif
    vNormal = normalize(normalMatrix * n);
    vec4 world = modelMatrix * local;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const STONE_FRAGMENT = /* glsl */ `
  uniform float glow;
  uniform float cracked;
  uniform float damp;
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
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x), mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x), mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    return noise(p) * 0.55 + noise(p * 2.1 + 3.1) * 0.3 + noise(p * 4.3 + 7.7) * 0.15;
  }
  void main() {
    vec3 light = normalize(vec3(-0.6, 0.62, 0.5));
    float shade = clamp(0.5 + 0.5 * dot(normalize(vNormal), light), 0.0, 1.0);
    vec3 paper = vec3(228.0 + 27.0 * shade, 227.0 + 28.0 * shade, 225.0 + 30.0 * shade) / 255.0;
    vec3 lit = vec3(201.0 + 46.0 * shade, 129.0 + 32.0 * shade, 16.0 + 10.0 * shade) / 255.0;
    vec3 colour = mix(paper, lit, glow);
    // Weathering: soft patches, and damp rising from the base.
    // Offset off the origin: this hash mirrors across the axes, which would pattern the ring symmetrically.
    vec3 w = vWorld + vec3(13.7, 0.0, 7.3);
    float stain = smoothstep(0.55, 0.85, fbm(w * vec3(1.6, 0.9, 1.6)));
    float rising = (1.0 - smoothstep(0.5, 1.6, vWorld.y)) * damp;
    colour *= 1.0 - 0.05 * stain * damp - 0.06 * rising * fbm(w * 3.0);
    // Cracks: the level line of a vertically stretched noise, one pixel wide, only where a mask allows.
    // Stretched hard along the shaft so the lines run up the stone rather than looping.
    float field = fbm(w * vec3(3.2, 0.35, 3.2) + 5.0);
    float line = 1.0 - smoothstep(0.0, fwidth(field) * 1.1, abs(field - 0.5));
    float mask = smoothstep(0.7, 0.8, noise(w * vec3(0.8, 0.3, 0.8) + 2.0)) * cracked;
    vec3 ink = mix(vec3(0.0), vec3(0.604, 0.384, 0.031), glow);
    colour = mix(colour, ink, line * mask * 0.5);
    gl_FragColor = vec4(colour, 1.0);
  }
`;

const ORBIT_RADIUS = 10.6;
const OVERHEAD = new THREE.Vector3(0, 19, 0);
const FLOOR = new THREE.Vector3(0, 0, 0);
const OVERHEAD_UP = new THREE.Vector3(-Math.cos(START_ANGLE), 0, -Math.sin(START_ANGLE));
const DESCENT_OUT = new THREE.Vector3(3.6, 17, 3.6);
const DESCENT_DOWN = new THREE.Vector3(11, 8, 11);
const GAP_ANGLE = START_ANGLE - LEAD;
const CENTRE = new THREE.Vector3(0, 2.2, 0);
const CENTRE_TARGET = new THREE.Vector3(-3 * Math.cos(GAP_ANGLE), 2.7, -3 * Math.sin(GAP_ANGLE));
const LOW_CENTRE = new THREE.Vector3(0, 0.9, 0);
const SKY = new THREE.Vector3(-0.35 * Math.cos(GAP_ANGLE), 12, -0.35 * Math.sin(GAP_ANGLE));
const LOOK_UP_UP = new THREE.Vector3(-Math.cos(GAP_ANGLE), 0, -Math.sin(GAP_ANGLE));
const ARRIVE = 0.55;

function cubic(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, t: number) {
  const u = 1 - t;
  return new THREE.Vector3().addScaledVector(a, u * u * u).addScaledVector(b, 3 * u * u * t).addScaledVector(c, 3 * u * t * t).addScaledVector(d, t * t * t);
}

function bezier(a: THREE.Vector3, control: THREE.Vector3, b: THREE.Vector3, t: number) {
  const u = 1 - t;
  return new THREE.Vector3().addScaledVector(a, u * u).addScaledVector(control, 2 * u * t).addScaledVector(b, t * t);
}

/** Round the ring. At each pillar's moment the aim lands on its column, which stands whole in frame. */
function orbitPose(progress: number) {
  const s = clamp01((progress - DESCENT_END) / (ORBIT_END - DESCENT_END));
  const angle = START_ANGLE - s * Math.PI * 2;
  const local = (s * COLUMN_COUNT) % 1;
  // A gentle crane: up the shaft toward the capital as the column passes, then back down.
  const lift = 0.5 - 0.5 * Math.cos(Math.PI * 2 * local);
  const radius = ORBIT_RADIUS - 0.5 * lift;
  const position = new THREE.Vector3(radius * Math.cos(angle), 2.3 + 0.8 * lift, radius * Math.sin(angle));
  const aim = angle - LEAD;
  const target = new THREE.Vector3(RING * Math.cos(aim), 2.95 + 0.35 * lift, RING * Math.sin(aim));
  return { position, target };
}

export function lensAt(progress: number) {
  if (progress <= DESCENT_END) return 42 + 8 * ease(clamp01(progress / DESCENT_END));
  if (progress <= ORBIT_END) return 50;
  const t = clamp01((progress - ORBIT_END) / (1 - ORBIT_END));
  if (t < ARRIVE) return 50 + 10 * ease(t / ARRIVE);
  return 60 + 24 * ease((t - ARRIVE) / (1 - ARRIVE));
}

export function cameraPose(progress: number) {
  if (progress <= DESCENT_END) {
    const t = ease(clamp01(progress / DESCENT_END));
    const end = orbitPose(DESCENT_END);
    return { position: cubic(OVERHEAD, DESCENT_OUT, DESCENT_DOWN, end.position, t), target: FLOOR.clone().lerp(end.target, t), overhead: 1 - t, up: OVERHEAD_UP };
  }
  if (progress <= ORBIT_END) return { ...orbitPose(progress), overhead: 0, up: OVERHEAD_UP };
  const t = clamp01((progress - ORBIT_END) / (1 - ORBIT_END));
  const start = orbitPose(ORBIT_END);
  if (t < ARRIVE) {
    const u = ease(t / ARRIVE);
    const bend = new THREE.Vector3(ORBIT_RADIUS * 0.5 * Math.cos(GAP_ANGLE), 2.1, ORBIT_RADIUS * 0.5 * Math.sin(GAP_ANGLE));
    return { position: bezier(start.position, bend, CENTRE, u), target: start.target.clone().lerp(CENTRE_TARGET, u), overhead: 0, up: LOOK_UP_UP };
  }
  const u = ease((t - ARRIVE) / (1 - ARRIVE));
  return { position: CENTRE.clone().lerp(LOW_CENTRE, u), target: CENTRE_TARGET.clone().lerp(SKY, u), overhead: u, up: LOOK_UP_UP };
}

/** How lit each column is: its own pillar's moment, then all six at the centre. */
export function columnGlow(index: number, progress: number) {
  const width = (ORBIT_END - DESCENT_END) / COLUMN_COUNT;
  const own = 1 - smoothstep(width * 0.24, width * 0.55, Math.abs(progress - pillarCentre(index)));
  const together = smoothstep(ORBIT_END + 0.05, 0.97, progress);
  return Math.max(own, together);
}

export type FlyPose = { bloom: { x: number; y: number; opacity: number } };

/** Builds the drawn fly-through on `canvas`. `frame(progress)` renders and returns where the bloom goes. */
export function createDrawnFlythrough(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

  const stone = (cracked: number, damp: number) =>
    new THREE.ShaderMaterial({
      vertexShader: STONE_VERTEX,
      fragmentShader: STONE_FRAGMENT,
      uniforms: { glow: { value: 0 }, cracked: { value: cracked }, damp: { value: damp } },
    });
  // The steps stay clean paper: weathering on the floor reads as clutter from overhead.
  const steps = stone(0, 0);
  for (const geometry of stylobateGeometry()) scene.add(new THREE.Mesh(geometry, steps));

  const parts = columnParts();
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const seed = 17 + index * 31;
    // Cracks on three of the six, so the set reads as weathered, not ruined.
    const material = stone(index % 2 === 0 ? 1 : 0, 1);
    const joints = drumJoints(seed);
    const group = new THREE.Group();
    const add = (object: THREE.Mesh, layer = 0, place?: (object: THREE.Object3D) => void) => {
      object.layers.set(layer);
      place?.(object);
      group.add(object);
    };
    const mesh = (geometry: THREE.BufferGeometry) => new THREE.Mesh(geometry, material);
    // Worn mouldings; the plinth and abacus also lose their corners.
    add(mesh(weather(parts.plinth, seed, 0.005, 0.018, 9)));
    add(mesh(weather(parts.base, seed + 1, 0.005, 0.02)));
    add(mesh(parts.neck));
    add(mesh(weather(parts.astragal, seed + 2, 0.004, 0.008, 12)));
    add(mesh(weather(parts.echinus, seed + 3, 0.004, 0.012)));
    add(mesh(weather(parts.canalis, seed + 4, 0.004, 0.012, 10)));
    add(mesh(weather(parts.abacus, seed + 5, 0.005, 0.03, 9)));
    add(mesh(weatheredShaft(seed, joints)), COLOUR_ONLY);
    add(mesh(jointedProxy(joints)), EDGES_ONLY);
    for (const side of [1, -1] as const) {
      add(mesh(parts.bolster), COLOUR_ONLY, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
      const spiral = side === 1 ? parts.rightSpiral : parts.leftSpiral;
      for (const face of [1, -1] as const) {
        add(mesh(parts.disc), 0, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.3));
        add(mesh(spiral), COLOUR_ONLY, (m) => {
          m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.325);
          m.scale.z = face;
        });
        add(mesh(parts.eye), COLOUR_ONLY, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.345));
      }
    }
    // Bead-and-reel on the astragal, egg-and-dart on the echinus: shaded, not inked.
    const beads = new THREE.InstancedMesh(parts.bead, material, 40);
    for (let i = 0; i < 40; i += 1) {
      const a = (i / 40) * Math.PI * 2;
      matrix.makeTranslation(0.286 * Math.cos(a), 5.0, 0.286 * Math.sin(a));
      beads.setMatrixAt(i, matrix);
    }
    const eggs = new THREE.InstancedMesh(parts.egg, material, 20);
    for (let i = 0; i < 20; i += 1) {
      const a = (i / 20) * Math.PI * 2;
      quaternion.setFromAxisAngle(up, -a - Math.PI / 2);
      matrix.compose(new THREE.Vector3(0.32 * Math.cos(a), 5.135, 0.32 * Math.sin(a)), quaternion, new THREE.Vector3(0.036, 0.056, 0.022));
      eggs.setMatrixAt(i, matrix);
    }
    for (const instanced of [beads, eggs]) {
      instanced.layers.set(COLOUR_ONLY);
      group.add(instanced);
    }
    const angle = columnAngle(index);
    group.position.set(RING * Math.cos(angle), STEP_TOP, RING * Math.sin(angle));
    group.rotation.y = Math.PI / 2 - angle;
    scene.add(group);
    return { group, material };
  });

  const normalMaterial = new THREE.MeshNormalMaterial();
  let normalTarget = new THREE.WebGLRenderTarget(1, 1);
  normalTarget.depthTexture = new THREE.DepthTexture(1, 1);
  let colourTarget = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
  const composite = new THREE.ShaderMaterial({
    vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: COMPOSITE_FRAGMENT,
    uniforms: {
      tColour: { value: null },
      tNormal: { value: null },
      tDepth: { value: null },
      texel: { value: new THREE.Vector2() },
      near: { value: 0.1 },
      far: { value: 60 },
      perspective: { value: true },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const quadScene = new THREE.Scene();
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite));
  const quadCamera = new THREE.Camera();

  let width = 1;
  let height = 1;
  const eye = new THREE.Vector3();
  const look = new THREE.Vector3();
  let first = true;

  return {
    resize(w: number, h: number) {
      width = w;
      height = h;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      const pw = Math.round(w * ratio);
      const ph = Math.round(h * ratio);
      normalTarget.dispose();
      colourTarget.dispose();
      normalTarget = new THREE.WebGLRenderTarget(pw, ph);
      normalTarget.depthTexture = new THREE.DepthTexture(pw, ph);
      colourTarget = new THREE.WebGLRenderTarget(pw, ph, { samples: 4 });
      composite.uniforms.texel.value.set(ratio / pw, ratio / ph);
      first = true;
    },
    /**
     * One frame at scroll `progress`, easing the camera toward its pose over
     * `seconds` so a fast scroll glides rather than jumps. Returns false when
     * nothing moved, so the caller can stop asking.
     */
    frame(progress: number, seconds: number): FlyPose | false {
      const pose = cameraPose(progress);
      const k = first ? 1 : 1 - Math.exp(-seconds * 8);
      const settled = !first && eye.distanceToSquared(pose.position) < 1e-8 && look.distanceToSquared(pose.target) < 1e-8;
      first = false;
      if (settled) return false;
      eye.lerp(pose.position, k);
      look.lerp(pose.target, k);
      camera.position.copy(eye);
      camera.up.set(0, 1, 0).lerp(pose.up, pose.overhead).normalize();
      camera.lookAt(look);
      camera.aspect = width / height;
      camera.fov = lensAt(progress) + (width / height < 0.8 ? 22 : 0);
      camera.updateProjectionMatrix();

      let litIndex = -1;
      let litGlow = 0;
      columns.forEach((column, index) => {
        const glow = columnGlow(index, progress);
        column.material.uniforms.glow.value = glow;
        if (glow > litGlow) {
          litGlow = glow;
          litIndex = index;
        }
      });

      scene.overrideMaterial = normalMaterial;
      camera.layers.set(0);
      camera.layers.enable(EDGES_ONLY);
      renderer.setRenderTarget(normalTarget);
      renderer.clear();
      renderer.render(scene, camera);

      scene.overrideMaterial = null;
      camera.layers.set(0);
      camera.layers.enable(COLOUR_ONLY);
      renderer.setRenderTarget(colourTarget);
      renderer.clear();
      renderer.render(scene, camera);

      composite.uniforms.tColour.value = colourTarget.texture;
      composite.uniforms.tNormal.value = normalTarget.texture;
      composite.uniforms.tDepth.value = normalTarget.depthTexture;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(quadScene, quadCamera);

      // The bloom sits behind the lit column; at the end, behind the centre of the view.
      const together = progress > ORBIT_END;
      let bloom = { x: width / 2, y: height / 2, opacity: together ? smoothstep(ORBIT_END + 0.05, 0.97, progress) : 0 };
      if (!together && litIndex >= 0) {
        const angle = columnAngle(litIndex);
        const p = new THREE.Vector3(RING * Math.cos(angle), STEP_TOP + 3, RING * Math.sin(angle)).project(camera);
        bloom = { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height, opacity: litGlow };
      }
      return { bloom };
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [steps, normalMaterial, composite, ...columns.map((column) => column.material)].forEach((material) => material.dispose());
      normalTarget.dispose();
      colourTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
