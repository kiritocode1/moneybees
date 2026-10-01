# Page transitions: Tres Mares and Titan Gate

Studied 2026-09-30/10-01 with Agent Browser (session `transitions`) at 1440x900 and 390x844.
Every value below is marked "read" (quoted from a pinned source file and line) or "measured"
(per-frame sampler or video frames). Line numbers refer to the prettified copies in `source/`.

## Files

| Path | What |
| --- | --- |
| `source/tresmares/app.min.js`, `app.pretty.js` | Tres Mares theme bundle (transitions, renderer, components) |
| `source/tresmares/vendor.min.js`, `vendor.pretty.js` | Taxi.js core, Lenis 1.3.15, GSAP 3.14.2, three.js |
| `source/tresmares/style.css`, `style.pretty.css`, `home.html` | Theme CSS and home markup |
| `source/titangate/app.js`, `app.pretty.js` | Titan Gate custom bundle (loader, Lenis, GSAP 3.13 + ScrambleText) |
| `source/titangate/main.css`, `main.pretty.css`, `home.html`, `login.html` | Entrance CSS; inline loader CSS is in `home.html` lines 2-18 |
| `source/titangate/webflow*.js`, `webflow.shared*.css`, `kujira-main*.js` | Webflow runtime and shared CSS (no transition logic found) |
| `source/sampler-tresmares.js` | rAF sampler used for the measured timings (transform, opacity, position per frame) |
| `source/contact_sheet.py` | Builds the labelled contact sheets from the videos |
| `video/*.webm` | Raw recordings (30 or 60 fps) |
| `frames/*.png` | Contact sheets (time label = video time) and full-size key frames |

---

## 1. Tres Mares (tresmarescapital.com/en/)

### Mechanism

Client-side router: **Taxi.js** (`@unseenco/taxi`) with `removeOldContent: false`, a GSAP-driven
desktop transition class, a fade transition for widths up to 1100px, and **Lenis** smooth scroll
proxied into ScrollTrigger. Markup: `<div id="app" data-taxi>` wraps one
`<div data-taxi-view="default" data-taxi-nocache data-taxi-slug="...">` per page (`home.html`).
The site header lives inside each page's view, so it travels with its page.

Config, read from `app.pretty.js:23160-23170`:

```js
this.taxi = new v.iJ({
  links: "a:not([target]):not([href^=\\#]):not([data-taxi-ignore]):not([data-offcanvas])",
  removeOldContent: !1,
  renderers: { default: Kc },
  transitions: { default: this.appStore.isDesktop ? dp : rp },   // isDesktop = innerWidth > 1100, decided once at init (23142)
})
```

Navigation flow (Taxi core, `vendor.pretty.js:5245-5350`):

1. Click on a matching link: `navigateTo`. If a transition is running it rejects with
   "A transition is currently in progress" (`allowInterruption` default false, 5247).
2. Fetch starts. `data-taxi-nocache` sets `skipCache` (5500), so every navigation refetches, even
   after the hover prefetch (`onPrefetch` on mouseenter/focus, 5434).
3. `beforeFetch`: emit `NAVIGATE_OUT`, old renderer `onLeave`, transition `onLeave`. After it
   resolves: old renderer `onLeaveCompleted` (kills every ScrollTrigger, `app.pretty.js:8553`),
   then `history.pushState` (5306-5320). The URL changes here, before the new page exists.
4. Wait for the fetch. `afterFetch`: `renderer.update()` appends the new view after the old one
   inside `#app` (5114), emit `NAVIGATE_IN`, new renderer `onEnter` (builds components, SplitText,
   hero entrance tweens), then transition `onEnter`, then renderer `onEnterCompleted` (component
   `init()`), then `NAVIGATE_END` (5322-5350).
5. Back and forward: `popstate` calls the same `navigateTo(..., "popstate")` (5416), so the back
   button plays the same forward slide. Scroll is never restored; `history.scrollRestoration =
   "manual"` (23200) and every enter scrolls to 0.

### Desktop timeline (width > 1100px), class `fp`, `app.pretty.js:22876-22978`

