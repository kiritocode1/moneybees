# titangatequity.com teardown

Captured 2026-09-30 from the live site (Webflow, last published 2026-01-03 per the HTML comment). Built by Somefolk.

Every value below says where it came from:

- **read: file** means the value was read from a pinned file in `source/`.
- **measured** means it was read from the live DOM with `getBoundingClientRect` or `getComputedStyle` at 1440×900 unless noted.
- **derived** means it was calculated from read values. The arithmetic is shown.

## 1. Page list

The site is one long page plus a login gate. The nav has no internal content pages. Its four links are in-page anchors.

| Page | URL | Height at 1440 | Height at 390 |
|---|---|---|---|
| Home | https://titangatequity.com/ | 16060px (measured) | 12702px (measured) |
| Home anchors | `#vision`, `#opportunities`, `#pioneers`, `#manifesto` | n/a | n/a |
| Login ("Titan's Gate") | https://titangatequity.com/login | 2243px: login viewport plus the shared white footer (measured) | not captured |

- `/sitemap.xml` returns the Webflow 404 page.
- `robots.txt` is empty.
- Every other `href` in both HTML files was checked. None leads to another page.

The practical result: titangate has no internal pages to copy. Its "internal page" craft has to be read from how it opens each section on the long page (§6.1). The login page is the only second template.

## 2. Pinned source (`source/`)

| File | What it is |
|---|---|
| `home.html`, `login.html` | Raw HTML. `*.pretty.html` are beautified copies. |
| `tge-staging.webflow.shared.1da2e5c14.css` | Webflow CSS: tokens, layout, type. `webflow.shared.pretty.css` is beautified. |
| `vercel-main.css` | Hand-written CSS from `titangate-equity.vercel.app/styles/main.css`: keyframes, eases, stats ring, benefits. `vercel-main.pretty.css` is beautified. |
| `vercel-app.js` | Custom bundle from `titangate-equity.vercel.app/scripts/app.js`. It contains GSAP 3.13.0, ScrollTrigger, SplitText, ScrambleText, DrawSVG, CustomEase, Draggable, Inertia, Observer, TextPlugin and Lenis 1.3.11. |
| `vercel-app.custom.pretty.js` | Only the site's own code, cut from the end of `vercel-app.js` and beautified (1327 lines). **This is the file to read for every motion value.** |
| `webflow.*.js` | Webflow runtime and IX2. The scroll-parallax data is extracted to `webflow-ix2-data.json`. |
| `site-rules.extracted.css` | Every Webflow CSS rule for a class that appears in either HTML file, flattened one per line with its `@media` context. |
| `unused-not-loaded/` | `lenis-0.2.26.js` and `kujira-gsap-main.js`. Their script tags are commented out. `performance.getEntriesByType("resource")` confirms they never load, and `window.gsap`, `window.Lenis` and `window.ScrollTrigger` are all `undefined` (measured). The inline `initTextAnimations` script in `home.html` is also dead: no `[split-text]` elements exist and `SplitText` is not global. |

Not pinned:

- **Videos.** These are Vimeo progressive MP4s, 1080p to 2160p, each over 5MB. IDs: hero 1125882576, intro 1125885537, protection 1125885446, industry 1125882288, letter and login 1125885665.
- **Images:** `drone-static-render-01.jpg` (2880w) and `slider-bg-drone.jpg`.
- **Fonts:** Fellix Regular and Medium (woff2), PP Supply Sans (ttf), Fellix TRIAL. The URLs are in the `@font-face` rules of the Webflow CSS.

## 3. Global systems

### 3.1 Stack and scroll

- Smooth scroll is Lenis 1.3.11, `new Lenis({ lerp: .18, autoRaf: true, anchors: { offset: 100 } })` (read: `vercel-app.custom.pretty.js` L444-451).
- Lenis is stopped until the loader finishes, then `start()` runs.
- `history.scrollRestoration = "manual"` and `ScrollTrigger.clearScrollMemory("manual")` are set, and the page always scrolls to 0 on load (L1171).
- Links containing `/#` are intercepted and sent to `lenis.scrollTo("#id")`.
- All scroll motion uses GSAP ScrollTrigger, except three parallax moves done with Webflow IX2 (§3.6).
- `html:not(.is-ready.fonts-loaded)` gets `cursor: wait; pointer-events: none` (read: `vercel-main.css`).
- There is no custom cursor and no pointer-following effect. `grep` finds no mousemove or pointermove handler. Hover is the only pointer input.
- A `--vw` custom property is set from `body.clientWidth * .01` on load and on resize, debounced 60ms (L126-130). It excludes the scrollbar and feeds `.divider-line` and the grid math.

### 3.2 Tokens (read: Webflow CSS `:root` and body media overrides)

