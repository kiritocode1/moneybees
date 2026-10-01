# 04 PayTo line cards: measured spec

Source: `../04-payto-line-cards.png`, 735 × 453 RGBA (alpha 255), a JPEG-derived thumbnail: chroma is subsampled, so thin orange lines lose most of their colour. Coordinates are SVG units (pixel `i` covers `[i, i+1]`). Scripts: `work/bg.py`, `work/figs.py` (the four illustrations as functions), `work/make_replica.py`, `work/eval04.py`, `work/make_moneybee.py`.

## Canvas and background

| Item | Value | Method |
| --- | --- | --- |
| Background | neutral grey light streaks on black: R = G = B at every pixel, L 3–88 | max \|R − B\| over all background pixels = 0 |
| Its shape | a glow upper-left (L ≈ 59 near (120, 100)), black across the upper right (L 3–5 for x > 525, y < 125), a diagonal light band rising from lower-left (L ≈ 62 near (190, 430)) to the right edge (L ≈ 88 at (700, 325)) | medians in 35 × 25 cells outside the cards |
| Bottom row | y 452 is a 1 px light line (201) | row scan; a crop artifact |

The background is photographic, so the replica embeds it as a 245 × 151 smoothed raster (cards inpainted by diffusion on a 1/3 grid, Gaussian blur 2), MAE 0.66 on the known background pixels. Everything else in the replica is vector.

## Cards

| Item | Value | Method |
| --- | --- | --- |
| Count | 4 | |
| Fill | `#4B4B4B` (75,75,75), **opaque**, not translucent | the card interior reads exactly 75 over backgrounds from 5 to 64 |
| Size | **149.2 × 202.0** (ratio 0.739) | sub-pixel edges from edge-pixel coverage on row 140 and column 120 |
| Left edges | 43.91, 210.18, 376.20, 542.28 | same |
| Pitch / gap | 166.1 / **16.9** | differences 166.27, 166.02, 166.08 |
| Top / bottom | 125.43 / 327.43 | column 120 |
| Side margins | 43.9 left, 43.6 right (6.0% of width); the row is centred | |
| Corner radius | **about 4 px** | coverage deficit at the top-left corner 3.5 px² = (1 − π/4) r² |
| Padding | left **18.1** (17.8–18.8); title cap top 23 below the card top; link baseline 16 above the card bottom | component boxes |

## Typography (inside a card, card-relative)

| Role | Measure | Estimate |
| --- | --- | --- |
| Title | cap 6.8, x-height 5, baseline 29.5 (y 155), 1–2 lines at pitch 11 | about 9.6 px geometric grotesque, regular, near-white (peak 206; thin strokes) |
| Description | x-height 4, first baseline 15.5 below the last title baseline, pitch 10 | about 7.2 px, grey (peak 149) |
| Link "See Use Case" | cap 6, baseline 186 (y 311.5) | about 7.6 px, `#D2D2D2` class, followed by a 5.6 px outlined square icon at x 62 |

## Illustrations

Line colour `#F2F2F2` (99.5th percentile 244,242,243). Accent `#F47957` (244,121,87; median of 891 px with R > 200). Each card has exactly one orange element. Illustration centres sit on the card's vertical centre line (card-relative x 74.2–75.8 of 149.2) at y 241–250.

**1. Database cylinder** (card 1)
- Frame: rounded square, centreline x 84.83 → 152.5, y 207.05 → 274.9 (**67.7 × 67.85**), corner radius **12–14 (≈ 13)**, stroke **1.35**. Method: luminance-weighted peak positions on x = 118 and y = 240; corner radius from the stroke's position on each corner diagonal, r = d/(√2 − 1).
- Cylinder: centre x 118.45, **rx 21.35, ry 5.8** (ry/rx 0.27), top ellipse centre y 223.1; sides from the top ellipse down to the base; **three lower half-ellipse arcs every 11.87 px** (centres 234.97, 246.84, 258.71: white, **orange**, white base); stroke 1.36. Method: same peaks. The orange is the front arc only; the orange tint seen on the sides between y 236 and 250 is chroma bleed from where that arc meets the sides at y 246.8.

**2. Fan** (card 2)
- 7 lines. The middle one is straight and orange, from a left-pointing arrowhead (tip x 241, 4 px long, ±2.6 wide) to x 330.5 at y 250.03.
- 6 white curves, symmetric about the middle line, ending level at x 330.5 with offsets **±13.0, ±24.9, ±39.2** (gaps 13.0, 11.9, 14.3: not even).
- **All six are one curve scaled vertically**: the normalised offset is the same for every curve to within 0.004. Fitted as a cubic, M 260 250 C 298 250, 280.5 yE, 324.5 yE, then level to 330.5 (control offsets +38 and −44). rms 0.005 of the offset, 0.2 px on the outer curve. Method: luminance-weighted line centres in 17 columns, grid search over start, end and both control offsets.
- Stroke about 1 px, dimmer than the other illustrations (ink width 0.6–0.9 px against white).

**3. Burst** (card 3)
- Orange rounded square **21.2** (20.7 × 21.1), corner radius **5.6**, centre (450.48, 248.37). Method: orange mask area 410 px² against its width and height.
- **30 lines at 6° + 12k°** (none on the axes), all ending on a circle **r = 46** (45.75–46.5), running under the square. Method: runs above L 105 on circles r = 20, 28, 36, 42 (30 every time, spacing 12.00°).
- Each line ends in a **2.1 px terminal at r 44–46**; the width is a constant 0.86 px from r 16 to 43 with no widening near the square. So the lines radiate **out** from the square and end in dots or tiny outward heads (unresolved at 2 px). They do not point into it.