```js
onLeave({ from, done }) {
  this.appCore.superScroller && this.appCore.scrollDisable();     // Lenis.stop()
  document.documentElement.classList.add("loading");               // pointer-events:none, cursor:progress
  this.from = from; done();
}
onEnter({ to, done }) {
  gsap.set(this.to, { y: "100vh", scale: 0.8, position: "fixed", top: 0 });
  done(); ScrollTrigger.refresh();
  gsap.to(this.from, { y: "-50vh", opacity: 0.8, duration: 1.4, ease: "expo.inOut" });
  gsap.to(this.to,   { y: "0vh", scale: 1, duration: 1.4, ease: "expo.inOut", clearProps: "all",
                       onUpdate() { ScrollTrigger.refresh(); } });
  gsap.delayedCall(1.4, () => {
    to.parentNode.firstElementChild.remove();                      // old view
    window.scrollTo(0, 0); document.documentElement.scrollTop = 0;
    document.documentElement.classList.remove("loading");
    lenis.scrollTo(0, { immediate: true, lock: true, force: true });
    this.appCore.scrollEnable();                                   // Lenis.start() + ScrollTrigger.refresh()
  });
}
```

| # | Stage | Element | Property from to | Duration | Delay | Easing | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Click | html | adds `loading`, Lenis stopped (`lenis-stopped`: height 100vh, overflow hidden) | instant | 0 | none | read `app.pretty.js:22911-22920`, CSS `style.pretty.css:18585-18606` |
| 1 | Dead time | old page | holds still while the page refetches and the new renderer builds | 166-620 ms measured | | | measured (prefetched: 166 ms; back button: about 800 ms) |
| 2 | Swap in | new view | set `position:fixed; top:0; translateY(100vh) scale(0.8)` (transform-origin: centre of the full-height element) | instant | | | read `22933-22938`; measured start top 1709px for an 8111px page, width 1152px |
| 3 | Old leaves | old view (in flow, at its scroll offset) | `translateY 0 to -50vh` (-450px), `opacity 1 to 0.8` over `#app` black | 1.4 s | 0 | `expo.inOut` | read `22942-22947`; measured -449.99px, 0.8 |
| 4 | New enters | new view | `translateY 100vh to 0`, `scale 0.8 to 1`, then `clearProps: all` | 1.4 s | 0, same start as 3 | `expo.inOut` | read `22948-22956`; measured fit error 0.0001 |
| 5 | Cleanup | old view, scroll, Lenis | old removed, scroll 0, `loading` removed, Lenis restarted | instant | 1.4 s | | read `22958-22974`; measured 1.42 s after tween start |
| 6 | Body class | body | `class` copied from the fetched page; cursor reset | instant | at `NAVIGATE_END` | | read `app.pretty.js:23301-23320` |

Backdrop: `#app { background-color: #000 }`, each page `#app > div { background-color: var(--bg) }`
(white) (`style.pretty.css:18688-18707`). The old page at opacity 0.8 reads as a grey dim of the page.
The new page paints above the old one because it is later in the DOM. No overlay, curtain, clip-path
or logo is involved.

Easing detail. GSAP 3.14 `expo.in` is `2^(10(t-1))*t + t^6*(1-t)` (read `vendor.pretty.js:36338-36342`),
and `inOut` is `t<0.5 ? in(2t)/2 : 1-in(2(1-t))/2` (`36217-36225`). The first 30% of the 1.4 s moves
under 3% and the last 30% under 3%, so the visible slide is about 0.55 s in the middle. The sampler
data fits this curve with the tween starting 166 ms after the click (max squared error 0.0001 over 39
frames, `/tmp` data summarised in the table above).

Frames: `frames/tm-desktop-home-to-portfolio-sheet.png` (cleanest), `frames/tm-desktop-home-to-portfolio-2.20.png`
to `-2.50.png` (full size), `frames/tm-desktop-solutions-to-team-sheet.png`,
`frames/tm-desktop-about-to-solutions-sheet.png` (the header dropdown was open in that take).
Videos: `video/tm-desktop-home-to-portfolio.webm`, `tm-desktop-solutions-to-team.webm`,
`tm-desktop-about-to-solutions.webm`, `tm-desktop-back-team-to-solutions.webm`.

### Mobile timeline (width up to 1100px), class `np`, `app.pretty.js:22692-22777`

