/*
 * Pixel Reveal options, ported from the minified bundle of
 * https://pixel-text-reveal.vercel.app (Pixel Reveal v2.0, by Yousuf), with
 * the author's permission. See reference/pixel-reveal/PERMISSION.md. The prop
 * names and presets match the original so its official open-source release can
 * replace this port without touching call sites.
 */

/** Every tunable option. Strings are resolved through ALIASES; numbers are clamped to RANGES. */
type Options = {
  trigger: string; start: string | number | null; end: string | number | null; once: boolean; smooth: number; delay: number;
  reverseSpeed: number; split: string; sweep: string; from: string; stagger: number; duration: number; ease: string;
  revealDelay: number; rise: number; riseDuration: number; riseEase: string; direction: string; pattern: string; noise: number;
  scatter: number; spread: number; pixel: number; levels: number; solid: number; accent: string | null; accent2: string | null;
  accentMix: number; accentStrength: number; accentWidth: number; colorNoise: number; sparkle: number; flicker: number;
  glitch: number; hover: string; lensRadius: number; seed: number;
};

export const DEFAULTS: Readonly<Options> = Object.freeze({
  trigger: "inview",
  start: null,
  end: null,
  once: true,
  smooth: 0.3,
  delay: 0,
  reverseSpeed: 1.6,
  split: "words",
  sweep: "each",
  from: "start",
  stagger: 0.06,
  duration: 1.5,
  ease: "power1.inOut",
  revealDelay: 0.05,
  rise: 0.45,
  riseDuration: 1.1,
  riseEase: "expo.out",
  direction: "up",
  pattern: "clusters",
  noise: 0.5,
  scatter: 0.08,
  spread: 0.8,
  pixel: 24,
  levels: 3,
  solid: 0.9,
  accent: "#1700c7",
  accent2: null,
  accentMix: 0.35,
  accentStrength: 1,
  accentWidth: 0.45,
  colorNoise: 0.03,
  sparkle: 0.03,
  flicker: 0.08,
  glitch: 0,
  hover: "none",
  lensRadius: 110,
  seed: 0,
});

type Defaults = Options;

export const PRESETS = Object.freeze({
  materialize: {},
  signal: { rise: 0, stagger: 0.07, duration: 1.25, ease: "power2.out", direction: "right", pattern: "scanlines", noise: 0.6, scatter: 0.04, spread: 0.5, pixel: 16, levels: 3, solid: 0.9, accent: "#aeff00", accentWidth: 0.6, colorNoise: 0.04, sparkle: 0.18, flicker: 0.3, glitch: 0.35 },
  typewriter: { split: "chars", stagger: 0.024, duration: 0.45, ease: "power1.out", revealDelay: 0, rise: 0, direction: "right", pattern: "none", spread: 0.35, pixel: 12, levels: 2, solid: 1, accentWidth: 0.7, sparkle: 0, flicker: 0.2 },
  dissolve: { split: "lines", sweep: "whole", duration: 1.8, ease: "sine.inOut", rise: 0, direction: "none", pattern: "random", spread: 0.6, pixel: 12, levels: 2, solid: 0, accent: null, colorNoise: 0, sparkle: 0, flicker: 0 },
  rain: { split: "chars", from: "random", stagger: 0.018, duration: 0.95, rise: -0.6, riseDuration: 1.1, direction: "down", pattern: "rain", noise: 0.55, spread: 0.5, pixel: 16, levels: 3, sparkle: 0.2 },
  radiate: { split: "lines", sweep: "whole", duration: 2.2, ease: "sine.inOut", rise: 0, direction: "center", pattern: "bayer", noise: 0.35, spread: 0.4, pixel: 32, levels: 4, solid: 0.85, accentWidth: 0.5 },
  bitmap: { split: "lines", sweep: "whole", stagger: 0.1, duration: 1.6, ease: "power1.out", rise: 0.35, riseDuration: 1.4, direction: "up", pattern: "bayer", noise: 0.5, spread: 0.35, pixel: 8, levels: 2, solid: 1, accent: null, colorNoise: 0, sparkle: 0, flicker: 0 },
  glitch: { rise: 0, stagger: 0.04, duration: 1, ease: "power2.out", direction: "none", pattern: "scanlines", noise: 1, pixel: 24, levels: 3, solid: 0.9, accent: "#ff3d00", accent2: "#00d1ff", accentMix: 0.5, accentWidth: 0.7, colorNoise: 0.2, sparkle: 0.25, flicker: 0.45, glitch: 0.85 },
  flow: { sweep: "whole", duration: 2.4, ease: "none", rise: 0.6, direction: "diagonal", pattern: "flow", noise: 0.55, spread: 0.5, pixel: 24, levels: 4 },
} satisfies Record<string, Partial<Defaults>>);

