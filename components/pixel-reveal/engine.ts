/*
 * The Pixel Reveal engine, ported to readable TypeScript from the minified
 * bundle of https://pixel-text-reveal.vercel.app (Pixel Reveal v2.0, by
 * Yousuf), with the author's permission (reference/pixel-reveal/PERMISSION.md).
 *
 * One fixed full-screen WebGL canvas draws every revealing element on the page.
 * Each element ("mirror") measures its own DOM text, paints each unit (word,
 * char or line) into a glyph atlas, and renders one instanced quad per unit.
 * While a mirror is hidden or animating, CSS makes its DOM glyphs transparent;
 * once it is done the canvas stops drawing it and the real text shows again, so
 * the page keeps selectable, searchable, accessible type.
 *
 * Changes from the original: Lenis smooth scroll is left out (the site keeps
 * native scrolling), and the debug GUI is not ported.
 */
import gsap from "gsap";
import {
  Camera,
  CanvasTexture,
  Color,
  DynamicDrawUsage,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";
import { DIRECTIONS, diffOptions, PATTERNS, type PixelRevealOptions, type ResolvedOptions, resolveOptions } from "./options";

const STATE = "data-pr-state";
type State = "hidden" | "active" | "done" | "static";
export type Handlers = { current?: { onStart?: () => void; onComplete?: () => void } };
export type Command = "play" | "reverse" | "restart" | "pause" | "seek" | "progress";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
/** Frame-rate independent approach toward a target. */
const damp = (from: number, to: number, rate: number, dt: number) => (Number.isFinite(rate) ? from + (to - from) * (1 - Math.exp(-rate * dt)) : to);

/** 0..1 integer hash, used for shuffles and seeds. */
function hash01(value: number) {
  let t = Math.imul(0x9e3779b9 ^ value, 0x85ebca6b);
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35);
  return ((t ^= t >>> 16) >>> 0) / 0x100000000;
}

/**
 * The coarse block size in device pixels: the nearest of m·2^k (m = 1 or 3)
 * to the requested pixel size, so each refinement level halves cleanly down to
 * a mip level of the atlas. `levels` is capped by how many halvings fit.
 */
function gridFor(pixel: number, dpr: number, levels: number) {
  const target = Math.max(2, pixel * dpr);
  let best: { size: number; m: number; k: number; error: number } | null = null;
  for (let k = 0; k <= 10; k += 1)
    for (const m of [1, 3]) {
      const size = m * 2 ** k;
      if (size < 2) continue;
      const error = Math.abs(Math.log2(size / target));
      if (!best || error < best.error - 1e-9) best = { size, m, k, error };
    }
  const found = best!;
  return { size: found.size, m: found.m, k: found.k, levels: Math.min(levels, found.m === 3 ? found.k + 1 : found.k) };
}

const easeCache = new Map<string, (t: number) => number>();
function easing(name: string) {
  let fn = easeCache.get(name);
  if (!fn) {
    const parsed = gsap.parseEase(name);
    fn = typeof parsed === "function" ? parsed : gsap.parseEase("power2.out");
    easeCache.set(name, fn);
  }
  return fn;
}

let probe: CanvasRenderingContext2D | null = null;
const colourCache = new Map<string, [number, number, number]>();
function setColour(css: string, target: Color) {
  let rgb = colourCache.get(css);
  if (!rgb) {
    probe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!probe) return target;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#000";
    probe.fillStyle = css;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    rgb = [r / 255, g / 255, b / 255];
    colourCache.set(css, rgb);
  }
  return target.setRGB(rgb[0], rgb[1], rgb[2]);
}

/* ------------------------------------------------------------ text layout --- */

const WORD = /\S+/g;
const CANVAS_LETTER_SPACING = typeof CanvasRenderingContext2D !== "undefined" && "letterSpacing" in CanvasRenderingContext2D.prototype;
const STRETCH: Record<string, string> = {
  "50%": "ultra-condensed", "62.5%": "extra-condensed", "75%": "condensed", "87.5%": "semi-condensed",
  "112.5%": "semi-expanded", "125%": "expanded", "150%": "extra-expanded", "200%": "ultra-expanded",
};

type Box = { left: number; top: number; right: number; bottom: number };
type TextStyle = {
  el: Element; font: string; fontSize: number; color: string; letterSpacing: number; kerning: CanvasFontKerning;
  stretch: string; caps: string; rtl: boolean; transform: string; visible: boolean; inline: boolean; ascent: number; key: string;
};
type Run = { text: string; rect: Box; style: TextStyle; joined: boolean; wordStart: boolean; baseline: number; x: number; ink: Box; line: number };
type Unit = { runs: Run[]; ink: Box; line: number; height: number };
type Line = { ink: Box | null; baseline: number };

let measureContext: CanvasRenderingContext2D | null = null;
const measurer = () => (measureContext ??= document.createElement("canvas").getContext("2d")!);

let segmenter: Intl.Segmenter | null = null;
function graphemes(text: string) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    segmenter ??= new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => ({ index: s.index, text: s.segment }));
  }
  const out: { index: number; text: string }[] = [];
  let i = 0;
  for (const ch of text) {
    out.push({ index: i, text: ch });
    i += ch.length;
  }
  return out;
}