**4. Distribute** (card 4)
- Orange rounded square **24.4**, corner radius **6.0**, centre (576.5, 251.8).
- Three hollow rounded squares **16.6** (16.4–16.7), radius about 3, stroke 1.1, centres (638.6, 230.15), (660.1, 251.7), (621.0, 267.7).
- Three arrows from the orange square's right edge at **−17.7°, 0°, +17.1°**, filled heads about 3.6 long and 4.4 wide, each tip stopping **4–5 px short** of its target. Method: ASCII threshold map of the region, edge peaks.

Rules across the four: one accent per card; accent is either a solid rounded square (the subject) or a single line; white strokes 1–1.4 px; corner radius about a quarter of a small square's side (5.6/21.2, 6/24.4) and 0.19 of the large frame (13/68).

## Replica and diff

`replica.svg` (735 × 453) → Chrome (`replica.html`, Inter) → `replica.png`; `diff.png` (|diff| × 3, red = masked).

**Mask:** per card the title+description box (card x + 17 → + 140, y 146 → 193) and the link box (x + 17 → + 72, y 303 → 313), dilated 2 px, joined with the replica's text boxes dilated 2 px. 9.45% of the image.

| Metric | Value |
| --- | --- |
| MAE, text masked | **1.31** / 255 |
| Pixels with max-channel diff > 24, text masked | **0.88%** |
| Accent IoU, burst square | **0.976** |
| Accent IoU, distribute square | **0.953** |
| Accent IoU, cylinder arc / fan line | not meaningful: only 44 and 13 px of the original still read as orange after chroma loss. Their positions match by luminance instead: cylinder lines within 0.24 px at x = 118, fan lines within 0.4 px at x = 300 |
| White-line IoU (L > 150): cylinder / fan / burst / distribute | 0.71 / 0.68 / 0.80 / 0.75 (1 px strokes against a blurred source) |
| Unmasked MAE / > 24 | 2.73 / 2.66% |

The residue is the JPEG ringing that draws a dark halo around every white line in the original, the 1 px lines' softness, and the raster background's smoothing.

## Moneybee version

`moneybee.svg`, `moneybee.png`: five cards, same card size, radius, gap, margins and paddings, so the canvas grows to **901 × 453**. Meant to be shown at 2×.

- Black band `#000000`. Cards `#FFFFFF` at 18% (our track colour on black). Line art `#FFFFFF`. One `#F6A11A` element per card.
- Title = the term in Instrument Serif 12.5 (25 px at 2×) at the reference's title baseline. The value below in Rethink Sans 7.2, `#9D9EA1`, at the reference's description baseline and pitch. No link, no arrow icon.
- Illustrations, each built from the reference's own constructions (`work/figs.py`):
  - **Minimum investment, Rs. 1 crore:** the framed cylinder; the orange element is the base arc, the entry level.
  - **Suitable time frame, 3 to 5 years:** a 90 px axis with six year ticks (0–5); the orange element is the segment from tick 3 to tick 5.
  - **Investment in, listed and pre-IPO/unlisted:** the distribute figure; the orange square is the fund, two solid squares are listed holdings and one dashed square is unlisted.
  - **Benchmark, S&P BSE 500 TRI:** the fan; many lines become one, and the orange line is the index.
  - **Exit load, none:** the rounded frame with an open side; the orange arrow leaves through the opening.

## Remake as a React component

**Data-driven:** `terms: { title: string; value: string; figure: 'stack' | 'span' | 'distribute' | 'fan' | 'exit' }[]` from `lib/aif-v2.ts`, plus per-figure data: `span: { from: 3, to: 5, max: 5 }`, `distribute: { targets: ('solid' | 'dashed')[] }`, `fan: { lines: 6 }`.

**Layout:** HTML cards in a CSS grid (`repeat(auto-fit, minmax(149.2 × 2 px, 1fr))`, gap 16.9 × 2, radius 8, padding 36), title and value as text, the figure as an inline `<svg viewBox="-50 -50 100 100">` centred in the remaining height.

**Formulas:**
- fan: for offsets o_i, path `M x0 0 C x0+38 0, x1−44 o_i, x1 o_i L x2 o_i`; spread the offsets as ±13, ±25, ±39 (the reference) or evenly with the same outer ±39.
- span: tick k at x = −45 + 90·k/max; accent from −45 + 90·from/max to −45 + 90·to/max.
- stack: bands at y_top + 11.87·i for i = 1..3, each `M −rx y A rx ry 0 0 0 rx y`.
- distribute: arrows at −17.7°, 0°, +17.1°, heads 3.6 × 4.4, tips 4.5 px short of the target's left edge.

**Motion:** cards rise in on entering view, 80 ms stagger. Inside, line art draws on with `stroke-dashoffset` (`pathLength="1"`, 600 ms ease-out), then the one orange element appears last: the span segment grows from tick 3 to tick 5, the fan's orange line runs right to left into its arrowhead, the distribute arrows extend and the dashed square fades in, the exit arrow slides out through the opening. Under `prefers-reduced-motion: reduce`, render the final state with no transitions, and make that final state the server-rendered markup.
