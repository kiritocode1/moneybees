# 02 Unit8 circle posters: measured spec

Source: `../02-unit8-circles.png`, 736 × 992, a mockup of four posters on a `#000000` ground. Coordinates are continuous pixels: pixel `i` covers `[i, i+1]`. "Local" means measured from the poster's own top-left corner. Percentages are of the poster width (≈ 300 px) unless stated. Scripts are in `work/` (`p1.py` to `p6.py`, `rings.py`, `gen_replica.py`, `gen_moneybee.py`, `run_diff.py`).

## The photo and its perspective

Method: for every third row and column, the sub-pixel crossing of half the poster level at each edge. The medians and linear drift are in `work/posters.json`.

| Poster | Left | Right | Top | Bottom | W × H | H/W |
| --- | --- | --- | --- | --- | --- | --- |
| 1 building blocks | 55.67 | 356.00 | 55.89 | 476.29 | 300.33 × 420.40 | 1.400 |
| 2 team | 379.67 | 678.72 | 55.88 | 476.34 | 299.06 × 420.46 | 1.406 |
| 3 cooperation | 55.90 | ≈355.3* | 497.63 | 918.53 | ≈299.4 × 420.90 | 1.406 |
| 4 impact | 379.67 | 678.72 | 499.53 | 920.28 | 299.06 × 420.75 | 1.407 |

\*Poster 3's right edge sits under a paper-edge highlight at x 356–357 (lum 113); its left edge has a separate highlight line at x ≈ 51.

- **No measurable perspective or rotation.** Edge drift is at most 0.005 px per 3 px sample, so less than 0.7 px over 420 px, and most edges show less than 0.001. A general conic fit to every ring gives axis ratios of 1.000–1.002.
- **The "photo" is shading only.** Fold creases vary the poster black by ±5 levels (lum 17–32 around 23–28), and there are thin paper-edge highlights (poster 1's top at y 50–51, poster 3's left and right).
- **How I handled it.** Each poster is an axis-aligned rectangle, so no unwarping was needed. I rebuilt each one flat at its measured rectangle and diffed crops inset by 2 px from each edge, which keeps the edge highlights out. The fold shading stays in the error.
- **Format.** The posters are 1 : 1.40–1.41, the A-series ratio (1.414) to within 1%.
- **Gutters.** 23.7 px between columns (356.0 → 379.67) and 21.3–23.2 px between rows.

## Colours

| Role | Value | Method |
| --- | --- | --- |
| Ground | `#000000` | most common pixel, 203,434 px |
| Poster 1 black | `#1C1C1C` | median inside poster 1 |
| Posters 2–4 black | `#181816` | median inside each |
| White print | `#E1E1E1` median (p10 `#D5D5D5`, p90 `#F1F1F1`) | glyph cores of the big words (3×3 erosion of lum > 150), 684–1,498 px per poster |
| Filled disc, row 1 | `#E4E4E4` | median of r < 26, flat to ±3 levels, 2,100 px |
| Filled disc, row 2 | `#D2D2D2` | median, flat ±3, 18 levels darker: a second tint, not shading |

## Shared poster grid (local)

Method: bounding boxes and row/column coverage profiles of lum > 90 (> 70 for small text).

