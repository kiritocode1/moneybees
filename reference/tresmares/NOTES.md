# Tres Mares Capital, reference notes

Source: https://www.tresmarescapital.com/en/ (captured 2026-09-30 / 10-01).
Everything below was read from the pinned files or measured in a real browser. Tags used:

- `(css)` read from `source/style.pretty.css` (beautified copy of `source/style.css`)
- `(js Lnnnn)` read from `source/app.pretty.js` at about that line (beautified `source/app.min.js`)
- `(m)` measured in Chrome at 1440×900 (desktop) or 390×844 with an iPhone 14 UA (phone)

Unit rule: the whole site is drawn on a 2400px artboard. CSS sizes are `vw` (1vw = 24 design px).
JS converts design px with `px(t) = t / 2400 * innerWidth` and phone px with `pxm(t) = t / 360 * innerWidth` (js L60).
At 1440 wide, 1vw = 14.4px.

## Folder map

| Path | What |
| --- | --- |
| `source/*.html` | Raw HTML of every English page (home, about, financial-solutions + 4 strategy pages, portfolio, team, investors, contact, legal-notice, privacy-policy, cookies-policy, `404-about-us.html`) |
| `source/style.css`, `style.pretty.css` | Theme CSS (includes Font Awesome; theme rules start around line 21430) |
| `source/app.min.js`, `app.pretty.js` | Site code (components, WebGL scene, SVG morphs) |
| `source/vendor.min.js` | GSAP 3 + ScrollTrigger + SplitText + Flip + Draggable/Inertia + Lenis + lenis/snap + three.js + Taxi.js + svg.js |
| `source/marks/*.svg` | The four product marks (private-equity, direct-lending, fund-of-funds, fund-financing), dropdown chevron, arrow-down |
| `source/contact-mask-desktop.svg` | Mask used to cut the contact hero photo |
| `shots/<page>-sNN-y<scrollY>.png` | 1440×900 viewport captures every 450px (600/900px on short pages) |
| `shots/sheets/*.png` | Contact sheets of those captures, plus `sol-heroes.png`, `nav.png`, `misc-pages.png`, `mobile-*.png` |
| `shots/mobile/<page>-mNN-y<Y>.png` | 390×844 phone pass |
| `shots/nav-megamenu.png`, `nav-scrollup-reveal.png`, `portfolio-hover.png`, `portfolio-offcanvas.png`, `investors-holder-open.png`, `sol-*-hero.png` | Interaction states |
| `video/*.webm` | 1440×900 scroll-through per page (wheel-driven so Lenis easing is visible) |

Not pinned: fonts (PP Fragment Serif, PP Neue Montreal, commercial), all JPG/PNG/MP4 media and the WebGL textures (`img/webgl/background.jpg`, `cloud.png`, `peaks_FRONT.jpg`, `peaks_FRONT_alpha.jpg`, `peaks_FRONT_bump.jpg`, `peaks_MIDDLE.png`). Nothing was skipped for size; media was left out on purpose.

## Page list

| Page | URL | Sections in order |
| --- | --- | --- |
| Home | /en/ | herofulltext, textblocklarge, gridnumbers vertical, textblocklarge, contentscrollcenter, map, teams, footer |
| About | /en/about/ | timeline, contentscrollleft, herorightmedia, contentscrollbg, footer |
| Financial Solutions | /en/financial-solutions/ | herotextimage, gridnumbers horizontal, textblockmedium large, table (dark), dropdownssticky, gallerysticky large, footer dark |
| Private Equity | /en/financial-solutions/private-equity/ | herosolutions, gallerysticky small, tablefourcols, portfolios, dropdownssticky, footer dark |
| Direct Lending | /en/financial-solutions/direct-lending/ | herosolutions, gallerysticky small, tablethreecols, portfolios, dropdownssticky, footer dark |
| Fund of Funds | /en/financial-solutions/fund-of-funds/ | herosolutions, gallerysticky small, tablethreecols, dropdownssticky, dropdowns, footer dark |
| Fund Financing | /en/financial-solutions/fund-financing/ | herosolutions, gallerysticky small, tablethreecols, dropdownssticky, footer dark |
| Portfolio | /en/portfolio/ | herosimpletext (+filters), portfolioarchive, footer. Items open in an offcanvas at /en/portfolios/<id>/ |
| Team | /en/team/ | herosimpletext (+filters), teamarchive, footer |
| Investors | /en/investors/ | herofullcenter, holderarchive, footer dark. Cards open an offcanvas at /en/holder/<slug>/ |
| Contact | /en/contact/ | herocontact, footer dark |
| Legal notice, privacy, cookies | /en/legal-notice/ etc. | component--page (centred title + rich text) |
| 404 | e.g. /en/about-us/ | error404 |

Note: the home "Discover our history" link points to /en/about-us/, which returns the 404 page.
External: "Investors Portal" button goes to investorsfront.tresmarescapital.mscope.tech (not captured).

## Global system