| # | Stage | Element | Property from to | Duration | Delay | Easing | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Click | Lenis | stopped, `headerLock = true` | instant | 0 | | read `22727-22735` |
| 1 | Old fades | `#app` (the wrapper) | `opacity 1 to 0`, then old view removed | 0.4 s | 0 | GSAP default `power1.out` | read `22736-22744`; measured 0.4 s, curve matches power1.out |
| 2 | Blank | body shows white | fetch and build | about 450 ms measured | | | measured |
| 3 | New fades | `#app` | scroll to 0, Lenis start, `opacity 0 to 1` | 0.4 s | after fetch | `power1.out` | read `22761-22773`; measured |

Frames: `frames/tm-mobile-team-to-portfolio-sheet.png`. Videos: `video/tm-mobile-*.webm`.
The mobile menu is part of the page header, so it disappears with the fade.

### First load

`#app` starts at `opacity: 0.0001` (CSS `style.pretty.css:18688`). `hideLoader` waits for preload and
WebGL, then `gsap.to(#app, { opacity: 1, duration: 0.4, ease: "power2.out" })` (read `app.pretty.js:412-440`).
There is no loader element in the live markup. The screencast attached after this fade, so the first
load is read from source only (`frames/tm-desktop-first-load-sheet.png` shows the hero settling).

### Entrance animations that run during the slide

The new renderer's `onEnter` calls every component `set()` before the transition starts, so these
overlap the 1.4 s slide. `appStore.firstNavigation` is true only on the first page load.

| Component | Element | Property | Duration | Delay (first load / later) | Easing | Source |
| --- | --- | --- | --- | --- | --- | --- |
| herofulltext | title lines (SplitText lines) | `x: 0 to 120px * lineIndex` (staircase) | 2.2 s | 0 / 0.4 s | `expo.out` / `expo.inOut` | read `app.pretty.js:16557-16585`; Lenis locked 3 s / 2.6 s |
| herosolutions | title lines | `x: 0 to 210px * lineIndex` (desktop) | 2.2 s | 0.8 s / 0.4 s | `expo.inOut` | read `16948-16970` |
| herorightmedia | clip, media | `clipPath to inset(0 0 0 0)`; media `opacity 1, x 0%, grayscale(0)` | 1.2 s; 1.4 s | 0; 0.4 s | `expo.out` | read `16747-16770`; Lenis locked 1.8 s |
| any `.wysiwyg` | words | `y 100% to 0`, `clipPath inset(0 0 100% 0) to inset(0)`, stagger 0.01 | 1 s | on enter | `expo.out` | read `8142-8188` |
| `.title.--fill` | chars or words | `opacity 0.05 to 1`, stagger 0.02 (chars) or 0.1 (words); scrubbed below the fold | 0.2 s each | 0.2 s if in view | `none` | read `8070-8140` |
| `.--magnet` cards | card | `y 60px, scale 0.96, opacity 0 to y 0, scale 1, opacity 1` | 1.2 s | `0.00025 * left px` | `expo.out` | read `8028-8068` |

### Other behaviour

- Fast double click: the second click is refused ("A transition is currently in progress", measured in
  console), and `html.loading` sets `pointer-events: none` for the whole transition.
- Back button: same forward slide, measured on `tm-desktop-back-team-to-solutions.webm`; about 800 ms
  of dead time because of the refetch.
- Hover prefetch is wasted by `data-taxi-nocache`, which causes most of the dead time.
- After navigating to Financial Solutions, `lenis-stopped` stayed on `html` (a hero component locks
  scroll until its entrance ends). Harmless, but it shows the scroll lock is per component.
- Links with `data-offcanvas` (team bios and similar) skip Taxi: the page is fetched into a right drawer
  that slides `x 100% to 0%` over 0.8 s `expo.out`, mask `opacity to 1` 0.8 s `expo.out`, closer fades in
  at 0.8 s; `pushState` with `{popup:true}`, back closes it (read `app.pretty.js:7660-7890`).
- Reduced motion: no handling anywhere in the JS (0 matches for `prefers-reduced-motion`); the only CSS
  rule is Font Awesome's.

---

## 2. Titan Gate (titangatequity.com)

### Mechanism