- **Margins.** The logo sits at x 20.3, y 20.1–33.1. The tag's right edge is at W − 19.3. Both give a 20 px margin, 6.7% of the width.
- **Logo** "Unit8.": cap height ≈ 11.5 px (20.7 → 32.2), about 41 px wide (13.7%).
- **Tag** "digital natives": ink height 4.5 px (so about 6 px type), right-aligned. It is vertically centred on the logo (tag centre 26.3, logo centre 26.5).
- **Big word:**
  - **Baseline.** The last line sits on 391.6 local in all four posters (391.2–393.1; poster 3 reads 1.5 px low because its top edge is a highlight). That is 93.2% of the height, 28.8 px from the bottom.
  - **Size.** x-height 23.0 px and ascender 30.7 px (both poster 1's "blocks" and poster 4), which makes a neo-grotesk of about 42 px (14% of width) in a medium weight. Letter-spacing is slightly tight.
  - **Line pitch.** 45.9 px on the two-line word (1.09 × 42).
  - **Left edge.** At 18–23 px depending on the first glyph, so optically on the 20 px margin.
  - **Widths.** "building" 153, "team" 103, "impact" 152 px. "cooperation" runs to about 262 px, up to the URL column.
- **URL** "unit8.com": rotated −90° (reading bottom to top), about 6 px type, 30 px long. It starts at y 391.6, on the big word's baseline, and its baseline sits at x = W − 22.1.
- **Figure zone.** The grid figures (posters 1 and 2) are centred at y = 170.0 local (40.4% of the height), with top edges at 79.7 and 81.7. The large figures (posters 3 and 4) fill y 71.5–327.7. Every figure is centred on the poster's vertical axis to within ±1 px, except poster 4's diagonal, which runs from x 30.0 to 277.1.

## Figures

Method for rings: 720–1,440 rays per ring, a bright-profile centroid inside a ±3–5 px window, and a Kåsa circle fit refit at 3σ. Rays whose integrated width is outside 0.6–1.4 × the median (crossings) are dropped. The stroke is the integrated coverage divided by the peak. Method for filled discs: the half-level edge crossing plus a circle fit.

### Poster 1: building blocks (4 × 3)
- **Centres.** Local x 60.48, 120.46, 180.46, 240.43, a pitch of 59.98 (20.0% of width). Local y 109.77, 170.1, 230.23, a pitch of 60.2.
- **Rings.** Centreline r = 28.96 (±0.03). Stroke 2.17–2.27, median 2.19 px (0.73% of width). The outer radius is 30.06, which is half the pitch, **so neighbouring rings are exactly tangent at their outer edges**.
- **Filled discs.** Column 2, rows 1 and 2, r = 30.04 and 30.06: they fill to the ring's outer edge and have no stroke of their own.
- **Grid box.** Local x 30.4 → 270.5 (10.1% and 9.9% margins, 80% of width), y 79.7 → 260.3.

### Poster 2: team (3 × 2)
- **Centres.** Local x 76.07, 149.37, 222.88 (pitch 73.40, 24.5%) and y 133.11, 206.8 (pitch 73.6).
- **Rings.** r = 50.37 (±0.01), stroke 2.11–2.17 (median 2.14). RMS 0.04–0.08 px.
- **Overlap.** 2r − pitch = 27.3 px, 27.1% of the diameter (not the 30% previously estimated).
- **Junctions.** r / pitch = 0.686. An exact four-way meeting would need 0.707. The horizontal neighbours cross 2.3 px short of the row midline, so each four-ring junction is a small open diamond about 4.6 px tall, not a single point.
- **Group box.** Local x 24.6 → 274.3, y 81.7 → 258.1, centred at (149.4, 169.9).

### Poster 3: cooperation (2 rings)
- **Centres.** Local (150.21, 157.15) and (150.22, 244.94). The rings are stacked vertically on the poster's axis.
- **Rings.** r = 81.72 both (equal to 0.01 px), stroke 2.14.
- **Overlap.** Centre distance 87.79 = 1.074 r. The overlap is 75.65 px, **46.3% of the diameter**. The lens chord is 137.9 px wide, and the crossing points sit at ±68.9 px from the axis.
- **Figure box.** Local y 74.4 → 327.7 (centre 201.0).

### Poster 4: impact (13 rings, not 12)
- **Search.** Median brightness on circles of the front ring's radius, sampled along a 45° line, peaks every 11.5 px. There are 13 peaks, and nothing past t = 140.
- **Rings.** All 13 have r = 73.64 (±0.02) and stroke 2.09–2.24.
- **Front ring** (top right, brightest): local centre (202.44, 146.16).
- **Step.** Each ring behind it is offset by (−8.145, +8.155): 11.53 px at exactly 45.0° down-left. That is 0.157 r per step and 138.3 px in total.
- **Levels.** Peak lum per ring, front to back: 238, 221, 203, 185, 168, 152, 137, 119, 104, 87, 71, 55, 39. That is linear, and the model `bg + (N − k)/N · (white − bg)` with N = 13 fits every ring to within ±3 levels.
- **Per ring, not a gradient.** Peak brightness sampled every 15° around each ring, away from crossings, has no front-to-back trend (ring 9 reads 85 at 135° and 85 at 315°).
- **Opaque greys, not transparency.** Crossings do not add up. Modelling the rings as opaque grey strokes drawn back to front, instead of white at a stroke-opacity, cut the pixels off by more than 24 from 0.92% to 0.38% and raised the IoU from 0.882 to 0.910.
- **Figure box.** Local x 30.0 → 277.1, y 71.5 → 318.8.

## Replica (`replica.svg`, `replica.png`, `diff.png`, `diff-1…4-*.png`)

The replica is a composite at 736 × 992: four flat posters at their measured rectangles, rings at the fitted values, and a 2.15 px `#E6E6E6` stroke. Text is Inter (500 at 42.2 px for the word, 600 for the logo, 6.2 px for the tag and URL). It was rendered in Chrome at DPR 1, and each diff is taken on a crop inset 2 px inside a poster.

- **Text mask**, per poster in local coordinates: the logo (14,14)–(70,40), the tag (W−62,18)–(W−14,34), the URL (W−30,352)–(W−18,398), and the word from (12, top) to (right, 404).
- **Shape mask** is lum > 128.
- **1-px-tolerant F** counts a ring pixel as matched when the other image has ring within 1 px.

| Poster | MAE (text masked) | > 24/255 | IoU (lum > 128) | 1-px-tolerant F | MAE / > 24 unmasked |
| --- | --- | --- | --- | --- | --- |
| building blocks | 2.09 | 0.89% | **0.975** | 1.000 | 8.15 / 4.99% |
| team | 1.91 | 0.32% | **0.967** | 1.000 | 4.78 / 2.22% |
| cooperation | 1.46 | 0.21% | **0.964** | 1.000 | 6.97 / 3.85% |
| impact | 2.56 | 0.38% | 0.910 | 0.992 | 4.84 / 2.14% |
| composite (whole image) | 1.81 | 0.83% | 0.955 | | |

- **Where the error is.** Masked MAE is almost entirely fold shading (±5 levels over the whole poster). The unmasked error is font mismatch: I don't have Unit8's typeface, and Inter is wider and lighter in the logo.
- **Impact misses 0.95 IoU.** A lum > 128 threshold on 2 px rings whose levels fall through 128 at rings 6–7 is unstable. The remaining misses sit on the two 45° envelope tangents, where the 13 rings run within 1–2 px of each other and blur into a solid band in the pin. The 1-px-tolerant F of 0.992 shows the geometry is right.

## Moneybee (`moneybee.svg`, `moneybee.png`)

The layout is 736 × 992 on white, with four `#000000` bands of 300 × 420 at the posters' rounded positions (56/380 × 56/498). Each keeps the poster grid: "Moneybee" in Instrument Serif 17 px at 20/31 as a stand-in until the real logo asset is used, "0N / 04" in Geist Mono 7 px right-aligned at W − 20, "moneybee.in" vertical in Geist Mono with its baseline at W − 22 starting on the word baseline 391.6, and the word in Instrument Serif 48 px at x 19.

1. **portfolio.** A 10 × 7 universe of 70 rings at a 24 px pitch, filling the same 240 × 168 box as the reference grid, with outer edges tangent (a 1.3 px stroke at this density). **18 are filled orange**, inside "approximately 15–20 high-conviction stocks". The filled ones are placed by a seeded random pick, so the pattern reads as selection rather than a block.
2. **PMS · AIF.** The cooperation pair, turned horizontal so neither sits on top: two identical rings (r 81.72, stroke 2.15, centre distance 87.79, overlap 46.3%). The shared lens is the one orange element. "PMS" and "AIF" are the same size and weight, centred in each crescent.
3. **team.** Six rings in the team grid (pitch 73.4). The radius is set to pitch/√2 = 51.9 so that the four rings meet at one point, and those two meeting points are the orange accent (r 4 dots). This changes the reference by +1.5 px of radius.
4. **compounding.** The impact trail as measured: 13 rings, r 73.64, a (−8.145, +8.155) step, and opaque greys (N − k)/N from black to white. The front ring is the orange one.

## Remake as a React component

```ts
type Panel =
  | { kind: "grid"; cols: number; rows: number; picked: number[] }
  | { kind: "pair"; labels: [string, string] }
  | { kind: "lattice"; cols: number; rows: number }
  | { kind: "trail"; count: number };
type Props = { panels: { word: string; figure: Panel }[] };
```

**Panel frame** (viewBox 300 × 420): margins 20, word baseline 391.6, word size = 0.16 · W in Instrument Serif, URL baseline at W − 22, figure centre y = 170 for grid, pair and lattice. The trail spans 71.5–318.8.

**Figures:**

- **grid.** `pitch = 240 / cols`, and `r_centerline = pitch/2 − stroke/2` (tangent). A picked cell is a filled disc of r = pitch/2.
- **pair.** Both radii are `R = 0.272 · W`, and the centre distance is `1.074 · R` (overlap 46.3%). The lens is the second circle clipped by the first.
- **lattice.** `pitch = 0.245 · W` and `r = pitch / √2` for an exact four-way meeting. Accent dots go at `(midpoint of adjacent columns, row midline)`.
- **trail.** `R = 0.246 · W`, step `0.157 · R` at 45°. Ring k's grey is `mix(bg, fg, (N − k)/N)`. Draw back to front, with k = 0 as the accent.

**SVG structure:**

```text
svg[role=img]
  g.panel*
    rect
    g.figure
    text.brand
    text.index
    text[transform=rotate(-90)].url
    text.word
```

Keep strokes in user units that scale with the viewBox. Use `vector-effect: non-scaling-stroke` only if the panels must keep 2.15 px at every size.

**Motion:**

- **grid.** Rings draw on (`stroke-dashoffset` from 2πr to 0) in reading order, 12 ms apart. Then the picked discs scale from 0 to 1 about their centres, in orange, 25 ms apart.
- **pair.** Both rings draw on together, starting at their outer sides, over the same duration so neither leads. The lens fades in last.
- **lattice.** The rings draw on, then the two dots pop in.
- **trail.** Rings appear back to front, each fading from 0 to its final grey. The group translates along the 45° step as they arrive, and the orange front ring lands last.

Under `prefers-reduced-motion: reduce`, render the final state with no animation. The static SVG is the end frame.
