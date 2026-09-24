    function h6(e, t, i) {
      let n = Math.max(2, e * t),
        r = null;
      for (let e = 0; e <= 10; e++)
        for (let t of [1, 3]) {
          let i = t * 2 ** e;
          if (i < 2) continue;
          let a = Math.abs(Math.log2(i / n));
          (!r || a < r.error - 1e-9) && (r = { size: i, m: t, k: e, error: a });
        }
      let a = 3 === r.m ? r.k + 1 : r.k;
      return { size: r.size, m: r.m, k: r.k, levels: Math.min(i, a) };
    }
    var h8 = e.i(76183);
    let h9 = (e, t, i) => Math.min(i, Math.max(t, e)),
      h7 = (e, t, i, n) =>
        Number.isFinite(i) ? e + (t - e) * (1 - Math.exp(-i * n)) : t;
    function ce(e) {
      let t = Math.imul(0x9e3779b9 ^ e, 0x85ebca6b);
      return (
        (t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35)),
        ((t ^= t >>> 16) >>> 0) / 0x100000000
      );
    }
    let ct = `
attribute vec4 aCell;   // unit cell at rest: x, y, w, h (element px, on the coarse grid)
attribute vec2 aAtlas;  // cell origin inside the atlas (texels)
attribute vec4 aInk;    // unit ink bounds: x, y, w, h (element px)
attribute vec4 aLine;   // x, y: line mask top / bottom \xb7 z, w: line ink left / width (element px)
attribute vec2 aMeta;   // x: line index \xb7 y: unit index
attribute vec2 aAnim;   // x: this unit's reveal progress \xb7 y: rise offset in px (+ = below rest)

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
`,
      ci = `
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

uniform float uGrid;        // coarse block, texels = m \xb7 2^k
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
uniform vec4 uLens;         // xy pointer (element px) \xb7 z strength \xb7 w radius
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
    // the block is m\xd7m texels of mip level j: their mean is its exact ink coverage
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
`,
      cn = "data-pr-state",
      cr = new Map();
    function ca(e) {
      if ("top" === e) return { f: 0, px: 0 };
      if ("center" === e || "middle" === e) return { f: 0.5, px: 0 };
      if ("bottom" === e) return { f: 1, px: 0 };
      let t = parseFloat(e);
      return Number.isFinite(t)
        ? e.endsWith("%")
          ? { f: t / 100, px: 0 }
          : { f: 0, px: t }
        : null;
    }
    let cs = new Map(),
      co = null;
    function cl(e, t) {
      let i = cs.get(e);
      if (!i) {
        ((co ??= document
          .createElement("canvas")
          .getContext("2d", { willReadFrequently: !0 })).clearRect(0, 0, 1, 1),
          (co.fillStyle = "#000"),
          (co.fillStyle = e),
          co.fillRect(0, 0, 1, 1));
        let [t, n, r] = co.getImageData(0, 0, 1, 1).data;
        ((i = [t / 255, n / 255, r / 255]), cs.set(e, i));
      }
      return t.set(i[0], i[1], i[2]);
    }
    function ch(e) {
      let t = hj.parseEase(e);
      return "function" == typeof t
        ? t
        : (console.warn(`[pixel-reveal] unknown ease "${e}", using power2.out`),
          hj.parseEase("power2.out"));
    }
    class cc {
      constructor(e, t, i, n) {
        ((this.engine = e),
          (this.el = t),
          (this.handlers = n),
          (this.options = (0, h8.resolveOptions)(i)),
          (this.time = 0),
          (this.total = 1),
          (this.dir = 0),
          (this.wait = 0),
          (this.fired = !1),
          (this.pendingSeek = null),
          (this.events = []),
          (this.count = 0),
          (this.empty = !1),
          (this.disabled = !1),
          (this.warnedPin = !1),
          (this.stale = !0),
          (this.signature = ""),
          (this.dpr = e.dpr),
          (this.box = { top: 0, left: 0, width: 0, height: 0 }),
          (this.pin = null),
          (this.delta = { x: 0, y: 0 }),
          (this.margin = 0),
          (this.textColor = "#000"),
          (this.texture = null),
          (this.anim = null),
          (this.animAttr = null),
          (this.unitHeights = new Float32Array(0)),
          (this.riseDist = new Float32Array(0)),
          (this.order = new Float32Array(0)),
          (this.revealed = !1),
          (this.timeDirty = !0),
          (this.dirty = !0),
          (this.inside = !1),
          (this.lens = 0),
          (this.lensX = 0),
          (this.lensY = 0),
          (this.state = "hidden"),
          (this.nextState = "hidden"),
          t.hasAttribute("data-pixel-reveal") ||
            t.setAttribute("data-pixel-reveal", ""),
          t.setAttribute(cn, "hidden"),
          (this.uniforms = {
            uViewport: e.shared.uViewport,
            uTime: e.shared.uTime,
            uOrigin: { value: new A() },
            uCollapse: { value: 1 },
            uAtlas: { value: null },
            uAtlasSize: { value: new A(1, 1) },
            uDpr: { value: 1 },
            uSeed: { value: 0 },
            uWhole: { value: 0 },
            uProgress: { value: 0 },
            uInk: { value: new j(0, 0, 1, 1) },
            uLines: { value: 1 },
            uMask: { value: 0 },
            uGrid: { value: 16 },
            uGridM: { value: 1 },
            uGridK: { value: 4 },
            uLevels: { value: 3 },
            uDirection: { value: 0 },
            uPattern: { value: 0 },
            uNoise: { value: 0 },
            uScatter: { value: 0 },
            uSpread: { value: 0.5 },
            uSolid: { value: 0 },
            uAccent: { value: new C() },
            uAccent2: { value: new C() },
            uAccentMix: { value: 0 },
            uAccentStrength: { value: 0 },
            uAccentWidth: { value: 0.5 },
            uColorNoise: { value: 0 },
            uSparkle: { value: 0 },
            uFlicker: { value: 0 },
            uGlitch: { value: 0 },
            uLens: { value: new j() },
            uClip: { value: 1e6 },
          }),
          (this.material = new i_({
            vertexShader: ct,
            fragmentShader: ci,
            uniforms: this.uniforms,
            transparent: !0,
            premultipliedAlpha: !0,
            depthTest: !1,
            depthWrite: !1,
          })),
          (this.mesh = new tz(new iV(), this.material)),
          (this.mesh.frustumCulled = !1),
          (this.mesh.matrixAutoUpdate = !1),
          (this.mesh.visible = !1),
          this.applyUniforms(),
          t.addEventListener("pointerenter", this.onEnter),
          t.addEventListener("pointerleave", this.onLeave),
          (this.mutations = new MutationObserver(this.onMutate)),
          this.mutations.observe(t, {
            subtree: !0,
            childList: !0,
            characterData: !0,
          }));
      }
      setOptions(e) {
        let t = (0, h8.resolveOptions)(e),
          i = (0, h8.diffOptions)(this.options, t);
        if (!i.any) return;
        let n = this.count > 0 && this.time >= this.total;
        ((this.options = t),
          i.layout &&
            ((this.stale = !0),
            (this.signature = ""),
            this.engine.requestResize()),
          i.timeline && this.count && this.computeTimeline(n),
          i.trigger && this.resetTrigger(),
          this.applyUniforms(),
          (this.dirty = !0));
      }
      resetTrigger() {
        ((this.fired = !1),
          (this.dir = 0),
          (this.wait = 0),
          "scrub" !== this.options.trigger &&
            "pin" !== this.options.trigger &&
            (this.time = 0),
          (this.timeDirty = !0));
      }
      applyUniforms() {
        let e = this.options,
          t = this.uniforms;
        ((t.uLevels.value = h6(e.pixel, t.uDpr.value, e.levels).levels),
          (t.uWhole.value = +("whole" === e.sweep)),
          (t.uCollapse.value = +("whole" !== e.sweep)),
          (t.uMask.value = +(0 !== e.rise)),
          (t.uDirection.value = h8.DIRECTIONS.indexOf(e.direction)),
          (t.uPattern.value = h8.PATTERNS.indexOf(e.pattern)),
          (t.uNoise.value = e.noise),
          (t.uScatter.value = e.scatter),
          (t.uSpread.value = e.spread),
          (t.uSolid.value = e.solid),
          cl(e.accent ?? this.textColor, t.uAccent.value),
          e.accent2
            ? cl(e.accent2, t.uAccent2.value)
            : t.uAccent2.value.copy(t.uAccent.value),
          (t.uAccentMix.value = e.accent2 ? e.accentMix : 0),
          (t.uAccentStrength.value = e.accent ? e.accentStrength : 0),
          (t.uAccentWidth.value = e.accentWidth),
          (t.uColorNoise.value = e.colorNoise),
          (t.uSparkle.value = e.sparkle),
          (t.uFlicker.value = e.flicker),
          (t.uGlitch.value = e.glitch),
          (t.uSeed.value = Math.floor(
            65535 * ce(Math.round(1e3 * e.seed) + 7),
          )),
          (this.animated = e.flicker > 0 || e.glitch > 0));
      }
      measure(e, t, i) {
        let n = this.el.getBoundingClientRect();
        this.box = {
          top: n.top + e,
          left: n.left + t,
          width: n.width,
          height: n.height,
        };
        let r = this.engine.stickyOf(this.el, e);
        ((this.pin = r && { ...r, offset: n.top + e - r.docTop }),
          i !== this.dpr && ((this.dpr = i), (this.signature = "")),
          (this.stale = !0),
          "active" === this.nextState && this.rebuild());
      }
      docTopAt(e) {
        let t = this.pin;
        return t
          ? t.base + h9(e - t.start, 0, t.range) + t.offset
          : this.box.top;
      }
      rebuild() {
        this.stale = !1;
        let e = this.options,
          t = (function (e, t) {
            let i = e.getBoundingClientRect(),
              n = (function (e, t, i) {
                let n = [],
                  r = document.createRange(),
                  a = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
                  s = !0;
                for (let e = a.nextNode(); e; e = a.nextNode()) {
                  let a = e.data,
                    o = e.parentElement;
                  if (!a || !o) continue;
                  let l = (function (e, t) {
                      let i = t.get(e);
                      if (i) return i;
                      let n = getComputedStyle(e),
                        r =
                          "normal" === n.letterSpacing
                            ? 0
                            : parseFloat(n.letterSpacing) || 0;
                      return (
                        ((i = {
                          el: e,
                          font: `${n.fontStyle} ${n.fontWeight} ${n.fontSize} ${n.fontFamily}`,
                          fontSize: parseFloat(n.fontSize) || 16,
                          color: n.color,
                          letterSpacing: r,
                          kerning:
                            "none" === n.fontKerning
                              ? "none"
                              : "normal" === n.fontKerning
                                ? "normal"
                                : "auto",
                          stretch: hK[n.fontStretch] ?? "normal",
                          caps: n.fontVariantCaps || "normal",
                          rtl: "rtl" === n.direction,
                          transform: n.textTransform,
                          visible: "visible" === n.visibility,
                          inline: !/flex|grid|table/.test(n.display),
                          ascent: 0,
                        }).key =
                          `${i.font}|${i.color}|${r}|${i.kerning}|${i.stretch}|${i.caps}`),
                        t.set(e, i),
                        i
                      );
                    })(o, i),
                    h = "chars" === t || (!hY && 0 !== l.letterSpacing);
                  hq.lastIndex = 0;
                  for (let t = hq.exec(a); t; t = hq.exec(a)) {
                    let i = t.index,
                      a = t[0],
                      o = 0 === i && !s;
                    if (((s = !1), !l.visible)) continue;
                    if (h) {
                      hQ(a).forEach((t, a) => {
                        (r.setStart(e, i + t.index),
                          r.setEnd(e, i + t.index + t.text.length));
                        let s = r.getClientRects()[0];
                        s &&
                          (s.width || s.height) &&
                          n.push({
                            text: t.text,
                            rect: h1(s),
                            style: l,
                            joined: 0 !== a || o,
                            wordStart: 0 === a,
                          });
                      });
                      continue;
                    }
                    (r.setStart(e, i), r.setEnd(e, i + a.length));
                    let c = r.getClientRects();
                    if (!c.length) continue;
                    if (1 === c.length) {
                      if (!c[0].width && !c[0].height) continue;
                      n.push({
                        text: a,
                        rect: h1(c[0]),
                        style: l,
                        joined: o,
                        wordStart: !0,
                      });
                      continue;
                    }
                    let u = null;
                    hQ(a).forEach((t, a) => {
                      (r.setStart(e, i + t.index),
                        r.setEnd(e, i + t.index + t.text.length));
                      let s = r.getClientRects()[0];
                      if (s) {
                        if (u && 1 > Math.abs(s.top - u.rect.top)) {
                          ((u.text += t.text),
                            (u.rect.left = Math.min(u.rect.left, s.left)),
                            (u.rect.right = Math.max(u.rect.right, s.right)));
                          return;
                        }
                        ((u = {
                          text: t.text,
                          rect: h1(s),
                          style: l,
                          joined: 0 === a && o,
                          wordStart: 0 === a,
                        }),
                          n.push(u));
                      }
                    });
                  }
                  s = /\s$/.test(a);
                }
                for (let e of n) {
                  var o, l, h;
                  ((o = e.text),
                    (l = e.style.transform),
                    (h = e.wordStart),
                    (e.text =
                      "uppercase" === l
                        ? o.toUpperCase()
                        : "lowercase" === l
                          ? o.toLowerCase()
                          : "capitalize" === l && h
                            ? o.charAt(0).toUpperCase() + o.slice(1)
                            : o));
                }
                return n;
              })(e, t, new Map());
            if (!n.length) return { rect: i, units: [], lines: [], ink: null };
            !(function (e) {
              let t = new Map();
              for (let i of e) t.has(i.style) || t.set(i.style, i);
              let i = hZ();
              for (let [e, n] of t) {
                let t = NaN;
                if (e.inline) {
                  let i = document.createElement("span");
                  (i.setAttribute("aria-hidden", "true"),
                    (i.style.cssText =
                      "display:inline-block;width:0;height:0;margin:0;padding:0;border:0;vertical-align:baseline"),
                    e.el.insertBefore(i, e.el.firstChild));
                  let r = i.getBoundingClientRect().bottom;
                  (i.remove(),
                    r > n.rect.top &&
                      r <= n.rect.bottom &&
                      (t = r - n.rect.top));
                }
                (Number.isFinite(t) ||
                  (h0(i, e),
                  (t = Math.round(i.measureText("Hg").fontBoundingBoxAscent))),
                  (e.ascent = t));
              }
              for (let t of e) t.baseline = t.rect.top + t.style.ascent;
            })(n);
            let r = hZ(),
              a = "";
            for (let e of n) {
              e.style.key !== a && (h0(r, e.style), (a = e.style.key));
              let t = r.measureText(e.text);
              ((e.x = e.style.rtl ? e.rect.right : e.rect.left),
                (e.ink = {
                  left: e.x - t.actualBoundingBoxLeft,
                  right: e.x + Math.max(t.actualBoundingBoxRight, 0),
                  top: e.baseline - t.actualBoundingBoxAscent,
                  bottom: e.baseline + t.actualBoundingBoxDescent,
                }));
            }
            let s = (function (e) {
                let t = [],
                  i = NaN;
                for (let n of e)
                  ((!t.length ||
                    Math.abs(n.baseline - i) > 0.45 * n.style.fontSize) &&
                    (t.push({ ink: null, baseline: n.baseline }),
                    (i = n.baseline)),
                    (n.line = t.length - 1),
                    (t[n.line].ink = h2(t[n.line].ink, n.ink)));
                return t;
              })(n),
              o = (function (e, t) {
                if ("none" === t) return [h3(e)];
                if ("chars" === t) return e.map((e) => h3([e]));
                let i = [];
                for (let n of e) {
                  let e = i[i.length - 1],
                    r = e?.[e.length - 1];
                  (
                    "lines" === t
                      ? r?.line === n.line
                      : n.joined && r?.line === n.line
                  )
                    ? e.push(n)
                    : i.push([n]);
                }
                return i.map(h3);
              })(n, t),
              l = null;
            for (let e of s) l = h2(l, e.ink);
            return { rect: i, units: o, lines: s, ink: l };
          })(this.el, e.split);
        this.mutations.takeRecords();
        let i = t.rect,
          n = window.scrollY;
        if (
          (this.pin || (this.box.top = i.top + n),
          (this.box.left = i.left + window.scrollX),
          (this.box.width = i.width),
          (this.box.height = i.height),
          !t.units.length)
        ) {
          ((this.empty = !0),
            (this.count = 0),
            (this.mesh.visible = !1),
            (this.nextState = "static"));
          return;
        }
        this.empty && ((this.empty = !1), (this.nextState = "hidden"));
        let r = this.dpr,
          a = { x: Math.floor(i.left * r) / r, y: Math.floor(i.top * r) / r },
          s = h6(e.pixel, r, e.levels),
          o = `${e.split}|${s.size}|${r}|${(function (e, t) {
            let i = "";
            for (let n of e.units) {
              for (let e of n.runs)
                i += `${e.text}@${(e.x - t.x).toFixed(2)},${(e.baseline - t.y).toFixed(2)}:${e.style.key};`;
              i += "|";
            }
            return i;
          })(t, a)}`;
        if (
          ((this.delta = { x: a.x - i.left, y: a.y - i.top }),
          o === this.signature)
        )
          return;
        this.signature = o;
        let l = Math.min(this.engine.maxTextureSize, 8192),
          h = r,
          c = null;
        for (let i = 0; i < 5 && !c; i++)
          ((s = h6(e.pixel, h, e.levels)),
            (c = (function (
              e,
              { origin: t, dpr: i, grid: n, maxSize: r, scroll: a },
            ) {
              let s = e.map(({ ink: e }) => {
                  let r = Math.floor(((e.left - t.x) * i - 3) / n) * n,
                    a = Math.floor(((e.top - t.y) * i - 3) / n) * n;
                  return {
                    x: r,
                    y: a,
                    w: Math.ceil(((e.right - t.x) * i + 3) / n) * n - r,
                    h: Math.ceil(((e.bottom - t.y) * i + 3) / n) * n - a,
                  };
                }),
                o = Math.floor(r / n) * n,
                l = [],
                h = 0,
                c = 0,
                u = 0,
                d = n;
              for (let e of s) {
                if (e.w > o) return null;
                (h + e.w > o && ((h = 0), (c += u), (u = 0)),
                  l.push({ x: h, y: c }),
                  (h += e.w),
                  (u = Math.max(u, e.h)),
                  (d = Math.max(d, h)));
              }
              let p = Math.max(n, c + u);
              if (p > r) return null;
              let f = document.createElement("canvas");
              ((f.width = d), (f.height = p));
              let m = f.getContext("2d");
              return (
                e.forEach((e, n) => {
                  let r = s[n],
                    o = l[n];
                  (m.save(),
                    m.beginPath(),
                    m.rect(o.x, o.y, r.w, r.h),
                    m.clip(),
                    m.setTransform(
                      i,
                      0,
                      0,
                      i,
                      o.x - r.x - t.x * i,
                      o.y - r.y - t.y * i,
                    ));
                  let h = "";
                  for (let t of e.runs)
                    (t.style.key !== h &&
                      (h0(m, t.style),
                      (m.fillStyle = t.style.color),
                      (h = t.style.key)),
                      m.fillText(t.text, t.x, h5(t.baseline, a, i)));
                  m.restore();
                }),
                { canvas: f, width: d, height: p, cells: s, slots: l }
              );
            })(t.units, {
              origin: a,
              dpr: h,
              grid: s.size,
              maxSize: l,
              scroll: n,
            })) || (h *= 0.7));
        if (!c) {
          (console.warn(
            "[pixel-reveal] text too large for one texture, showing it as plain text",
            this.el,
          ),
            (this.empty = !0),
            (this.count = 0),
            (this.nextState = "static"));
          return;
        }
        let { units: u, lines: d } = t,
          p = u.length,
          f = new Float32Array(4 * p),
          m = new Float32Array(2 * p),
          g = new Float32Array(4 * p),
          _ = new Float32Array(4 * p),
          v = new Float32Array(2 * p),
          x = d.map(() => [1 / 0, -1 / 0]);
        c.cells.forEach((e, t) => {
          let i = x[u[t].line];
          ((i[0] = Math.min(i[0], e.y / h)),
            (i[1] = Math.max(i[1], (e.y + e.h) / h)));
        });
        let y = 0;
        u.forEach((e, t) => {
          let i = c.cells[t],
            n = c.slots[t],
            r = d[e.line];
          (f.set([i.x / h, i.y / h, i.w / h, i.h / h], 4 * t),
            m.set([n.x, n.y], 2 * t),
            g.set(
              [
                e.ink.left - a.x,
                e.ink.top - a.y,
                e.ink.right - e.ink.left,
                e.ink.bottom - e.ink.top,
              ],
              4 * t,
            ),
            _.set(
              [
                x[e.line][0],
                x[e.line][1],
                r.ink.left - a.x,
                r.ink.right - r.ink.left,
              ],
              4 * t,
            ),
            v.set([e.line, t], 2 * t),
            (y = Math.max(y, e.height)));
        });
        let S = new iV();
        (S.setIndex([0, 2, 1, 2, 3, 1]),
          S.setAttribute(
            "position",
            new ta([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0], 3),
          ),
          S.setAttribute("aCell", new tH(f, 4)),
          S.setAttribute("aAtlas", new tH(m, 2)),
          S.setAttribute("aInk", new tH(g, 4)),
          S.setAttribute("aLine", new tH(_, 4)),
          S.setAttribute("aMeta", new tH(v, 2)),
          (this.anim = new Float32Array(2 * p)),
          (this.animAttr = new tH(this.anim, 2).setUsage(35048)),
          S.setAttribute("aAnim", this.animAttr),
          (S.instanceCount = p),
          this.mesh.geometry.dispose(),
          (this.mesh.geometry = S));
        let M = new t$(c.canvas);
        ((M.flipY = !1),
          (M.premultiplyAlpha = !0),
          (M.colorSpace = ""),
          (M.generateMipmaps = !0),
          (M.minFilter = 1008),
          (M.magFilter = 1006),
          this.engine.renderer.initTexture(M),
          (c.canvas.width = 0),
          (c.canvas.height = 0),
          this.texture?.dispose(),
          (this.texture = M));
        let T = this.uniforms;
        ((T.uAtlas.value = M),
          T.uAtlasSize.value.set(c.width, c.height),
          (T.uDpr.value = h),
          (T.uGrid.value = s.size),
          (T.uGridM.value = s.m),
          (T.uGridK.value = s.k),
          (T.uLines.value = d.length),
          T.uInk.value.set(
            t.ink.left - a.x,
            t.ink.top - a.y,
            t.ink.right - t.ink.left,
            t.ink.bottom - t.ink.top,
          ),
          (this.textColor = u[0].runs[0].style.color),
          (this.unitHeights = Float32Array.from(u, (e) => e.height)),
          (this.margin = Math.abs(e.rise) * y + (s.size / h) * 2 + 40));
        let b = this.count > 0 && this.time >= this.total;
        ((this.count = p),
          this.computeTimeline(b),
          this.applyUniforms(),
          (this.dirty = !0));
      }
      computeTimeline(e) {
        let t = this.options,
          i = this.count,
          n = new Float32Array(i),
          r = (i - 1) / 2;
        if ("random" === t.from) {
          let e = Math.round(1e3 * t.seed);
          Array.from({ length: i }, (e, t) => t)
            .sort((t, i) => ce(7919 * t + e) - ce(7919 * i + e))
            .forEach((e, t) => (n[e] = t));
        } else
          for (let e = 0; e < i; e++)
            n[e] =
              "end" === t.from
                ? i - 1 - e
                : "center" === t.from
                  ? Math.abs(e - r)
                  : "edges" === t.from
                    ? r - Math.abs(e - r)
                    : e;
        this.order = n;
        let a = 0;
        for (let e = 0; e < i; e++) a = Math.max(a, n[e]);
        let s = a * t.stagger;
        this.riseDist = Float32Array.from(this.unitHeights, (e) => t.rise * e);
        let o = ("whole" === t.sweep ? 0 : s) + t.revealDelay + t.duration,
          l = 0 !== t.rise ? s + t.riseDuration : 0;
        ((this.total = Math.max(o, l, 0.001)),
          (this.easeReveal = ch(t.ease)),
          (this.easeRise = ch(t.riseEase)),
          null !== this.pendingSeek
            ? ((this.time = this.pendingSeek * this.total),
              (this.pendingSeek = null))
            : (this.time = e ? this.total : Math.min(this.time, this.total)),
          (this.timeDirty = !0));
      }
      evaluate() {
        let e = this.options,
          t = this.time,
          i = this.anim,
          n = !1;
        for (let r = 0; r < this.count; r++) {
          let a = this.order[r] * e.stagger,
            s = (t - a - e.revealDelay) / e.duration;
          ((s = s <= 0 ? 0 : s >= 1 ? 1 : h9(this.easeReveal(s), 0, 1)),
            (i[2 * r] = s),
            s > 0 && (n = !0));
          let o = 1;
          (0 !== this.riseDist[r] &&
            (o =
              (o = (t - a) / e.riseDuration) <= 0
                ? 0
                : o >= 1
                  ? 1
                  : this.easeRise(o)),
            (i[2 * r + 1] = (1 - o) * this.riseDist[r]));
        }
        if ("whole" === e.sweep) {
          let i = (t - e.revealDelay) / e.duration;
          ((i = i <= 0 ? 0 : i >= 1 ? 1 : h9(this.easeReveal(i), 0, 1)),
            (this.uniforms.uProgress.value = i),
            (n = i > 0));
        }
        ((this.revealed = n), (this.animAttr.needsUpdate = !0));
      }
      lineScroll(e, t, i) {
        let { el: n, vp: r } = (function (e) {
          let t = String(e),
            i = cr.get(t);
          if (i) return i;
          if ("number" == typeof e)
            i = { el: { f: 0, px: 0 }, vp: { f: e, px: 0 } };
          else {
            let [e = "top", n = "bottom"] = t.trim().split(/\s+/),
              r = ca(e),
              a = ca(n);
            r && a
              ? (i = { el: r, vp: a })
              : (console.warn(
                  `[pixel-reveal] can't read start/end "${t}" — use e.g. "top 85%"`,
                ),
                (i = { el: { f: 0, px: 0 }, vp: { f: 0.88, px: 0 } }));
          }
          return (cr.set(t, i), i);
        })(e);
        return Math.min(
          t + n.f * this.box.height + n.px - (r.f * i + r.px),
          this.engine.maxScroll - 1,
        );
      }
      scrubProgress(e, t, i) {
        let n = this.options;
        if ("pin" === n.trigger && this.pin) {
          let t = Math.max(1, this.pin.range),
            i = "number" == typeof n.start ? n.start : 0,
            r = "number" == typeof n.end ? n.end : 0.85;
          return h9(
            ((e - this.pin.start) / t - i) / Math.max(1e-4, r - i),
            0,
            1,
          );
        }
        "pin" !== n.trigger ||
          this.warnedPin ||
          ((this.warnedPin = !0),
          console.warn(
            '[pixel-reveal] trigger="pin" needs a <PinSection> (or another sticky ancestor) around it — scrubbing through the viewport instead',
            this.el,
          ));
        let r = "scrub" === n.trigger,
          a = this.lineScroll(r ? n.start : "top 92%", t, i),
          s = this.lineScroll(r ? n.end : "bottom 55%", t, i);
        return s - a < 1 ? +(e >= s) : h9((e - a) / (s - a), 0, 1);
      }
      drive(e, t, i, n) {
        let r = this.options;
        switch (r.trigger) {
          case "load":
            this.fired || ((this.fired = !0), this.play(r.delay));
            break;
          case "inview": {
            let e = t >= this.lineScroll(r.start, n, i);
            e && !this.fired
              ? ((this.fired = !0), this.play(r.delay))
              : e ||
                !this.fired ||
                r.once ||
                ((this.fired = !1), this.reverse());
            break;
          }
          case "scrub":
          case "pin": {
            let a = this.scrubProgress(t, n, i) * this.total;
            ((this.dir = 0),
              (this.time =
                r.smooth > 0 ? h7(this.time, a, 3 / r.smooth, e) : a),
              1e-4 > Math.abs(this.time - a) && (this.time = a));
            return;
          }
        }
        0 !== this.dir && this.advance(e);
      }
      advance(e) {
        if (this.wait > 0) {
          if (((this.wait -= e), this.wait > 0)) return;
          ((e = -this.wait), (this.wait = 0));
        }
        ((this.time +=
          e * (this.dir > 0 ? 1 : this.options.reverseSpeed) * this.dir),
          this.time >= this.total
            ? ((this.time = this.total), (this.dir = 0))
            : this.time <= 0 && ((this.time = 0), (this.dir = 0)));
      }
      play(e = 0) {
        ((this.wait = this.time <= 0 ? e : 0), (this.dir = 1));
      }
      reverse() {
        ((this.wait = 0), (this.dir = -1));
      }
      control(e, t) {
        switch (e) {
          case "play":
            this.play(0);
            break;
          case "reverse":
            this.reverse();
            break;
          case "restart":
            ((this.time = 0), (this.timeDirty = !0), this.play(0));
            break;
          case "pause":
            ((this.dir = 0), (this.wait = 0));
            break;
          case "seek": {
            let e = h9(Number(t) || 0, 0, 1);
            ((this.dir = 0),
              (this.wait = 0),
              this.count
                ? (this.time = e * this.total)
                : (this.pendingSeek = e),
              (this.timeDirty = !0));
            break;
          }
          case "progress":
            return this.count ? this.time / this.total : 0;
        }
      }
      update(e, t, i, n) {
        if (this.disabled || this.empty || !this.count) return !1;
        let r = this.options,
          a = this.docTopAt(t),
          s = this.time;
        (this.drive(e, t, n, a),
          this.time !== s &&
            ((this.timeDirty = !0),
            s <= 0 && this.time > 0 && this.events.push("onStart"),
            s < this.total &&
              this.time >= this.total &&
              this.events.push("onComplete")));
        let o = a - t,
          l = this.box.left - i,
          h = !1;
        if ("lens" === r.hover && this.engine.canHover) {
          let t = +!!this.inside,
            i = this.lens;
          ((this.lens = h7(this.lens, t, t ? 6 : 3.5, e)),
            !t && this.lens < 0.01 && (this.lens = 0));
          let n = this.engine.pointer.x - l - this.delta.x,
            a = this.engine.pointer.y - o - this.delta.y;
          0 === i && ((this.lensX = n), (this.lensY = a));
          let s = h7(this.lensX, n, 9, e),
            c = h7(this.lensY, a, 9, e);
          ((h =
            this.lens !== i ||
            Math.abs(s - this.lensX) + Math.abs(c - this.lensY) > 0.02),
            (this.lensX = s),
            (this.lensY = c),
            this.uniforms.uLens.value.set(s, c, this.lens, r.lensRadius));
        } else
          0 !== this.lens &&
            ((this.lens = 0), (this.uniforms.uLens.value.z = 0), (h = !0));
        this.timeDirty && this.count && this.evaluate();
        let c = this.time >= this.total;
        this.count &&
          (this.nextState =
            c && 0 === this.lens
              ? "done"
              : this.revealed || this.lens > 0
                ? "active"
                : "hidden");
        let u = this.pin?.cover,
          d = u ? u.base + h9(t - u.start, 0, u.range) - t : 1e6,
          p =
            o < Math.min(n, d) + this.margin &&
            o + this.box.height > -this.margin &&
            o < d,
          f = "active" === this.nextState && p;
        (f && !this.mesh.visible && (this.stale = !0),
          f && this.stale && (this.rebuild(), (f = this.count > 0)));
        let m = f !== this.mesh.visible;
        if (((this.mesh.visible = f), f)) {
          let e = this.engine.dpr,
            t = Math.round((l + this.delta.x) * e) / e,
            i = Math.round((o + this.delta.y) * e) / e,
            n = this.uniforms.uOrigin.value;
          ((n.x !== t || n.y !== i) && (n.set(t, i), (m = !0)),
            this.uniforms.uClip.value !== d &&
              ((this.uniforms.uClip.value = d), (m = !0)),
            (this.timeDirty || this.dirty || h || (this.animated && !c)) &&
              (m = !0));
        }
        return ((this.timeDirty = !1), (this.dirty = !1), m);
      }
      commit() {
        if (
          (this.nextState !== this.state &&
            ((this.state = this.nextState),
            this.el.setAttribute(cn, this.state)),
          this.events.length)
        ) {
          for (let e of this.events) this.handlers?.current?.[e]?.();
          this.events.length = 0;
        }
      }
      disable() {
        ((this.disabled = !0),
          (this.state = this.nextState = "static"),
          (this.mesh.visible = !1),
          this.el.setAttribute(cn, "static"));
      }
      onEnter = () => {
        this.inside = !0;
      };
      onLeave = () => {
        this.inside = !1;
      };
      onMutate = () => {
        ((this.stale = !0), (this.signature = ""), this.engine.requestResize());
      };
      destroy() {
        (this.el.removeEventListener("pointerenter", this.onEnter),
          this.el.removeEventListener("pointerleave", this.onLeave),
          this.mutations.disconnect(),
          this.mesh.removeFromParent(),
          this.mesh.geometry.dispose(),
          this.material.dispose(),
          this.texture?.dispose(),
          this.el.setAttribute(cn, "static"));
      }
    }
    function cu(e, t) {
      let i = getComputedStyle(e);
      if ("sticky" !== i.position) return null;
      let n = parseFloat(i.top);
      if (!Number.isFinite(n)) return null;
      let r = e.style.position;
      e.style.position = "static";
      let a = e.getBoundingClientRect().top + t;
      e.style.position = r;
      let s = e.getBoundingClientRect(),
        o = e.parentElement,
        l = getComputedStyle(o),
        h = Math.max(
          0,
          o.getBoundingClientRect().bottom +
            t -
            parseFloat(l.paddingBottom) -
            parseFloat(l.borderBottomWidth) -
            parseFloat(i.marginBottom) -
            s.height -
            a,
        );
      return h <= 0
        ? null
        : { start: a - n, range: h, base: a, docTop: s.top + t };
    }
    e.s(
      [
        "Engine",
        0,
        class {
          constructor({ smooth: e = !0, maxDpr: t = 3, debug: i = !1 } = {}) {
            ((this.maxDpr = t),
              (this.mirrors = new Map()),
              (this.stickies = new Map()),
              (this.frame = 0),
              (this.stats = { draws: 0, frames: 0 }),
              (this.list = []),
              (this.order = 0),
              (this.shared = {
                uTime: { value: 0 },
                uViewport: { value: new A(1, 1) },
              }),
              (this.pointer = { x: -1e5, y: -1e5 }),
              (this.canHover = window.matchMedia("(hover: hover)").matches),
              (this.width = 0),
              (this.height = 0),
              (this.maxScroll = 0),
              (this.dpr = Math.min(window.devicePixelRatio || 1, t)),
              (this.needsResize = !0),
              (this.needsRender = !0),
              (this.fontsReady = !1),
              (this.lost = !1),
              (this.destroyed = !1),
              (this.lastTime = 0),
              (this.container = document.createElement("div")),
              this.container.setAttribute("aria-hidden", "true"),
              this.container.setAttribute("data-pr-canvas", ""),
              (this.container.style.cssText =
                "position:fixed;top:0;left:0;width:100%;height:100vh;height:100lvh;pointer-events:none;z-index:var(--pixel-reveal-z,50)"),
              (this.renderer = new au({
                alpha: !0,
                antialias: !1,
                depth: !1,
                stencil: !1,
                premultipliedAlpha: !0,
              })),
              this.renderer.setClearColor(0, 0),
              this.renderer.setPixelRatio(this.dpr),
              (this.renderer.domElement.style.display = "block"),
              (this.maxTextureSize = this.renderer.capabilities.maxTextureSize),
              this.container.appendChild(this.renderer.domElement),
              document.body.appendChild(this.container),
              (this.scene = new eN()),
              (this.scene.matrixWorldAutoUpdate = !1),
              (this.camera = new ik()),
              (this.lenis = e
                ? new aM({
                    autoRaf: !1,
                    anchors: !0,
                    ...("object" == typeof e ? e : null),
                  })
                : null),
              (this.resizeObserver = new ResizeObserver(this.requestResize)),
              this.resizeObserver.observe(document.body),
              window.addEventListener("resize", this.requestResize),
              window.addEventListener("pointermove", this.onPointer, {
                passive: !0,
              }),
              document.fonts?.addEventListener?.(
                "loadingdone",
                this.requestResize,
              ),
              this.renderer.domElement.addEventListener(
                "webglcontextlost",
                this.onContextLost,
              ),
              i && document.documentElement.classList.add("pr-debug"),
              (document.fonts?.ready ?? Promise.resolve()).then(() => {
                this.destroyed ||
                  ((this.fontsReady = !0), (this.needsResize = !0));
              }),
              (this.rafId = requestAnimationFrame(this.tick)));
          }
          add(e, t, i) {
            if (this.lost)
              return void e.setAttribute("data-pr-state", "static");
            let n = this.mirrors.get(e);
            if (n) {
              ((n.handlers = i), n.setOptions(t));
              return;
            }
            let r = new cc(this, e, t, i);
            ((r.mesh.renderOrder = this.order++),
              this.mirrors.set(e, r),
              this.list.push(r),
              this.scene.add(r.mesh),
              this.resizeObserver.observe(e),
              (this.needsResize = !0));
          }
          update(e, t) {
            this.mirrors.get(e)?.setOptions(t);
          }
          remove(e) {
            let t = this.mirrors.get(e);
            t &&
              (this.mirrors.delete(e),
              this.list.splice(this.list.indexOf(t), 1),
              this.resizeObserver.unobserve(e),
              t.destroy(),
              (this.needsRender = !0));
          }
          control(e, t, i) {
            return this.mirrors.get(e)?.control(t, i);
          }
          requestResize = () => {
            this.needsResize = !0;
          };
          onPointer = (e) => {
            ((this.pointer.x = e.clientX), (this.pointer.y = e.clientY));
          };
          tick = (e) => {
            ((this.rafId = requestAnimationFrame(this.tick)), this.frame++);
            let t = this.lastTime
              ? Math.min((e - this.lastTime) / 1e3, 0.1)
              : 0;
            if (
              ((this.lastTime = e),
              this.lenis?.raf(e),
              !this.fontsReady || this.lost)
            )
              return;
            this.needsResize && this.resize();
            let i = window.scrollY,
              n = window.scrollX;
            this.shared.uTime.value += t;
            let r = this.needsRender;
            for (let e of this.list) e.update(t, i, n, this.height) && (r = !0);
            for (let e of (r &&
              (this.renderer.render(this.scene, this.camera),
              (this.needsRender = !1)),
            (this.stats.draws = r ? this.renderer.info.render.calls : 0),
            (this.stats.frames += +!!r),
            this.warmup(i),
            this.list))
              e.commit();
          };
          warmup(e) {
            let t = null,
              i = 1 / 0;
            for (let n of this.list) {
              if (!n.stale || n.disabled) continue;
              let r = Math.abs(n.docTopAt(e) - e);
              r < i && ((i = r), (t = n));
            }
            t?.rebuild();
          }
          stickyOf(e, t) {
            let i = e.parentElement;
            for (
              ;
              i &&
              i !== document.body &&
              "sticky" !== getComputedStyle(i).position;
            )
              i = i.parentElement;
            return i && i !== document.body
              ? (this.stickyFrame !== this.frame &&
                  (this.stickies.clear(), (this.stickyFrame = this.frame)),
                this.stickies.has(i) ||
                  this.stickies.set(
                    i,
                    (function (e, t) {
                      let i = cu(e, t);
                      if (!i) return null;
                      let n = e.nextElementSibling;
                      return (
                        n?.hasAttribute("data-pr-stack") &&
                          (i.cover = cu(n, t) ?? {
                            start: 0,
                            range: 0,
                            base: n.getBoundingClientRect().top + t,
                          }),
                        i
                      );
                    })(i, t),
                  ),
                this.stickies.get(i))
              : null;
          }
          resize() {
            this.needsResize = !1;
            let e = this.container.clientWidth,
              t = this.container.clientHeight,
              i = Math.min(window.devicePixelRatio || 1, this.maxDpr);
            (e !== this.width || t !== this.height || i !== this.dpr) &&
              ((this.width = e),
              (this.height = t),
              (this.dpr = i),
              this.renderer.setPixelRatio(i),
              this.renderer.setSize(e, t),
              this.shared.uViewport.value.set(e, t));
            let n = window.scrollY,
              r = window.scrollX;
            for (let e of ((this.maxScroll = Math.max(
              0,
              document.documentElement.scrollHeight - window.innerHeight,
            )),
            this.list))
              e.measure(n, r, i);
            this.needsRender = !0;
          }
          onContextLost = () => {
            for (let e of ((this.lost = !0), this.list)) e.disable();
          };
          destroy() {
            for (let e of ((this.destroyed = !0),
            cancelAnimationFrame(this.rafId),
            window.removeEventListener("resize", this.requestResize),
            window.removeEventListener("pointermove", this.onPointer),
            document.fonts?.removeEventListener?.(
              "loadingdone",
              this.requestResize,
            ),
            this.renderer.domElement.removeEventListener(
              "webglcontextlost",
              this.onContextLost,
            ),
            this.resizeObserver.disconnect(),
            document.documentElement.classList.remove("pr-debug"),
            this.list))
              e.destroy();
            ((this.list = []),
              this.mirrors.clear(),
              this.lenis?.destroy(),
              this.renderer.dispose(),
              this.renderer.forceContextLoss(),
              this.container.remove(),
              window.__pixelReveal === this && delete window.__pixelReveal);
          }
        },
      ],
      66502,
    );
  },
]);