No client router. It is a Webflow site with two real pages, `/` and `/login` (sitemap returns 404),
plus in-page anchors (`#vision`, `#opportunities`, `#pioneers`, `#manifesto`). Every page change is a
**full document load**. The "transition" is a black full-screen loader that is part of each page's
HTML, so the new document's first paint is already black, followed by a CSS and ScrambleText entrance.
No Barba, Swup, Taxi, Highway, `startViewTransition` or `pushState` in any bundle (grep of all files
in `source/titangate/`).

Boot, read from `app.pretty.js:14203-14214`:

```js
window.addEventListener("load", () => {
  ScrollTrigger.clearScrollMemory("manual");
  history.scrollRestoration && (history.scrollRestoration = "manual");
  id();          // new Lenis({ lerp: 0.18, autoRaf: true, anchors: { offset: 100 } }).scrollTo(0, { immediate, force })
  lenis.stop();
  document.fonts.ready.then(() => { html.classList.add("fonts-loaded"); Kh(); od(); });
});
```

Loader CSS, inline in `home.html:2-18`: `.loader { position: fixed; inset: 0; z-index: 9999;
background-color: #000; display: grid }` and `html.fonts-loaded.is-ready .loader { opacity: 0;
visibility: hidden; pointer-events: none }` with no transition, so the loader cuts out.
`html:not(.is-ready.fonts-loaded) { cursor: wait; pointer-events: none }` (`main.pretty.css:193`).

### Timeline, `Kh()` in `app.pretty.js:12714-12855`

`sessionStorage["tge.quickpreload"]` picks the mode; it is set after the first run in a tab session.
The timeline has `defaults: { ease: "none" }`. The logo SVG has 9 paths.

| # | Stage | Element | Property from to | Duration | Delay / position | Easing | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Click | old page | browser keeps the old page painted until the new document paints | about 0.5 s | | | measured `tg-desktop-login-to-home-sheet.png` 0.7 to 1.3 s |
| 1 | First paint | `.loader` | black screen, `TGE` logo visible, texts at opacity 0 | holds until `load` + `document.fonts.ready` | | | measured: `loadEventEnd` 1750 ms after navigation start |
| 2q | Quick mode (every visit after the first) | logo paths | `opacity 1 to 0`, stagger 0.05 s `from: "random"`; adds `.is-finished` on start | 0.1 s each, 0.7 s total | 0.2 s | none | read `12725-12739` |
| 2f | Full mode (first visit), texts in | 6 `[data-loader-item]` | ScrambleText in, chars `QWERTZUIOPASDFGHJKLYXCVBNM`, speed 0.8 | 0.64 s | item 1 at 0; others at `0.108 * (i + 1)` | none | read `12741-12756` |
| 2f | | `[data-loader-svg]` | `opacity 0 to 1` | 0.15 s | 0.55 s | none | read `12740` |
| 2f | Hold | | empty tween | 1.25 s | after texts (1.29 s) | | read `12757` |
| 2f | Texts out | items; svg | scramble to `" "` (0.56 s); svg `opacity 0` (0.1 s), `.is-finished` | 0.56 s | 2.54 s | none | read `12758-12780` |
| 2f | Logo out | 9 logo paths | `opacity 0`, stagger 0.05 random | 0.1 s each | 0.4 s after texts out start (2.94 s) | none | read `12781-12784`; full timeline ends about 3.44 s |
| 3 | Ready | html | next rAF: `lenis.start()`, add `is-ready`; loader hides with no transition | instant | end of timeline | | read `12785-12788`, `home.html:14-18` |
| 4 | Hero title | `[data-hero-title] .split-word` | `color-blink-in` keyframes: opacity 0 to 1 with a `#8898e7` flash | 0.41 s | `(word - 1) * 98ms` | `cubic-bezier(0.645,0.045,0.355,1)` | read `main.pretty.css:84-106, 363-366` |
| 5 | Subline | `.hero-subline .subheading` | `subline-move-in` flicker, plus JS ScrambleText (text as its own charset, speed 0.9, 1 s); hero video plays 25 ms after it starts | 1.2 s; 1 s | 0.35 s | `cubic-bezier(0.215,0.61,0.355,1)`; none | read `main.pretty.css:238-256`, `app.pretty.js:12826-12846` |
| 6 | Nav bar | `.nav-bar` | `nav-bar-move-in` flicker, background to `#ffffff1a` | 1.2 s | 0.55 s | ease-out-power2 | read `main.pretty.css:258-291` (reduced-motion variant 294) |
| 7 | Nav links (>= 768px) | `[data-load-nav-link]` | ScrambleText (own chars, speed 1) | 1 s | 0.65 s + 0.08 s * i | none | read `app.pretty.js:12794-12822` |
| 8 | Nav wrapper, heading width | `.nav-wrapper`, `.heading-width` | `opacity 0 to 1` | 0.225 s | 0.8 s | ease-out | read `main.pretty.css:335-344` |