### Stack
- WordPress theme, WP Rocket. Taxi.js page router (`data-taxi`, `data-taxi-view`). Each section is `<section class="component component--<name>" data-component="<name>">`, mapped to a class in a switch (js L13120-13340).
- GSAP 3 with ScrollTrigger, SplitText (`O.h.create`), Draggable + InertiaPlugin, lenis/snap.
- Lenis smooth scroll: `new Lenis({ autoRaf: true, autoResize: true })`, no other options, so Lenis defaults apply (lerp 0.1). ScrollTrigger uses `scrollerProxy(document.documentElement)` reading `lenis.scroll`; `ScrollTrigger.update()` on every Lenis scroll event; `history.scrollRestoration = "manual"` (js L13812-13840).
- three.js for the home hero only. svg.js for the product-mark morphs.
- Taxi transition (desktop, for the other agent): new page set `y:100vh, scale:.8` then to `y:0, scale:1`; old page to `y:-50vh, opacity:.8`; both 1.4s `expo.inOut` (js L13540-13657).
- `#app` starts at `opacity:.0001`; hero components call `scrollDisable()` and re-enable after 3s (first load) or 2.6s (after navigation).

### Colour tokens (css `:root`)
| Token | Value | Use |
| --- | --- | --- |
| --main | #e41613 | Accent: numbers, product marks, cursor, `<strong>` inside display titles, list markers, active year |
| --darkest | #2b2b2b | Text, primary button, dark sections, footer dark |
| --black | #000 | Behind full-bleed image stacks |
| --lightest | #f7f7f7 | Timeline, teams band, holder cards |
| --lighter | #f2f2f2 | Footer, contact hero, table sections, investors hero |
| --light | #e5e5e5 | Mega-menu tiles, portfolio card borders |
| --medium | #d5d5d5 | Hairlines, image backdrop in the strategy scroller |
| --dark | #aaa | Labels, inactive years, copyright |
| Header hairline | rgba(43,43,43,.2) | Header bottom border, header cell dividers |
| Offcanvas mask | rgba(0,0,0,.7) | |

Image treatment: every `.image` and `.video` is `filter: grayscale(.95)` unless it has `.--color` (css L23207). Low-res 200px placeholders (`src*="-200x"`) are blurred `.833vw` until a lazy loader swaps `data-src` (IntersectionObserver, rootMargin 100px).

### Easings (css `:root`)
`--expoOut: cubic-bezier(0.16,1,0.3,1)`, `--p2Out: cubic-bezier(0.5,1,0.89,1)`, `--expoInOut: cubic-bezier(0.87,0,0.13,1)` (the later declaration wins over a first `0.895,0,0.18,1`), `--expoIn: cubic-bezier(0.7,0,0.84,0)`, `--p2InOut: cubic-bezier(0.45,0,0.55,1)`.
GSAP side uses `expo.out`, `expo.inOut`, `power2.out`, `none` (for scrub).
CSS transitions: hovers `.4s var(--p2Out)` or `.4s var(--expoOut)`; image filter `.8s var(--expoOut)`.

### Type (css; px at 1440 in brackets; phone value after /)
Fonts: `--font-primary: "PP Fragment Serif"` (numbers, years, 404 only), `--font-secondary: "PP Neue Montreal"` 400/500/700 (everything else). `html` font-size `.667vw`, line-height 1.6, letter-spacing -.01em, colour #2b2b2b.

| Class | Family / weight | Size | Line-height | Tracking | Phone |
| --- | --- | --- | --- | --- | --- |
| display --5xlarge | serif 400 | 37.5vw [540] | 1.01 | | min(38.889vw,154.35px) |
| display --4xlarge | serif 400 | 16.667vw [240] | 1.2 | 20% | |
| display --3xlarge | sans 500 | 11.667vw [168] (m) | .7 | -.04em | min(20vw,79.38px) |
| display --2xlarge | sans 500 | 7.5vw [108] | .85 | -.06em | min(15.556vw,61.74px) |
| display --xlarge | sans 500 | 5vw [72] | .95 | -.04em | min(12.222vw,…) |
| display --xlarge --serif | serif 400 | 5vw [72] (m) | .95 | -.05em | |
| display --large | sans 500 | 3.75vw [54] (m) | .95 | -.04em | min(8.889vw,35.28px) |
| display --medium | sans 400 | 3.333vw [48] | .95 | -.04em | |
| display --small | sans 400 (500 with --bold) | 2.5vw [36] | 1 | -.04em | min(6.667vw,26.46px) |
| display --xsmall | sans 400 | 2.083vw [30] | 1 | -.04em | |
| text --xlarge | sans 400 | 1.667vw [24] | 1.2 | -.02em | min(5vw,19.845px) |
| text --large | sans 400 | 1.25vw [18] | 1.25 | -.02em | min(3.889vw,15.435px) |
| text --medium | sans 400 | 1vw [14.4] | 1.2 | -.02em | |
| text --small | sans 500 | .917vw [13.2] | 1 | | |
| text --xsmall | sans 400 (700 uppercase variant) | .75vw [10.8] | 1.2 | | |
| label | sans 500 #aaa | 1vw [14.4] (m) | 1.2 | -.02em | |
| label --small | sans #2b2b2b | .75vw | | | |
| link .text | sans 500 | 1vw, underline 2px at bottom .083vw | 1.2 | | |
| button | sans 500 | .917vw, height 5vw, min-width 15vw | | | |

