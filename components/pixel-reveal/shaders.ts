/*
 * The Pixel Reveal shaders, from the bundle of https://pixel-text-reveal.vercel.app
 * (Pixel Reveal v2.0, by Yousuf), used with the author's permission. One
 * instanced quad per text unit; the fragment shader resolves each unit from
 * coarse ink-coverage blocks down to the crisp glyph atlas.
 */

export const VERTEX_SHADER = /* glsl */ `
attribute vec4 aCell;   // unit cell at rest: x, y, w, h (element px, on the coarse grid)
attribute vec2 aAtlas;  // cell origin inside the atlas (texels)
attribute vec4 aInk;    // unit ink bounds: x, y, w, h (element px)
attribute vec4 aLine;   // x, y: line mask top / bottom · z, w: line ink left / width (element px)
attribute vec2 aMeta;   // x: line index · y: unit index
attribute vec2 aAnim;   // x: this unit's reveal progress · y: rise offset in px (+ = below rest)

uniform vec2 uViewport;
uniform vec2 uOrigin;   // element origin on screen, px (snapped to device pixels)
uniform float uCollapse;

varying vec2 vRest;
varying float vY;
flat varying vec4 vCell;
flat varying vec2 vAtlas;
flat varying vec4 vInk;
flat varying vec4 vLine;
flat varying vec2 vMeta;
flat varying float vReveal;

void main() {
  // units that haven't started yet cost nothing: collapse them outside the clip volume
  if (uCollapse > 0.5 && aAnim.x <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 rest = aCell.xy + position.xy * aCell.zw;
  vec2 current = rest + vec2(0.0, aAnim.y);
  vRest = rest;
  vY = current.y;
  vCell = aCell;
  vAtlas = aAtlas;
  vInk = aInk;
  vLine = aLine;
  vMeta = aMeta;
  vReveal = aAnim.x;
  vec2 screen = uOrigin + current;
  gl_Position = vec4(screen.x / uViewport.x * 2.0 - 1.0, 1.0 - screen.y / uViewport.y * 2.0, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D uAtlas;
uniform vec2 uAtlasSize;
uniform float uDpr;
uniform float uTime;
uniform float uSeed;

uniform float uWhole;       // 1 = one front across the whole text
uniform float uProgress;    // that front's progress
uniform vec4 uInk;          // whole text ink bounds (element px)
uniform float uLines;
uniform float uMask;        // 1 while units rise from their line mask

uniform float uGrid;        // coarse block, texels = m · 2^k
uniform float uGridM;
uniform float uGridK;
uniform float uLevels;      // pixel levels before crisp type (0 = blocks only mask)

uniform int uDirection;     // config.DIRECTIONS
uniform int uPattern;       // config.PATTERNS
uniform float uNoise;
uniform float uScatter;
uniform float uSpread;
uniform float uSolid;

uniform vec3 uAccent;
uniform vec3 uAccent2;
uniform float uAccentMix;
uniform float uAccentStrength;
uniform float uAccentWidth;
uniform float uColorNoise;
uniform float uSparkle;
uniform float uFlicker;
uniform float uGlitch;
uniform vec4 uLens;         // xy pointer (element px) · z strength · w radius
uniform vec2 uViewport;
uniform float uClip;        // viewport y (px) below which a covering section hides this text

varying vec2 vRest;
varying float vY;
flat varying vec4 vCell;
flat varying vec2 vAtlas;
flat varying vec4 vInk;
flat varying vec4 vLine;
flat varying vec2 vMeta;
flat varying float vReveal;

// ── hashing ─────────────────────────────────────────────────────────────
uint pcg(uint v) {
  uint state = v * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

// 0..1, stable for any integer cell: the same block makes the same choice every frame
float hash(vec2 cell, float salt) {
  ivec2 c = ivec2(floor(cell)) + 32768;
  return float(pcg(uint(c.x) ^ pcg(uint(c.y) ^ pcg(uint(salt) + uint(uSeed))))) / 4294967295.0;
}

float vnoise(vec2 p, float salt) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i, salt);
  float b = hash(i + vec2(1.0, 0.0), salt);
  float c = hash(i + vec2(0.0, 1.0), salt);
  float d = hash(i + vec2(1.0, 1.0), salt);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
float bayer8(vec2 a) {
  return (bayer2(0.25 * a) * 0.25 + bayer2(0.5 * a)) * 0.25 + bayer2(a);
}

// ── reveal field ────────────────────────────────────────────────────────
// n = position inside the sweep rect (0..1, y down); 0 reveals first
float ramp(vec2 n, vec2 size) {
  if (uDirection == 0) return 1.0 - n.y;                  // up
  if (uDirection == 1) return n.y;                        // down
  if (uDirection == 2) return 1.0 - n.x;                  // left
  if (uDirection == 3) return n.x;                        // right
  float radial = length((n - 0.5) * size) / max(0.5 * length(size), 1.0);
  if (uDirection == 4) return radial;                     // center → out
  if (uDirection == 5) return 1.0 - radial;               // edges → in
  if (uDirection == 6) return (n.x + 1.0 - n.y) * 0.5;    // diagonal, bottom-left → top-right
  return 0.5;                                             // none
}

float pattern(vec2 cell, vec2 cellPx, vec2 n, vec4 rect) {
  if (uPattern == 0) return hash(cell, 1.0);                                          // random
  if (uPattern == 1) {                                                                // clusters
    float v = vnoise(cell * 0.34, 2.0) * 0.65 + vnoise(cell * 0.83 + 7.0, 3.0) * 0.35;
    return smoothstep(0.2, 0.8, v);
  }
  if (uPattern == 2) return 0.84 * hash(vec2(0.0, cell.y), 4.0) + 0.16 * hash(cell, 5.0); // scanlines
  if (uPattern == 3) return 0.84 * hash(vec2(cell.x, 0.0), 6.0) + 0.16 * hash(cell, 7.0); // rain
  if (uPattern == 4) {                                                                // typewriter
    if (uWhole > 0.5) {
      float x = clamp((cellPx.x - vLine.z) / max(vLine.w, 1.0), 0.0, 1.0);
      return (vMeta.x + x) / max(uLines, 1.0);
    }
    return n.x;
  }
  if (uPattern == 5) {                                                                // zigzag
    float top = floor(rect.y * uDpr / uGrid);
    float rows = max(1.0, ceil((rect.y + rect.w) * uDpr / uGrid) - top);
    float row = clamp(cell.y - top, 0.0, rows - 1.0);
    float x = mod(row, 2.0) < 0.5 ? n.x : 1.0 - n.x;
    return (row + x) / rows;
  }
  if (uPattern == 6) return fract((cell.x + cell.y) * 0.2);                           // cascade
  if (uPattern == 7) return bayer8(cell);                                             // bayer
  if (uPattern == 8) {                                                                // flow
    vec2 p = cell * 0.16;
    vec2 warp = vec2(vnoise(p + 3.7, 8.0), vnoise(p + 11.3, 9.0));
    float v = vnoise(p * 1.3 + warp * 2.4, 10.0) * 0.7 + vnoise(p * 2.7 + warp, 11.0) * 0.3;
    return smoothstep(0.22, 0.78, v);
  }
  return 0.5;                                                                         // none
}

float field(vec2 cell, vec2 cellPx) {
  vec4 rect = uWhole > 0.5 ? uInk : vInk;
  vec2 n = clamp((cellPx - rect.xy) / max(rect.zw, vec2(1.0)), 0.0, 1.0);
  float f;
  if (uDirection == 7) f = pattern(cell, cellPx, n, rect);
  else if (uPattern == 9) f = ramp(n, rect.zw);
  else f = mix(ramp(n, rect.zw), pattern(cell, cellPx, n, rect), uNoise);
  f += (hash(cell, 12.0) - 0.5) * uScatter;
  return clamp(f, 0.0, 1.0);
}

// hover lens: caps how far blocks near the pointer may have resolved
float lensCap(vec2 px) {
  if (uLens.z <= 0.0) return 1.0;
  float d = length(px - uLens.xy);
  return 1.0 - uLens.z * 0.86 * (1.0 - smoothstep(uLens.w * 0.15, uLens.w, d));
}

void main() {
  // under a section stacked over this one
  if (uViewport.y - gl_FragCoord.y / uDpr > uClip) discard;

  // units rising into place are clipped by their line
  if (uMask > 0.5 && (vY < vLine.x || vY > vLine.y)) discard;

  float progress = uWhole > 0.5 ? uProgress : vReveal;
  vec2 T = vRest * uDpr;                          // rest position, element texels
  vec2 cell = floor(T / uGrid);
  vec2 cellPx = (cell + 0.5) * uGrid / uDpr;

  // 1–2. this cell's life
  float f = field(cell, cellPx);
  float q = clamp((progress - f * (1.0 - uSpread)) / uSpread, 0.0, 1.0);
  if (q <= 0.0) discard;

  // 3. hierarchical refinement: a block splits in four once its own threshold passes
  float B = uGrid;
  vec2 block = cell;
  float level = 0.0;
  float life = min(q, lensCap(cellPx));
  for (int k = 1; k <= 6; k++) {
    if (float(k) > uLevels) break;
    float jitter = hash(block, 20.0 + float(k)) - 0.5;
    float threshold = mix(0.12, 0.84, (float(k) - 0.5 + jitter * 0.9) / uLevels);
    if (life < threshold) break;
    level = float(k);
    B *= 0.5;
    block = floor(T / B);
    life = min(q, lensCap((block + 0.5) * B / uDpr));
  }
  bool crisp = level >= uLevels;

  // 4. coverage
  vec2 cellOrigin = vCell.xy * uDpr;              // unit cell origin, element texels (on the grid)
  vec4 texel;
  if (crisp) {
    texel = textureLod(uAtlas, (vAtlas + T - cellOrigin) / uAtlasSize, 0.0);
  } else {
    // glitch: fresh rows tear sideways, a few frames at a time
    if (uGlitch > 0.0 && life < 0.55) {
      float tick = floor(uTime * 14.0);
      float row = floor(T.y / B);
      if (hash(vec2(row, tick), 30.0 + level) < uGlitch * (1.0 - life / 0.55)) {
        float shift = floor((hash(vec2(row, tick), 31.0) - 0.5) * 7.0);
        float first = cellOrigin.x / B;
        block.x = clamp(block.x + shift, first, first + vCell.z * uDpr / B - 1.0);
      }
    }
    // the block is m×m texels of mip level j: their mean is its exact ink coverage
    float j = uGridK - level;
    vec2 base = floor((vAtlas + block * B - cellOrigin) / exp2(j) + 0.5);
    int m = int(uGridM);
    vec4 sum = vec4(0.0);
    for (int y = 0; y < 3; y++) {
      for (int x = 0; x < 3; x++) {
        if (x < m && y < m) sum += texelFetch(uAtlas, ivec2(base) + ivec2(x, y), int(j));
      }
    }
    texel = sum / float(m * m);
  }

  // 5. colour
  float cover = texel.a;
  vec3 ink = cover > 0.0005 ? texel.rgb / cover : vec3(0.0);
  float alpha = cover;
  vec3 accent = mix(uAccent, uAccent2, step(hash(block, 40.0 + level), uAccentMix));
  float heat = uAccentStrength * (1.0 - smoothstep(0.0, uAccentWidth, life + (hash(block, 41.0 + level) - 0.5) * 0.18));

  if (!crisp) {
    // soft mosaic ↔ bitmap: a contrast curve on the block's coverage. Coarse blocks keep thin strokes
    // (low knee), fine ones hug the glyph; blocks that only graze a corner fade instead of popping.
    float fine = level / max(uLevels - 1.0, 1.0);
    alpha = mix(cover, smoothstep(mix(0.04, 0.16, fine), mix(0.3, 0.5, fine), cover), uSolid);
    // hot blocks are solid light (a half-transparent accent turns muddy over dark backgrounds);
    // they settle into their true coverage as they cool
    alpha = max(alpha, step(0.06, cover) * heat);

    // sparkle: an empty block near the front flashes once
    if (cover < 0.004 && uSparkle > 0.0) {
      float spark = 1.0 - life / 0.32;
      if (spark > 0.0 && hash(block, 42.0 + level) < uSparkle) {
        alpha = spark * 0.85;
        ink = accent;
      }
    }
    // flicker: fresh blocks blink
    if (uFlicker > 0.0 && life < 0.42) {
      float tick = floor(uTime * 20.0 + hash(block, 43.0) * 7.0);
      if (hash(block + tick * 13.0, 44.0) < uFlicker * (1.0 - life / 0.42)) alpha *= 0.15;
    }
    vec3 jitter = vec3(hash(block, 45.0), hash(block, 46.0), hash(block, 47.0)) - 0.5;
    ink = clamp(ink + jitter * uColorNoise * 2.0 * (1.0 - life), 0.0, 1.0);
  }

  vec3 color = mix(ink, accent, heat);
  if (alpha <= 0.002) discard;
  gl_FragColor = vec4(color * alpha, alpha);
}
`;