| Token | ≥992 | ≤991 | ≤479 |
|---|---|---|---|
| spacing xs / base / s / m / l / xl | .8rem / 1.5rem / 3rem / 8rem / 14rem / 22rem | 10 / 15 / 40 / 80 / 100 / 160px | 10 / 15 / 20 / 40 / 80 / 120px |
| radius | .15rem (2.4px) | same | same |
| display | 7.6vw, lh .92, ls -.4vw | 7.6vw | 12vw |
| h1 | 6.8vw, lh .9, ls -.3vw | 10vw | 15vw |
| h3 | 5.2vw, lh 1, ls -.1rem | 5.2vw | 8vw |
| h4 | 3.8rem, lh .95, ls -.1rem | 3rem | 8vw |
| h5 | 2.5rem, lh 1.1, ls -.04rem | 2.5rem | 8vw |
| h6 | 1.4rem, lh 1.1 | 1.4rem | 18px |
| body-large | 2rem, lh 1.1, ls -.02rem | 2rem | 6vw |
| body-regular | 1.1rem, lh 1.4 | same | 15px |
| subheading (mono) | .9rem, lh 1, ls .2rem, uppercase | .9rem | 12px |
| micro-text (mono) | .6rem, lh 1.2, ls .08rem, uppercase | same | same |

- Root font-size stays the browser default 16px (measured: 3.8rem renders as 60.8px).
- Fonts are Fellix (sans, 400 and 500) for headings and body, and PP Supply Sans for every mono label. The loader and buttons also set `font-variant-numeric: tabular-nums`.

### 3.3 Colour (read)

| Use | Value |
|---|---|
| Page | `#000`, text `#fff` |
| Dim "micro" ink | `--colour--micro-black: #202020`, dark grey on black, nearly invisible until it flashes |
| Second-voice text (`.gradient-text`) | `linear-gradient(90deg, #898989, #494949)` clipped to text |
| Emphasis inside grey text (`.highlight`) | `background-color: #fff; background-clip: text`, so the word renders solid white. `.highlight.is-dark` uses black and is used on the white footer. |
| "Lightning" flash | `--lightning-color: #8898e7`, lavender. Every blink and flicker keyframe passes through it. |
| Dashed rules | `1px dashed #3f3f3f` |
| Frosted chips | `#ffffff1a` + `backdrop-filter: blur(40px)`. The dark variant is `#00000014`. |
| Footer | inverts to a white background with black text |

### 3.4 Grid (read)

- `.global-grid` has 12 equal columns with a gap of spacing-xs (.8rem). Section side padding is spacing-s (3rem, 48px at 1440).
- Below 992px it becomes 6 columns.
- `._12-columns` is the same 12 columns with zero gap, used for the micro-label rows.
- `._4-columns` is a flex row of four 25% columns.
- `main.css` also defines `--grid-margin` 1.5rem/2.5rem, `--grid-columns` 6/12 and `--grid-gutter` 1rem. These are unused by the Webflow markup.

### 3.5 Ease library (read: `vercel-main.css :root`)

It holds the full Penner set as CSS vars, for example `--ease-out-power2: cubic-bezier(.215,.61,.355,1)` and `--ease-in-out-power2: cubic-bezier(.645,.045,.355,1)`, plus several custom curves:

- `--ease-smooth: cubic-bezier(.32,.72,0,1)`
- `--ease-out: cubic-bezier(.37,.31,0,1)`
- `--ease-opacity: cubic-bezier(.4,0,.2,1)`

In GSAP, `CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1")` is used for the mobile slider.

**Gotcha found:** the code asks for `expoScale(10,2.5,power2.out)` and `expoScale(10,2.5,power1.inOut)`, but EasePack is not bundled. I tested GSAP 3.13.0 in node: `gsap.parseEase()` returns `undefined` for those strings, and a tween given one samples exactly like the default ease **power1.out** (0, .19, .438, .75, .938, .99, 1 at t = 0, .1, .25, .5, .75, .9, 1). What renders on the live site is therefore power1.out.

### 3.6 Scroll parallax (read: `webflow-ix2-data.json`)

Webflow IX2 "SCROLLING_IN_VIEW" continuous actions with smoothing 60 translate the child media on the Y axis across the parent's full pass through the viewport:

| Media | translateY from → to |
|---|---|
| intro video (`.full-video.is-intro`) | -5% → 5% |
| industry "robot" video | -8% → 10% |
| process drone image | -7% → 6% (the image is 108% tall inside an `overflow:hidden` 16:9 box) |

### 3.7 Shared text effects

These are the site's signature, and every one of them is text flicker rather than movement.