Paragraph spacing inside rich text: `p { margin-bottom: 1.25vw }`. List markers red.

### Layout
- No column grid. Containers are fixed vw widths, centred (css L22801): default 96.667vw, `--wide` 100%, `--xlarge` 99.167vw, `--large` 98.333vw, `--medium` 90vw, `--small` 80vw, `--xsmall` 70vw, `--xxsmall` 60vw. Phone: `calc(100% - min(5vw, 19.845px))` and similar.
- `.component { padding: 10vw 0 }`. Most sections override top/bottom (values per section below).
- Recurring vertical lines: 1.667vw (page edge inset for small text), 5vw, 10vw, 20vw, 27.917vw, 50vw, 55vw.
- Text blocks: `.text-block-center` 60vw (`--medium` 50vw), children spaced 2.5vw. `.text-block-left` 45vw / `--medium` 36.667vw / `--small` 20vw / `--xsmall` 10vw, gaps 2.5 / 2.5 / 1.667 / 1.25vw.
- Spacing tokens: `--space .833vw`, `--space-half .417vw`, `--radius .417vw`.
- One breakpoint: `max-width:1100px`. JS also deletes `[data-mobile]` nodes on desktop devices and `[data-desktop]` nodes on phones at load (device detection, not width).

### Header and menu (css L25860-26916, js L9022, js scrollCheck ~L13850)
- `position: sticky; top:0; height:5vw` (72px m); `margin-bottom:-5vw` so it overlays every hero. Transparent, 1px bottom border rgba(43,43,43,.2). Gets white background when `html.scrolled` (scroll > 10px, class added after .6s when scrolling down).
- Hide/show: scrolling down hides it with `y:-100%`, .6s power2.out. It returns (`y:0%`, .6s) when you scroll up 200px past the point where direction changed, or when scroll < 10.
- Layout: logo 7.875vw at margin-left 2.5vw; nav absolutely centred (`left:50%; translateX(-50%)`), links 1vw 500, gap 2.083vw; right side a language cell (border-left, padding 0 2.5vw, min-width 5.833vw, ES slides in on click) and "Investors Portal" charcoal button 5vw tall.
- Nav hover: 2px underline at bottom 1.667vw, `scaleX 0→1` .6s expo.out from the left; on leave it slides away `x:102%`. Active page keeps the full underline.
- Mega menu on hover of "Financial Solutions": white panel 101vw wide under the header, 4 tiles 24.5vw × 19.167vw, bg #e5e5e5, radius .417vw, gap and padding .375vw. Each tile holds the product mark at 6.667vw (CSS mask, #2b2b2b, blend darken) and its name. Page below gets a mask at opacity .8 (.2s) and scrolling stops. Tiles fade in, stagger .1, .6s power2.out. See `shots/nav-megamenu.png`.
- Phone: 66px bar, logo mark only, two-bar trigger turns into an X (bars rotate ±45deg, .8s expo.out); menu panel slides from `y:-120%` to 0 (.8s expo.out, delay .4), links stagger .05.

### Cursor (css L25475, js L300-390)
Fixed full-screen layer with `mix-blend-mode: darken`. A red dot .417vw follows the pointer via `gsap.to(x,y)` 1s expo.out. Over strategy images a red 5.375vw disc labelled "VIEW" scales in (.8s expo.out); over draggable rows the disc says "DRAG". Hidden below 1023px.

### Reveals applied site-wide by the page base class (js L440-900)
1. `.title.--fill`: SplitText into words and chars (words only for `--3xlarge`). Chars go opacity .05 → 1, `stagger .02`, scrubbed between `top 90%` and `bottom 60%`. If the title is already on screen at load it plays as a timed tween (.2s delay) instead of scrubbing. This is the grey-to-black "writing" effect on every big statement.
2. `.wysiwyg` (unless `.--na`): SplitText words; each word starts `y:100%` with `clip-path: inset(0 0 100% 0)`, and on enter animates to `y:0`, `inset(0)`, 1s expo.out, stagger .01. Runs once.
3. `.--magnet`: starts `y:2.5vw (px 60), scale .96, opacity 0`; on enter goes to rest over 2s expo.out with `delay = 0.00025 × element left in px`, so items further right arrive later.
4. `.link` hover: underline slides out to the right (`x:101%`), and on leave re-enters from `x:-100%` (.6s expo.out).
5. Autoplay videos play inside `top-=5% bottom` to `bottom+=5% top` and pause outside.
6. Anchor links scroll with Lenis, 2s, expoInOut.

### Footer (css L25544-25860, js L12964, marquee js L11971)
- bg #f2f2f2 (dark variant #2b2b2b + white text on strategy, investors and contact pages); padding 11.667vw 0 2.5vw.
- Centred statement (display --large --fill, block 50vw) "The opportunity to create, grow, and look ahead" + one text link (margin-top 3vw).
- Photo marquee: strip 120vw wide starting at -10vw, 10vw square items, gap 15vw. Each frame `p += autoplay` (-1px desktop, -.8 phone), eased with `h = lerp(h, p, .1)`, items wrap modulo strip length. Autoplay sign follows scroll direction. The whole strip also parallaxes `x: -10vw → 10vw` while the footer crosses the viewport. Draggable (drag × 2.5) and horizontal wheel (× .9).
- Social icons in 2.5vw squares with 1px #d5d5d5 border; `hr` #d5d5d5 margin 7.5vw auto 2.5vw; bottom row legal links .75vw 500, gap 3.333vw, padding 0 5vw, copyright #aaa.