Measured on `video/tg-desktop-login-to-home.webm` (quick mode, desktop): old page until 1.2 s, black at
1.3 s, logo 1.5 to 2.9 s (waiting for `load`), paths blink out 3.1 to 3.3 s, title words 3.5 to 4.1 s,
video and nav 4.1 to 5.1 s. Full mode: `frames/tg-desktop-first-visit-sheet.png` (black 1.2 to 6.3 s).
Mobile: `frames/tg-mobile-login-to-home-sheet.png` and the full-size `tg-mobile-login-to-home-2.40.png`
and `-2.65.png` show paths disappearing one at a time.

### Other behaviour

- Back button: Chrome restored the previous page from the back/forward cache (performance.now() kept
  counting from the original load), so back is an instant cut with no loader
  (`frames/tg-mobile-back-sheet.png`).
- Anchors: links containing `/#` call `lenis.scrollTo("#id")` (lerp 0.18) after `preventDefault`
  (`app.pretty.js:13339-13349`). Measured: reaches the target in about 0.65 s, then jumps back about
  2500px at 0.9 s and scrolls again for 1 s. Reproduced twice; a bug, not a design choice.
- Fast double click: no guard; the browser simply follows the last navigation.
- Reduced motion: CSS removes the hero, subline and nav keyframes and swaps them for 0.2 s opacity
  fades (`main.pretty.css` `prefers-reduced-motion: reduce` blocks). The loader timeline itself has no
  check and still plays in full.
- Both pages are near-black, so the cut from the black loader to the page is invisible. On a white site
  the same cut would read as a flash.

---

## 3. Rebuilding it in Next.js App Router

Target: the Tres Mares desktop slide, because it is the actual page-to-page transition. Titan Gate
has no transition between pages; only its first-visit loader is reusable (section 3.4).

Our stack, checked in the repo: Next 16.2.12, React 19.2.4, gsap 3.15.0, motion 12.43.0, no Lenis.
Every page wraps its content in `<SiteNavigation>` (`app/page.tsx`, `app/*/page.tsx`), so our nav is
inside the page, the same as Tres Mares. That means a whole-page transition moves the nav with its
page, which is what the reference does.

Docs checked with ctx7 (`/vercel/next.js/v16.2.9`, `docs/01-app/02-guides/view-transitions.mdx`,
`link.mdx`, `use-router.mdx`) and confirmed in `node_modules`: `experimental.viewTransition`
(`next/dist/server/config-shared.js`), `ViewTransition` export in Next's compiled React,
`<Link onNavigate>` and `transitionTypes` (`next/dist/client/app-dir/link.js`). Next 16.2.12 runs
back/forward inside `startTransition` (`next/dist/client/components/app-router.js:284-298`), so a
React view transition should also run on the back button, like Tres Mares.

### 3.1 Values to reuse, in our colours

| Token | Value | Why |
| --- | --- | --- |
| duration | 1400ms | read `fp` |
| easing | GSAP `expo.inOut`; in CSS the `linear()` below (53 stops, max error 0.0015) | read `vendor.pretty.js:36338` |
| old page | `translateY(-50vh)`, `opacity 0.8` over black, equivalent to `filter: brightness(0.8)` | read `fp` |
| new page | from `translateY(100vh) scale(0.8)` to none | read `fp` |
| backdrop | `#000` (Moneybee black) | Tres Mares `#app` is `#000` |
| mobile (<= 1100px) | old fade 400ms `power1.out`, new fade 400ms `power1.out`, white between | read `np` |
| input | `pointer-events: none` and `cursor: progress` on `html` for the whole run; ignore clicks while running | read `html.loading` |
| after swap | scroll to 0; hero entrances start 0.4s into the slide, 2.2s `expo.inOut` | read herofulltext |