| Hook | Mechanism (read: `vercel-app.custom.pretty.js` and `vercel-main.css`) |
|---|---|
| `[data-hero-title]` | SplitText words, then the CSS `color-blink-in` animation. Opacity goes 0→1 and colour is lavender until 35%, then inherits by 70%, with a dip to .6 at 55%. Duration .41s, ease in-out-power2, word delay `(n-1)*98ms`, plays after `html.is-ready`. |
| `[data-text-fade-in]` | Used on headings. SplitText words and chars with `propIndex` sets `--char` and `--word`. A ScrollTrigger at `top 92.5%` adds `.is-inview`. Chars then run `text-fade-in` for .32s (lavender at 1%, opacity .2 at 15%, .8 at 30%, lavender and 1 at 40%, inherit at 70%) with delay `(char-1)*28ms + .125s`. The class is removed when scrolled back above, so it replays. With `data-text-move-left` or `-right` the whole line also moves on x from `+7.5rem` or `-7.5rem` to 0, `power2.out`, scrubbed `.2` from `top bottom` to `top 40%`. |
| `[data-micro-text]` | Used on the mono labels. SplitText words, or chars when `data-micro-text-chars` is set, then one GSAP keyframe tween: 0% `#fff` op .35, 30% `#8898e7`, 45% `#fff` op .35, 100% `#202020` op 1. Duration 1.2s, ease none, stagger .05 `from: "random"`, `repeat: -1` on the whole staggered set, play and pause by visibility. The effect: random words light up white or lavender, then sink back to dark grey, forever. |
| `[data-scramble-inview]` | ScrambleText to `{original}` over .9s with chars `0-9A-Z` once in view. |
| `[data-number]` | Used for the step numbers. On `top 90%` each item goes from yPercent 35 to 0 while ScrambleText rolls digits (.65s, revealDelay .25, stagger .075s). CSS `number-blink-in` .36s then settles the colour on `#141414`, near-black on black. Desktop only (≥992). |
| `[data-button]` hover | Every word's letters rotate right by one (last letter to front) every 46ms until each word has done a full cycle, then the text is restored. CSS adds `color-blink-in` .32s. The icon variant also flashes its chip background `#ffffff1a → #fff3 → #ffffff1a`. Hover only fires with `(hover: hover) and (pointer: fine)`. |
| `[data-swap]` | Used for "We redefine / reconstruct / reconfigure". Items are stacked in one grid cell. A GSAP loop runs power2.inOut .35s: outgoing item yPercent 0 → -100 with opacity to 0, incoming 100 → 0, a hold of 1.35s between swaps. The container width animates to the incoming word's width through `--width` with a CSS transition `.35s .05s ease-out-power2`. Items are masked with `linear-gradient(90deg, #ffffff80, #0003)` so the rotating word reads as ghosted. |

### 3.8 Line work

- **Dashed divider** (`.divider`): two `1px dashed #3f3f3f` lines, each `calc(var(--vw)*100)` wide, run a CSS `marquee` over 48s linear infinite with `mix-blend-mode: exclusion`. A light band sweeps across through `move-divider-bg` 2.25s. An `:after` overlay gradient `#101010 → #596870 → #000 → #454545` uses `mix-blend-mode: darken`.
- **Vertical guideline** (`.svg-guideline`): an SVG 1 unit wide and 408 or 240 units tall with a `stroke-dasharray="2 2"` path, coloured `#202020`, rotated 180°. Two CSS animations run on it:
  - `moving-stroke`, dashoffset 0 → 4px every .45s linear infinite, so the dashes crawl.
  - `move-bg`, a background gradient (transparent → 45%-alpha white → transparent) sized 200% and moved over 2.25s. Each instance has an inline `animation-delay` (.025s, .2s, .328s).

  Derived from the CSS: the light band moves up in element space, and the 180° rotation makes it travel down on screen. An `:after` fades the bottom 30% to black.
- **Barcode and glyph micro-SVGs** (`[data-svg-lines]`, `[data-svg-plus]`): every `<path>` runs the same keyframe flicker as the micro text (white .25 → lavender → dark `#202020`), stagger .05 random. `.graphic-3` characters also step up from `translate 0 60%` in 1.2s cycles.

## 4. Home, section by section (1440×900)

Screenshots are in `shots/`: `d-y<scrollY>.png` at 1440 and `m-y<scrollY>.png` at 390. Each was taken 1.2–1.6s after jumping to that scroll position so that trigger reveals had run. All top and height values are measured.