### Offcanvas detail panel (js L4740-4900, css L26916)
Used for portfolio companies and investor document sets. Fetches the detail page, injects it into a right-hand panel 80vw wide, pushes the detail URL. Panel `x:100% → 0` .8s expo.out, mask rgba(0,0,0,.7) fades in .8s, square close button top-right 1.667vw. Panel has its own Lenis instance.

### "Waves" texture
Large inline SVG of ~100 contour lines, stroke #F2F2F2, stroke width stepping 0.04 → 3.5, placed absolutely behind sections with a negative top (gridnumbers horizontal, map, portfolios, table three/four cols, gallerysticky large, herocontact, herorightmedia). On white it reads as a faint topographic moiré. In herorightmedia it parallaxes `y:-10vw, scale 1.2`.

## How internal pages open

No internal hero uses an eyebrow + heading + intro + buttons + index. The patterns:

| Pattern | Used on | Composition | Motion |
| --- | --- | --- | --- |
| Product hero (`herosolutions`) | the 4 strategy pages | 100vh. The product's geometric mark drawn huge in red over the right 70vw, full height. Title display --3xlarge (11.667vw) in two lines, left 27.917vw, width 38.542vw, `text-indent:-8.75vw`, `mix-blend-mode:multiply` so it darkens where it crosses the red. One paragraph bottom-left (left 1.667vw, bottom 5vw, 16.667vw wide). A 3.75vw bar along the bottom with 6 KPIs spread edge to edge (uppercase bold label over value). The header floats over the red. | Mark builds from scale 0 with its shape morph, 2s expo.inOut after .5s. Title lines slide to `x: i × 8.75vw` (px 210), 2.2s expo.inOut, delay .8s first load / .4s after navigation. Scroll locked until done. See `shots/sheets/sol-heroes.png`. |
| Section index (`herotextimage`) | Financial Solutions | Padding-top 12.333vw. Title display --2xlarge placed in the right half (container 80vw, item 35vw flush right, so it starts at 55vw, measured x 792px). One sentence (text --xlarge 500) at the bottom-left of the container, 20vw wide. Then a full-bleed 16:9 video (50vw tall) starting at 75% of the first viewport. | Title uses the char fill. Video inner layer parallax `y:-20% → 20%` over its viewport pass. |
| Archive (`herosimpletext`) | Portfolio, Team | Padding 13.333vw 0 1.667vw. Title display --2xlarge in a 40vw column flush right (margin-right 3.333vw). One paragraph 20vw at the left, under the title's baseline. Directly below: "Filter by" label and 3-4 underlined selects in text --xlarge. The grid starts right after. | Char fill on title, word reveal on paragraph. |
| Utility (`herofullcenter`) | Investors | bg #f2f2f2, padding 15vw 0 12.5vw, small grey label ("Investors") above a centred display --large title. Content cards begin immediately below on the same grey. | Char fill. |
| Story (`timeline`) | About | bg #f7f7f7, centred display --2xlarge title (40vw block), then straight into the interactive year block (see About table). | See About. |
| Contact (`herocontact`) | Contact | Title top-left, the three offices as columns in the hero itself, photo on the right cut by the product-mark mask. | Word reveal. |
| Plain (`page`) | Legal pages | Centred display title, rich text below. | None. |

Shared traits: the title is always display size ≥ 3.75vw, weight 500, negative tracking, and never centred over a paragraph block; the intro, when present, is one sentence placed off-axis (bottom-left); at most one text link; the hero often fills the first viewport and the header overlays it.

## Home, section by section

