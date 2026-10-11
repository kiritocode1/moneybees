import * as THREE from "three";
import {
  COLUMN_COUNT,
  RING,
  SHAFT_BOTTOM,
  SHAFT_TOP,
  STEP_TOP,
  VOLUTE_X,
  VOLUTE_Y,
  columnAngle,
  columnParts,
  dome,
  entablature,
  finial,
  lathe,
} from "./tholos-scene";

/*
 * PREVIEW ONLY. The same 3D tholos, drawn the way the site's 2D figures are
 * (the pyramid in components/fact-sections/picks-section.tsx): an orthographic
 * camera at the pyramid's tilt, faces filled paper to light grey by their angle
 * to the light with the pyramid's own colours, the lit column in its orange,
 * and ink hairlines traced from the model's silhouettes and creases by a
 * depth-and-normal edge pass. Flutes shade as soft stripes but draw no lines,
 * so the shaft never fills with ink. The dashed ground ellipse, the bloom and
 * the leader label are 2D, drawn by the section around the canvas.
 *
 * Everything is driven by `at`, a continuous position through the panels:
 * 0 is the first pillar centred, 5 the sixth, 6 the roof. Below 0 the camera
 * comes down from above as the section arrives.
 *
 * Two views, for comparison. "outside": orthographic at the pyramid's tilt,
 * the ring turning in front of you. "inside": perspective, down into the ring
 * from overhead, then standing inside just across the centre from the lit
 * column and turning from one column to the next, then stepping to the centre
 * to look up as the roof comes down onto the six.
 */

/** Layers: shared parts are on 0; the fluted shaft draws colour only, its smooth twin draws edges only. */
export const COLOUR_ONLY = 1;
export const EDGES_ONLY = 2;

/** The pyramid's tilt: SQUASH .35 is a view about 20 degrees above the ground. */
const TILT = Math.asin(0.35);

/** Inside: eye height, and how far behind the centre the eye stands from the column it faces. */
const EYE = 2.3;
const BACK = 1.5;

export type DrawnView = "outside" | "inside";

/** The pyramid's faceFill, paper and orange, as a shader. Values are sRGB and pass through untouched. */
export const PAPER_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * n;
    #endif
    vNormal = normalize(normalMatrix * n);
    gl_Position = projectionMatrix * modelViewMatrix * local;
  }
`;
export const PAPER_FRAGMENT = /* glsl */ `
  uniform float glow;
  varying vec3 vNormal;
  void main() {
    // Light from the upper left of the view, as the pyramid's shading reads.
    vec3 light = normalize(vec3(-0.6, 0.62, 0.5));
    float shade = clamp(0.5 + 0.5 * dot(normalize(vNormal), light), 0.0, 1.0);
    vec3 paper = vec3(228.0 + 27.0 * shade, 227.0 + 28.0 * shade, 225.0 + 30.0 * shade) / 255.0;
    vec3 lit = vec3(201.0 + 46.0 * shade, 129.0 + 32.0 * shade, 16.0 + 10.0 * shade) / 255.0;
    gl_FragColor = vec4(mix(paper, lit, glow), 1.0);
  }
`;

/** Edges from depth and normals, in ink, or in the pyramid's lit stroke over orange. Premultiplied, transparent off the model. */
export const COMPOSITE_FRAGMENT = /* glsl */ `
  uniform sampler2D tColour;
  uniform sampler2D tNormal;
  uniform sampler2D tDepth;
  uniform vec2 texel;
  uniform float near;
  uniform float far;
  uniform bool perspective;
  varying vec2 vUv;
  /** Orthographic depth is already linear; perspective depth is turned back into view distance. */
  float depthAt(vec2 uv) {
    float z = texture2D(tDepth, uv).x;
    if (!perspective) return z;
    z = z * 2.0 - 1.0;
    return (2.0 * near * far) / (far + near - z * (far - near));
  }
  vec4 normalAt(vec2 uv) { return texture2D(tNormal, uv); }
  void main() {
    vec4 centre = normalAt(vUv);
    float d = depthAt(vUv);
    float depthEdge = 0.0;
    float normalEdge = 0.0;
    float cover = centre.a;
    // Forward neighbours only, so each edge is traced on one side: a one-pixel line, as the SVG strokes are.
    for (int k = 0; k < 3; k++) {
      vec2 dir = k == 0 ? vec2(1.0, 0.0) : (k == 1 ? vec2(0.0, 1.0) : vec2(1.0, 1.0));
      {
        vec2 uv = vUv + dir * texel;
        vec4 other = normalAt(uv);
        cover = max(cover, other.a);
        depthEdge = max(depthEdge, perspective ? abs(depthAt(uv) - d) / d : abs(depthAt(uv) - d));
        if (other.a > 0.5 && centre.a > 0.5) normalEdge = max(normalEdge, 1.0 - dot(other.xyz * 2.0 - 1.0, centre.xyz * 2.0 - 1.0));
        else if (other.a != centre.a) normalEdge = 1.0;
      }
    }
    float edge = max(perspective ? smoothstep(0.02, 0.06, depthEdge) : smoothstep(0.004, 0.012, depthEdge), smoothstep(0.28, 0.5, normalEdge));
    vec4 colour = texture2D(tColour, vUv);
    bool lit = colour.r - colour.b > 0.35;
    vec3 ink = lit ? vec3(0.604, 0.384, 0.031) : vec3(0.0);
    float inkAlpha = edge * 0.72;
    float body = centre.a;
    vec3 rgb = mix(colour.rgb, ink, inkAlpha);
    float alpha = max(body, inkAlpha);
    // Off the model the ink sits on the page alone.
    if (body < 0.5) rgb = ink;
    gl_FragColor = vec4(rgb * alpha, alpha);
  }