function applyFont(ctx: CanvasRenderingContext2D, style: TextStyle) {
  ctx.font = style.font;
  ctx.direction = style.rtl ? "rtl" : "ltr";
  ctx.textAlign = style.rtl ? "right" : "left";
  ctx.textBaseline = "alphabetic";
  if ("fontKerning" in ctx) ctx.fontKerning = style.kerning;
  if ("fontStretch" in ctx) (ctx as unknown as { fontStretch: string }).fontStretch = style.stretch;
  if ("fontVariantCaps" in ctx) (ctx as unknown as { fontVariantCaps: string }).fontVariantCaps = style.caps;
  if (CANVAS_LETTER_SPACING) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${style.letterSpacing}px`;
}

const toBox = (r: DOMRect): Box => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
function union(a: Box | null, b: Box): Box {
  if (!a) return { ...b };
  a.left = Math.min(a.left, b.left);
  a.top = Math.min(a.top, b.top);
  a.right = Math.max(a.right, b.right);
  a.bottom = Math.max(a.bottom, b.bottom);
  return a;
}
function toUnit(runs: Run[]): Unit {
  let ink: Box | null = null;
  let height = 0;
  for (const run of runs) {
    ink = union(ink, run.ink);
    height = Math.max(height, run.rect.bottom - run.rect.top);
  }
  return { runs, ink: ink!, line: runs[0].line, height };
}

const CHROMIUM = typeof navigator !== "undefined" && /Chrome\/|Chromium\//.test(navigator.userAgent);
/** Baselines snap the way the browser snaps its own text, so the hand-off does not jump. */
const snapBaseline = (y: number, scroll: number, dpr: number) => (CHROMIUM ? Math.round(y + scroll) : Math.round((y + scroll) * dpr) / dpr) - scroll;

function styleOf(el: Element, cache: Map<Element, TextStyle>): TextStyle {
  const cached = cache.get(el);
  if (cached) return cached;
  const cs = getComputedStyle(el);
  const letterSpacing = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) || 0;
  const style: TextStyle = {
    el,
    font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
    fontSize: parseFloat(cs.fontSize) || 16,
    color: cs.color,
    letterSpacing,
    kerning: cs.fontKerning === "none" ? "none" : cs.fontKerning === "normal" ? "normal" : "auto",
    stretch: STRETCH[cs.fontStretch] ?? "normal",
    caps: cs.fontVariantCaps || "normal",
    rtl: cs.direction === "rtl",
    transform: cs.textTransform,
    visible: cs.visibility === "visible",
    inline: !/flex|grid|table/.test(cs.display),
    ascent: 0,
    key: "",
  };
  style.key = `${style.font}|${style.color}|${letterSpacing}|${style.kerning}|${style.stretch}|${style.caps}`;
  cache.set(el, style);
  return style;
}

/** Measures the element's text into positioned runs, grouped into lines and units. */
function layoutText(el: HTMLElement, split: ResolvedOptions["split"]) {
  const rect = el.getBoundingClientRect();
  const runs: Run[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const styles = new Map<Element, TextStyle>();
  let afterSpace = true;
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const data = node.data;
    const parent = node.parentElement;
    if (!data || !parent) continue;
    const style = styleOf(parent, styles);
    const perChar = split === "chars" || (!CANVAS_LETTER_SPACING && style.letterSpacing !== 0);
    WORD.lastIndex = 0;
    for (let match = WORD.exec(data); match; match = WORD.exec(data)) {
      const start = match.index;
      const word = match[0];
      const joined = start === 0 && !afterSpace;
      afterSpace = false;
      if (!style.visible) continue;
      const push = (text: string, box: DOMRect, isJoined: boolean, wordStart: boolean) =>
        runs.push({ text, rect: toBox(box), style, joined: isJoined, wordStart, baseline: 0, x: 0, ink: toBox(box), line: 0 });
      if (perChar) {
        graphemes(word).forEach((g, i) => {
          range.setStart(node, start + g.index);
          range.setEnd(node, start + g.index + g.text.length);
          const box = range.getClientRects()[0];
          if (box && (box.width || box.height)) push(g.text, box, i !== 0 || joined, i === 0);
        });
        continue;
      }
      range.setStart(node, start);
      range.setEnd(node, start + word.length);
      const boxes = range.getClientRects();
      if (!boxes.length) continue;
      if (boxes.length === 1) {
        if (boxes[0].width || boxes[0].height) push(word, boxes[0], joined, true);
        continue;
      }
      // A word broken across lines (hyphenation): one run per line fragment.
      let current: Run | null = null;
      graphemes(word).forEach((g, i) => {
        range.setStart(node, start + g.index);
        range.setEnd(node, start + g.index + g.text.length);
        const box = range.getClientRects()[0];
        if (!box) return;
        if (current && Math.abs(box.top - current.rect.top) < 1) {
          current.text += g.text;
          current.rect.left = Math.min(current.rect.left, box.left);
          current.rect.right = Math.max(current.rect.right, box.right);
          return;
        }
        current = { text: g.text, rect: toBox(box), style, joined: i === 0 && joined, wordStart: i === 0, baseline: 0, x: 0, ink: toBox(box), line: 0 };
        runs.push(current);
      });
    }
    afterSpace = /\s$/.test(data);
  }
  for (const run of runs) {
    const t = run.style.transform;
    run.text = t === "uppercase" ? run.text.toUpperCase() : t === "lowercase" ? run.text.toLowerCase() : t === "capitalize" && run.wordStart ? run.text.charAt(0).toUpperCase() + run.text.slice(1) : run.text;
  }
  if (!runs.length) return { rect, units: [] as Unit[], lines: [] as Line[], ink: null as Box | null };

  // Ascent per style: measured from a zero-size inline probe where possible, else from font metrics.
  const firstOf = new Map<TextStyle, Run>();
  for (const run of runs) if (!firstOf.has(run.style)) firstOf.set(run.style, run);
  const ctx = measurer();
  for (const [style, run] of firstOf) {
    let ascent = NaN;
    if (style.inline) {
      const marker = document.createElement("span");
      marker.setAttribute("aria-hidden", "true");
      marker.style.cssText = "display:inline-block;width:0;height:0;margin:0;padding:0;border:0;vertical-align:baseline";
      style.el.insertBefore(marker, style.el.firstChild);
      const bottom = marker.getBoundingClientRect().bottom;
      marker.remove();
      if (bottom > run.rect.top && bottom <= run.rect.bottom) ascent = bottom - run.rect.top;
    }
    if (!Number.isFinite(ascent)) {
      applyFont(ctx, style);
      ascent = Math.round(ctx.measureText("Hg").fontBoundingBoxAscent);
    }
    style.ascent = ascent;
  }
  for (const run of runs) run.baseline = run.rect.top + run.style.ascent;

  let key = "";
  for (const run of runs) {
    if (run.style.key !== key) {
      applyFont(ctx, run.style);
      key = run.style.key;
    }
    const m = ctx.measureText(run.text);
    run.x = run.style.rtl ? run.rect.right : run.rect.left;
    run.ink = {
      left: run.x - m.actualBoundingBoxLeft,
      right: run.x + Math.max(m.actualBoundingBoxRight, 0),
      top: run.baseline - m.actualBoundingBoxAscent,
      bottom: run.baseline + m.actualBoundingBoxDescent,
    };
  }

  const lines: Line[] = [];
  let lastBaseline = NaN;
  for (const run of runs) {
    if (!lines.length || Math.abs(run.baseline - lastBaseline) > 0.45 * run.style.fontSize) {
      lines.push({ ink: null, baseline: run.baseline });
      lastBaseline = run.baseline;
    }
    run.line = lines.length - 1;
    lines[run.line].ink = union(lines[run.line].ink, run.ink);
  }

  let units: Unit[];
  if (split === "none") units = [toUnit(runs)];
  else if (split === "chars") units = runs.map((r) => toUnit([r]));
  else {
    const groups: Run[][] = [];
    for (const run of runs) {
      const group = groups[groups.length - 1];
      const prev = group?.[group.length - 1];
      if (split === "lines" ? prev?.line === run.line : run.joined && prev?.line === run.line) group.push(run);
      else groups.push([run]);
    }
    units = groups.map(toUnit);
  }
  let ink: Box | null = null;
  for (const line of lines) ink = union(ink, line.ink!);
  return { rect, units, lines, ink };
}

/** Packs each unit's ink box, grid-aligned, into one canvas and paints its runs there. */
function buildAtlas(units: Unit[], origin: { x: number; y: number }, dpr: number, grid: number, maxSize: number, scroll: number) {
  const cells = units.map(({ ink }) => {
    const x = Math.floor(((ink.left - origin.x) * dpr - 3) / grid) * grid;
    const y = Math.floor(((ink.top - origin.y) * dpr - 3) / grid) * grid;
    return { x, y, w: Math.ceil(((ink.right - origin.x) * dpr + 3) / grid) * grid - x, h: Math.ceil(((ink.bottom - origin.y) * dpr + 3) / grid) * grid - y };
  });
  const rowWidth = Math.floor(maxSize / grid) * grid;
  const slots: { x: number; y: number }[] = [];
  let x = 0;
  let y = 0;
  let rowHeight = 0;
  let width = grid;
  for (const cell of cells) {
    if (cell.w > rowWidth) return null;
    if (x + cell.w > rowWidth) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }
    slots.push({ x, y });
    x += cell.w;
    rowHeight = Math.max(rowHeight, cell.h);
    width = Math.max(width, x);
  }
  const height = Math.max(grid, y + rowHeight);
  if (height > maxSize) return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  units.forEach((unit, i) => {
    const cell = cells[i];
    const slot = slots[i];
    ctx.save();
    ctx.beginPath();
    ctx.rect(slot.x, slot.y, cell.w, cell.h);
    ctx.clip();
    ctx.setTransform(dpr, 0, 0, dpr, slot.x - cell.x - origin.x * dpr, slot.y - cell.y - origin.y * dpr);
    let key = "";
    for (const run of unit.runs) {
      if (run.style.key !== key) {
        applyFont(ctx, run.style);
        ctx.fillStyle = run.style.color;
        key = run.style.key;
      }
      ctx.fillText(run.text, run.x, snapBaseline(run.baseline, scroll, dpr));
    }
    ctx.restore();
  });
  return { canvas, width, height, cells, slots };
}

/* ---------------------------------------------------------------- mirror --- */

type Sticky = { start: number; range: number; base: number; docTop: number; cover?: { start: number; range: number; base: number } };

function parseEdge(edge: string) {
  if (edge === "top") return { f: 0, px: 0 };
  if (edge === "center" || edge === "middle") return { f: 0.5, px: 0 };
  if (edge === "bottom") return { f: 1, px: 0 };
  const value = parseFloat(edge);
  return Number.isFinite(value) ? (edge.endsWith("%") ? { f: value / 100, px: 0 } : { f: 0, px: value }) : null;
}
const edgeCache = new Map<string, { el: { f: number; px: number }; vp: { f: number; px: number } }>();
function parseRange(value: string | number) {
  const key = String(value);
  let parsed = edgeCache.get(key);
  if (parsed) return parsed;
  if (typeof value === "number") parsed = { el: { f: 0, px: 0 }, vp: { f: value, px: 0 } };
  else {
    const [a = "top", b = "bottom"] = key.trim().split(/\s+/);
    const el = parseEdge(a);
    const vp = parseEdge(b);
    parsed = el && vp ? { el, vp } : { el: { f: 0, px: 0 }, vp: { f: 0.88, px: 0 } };
  }
  edgeCache.set(key, parsed);
  return parsed;
}

/** One revealing element: its measured text, atlas, mesh and timeline. */
class Mirror {
  options: ResolvedOptions;
  time = 0;
  total = 1;
  dir = 0;
  wait = 0;
  fired = false;
  pendingSeek: number | null = null;
  events: ("onStart" | "onComplete")[] = [];
  count = 0;
  empty = false;
  disabled = false;
  stale = true;
  signature = "";
  dpr: number;
  box = { top: 0, left: 0, width: 0, height: 0 };
  pin: (Sticky & { offset: number }) | null = null;
  delta = { x: 0, y: 0 };
  margin = 0;
  textColor = "#000";
  texture: CanvasTexture | null = null;
  anim: Float32Array | null = null;
  animAttr: InstancedBufferAttribute | null = null;
  unitHeights = new Float32Array(0);
  riseDist = new Float32Array(0);
  order = new Float32Array(0);
  revealed = false;
  timeDirty = true;
  dirty = true;
  inside = false;
  lens = 0;
  lensX = 0;
  lensY = 0;
  state: State = "hidden";
  nextState: State = "hidden";
  animated = false;
  easeReveal: (t: number) => number = (t) => t;
  easeRise: (t: number) => number = (t) => t;
  uniforms: Record<string, { value: unknown }> & {
    uOrigin: { value: Vector2 }; uAtlasSize: { value: Vector2 }; uInk: { value: Vector4 }; uLens: { value: Vector4 };
    uAccent: { value: Color }; uAccent2: { value: Color }; uProgress: { value: number }; uClip: { value: number };
    uDpr: { value: number }; uLevels: { value: number };
  };
  material: ShaderMaterial;
  mesh: Mesh<InstancedBufferGeometry, ShaderMaterial>;
  mutations: MutationObserver;

  constructor(
    public engine: Engine,
    public el: HTMLElement,
    options: PixelRevealOptions,
    public handlers: Handlers,
  ) {
    this.options = resolveOptions(options);
    this.dpr = engine.dpr;
    if (!el.hasAttribute("data-pixel-reveal")) el.setAttribute("data-pixel-reveal", "");
    el.setAttribute(STATE, "hidden");
    this.uniforms = {
      uViewport: engine.shared.uViewport,
      uTime: engine.shared.uTime,
      uOrigin: { value: new Vector2() },
      uCollapse: { value: 1 },
      uAtlas: { value: null },
      uAtlasSize: { value: new Vector2(1, 1) },
      uDpr: { value: 1 },
      uSeed: { value: 0 },
      uWhole: { value: 0 },
      uProgress: { value: 0 },
      uInk: { value: new Vector4(0, 0, 1, 1) },
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
      uAccent: { value: new Color() },
      uAccent2: { value: new Color() },
      uAccentMix: { value: 0 },
      uAccentStrength: { value: 0 },
      uAccentWidth: { value: 0.5 },
      uColorNoise: { value: 0 },
      uSparkle: { value: 0 },
      uFlicker: { value: 0 },
      uGlitch: { value: 0 },
      uLens: { value: new Vector4() },
      uClip: { value: 1e6 },
    };
    this.material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: this.uniforms,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new Mesh(new InstancedBufferGeometry(), this.material);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    this.mesh.visible = false;
    this.applyUniforms();
    el.addEventListener("pointerenter", this.onEnter);
    el.addEventListener("pointerleave", this.onLeave);
    this.mutations = new MutationObserver(this.onMutate);
    this.mutations.observe(el, { subtree: true, childList: true, characterData: true });
  }

  setOptions(input: PixelRevealOptions) {
    const next = resolveOptions(input);
    const diff = diffOptions(this.options, next);
    if (!diff.any) return;
    const finished = this.count > 0 && this.time >= this.total;
    this.options = next;
    if (diff.layout) {
      this.stale = true;
      this.signature = "";
      this.engine.requestResize();
    }
    if (diff.timeline && this.count) this.computeTimeline(finished);
    if (diff.trigger) this.resetTrigger();
    this.applyUniforms();
    this.dirty = true;
  }

  resetTrigger() {
    this.fired = false;
    this.dir = 0;
    this.wait = 0;
    if (this.options.trigger !== "scrub" && this.options.trigger !== "pin") this.time = 0;
    this.timeDirty = true;
  }

  applyUniforms() {
    const o = this.options;
    const u = this.uniforms;
    u.uLevels.value = gridFor(o.pixel, u.uDpr.value, o.levels).levels;
    u.uWhole.value = +(o.sweep === "whole");
    u.uCollapse.value = +(o.sweep !== "whole");
    u.uMask.value = +(o.rise !== 0);
    u.uDirection.value = DIRECTIONS.indexOf(o.direction);
    u.uPattern.value = PATTERNS.indexOf(o.pattern);
    u.uNoise.value = o.noise;
    u.uScatter.value = o.scatter;
    u.uSpread.value = o.spread;
    u.uSolid.value = o.solid;
    setColour(o.accent ?? this.textColor, u.uAccent.value);
    if (o.accent2) setColour(o.accent2, u.uAccent2.value);
    else u.uAccent2.value.copy(u.uAccent.value);
    u.uAccentMix.value = o.accent2 ? o.accentMix : 0;
    u.uAccentStrength.value = o.accent ? o.accentStrength : 0;
    u.uAccentWidth.value = o.accentWidth;
    u.uColorNoise.value = o.colorNoise;
    u.uSparkle.value = o.sparkle;
    u.uFlicker.value = o.flicker;
    u.uGlitch.value = o.glitch;
    u.uSeed.value = Math.floor(65535 * hash01(Math.round(1000 * o.seed) + 7));
    this.animated = o.flicker > 0 || o.glitch > 0;
  }

  measure(scrollY: number, scrollX: number, dpr: number) {
    const r = this.el.getBoundingClientRect();
    this.box = { top: r.top + scrollY, left: r.left + scrollX, width: r.width, height: r.height };
    const sticky = this.engine.stickyOf(this.el, scrollY);
    this.pin = sticky && { ...sticky, offset: r.top + scrollY - sticky.docTop };
    if (dpr !== this.dpr) {
      this.dpr = dpr;
      this.signature = "";
    }
    this.stale = true;
    if (this.nextState === "active") this.rebuild();
  }

  docTopAt(scrollY: number) {
    const p = this.pin;
    return p ? p.base + clamp(scrollY - p.start, 0, p.range) + p.offset : this.box.top;
  }

  rebuild() {
    this.stale = false;
    const o = this.options;
    const layout = layoutText(this.el, o.split);
    this.mutations.takeRecords();
    const rect = layout.rect;
    const scroll = window.scrollY;
    if (!this.pin) this.box.top = rect.top + scroll;
    this.box.left = rect.left + window.scrollX;
    this.box.width = rect.width;
    this.box.height = rect.height;
    if (!layout.units.length) {
      this.empty = true;
      this.count = 0;
      this.mesh.visible = false;
      this.nextState = "static";
      return;
    }
    if (this.empty) {
      this.empty = false;
      this.nextState = "hidden";
    }
    const dpr = this.dpr;
    const origin = { x: Math.floor(rect.left * dpr) / dpr, y: Math.floor(rect.top * dpr) / dpr };
    let grid = gridFor(o.pixel, dpr, o.levels);
    let signature = `${o.split}|${grid.size}|${dpr}|`;
    for (const unit of layout.units) {
      for (const run of unit.runs) signature += `${run.text}@${(run.x - origin.x).toFixed(2)},${(run.baseline - origin.y).toFixed(2)}:${run.style.key};`;
      signature += "|";
    }
    this.delta = { x: origin.x - rect.left, y: origin.y - rect.top };
    if (signature === this.signature) return;
    this.signature = signature;

    // Build the atlas, backing off the resolution if the text will not fit one texture.
    const maxSize = Math.min(this.engine.maxTextureSize, 8192);
    let scale = dpr;
    let atlas: ReturnType<typeof buildAtlas> = null;
    for (let attempt = 0; attempt < 5 && !atlas; attempt += 1) {
      grid = gridFor(o.pixel, scale, o.levels);
      atlas = buildAtlas(layout.units, origin, scale, grid.size, maxSize, scroll);
      if (!atlas) scale *= 0.7;
    }
    if (!atlas) {
      this.empty = true;
      this.count = 0;
      this.nextState = "static";
      return;
    }

    const { units, lines } = layout;
    const n = units.length;
    const cellAttr = new Float32Array(4 * n);
    const atlasAttr = new Float32Array(2 * n);
    const inkAttr = new Float32Array(4 * n);
    const lineAttr = new Float32Array(4 * n);
    const metaAttr = new Float32Array(2 * n);
    const lineMask = lines.map(() => [Infinity, -Infinity]);
    atlas.cells.forEach((cell, i) => {
      const mask = lineMask[units[i].line];
      mask[0] = Math.min(mask[0], cell.y / scale);
      mask[1] = Math.max(mask[1], (cell.y + cell.h) / scale);
    });
    let tallest = 0;
    units.forEach((unit, i) => {
      const cell = atlas!.cells[i];
      const slot = atlas!.slots[i];
      const line = lines[unit.line];
      cellAttr.set([cell.x / scale, cell.y / scale, cell.w / scale, cell.h / scale], 4 * i);
      atlasAttr.set([slot.x, slot.y], 2 * i);
      inkAttr.set([unit.ink.left - origin.x, unit.ink.top - origin.y, unit.ink.right - unit.ink.left, unit.ink.bottom - unit.ink.top], 4 * i);
      lineAttr.set([lineMask[unit.line][0], lineMask[unit.line][1], line.ink!.left - origin.x, line.ink!.right - line.ink!.left], 4 * i);
      metaAttr.set([unit.line, i], 2 * i);
      tallest = Math.max(tallest, unit.height);
    });
    const geometry = new InstancedBufferGeometry();
    geometry.setIndex([0, 2, 1, 2, 3, 1]);
    geometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0], 3));
    geometry.setAttribute("aCell", new InstancedBufferAttribute(cellAttr, 4));
    geometry.setAttribute("aAtlas", new InstancedBufferAttribute(atlasAttr, 2));
    geometry.setAttribute("aInk", new InstancedBufferAttribute(inkAttr, 4));
    geometry.setAttribute("aLine", new InstancedBufferAttribute(lineAttr, 4));
    geometry.setAttribute("aMeta", new InstancedBufferAttribute(metaAttr, 2));
    this.anim = new Float32Array(2 * n);
    this.animAttr = new InstancedBufferAttribute(this.anim, 2).setUsage(DynamicDrawUsage);
    geometry.setAttribute("aAnim", this.animAttr);
    geometry.instanceCount = n;
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;

    const texture = new CanvasTexture(atlas.canvas);
    texture.flipY = false;
    texture.premultiplyAlpha = true;
    texture.colorSpace = "";
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    this.engine.renderer.initTexture(texture);
    atlas.canvas.width = 0;
    atlas.canvas.height = 0;
    this.texture?.dispose();
    this.texture = texture;

    const u = this.uniforms;
    u.uAtlas.value = texture;
    u.uAtlasSize.value.set(atlas.width, atlas.height);
    u.uDpr.value = scale;
    u.uGrid.value = grid.size;
    u.uGridM.value = grid.m;
    u.uGridK.value = grid.k;
    u.uLines.value = lines.length;
    const ink = layout.ink!;
    u.uInk.value.set(ink.left - origin.x, ink.top - origin.y, ink.right - ink.left, ink.bottom - ink.top);
    this.textColor = units[0].runs[0].style.color;
    this.unitHeights = Float32Array.from(units, (unit) => unit.height);
    this.margin = Math.abs(o.rise) * tallest + (grid.size / scale) * 2 + 40;
    const finished = this.count > 0 && this.time >= this.total;
    this.count = n;
    this.computeTimeline(finished);
    this.applyUniforms();
    this.dirty = true;
  }

  computeTimeline(finished: boolean) {
    const o = this.options;
    const n = this.count;
    const order = new Float32Array(n);
    const mid = (n - 1) / 2;
    if (o.from === "random") {
      const seed = Math.round(1000 * o.seed);
      Array.from({ length: n }, (_, i) => i)
        .sort((a, b) => hash01(7919 * a + seed) - hash01(7919 * b + seed))
        .forEach((unit, rank) => (order[unit] = rank));
    } else
      for (let i = 0; i < n; i += 1)
        order[i] = o.from === "end" ? n - 1 - i : o.from === "center" ? Math.abs(i - mid) : o.from === "edges" ? mid - Math.abs(i - mid) : i;
    this.order = order;
    let last = 0;
    for (let i = 0; i < n; i += 1) last = Math.max(last, order[i]);
    const spread = last * o.stagger;
    this.riseDist = Float32Array.from(this.unitHeights, (h) => o.rise * h);
    const revealEnd = (o.sweep === "whole" ? 0 : spread) + o.revealDelay + o.duration;
    const riseEnd = o.rise !== 0 ? spread + o.riseDuration : 0;
    this.total = Math.max(revealEnd, riseEnd, 0.001);
    this.easeReveal = easing(o.ease);
    this.easeRise = easing(o.riseEase);
    if (this.pendingSeek !== null) {
      this.time = this.pendingSeek * this.total;
      this.pendingSeek = null;
    } else this.time = finished ? this.total : Math.min(this.time, this.total);
    this.timeDirty = true;
  }

  /** Writes each unit's reveal progress and rise offset for the current time. */
  evaluate() {
    const o = this.options;
    const t = this.time;
    const anim = this.anim!;
    let any = false;
    for (let i = 0; i < this.count; i += 1) {
      const at = this.order[i] * o.stagger;
      let p = (t - at - o.revealDelay) / o.duration;
      p = p <= 0 ? 0 : p >= 1 ? 1 : clamp(this.easeReveal(p), 0, 1);
      anim[2 * i] = p;
      if (p > 0) any = true;
      let r = 1;
      if (this.riseDist[i] !== 0) {
        r = (t - at) / o.riseDuration;
        r = r <= 0 ? 0 : r >= 1 ? 1 : this.easeRise(r);
      }
      anim[2 * i + 1] = (1 - r) * this.riseDist[i];
    }
    if (o.sweep === "whole") {
      let p = (t - o.revealDelay) / o.duration;
      p = p <= 0 ? 0 : p >= 1 ? 1 : clamp(this.easeReveal(p), 0, 1);
      this.uniforms.uProgress.value = p;
      any = p > 0;
    }
    this.revealed = any;
    this.animAttr!.needsUpdate = true;
  }

  lineScroll(value: string | number | null, docTop: number, viewport: number) {
    const { el, vp } = parseRange(value ?? "top 88%");
    return Math.min(docTop + el.f * this.box.height + el.px - (vp.f * viewport + vp.px), this.engine.maxScroll - 1);
  }

  scrubProgress(scrollY: number, docTop: number, viewport: number) {
    const o = this.options;
    if (o.trigger === "pin" && this.pin) {
      const range = Math.max(1, this.pin.range);
      const start = typeof o.start === "number" ? o.start : 0;
      const end = typeof o.end === "number" ? o.end : 0.85;
      return clamp(((scrollY - this.pin.start) / range - start) / Math.max(1e-4, end - start), 0, 1);
    }
    const scrub = o.trigger === "scrub";
    const a = this.lineScroll(scrub ? o.start : "top 92%", docTop, viewport);
    const b = this.lineScroll(scrub ? o.end : "bottom 55%", docTop, viewport);
    return b - a < 1 ? +(scrollY >= b) : clamp((scrollY - a) / (b - a), 0, 1);
  }

  drive(dt: number, scrollY: number, viewport: number, docTop: number) {
    const o = this.options;
    switch (o.trigger) {
      case "load":
        if (!this.fired) {
          this.fired = true;
          this.play(o.delay);
        }
        break;
      case "inview": {
        const past = scrollY >= this.lineScroll(o.start, docTop, viewport);
        if (past && !this.fired) {
          this.fired = true;
          this.play(o.delay);
        } else if (!past && this.fired && !o.once) {
          this.fired = false;
          this.reverse();
        }
        break;
      }
      case "scrub":
      case "pin": {
        const target = this.scrubProgress(scrollY, docTop, viewport) * this.total;
        this.dir = 0;
        this.time = o.smooth > 0 ? damp(this.time, target, 3 / o.smooth, dt) : target;
        if (Math.abs(this.time - target) < 1e-4) this.time = target;
        return;
      }
    }
    if (this.dir !== 0) this.advance(dt);
  }

  advance(dt: number) {
    if (this.wait > 0) {
      this.wait -= dt;
      if (this.wait > 0) return;
      dt = -this.wait;
      this.wait = 0;
    }
    this.time += dt * (this.dir > 0 ? 1 : this.options.reverseSpeed) * this.dir;
    if (this.time >= this.total) {
      this.time = this.total;
      this.dir = 0;
    } else if (this.time <= 0) {
      this.time = 0;
      this.dir = 0;
    }
  }

  play(delay = 0) {
    this.wait = this.time <= 0 ? delay : 0;
    this.dir = 1;
  }

  reverse() {
    this.wait = 0;
    this.dir = -1;
  }

  control(command: Command, value?: number) {
    switch (command) {
      case "play":
        this.play(0);
        break;
      case "reverse":
        this.reverse();
        break;
      case "restart":
        this.time = 0;
        this.timeDirty = true;
        this.play(0);
        break;
      case "pause":
        this.dir = 0;
        this.wait = 0;
        break;
      case "seek": {
        const p = clamp(Number(value) || 0, 0, 1);
        this.dir = 0;
        this.wait = 0;
        if (this.count) this.time = p * this.total;
        else this.pendingSeek = p;
        this.timeDirty = true;
        break;
      }
      case "progress":
        return this.count ? this.time / this.total : 0;
    }
  }

  /** Advances the timeline and decides visibility. Returns whether the frame needs a redraw. */
  update(dt: number, scrollY: number, scrollX: number, viewport: number) {
    if (this.disabled || this.empty || !this.count) return false;
    const o = this.options;
    const docTop = this.docTopAt(scrollY);
    const before = this.time;
    this.drive(dt, scrollY, viewport, docTop);
    if (this.time !== before) {
      this.timeDirty = true;
      if (before <= 0 && this.time > 0) this.events.push("onStart");
      if (before < this.total && this.time >= this.total) this.events.push("onComplete");
    }
    const top = docTop - scrollY;
    const left = this.box.left - scrollX;
    let lensMoved = false;
    if (o.hover === "lens" && this.engine.canHover) {
      const target = +this.inside;
      const was = this.lens;
      this.lens = damp(this.lens, target, target ? 6 : 3.5, dt);
      if (!target && this.lens < 0.01) this.lens = 0;
      const px = this.engine.pointer.x - left - this.delta.x;
      const py = this.engine.pointer.y - top - this.delta.y;
      if (was === 0) {
        this.lensX = px;
        this.lensY = py;
      }
      const nx = damp(this.lensX, px, 9, dt);
      const ny = damp(this.lensY, py, 9, dt);
      lensMoved = this.lens !== was || Math.abs(nx - this.lensX) + Math.abs(ny - this.lensY) > 0.02;
      this.lensX = nx;
      this.lensY = ny;
      this.uniforms.uLens.value.set(nx, ny, this.lens, o.lensRadius);
    } else if (this.lens !== 0) {
      this.lens = 0;
      this.uniforms.uLens.value.z = 0;
      lensMoved = true;
    }
    if (this.timeDirty && this.count) this.evaluate();
    const done = this.time >= this.total;
    if (this.count) this.nextState = done && this.lens === 0 ? "done" : this.revealed || this.lens > 0 ? "active" : "hidden";
    const cover = this.pin?.cover;
    const clip = cover ? cover.base + clamp(scrollY - cover.start, 0, cover.range) - scrollY : 1e6;
    const onScreen = top < Math.min(viewport, clip) + this.margin && top + this.box.height > -this.margin && top < clip;
    let visible = this.nextState === "active" && onScreen;
    if (visible && !this.mesh.visible) this.stale = true;
    if (visible && this.stale) {
      this.rebuild();
      visible = this.count > 0;
    }
    let redraw = visible !== this.mesh.visible;
    this.mesh.visible = visible;
    if (visible) {
      const dpr = this.engine.dpr;
      const x = Math.round((left + this.delta.x) * dpr) / dpr;
      const y = Math.round((top + this.delta.y) * dpr) / dpr;
      const originUniform = this.uniforms.uOrigin.value;
      if (originUniform.x !== x || originUniform.y !== y) {
        originUniform.set(x, y);
        redraw = true;
      }
      if (this.uniforms.uClip.value !== clip) {
        this.uniforms.uClip.value = clip;
        redraw = true;
      }
      if (this.timeDirty || this.dirty || lensMoved || (this.animated && !done)) redraw = true;
    }
    this.timeDirty = false;
    this.dirty = false;
    return redraw;
  }

  commit() {
    if (this.nextState !== this.state) {
      this.state = this.nextState;
      this.el.setAttribute(STATE, this.state);
    }
    if (this.events.length) {
      for (const name of this.events) this.handlers.current?.[name]?.();
      this.events.length = 0;
    }
  }

  disable() {
    this.disabled = true;
    this.state = this.nextState = "static";
    this.mesh.visible = false;
    this.el.setAttribute(STATE, "static");
  }

  onEnter = () => {
    this.inside = true;
  };
  onLeave = () => {
    this.inside = false;
  };
  onMutate = () => {
    this.stale = true;
    this.signature = "";
    this.engine.requestResize();
  };

  destroy() {
    this.el.removeEventListener("pointerenter", this.onEnter);
    this.el.removeEventListener("pointerleave", this.onLeave);
    this.mutations.disconnect();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.texture?.dispose();
    this.el.setAttribute(STATE, "static");
  }
}

/** Where a sticky ancestor starts and how far it travels, so pinned text is tracked while it sticks. */
function measureSticky(el: HTMLElement, scrollY: number) {
  const cs = getComputedStyle(el);
  if (cs.position !== "sticky") return null;
  const top = parseFloat(cs.top);
  if (!Number.isFinite(top)) return null;
  const saved = el.style.position;
  el.style.position = "static";
  const base = el.getBoundingClientRect().top + scrollY;
  el.style.position = saved;
  const box = el.getBoundingClientRect();
  const parent = el.parentElement!;
  const ps = getComputedStyle(parent);
  const range = Math.max(0, parent.getBoundingClientRect().bottom + scrollY - parseFloat(ps.paddingBottom) - parseFloat(ps.borderBottomWidth) - parseFloat(cs.marginBottom) - box.height - base);
  return range <= 0 ? null : { start: base - top, range, base, docTop: box.top + scrollY };
}

/* ---------------------------------------------------------------- engine --- */

export class Engine {
  maxDpr: number;
  mirrors = new Map<HTMLElement, Mirror>();
  stickies = new Map<HTMLElement, Sticky | null>();
  stickyFrame = -1;
  frame = 0;
  list: Mirror[] = [];
  order = 0;
  shared = { uTime: { value: 0 }, uViewport: { value: new Vector2(1, 1) } };
  pointer = { x: -1e5, y: -1e5 };
  canHover = window.matchMedia("(hover: hover)").matches;
  width = 0;
  height = 0;
  maxScroll = 0;
  dpr: number;
  needsResize = true;
  needsRender = true;
  fontsReady = false;
  lost = false;
  destroyed = false;
  lastTime = 0;
  rafId = 0;
  container: HTMLDivElement;
  renderer: WebGLRenderer;
  maxTextureSize: number;
  scene = new Scene();
  camera = new Camera();
  resizeObserver: ResizeObserver;

  constructor({ maxDpr = 3 }: { maxDpr?: number } = {}) {
    this.maxDpr = maxDpr;
    this.dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    this.container = document.createElement("div");
    this.container.setAttribute("aria-hidden", "true");
    this.container.setAttribute("data-pr-canvas", "");
    this.container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100vh;height:100lvh;pointer-events:none;z-index:var(--pixel-reveal-z,50)";
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
    this.renderer.setClearColor(0, 0);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.domElement.style.display = "block";
    this.maxTextureSize = this.renderer.capabilities.maxTextureSize;
    this.container.appendChild(this.renderer.domElement);
    document.body.appendChild(this.container);
    this.scene.matrixWorldAutoUpdate = false;
    this.resizeObserver = new ResizeObserver(this.requestResize);
    this.resizeObserver.observe(document.body);
    window.addEventListener("resize", this.requestResize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.fonts?.addEventListener?.("loadingdone", this.requestResize);
    this.renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);
    // Glyph shapes are sampled from the loaded face, so nothing renders until fonts are ready.
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!this.destroyed) {
        this.fontsReady = true;
        this.needsResize = true;
      }
    });
    this.rafId = requestAnimationFrame(this.tick);
  }

  add(el: HTMLElement, options: PixelRevealOptions, handlers: Handlers) {
    if (this.lost) {
      el.setAttribute(STATE, "static");
      return;
    }
    const existing = this.mirrors.get(el);
    if (existing) {
      existing.handlers = handlers;
      existing.setOptions(options);
      return;
    }
    const mirror = new Mirror(this, el, options, handlers);
    mirror.mesh.renderOrder = this.order++;
    this.mirrors.set(el, mirror);
    this.list.push(mirror);
    this.scene.add(mirror.mesh);
    this.resizeObserver.observe(el);
    this.needsResize = true;
  }

  update(el: HTMLElement, options: PixelRevealOptions) {
    this.mirrors.get(el)?.setOptions(options);
  }

  remove(el: HTMLElement) {
    const mirror = this.mirrors.get(el);
    if (!mirror) return;
    this.mirrors.delete(el);
    this.list.splice(this.list.indexOf(mirror), 1);
    this.resizeObserver.unobserve(el);
    mirror.destroy();
    this.needsRender = true;
  }

  control(el: HTMLElement, command: Command, value?: number) {
    return this.mirrors.get(el)?.control(command, value);
  }

  requestResize = () => {
    this.needsResize = true;
  };

  onPointer = (event: PointerEvent) => {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
  };

  tick = (now: number) => {
    this.rafId = requestAnimationFrame(this.tick);
    this.frame += 1;
    const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.1) : 0;
    this.lastTime = now;
    if (!this.fontsReady || this.lost) return;
    if (this.needsResize) this.resize();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    this.shared.uTime.value += dt;
    let redraw = this.needsRender;
    for (const mirror of this.list) if (mirror.update(dt, scrollY, scrollX, this.height)) redraw = true;
    if (redraw) {
      this.renderer.render(this.scene, this.camera);
      this.needsRender = false;
    }
    this.warmup(scrollY);
    for (const mirror of this.list) mirror.commit();
  };

  /** Pre-builds the stale mirror nearest the viewport, one per frame, so reveals start without a hitch. */
  warmup(scrollY: number) {
    let nearest: Mirror | null = null;
    let distance = Infinity;
    for (const mirror of this.list) {
      if (!mirror.stale || mirror.disabled) continue;
      const d = Math.abs(mirror.docTopAt(scrollY) - scrollY);
      if (d < distance) {
        distance = d;
        nearest = mirror;
      }
    }
    nearest?.rebuild();
  }

  stickyOf(el: HTMLElement, scrollY: number) {
    let parent = el.parentElement;
    while (parent && parent !== document.body && getComputedStyle(parent).position !== "sticky") parent = parent.parentElement;
    if (!parent || parent === document.body) return null;
    if (this.stickyFrame !== this.frame) {
      this.stickies.clear();
      this.stickyFrame = this.frame;
    }
    if (!this.stickies.has(parent)) {
      const sticky: Sticky | null = measureSticky(parent, scrollY);
      const next = parent.nextElementSibling as HTMLElement | null;
      if (sticky && next?.hasAttribute("data-pr-stack"))
        sticky.cover = measureSticky(next, scrollY) ?? { start: 0, range: 0, base: next.getBoundingClientRect().top + scrollY };
      this.stickies.set(parent, sticky);
    }
    return this.stickies.get(parent) ?? null;
  }

  resize() {
    this.needsResize = false;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    if (w !== this.width || h !== this.height || dpr !== this.dpr) {
      this.width = w;
      this.height = h;
      this.dpr = dpr;
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h);
      this.shared.uViewport.value.set(w, h);
    }
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    this.maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    for (const mirror of this.list) mirror.measure(scrollY, scrollX, dpr);
    this.needsRender = true;
  }

  onContextLost = () => {
    this.lost = true;
    for (const mirror of this.list) mirror.disable();
  };

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.requestResize);
    window.removeEventListener("pointermove", this.onPointer);
    document.fonts?.removeEventListener?.("loadingdone", this.requestResize);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.resizeObserver.disconnect();
    for (const mirror of this.list) mirror.destroy();
    this.list = [];
    this.mirrors.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.container.remove();
  }
}