| # | Section, y range (m) | Screens | Layout (exact) | Mechanism |
| --- | --- | --- | --- | --- |
| 1 | herofulltext 0-900 | home-s00, s01, video/home.webm | 100vh, padding 0. Title "Drive to grow" display --3xlarge, absolute left 10vw (m 144px), top 50%, width 60vw, 3 lines. Text block --small (20vw) absolute right 10vw bottom 5vw: text --xlarge + link. "Scroll" label bottom-left 5vw. (css L29480) | Title lines animate to `x: 0 / 72 / 144px` = `px(120 × i)` (m), 2.2s expo.out on first load, expo.inOut + .4s delay after navigation (js L9504). "Scroll" fades out between `top 50%` and `50% top`. Background is a three.js scene (`#cloudsea-webgl`): layered photo planes (background, peaks_MIDDLE, peaks_FRONT with alpha + bump) and cloud sprites in three depth layers, drifting right at 0.1-0.5 units/frame by depth and wrapping; mouse moves the scene vertically. One ScrollTrigger from hero top to gridnumbers top drives `scroll_zoom = progress` (scene scale + .3 × progress) and `scroll_main = .5 × max(0, (progress - .4) / .6)` (scene rises by eased × 0.9 × ref height); scene deactivates after (js L4585, L3600-3900). Film grain on the photo. |
| 2 | textblocklarge 900-1443 | home-s02, s03 | Padding 10vw 0 13.333vw. Centred label "About Tresmares" + display --large --fill (54px m), block 60vw. Sits over the bottom of the mountain scene. | Char fill scrub. |
| 3 | gridnumbers vertical 1443-2859 | home-s03-s06, home-01 | Container 70vw. Left column 20vw: text --xlarge paragraph + link, `position: sticky; top: 11.667vw`. Right column 40vw with two stacks of 3 stat cells. Cell 20vw × 25vw (m 276×346), padding 1.667vw, number (serif 5vw red, -.05em) at top, label (text --large 500, 80% wide) at bottom, 1px #d5d5d5 borders. Stack 2 `margin-top: 10vw`. Padding 10vw 0 3.333vw. (css L28952) | Stack 2 moves `y: 0 → px(-480)` = -20vw (-288px) scrubbed from stack-1 `top bottom` to `bottom top` (js L8905), so the two columns slide past each other. Cells enter with the magnet reveal. |
| 4 | textblocklarge 2859-3402 | home-s06, s07 | Same as #2, "Financial solutions". | Char fill. |
| 5 | contentscrollcenter 3402-7002 | home-s07-s15, video/home.webm | Section bg #2b2b2b, container height `count × 100vh` (4 → 3600px). `.sticky` 100vh. Four absolutely stacked panels. Each: image cover on #d5d5d5 with the photo `mix-blend-mode: darken` (B&W botanical); title display --3xlarge, width 50.75vw, centred, `multiply`, line 1 left-aligned and line 2 right-aligned; bottom-left text block 10vw (left 5vw, bottom 5vw) with a small link; bottom-right detail column 8.333vw, right-aligned label/value pairs, gap 2.083vw. Anchor list top-left 5vw, items .75vw 500, opacity .4, active 1. (css L27626) | Pre (`top bottom` → `top top`): first photo `y:-10% → 0`, first info `y:15% → 0`. Main (`top top` → `bottom bottom`, scrub): timeline of 7 units; each change lasts total/3. Incoming panel wipes up with `clip-path: inset(100% 0 0 0) → inset(0)`, its photo `y:20% → 0`, info `y:30% → 0`, title opacity from -3 to 1 (so it appears late). Outgoing panel fades to 0 over the charcoal bg (reads as darkening), photo `y:0 → -20%`, info `y:0 → -30%`, title opacity → -3 (vanishes early). Anchor state switches at label crossings, direction-aware; clicking an anchor jumps there. Lenis Snap points: section top, `postshow1-3`, section end, `distanceThreshold = section height / 3` (js L7953). Red product marks drawn with svg.js morph between the four shapes: overall progress = pre × 1/8 + main × 6/8 + post × 1/8, split into in / hold / out segments per mark, each a point-state morph with expo.inOut (js L7360). Phone: outgoing panel dims to .3 and scales .95 instead of fading. |
| 6 | map 7002-8934 | home-s15-s19 | Padding 20vw 0 10vw. Centred label + display --xlarge title with `<strong>` in red. Wheel container 100vw × 39.583vw, overflow hidden, padding-top 12.5vw; circle 90vw diameter; 16 colour photo cards 10vw square with country names. White gradient covers the lower half; centred paragraph (35vw) at top 31.25vw. Dotted Europe map 100vw × 46.667vw with three office dots (.833vw red, 2.5vw pulse ring) and hover tooltips 13.333vw. (css L30622) | Card i placed with `rotate(i × 22.5 − 96deg) translate(R) rotate(96deg)`, R = circle/2 + card/2. The circle rotates `0 → −337.5deg` scrubbed while its container goes `top bottom` → `bottom top`; names cross-fade with `x: ±20%` (js L10825). Map dot hover fades in a red city shape (.6s power2.out) and the tooltip (opacity + translateY 10% → 0). |
| 7 | teams 8935-10042 | home-s19-s21 | bg #f7f7f7, padding 13.333vw 0 .417vw. Centred display --large statement. Horizontal row margin-top 10vw, gap .417vw, cards 23vw wide, portrait 25vw tall on a #eee→#efefef gradient. | GSAP Draggable + Inertia on a proxy, inner position lerped at .2, edge resistance .8 (js L10306, L12654). Hover: gradient swaps to #dedede→#f3f3f3 and role + name fade in at the top (.4s p2Out, name slides from top 10% to 0 over 1.2s expoOut). Cursor shows "DRAG". |
| 8 | footer 10042-10967 | home-s22, s23 | See Global. | Marquee + parallax. |

## About (/en/about/)

