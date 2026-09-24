(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  56087,
  (e) => {
    "use strict";
    var t = e.i(71645);
    let r = (0, t.createContext)(null);
    e.s([
      "StageContext",
      0,
      r,
      "usePixelRevealStage",
      0,
      () => (0, t.useContext)(r),
    ]);
  },
  56782,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645);
    function s() {
      let t = new Map(),
        r = null,
        s = 0,
        a = !1,
        n = !1,
        o = () => {
          for (let e of ((n = !0), t.keys()))
            e.setAttribute("data-pr-state", "static");
        };
      return {
        get lenis() {
          return r?.lenis ?? null;
        },
        get stats() {
          if (!r) return null;
          return {
            mirrors: r.mirrors.size,
            draws: r.stats.draws,
            frames: r.stats.frames,
          };
        },
        start(n = {}) {
          if (a) return;
          a = !0;
          let i = ++s;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return o();
          e.A(11436).then(
            ({ Engine: e }) => {
              if (i === s) {
                try {
                  r = new e(n);
                } catch (e) {
                  return (
                    console.warn(
                      "[pixel-reveal] WebGL 2 unavailable — showing plain text.",
                      e,
                    ),
                    o()
                  );
                }
                for (let [e, s] of t) {
                  for (let [t, a] of (r.add(e, s.options, s.handlers), s.queue))
                    r.control(e, t, a);
                  s.queue.length = 0;
                }
              }
            },
            (e) => {
              (console.warn(
                "[pixel-reveal] engine failed to load — showing plain text.",
                e,
              ),
                o());
            },
          );
        },
        stop() {
          ((a = !1), (n = !1), s++, r?.destroy(), (r = null));
        },
        add(e, s, a) {
          (t.set(e, { options: s, handlers: a, queue: [] }),
            n ? e.setAttribute("data-pr-state", "static") : r?.add(e, s, a));
        },
        update(e, s) {
          let a = t.get(e);
          a && ((a.options = s), r?.update(e, s));
        },
        remove(e) {
          (t.delete(e), r?.remove(e));
        },
        control(e, s, a) {
          if (r) return r.control(e, s, a);
          "progress" !== s && t.get(e)?.queue.push([s, a]);
        },
        elements: () =>
          [...t.entries()]
            .sort(([e], [t]) =>
              e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING
                ? -1
                : 1,
            )
            .map(([e, t]) => ({ el: e, options: t.options })),
      };
    }
    var a = e.i(56087);
    e.s(
      [
        "default",
        0,
        function ({ children: n, smooth: o = !0, maxDpr: i = 3 }) {
          let [l] = (0, r.useState)(s);
          return (
            (0, r.useEffect)(() => {
              let t,
                r = new URLSearchParams(window.location.search);
              l.start({ smooth: o, maxDpr: i, debug: r.has("debug") });
              let s = !1;
              return (
                r.has("gui") &&
                  e.A(38191).then(({ createPicker: e }) => {
                    s || (t = e({ stage: l }));
                  }),
                () => {
                  ((s = !0), t?.destroy(), l.stop());
                }
              );
            }, [l]),
            (0, t.jsx)(a.StageContext.Provider, { value: l, children: n })
          );
        },
      ],
      56782,
    );
  },
  11436,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          "static/chunks/17fip9h09rpzp.js",
          "static/chunks/08600y.iu0~_t.js",
        ].map((t) => e.l(t)),
      ).then(() => t(66502)),
    );
  },
  38191,
  (e) => {
    e.v((t) =>
      Promise.all(["static/chunks/0ziw66oa-7mef.js"].map((t) => e.l(t))).then(
        () => t(59235),
      ),
    );
  },
]);