| # | Section (top, height) | Screenshot | Layout | Mechanism | Exact values |
|---|---|---|---|---|---|
| 0 | Loader (fixed, z 9999) | not shot (runs once, then quick) | Black. 12-column grid, 3rem padding. Five mono spans ("TitanGate Equity", "Initialising...", logo, "TGE \| TitanGate Equity 001 ▦ A New Class", "A New Class of Ownership"). | Each span is ScrambleText'd in with chars A–Z over .64s at `.108*(i+1)` offsets. It holds 1.25s, then scrambles out to " " over .56s. The logo paths fade out with a .05s random stagger, then the Lenis scroll starts and `html.is-ready` is added. `sessionStorage "tge.quickpreload"` skips straight to the fade on later loads. | Spans .6rem, ls .08rem (read, inline `<style>`) |
| 1 | Hero `.hero-section` (0, 905) | `d-y0.png` | Full-bleed muted autoplay video, 100.5vh. Nav row is a 3-column grid, absolutely positioned (not fixed), with the logo centred (16rem) and the "Titan's Gate" frosted icon button at the right. Centred stack: mono subline, h1 (max-width 40vw), frosted pill nav, and at the bottom a 26rem-wide two-tone h6 line. | Subline and pill links are ScrambleText'd from their own letters (1s, delay .35s and .65s, links .08s apart). The title uses word blink-in (§3.7). The pill runs `nav-bar-move-in` 1.2s: it flashes, and its background fades from transparent to `#ffffff1a` only in the last 25%. The `/` separators drop to opacity .15 after a 1.5s delay. The video starts .025s after the subline begins. | h1 97.92px / lh 88.13 / ls -4.32px (measured). Pill: mono 12px, ls 3.2px, padding .7rem 0, gap .8rem (measured and read). |
| 2 | Divider (905, 1) | `d-y905.png` top edge | Full-width dashed marquee | §3.8 | |
| 3 | Intro `#vision` (906, 1384) | `d-y905.png`, `d-y1500.png` | 12-column grid. Row 1 holds four micro items: graphic-1 (span 3), micro text (span 4), barcode graphic-2 (span 3), graphic-3 (span 2, right). Row 2: `.display` across 12 columns, white sentence plus a gradient-grey tail word ("…Opportunities. **Tokenized.**"), padding-top 8rem, bottom 22rem. Row 3: body-large, span 4, bottom-left. The video is absolutely placed at the bottom-right, 85% wide, 16:9, under a `radial-gradient(circle at 100% 100%, #0000 40%, #000)` vignette. | Micro flicker. Headline chars fade in with lavender. The video has IX2 parallax -5% → 5%. | Display 109.44px / lh 100.69 / ls -5.76px. Body-large 32/35.2, 439px wide (measured). |
| 4 | `_4-columns` (2289, 461) | `d-y2289.png` | Four columns at 25%, each topped by a 408px dashed vertical guideline and a mono label ("OUR VISION", "TITANGATE EQUITY", "@TITANGATE_EQUITY", then a 14rem paragraph) | Guidelines crawl with a travelling glint. Labels flicker per char, the paragraph per word. | Guideline 1px × 408 (measured) |
| 5 | Protection `#opportunities` (2750, 812) | `d-y2750.png` | Grid of 6 + 6 columns. Left: h3 "Unseen Possibilities." (max 42vw). Right column (padding-top 5vw, row gap 14rem) holds h3 + body-large, then the swap sentence + a small gradient paragraph with one white `.highlight` phrase. A video sits absolutely at the left, 64% wide, 3:2, under a radial vignette. | Word swap (§3.7) | h3 74.88px / ls -1.6px. Swap line 32px (measured). |
| 6 | Industry `#pioneers` (3562, 1943) | `d-y3300.png`, `d-y3900.png`, `d-y4600.png` | `section-intro`: dashed guideline (408) → centred h5 (30rem max) → mono gradient subheading that scrambles → guideline. Then a "ragged cascade" list: eight `heading-3.is-industry` lines on the 12-column grid with staggered starts (columns 2, 3, 1, 3, then a 6vw break, then 8, 8, 6, 5, all ending at column 13), zero row gap, over a full-width 16:9 robot video with a 25vh bottom fade. | The first four lines slide in from +7.5rem, the last four from -7.5rem, each scrubbed .2 from `top bottom` to `top 40%`, with char lavender fade-in on top. Video parallax -8% → 10%. | Lines 82.08px / lh 1 / ls -2.88px (5.7vw, -.2vw) (measured) |
| 7 | Logo marquee (5506, 301) | `d-y5300.png`, `d-y5600.png` | Cards 17vw × 10vw, 1vw margin. Each card is a 1px gradient frame: a parent `linear-gradient(240deg, #080808 9%, #313131 45%, #000)` with 1px padding and a black inner card, radius .15rem. | GSAP xPercent -100 linear loop. Duration = `speed(15) × collectionWidth / viewportWidth` (×.5 below 991, ×.25 below 479). The direction flips with scroll direction through `timeScale(±1)`. The whole track also moves x from -10vw to 10vw, scrubbed across the section's viewport pass. The collection is duplicated twice. | `data-marquee-speed=15`, `-scroll-speed=10`, `-direction=right` (read, HTML) |
| 8 | **Stats** "Access That Speaks for Itself" (5807, 1450) | `d-y5600.png`, `d-stats-y6100.png`, `d-stats-y6400.png`, `stats-ring-closeup.png`, `stats-circles-closeup.png`, `stats-reveal-storyboard.png`, `video/stats-reveal-1440.webm` | See §5 | See §5 | See §5 |
| 9 | Divider (7256) | | | | |
| 10 | Process (7257, 1943) | `d-y7257.png`, `d-y7900.png`, `d-y8500.png` | Centred 4.1vw paragraph: white lead sentence plus a gradient tail. Then a 90%-wide 16:9 image box (min 25rem) with top and bottom-left gradient overlays. The steps container overlaps it by -8rem and holds a centred h4, then four `icon-column`s (3 grid columns each). Each column: a big number cropped by a 7vw-tall `overflow-y: clip` mask sitting on a `1px dashed` short divider, a 2.5rem line icon, a body-large title (white), and a body-large gradient description. | Number scramble plus slide up (§3.7 `[data-number]`). Drone image parallax. | Numbers 172.8px (12vw), weight 500, ls -.3vw, colour `#202020` settling to `#141414`, so the numbers are ghosted. Mask 101px tall (measured). |
| 11 | Benefits (9200, 3481; hidden ≤991) | `d-y9200.png`, `d-y9900.png`, `d-y10700.png`, `d-y11500.png` | Two-column flex. **Left 50%**: a sticky frosted counter chip "01 / 04" (top 3rem), then four h4 titles ("Enforcement / vs Empty Promises": white line plus gradient line), with 45vh top padding, 65vh gaps and 65vh bottom padding. **Right 50%**: `position: sticky; top: 0; height: 100lvh` holding two stacked equal cards, "TGE" (logo) and "The Old World" (h5). Each card is black, 3rem padding, radius .15rem, and inside a `.benefits-box` whose `:after` draws four 25px L-shaped corner brackets (1px) with conic-gradients. All four texts per card are stacked in one grid cell. Behind everything a sticky 100lvh background image sits under a `linear-gradient(#000, #0000 25%)`. | **Counter:** per title, a scrubbed ScrollTrigger (`top bottom` → `center 50%`) moves the 1em-tall number column to `y: -index em`, so the digits roll. **Swap:** when a title crosses `center center`, the top card's texts toggle `.is-active` / `.is-exit`. Entering words run `color-blink-in` (.32s, 32ms per word + .125s), leaving words `fade-out` (.2s, 22ms). The bottom "old world" text uses a **redaction reveal**: every word span has `background-color: #000`, a black bar over the text. Entering runs `blink-in`: `#000 → #0006 → #000c → transparent` over .32s, 32ms per word + .1s. Leaving runs `color-fade-out` back to `#000` (.15s, 22ms). | Titles 60.8px. Cards 648×378. Counter chip 122×34, mono .75rem, ls .2rem, the "/ 04" at .15 opacity. Box `--border-stroke: .0625rem`, `--border-width: 1.5625rem` (read, measured). |
| 12 | Benefits mobile (≤991) | `m-y9174.png` | Centred slider with four slides, each with two cards and 4-corner bracket frames; prev/next buttons. | GSAP horizontal-loop helper. Clicking a slide, bullet or button runs `toIndex` with `osmo-ease` .725s. It starts at index 2. The inactive slides sit at opacity .45. **Autoplay never runs:** the code only reads the duration when `data-slider-autoplay === "false"`, and the attribute is `"true"` (read, L192). | |
| 13 | Letter `#manifesto` (12682, 2035) | `d-y12200.png`, `d-y12900.png`, `d-y13600.png`, `d-y14300.png` | Centred mono "typing" line: `ADMISSION >>> INTO _ TGE [25] IS _ NOT [?] REQUESTED` with a .5rem gap between items. 28rem below it, a centred 4vw paragraph (white lead plus gradient tail) across 12 columns. Then a letter column on grid columns 4–9 (666px): centred body-large gradient text with white `.highlight` phrases and the small TGE glyph as a section break. A video sits behind the top, 100vh tall. | `>>>` chars blink (`step-start` .65s, .2s apart). `_` blinks. "TGE" chars loop the lavender flicker, 0.15s stagger from the left. `[25]` scrambles digits in a loop every 1.6s. `[?]` scrambles symbols `*+-#)(%$&/_!?` in a loop. | Paragraph 57.6px. Letter text 32px. (measured) |
| 14 | Footer (14717, 1343) | `d-y14717.png`, `d-y15160.png` | **White.** A giant "TGE" SVG letterform, viewBox 1440×538, 100% wide. The T bar and the E bleed off the left and right edges and the tops are cropped slightly by `overflow: hidden`. Then a 12-column grid: "A Privilege." (black, columns 1–6) and "Beyond Reach." (gradient, columns 7–12) at 6vw; a 1.3rem gradient paragraph ending in a black `.highlight.is-dark` sentence; logo (black) and a dark frosted "Titan's Gate" chip; a legal row of three mono .6rem `#606060` items, 10rem padding-top. | Static. "A Privilege." char fade-in. | Headings 86.4px / ls -4.6px (6vw / -.32vw). Paragraph 20.8/29.1 (measured). |