| # | Section, y (m) | Screens | Layout | Mechanism |
| --- | --- | --- | --- | --- |
| 1 | timeline 0-1438 | about-s00-s03 | bg #f7f7f7, padding 12vw 0 7.625vw. Title --2xlarge "Our journey so far", centred, 40vw block, margin-bottom 5vw. Then `.snap` 100vh: video 47.5vw × 26.667vw centred at top 40%; year digits (display --5xlarge serif red) in a 31.667vw-tall masked row, gap 2vw, `mix-blend-mode: multiply` over the video; bullet texts (13.75vw columns, gap 5vw, red .417vw dot) bottom 5vw; year row at bottom 2.5vw, gap 8.167vw, #aaa, active red. (css L33174) | On load the video clip goes `inset(50%) → inset(20%)` 1.4s expo.out, then `inset(20%) → inset(0)` scrubbed as `.snap` reaches the top. Each digit is a column of 0-9; changing year sets `y: −100 × digit %` per column, 1.4s expo.out (odometer). The video's `currentTime` tweens to `duration / years × index` (1.4s expo.out), so the flower opens as years advance. Bullet groups cross-fade (.6s expoOut, .6s delay). Clicking a year also scrolls to `.snap` (js L12771). Phone: swipe carousel with dots. |
| 2 | contentscrollleft 1438-10438 | about-s03-s23 | Sticky 100vh black stage. Full-bleed photo stack (100vh + 10vw tall). Value list top-left 10vw: "Our values" label + list (gap 1.667vw, opacity .4, active 1). Paragraph bottom-right (right 10vw, bottom 10vw, 20vw, text --xlarge white). Footnote bottom-left (.833vw inset, 10vw). (css L27898) | Section length is 2 screens per item (5 items → 9000px). Scroll crosses a label every 2 units and fires a timed swap, not a scrub: outgoing words slide out `y: ±100%` with clip, .6s power2.out, stagger .01; photos cross-fade .6s; new words enter after .6s. Direction-aware. Photo stack parallax `y: −10vw` across the section, entering from `−10vw` to 0 (js L8326). |
| 3 | herorightmedia 10438-12127 | about-s23-s26 | White. Left: title --2xlarge "Your best partner" at margin-left 10vw, top 14.167vw, 25vw wide, + paragraph. Right: 50vw full-height media. Below: small image 26.667 × 18.333vw at left 10vw, two-column text (`columns: 20vw 2; column-gap 5vw`, 45vw), then a display statement. (css L29542) | On load: clip `inset(0 0 0 100%) → 0` 1.2s expo.out, media opacity + `grayscale(1) → 0` 1.4s delay .4. Scrub over the section: clip `y: −5vw`, bottom inset 10%; image `y: 10vw`; waves `y: −10vw, scale 1.2` (js L9636). |
| 4 | contentscrollbg 11767-15413 | about-s26-s34 | Sticky 100vh black video stage (margin-top −40vh). Statements in a column with 100vh gaps; each centred display in white, 60vw. Last group adds three columns (17.5vw) of icon (2.5vw) + short text. (css L27511) | Whole block fades in over the first 20% of scroll. Videos cross-fade scrubbed (1.2s units, stagger 2). Each statement fades in while rising from `bottom bottom` to the middle and fades out above, except the last (js L5401). |
| 5 | footer | about-s34-s36 | Light. | |

## Financial Solutions (/en/financial-solutions/)

| # | Section, y (m) | Screens | Layout | Mechanism |
| --- | --- | --- | --- | --- |
| 1 | herotextimage 0-1394 | fs-s00-s03 | See "Section index" pattern (css L29973). | Video parallax `y: −20% → 20%` (js L9913). |
| 2 | gridnumbers horizontal 1394-2258 | fs-s03-s05 | Two rows of three 20vw × 25vw cells; top row flush left, bottom row flush right, so row 2 sits one cell to the right; shared 1px #d5d5d5 borders; waves behind. Padding 10vw 0 0. | Magnet reveal. |
| 3 | textblockmedium large 2258-2977 | fs-s05, s06 | Container 73.333vw, block 36.667vw flush right: label + two text --xlarge paragraphs. Padding 10vw 0 15vw. | Word reveal. |
| 4 | table (dark) 2977-4204 | fs-s06-s09 | bg #2b2b2b, text #d5d5d5, padding 5vw 0 3.333vw, container 90vw. Left 30vw: label + display --small 500 statement. Right 25vw paragraph (margin-top 4.708vw), gap 15vw. Table margin-top 7.5vw: column labels, rows with 1px rgba(255,255,255,.2) top border, padding 2.5vw 0 6.667vw, cells 25vw / 12.5vw (ml 20vw) / 12.5vw (ml 17.5vw). (css L24846, L32661) | Static. |
| 5 | dropdownssticky 4204-5612 | fs-s09-s12 | Header labels "Solutions" / "Strategy". Rows with 1px #d5d5d5 top border, head padding-top 2.5vw, title display with a ® superscript (2.708vw), 18.75vw wide, round +/chevron icon right. Open row: product mark in #f7f7f7 centred (35.833 × 28.333vw), description column 15vw at right (margin-right 3.75vw), 4 stats spread along the bottom. (css L28385) | One open at a time; first open by default. Opening tweens height to auto, fades the text column and mark, builds the mark (1.4s expo.inOut), and Lenis scrolls so the row is centred (1.4s expoInOut) (js L8699). |
| 6 | gallerysticky large 5612-7186 | fs-s12-s15 | Padding 13.875vw 0 10vw, #f2f2f2 gradient, waves. Five B&W photos scattered on a 2-column flex (15vw square at ml 5vw; 20 × 25vw flush right at mt 10vw; 20vw tall at mt 10vw; …). Centred text block (absolute top 22.5vw, 40vw) with display title; paragraph and link indented 20vw. (css L28731) | Magnet reveal on photos; no pin. |
| 7 | footer dark | fs-s16-s18 | | |