`;

/** The shaft's outline without flutes, for the edge pass only. */
export function smoothShaft() {
  const profile: [number, number][] = [[0.001, SHAFT_BOTTOM]];
  for (let j = 0; j <= 24; j += 1) {
    const t = j / 24;
    profile.push([0.3 - 0.045 * t ** 1.5 + 0.007 * Math.sin(Math.PI * t), SHAFT_BOTTOM + (SHAFT_TOP - SHAFT_BOTTOM) * t]);
  }
  profile.push([0.001, SHAFT_TOP]);
  return lathe(profile, 64);
}

export function stylobateGeometry() {
  return [4.15, 3.88, 3.62].map((radius, step) => {
    const y = step * 0.15;
    return lathe([[0.001, y], [radius, y], [radius, y], [radius, y + 0.15], [radius, y + 0.15], [0.001, y + 0.15]], 160);
  });
}

export type DrawnPose = {
  /** Screen positions, in CSS pixels, for the 2D layer. */
  ground: { cx: number; cy: number; rx: number; ry: number } | null;
  lit: { x: number; y: number; right: number } | null;
  bloom: { cx: number; cy: number; rx: number; ry: number; opacity: number };
};

/** Builds the drawn tholos on `canvas`. `frame(at)` renders and returns where the 2D layer should draw. */
export function createDrawnTholos(canvas: HTMLCanvasElement, view: DrawnView = "outside") {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const perspective = new THREE.PerspectiveCamera(66, 1, 0.1, 60);
  const camera = view === "inside" ? perspective : ortho;

  const paper = (glow = 0) =>
    new THREE.ShaderMaterial({ vertexShader: PAPER_VERTEX, fragmentShader: PAPER_FRAGMENT, uniforms: { glow: { value: glow } } });

  const steps = paper();
  for (const geometry of stylobateGeometry()) scene.add(new THREE.Mesh(geometry, steps));

  const parts = columnParts();
  const smooth = smoothShaft();
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const material = paper();
    const group = new THREE.Group();
    const add = (geometry: THREE.BufferGeometry, layer = 0, place?: (object: THREE.Object3D) => void) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.layers.set(layer);
      place?.(mesh);
      group.add(mesh);
    };
    for (const part of [parts.plinth, parts.base, parts.neck, parts.astragal, parts.echinus, parts.canalis, parts.abacus]) add(part);
    add(parts.shaft, COLOUR_ONLY);
    add(smooth, EDGES_ONLY);
    for (const side of [1, -1] as const) {
      // The bolster and spiral shade but draw no lines: traced, every turn of the spiral clots into ink.
      add(parts.bolster, COLOUR_ONLY, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
      const spiral = side === 1 ? parts.rightSpiral : parts.leftSpiral;
      for (const face of [1, -1] as const) {
        add(parts.disc, 0, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.3));
        add(spiral, COLOUR_ONLY, (m) => {
          m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.325);
          m.scale.z = face;
        });
      }
    }
    const angle = columnAngle(index);
    group.position.set(RING * Math.cos(angle), STEP_TOP, RING * Math.sin(angle));
    group.rotation.y = Math.PI / 2 - angle;
    scene.add(group);
    return { group, material };
  });

  const roofMaterial = paper();
  const roof = new THREE.Group();
  for (const geometry of [entablature(), dome(), finial()]) roof.add(new THREE.Mesh(geometry, roofMaterial));
  roof.visible = false;
  scene.add(roof);

  // Edge pass: view-space normals and depth.
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
      perspective: { value: view === "inside" },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite);
  const quadScene = new THREE.Scene();
  quadScene.add(quad);
  const quadCamera = new THREE.Camera();

  let width = 1;
  let height = 1;
  let ratio = 1;

  const project = (point: THREE.Vector3) => {
    const p = point.clone().project(camera);
    return { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height };
  };

  return {
    resize(w: number, h: number) {
      width = w;
      height = h;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      const pw = Math.round(w * ratio);
      const ph = Math.round(h * ratio);
      normalTarget.dispose();
      colourTarget.dispose();
      normalTarget = new THREE.WebGLRenderTarget(pw, ph);
      normalTarget.depthTexture = new THREE.DepthTexture(pw, ph);
      colourTarget = new THREE.WebGLRenderTarget(pw, ph, { samples: 4 });
      // One CSS pixel at either pixel ratio, near the SVG figures' 1.1px stroke.
      composite.uniforms.texel.value.set(ratio / pw, ratio / ph);
    },
    /** Renders the pose at `at` and returns where the 2D layer goes. */
    frame(at: number): DrawnPose {
      const roofIn = THREE.MathUtils.smoothstep(at, 5.25, 6);
      const arrive = THREE.MathUtils.smoothstep(at, -1.6, 0);
      // The ring turns continuously with the scroll: pillar i's column comes round to the front at at = i.
      const azimuth = columnAngle(Math.min(at, COLUMN_COUNT - 1) + Math.max(0, at - (COLUMN_COUNT - 1)) * 0.8) + 0.3;
      const tilt = TILT + (1 - arrive) * 0.9;

      columns.forEach((column, index) => {
        const own = 1 - THREE.MathUtils.smoothstep(Math.abs(at - index), 0.32, 0.62);
        column.material.uniforms.glow.value = Math.max(at > -0.4 ? own : 0, roofIn);
      });
      roof.visible = roofIn > 0.001;
      roof.position.y = (1 - roofIn) * 4;

      const facing = THREE.MathUtils.clamp(at, 0, COLUMN_COUNT - 1);
      if (view === "outside") {
        // Frame the ring, then the whole tholos once the roof is on; the view is a fixed ortho size.
        const half = 5.6 + roofIn * 1.0;
        const aspect = width / height;
        ortho.left = -half * Math.max(aspect, 1);
        ortho.right = half * Math.max(aspect, 1);
        ortho.top = half / Math.min(aspect, 1);
        ortho.bottom = -half / Math.min(aspect, 1);
        const look = new THREE.Vector3(0, 2.7 + roofIn * 1.3, 0);
        ortho.position.set(look.x + 30 * Math.cos(tilt) * Math.cos(azimuth), look.y + 30 * Math.sin(tilt), look.z + 30 * Math.cos(tilt) * Math.sin(azimuth));
        ortho.lookAt(look);
        ortho.updateProjectionMatrix();
      } else {
        // Inside: stand just across the centre from the column being faced, and turn with the scroll.
        const angle = columnAngle(facing);
        const inside = new THREE.Vector3(-BACK * Math.cos(angle), EYE, -BACK * Math.sin(angle));
        const aim = new THREE.Vector3(RING * Math.cos(angle), 2.95, RING * Math.sin(angle));
        const overhead = new THREE.Vector3(0, 21, 0);
        const centre = new THREE.Vector3(0, 1.2, 0);
        const sky = new THREE.Vector3(0.6 * Math.cos(angle), 14, 0.6 * Math.sin(angle));
        const eye = overhead.clone().lerp(inside, arrive).lerp(centre, roofIn);
        const target = new THREE.Vector3(0, 0, 0).lerp(aim, arrive).lerp(sky, roofIn);
        // Looking straight down or up, world up means nothing; there "up" on screen is toward the faced column.
        const vertical = Math.max(1 - arrive, roofIn);
        perspective.up.set(0, 1, 0).lerp(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)), vertical).normalize();
        perspective.position.copy(eye);
        perspective.lookAt(target);
        perspective.aspect = width / height;
        perspective.fov = THREE.MathUtils.lerp(66, 76, roofIn) - (1 - arrive) * 18;
        perspective.updateProjectionMatrix();
      }

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

      // The 2D layer: the dashed ground ellipse (outside only), the bloom behind the lit column, and its leader.
      const centre = project(new THREE.Vector3(0, 0, 0));
      const edgeX = project(new THREE.Vector3(5.3 * Math.cos(azimuth + Math.PI / 2), 0, 5.3 * Math.sin(azimuth + Math.PI / 2)));
      const edgeY = project(new THREE.Vector3(5.3 * Math.cos(azimuth), 0, 5.3 * Math.sin(azimuth)));
      const ground = view === "outside" ? { cx: centre.x, cy: centre.y, rx: Math.abs(edgeX.x - centre.x), ry: Math.abs(edgeY.y - centre.y) } : null;
      const focus = Math.round(facing);
      const showLeader = roofIn < 0.05 && arrive > 0.95 && Math.abs(at - focus) < 0.32;
      let lit: DrawnPose["lit"] = null;
      if (showLeader) {
        const angle = columnAngle(focus);
        const mid = project(new THREE.Vector3(RING * Math.cos(angle), STEP_TOP + 3.4, RING * Math.sin(angle)));
        lit = { x: mid.x, y: mid.y, right: width };
      }
      const scale = ground ? ground.rx : width * 0.75;
      const bloomCentre = roofIn > 0.5 ? (ground ? project(new THREE.Vector3(0, 3.2, 0)) : { x: width / 2, y: height / 2 }) : lit ?? centre;
      const bloom = {
        cx: bloomCentre.x,
        cy: bloomCentre.y,
        rx: roofIn > 0.5 ? scale * 0.9 : scale * 0.32,
        ry: roofIn > 0.5 ? scale * 0.75 : scale * 0.6,
        opacity: Math.max(lit ? 1 : 0, roofIn),
      };
      return { ground, lit, bloom };
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [steps, roofMaterial, normalMaterial, composite, ...columns.map((column) => column.material)].forEach((material) => material.dispose());
      normalTarget.dispose();
      colourTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