### Phone (390×844), `shots/m-y*.png`

- Tokens switch to the ≤479 column (§3.2), the grid becomes 6 columns, and `.is-nm` elements (some micro labels) are hidden.
- The hero keeps the video. The anchor pill is hidden and a centred "Titan's Gate" chip replaces it.
- The industry cascade re-places its lines on 6 columns.
- Stats stack. The ring goes full width with the micro text above it. The two circles stack **vertically** (absolute, 90% size, top -17.5% and 27.5%) and animate on yPercent instead of xPercent. The number is 20vw.
- Benefits become the slider (row 12).

## 5. Spec: "Access That Speaks for Itself"

Section `.stats-section`: black, `padding-bottom: 14rem`, 1450px tall at 1440 (measured). Its markup is copied below from `source/home.html` with SVG paths intact.

### 5.1 Layout

1. **Micro row** (`._12-columns`, zero gap, padding 3rem 3rem 0):
   - Columns 1–4: "Initializing..." and "Access Denied", space-between.
   - Columns 5–8: barcode or "TGE | TITANGATE EQUITY 001 ▦ A NEW CLASS" graphic-1, centred.
   - Columns 10–12: "Initializing...".
   - All are mono .6rem `#202020` with per-char flicker (read).
2. **Section intro** (`.section-intro`, flex column centred, padding-top 1.5rem): a dashed vertical guideline 1×240, then the h4 "Access That Speaks for Itself", then a second guideline 1×240.
   - h4: 3.8rem (60.8px), lh .95, ls -.1rem (-1.6px), centred, max-width 28rem (448px). Measured box 448×116 at top 6149.
   - The heading carries `data-text-fade-in` (lavender char flicker).
   - The guideline animations are in §3.8.
3. **Stats container** (`.stats-container`): flex, space-between, 100% wide, **`margin-top: -10rem`**, so it rides up under the second guideline. The guideline visibly runs down between the two figures (see `d-stats-y6100.png`).
   - `overflow-x: clip`.
   - Two children, `.stat-left` and `.stat-right`. Each is 50% wide, padding 0 3rem, a column flex with items centred, `position: relative; left: -2.5%`, so both figures sit 18px left of their column centre.