## Strategy pages (Private Equity shown; others share the template)

| # | Section | Screens | Layout | Mechanism |
| --- | --- | --- | --- | --- |
| 1 | herosolutions | pe-s00, sheets/sol-heroes.png | See "Product hero" pattern (css L29850). Marks: PE two stacked parallelograms, DL 2×2 squares with diagonal cuts, FoF half-disc over a split disc, FF two pentagon "houses". All are split on the horizontal centre line (`source/marks/`). | js L9782 and SVG morph app (js L7560). |
| 2 | gallerysticky small | pe-s01-s04 | Padding 5vw 0 10vw. Four photos + centred statement + indented paragraph. | Magnet. |
| 3 | tablefourcols / tablethreecols | pe-s05-s06 | bg #f2f2f2, padding 13.333vw 0 3.333vw, waves. Head row aligned to bottom, gap 20vw: paragraph 25vw left, title display --2xlarge "Fund Overview" 45vw right. Table margin-top 6.667vw; rows padding 2.5vw 0 5vw; name / fund list / year / commitment right-aligned. (css L32760) | Static. |
| 4 | portfolios | pe-s07, s08 | Padding 16.667vw 0 10vw, waves. Centred display statement, logo strip 120vw starting at −10vw, 18.333vw tall, gap .417vw; logo cards 19.333 × 18.333vw, 1px #e5e5e5. | Same marquee engine as the footer (gap px 10, −1px/frame) when more than 6 logos, else centred static (js L12127). Card hover: logo fades out, photo fades in from `scale 1.1 → 1` over 1.8s expoOut (css L20928). |
| 5 | dropdownssticky "Other Solutions" | pe-s08-s10 | The three other strategies. | As on Financial Solutions. |
| 6 | dropdowns (FoF only) | source HTML, css L28189 | Container 60vw, padding 15vw 0. Centred label + display --large title, then accordion rows (head padding 1.667vw 0, title text --xlarge 16.25vw, chevron right 2.083vw); body: illustration 20 × 27.583vw + text column 15vw aligned to the bottom. | Height tween like dropdownssticky. |

## Portfolio, Team, Investors, Contact, Legal, 404

| Page | Screens | Layout | Mechanism |
| --- | --- | --- | --- |
| Portfolio | portfolio-s00-s07, portfolio-hover.png, portfolio-offcanvas.png | Archive hero + filters. Grid of 4 logo cards per row with hairline borders; pagination (numbers + square arrows). Offcanvas: photo on the left half of the panel, right half a key/value list (STRATEGY, STATE, GEOGRAPHY, hairlines), description in text --xlarge, "Go to the website" link. (css L29743, L31984) | Card hover swap; offcanvas slide. |
| Team | team-s00-s05 | Archive hero "Behind Tresmares" + filters (Strategy, Position, Office). 4 cards per row: 23.542vw wide, portrait area 28.917vw tall on #f2f2f2, portrait `contain`, 95% size, anchored 6% below the bottom; name (text) + role (#aaa) under the image; empty slots show the logo mark. (css L21175) | Hover: overlay to .6, link fades in and rises from top 52% to 50%, 1.2s expoOut. |
| Investors | investors-s00-s03, investors-holder-open.png | Utility hero; 3 cards per row on #f2f2f2: 32.5 × 20vw, #f7f7f7, radius .417vw, padding 2.5vw, title 20vw at top-left, small square arrow button bottom-right 1.25vw; gap .396vw. Offcanvas: huge title, left column category + year list, right column section title then rows "year / type / download links with ↓ icon" under a 1px rule. (css L20431, L30486) | Card hover: bg to white, icon tint. Offcanvas slide. |
| Contact | contact-s00-s02 | bg #f2f2f2. Left column padding 8.833vw 6.667vw 13vw 1.667vw, title --2xlarge at top, 19.083vw gap, then three office columns (10vw, gap 5.833vw) under a hairline at 2.708vw (50vw long): city name, address, email, phone. Right: photo 50 × 39.583vw cut by `contact-mask-desktop.svg` (the PE double-parallelogram), waves at the bottom. (css L29260) | Word reveal. No form on the page. |
| Legal | legal-s00-s03 | Centred display title, rich text with red list markers. | None. |
| 404 | e404-s00 | 100vh, mountain photo, "404" in display --5xlarge serif red with multiply, "Page not found" + link centred inside. (css L28660) | None. |

## Phone pass (390×844, shots/mobile/, sheets/mobile-*.png)
- Hero title stays left, text stacks below; `herofulltext` title gets padding-top 30vw.
- `gridnumbers` becomes one column of full-width cells, still staggered 2 columns on home.
- `contentscrollcenter` keeps the sticky stack, anchors move to a horizontal sticky row at the top.
- `timeline` turns into a swipe carousel with dots.
- `contentscrollleft` keeps the full-screen image with the list top-left.
- Product hero: mark shrinks to a band behind the title; KPIs become a 3×2 grid below the paragraph.
- Footer marquee runs at −.8px/frame; legal links wrap centred.