Orange `#F6A11A` and grey `#9D9EA1` do not appear in the reference transition. Keep black so the dim
matches; orange would be a new design choice.

```css
--ease-expo-in-out: linear(0 0%, 0.0001 5%, 0.0004 10%, 0.0014 15%, 0.0044 20%, 0.0117 25%, 0.0281 30%,
  0.033 31%, 0.0388 32%, 0.0453 33%, 0.0528 34%, 0.0614 35%, 0.0712 36%, 0.0824 37%, 0.0951 38%,
  0.1097 39%, 0.1262 40%, 0.1451 41%, 0.1667 42%, 0.1913 43%, 0.2194 44%, 0.2516 45%, 0.2885 46%,
  0.3308 47%, 0.3794 48%, 0.4354 49%, 0.5 50%, 0.5646 51%, 0.6206 52%, 0.6692 53%, 0.7115 54%,
  0.7484 55%, 0.7806 56%, 0.8087 57%, 0.8333 58%, 0.8549 59%, 0.8738 60%, 0.8903 61%, 0.9049 62%,
  0.9176 63%, 0.9288 64%, 0.9386 65%, 0.9472 66%, 0.9547 67%, 0.9612 68%, 0.967 69%, 0.9719 70%,
  0.9883 75%, 0.9956 80%, 0.9986 85%, 0.9996 90%, 0.9999 95%, 1 100%);
```

Do not substitute `cubic-bezier(1, 0, 0, 1)` or `cubic-bezier(0.87, 0, 0.13, 1)`; both differ from
GSAP 3.14's expo curve, which has the extra `t^6(1-t)` term.

### 3.2 Recommended: React `<ViewTransition>` in `app/template.tsx`

A view transition snapshots the old page as an image, lets React commit the new route, and animates
both images. That matches this effect well: two whole-page transforms, no shared elements. Next's
`<Link>` prefetch removes most of the dead time that Tres Mares has.

```ts
// next.config.ts
const nextConfig: NextConfig = { experimental: { viewTransition: true }, /* existing keys */ };
```

```tsx
// app/template.tsx  (templates remount on every navigation, so the boundary exits and enters)
import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="mb-page-in" exit="mb-page-out" default="none">
      {children}
    </ViewTransition>
  );
}
```

```css
/* globals.css */
::view-transition { background: #000; }                         /* the #app backdrop */
::view-transition-group(.mb-page-out) { z-index: 1; }
::view-transition-group(.mb-page-in)  { z-index: 2; }          /* new page above old, like DOM order */
::view-transition-old(.mb-page-out) {
  animation: mb-page-out 1400ms var(--ease-expo-in-out) both;
}
::view-transition-new(.mb-page-in) {
  transform-origin: 50% 50%;
  animation: mb-page-in 1400ms var(--ease-expo-in-out) both;
}
@keyframes mb-page-out { to { transform: translateY(-50vh); opacity: 0.8; } }
@keyframes mb-page-in  { from { transform: translateY(100vh) scale(0.8); } }

@media (max-width: 1100px) {   /* Tres Mares mobile: fade out, white, fade in */
  ::view-transition { background: #fff; }
  ::view-transition-old(.mb-page-out) { animation: mb-fade-out 400ms cubic-bezier(0.25,0.46,0.45,0.94) both; }
  ::view-transition-new(.mb-page-in)  { animation: mb-fade-in 400ms cubic-bezier(0.25,0.46,0.45,0.94) 400ms both; }
}
@keyframes mb-fade-out { to { opacity: 0; } }
@keyframes mb-fade-in  { from { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) {
    animation-duration: 0s !important; animation-delay: 0s !important;
  }
}
```

`cubic-bezier(0.25,0.46,0.45,0.94)` is the standard CSS equivalent of `power1.out` (Titan Gate uses it
as `--ease-out-power1`, `main.pretty.css:36`).