4. **Each figure** (`.stat-number-wrap`): `display: grid; place-items: center; aspect-ratio: 1; width: 90%`, measured 562×562. All layers share `grid-area: 1 / 1`.
5. **Caption** (`.stat-descriptor`): 1.1rem (17.6px) Fellix, lh 1.4, white, centred, max-width 20rem, padding-top 1.5rem. The right one uses `margin-top: auto`. Measured 320×73 at top 6959 for both.

### 5.2 Left figure: "100%" in a tick ring

Layers, back to front:

| Layer | Markup (read) | Values |
|---|---|---|
| Micro paragraph | `.stat-number-micro-text > .micro-text.micro.is-width` | `z-index: -1`, so the ticks draw over it. `place-self: flex-start flex-end` (top-right of the square) with `padding: 5.5rem 2.5rem 0 0`. Text max-width 14rem (224px), PP Supply Sans .6rem (9.6px), ls .08rem, lh 1.2, uppercase, colour `#202020`. Measured text box 224×69 at x 341, 88px below the wrap top. |
| Background ring | `<svg viewBox="0 0 514 514" class="stat-number-circle-bg"><circle cx="257" cy="257" r="252" stroke="currentColor" stroke-dasharray="2 10" stroke-width="10"/></svg>` | `width: 92%` (517px measured), `opacity: .2`, white |
| Foreground ring | The same dashed circle inside `<g mask="url(#circleProgress)">`. The mask is `<mask id="circleProgress" maskUnits="userSpaceOnUse" style="mask-type:alpha"><circle class="mask" cx="257" cy="257" r="252" stroke="currentColor" stroke-width="10"/></mask>` | `width: 92%`, `transform: rotate(-90deg)` (measured matrix(0,-1,1,0)), white |
| Number | `<div class="stat-number"><span data-stats-left-number>0</span><span data-stats-left-number-percentage>%</span></div>` | Fellix 400, **14vw** (201.6px), lh 1, **ls -.8vw** (-11.52px), `margin-left: -.5rem`, `z-index: 1`. The HTML ships "0%". |

**Ticks** (derived):

- Circumference = 2π × 252 = **1583.36** user units. DrawSVG writes exactly `stroke-dasharray: 1583.36px, 0.1px` when done (measured).
- Dash pattern `2 10` gives a 12-unit period, so 1583.36 / 12 = **131.95**, which renders as **132 ticks**. The last gap is .95 units short and the last tick overlaps the first slightly.
- Each tick is 2 units along the circle and 10 units radial, since `stroke-width: 10` is centred on r = 252 and spans r 247–257.
- At 1440 the SVG renders at 517px for 514 units (×1.006), so each tick is about **2.0px × 10.1px**.
- There is one ring of ticks, no minor or major distinction.
- The background copy shows all 132 at 20% white. The foreground copy shows them at 100% white only where the mask has been drawn.

**Highlighted words in the mono text:** there is no fixed highlight. `[data-micro-text]` splits the paragraph into words, 41 of them (measured). One GSAP tween runs keyframes on all of them:

- 0% `color #fff, opacity .35`
- 30% `color #8898e7`
- 45% `#fff, .35`
- 100% `#202020, opacity 1`

Settings: duration 1.2s, ease none, `stagger: { each: .05, from: "random" }`, `repeat: -1`, `repeatRefresh: true`. The whole staggered set loops, so one cycle is 1.2 + .05 × 40 = 3.2s (derived).

At any instant about 24 words are mid-cycle in random order. Each one is lit (white or lavender at 35%) or fading back down to the dark `#202020`. The rest sit at dark grey. The result reads as random words "brighter". Sampled inline styles at one instant: `rgb(170,181,238) op .35`, `rgb(247,247,247) op .37`, `rgb(108,108,108) op .78`, `rgb(32,32,32) op 1` (measured).

The tween plays only while the paragraph is on screen (`toggleActions: "play pause resume pause"`, start `top bottom`, end `bottom top`), and only under `prefers-reduced-motion: no-preference`.

### 5.3 Right figure: "+250%" over three thin circles

| Layer | Markup | Values |
|---|---|---|
| Circle left | `<div class="stat-number-circle is-left">` | `border-radius: 50%`, `border: .0625rem solid #0000`, `width: 80%; height: 80%` (449px), `left: -20%` (-112px) |
| Circle right | `.stat-number-circle.is-right` | Same size, `left: 20%`. The pair overlaps, with centres 224px apart (measured x 707 and 932). |
| Circle centre | `.stat-number-circle.is-center` | 40% (225px), centred (measured) |
| Number | `.stat-number` "+", then `<span data-stats-right-number>0</span><span …-percentage>%</span>` | Same type as the left number |

Circle drawing (read: `vercel-main.css`):

```css
background: linear-gradient(90deg, #595959, #222) border-box;
mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
mask-composite: exclude;
```

Only the 1px border ring is visible, as a left-to-right grey gradient from `#595959` to `#222`. The interior is transparent, so the circles' lines cross over each other. At ≤480 the gradient turns vertical (180deg).

### 5.4 Motion timeline (read: `vercel-app.custom.pretty.js` L764–984)

Two independent timelines, one per figure. Each is started by ScrollTrigger when that figure's top reaches **75% of the viewport** and plays once, with no scrub. Scrolling back above removes `.is-inview`, but the GSAP timeline does not reverse.

**Left** (`prefers-reduced-motion: no-preference`, ≥480px):

