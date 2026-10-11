(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  46500,
  (e, t, a) => {
    "use strict";
    Object.defineProperty(a, "__esModule", { value: !0 });
    var r = {
      formatUrl: function () {
        return o;
      },
      formatWithValidation: function () {
        return c;
      },
      urlObjectKeys: function () {
        return l;
      },
    };
    for (var i in r) Object.defineProperty(a, i, { enumerable: !0, get: r[i] });
    let n = e.r(73067)._(e.r(74554)),
      s = /https?|ftp|gopher|file/;
    function o(e) {
      let { auth: t, hostname: a } = e,
        r = e.protocol || "",
        i = e.pathname || "",
        o = e.hash || "",
        l = e.query || "",
        c = !1;
      (t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : ""),
        e.host
          ? (c = t + e.host)
          : a &&
            ((c = t + (~a.indexOf(":") ? `[${a}]` : a)),
            e.port && (c += ":" + e.port)),
        l && "object" == typeof l && (l = String(n.urlQueryToSearchParams(l)));
      let d = e.search || (l && `?${l}`) || "";
      return (
        r && !r.endsWith(":") && (r += ":"),
        e.slashes || ((!r || s.test(r)) && !1 !== c)
          ? ((c = "//" + (c || "")), i && "/" !== i[0] && (i = "/" + i))
          : c || (c = ""),
        o && "#" !== o[0] && (o = "#" + o),
        d && "?" !== d[0] && (d = "?" + d),
        (i = i.replace(/[?#]/g, encodeURIComponent)),
        (d = d.replace("#", "%23")),
        `${r}${c}${i}${d}${o}`
      );
    }
    let l = [
      "auth",
      "hash",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "slashes",
    ];
    function c(e) {
      return o(e);
    }
  },
  88220,
  (e, t, a) => {
    "use strict";
    Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "useMergedRef", {
        enumerable: !0,
        get: function () {
          return i;
        },
      });
    let r = e.r(71406);
    function i(e, t) {
      let a = (0, r.useRef)(null),
        i = (0, r.useRef)(null);
      return (0, r.useCallback)(
        (r) => {
          if (null === r) {
            let e = a.current;
            e && ((a.current = null), e());
            let t = i.current;
            t && ((i.current = null), t());
          } else e && (a.current = n(e, r)), t && (i.current = n(t, r));
        },
        [e, t],
      );
    }
    function n(e, t) {
      if ("function" != typeof e)
        return (
          (e.current = t),
          () => {
            e.current = null;
          }
        );
      {
        let a = e(t);
        return "function" == typeof a ? a : () => e(null);
      }
    }
    ("function" == typeof a.default ||
      ("object" == typeof a.default && null !== a.default)) &&
      void 0 === a.default.__esModule &&
      (Object.defineProperty(a.default, "__esModule", { value: !0 }),
      Object.assign(a.default, a),
      (t.exports = a.default));
  },
  87464,
  (e, t, a) => {
    "use strict";
    Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "isLocalURL", {
        enumerable: !0,
        get: function () {
          return n;
        },
      });
    let r = e.r(82426),
      i = e.r(52447);
    function n(e) {
      if (!(0, r.isAbsoluteUrl)(e)) return !0;
      try {
        let t = (0, r.getLocationOrigin)(),
          a = new URL(e, t);
        return a.origin === t && (0, i.hasBasePath)(a.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  16506,
  (e, t, a) => {
    "use strict";
    Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "errorOnce", {
        enumerable: !0,
        get: function () {
          return r;
        },
      });
    let r = (e) => {};
  },
  81239,
  (e, t, a) => {
    "use strict";
    Object.defineProperty(a, "__esModule", { value: !0 });
    var r = {
      default: function () {
        return y;
      },
      useLinkStatus: function () {
        return x;
      },
    };
    for (var i in r) Object.defineProperty(a, i, { enumerable: !0, get: r[i] });
    let n = e.r(73067),
      s = e.r(65093),
      o = n._(e.r(71406)),
      l = e.r(46500),
      c = e.r(12113),
      d = e.r(88220),
      p = e.r(82426),
      u = e.r(35474);
    e.r(2421);
    let h = e.r(20864),
      g = e.r(93594),
      f = e.r(87464),
      m = e.r(12001);
    function y(t) {
      var a, r;
      let i,
        n,
        y,
        [x, b] = (0, o.useOptimistic)(g.IDLE_LINK_STATUS),
        w = (0, o.useRef)(null),
        {
          href: M,
          as: k,
          children: S,
          prefetch: j = null,
          passHref: C,
          replace: A,
          shallow: R,
          scroll: D,
          onClick: P,
          onMouseEnter: T,
          onTouchStart: O,
          legacyBehavior: $ = !1,
          onNavigate: L,
          transitionTypes: E,
          ref: F,
          unstable_dynamicOnHover: I,
          ...N
        } = t;
      (i = S),
        $ &&
          ("string" == typeof i || "number" == typeof i) &&
          (i = (0, s.jsx)("a", { children: i }));
      let _ = o.default.useContext(c.AppRouterContext),
        z = !1 !== j,
        B =
          !1 !== j
            ? null === (r = j) || "auto" === r
              ? m.FetchStrategy.PPR
              : m.FetchStrategy.Full
            : m.FetchStrategy.PPR,
        H = "string" == typeof (a = k || M) ? a : (0, l.formatUrl)(a);
      if ($) {
        if (i?.$$typeof === Symbol.for("react.lazy"))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E863", enumerable: !1, configurable: !0 },
          );
        n = o.default.Children.only(i);
      }
      let U = $ ? n && "object" == typeof n && n.ref : F,
        W = o.default.useCallback(
          (e) => (
            null !== _ &&
              (w.current = (0, g.mountLinkInstance)(e, H, _, B, z, b)),
            () => {
              w.current &&
                ((0, g.unmountLinkForCurrentNavigation)(w.current),
                (w.current = null)),
                (0, g.unmountPrefetchableInstance)(e);
            }
          ),
          [z, H, _, B, b],
        ),
        G = {
          ref: (0, d.useMergedRef)(W, U),
          onClick(t) {
            $ || "function" != typeof P || P(t),
              $ &&
                n.props &&
                "function" == typeof n.props.onClick &&
                n.props.onClick(t),
              !_ ||
                t.defaultPrevented ||
                (function (t, a, r, i, n, s, l) {
                  if ("u" > typeof window) {
                    let c,
                      { nodeName: d } = t.currentTarget;
                    if (
                      ("A" === d.toUpperCase() &&
                        (((c = t.currentTarget.getAttribute("target")) &&
                          "_self" !== c) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute("download")
                    )
                      return;
                    if (!(0, f.isLocalURL)(a)) {
                      i && (t.preventDefault(), location.replace(a));
                      return;
                    }
                    if ((t.preventDefault(), s)) {
                      let e = !1;
                      if (
                        (s({
                          preventDefault: () => {
                            e = !0;
                          },
                        }),
                        e)
                      )
                        return;
                    }
                    let { dispatchNavigateAction: p } = e.r(52373);
                    o.default.startTransition(() => {
                      p(
                        a,
                        i ? "replace" : "push",
                        !1 === n
                          ? h.ScrollBehavior.NoScroll
                          : h.ScrollBehavior.Default,
                        r.current,
                        l,
                      );
                    });
                  }
                })(t, H, w, A, D, L, E);
          },
          onMouseEnter(e) {
            $ || "function" != typeof T || T(e),
              $ &&
                n.props &&
                "function" == typeof n.props.onMouseEnter &&
                n.props.onMouseEnter(e),
              _ && z && (0, g.onNavigationIntent)(e.currentTarget, !0 === I);
          },
          onTouchStart: function (e) {
            $ || "function" != typeof O || O(e),
              $ &&
                n.props &&
                "function" == typeof n.props.onTouchStart &&
                n.props.onTouchStart(e),
              _ && z && (0, g.onNavigationIntent)(e.currentTarget, !0 === I);
          },
        };
      return (
        (0, p.isAbsoluteUrl)(H)
          ? (G.href = H)
          : ($ && !C && ("a" !== n.type || "href" in n.props)) ||
            (G.href = (0, u.addBasePath)(H)),
        (y = $
          ? o.default.cloneElement(n, G)
          : (0, s.jsx)("a", { ...N, ...G, children: i })),
        (0, s.jsx)(v.Provider, { value: x, children: y })
      );
    }
    e.r(16506);
    let v = (0, o.createContext)(g.IDLE_LINK_STATUS),
      x = () => (0, o.useContext)(v);
    ("function" == typeof a.default ||
      ("object" == typeof a.default && null !== a.default)) &&
      void 0 === a.default.__esModule &&
      (Object.defineProperty(a.default, "__esModule", { value: !0 }),
      Object.assign(a.default, a),
      (t.exports = a.default));
  },
  92869,
  (e) => {
    "use strict";
    var t = e.i(65093),
      a = e.i(81239),
      r = e.i(72522);
    e.s([
      "ExperimentLayout",
      0,
      function ({
        title: e,
        experimentSlug: i,
        applications: n,
        children: s,
        settings: o,
      }) {
        let { theme: l, toggle: c } = (0, r.useTheme)();
        return (0, t.jsxs)("div", {
          className: "h-screen flex flex-col",
          children: [
            (0, t.jsxs)("header", {
              className:
                "flex items-center justify-between px-4 h-10 border-b border-border shrink-0",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [
                    (0, t.jsx)(a.default, {
                      href: "/",
                      className:
                        "text-[10px] text-fg-tertiary hover:text-fg-secondary transition-colors",
                      children: "← back",
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[10px] text-fg-tertiary",
                      children: "/",
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[11px] text-fg-primary",
                      children: e,
                    }),
                    n &&
                      n.length > 0 &&
                      (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsx)("span", {
                            className: "text-[10px] text-fg-tertiary ml-2",
                            children: "|",
                          }),
                          (0, t.jsx)("span", {
                            className:
                              "text-[9px] text-fg-tertiary uppercase tracking-wider ml-1",
                            children: "apps",
                          }),
                          n.map((e) =>
                            (0, t.jsx)(
                              a.default,
                              {
                                href: `/experiments/${i}/apps/${e.slug}`,
                                className:
                                  "text-[10px] text-fg-tertiary hover:text-fg-primary transition-colors border border-border rounded px-1.5 py-0.5",
                                title: e.description,
                                children: e.title,
                              },
                              e.slug,
                            ),
                          ),
                        ],
                      }),
                  ],
                }),
                (0, t.jsx)("button", {
                  onClick: c,
                  className:
                    "w-6 h-6 flex items-center justify-center rounded text-fg-secondary hover:text-fg-primary transition-colors text-[10px]",
                  title: `Switch to ${"dark" === l ? "light" : "dark"} mode`,
                  children: "dark" === l ? "☀" : "●",
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "flex flex-1 min-h-0",
              children: [
                (0, t.jsx)("div", {
                  className: "flex-1 relative",
                  children: s,
                }),
                o,
              ],
            }),
          ],
        });
      },
    ]);
  },
  46227,
  (e) => {
    "use strict";
    let t = [
        {
          slug: "cephalopod",
          title: "Abyssal Visitor",
          description:
            "A cephalopod that explores the page. Five render stacks — PBR+IBL, matcap, parallax height maps, transmission, and screen-space SSS — on one organic marching-cubes body.",
          date: "2026-08-13",
          tags: ["r3f", "threejs", "shader", "interactive", "dialkit"],
          applications: [],
        },
        {
          slug: "vine-overgrowth",
          title: "Vine Overgrowth",
          description:
            "A conveyor of bricks rides curved 3D tracks while braided procedural vines wrap the moving band — growing tips pinned mid-stream, leaning toward the cursor, coils screwing forward forever. Bricks crossing the growth zone are engulfed by shell-textured moss and instanced plant clumps under a domain-warped growth front, all cast onto the page by a contact shadow. A v2 mode (footer switch) adds analytic brick colliders the vines grip, plus seeking branch tendrils that latch onto passing bricks — each touch point seeding that brick's transformation.",
          date: "2026-08-12",
          tags: [
            "threejs",
            "r3f",
            "shader",
            "generative",
            "interactive",
            "particles",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "surface-dissolve",
          title: "Surface Dissolve",
          description:
            "A landing page rendered onto a curling 3D sheet via html-in-canvas dissolves into smoke as it scrolls through a fixed altitude band — a GPU particle sim releases page pixels as grains that cross-dissolve with a soft, wandering erosion front (no hard edge anywhere). The hero's email field is live: the pointer is ray-mapped onto the deformed surface for hover and real typing.",
          date: "2026-08-11",
          tags: [
            "threejs",
            "html-in-canvas",
            "shader",
            "particles",
            "scroll",
            "interactive",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "dot-sphere-card",
          title: "Dot Sphere Card",
          description:
            "A futuristic HUD card in CSS 3D: a cursor-reactive dot sphere floats over a tinted video layer while two textured asteroid GLBs orbit out from behind the card on hover — real shadow-mapped shadows, a center-pinned cursor-tracking spotlight, hover-reveal choreography per layer, and a TPDF-dithered background that kills gradient banding.",
          date: "2026-08-07",
          tags: [
            "threejs",
            "canvas",
            "css-3d",
            "video",
            "interactive",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "jungle-cursor-canopy",
          title: "Jungle Cursor Canopy",
          description:
            "A dense procedural jungle canopy parts around the cursor, then lifts and spirals past the camera through a GSAP-choreographed landing sequence. Three.js leaves combine generated species silhouettes, physical materials, spatial gusts, depth of field, and a configurable field of glowing air motes.",
          date: "2026-07-16",
          tags: [
            "threejs",
            "shader",
            "interactive",
            "generative",
            "particles",
            "gsap",
          ],
          applications: [],
        },
        {
          slug: "pendant-lamp",
          title: "Pendant Lamp",
          description:
            "A pendant lamp on a real pendulum physically lights an HTML page rendered into WebGL via html-in-canvas. Outside the beam the page falls dark — dim grayscale with blur, stroked outline, halftone, CRT, dither and more — and the swinging light reveals the true page. Grab and throw the lamp; hover a button and the beam aims at it.",
          date: "2026-07-14",
          tags: [
            "r3f",
            "threejs",
            "canvas",
            "webgl",
            "physics",
            "experimental",
          ],
          applications: [],
        },
        {
          slug: "action-wheel",
          title: "Action Wheel",
          description:
            "A game-style radial action wheel. Click and hold to summon a layered circular control — a noise-animated dot grid, a segmented variable-stroke ring, and four independent quadrants that light up as a cursor-chasing glow orbits the rim. The whole wheel tilts in 3D toward the cursor; release over a quadrant to confirm.",
          date: "2026-07-03",
          tags: [
            "r3f",
            "threejs",
            "shader",
            "interactive",
            "ui-control",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "cuboid-chain",
          title: "Cuboid Chain",
          description:
            "A horizontal chain of rounded cuboids whose front faces carry Figma task-card art. Each cuboid barrel-rolls on the horizontal axis with a staggered phase, lit by a top/bottom/side-key rig. Cuboid dimensions, gap, rotation speed/stagger, and every light are DialKit-controlled.",
          date: "2026-06-05",
          tags: ["r3f", "threejs", "3d", "cards", "lighting", "dialkit"],
          applications: [],
        },
        {
          slug: "trace-cards",
          title: "Trace Cards",
          description:
            "Pyramid and diamond cards with cursor-driven tilt, depth sculpts, and streaming duplicate layers. R3F formation over HTML chrome with DialKit controls.",
          date: "2026-05-24",
          tags: ["cards", "r3f", "wireframe", "hover", "dialkit", "three.js"],
          applications: [],
        },
        {
          slug: "pattern-cards",
          title: "Pattern Cards",
          description:
            "Three tall feature cards in black, orange, and warm gray. Each carries a distinct dot pattern (arrow wedge, diagonal cascade, plus) and a bottom-left title — direct port of a Figma layout.",
          date: "2026-05-19",
          tags: ["layout", "cards", "static"],
          applications: [],
        },
        {
          slug: "twisting-ribbons",
          title: "Twisting Ribbons",
          description:
            "A row of thin vertical ribbons twist around their Y-axis, progressing from edge-on at the left to face-on (and past) at the right. A twist band blends two materials top-to-bottom, and the negative space between neighbors forms vesica-shaped voids.",
          date: "2026-05-16",
          tags: ["r3f", "threejs", "shader", "dialkit"],
          applications: [],
        },
        {
          slug: "devtools-demo",
          title: "Devtools Demo",
          description:
            "Tiny scene exercising every r3f-devtools helper: ExperimentCanvas, DialLightRig, DialCamera, useDialPhysicalMaterial, useDialTween, plus edit-mode wireframe / helpers / orbit / gizmo / copy-values.",
          date: "2026-05-04",
          tags: ["r3f", "threejs", "devtools", "dialkit"],
          applications: [],
          hidden: !0,
        },
        {
          slug: "glass-hero",
          title: "Glass Hero",
          description:
            "A live HTML hero section sits behind floating glass shapes that refract and split light into chromatic fringes. Real-time dispersion via MeshPhysicalMaterial — drag to reposition the glass, tune IOR/thickness/dispersion in dialkit.",
          date: "2026-05-01",
          tags: [
            "r3f",
            "threejs",
            "html-in-canvas",
            "glass",
            "dispersion",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "dot-form",
          title: "Dot Form 3D",
          description:
            "A shadcn-style form lifts into a tilted 3D scene on focus. Input and checkbox become extruded outlines, the button gains thickness, and typed characters render as a dot-relief at varying heights.",
          date: "2026-04-27",
          tags: [
            "html-in-canvas",
            "threejs",
            "r3f",
            "transition",
            "interactive",
          ],
          applications: [],
        },
        {
          slug: "code-slice-hero",
          title: "Code Slice Hero",
          description:
            "A landing page that hovers, lifts, and shatters into a grid of tiles to reveal an agent surface document and a working terminal.",
          date: "2026-04-23",
          tags: ["threejs", "r3f", "html-in-canvas", "landing", "shader"],
          applications: [],
        },
        {
          slug: "cursor-nav",
          title: "Cursor Nav",
          description:
            "A fake cursor moves like normal, then blooms into a 3D navigation mode on click. Steer selections by moving up and down.",
          date: "2026-04-21",
          tags: ["interactive", "3d", "ui", "transition"],
          applications: [],
        },
        {
          slug: "elastic-bars",
          title: "Elastic Bars",
          description:
            "Vertical bars that deform elastically in response to mouse movement, creating a rubber-like wave effect.",
          date: "2026-03-27",
          tags: ["canvas", "interactive", "physics"],
          applications: [
            {
              slug: "feature-cards",
              title: "Feature Cards",
              description:
                "Hero cards with animated bar art as visual identity",
            },
            {
              slug: "elastic-dropdown",
              title: "Elastic Dropdown",
              description:
                "Horizontal bars that bend to fit unfolding dropdown content",
            },
          ],
        },
        {
          slug: "microchip-viewer",
          title: "Microchip Viewer",
          description:
            "Interactive 3D microchip prototype with togglable parts, configurable lighting, and tone mapping controls.",
          date: "2026-03-27",
          tags: ["threejs", "3d", "interactive"],
          applications: [
            {
              slug: "product-card",
              title: "Product Card",
              description:
                "3D microchip embedded in a product card with explode-on-click",
            },
          ],
        },
        {
          slug: "creativity-dial",
          title: "Creativity Dial",
          description:
            "Circular HUD control for adjusting AI temperature. Drag to shift between precise and creative — particles react in real-time.",
          date: "2026-03-28",
          tags: ["interactive", "ui-control", "ai"],
          applications: [],
        },
        {
          slug: "neural-burst",
          title: "Neural Burst",
          description:
            "3D radial node graph with labeled endpoints. Nodes flow and rotate in space — hover to inspect, click to expand detail panels.",
          date: "2026-03-29",
          tags: ["canvas", "3d", "interactive", "data-viz"],
          applications: [],
        },
        {
          slug: "clay-toggle",
          title: "Clay Toggle",
          description:
            "Soft 3D toggle switch with clay-like materials, subtle shadows, and smooth animation. Click to toggle.",
          date: "2026-03-29",
          tags: ["threejs", "3d", "interactive", "ui-control"],
          applications: [],
        },
        {
          slug: "folder-gallery",
          title: "Folder Gallery",
          description:
            "Click a folder to launch images into a grid. Hover to see it open with a glowing light beam. Click again to recall them.",
          date: "2026-03-31",
          tags: ["interactive", "animation", "ui"],
          applications: [],
        },
        {
          slug: "morph-blob",
          title: "Morph Blob",
          description:
            "Organic blobs that morph slowly with Perlin noise and drift on their own. Hover to attract or repel them — they deform and merge in response.",
          date: "2026-03-29",
          tags: ["canvas", "interactive", "generative"],
          applications: [],
        },
        {
          slug: "viewport-transition",
          title: "Viewport Transition",
          description:
            "A 2D marketing page that transforms into an immersive 3D wireframe scene with extruded text, bloom, and chromatic aberration.",
          date: "2026-04-02",
          tags: ["threejs", "3d", "interactive", "transition"],
          applications: [],
        },
        {
          slug: "shape-cards",
          title: "Shape Cards",
          description:
            "Randomized geometric card compositions with overlapping shapes, curated color palettes, and glass-effect accents. Tweak and regenerate via dialkit.",
          date: "2026-04-04",
          tags: ["generative", "svg", "dialkit", "interactive"],
          applications: [],
        },
        {
          slug: "html-in-canvas",
          title: "HTML in Canvas",
          description:
            "Render real, interactive HTML into canvas using the experimental WICG drawElementImage API. Wave, kaleidoscope, shatter, melt, glitch, and WebGL shader effects.",
          date: "2026-04-10",
          tags: ["canvas", "webgl", "experimental", "interactive"],
          applications: [],
        },
        {
          slug: "shader-cards",
          title: "Shader Cards",
          description:
            "Scrollable HTML rendered in canvas with particles that rain down and collide with page elements using a luminance-based collision map.",
          date: "2026-04-11",
          tags: ["canvas", "webgl", "shader", "experimental"],
          applications: [],
        },
        {
          slug: "curtain-sidebar",
          title: "Curtain Sidebar",
          description:
            "A music streaming page where the sidebar reveals via a curtain deformation effect. Drag from the left edge to fold the page like paper, powered by html-in-canvas and WebGL.",
          date: "2026-04-16",
          tags: ["canvas", "webgl", "experimental", "interactive"],
          applications: [],
        },
        {
          slug: "dot-hover-cards",
          title: "Dot Hover Cards",
          description:
            "The whole page is filled with gray dots. Hover over a card region and dots in that area turn white, revealing its silhouette. Click to smoothly transition the dots into sharp HTML.",
          date: "2026-04-17",
          tags: ["canvas", "interactive", "transition"],
          applications: [],
        },
        {
          slug: "particle-phones",
          title: "Particle Phones",
          description:
            "A 3-column scroll page. The middle column holds a cloud of particles in organic drift — as new section headlines arrive, the particles crisply resolve into an iPhone screenshot.",
          date: "2026-04-20",
          tags: ["canvas", "scroll", "particles", "interactive"],
          applications: [],
        },
        {
          slug: "dot-phone-carousel",
          title: "Dot Phone Carousel",
          description:
            "A centered phone mockup with a crisp screen while dotted preview images glide behind it on a horizontal carousel. Cycle left and right to pull each image through the phone with a futuristic scan transition.",
          date: "2026-04-22",
          tags: ["canvas", "interactive", "carousel", "transition"],
          applications: [],
        },
        {
          slug: "shader-deck",
          title: "Shader Deck",
          description:
            "A 3D carousel of HTML slides arranged on a ring in 3D space, scrolling through a glowing portal plane with volumetric light, fog, bloom, and chromatic aberration. Built with R3F, drei, and html-in-canvas.",
          date: "2026-04-26",
          tags: [
            "threejs",
            "r3f",
            "html-in-canvas",
            "shader",
            "carousel",
            "dialkit",
          ],
          applications: [],
        },
        {
          slug: "mobius-strip",
          title: "Mobius Strip",
          description:
            "An HTML landing page mapped onto a 3D Mobius strip using html-in-canvas. Scroll to rotate the strip and traverse the page content.",
          date: "2026-04-13",
          tags: ["canvas", "webgl", "3d", "experimental"],
          applications: [],
        },
      ],
      a = [...t]
        .filter((e) => !e.hidden)
        .sort((e, t) => t.date.localeCompare(e.date));
    e.s([
      "experiments",
      0,
      a,
      "getExperiment",
      0,
      function (e) {
        return t.find((t) => t.slug === e);
      },
    ]);
  },
  27442,
  (e) => {
    "use strict";
    var t = e.i(65093),
      a = e.i(71406),
      r = e.i(33149),
      i = e.i(92869),
      n = e.i(46227);
    let s = {
        a: [
          "empty",
          "empty",
          "solid",
          "empty",
          "empty",
          "empty",
          "ring",
          "ring",
          "solid",
          "ring",
          "ring",
          "ring",
          "solid",
          "ring",
          "ring",
          "empty",
          "ring",
          "ring",
          "solid",
          "ring",
          "empty",
          "empty",
          "solid",
          "empty",
          "empty",
        ],
        b: [
          "solid",
          "ring",
          "empty",
          "empty",
          "empty",
          "ring",
          "solid",
          "ring",
          "empty",
          "empty",
          "empty",
          "ring",
          "solid",
          "ring",
          "empty",
          "empty",
          "empty",
          "ring",
          "solid",
          "ring",
          "empty",
          "empty",
          "empty",
          "ring",
          "solid",
        ],
        c: [
          "empty",
          "empty",
          "ring",
          "empty",
          "empty",
          "empty",
          "empty",
          "ring",
          "empty",
          "empty",
          "ring",
          "ring",
          "solid",
          "ring",
          "ring",
          "empty",
          "empty",
          "ring",
          "empty",
          "empty",
          "empty",
          "empty",
          "ring",
          "empty",
          "empty",
        ],
      },
      o = {
        maxAngle: 0,
        randomness: 0,
        scaleMax: 1,
        scaleRadius: 1,
        packIterations: 0,
        easing: 1,
        keepInGrid: !1,
        pushSmoothingMs: 1,
        scaleSmoothingMs: 1,
      },
      l = { dx: 0, dy: 0, durationMs: 0, staggerMs: 0 };
    function c({
      variant: e,
      color: r,
      size: i = 127,
      dotScale: n = 0.62,
      ringStrokeScale: d = 0.22,
      fallHeight: p = 0,
      animation: u,
      particles: h,
      cursor: g = null,
      tilt: f = o,
      centerMove: m = l,
      staticOpacity: y = 1,
      staticFadeMs: v = 280,
    }) {
      let x = i / 5,
        b = (x * n) / 2,
        w = 2 * b * d,
        M = Math.max(0, b - w / 2),
        k = (0, a.useMemo)(() => {
          let e = Array(25);
          for (let t = 0; t < e.length; t++) e[t] = 0.15 + 0.85 * Math.random();
          return e;
        }, []),
        { cells: S, bottomCells: j } = (0, a.useMemo)(() => {
          let t = [];
          s[e].forEach((e, a) => {
            if ("empty" === e) return;
            let r = a % 5,
              i = Math.floor(a / 5);
            t.push({ i: a, col: r, row: i, phase: 0.45 * i + 0.7 * r });
          });
          let a = new Map();
          for (let e of t) {
            let t = a.get(e.col);
            (!t || e.row > t.row) && a.set(e.col, e);
          }
          return { cells: t, bottomCells: Array.from(a.values()) };
        }, [e]),
        C = (0, a.useRef)({ time: 0 }),
        A = (0, a.useRef)([]),
        R = (0, a.useRef)(0),
        D = (0, a.useRef)(new Map()),
        P = (0, a.useRef)(new Map()),
        T = (0, a.useRef)(new Map()),
        O = (0, a.useRef)(new Map()),
        $ = (0, a.useRef)(performance.now()),
        L = (0, a.useRef)({
          cell: x,
          size: i,
          fallHeight: p,
          bottomCells: j,
          animation: u,
          particles: h,
        });
      L.current = {
        cell: x,
        size: i,
        fallHeight: p,
        bottomCells: j,
        animation: u,
        particles: h,
      };
      let [, E] = (0, a.useState)(0);
      (0, a.useEffect)(() => {
        let e = 0,
          t = performance.now(),
          a = (r) => {
            let i = Math.min((r - t) / 1e3, 0.05);
            (t = r), (C.current.time += i);
            let n = C.current.time,
              s = L.current,
              o = s.size + s.fallHeight + s.cell,
              l = [];
            for (let e of A.current) {
              let t = e.age + i;
              if (t >= e.totalLife) continue;
              let a = e.y + e.vy * i;
              a > o || l.push({ ...e, y: a, age: t });
            }
            let c = 1 / Math.max(s.particles.spawnRate, 1e-4);
            for (let e of s.bottomCells) {
              let t = D.current.get(e.i) ?? -c,
                a = (Math.random() - 0.5) * s.particles.jitter * c;
              if (n - t >= c + a) {
                D.current.set(e.i, n);
                let t = P.current.get(e.i),
                  a = t?.x ?? e.col * s.cell + s.cell / 2,
                  r = t?.y ?? (e.row + 1) * s.cell + s.cell / 2,
                  i = t?.scale ?? 1;
                l.push({
                  id: R.current++,
                  x: a,
                  y: r + s.cell,
                  vy: s.particles.fallSpeed,
                  age: 0,
                  totalLife: s.particles.lifetime,
                  phase: e.phase + 1.5 * Math.random(),
                  intensity: 0.15 + 0.85 * Math.random(),
                  spawnScale: i,
                });
              }
            }
            (A.current = l),
              E((e) => (e + 1) & 65535),
              (e = requestAnimationFrame(a));
          };
        return (e = requestAnimationFrame(a)), () => cancelAnimationFrame(e);
      }, []);
      let F = C.current.time,
        I = i + p,
        N = Math.max(0.05, f.easing),
        _ = Math.max(0.001, f.scaleRadius),
        z = Math.max(1, f.scaleMax),
        B = Math.max(0, Math.round(f.packIterations)),
        H = g ? { x: g.x - m.dx, y: g.y - m.dy } : null,
        U = S.length,
        W = Array(U),
        G = Array(U);
      for (let e = 0; e < U; e++) {
        let t = S[e];
        W[e] = { x: t.col * x + x / 2, y: t.row * x + x / 2 };
        let a = Math.max(0, Math.min(1, f.randomness)),
          r = 1 + ((k[t.i] ?? 1) - 1) * a;
        G[e] =
          b *
          (function (e, t, a) {
            if (!H || z <= 1) return 1;
            let r = H.x - e,
              i = H.y - t,
              n = r * r + i * i;
            return n >= _ * _
              ? 1
              : 1 + Math.pow(1 - Math.sqrt(n) / _, N) * (z - 1) * a;
          })(W[e].x, W[e].y, r);
      }
      if (H && B > 0 && z > 1 && !f.keepInGrid) {
        let e = Array(U),
          t = Array(U);
        for (let a = 0; a < U; a++)
          (e[a] = S[a].col * x + x / 2), (t[a] = S[a].row * x + x / 2);
        for (let a = 0; a < B; a++)
          for (let a = 0; a < U; a++)
            for (let r = a + 1; r < U; r++) {
              let i = W[r].x - W[a].x,
                n = W[r].y - W[a].y,
                s = i * i + n * n,
                o = e[r] - e[a],
                l = t[r] - t[a],
                c = Math.sqrt(o * o + l * l) - 2 * b,
                d = G[a] + G[r] + c;
              if (s < d * d && s > 1e-8) {
                let e = Math.sqrt(s),
                  t = (d - e) / 2,
                  o = i / e,
                  l = n / e;
                (W[a].x -= o * t),
                  (W[a].y -= l * t),
                  (W[r].x += o * t),
                  (W[r].y += l * t);
              }
            }
      }
      let q = performance.now(),
        K = Math.min(0.1, Math.max(0, (q - $.current) / 1e3));
      $.current = q;
      let X = Math.max(0.001, f.pushSmoothingMs / 1e3),
        V = Math.max(0.001, f.scaleSmoothingMs / 1e3),
        Y = 1 - Math.exp(-K / X),
        J = 1 - Math.exp(-K / V),
        Q = Array(U),
        Z = Array(U);
      for (let e = 0; e < U; e++) {
        let t = S[e].i,
          a = G[e] / Math.max(b, 1e-6),
          r = O.current.get(t),
          i = void 0 === r ? a : r + (a - r) * J;
        O.current.set(t, i), (Z[e] = i);
        let n = T.current.get(t),
          s =
            void 0 === n
              ? { x: W[e].x, y: W[e].y }
              : { x: n.x + (W[e].x - n.x) * Y, y: n.y + (W[e].y - n.y) * Y };
        T.current.set(t, s), (Q[e] = s);
      }
      let ee = new Map();
      for (let e = 0; e < U; e++)
        ee.set(S[e].i, { x: Q[e].x, y: Q[e].y, scale: Z[e] });
      P.current = ee;
      let et = Math.max(0.001, i);
      function ea(e, a, i, n, s, o, l, c, d, p, h = !1) {
        let g,
          y,
          v = Math.max(0, Math.min(1, f.randomness)),
          x =
            ((g = Math.max(
              0,
              Math.min(
                1,
                (Math.sin(F * u.speed * Math.PI * 2 + s * u.phaseSpread) +
                  u.fillBias +
                  1) /
                  2,
              ),
            )),
            (y = u.easing),
            g < 0.5
              ? Math.pow(2 * g, y) / 2
              : 1 - Math.pow(2 * (1 - g), y) / 2),
          k = Math.max(0, b * (1 - x)) * d,
          S = M * d,
          j = (function (e, t, a, r, i) {
            if (!H || 0 === f.maxAngle) {
              let i = e - a,
                n = t - r;
              if (0 === i && 0 === n) return;
              return `translate(${i.toFixed(2)}px, ${n.toFixed(2)}px)`;
            }
            let n = H.x - e,
              s = H.y - t,
              o = n / et,
              l = s / et,
              c = Math.abs(o),
              d = Math.abs(l),
              p = Math.sign(o) * Math.pow(Math.min(1, c), N),
              u = Math.sign(l) * Math.pow(Math.min(1, d), N),
              h = p * f.maxAngle * i,
              g = -u * f.maxAngle * i;
            return `translate(${(e - a).toFixed(2)}px, ${(t - r).toFixed(2)}px) rotateX(${g.toFixed(2)}deg) rotateY(${h.toFixed(2)}deg)`;
          })(i, n, e, a, 1 + (c - 1) * v);
        return (0, t.jsx)(
          "g",
          {
            style: h
              ? void 0
              : {
                  transform: `translate(${m.dx}px, ${m.dy}px)`,
                  transition: `transform ${m.durationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${p}ms`,
                },
            children: (0, t.jsxs)("g", {
              opacity: o,
              style: {
                transform: j,
                transformOrigin: `${e}px ${a}px`,
                willChange: j ? "transform" : void 0,
              },
              children: [
                k > 0 && (0, t.jsx)("circle", { cx: e, cy: a, r: k, fill: r }),
                S > 0 &&
                  (0, t.jsx)("circle", {
                    cx: e,
                    cy: a,
                    r: S,
                    stroke: r,
                    strokeWidth: w * d,
                    fill: "none",
                    opacity: x,
                  }),
              ],
            }),
          },
          l,
        );
      }
      return (0, t.jsxs)("svg", {
        width: i,
        height: I,
        viewBox: `0 0 ${i} ${I}`,
        fill: "none",
        "aria-hidden": !0,
        style: { overflow: "visible", transformStyle: "preserve-3d" },
        children: [
          (0, t.jsx)("g", {
            style: {
              opacity: y,
              transition: `opacity ${v}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
            },
            children: S.map((e, t) => {
              let a = k[e.i] ?? 1,
                r = Math.max(0, Math.min(1, (a - 0.15) / 0.85)) * m.staggerMs,
                i = e.col * x + x / 2,
                n = e.row * x + x / 2,
                s = Q[t],
                o = Z[t];
              return ea(i, n, s.x, s.y, e.phase, 1, `c${e.i}`, a, o, r);
            }),
          }),
          (0, t.jsx)("g", {
            style: {
              opacity: +!H,
              transition: `opacity ${m.durationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
            },
            children: A.current.map((e) => {
              let t = e.age / e.totalLife,
                a = h.fadeStart,
                r = h.startOpacity,
                i = t > a ? Math.max(0, r * (1 - (t - a) / (1 - a))) : r;
              return ea(
                e.x,
                e.y,
                e.x,
                e.y,
                e.phase,
                i,
                `p${e.id}`,
                e.intensity,
                e.spawnScale,
                0,
                !0,
              );
            }),
          }),
        ],
      });
    }
    function d({ active: e, borderRadius: r, params: i }) {
      let n = (0, a.useRef)(null),
        s = (0, a.useRef)(null),
        o = (0, a.useRef)({ w: 0, h: 0 }),
        l = (0, a.useRef)(0);
      if (
        ((0, a.useEffect)(() => {
          let e = n.current;
          if (!e) return;
          let t = new ResizeObserver(([e]) => {
            let t = e.contentRect;
            o.current = { w: t.width, h: t.height };
          });
          return t.observe(e), () => t.disconnect();
        }, []),
        (0, a.useEffect)(() => {
          if (!i.enabled) return;
          if (!e) {
            let e = s.current;
            e && (e.style.opacity = "0");
            return;
          }
          let t = performance.now(),
            a = (e) => {
              l.current = requestAnimationFrame(a);
              let r = s.current;
              if (!r) return;
              let { w: n, h: c } = o.current;
              if (n <= 0 || c <= 0) return;
              let d = (i.widthPct / 100) * n,
                p = c * Math.abs(Math.tan((i.angleDeg * Math.PI) / 180)),
                u = -d - p,
                h = n + p - u,
                g = h / (n / Math.max(1, i.durationMs)),
                f = (e - t) % (g + i.loopDelayMs);
              if (f < g) {
                var m;
                let e =
                  (m = f / g) < 0.5
                    ? 4 * m * m * m
                    : 1 - Math.pow(-2 * m + 2, 3) / 2;
                (r.style.transform = `translateX(${(u + e * h).toFixed(2)}px) skewX(${(-i.angleDeg).toFixed(2)}deg)`),
                  (r.style.opacity = String(i.intensity));
              } else r.style.opacity = "0";
            };
          return (
            (l.current = requestAnimationFrame(a)),
            () => cancelAnimationFrame(l.current)
          );
        }, [
          e,
          i.enabled,
          i.intensity,
          i.widthPct,
          i.angleDeg,
          i.blurPx,
          i.durationMs,
          i.loopDelayMs,
          i.color,
          i.blendMode,
        ]),
        !i.enabled)
      )
        return null;
      let c = i.color,
        p = `linear-gradient(90deg,
    transparent 0%,
    color-mix(in srgb, ${c} 8%, transparent) 20%,
    color-mix(in srgb, ${c} 35%, transparent) 38%,
    color-mix(in srgb, ${c} 85%, transparent) 50%,
    color-mix(in srgb, ${c} 35%, transparent) 62%,
    color-mix(in srgb, ${c} 8%, transparent) 80%,
    transparent 100%
  )`;
      return (0, t.jsx)("div", {
        ref: n,
        className: "absolute inset-0 pointer-events-none overflow-hidden",
        style: { borderRadius: r },
        children: (0, t.jsx)("div", {
          ref: s,
          style: {
            position: "absolute",
            left: 0,
            top: "-50%",
            height: "200%",
            width: `${i.widthPct}%`,
            background: p,
            filter: `blur(${i.blurPx}px)`,
            mixBlendMode: i.blendMode,
            transform: `translateX(-200%) skewX(${-i.angleDeg}deg)`,
            opacity: 0,
            willChange: "transform, opacity",
          },
        }),
      });
    }
    function p({
      bg: e,
      fg: r,
      dotColor: i,
      glowColor: n,
      glowOpacity: s = 0.22,
      pattern: o,
      title: l,
      description: u,
      width: h,
      height: g,
      radius: f,
      titleSize: m,
      descriptionSize: y,
      titleWeight: v,
      descriptionWeight: x,
      dotSize: b,
      dotScale: w,
      ringStrokeScale: M,
      highlightX: k,
      highlightY: S,
      effectScale: j,
      animation: C,
      particles: A,
      tilt: R,
      shimmer: D,
      staticOpacity: P = 1,
      onCardHover: T,
      onCardLeave: O,
    }) {
      let $ = Math.round(0.118 * h),
        L = 1.45 * h,
        E = Math.round(1.05 * m + 1.25 * y * 2 + 0.018 * g),
        F = Math.max(0, g - 2 * $ - b - E),
        I = (0, a.useRef)(null),
        [N, _] = (0, a.useState)(null),
        z = (e) => {
          let t = I.current;
          if (!t) return;
          let a = t.getBoundingClientRect();
          _({
            x: (e.clientX - a.left - $) / j,
            y: (e.clientY - a.top - $) / j,
          });
        },
        B = {
          maxAngle: R.maxAngle,
          randomness: R.randomness,
          scaleMax: R.scaleMax,
          scaleRadius: R.scaleRadius,
          packIterations: R.packIterations,
          easing: R.easing,
          keepInGrid: R.keepInGrid,
          pushSmoothingMs: R.pushSmoothingMs,
          scaleSmoothingMs: R.scaleSmoothingMs,
        },
        H = null !== N,
        U = b * j,
        W = (h - U) / 2 - $,
        G = (g - U) / 2 - $ + R.centerOffsetY,
        q = {
          dx: H ? W / j : 0,
          dy: H ? G / j : 0,
          durationMs: R.centerDurationMs,
          staggerMs: R.centerStaggerMs,
        };
      return (0, t.jsxs)("div", {
        ref: I,
        className: "relative shrink-0 overflow-hidden",
        style: { width: h, height: g, backgroundColor: e, borderRadius: f },
        onPointerEnter: (e) => {
          z(e), T?.();
        },
        onPointerMove: z,
        onPointerLeave: () => {
          _(null), O?.();
        },
        children: [
          (0, t.jsx)("div", {
            className: "absolute pointer-events-none",
            style: {
              left: k * h - L / 2,
              top: S * g - L / 2,
              width: L,
              height: L,
              background: `radial-gradient(circle at center, ${n} 0%, ${n} 18%, transparent 65%)`,
              opacity: s,
              filter: "blur(8px)",
            },
          }),
          (0, t.jsx)("div", {
            className: "absolute pointer-events-none",
            style: {
              top: $,
              left: $,
              transform: `scale(${j})`,
              transformOrigin: "top left",
              perspective: `${R.perspective}px`,
            },
            children: (0, t.jsx)(c, {
              variant: o,
              color: i,
              size: b,
              dotScale: w,
              ringStrokeScale: M,
              fallHeight: F / j,
              animation: C,
              particles: A,
              cursor: N,
              tilt: B,
              centerMove: q,
              staticOpacity: P,
              staticFadeMs: R.centerDurationMs,
            }),
          }),
          (0, t.jsxs)("div", {
            className: "absolute flex flex-col",
            style: {
              left: $,
              right: $,
              bottom: $,
              color: r,
              gap: Math.round(0.018 * g),
              fontFamily:
                "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
            },
            children: [
              (0, t.jsx)("div", {
                style: {
                  fontSize: m,
                  fontWeight: v,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                },
                children: l,
              }),
              (0, t.jsx)("div", {
                style: {
                  fontSize: y,
                  fontWeight: x,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.25,
                  opacity: 0.7,
                },
                children: u,
              }),
            ],
          }),
          (0, t.jsx)(d, { active: null !== N, borderRadius: f, params: D }),
        ],
      });
    }
    let u = [
      {
        bg: "#0a0a0a",
        fg: "#fefefe",
        dotColor: "#fefefe",
        glowColor: "#ffffff",
        glowOpacity: 0.12,
        pattern: "a",
        title: "Instant",
        description: "Every action lands in under a second, no spinners",
      },
      {
        bg: "#ff6e00",
        fg: "#fefefe",
        dotColor: "#fefefe",
        glowColor: "#ffb066",
        glowOpacity: 0.55,
        pattern: "b",
        title: "Adaptive",
        description: "The surface reshapes around the work in front of you",
      },
      {
        bg: "#ecebe9",
        fg: "#1f1f1f",
        dotColor: "#ff6e00",
        glowColor: "#ff6e00",
        glowOpacity: 0.18,
        pattern: "c",
        title: "Open",
        description: "Bring your own model, data, and tooling no lock-in",
      },
    ];
    e.s(
      [
        "default",
        0,
        function () {
          let e = (0, n.getExperiment)("pattern-cards"),
            s = (0, r.useDialKit)("Pattern Cards", {
              typography: {
                titleSize: [25, 12, 64, 1],
                titleWeight: [500, 100, 900, 100],
                descriptionSize: [16, 10, 48, 1],
                descriptionWeight: [300, 100, 900, 100],
              },
              highlight: {
                x: [0.65, -0.5, 1.5, 0.01],
                y: [0.85, -0.5, 1.5, 0.01],
              },
              card: { height: [414, 320, 1e3, 1] },
              effect: { scale: [0.66, 0.2, 3, 0.02] },
              animation: {
                speed: [0.16, 0, 3, 0.02],
                phaseSpread: [2.25, 0, 4, 0.05],
                easing: [3, 0.5, 8, 0.1],
                fillBias: [-0.34, -1, 1, 0.02],
              },
              particles: {
                spawnRate: [0.6, 0, 8, 0.05],
                fallSpeed: [47, 5, 300, 1],
                jitter: [0.16, 0, 1, 0.02],
                lifetime: [1.7, 0.5, 12, 0.1],
                fadeStart: [0, 0, 1, 0.02],
                startOpacity: [0.28, 0, 1, 0.02],
              },
              patternA: {
                size: [127, 40, 280, 1],
                dotScale: [0.86, 0.1, 1, 0.02],
                ringStrokeScale: [0.06, 0.02, 0.5, 0.01],
              },
              patternB: {
                size: [127, 40, 280, 1],
                dotScale: [0.86, 0.1, 1, 0.02],
                ringStrokeScale: [0.06, 0.02, 0.5, 0.01],
              },
              patternC: {
                size: [127, 40, 280, 1],
                dotScale: [0.86, 0.1, 1, 0.02],
                ringStrokeScale: [0.06, 0.02, 0.5, 0.01],
              },
              tilt: {
                maxAngle: [0, 0, 120, 1],
                randomness: [0.56, 0, 1, 0.02],
                perspective: [520, 100, 2400, 10],
                scaleMax: [3.8, 1, 5, 0.05],
                scaleRadius: [161, 4, 400, 1],
                packIterations: [40, 0, 80, 1],
                easing: [1.6, 0.3, 5, 0.05],
                centerDurationMs: [420, 80, 1500, 10],
                centerStaggerMs: [320, 0, 2e3, 10],
                centerOffsetY: [-43, -300, 300, 1],
                keepInGrid: !1,
                pushSmoothingMs: [260, 10, 2e3, 10],
                scaleSmoothingMs: [220, 10, 2e3, 10],
                fadeOthers: !0,
                othersOpacity: [0.12, 0, 1, 0.02],
              },
              shimmer: {
                enabled: !0,
                intensity: [0.2, 0, 1, 0.02],
                widthPct: [162, 10, 300, 1],
                angleDeg: [38, -60, 60, 1],
                blurPx: [60, 0, 120, 0.5],
                durationMs: [320, 100, 6e3, 10],
                loopDelayMs: [8e3, 0, 12e3, 10],
                color: { type: "color", default: "#ffffff" },
                blendMode: {
                  type: "select",
                  options: [
                    "overlay",
                    "screen",
                    "soft-light",
                    "plus-lighter",
                    "lighten",
                    "color-dodge",
                    "normal",
                  ],
                  default: "screen",
                },
              },
            }),
            [o, l] = (0, a.useState)(null),
            c = (0, a.useRef)(null),
            d = (0, a.useRef)(null);
          (0, a.useEffect)(
            () => () => {
              null !== d.current && clearTimeout(d.current);
            },
            [],
          );
          let h = (0, a.useCallback)((e) => {
              null !== d.current &&
                (clearTimeout(d.current), (d.current = null)),
                (c.current = e),
                l(e);
            }, []),
            g = (0, a.useCallback)((e) => {
              c.current !== e ||
                (null === d.current &&
                  (d.current = window.setTimeout(() => {
                    c.current === e && ((c.current = null), l(null)),
                      (d.current = null);
                  }, 60)));
            }, []),
            f = { a: s.patternA, b: s.patternB, c: s.patternC };
          return (0, t.jsxs)(i.ExperimentLayout, {
            title: "Pattern Cards",
            experimentSlug: "pattern-cards",
            applications: e?.applications,
            children: [
              (0, t.jsx)("div", {
                className: "absolute inset-0",
                style: { backgroundColor: "#e0dfdd" },
              }),
              (0, t.jsx)("div", {
                className:
                  "absolute inset-0 overflow-auto flex items-center justify-center p-8 text-lg",
                children: (0, t.jsx)("div", {
                  className: "flex items-center",
                  style: { gap: 21 },
                  children: u.map((e, a) => {
                    let r = f[e.pattern],
                      i =
                        s.tilt.fadeOthers && null !== o && o !== a
                          ? s.tilt.othersOpacity
                          : 1;
                    return (0, t.jsx)(
                      p,
                      {
                        ...e,
                        width: 324,
                        height: s.card.height,
                        radius: 44.875,
                        titleSize: s.typography.titleSize,
                        titleWeight: s.typography.titleWeight,
                        descriptionSize: s.typography.descriptionSize,
                        descriptionWeight: s.typography.descriptionWeight,
                        dotSize: r.size,
                        dotScale: r.dotScale,
                        ringStrokeScale: r.ringStrokeScale,
                        highlightX: s.highlight.x,
                        highlightY: s.highlight.y,
                        effectScale: s.effect.scale,
                        animation: s.animation,
                        particles: s.particles,
                        tilt: s.tilt,
                        shimmer: s.shimmer,
                        staticOpacity: i,
                        onCardHover: () => h(a),
                        onCardLeave: () => g(a),
                      },
                      a,
                    );
                  }),
                }),
              }),
              (0, t.jsx)(r.DialRoot, { position: "top-right" }),
            ],
          });
        },
      ],
      27442,
    );
  },
]);