## Candidates for Moneybee

Palette swap: red #E41613 → orange #F6A11A for marks, numerals and the cursor dot; charcoal #2B2B2B → black text; #AAA labels → grey #9D9EA1; keep the #f7f7f7 / #f2f2f2 light greys for bands. Orange on white fails body-text contrast, so use it only for shapes and numerals at ≥ 5vw, as Tres Mares does with its red. Fonts: Instrument Serif takes both of Tres Mares' roles for display (headings) and numerals; Rethink Sans for body; Geist Mono for the grey labels and KPI captions.

| Tres Mares pattern | Moneybee use | Notes |
| --- | --- | --- |
| Product hero (`herosolutions`): giant mark + multiplied two-line title + one-sentence intro + bottom KPI strip | Internal header for PMS and for AIF (Flyingbee) | Replaces the eyebrow/intro/buttons/index header. Same template, same mark size and position for both, so they sit on equal footing. KPI strip: AIF gets Category III, ₹1 crore minimum, 3-5 years, benchmark S&P BSE 500 TRI; PMS gets its deck facts (since Aug 2007, benchmark, etc.). Each product needs its own geometric mark built from 2-3 shapes split on the centre line. |
| Section index hero (`herotextimage`) | Our Approach, Performance, Case Studies landing | Title in the right half, one sentence bottom-left, full-bleed image or video below with ±20% parallax. |
| Archive hero + filter row (`herosimpletext`) | Investor Centre, Team | Filters (Product: PMS / AIF, document type, year) are real controls, not an index. |
| Utility hero (`herofullcenter`) | Careers, Contact alternative | Small Geist Mono label + centred title, content starts on the same grey band. |
| Sticky stacked panels with clip-wipe and morphing mark (`contentscrollcenter`) | PMS philosophy: Undiscovered → Under-researched → Under-estimated (three panels, one mark per word, morphing), or Case Studies (KPI Green, Uni Abex, Pitti) | Not for PMS vs AIF: it orders items one after another. Pin length = count × 100vh, snap at each panel. |
| Sticky paragraph + two offset stat columns with opposing parallax (`gridnumbers vertical`) | Home or Performance: PMS returns vs S&P BSE 500 TRI since Aug 2007, wealth growth figures | Numerals in Instrument Serif orange at 5vw; labels in Rethink Sans at the cell bottom. Figures only from the decks. |
| Odometer year + scrubbed video (`timeline`) | Performance "wealth growth" year selector, or the firm story since 2007 | Digits roll per column (y = −100 × digit %); a figure below changes per year. The video scrub can become a chart line drawing to that year. |
| Full-screen image with sticky list and timed text swaps (`contentscrollleft`) | Our Approach: four risks, or what we look for / what we don't do | Drop the explanatory footnotes Tres Mares shows bottom-left. |
| Statements over cross-fading footage (`contentscrollbg`) | Careers intro, or closing section of Our Approach | Three to four short deck lines. |
| Accordion that centres the opened row and builds its mark (`dropdownssticky`) | Six-step process on Our Approach | Sequential by nature, so fine for steps, not for PMS vs AIF. |
| Dark comparison table (`table`) | PMS vs AIF | Adapt to two equal-width product columns with criteria as rows (minimum, horizon, structure, benchmark, taxation), hairlines rgba(255,255,255,.2) on black, or #d5d5d5 on white. Keeps both products level. |
| Mega-menu tiles with marks | "Products" menu: PMS, AIF, PMS vs AIF | Two equal tiles for the products. |
| Document cards + offcanvas (`holderarchive` + holder panel) | Investor Centre documents per product | Rows: year / type / download links. |
| Contact hero with office columns and mark-shaped photo mask (`herocontact`) | Contact | Mask the photo with the Moneybee mark. |
| Footer statement + photo marquee | Site footer | Deck line as the statement, one link. |
| Portrait grid with hover reveal (`teams`, `teamarchive`) | Team | Home can use the draggable row. |
| Collage with indented statement (`gallerysticky`) | Careers | |
| Global reveals: char fill on statements, word rise on paragraphs, magnet on cards, 2px underline links, header hide on scroll-down | Site-wide | These carry most of the perceived craft for little code. |

Things to leave out under Moneybee's rules: the "VIEW" / "DRAG" cursor labels (UI-explaining text; keep only the dot), the value footnotes on About, any ↗ arrows (Tres Mares uses → and ↓ only, fine to mirror the ↓ for downloads).

## Could not access or not captured
- Fonts and media files are referenced, not downloaded.
- Spanish pages, the external investor portal, and gated investor documents.
- Privacy and cookies pages: HTML pinned, not screenshotted (same template as Legal notice).
- Phone videos were not recorded; the phone pass is screenshots only.
- Page-to-page transition detail is left to `reference/page-transitions/`; the one-line summary is in Global > Stack.
