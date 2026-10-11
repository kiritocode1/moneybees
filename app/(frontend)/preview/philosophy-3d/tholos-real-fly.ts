import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COLUMN_COUNT, ORBIT_END } from "@/components/philosophy/tholos-path";
import { COLOUR_ONLY, EDGES_ONLY } from "./tholos-drawn";
import { cameraPose, columnAngle, columnGlow, drumJoints, jointedProxy, lensAt, noise, weather, weatheredShaft } from "./tholos-fly";
import { RING, STEP_TOP, VOLUTE_X, VOLUTE_Y, columnParts, marbleMaps, marbleMaterial, stylobate } from "./tholos-scene";

/*
 * PREVIEW ONLY. The fly-through in real stone with a hairline accent: the
 * homepage camera move over weathered Ionic columns in veined marble under a
 * studio environment, soft shadows and ambient occlusion, the lit column
 * turning to gilt. Wear is physical: uneven drums, chipped flute edges, worn
 * corners, grime darkening toward the base. The one 2D touch is a fine ink
 * hairline on silhouettes and drum joints, light enough to read as drawing
 * over stone rather than outline.
 */

const MARBLE = new THREE.Color("#ffffff");
const GILT = new THREE.Color("#F2B13E");

/** Ink lines from depth and normals, laid over the finished image in display space. */
const HAIRLINE_SHADER = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    tNormal: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    texel: { value: new THREE.Vector2() },
    near: { value: 0.1 },
    far: { value: 60 },
    inkColour: { value: new THREE.Color(0.08, 0.08, 0.08) },
    inkStrength: { value: 0.42 },
  },
  vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D tNormal;
    uniform sampler2D tDepth;
    uniform vec2 texel;
    uniform float near;
    uniform float far;
    uniform vec3 inkColour;
    uniform float inkStrength;
    varying vec2 vUv;
    float distanceAt(vec2 uv) {
      float z = texture2D(tDepth, uv).x * 2.0 - 1.0;
      return (2.0 * near * far) / (far + near - z * (far - near));
    }
    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      vec4 centre = texture2D(tNormal, vUv);
      float d = distanceAt(vUv);
      float edge = 0.0;
      for (int k = 0; k < 3; k++) {
        vec2 dir = k == 0 ? vec2(1.0, 0.0) : (k == 1 ? vec2(0.0, 1.0) : vec2(1.0, 1.0));
        vec2 uv = vUv + dir * texel;
        vec4 other = texture2D(tNormal, uv);
        if (other.a != centre.a) { edge = 1.0; continue; }
        if (centre.a < 0.5) continue;
        edge = max(edge, smoothstep(0.03, 0.08, abs(distanceAt(uv) - d) / d));
        edge = max(edge, smoothstep(0.45, 0.7, 1.0 - dot(other.xyz * 2.0 - 1.0, centre.xyz * 2.0 - 1.0)));
      }
      // A light ink, so the line reads as drawing laid over stone, not a cartoon outline.
      float ink = edge * inkStrength;
      float alpha = max(base.a, ink);
      vec3 rgb = base.a > 0.0 ? base.rgb / base.a : vec3(0.0);
      rgb = mix(rgb, inkColour, ink);
      gl_FragColor = vec4(rgb * alpha, alpha);
    }
  `,
};

/** Bakes grime into a part as vertex colour: damp rising from the floor and soft patches, different per column. */
function grime<T extends THREE.BufferGeometry>(geometry: T, offset: THREE.Vector3, seed: number): T {
  const position = geometry.attributes.position;
  const colours = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i) + offset.x;
    const y = position.getY(i) + offset.y;
    const z = position.getZ(i) + offset.z;
    const damp = Math.max(0, 1 - Math.max(0, y - 0.45) / 1.4) ** 1.6;
    const patch = Math.max(0, noise(x * 1.7, y * 0.9, z * 1.7, seed) - 0.55) / 0.45;
    const streak = Math.max(0, noise(x * 6, y * 0.6, z * 6, seed + 9) - 0.6) / 0.4;
    const shade = 1 - 0.22 * damp * (0.6 + 0.4 * noise(x * 4, y * 4, z * 4, seed + 2)) - 0.12 * patch - 0.08 * streak;
    colours[i * 3] = shade;
    colours[i * 3 + 1] = shade * 0.985;
    colours[i * 3 + 2] = shade * 0.96;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  return geometry;
}

/** Plain white vertex colour, for parts that share the grimed material without their own grime. */
function clean<T extends THREE.BufferGeometry>(geometry: T): T {
  const colours = new Float32Array(geometry.attributes.position.count * 3).fill(1);
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  return geometry;
}

export type RealPose = { bloom: { x: number; y: number; opacity: number } };

/**
 * `dark` sets the scene for a black page: dramatic light, faint light hairlines
 * and no ambient-occlusion pass (it barely reads on black and is the costliest
 * pass). `shift` moves the subject right of centre by that share of the width,
 * leaving the left for text set over the scene.
 */
export function createRealFlythrough(canvas: HTMLCanvasElement, { dark = false, shift = 0 }: { dark?: boolean; shift?: number } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.setClearColor("#ffffff", 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = dark ? 0.32 : 0.55;
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

  const sun = new THREE.DirectionalLight("#fff8ee", dark ? 3.8 : 3.2);
  sun.position.set(-6, 15, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 8, bottom: -6, near: 1, far: 40 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  // The fluted shafts draw on the colour layer; the shadow camera has to see them too.
  sun.shadow.camera.layers.enable(COLOUR_ONLY);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#ffffff", dark ? "#1a1816" : "#e4e2dd", dark ? 0.18 : 0.35));
  if (dark) {
    // A cool rim from behind the ring, so the far sides of the columns separate from the black.
    const rim = new THREE.DirectionalLight("#cfd8ff", 1.1);
    rim.position.set(6, 9, -10);
    scene.add(rim);
  }
  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 96), new THREE.ShadowMaterial({ opacity: 0.07 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  // Colour only: its rim would otherwise trace as a hairline across the floor.
  ground.layers.set(COLOUR_ONLY);
  scene.add(ground);
  scene.add(stylobate());

  const maps = dark ? marbleMaps(256, 512) : marbleMaps();
  const parts = columnParts();
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const seed = 17 + index * 31;
    const material = marbleMaterial(maps);
    material.vertexColors = true;
    const angle = columnAngle(index);
    const offset = new THREE.Vector3(RING * Math.cos(angle), STEP_TOP, RING * Math.sin(angle));
    const group = new THREE.Group();
    const add = (geometry: THREE.BufferGeometry, layer = 0, place?: (object: THREE.Object3D) => void) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.layers.set(layer);
      place?.(mesh);
      group.add(mesh);
    };
    const joints = drumJoints(seed);
    add(grime(weather(parts.plinth, seed, 0.005, 0.03, 9), offset, seed));
    add(grime(weather(parts.base, seed + 1, 0.005, 0.02), offset, seed));
    add(grime(parts.neck.clone(), offset, seed));
    add(grime(weather(parts.astragal, seed + 2, 0.004, 0.008, 12), offset, seed));
    add(grime(weather(parts.echinus, seed + 3, 0.004, 0.012), offset, seed));
    add(grime(weather(parts.canalis, seed + 4, 0.004, 0.012, 10), offset, seed));
    add(grime(weather(parts.abacus, seed + 5, 0.005, 0.04, 9), offset, seed));
    add(grime(dark ? weatheredShaft(seed, joints, 8, 110) : weatheredShaft(seed, joints), offset, seed), COLOUR_ONLY);
    add(clean(jointedProxy(joints)), EDGES_ONLY);
    for (const side of [1, -1] as const) {
      add(grime(weather(parts.bolster, seed + 6, 0.004, 0.01), offset, seed), 0, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, 0));
      const spiral = side === 1 ? parts.rightSpiral : parts.leftSpiral;
      for (const face of [1, -1] as const) {
        add(grime(weather(parts.disc, seed + 7, 0.003, 0.01), offset, seed), 0, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.3));
        add(clean(spiral.clone()), COLOUR_ONLY, (m) => {
          m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.325);
          m.scale.z = face;
        });
        add(clean(parts.eye.clone()), COLOUR_ONLY, (m) => m.position.set(side * VOLUTE_X, VOLUTE_Y, face * 0.345));
      }
    }
    const beads = new THREE.InstancedMesh(clean(parts.bead.clone()), material, 40);
    for (let i = 0; i < 40; i += 1) {
      const a = (i / 40) * Math.PI * 2;
      matrix.makeTranslation(0.286 * Math.cos(a), 5.0, 0.286 * Math.sin(a));
      beads.setMatrixAt(i, matrix);
    }
    const eggs = new THREE.InstancedMesh(clean(parts.egg.clone()), material, 20);
    for (let i = 0; i < 20; i += 1) {
      const a = (i / 20) * Math.PI * 2;
      quaternion.setFromAxisAngle(up, -a - Math.PI / 2);
      matrix.compose(new THREE.Vector3(0.32 * Math.cos(a), 5.135, 0.32 * Math.sin(a)), quaternion, new THREE.Vector3(0.036, 0.056, 0.022));
      eggs.setMatrixAt(i, matrix);
    }
    for (const instanced of [beads, eggs]) {
      instanced.castShadow = true;
      instanced.layers.set(COLOUR_ONLY);
      group.add(instanced);
    }
    const light = new THREE.PointLight(GILT, 0, 6, 1.6);
    light.position.set(0, 2.4, 1.1);
    group.add(light);
    group.position.copy(offset);
    group.rotation.y = Math.PI / 2 - angle;
    scene.add(group);
    return { material, light };
  });

  // The edge pass: view normals and depth of the edge layer (proxies, not the fluted shafts).
  const normalMaterial = new THREE.MeshNormalMaterial();
  let normalTarget = new THREE.WebGLRenderTarget(1, 1);
  normalTarget.depthTexture = new THREE.DepthTexture(1, 1);

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType }));
  composer.addPass(new RenderPass(scene, camera));
  if (!dark) {
    const ao = new GTAOPass(scene, camera, 1, 1);
    ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.3, scale: 1.2, samples: 16 });
    ao.blendIntensity = 0.9;
    composer.addPass(ao);
  }
  composer.addPass(new OutputPass());
  const hairline = new ShaderPass(HAIRLINE_SHADER);
  if (dark) {
    hairline.uniforms.inkColour.value.set(1, 1, 1);
    hairline.uniforms.inkStrength.value = 0.22;
  }
  composer.addPass(hairline);

  let width = 1;
  let height = 1;
  const eye = new THREE.Vector3();
  const look = new THREE.Vector3();
  let first = true;

  return {
    resize(w: number, h: number) {
      width = w;
      height = h;
      const ratio = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(ratio);
      composer.setSize(w, h);
      const pw = Math.round(w * ratio);
      const ph = Math.round(h * ratio);
      normalTarget.dispose();
      normalTarget = new THREE.WebGLRenderTarget(pw, ph);
      normalTarget.depthTexture = new THREE.DepthTexture(pw, ph);
      hairline.uniforms.texel.value.set(ratio / pw, ratio / ph);
      first = true;
    },
    frame(progress: number, seconds: number): RealPose | false {
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
      // Render as if the frame ran on to the left, so the subject sits right of centre.
      if (shift > 0 && width / height > 1.2) camera.setViewOffset(width * (1 + shift * 2), height, 0, 0, width, height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();

      let litIndex = -1;
      let litGlow = 0;
      columns.forEach((column, index) => {
        const glow = columnGlow(index, progress);
        column.material.color.lerpColors(MARBLE, GILT, glow);
        column.material.metalness = glow * 0.9;
        column.material.roughness = 1 - glow * 0.62;
        column.light.intensity = glow * 2;
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
      hairline.uniforms.tNormal.value = normalTarget.texture;
      hairline.uniforms.tDepth.value = normalTarget.depthTexture;
      composer.render();

      const together = progress > ORBIT_END;
      let bloom = { x: width / 2, y: height / 2, opacity: together ? Math.min(1, (progress - ORBIT_END) / 0.1) * 0.7 : 0 };
      if (!together && litIndex >= 0) {
        const angle = columnAngle(litIndex);
        const p = new THREE.Vector3(RING * Math.cos(angle), STEP_TOP + 3, RING * Math.sin(angle)).project(camera);
        bloom = { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height, opacity: litGlow * 0.7 };
      }
      return { bloom };
    },
    dispose() {
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
      normalTarget.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
