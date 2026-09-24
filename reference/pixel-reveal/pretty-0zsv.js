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
      a = {
        load: { start: null, end: null },
        inview: { start: "top 88%", end: null },
        scrub: { start: "top 92%", end: "bottom 55%" },
        pin: { start: 0, end: 0.85 },
        manual: { start: null, end: null },
      },
      s = ["split", "pixel"],
      n = [
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
      l = ["trigger", "start", "end", "once", "delay"],
      i = Object.keys(t),
      o = Object.fromEntries(
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
          for (let [e, a] of Object.entries(t)) for (let t of a) r.set(t, e);
          return [e, r];
        }),
      );
    function c(e, t, r) {
      let a = o[e].get(
        String(t)
          .toLowerCase()
          .replace(/[^a-z]/g, ""),
      );
      return a || (p(`${e}="${t}" is not recognised, using "${r}"`), r);
    }
    let u = {
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
    function d(e) {
      if (null === e || !1 === e || void 0 === e) return null;
      let t = String(e).trim();
      return t && "none" !== t && "transparent" !== t ? t : null;
    }
    function p(e) {}
    function f(e = {}) {
      let s = e.preset ?? "materialize";
      r[s] ||
        (p(
          `preset="${s}" does not exist (${Object.keys(r).join(", ")}), using "materialize"`,
        ),
        (s = "materialize"));
      let n = { ...t, ...r[s] };
      for (let t of i) void 0 !== e[t] && (n[t] = e[t]);
      let l = { preset: s };
      ((l.trigger = c("trigger", n.trigger, t.trigger)),
        (l.split = !1 === n.split ? "none" : c("split", n.split, t.split)),
        (l.sweep = c("sweep", n.sweep, t.sweep)),
        (l.from = c("from", n.from, t.from)),
        (l.direction = c("direction", n.direction, t.direction)),
        (l.pattern = c("pattern", n.pattern, t.pattern)),
        (l.hover = c("hover", n.hover, "none")));
      let o = a[l.trigger];
      for (let e of ((l.start = n.start ?? o.start),
      (l.end = n.end ?? o.end),
      (l.once = !1 !== n.once),
      (l.ease = "string" == typeof n.ease ? n.ease : t.ease),
      (l.riseEase = "string" == typeof n.riseEase ? n.riseEase : t.riseEase),
      (l.accent = d(n.accent)),
      (l.accent2 = d(n.accent2)),
      Object.keys(u)))
        l[e] = (function (e, t, r) {
          let a = "number" == typeof t ? t : parseFloat(t);
          if (!Number.isFinite(a))
            return (
              p(`${e}=${JSON.stringify(t)} is not a number, using ${r}`),
              r
            );
          let [s, n] = u[e];
          return Math.min(n, Math.max(s, a));
        })(e, n[e], t[e]);
      return ((l.levels = Math.round(l.levels)), Object.freeze(l));
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
          layout: r(s),
          timeline: r(n),
          trigger: r(l),
          any: i.some((r) => e[r] !== t[r]) || e.preset !== t.preset,
        };
      },
      "propsDiff",
      0,
      function (e) {
        let r = f({ preset: e.preset, trigger: e.trigger }),
          a = {};
        for (let s of ("materialize" !== e.preset && (a.preset = e.preset), i))
          ("trigger" === s ? e.trigger !== t.trigger : e[s] !== r[s]) &&
            (a[s] = e[s]);
        return a;
      },
      "resolveOptions",
      0,
      f,
    ]);
  },
  59800,
  (e) => {
    "use strict";
    var t = e.i(71645),
      r = e.i(76183),
      a = e.i(56087);
    let s = new Set(["preset", ...Object.keys(r.DEFAULTS)]);
    e.s([
      "default",
      0,
      function ({
        as: r = "div",
        children: n,
        progress: l,
        onStart: i,
        onComplete: o,
        debug: c = !1,
        ref: u,
        ...d
      }) {
        let p = (0, t.useContext)(a.StageContext),
          f = (0, t.useRef)(null),
          g = (0, t.useRef)({}),
          m = {},
          h = {};
        for (let e in d) (s.has(e) ? m : h)[e] = d[e];
        let x = JSON.stringify(m);
        return (
          (0, t.useEffect)(() => {
            g.current = { onStart: i, onComplete: o };
          }),
          (0, t.useEffect)(() => {
            let e = f.current;
            if (e) {
              if (!p) {
                (console.warn(
                  "[pixel-reveal] <PixelReveal> needs a <PixelRevealRoot> above it — showing plain text.",
                ),
                  e.setAttribute("data-pr-state", "static"));
                return;
              }
              return (p.add(e, JSON.parse(x), g), () => p.remove(e));
            }
          }, [p]),
          (0, t.useEffect)(() => {
            p && f.current && p.update(f.current, JSON.parse(x));
          }, [p, x]),
          (0, t.useEffect)(() => {
            p &&
              f.current &&
              "number" == typeof l &&
              p.control(f.current, "seek", l);
          }, [p, l]),
          (0, t.useImperativeHandle)(u, () => {
            let e = (e, t) =>
              p && f.current ? p.control(f.current, e, t) : void 0;
            return {
              get element() {
                return f.current;
              },
              play: () => e("play"),
              reverse: () => e("reverse"),
              restart: () => e("restart"),
              replay: () => e("restart"),
              pause: () => e("pause"),
              seek: (t) => e("seek", t),
              get progress() {
                return e("progress") ?? 0;
              },
            };
          }, [p]),
          (0, t.useEffect)(() => {
            let t;
            if (!c || !p || !f.current) return;
            let r = !1,
              a = f.current;
            return (
              e.A(38191).then(({ createGui: e }) => {
                r ||
                  (t = e({
                    stage: p,
                    el: a,
                    options: JSON.parse(x),
                    title: "string" == typeof c ? c : void 0,
                  }));
              }),
              () => {
                ((r = !0), t?.destroy());
              }
            );
          }, [c, p]),
          (0, t.createElement)(r, { ...h, ref: f, "data-pixel-reveal": "" }, n)
        );
      },
    ]);
  },
  64497,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.s([
      "default",
      0,
      function ({ text: e, className: a = "" }) {
        let [s, n] = (0, r.useState)(!1);
        return (
          (0, r.useEffect)(() => {
            if (!s) return;
            let e = setTimeout(() => n(!1), 1400);
            return () => clearTimeout(e);
          }, [s]),
          (0, t.jsx)("button", {
            type: "button",
            className: `label copy-button ${a}`,
            onClick: () =>
              navigator.clipboard?.writeText(e).then(
                () => n(!0),
                () => {},
              ),
            children: s ? "Copied" : "Copy",
          })
        );
      },
    ]);
  },
  51215,
  (e) => {
    "use strict";
    (e.i(56782), e.i(59800), e.i(43476), e.i(56087), e.s([], 51215));
  },
  61478,
  (e) => {
    "use strict";
    var t = e.i(59800);
    e.s(["PixelReveal", () => t.default]);
  },
  92503,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.i(51215);
    var a = e.i(61478);
    e.s([
      "default",
      0,
      function ({ className: e }) {
        let s = (0, r.useRef)(null),
          [n, l] = (0, r.useState)(!1);
        return (0, t.jsxs)("div", {
          className: "flex items-end justify-between gap-4",
          children: [
            (0, t.jsx)(a.PixelReveal, {
              ref: s,
              as: "h3",
              className: e,
              trigger: "manual",
              children: "manual",
            }),
            (0, t.jsx)("button", {
              type: "button",
              className: "label player-button shrink-0",
              onClick: () => {
                (s.current?.restart(), l(!0));
              },
              children: n ? "↻ Again" : "▶ Play",
            }),
          ],
        });
      },
    ]);
  },
  71550,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.i(51215);
    var a = e.i(56087);
    e.s([
      "default",
      0,
      function () {
        let e = (0, a.usePixelRevealStage)(),
          s = (0, r.useRef)(null),
          n = (0, r.useRef)(null),
          l = (0, r.useRef)(null);
        return (
          (0, r.useEffect)(() => {
            let t = 0,
              r = 0,
              a = setInterval(() => {
                let a = e?.stats;
                a &&
                  s.current &&
                  ((a.draws >= t || --r <= 0) && ((t = a.draws), (r = 3)),
                  (n.current.textContent = String(a.mirrors).padStart(2, "0")),
                  (l.current.textContent = String(t).padStart(2, "0")),
                  (s.current.dataset.live = t > 0 ? "true" : "false"));
              }, 100);
            return () => clearInterval(a);
          }, [e]),
          (0, t.jsxs)("p", {
            ref: s,
            className: "label engine-hud",
            "data-live": "false",
            children: [
              (0, t.jsx)("span", {
                className: "engine-hud-dot",
                "aria-hidden": "true",
              }),
              (0, t.jsx)("span", { children: "1 canvas" }),
              (0, t.jsxs)("span", {
                children: [
                  (0, t.jsx)("span", { ref: n, children: "--" }),
                  " texts",
                ],
              }),
              (0, t.jsxs)("span", {
                children: [
                  (0, t.jsx)("span", { ref: l, children: "00" }),
                  " draws",
                ],
              }),
            ],
          })
        );
      },
    ]);
  },
  84788,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.i(51215);
    var a = e.i(61478),
      s = e.i(76183),
      n = e.i(64497);
    let l =
        /(\/\/[^\n]*)|("[^"\n]*")|(\{[^}\n]*\})|(<\/?[A-Za-z][\w.]*|\/?>)|([A-Za-z][\w-]*)(?==)/g,
      i = ["tok-comment", "tok-string", "tok-expr", "tok-tag", "tok-attr"],
      o = Object.keys(s.PRESETS),
      c = ["words", "chars", "lines", "none"],
      u = { light: "#1700c7", dark: "#aeff00" },
      d = {
        light: { paper: "#f2f2f2", ink: "#000000" },
        dark: { paper: "#080808", ink: "#ffffff" },
      },
      p = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i,
      f = [
        { value: "#1700c7", name: "Ultramarine" },
        { value: "#aeff00", name: "Acid" },
        { value: "#ff3d00", name: "Signal orange" },
        { value: "#00d1ff", name: "Cyan" },
        { value: null, name: "No accent" },
      ],
      g = ["look", "motion", "colour"],
      m = [
        "none",
        "power1.inOut",
        "power2.out",
        "power3.out",
        "expo.out",
        "sine.inOut",
        "back.out",
      ],
      h = [
        "pattern",
        "direction",
        "pixel",
        "levels",
        "spread",
        "split",
        "from",
        "duration",
        "stagger",
        "rise",
        "ease",
      ];
    function x(e, t) {
      let r = (0, s.resolveOptions)({ preset: e }).accent;
      return null === r || "glitch" === e ? r : u[t];
    }
    function b({ label: e, options: r, value: a, onChange: s }) {
      return (0, t.jsxs)("fieldset", {
        className: "flex flex-col gap-3",
        children: [
          (0, t.jsx)("legend", {
            className: "label mb-3 text-black/45",
            children: e,
          }),
          (0, t.jsx)("div", {
            className: "flex flex-wrap gap-1.5",
            children: r.map((e) =>
              (0, t.jsx)(
                "button",
                {
                  type: "button",
                  className: "chip",
                  "aria-pressed": e === a,
                  onClick: () => s(e),
                  children: e,
                },
                e,
              ),
            ),
          }),
        ],
      });
    }
    function v({ label: e, value: r, active: a = !0, onChange: s }) {
      let n = r ?? "#1700c7";
      return (0, t.jsxs)("span", {
        className: "color-field",
        children: [
          (0, t.jsx)("label", {
            className: a
              ? "swatch swatch-custom is-set"
              : "swatch swatch-custom",
            style: a ? { background: n } : void 0,
            title: e,
            children: (0, t.jsx)("input", {
              type: "color",
              className: "sr-only",
              "aria-label": e,
              value: n,
              onChange: (e) => s(e.target.value),
            }),
          }),
          (0, t.jsx)(
            "input",
            {
              className: "hex-input",
              defaultValue: a ? n : "",
              placeholder: "#hex",
              "aria-label": `${e} (hex)`,
              spellCheck: !1,
              maxLength: 7,
              onFocus: (e) => e.currentTarget.select(),
              onKeyDown: (e) => "Enter" === e.key && e.currentTarget.blur(),
              onBlur: (e) => {
                let t = (function (e) {
                  let t = p.exec(e.trim());
                  if (!t) return null;
                  let r =
                    3 === t[1].length
                      ? [...t[1]].map((e) => e + e).join("")
                      : t[1];
                  return `#${r.toLowerCase()}`;
                })(e.currentTarget.value);
                t ? s(t) : (e.currentTarget.value = a ? n : "");
              },
            },
            n,
          ),
        ],
      });
    }
    function j({
      label: e,
      min: r,
      max: a,
      step: s,
      value: n,
      onChange: l,
      format: i = (e) => e,
    }) {
      return (0, t.jsxs)("label", {
        className: "flex flex-col gap-3",
        children: [
          (0, t.jsxs)("span", {
            className: "label flex justify-between text-black/45",
            children: [
              (0, t.jsx)("span", { children: e }),
              (0, t.jsx)("span", {
                className: "tabular-nums text-black",
                children: i(n),
              }),
            ],
          }),
          (0, t.jsx)("input", {
            type: "range",
            className: "pr-range",
            min: r,
            max: a,
            step: s,
            value: n,
            style: { "--fill": `${((n - r) / (a - r)) * 100}%` },
            onChange: (e) => l(Number(e.target.value)),
          }),
        ],
      });
    }
    e.s(
      [
        "default",
        0,
        function () {
          var e;
          let p,
            w,
            [y, k] = (0, r.useState)("materialize"),
            [N, S] = (0, r.useState)({}),
            [C, R] = (0, r.useState)("light"),
            [O, E] = (0, r.useState)(d.light),
            [T, $] = (0, r.useState)(u.light),
            [P, z] = (0, r.useState)("Type anything"),
            [A, D] = (0, r.useState)("look"),
            F = (0, r.useRef)(null),
            I = (0, r.useRef)(null),
            L = (0, r.useRef)(null),
            M = (0, r.useRef)(null),
            J = (0, r.useRef)(!1),
            W = (0, r.useRef)(!1),
            U = { preset: y, ...N, accent: T },
            B = (0, s.resolveOptions)(U),
            q = (0, s.resolveOptions)({ preset: y }),
            G = {};
          for (let e of ("materialize" !== y && (G.preset = y), h))
            void 0 !== N[e] && N[e] !== q[e] && (G[e] = N[e]);
          T !== q.accent && (G.accent = T);
          let H =
              ((e = P.trim() || "…"),
              (w =
                (p = Object.entries(G).map(([e, t]) =>
                  "string" == typeof t
                    ? `${e}="${t}"`
                    : `${e}={${JSON.stringify(t)}}`,
                )).length > 2
                  ? `<PixelReveal
  ${p.join("\n  ")}
>`
                  : `<PixelReveal${p.map((e) => ` ${e}`).join("")}>`),
              `${w}
  ${e}
</PixelReveal>`),
            K = JSON.stringify([y, N]);
          (0, r.useEffect)(() => {
            W.current && F.current?.restart();
          }, [K]);
          let V = JSON.stringify([T, O]);
          ((0, r.useEffect)(() => {
            if (!W.current) return;
            let e = setTimeout(() => F.current?.restart(), 260);
            return () => clearTimeout(e);
          }, [V]),
            (0, r.useEffect)(() => {
              if (!W.current) return;
              let e = setTimeout(() => F.current?.restart(), 450);
              return () => clearTimeout(e);
            }, [P]),
            (0, r.useEffect)(
              () => (
                (W.current = !0),
                () => {
                  W.current = !1;
                }
              ),
              [],
            ),
            (0, r.useEffect)(() => {
              let e = 0,
                t = !1,
                r = () => {
                  let a = F.current?.progress ?? 0;
                  (!J.current &&
                    L.current &&
                    ((L.current.value = String(a)),
                    L.current.style.setProperty("--fill", `${100 * a}%`)),
                    M.current && (M.current.textContent = a.toFixed(2)),
                    (e = t ? requestAnimationFrame(r) : 0));
                },
                a = new IntersectionObserver(([a]) => {
                  (t = a.isIntersecting) &&
                    !e &&
                    (e = requestAnimationFrame(r));
                });
              return (
                a.observe(I.current),
                () => {
                  (a.disconnect(), cancelAnimationFrame(e));
                }
              );
            }, []));
          let Z = (e) => (t) => S((r) => ({ ...r, [e]: t })),
            Y = (function (e) {
              let [t, r, a] = [1, 3, 5].map((t) =>
                parseInt(e.slice(t, t + 2), 16),
              );
              return 0.2126 * t + 0.7152 * r + 0.0722 * a < 128
                ? "dark"
                : "light";
            })(O.paper),
            Q = (e) => (t) => {
              (R("custom"), E((r) => ({ ...r, [e]: t })));
            },
            X = null !== T && !f.some((e) => e.value === T);
          return (0, t.jsxs)("div", {
            className: "playground",
            children: [
              (0, t.jsxs)("div", {
                ref: I,
                className: "playground-stage",
                style: { background: O.paper, color: O.ink },
                children: [
                  (0, t.jsxs)("div", {
                    className: "label playground-meta",
                    children: [
                      (0, t.jsx)("span", { children: "Specimen" }),
                      (0, t.jsxs)("span", {
                        children: [
                          B.pattern,
                          " · ",
                          B.direction,
                          " · ",
                          B.split,
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)(a.PixelReveal, {
                    ref: F,
                    as: "p",
                    className: "specimen",
                    ...U,
                    children: P || " ",
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    className: "label stage-replay",
                    onClick: () => F.current?.restart(),
                    children: "↻ Replay",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "playground-player",
                children: [
                  (0, t.jsx)("button", {
                    type: "button",
                    className: "label player-button",
                    onClick: () => F.current?.restart(),
                    children: "↻ Replay",
                  }),
                  (0, t.jsx)("input", {
                    ref: L,
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.001,
                    defaultValue: 0,
                    "aria-label": "Reveal progress",
                    className: "pr-range min-w-0 flex-1",
                    onPointerDown: () => (J.current = !0),
                    onPointerUp: () => (J.current = !1),
                    onPointerCancel: () => (J.current = !1),
                    onInput: (e) => {
                      let t = Number(e.currentTarget.value);
                      (e.currentTarget.style.setProperty(
                        "--fill",
                        `${100 * t}%`,
                      ),
                        F.current?.seek(t));
                    },
                  }),
                  (0, t.jsx)("span", {
                    ref: M,
                    className: "label w-10 text-right tabular-nums",
                    children: "0.00",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "playground-code",
                children: [
                  (0, t.jsx)("pre", {
                    children: (0, t.jsx)("code", {
                      children: (function (e) {
                        let t = [],
                          a = 0,
                          s = 0;
                        for (let n of e.matchAll(l)) {
                          n.index > a && t.push(e.slice(a, n.index));
                          let l = n.slice(1).findIndex((e) => void 0 !== e);
                          (t.push(
                            (0, r.createElement)(
                              "span",
                              { key: s++, className: i[l] },
                              n[0],
                            ),
                          ),
                            (a = n.index + n[0].length));
                        }
                        return (
                          a < e.length && t.push(e.slice(a)),
                          (0, r.createElement)(r.Fragment, null, ...t)
                        );
                      })(H),
                    }),
                  }),
                  (0, t.jsx)(n.default, {
                    text: H,
                    className: "absolute right-4 top-4",
                  }),
                ],
              }),
              (0, t.jsxs)("aside", {
                className: "playground-controls",
                "aria-label": "Reveal options",
                "data-lenis-prevent": !0,
                children: [
                  (0, t.jsxs)("label", {
                    className: "flex flex-col gap-3",
                    children: [
                      (0, t.jsx)("span", {
                        className: "label text-black/45",
                        children: "Text",
                      }),
                      (0, t.jsx)("input", {
                        value: P,
                        maxLength: 64,
                        onChange: (e) => z(e.target.value),
                        className: "text-input",
                        spellCheck: !1,
                      }),
                    ],
                  }),
                  (0, t.jsx)(b, {
                    label: "Preset",
                    options: o,
                    value: y,
                    onChange: (e) => {
                      (k(e), S({}), $(x(e, Y)));
                    },
                  }),
                  (0, t.jsx)("div", {
                    className: "control-tabs",
                    role: "tablist",
                    "aria-label": "Option groups",
                    children: g.map((e) =>
                      (0, t.jsx)(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          id: `tab-${e}`,
                          "aria-selected": A === e,
                          "aria-controls": `panel-${e}`,
                          className: "label control-tab",
                          onClick: () => D(e),
                          children: e,
                        },
                        e,
                      ),
                    ),
                  }),
                  (0, t.jsxs)("div", {
                    role: "tabpanel",
                    id: "panel-look",
                    "aria-labelledby": "tab-look",
                    className: "control-panel",
                    hidden: "look" !== A,
                    children: [
                      (0, t.jsx)(b, {
                        label: "Pattern",
                        options: s.PATTERNS,
                        value: B.pattern,
                        onChange: Z("pattern"),
                      }),
                      (0, t.jsx)(b, {
                        label: "Direction",
                        options: s.DIRECTIONS,
                        value: B.direction,
                        onChange: Z("direction"),
                      }),
                      (0, t.jsx)(j, {
                        label: "Pixel",
                        min: 4,
                        max: 64,
                        step: 1,
                        value: B.pixel,
                        onChange: Z("pixel"),
                        format: (e) => `${e}px`,
                      }),
                      (0, t.jsx)(j, {
                        label: "Levels",
                        min: 0,
                        max: 5,
                        step: 1,
                        value: B.levels,
                        onChange: Z("levels"),
                      }),
                      (0, t.jsx)(j, {
                        label: "Front width",
                        min: 0.1,
                        max: 1,
                        step: 0.01,
                        value: B.spread,
                        onChange: Z("spread"),
                        format: (e) => e.toFixed(2),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    role: "tabpanel",
                    id: "panel-motion",
                    "aria-labelledby": "tab-motion",
                    className: "control-panel",
                    hidden: "motion" !== A,
                    children: [
                      (0, t.jsx)(b, {
                        label: "Split",
                        options: c,
                        value: B.split,
                        onChange: Z("split"),
                      }),
                      (0, t.jsx)(b, {
                        label: "Order",
                        options: s.FROMS,
                        value: B.from,
                        onChange: Z("from"),
                      }),
                      (0, t.jsx)(j, {
                        label: "Duration",
                        min: 0.2,
                        max: 4,
                        step: 0.05,
                        value: B.duration,
                        onChange: Z("duration"),
                        format: (e) => `${e.toFixed(2)}s`,
                      }),
                      (0, t.jsx)(j, {
                        label: "Stagger",
                        min: 0,
                        max: 0.3,
                        step: 0.005,
                        value: B.stagger,
                        onChange: Z("stagger"),
                        format: (e) => `${e.toFixed(3)}s`,
                      }),
                      (0, t.jsx)(j, {
                        label: "Rise",
                        min: -1,
                        max: 1.5,
                        step: 0.05,
                        value: B.rise,
                        onChange: Z("rise"),
                        format: (e) =>
                          0 === e ? "off" : `${e.toFixed(2)} lines`,
                      }),
                      (0, t.jsx)(b, {
                        label: "Ease",
                        options: m.includes(B.ease) ? m : [...m, B.ease],
                        value: B.ease,
                        onChange: Z("ease"),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    role: "tabpanel",
                    id: "panel-colour",
                    "aria-labelledby": "tab-colour",
                    className: "control-panel",
                    hidden: "colour" !== A,
                    children: [
                      (0, t.jsxs)("fieldset", {
                        className: "flex flex-col gap-3",
                        children: [
                          (0, t.jsx)("legend", {
                            className: "label mb-3 text-black/45",
                            children: "Accent",
                          }),
                          (0, t.jsxs)("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                              f.map((e) =>
                                (0, t.jsx)(
                                  "button",
                                  {
                                    type: "button",
                                    className: e.value
                                      ? "swatch"
                                      : "swatch swatch-none",
                                    style: e.value
                                      ? { background: e.value }
                                      : void 0,
                                    "aria-pressed": T === e.value,
                                    "aria-label": e.name,
                                    title: e.name,
                                    onClick: () => $(e.value),
                                  },
                                  e.name,
                                ),
                              ),
                              (0, t.jsx)(v, {
                                label: "Custom accent",
                                value: T,
                                active: X,
                                onChange: $,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, t.jsx)(b, {
                        label: "Stage",
                        options: ["light", "dark"],
                        value: C,
                        onChange: (e) => {
                          (R(e),
                            E(d[e]),
                            null !== T && "glitch" !== y && $(u[e]));
                        },
                      }),
                      (0, t.jsxs)("fieldset", {
                        className: "flex flex-col gap-3",
                        children: [
                          (0, t.jsx)("legend", {
                            className: "label mb-3 text-black/45",
                            children: "Your colours",
                          }),
                          (0, t.jsxs)("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                              (0, t.jsxs)("span", {
                                className: "flex flex-col gap-2",
                                children: [
                                  (0, t.jsx)("span", {
                                    className: "label text-black/45",
                                    children: "Text",
                                  }),
                                  (0, t.jsx)(v, {
                                    label: "Text colour",
                                    value: O.ink,
                                    onChange: Q("ink"),
                                  }),
                                ],
                              }),
                              (0, t.jsxs)("span", {
                                className: "flex flex-col gap-2",
                                children: [
                                  (0, t.jsx)("span", {
                                    className: "label text-black/45",
                                    children: "Background",
                                  }),
                                  (0, t.jsx)(v, {
                                    label: "Background colour",
                                    value: O.paper,
                                    onChange: Q("paper"),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    className: "label reset-button",
                    onClick: () => {
                      (S({}), $(x(y, Y)));
                    },
                    children: "Reset to preset",
                  }),
                ],
              }),
            ],
          });
        },
      ],
      84788,
    );
  },
  1495,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.i(51215);
    var a = e.i(61478),
      s = e.i(76183);
    let n = [
        {
          preset: "materialize",
          blurb:
            "Words lift out of their line as hot, coarse silhouettes, then focus and cool into type.",
        },
        {
          preset: "signal",
          blurb: "CRT scanlines tear and flicker into focus, left to right.",
        },
        {
          preset: "typewriter",
          blurb:
            "Characters print one after another, a hot block at the cursor.",
        },
        {
          preset: "dissolve",
          blurb:
            "A quiet grey mosaic that simply resolves. No colour, no motion.",
        },
        {
          preset: "rain",
          blurb:
            "Characters drop in random order while columns of pixels rain down.",
        },
        {
          preset: "radiate",
          blurb: "One dithered front blooms out from the centre of the text.",
        },
        {
          preset: "bitmap",
          blurb:
            "Ordered dither and hard blocks: one bit per pixel, nothing more.",
        },
        {
          preset: "glitch",
          blurb: "Torn rows, two-tone blocks, heavy flicker.",
        },
        {
          preset: "flow",
          blurb: "A liquid, domain-warped front drifting diagonally across.",
        },
      ],
      l = new Set(["signal", "dissolve", "bitmap", "glitch"]);
    function i({ preset: e, blurb: n, index: o }) {
      let c = (0, r.useRef)(null),
        u = e[0].toUpperCase() + e.slice(1),
        d = (function (e) {
          if (!l.has(e)) return ["#aeff00"];
          let { accent: t, accent2: r } = (0, s.resolveOptions)({ preset: e });
          return [t, r].filter(Boolean);
        })(e);
      return (0, t.jsxs)("li", {
        className: "preset-tile group",
        onPointerEnter: () => c.current?.restart(),
        children: [
          (0, t.jsxs)("div", {
            className: "label flex justify-between text-white/40",
            children: [
              (0, t.jsx)("span", { children: String(o + 1).padStart(2, "0") }),
              (0, t.jsx)("span", {
                className:
                  "transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100",
                children: "Replay ↻",
              }),
            ],
          }),
          (0, t.jsx)(a.PixelReveal, {
            ref: c,
            as: "h3",
            className: "preset-title",
            preset: e,
            accent: l.has(e) ? void 0 : "#aeff00",
            delay: (o % 3) * 0.14,
            children: u,
          }),
          (0, t.jsxs)("div", {
            className: "flex flex-col gap-4",
            children: [
              (0, t.jsx)("p", {
                className:
                  "max-w-[34ch] text-[15px] leading-[1.45] text-white/55",
                children: n,
              }),
              (0, t.jsxs)("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                  (0, t.jsxs)("code", {
                    className: "text-[12px] text-[#aeff00]",
                    children: ['preset="', e, '"'],
                  }),
                  (0, t.jsx)("span", {
                    className: "flex gap-1",
                    title: d.length ? d.join(" + ") : "No accent",
                    children: d.length
                      ? d.map((e) =>
                          (0, t.jsx)(
                            "span",
                            {
                              className: "tile-chip",
                              style: { background: e },
                            },
                            e,
                          ),
                        )
                      : (0, t.jsx)("span", { className: "tile-chip is-empty" }),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    e.s([
      "default",
      0,
      function () {
        return (0, t.jsx)("ul", {
          className: "preset-grid",
          children: n.map((e, r) =>
            (0, t.jsx)(i, { ...e, index: r }, e.preset),
          ),
        });
      },
    ]);
  },
  57276,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    e.s([
      "StackGroup",
      0,
      function ({ from: e = 0, count: r, children: a }) {
        let s = Array.from({ length: r }, (t, r) => `--stack-${e + r}`).join(
          ", ",
        );
        return (0, t.jsx)("div", { style: { timelineScope: s }, children: a });
      },
      "StackSection",
      0,
      function ({
        index: e,
        last: a = !1,
        as: s = "section",
        className: n = "",
        style: l,
        children: i,
        ...o
      }) {
        let c = (0, r.useRef)(null);
        return (
          (0, r.useLayoutEffect)(() => {
            let e = c.current,
              t = () =>
                e.style.setProperty(
                  "--stack-top",
                  `${Math.min(0, window.innerHeight - e.offsetHeight)}px`,
                );
            t();
            let r = new ResizeObserver(t);
            return (
              r.observe(e),
              window.addEventListener("resize", t),
              () => {
                (r.disconnect(), window.removeEventListener("resize", t));
              }
            );
          }, []),
          (0, t.jsx)(s, {
            ref: c,
            ...o,
            className: `stack-section ${n}`,
            "data-stack-last": a || void 0,
            "data-pr-stack": "",
            style: {
              ...l,
              viewTimelineName: `--stack-${e}`,
              "--stack-next": `--stack-${e + 1}`,
            },
            children: i,
          })
        );
      },
    ]);
  },
]);