Trade-offs:
- Snapshots are flat images for 1.4s: the three.js fly-through, videos and running tweens freeze in
  the old image. Tres Mares keeps the old page live, but it has stopped Lenis and killed every
  ScrollTrigger by then, so the visible difference is small.
- Browsers without same-document view transitions get an instant swap. That is a safe fallback.
- `experimental.viewTransition` is still flagged in Next 16.
- The new snapshot is viewport-sized, so it starts at 990px (`100vh + 10% of 100vh`). Tres Mares scales
  the full-height page around its centre, so there the start is `100vh + 10% of page height` (1709px
  for an 8111px page). The early frames differ slightly; the middle and end match.
- Early in the slide (progress under 0.17) a strip of black up to about 36px can show between the
  bottom of the old snapshot and the top of the new one, if the old capture is clipped to the viewport.

Verify in a spike before building on it: that `::view-transition` accepts a background, that the group
`z-index` rules order the pages, that Next's scroll-to-top lands before the new snapshot, how tall the
captured old page image is, and that the back button animates. Record the result with the same
navigations used here and diff against `video/tm-desktop-home-to-portfolio.webm`.

### 3.3 Alternative for exact parity: GSAP with a frozen copy of the old page

Use this if the spike fails, or if the old page must stay live (video playing, no black strip).

1. `components/motion/page-transition-provider.tsx` ("use client"), mounted once in `app/layout.tsx`
   around `{children}` inside a wrapper with `background: #000`.
2. Intercept internal clicks in one capture-phase `click` listener on `document` (same origin, no
   modifier keys, no `target`, not hash-only), or per link with `<Link onNavigate={e => e.preventDefault()}>`.
   If a transition is running, ignore the click (Taxi behaviour). Add `data-transitioning` to `html`
   (`pointer-events: none; cursor: progress`).
3. Freeze the old page: `const old = page.cloneNode(true)`, strip `id` attributes, set
   `position: fixed; top: -scrollY px; left: 0; width: 100%; z-index: 1; pointer-events: none`,
   append it to the wrapper. Canvas elements clone blank; swap them for `toDataURL()` images if needed.
4. `router.push(href, { scroll: false })`. When `usePathname()` changes, the new page is mounted.
5. `gsap.set(newPage, { position: "fixed", top: 0, left: 0, width: "100%", y: "100vh", scale: 0.8, zIndex: 2 })`,
   `window.scrollTo(0, 0)`, then in one timeline:
   `to(old, { y: "-50vh", opacity: 0.8, duration: 1.4, ease: "expo.inOut" }, 0)` and
   `to(newPage, { y: 0, scale: 1, duration: 1.4, ease: "expo.inOut", clearProps: "all" }, 0)`;
   on complete remove `old`, remove `data-transitioning`, `ScrollTrigger.refresh()`.
6. Back button: register a `popstate` listener in the provider. Child effects run before the App
   Router's own effect, so this listener fires before Next swaps the tree; clone the old page there
   and play step 5 when the pathname changes.
7. `matchMedia("(prefers-reduced-motion: reduce)")`: skip the animation and navigate normally.
   Width up to 1100px: fade the wrapper to 0 over 0.4s (`power1.out`), push, fade back in over 0.4s.

Trade-offs: exact GSAP curve and live old content, works in every browser; costs about 150 lines, a
DOM clone per navigation, and care around ids, focus and the nav's open state.

### 3.4 Optional: Titan Gate style first-visit cover

For the first load only, a black `position: fixed` cover rendered in the root layout HTML, holding the
Moneybee mark as separate SVG paths. After `document.fonts.ready`, fade the paths out in random order
(`opacity 0`, 0.1s each, stagger 0.05s, `from: "random"`, 0.2s delay), then remove the cover with no
transition and start the hero entrance. Store a `sessionStorage` flag so later visits skip it. On our
white site the black-to-white cut will read as a flash, which Titan Gate hides by being black; either
make the cover white with a black mark, or fade it out over 0.2s. This is a new design choice, not
part of the Tres Mares transition.

### What stays unverified

- The view-transition details listed at the end of 3.2 (needs a spike in this repo).
- Tres Mares first-load timing was read from source; the screencast attached after the 0.4s fade.
- Titan Gate full-mode timing was read from source and matched to the video only roughly, because the
  scrambled loader text is too small for scene detection.