| t (s) | What |
|---|---|
| 0 | `.is-inview` is added. CSS `blink` runs on the whole `.stat-number-wrap` for .26s from .175s: opacity 1 → .3 → .85 → .2 → 1, ease-out-power2. |
| 0.10 → 1.75 | `drawSVG` goes from 0 to 100% on the mask circle over 1.65s. The ease string is `expoScale(10,2.5,power1.inOut)`, which renders as **power1.out** (§3.5). Because the SVG is rotated -90°, the bright ticks sweep **clockwise from 12 o'clock** (derived: an SVG circle starts at 3 o'clock and runs clockwise). |
| 0.10 → 0.85 | ScrambleText on "%" with chars `&=$?` and on the number to `"100"` with chars `0123456789`. Both .75s, `revealDelay: .25`, `speed: .8`. Random digits and symbols churn and then lock left to right. |

The storyboard `shots/stats-reveal-storyboard.png` (4 fps) shows the frames "78 → 9$ → 104% → 100%" and the ring partly drawn.

**Right** (same conditions):

| t (s) | What |
|---|---|
| 0 | `.is-inview` is added. The wrap `blink` runs .26s from .245s. The "%" and "250" scrambles start (.75s, same settings). |
| 0.15 → 0.95 | Circle left animates **from** `xPercent: 35, opacity: 0` over .8s. It starts pushed toward the centre and slides out to the left. |
| 0.30 → 1.10 | Circle right animates from `xPercent: -35, opacity: 0`. It slides out to the right. |
| 0.40 → 1.20 | Centre circle animates from `scale: .75, opacity: 0`. |

All three read `expoScale(10,2.5,power2.out)` and render as **power1.out**. The circles spread outward from one another as the number resolves.

**Other conditions:**

- **≤479px:** the same timelines, but the circles move on yPercent (-35 and +35) because they are stacked vertically.
- **Reduced motion:** only the two text scrambles run. There is no ring draw and no circle motion, and the ring sits fully drawn in its static state.

### 5.5 Rebuild notes

- Everything is SVG plus CSS plus GSAP. There is no canvas.
- DrawSVG can be replaced with a plain `stroke-dasharray: 1583.36; stroke-dashoffset: 1583.36 → 0` on the mask circle, since the mask circle is a solid stroke.
- ScrambleText can be replaced with a small digit shuffler.
- Reproduce the effective ease as `power1.out` = `cubic-bezier(.25,.46,.45,.94)` (read: `--ease-out-power1`).

## 6. Other distinctive patterns

### 6.1 How a "page" opens (their answer to the internal-page header)

Titangate never opens with a text-only title block. It uses three recurring openers:

1. **Hero opener** (`d-y0.png`):
   - Full-bleed media at 100.5vh.
   - A tiny mono kicker that scrambles in.
   - A two-line title that blinks in word by word.
   - Under the title, a compact frosted **pill** of anchor links in mono caps with `/` separators. This is their in-page index. It is one line, a real control and visually a chip, not a column of text.
   - A two-tone one-liner pinned to the bottom centre.
2. **Section opener with micro row** (`d-y905.png`):
   - A row of four mono "system" labels and pixel micro-graphics across the 12 columns, dim and flickering.
   - Then a giant display sentence (7.6vw) whose last clause is the grey gradient.
   - Body copy anchored bottom-left, media anchored bottom-right under a radial vignette with slow parallax.
   - The headline carries the section. There is no subtitle.
3. **Guideline opener** (`d-y3900.png`, `d-y5600.png`): an animated dashed vertical line drops from the section above into a centred h4 or h5, with an optional mono scramble line, then continues down into the content. It works as a connector between sections as well as a header.

### 6.2 Other patterns

- **Navigation:** there is no fixed or sticky header. The logo and the "Titan's Gate" chip live only in the hero (`position: absolute`). The anchor pill is the only nav. Anchor clicks use Lenis with a 100px offset.
- **Two-voice typography:** white statement plus gradient-grey continuation in the same sentence, used in display, h4, paragraphs and footer. Single white `.highlight` phrases inside grey paragraphs mark the key words.
- **Cropped ghost numbers on a dashed rule** (process steps): 12vw numerals in near-black, clipped to 7vw height, sitting on a dashed line.
- **Corner-bracket frames:** CSS-only L-corners via four conic-gradients on `:after`. They appear on the benefits boxes and the mobile slides.
- **1px gradient frames:** a parent with a gradient background, 1px padding and a black child, on the logo cards. The stat circles use the mask-composite variant.
- **Redaction reveal:** black bars over words that blink away (benefits bottom card).
- **White footer as the one inversion** on a black site, with a bleeding giant wordmark.
- **Login template** (`login-d-y0.png`): the same absolute nav row and a full-bleed looping video. A centred black panel (padding 3rem 5rem) holds an h6 at 2rem, a mono "INVITE ONLY" at `#ffffff73`, underline-only fields (bottom border `#fff3`, turning `#fff` on focus, placeholder `#fff9`) and a frosted mono "LOGIN" chip. The shared white footer follows.

## 7. Candidates for Moneybee

The colour translation is a suggestion. None of these values were measured on titangate.

