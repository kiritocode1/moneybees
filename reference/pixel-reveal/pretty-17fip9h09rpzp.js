(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  76183,
  (e) => {
    "use strict";
    let t = Object.freeze({
        trigger: "inview",
        start: null,
        end: null,
        once: !0,
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
      }),
      r = Object.freeze({
        materialize: {},
        signal: {
          rise: 0,
          stagger: 0.07,
          duration: 1.25,
          ease: "power2.out",
          direction: "right",
          pattern: "scanlines",
          noise: 0.6,
          scatter: 0.04,
          spread: 0.5,
          pixel: 16,
          levels: 3,
          solid: 0.9,
          accent: "#aeff00",
          accentWidth: 0.6,
          colorNoise: 0.04,
          sparkle: 0.18,
          flicker: 0.3,
          glitch: 0.35,
        },
        typewriter: {
          split: "chars",
          stagger: 0.024,
          duration: 0.45,
          ease: "power1.out",
          revealDelay: 0,
          rise: 0,
          direction: "right",
          pattern: "none",
          spread: 0.35,
          pixel: 12,
          levels: 2,
          solid: 1,
          accentWidth: 0.7,
          sparkle: 0,
          flicker: 0.2,
        },
        dissolve: {
          split: "lines",
          sweep: "whole",
          duration: 1.8,
          ease: "sine.inOut",
          rise: 0,
          direction: "none",
          pattern: "random",
          spread: 0.6,
          pixel: 12,
          levels: 2,
          solid: 0,
          accent: null,
          colorNoise: 0,
          sparkle: 0,
          flicker: 0,
        },
        rain: {
          split: "chars",
          from: "random",
          stagger: 0.018,
          duration: 0.95,
          rise: -0.6,
          riseDuration: 1.1,
          direction: "down",
          pattern: "rain",
          noise: 0.55,
          spread: 0.5,
          pixel: 16,
          levels: 3,
          sparkle: 0.2,
        },
        radiate: {
          split: "lines",
          sweep: "whole",
          duration: 2.2,
          ease: "sine.inOut",
          rise: 0,
          direction: "center",
          pattern: "bayer",
          noise: 0.35,
          spread: 0.4,
          pixel: 32,
          levels: 4,
          solid: 0.85,
          accentWidth: 0.5,
        },
        bitmap: {
          split: "lines",
          sweep: "whole",
          stagger: 0.1,
          duration: 1.6,
          ease: "power1.out",
          rise: 0.35,
          riseDuration: 1.4,
          direction: "up",
          pattern: "bayer",
          noise: 0.5,
          spread: 0.35,
          pixel: 8,
          levels: 2,
          solid: 1,
          accent: null,
          colorNoise: 0,
          sparkle: 0,
          flicker: 0,
        },
        glitch: {
          rise: 0,
          stagger: 0.04,
          duration: 1,
          ease: "power2.out",
          direction: "none",
          pattern: "scanlines",
          noise: 1,
          pixel: 24,
          levels: 3,
          solid: 0.9,
          accent: "#ff3d00",
          accent2: "#00d1ff",
          accentMix: 0.5,
          accentWidth: 0.7,
          colorNoise: 0.2,
          sparkle: 0.25,
          flicker: 0.45,
          glitch: 0.85,
        },
        flow: {
          sweep: "whole",
          duration: 2.4,
          ease: "none",
          rise: 0.6,
          direction: "diagonal",
          pattern: "flow",
          noise: 0.55,
          spread: 0.5,
          pixel: 24,
          levels: 4,
        },
      }),
      n = {
        load: { start: null, end: null },
        inview: { start: "top 88%", end: null },
        scrub: { start: "top 92%", end: "bottom 55%" },
        pin: { start: 0, end: 0.85 },
        manual: { start: null, end: null },
      },
      i = ["split", "pixel"],
      s = [
        "sweep",
        "from",
        "stagger",
        "duration",
        "ease",
        "revealDelay",
        "rise",
        "riseDuration",
        "riseEase",
        "seed",
      ],
      o = ["trigger", "start", "end", "once", "delay"],
      a = Object.keys(t),
      l = Object.fromEntries(
        Object.entries({
          trigger: {
            load: ["load", "mount", "auto", "immediate"],
            inview: ["inview", "enter", "view", "scroll", "onenter"],
            scrub: ["scrub", "scrollscrub"],
            pin: ["pin", "pinned", "sticky"],
            manual: ["manual", "controlled", "ref"],
          },
          split: {
            words: ["words", "word", "perword"],
            chars: ["chars", "char", "characters", "letters"],
            lines: ["lines", "line"],
            none: ["none", "block", "overall", "whole", "false"],
          },
          sweep: {
            each: ["each", "unit", "units", "perword"],
            whole: ["whole", "all", "overall", "flow", "block"],
          },
          from: {
            start: ["start", "first"],
            end: ["end", "last"],
            center: ["center", "centre", "middle"],
            edges: ["edges", "outside"],
            random: ["random", "shuffle"],
          },
          direction: {
            up: ["up", "bottomtop", "bottomtotop", "frombottom"],
            down: ["down", "topbottom", "toptobottom", "fromtop"],
            left: ["left", "rightleft", "righttoleft"],
            right: ["right", "leftright", "lefttoright"],
            center: ["center", "centre", "out", "radial", "wavecenter"],
            edges: ["edges", "in", "inward"],
            diagonal: ["diagonal", "diag", "wavediagonal"],
            none: ["none", "pixelonly", "off"],
          },
          pattern: {
            random: ["random", "noise", "wave"],
            clusters: ["clusters", "clustered", "cluster", "blobs"],
            scanlines: ["scanlines", "scanline", "scan"],
            rain: ["rain", "columnrain", "columns"],
            typewriter: ["typewriter", "reading"],
            zigzag: ["zigzag", "boustrophedon"],
            cascade: ["cascade", "stairs", "stripes"],
            bayer: ["bayer", "dither", "ordered"],
            flow: ["flow", "liquid", "organic"],
            none: ["none", "clean", "off"],
          },
          hover: {
            none: ["none", "off", "false", "null"],
            lens: ["lens", "true", "pixel"],
          },
        }).map(([e, t]) => {
          let r = new Map();
          for (let [e, n] of Object.entries(t)) for (let t of n) r.set(t, e);
          return [e, r];
        }),
      );
    function c(e, t, r) {
      let n = l[e].get(
        String(t)
          .toLowerCase()
          .replace(/[^a-z]/g, ""),
      );
      return n || (u(`${e}="${t}" is not recognised, using "${r}"`), r);
    }
    let d = {
      smooth: [0, 5],
      delay: [0, 60],
      reverseSpeed: [0.05, 20],
      stagger: [0, 5],
      duration: [0.01, 60],
      revealDelay: [-5, 5],
      rise: [-4, 4],
      riseDuration: [0.01, 60],
      noise: [0, 1],
      scatter: [0, 1],
      spread: [0.05, 1],
      pixel: [1, 256],
      levels: [0, 6],
      solid: [0, 1],
      accentMix: [0, 1],
      accentStrength: [0, 1],
      accentWidth: [0.01, 0.9],
      colorNoise: [0, 1],
      sparkle: [0, 1],
      flicker: [0, 1],
      glitch: [0, 1],
      lensRadius: [4, 2e3],
      seed: [-1e6, 1e6],
    };
    function p(e) {
      if (null === e || !1 === e || void 0 === e) return null;
      let t = String(e).trim();
      return t && "none" !== t && "transparent" !== t ? t : null;
    }
    function u(e) {}
    function g(e = {}) {
      let i = e.preset ?? "materialize";
      r[i] ||
        (u(
          `preset="${i}" does not exist (${Object.keys(r).join(", ")}), using "materialize"`,
        ),
        (i = "materialize"));
      let s = { ...t, ...r[i] };
      for (let t of a) void 0 !== e[t] && (s[t] = e[t]);
      let o = { preset: i };
      ((o.trigger = c("trigger", s.trigger, t.trigger)),
        (o.split = !1 === s.split ? "none" : c("split", s.split, t.split)),
        (o.sweep = c("sweep", s.sweep, t.sweep)),
        (o.from = c("from", s.from, t.from)),
        (o.direction = c("direction", s.direction, t.direction)),
        (o.pattern = c("pattern", s.pattern, t.pattern)),
        (o.hover = c("hover", s.hover, "none")));
      let l = n[o.trigger];
      for (let e of ((o.start = s.start ?? l.start),
      (o.end = s.end ?? l.end),
      (o.once = !1 !== s.once),
      (o.ease = "string" == typeof s.ease ? s.ease : t.ease),
      (o.riseEase = "string" == typeof s.riseEase ? s.riseEase : t.riseEase),
      (o.accent = p(s.accent)),
      (o.accent2 = p(s.accent2)),
      Object.keys(d)))
        o[e] = (function (e, t, r) {
          let n = "number" == typeof t ? t : parseFloat(t);
          if (!Number.isFinite(n))
            return (
              u(`${e}=${JSON.stringify(t)} is not a number, using ${r}`),
              r
            );
          let [i, s] = d[e];
          return Math.min(s, Math.max(i, n));
        })(e, s[e], t[e]);
      return ((o.levels = Math.round(o.levels)), Object.freeze(o));
    }
    e.s([
      "DEFAULTS",
      0,
      t,
      "DIRECTIONS",
      0,
      ["up", "down", "left", "right", "center", "edges", "diagonal", "none"],
      "FROMS",
      0,
      ["start", "end", "center", "edges", "random"],
      "PATTERNS",
      0,
      [
        "random",
        "clusters",
        "scanlines",
        "rain",
        "typewriter",
        "zigzag",
        "cascade",
        "bayer",
        "flow",
        "none",
      ],
      "PRESETS",
      0,
      r,
      "SPLITS",
      0,
      ["words", "chars", "lines", "none"],
      "SWEEPS",
      0,
      ["each", "whole"],
      "TRIGGERS",
      0,
      ["load", "inview", "scrub", "pin", "manual"],
      "diffOptions",
      0,
      function (e, t) {
        let r = (r) => r.some((r) => e[r] !== t[r]);
        return {
          layout: r(i),
          timeline: r(s),
          trigger: r(o),
          any: a.some((r) => e[r] !== t[r]) || e.preset !== t.preset,
        };
      },
      "propsDiff",
      0,
      function (e) {
        let r = g({ preset: e.preset, trigger: e.trigger }),
          n = {};
        for (let i of ("materialize" !== e.preset && (n.preset = e.preset), a))
          ("trigger" === i ? e.trigger !== t.trigger : e[i] !== r[i]) &&
            (n[i] = e[i]);
        return n;
      },
      "resolveOptions",
      0,
      g,
    ]);
  },
]);