export type Preset = keyof typeof PRESETS;

const TRIGGER_RANGES = {
  load: { start: null, end: null },
  inview: { start: "top 88%", end: null },
  scrub: { start: "top 92%", end: "bottom 55%" },
  pin: { start: 0, end: 0.85 },
  manual: { start: null, end: null },
} as const;

export const TRIGGERS = ["load", "inview", "scrub", "pin", "manual"] as const;
export const SPLITS = ["words", "chars", "lines", "none"] as const;
export const SWEEPS = ["each", "whole"] as const;
export const FROMS = ["start", "end", "center", "edges", "random"] as const;
export const DIRECTIONS = ["up", "down", "left", "right", "center", "edges", "diagonal", "none"] as const;
export const PATTERNS = ["random", "clusters", "scanlines", "rain", "typewriter", "zigzag", "cascade", "bayer", "flow", "none"] as const;

/** Options a caller may pass: any default, plus the preset name. */
export type PixelRevealOptions = Partial<{ [K in keyof Defaults]: Defaults[K] | string | number | boolean | null }> & { preset?: Preset };

const ALIASES: Record<string, Record<string, readonly string[]>> = {
  trigger: { load: ["load", "mount", "auto", "immediate"], inview: ["inview", "enter", "view", "scroll", "onenter"], scrub: ["scrub", "scrollscrub"], pin: ["pin", "pinned", "sticky"], manual: ["manual", "controlled", "ref"] },
  split: { words: ["words", "word", "perword"], chars: ["chars", "char", "characters", "letters"], lines: ["lines", "line"], none: ["none", "block", "overall", "whole", "false"] },
  sweep: { each: ["each", "unit", "units", "perword"], whole: ["whole", "all", "overall", "flow", "block"] },
  from: { start: ["start", "first"], end: ["end", "last"], center: ["center", "centre", "middle"], edges: ["edges", "outside"], random: ["random", "shuffle"] },
  direction: { up: ["up", "bottomtop", "bottomtotop", "frombottom"], down: ["down", "topbottom", "toptobottom", "fromtop"], left: ["left", "rightleft", "righttoleft"], right: ["right", "leftright", "lefttoright"], center: ["center", "centre", "out", "radial", "wavecenter"], edges: ["edges", "in", "inward"], diagonal: ["diagonal", "diag", "wavediagonal"], none: ["none", "pixelonly", "off"] },
  pattern: { random: ["random", "noise", "wave"], clusters: ["clusters", "clustered", "cluster", "blobs"], scanlines: ["scanlines", "scanline", "scan"], rain: ["rain", "columnrain", "columns"], typewriter: ["typewriter", "reading"], zigzag: ["zigzag", "boustrophedon"], cascade: ["cascade", "stairs", "stripes"], bayer: ["bayer", "dither", "ordered"], flow: ["flow", "liquid", "organic"], none: ["none", "clean", "off"] },
  hover: { none: ["none", "off", "false", "null"], lens: ["lens", "true", "pixel"] },
};

function alias(kind: string, value: unknown, fallback: string) {
  const key = String(value).toLowerCase().replace(/[^a-z]/g, "");
  for (const [name, spellings] of Object.entries(ALIASES[kind])) if (spellings.includes(key)) return name;
  return fallback;
}