- White replaces their black and black replaces their white.
- Their `#898989 → #494949` gradient tail becomes our grey `#9D9EA1`, either flat or as a `#9D9EA1 → #C4C5C7` gradient.
- Their dim `#202020` "micro" ink becomes a pale grey on white, for example `#E3E3E5`, as the resting state of flicker text.
- The lavender flash `#8898e7` becomes orange `#F6A11A`.
- Fellix headings become Instrument Serif. Recheck the tight negative tracking: -.8vw on the numbers will likely be too tight for a serif.
- Fellix body becomes Rethink Sans and PP Supply Sans becomes Geist Mono.

| Moneybee page or content | titangate pattern | How it carries our content |
|---|---|---|
| **Every internal page header** (replacing the text header and "on this page" index) | Opener 2 (micro row + display sentence with grey tail + media bottom-right with parallax), or Opener 1's one-line mono pill if in-page anchors are still needed | Micro row: Geist Mono labels such as "PMS", "SINCE AUG 2007", "SEBI REGD", flickering to orange. Display line: a deck line with its closing clause in grey ("Finding value **where the market is not looking.**"). No subtitle. |
| PMS: philosophy Undiscovered → Under-researched → Under-estimated | **Right stat figure** (three overlapping 1px circles that slide apart) used as a three-set Venn; or the benefits sticky split with three titles and a 01 / 03 counter | Label each circle with one "Un-" word and put the lock-in number or word in the centre. The circles spreading apart on reveal makes the three filters visible without a caption. |
| PMS: portfolio approach (15–20 stocks, max 30% per sector) | **Left stat figure** (tick ring drawn clockwise, big number scrambling) | Ring drawn to **30%** for "30% max per sector" (stop drawSVG at 30%). A second ring with 20 ticks and 15–20 lit for "15–20 stocks". The mono micro paragraph inside the ring should be a real deck line, never an explanation of the graphic. |
| Performance: PMS vs S&P BSE 500 TRI by period since Aug 2007 | **Benefits sticky split**: left titles are periods (1Y, 3Y, 5Y, since inception), right sticky pane shows two equal cards (Moneybee PMS, S&P BSE 500 TRI) whose figures swap per period with the counter chip | Drop titangate's "old world" dimming and redaction on the benchmark card, or apply the same treatment to both, so both read as data. Wealth-growth chart below, revealed by the dashed-guideline opener. |
| PMS Bazaar ranks (3rd 5-year, 6th 3-year, 6th 1-year, Dec 2024) and "45+ years" | Cropped ghost numbers on a dashed rule (process steps) with digit scramble | Three columns: "3rd", "6th", "6th" as big clipped numerals, with the period in mono underneath. |
| PMS vs AIF comparison | Benefits sticky split **with two identical cards** (their top-card treatment on both), or the two stat figures side by side | Keep PMS and AIF on equal footing: same card, same weight, same animation. Do not use the "TGE vs Old World" hierarchy. |
| AIF key terms (₹1 crore minimum, 3–5 years, benchmark S&P BSE 500 TRI) | Stats pair (two big figures) or cropped numbers | "₹1 cr" and "3–5 yrs" as the two large figures, with the benchmark as the caption line. |
| Our Approach: six-step process | "From Selection to Legacy" steps (cropped numbers, line icon, white title, grey line) | Six steps on the 12-column grid, 2 columns each, or 3 × 2. |
| Our Approach: what we look for / don't do | Industry **ragged cascade** list: lines sliding in from the right (first group) and from the left (second group), scrubbed | "Look for" lines come in from one side; a 6vw break; "don't do" lines come in from the other side. |
| Our Approach: four risks | Benefits sticky split with a 01 / 04 counter (exactly four items) | Risk name as the left title; the right card holds the mitigation. |
| Case studies (KPI Green, Uni Abex, Pitti) | Letter section: mono typing line as kicker, centred paragraph in grey with white `.highlight` phrases (black on our white), glyph break between cases | One case per block, key numbers as highlights. |
| Team (45+ years founder experience) | Letter-column typography, or the stat figure for "45+" | |
| Careers | Footer two-column giant headings ("A Privilege." / "Beyond Reach." style) | |
| Contact | Login template: centred panel, underline-only fields, mono chip button, looping media behind | |
| Investor Centre | `_4-columns`: four columns with animated dashed guidelines and mono labels, one per document category | |
| Site-wide | Dashed marquee divider between sections, the guideline connector, button letter-rotation hover, two-voice headlines, a single inverted section (theirs is a white footer on black; ours could be a black band on white) | |

Watch-outs:

- Step icon 04 ("Compounding") in titangate is a curve ending in an arrow. Do not carry any up-right arrow over.
- Their stat captions are stat labels, which is fine. Keep ours as data labels, not UI explanations.

## 8. Could not access or not verified

- No other pages exist to capture. `/sitemap.xml` returns 404. Page transitions between home and `/login` belong to the other agent's brief. From my captures, `/login` loads as a normal page with the same loader, cut short by `quickpreload`.
- The Vimeo videos, images and fonts were not downloaded (§2).
- The direction of the guideline's glint is derived from CSS, not measured frame by frame.
- The tick count is derived from source values (1583.36 / 12), not counted on screen.
- The phone pass has viewport screenshots only, with no phone video. Page videos at 1440:
  - `video/home-scroll-1440.webm` (25s, scripted constant-speed scroll)
  - `video/login-scroll-1440.webm`
  - `video/stats-reveal-1440.webm` (wheel-driven reveal of §5)