const RANGES: Record<string, readonly [number, number]> = {
  smooth: [0, 5], delay: [0, 60], reverseSpeed: [0.05, 20], stagger: [0, 5], duration: [0.01, 60], revealDelay: [-5, 5],
  rise: [-4, 4], riseDuration: [0.01, 60], noise: [0, 1], scatter: [0, 1], spread: [0.05, 1], pixel: [1, 256], levels: [0, 6],
  solid: [0, 1], accentMix: [0, 1], accentStrength: [0, 1], accentWidth: [0.01, 0.9], colorNoise: [0, 1], sparkle: [0, 1],
  flicker: [0, 1], glitch: [0, 1], lensRadius: [4, 2000], seed: [-1e6, 1e6],
};

const colour = (value: unknown) => {
  if (value === null || value === false || value === undefined) return null;
  const text = String(value).trim();
  return text && text !== "none" && text !== "transparent" ? text : null;
};

export type ResolvedOptions = {
  preset: Preset;
  trigger: (typeof TRIGGERS)[number];
  split: (typeof SPLITS)[number];
  sweep: (typeof SWEEPS)[number];
  from: (typeof FROMS)[number];
  direction: (typeof DIRECTIONS)[number];
  pattern: (typeof PATTERNS)[number];
  hover: "none" | "lens";
  start: string | number | null;
  end: string | number | null;
  once: boolean;
  ease: string;
  riseEase: string;
  accent: string | null;
  accent2: string | null;
} & Record<keyof typeof RANGES, number>;

export function resolveOptions(input: PixelRevealOptions = {}): Readonly<ResolvedOptions> {
  const preset: Preset = input.preset && input.preset in PRESETS ? input.preset : "materialize";
  const merged: Record<string, unknown> = { ...DEFAULTS, ...PRESETS[preset] };
  for (const key of Object.keys(DEFAULTS)) if (input[key as keyof Defaults] !== undefined) merged[key] = input[key as keyof Defaults];
  const trigger = alias("trigger", merged.trigger, DEFAULTS.trigger) as ResolvedOptions["trigger"];
  const range = TRIGGER_RANGES[trigger];
  const out: Record<string, unknown> = {
    preset,
    trigger,
    split: merged.split === false ? "none" : alias("split", merged.split, DEFAULTS.split),
    sweep: alias("sweep", merged.sweep, DEFAULTS.sweep),
    from: alias("from", merged.from, DEFAULTS.from),
    direction: alias("direction", merged.direction, DEFAULTS.direction),
    pattern: alias("pattern", merged.pattern, DEFAULTS.pattern),
    hover: alias("hover", merged.hover, "none"),
    start: merged.start ?? range.start,
    end: merged.end ?? range.end,
    once: merged.once !== false,
    ease: typeof merged.ease === "string" ? merged.ease : DEFAULTS.ease,
    riseEase: typeof merged.riseEase === "string" ? merged.riseEase : DEFAULTS.riseEase,
    accent: colour(merged.accent),
    accent2: colour(merged.accent2),
  };
  for (const [key, [min, max]] of Object.entries(RANGES)) {
    const raw = merged[key];
    const value = typeof raw === "number" ? raw : parseFloat(String(raw));
    out[key] = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : (DEFAULTS as Record<string, unknown>)[key];
  }
  out.levels = Math.round(out.levels as number);
  return Object.freeze(out as ResolvedOptions);
}

const LAYOUT = ["split", "pixel"] as const;
const TIMELINE = ["sweep", "from", "stagger", "duration", "ease", "revealDelay", "rise", "riseDuration", "riseEase", "seed"] as const;
const TRIGGER = ["trigger", "start", "end", "once", "delay"] as const;

/** Which parts of a mirror need rebuilding when its options change. */
export function diffOptions(a: ResolvedOptions, b: ResolvedOptions) {
  const changed = (keys: readonly string[]) => keys.some((key) => a[key as keyof ResolvedOptions] !== b[key as keyof ResolvedOptions]);
  return {
    layout: changed(LAYOUT),
    timeline: changed(TIMELINE),
    trigger: changed(TRIGGER),
    any: Object.keys(DEFAULTS).some((key) => a[key as keyof ResolvedOptions] !== b[key as keyof ResolvedOptions]) || a.preset !== b.preset,
  };
}

export const OPTION_KEYS = new Set<string>(["preset", ...Object.keys(DEFAULTS)]);
