# 01 Radial wedges: measured spec

Source: `../01-radial-wedges.png`, 1179 × 1191, RGBA with alpha 255 everywhere (a phone screenshot). All coordinates are SVG user units where pixel column `i` covers `[i, i+1]`, so a pixel centre is `i + 0.5`. Angles run clockwise from 12 o'clock. Scripts that produced every number are in `work/` (`polar.py`, `radial.py`, `fit_edges.py`, `fit_outer.py`, `colors.py`, `text.py`, `make_replica.py`, `eval01.py`).

## Canvas

| Item | Value | Method |
| --- | --- | --- |
| Page | `#232323` (35,35,35), sd 0 over 819,377 px | median of all pixels with r > 420 and y < 1165 |
| Bottom bar | `#0A1015` (10.4,15.9,20.7) from y = 1171.6 to 1191 | row scan at x = 100 and 600; mean of rows 1173–1190. It is the phone's UI bar, not part of the design |
| Chart centre | (589.5, 584.2) = 50.0% of width, 49.05% of height | sub-pixel darkness centroid of the vertical gap over rows 340–820 (x = 589.5, sd 0.01) and of the horizontal gap over x 220–520 and 660–960 (y = 584.15) |
| Check on centre | all eight gap angles land on k × 45° within 0.1° | polar unwrap about the centre (0.1° × 0.5 px), darkness centroid in ±6° windows at r = 100, 200, 250, 380 |

## Construction (the key finding)

Every wedge is a **pie slice from the centre**, not an annular sector. There is no drawn hole. The dark centre is what remains when the apex of each 45° slice is rounded.

- 8 sectors of 45°, starting at 0° (12 o'clock).
- Each sector holds two shapes with the same side lines: a full-length **track** and a **value** wedge on top.
- **Gap between sectors: 2.3 px**, parallel-sided (each side inset 1.15 px from the ray). Method: mid-level (126) crossings across the vertical gap at y = 400 and 700 give 588.33 → 590.67; the darkness-integral width of the gap is 1.6–1.9 px at r = 100, 200 and 250, constant with radius, so the gap is parallel, not angular. The apex fit alone prefers 1.8 px (rms 0.06 vs 0.08 px), so the gap is 1.8–2.3 px; I used 2.3.
- **Apex rounding: circle of radius 31.5–32 px** tangent to both side lines, centre on the bisector at (ρ + h)/sin 22.5° = 85.9 px. Method: least-squares fit of the hole boundary (mid-level 126 crossing) against angle, averaged over all 8 sectors, 165 angles: ρ = 31.95, h = 0.90, rms 0.06 px; with h fixed at 1.15, ρ = 31.5, rms 0.09 px.
- **Visible hole radius on the bisector: 53.9 px** (4.57% of width) = 85.9 − 32. It is not a circle: it rises to 71.9 px at 21° off the bisector (measured), giving the eight-pointed dark star.
- **Track outer radius: 391.6 px** (33.2% of width). Median of the five clean fits 391.44–391.85 (track-to-page crossing at level 62, ±22° off the bisector).
- **Outer corner radius: tracks 30 px, value wedges 29 px** (27.5–29.5 by wedge; the smallest wedge fits 27.5). Method: circular fillet tangent to the outer arc and the inset side line, fitted per wedge to 340–447 boundary samples; rms 0.11–0.36 px on the clean fits. So in effect **one corner radius, about 30 px, is used for every corner, apex included**.

## Value wedge radii and the mapping

| Sector (bisector) | Value | Outer radius (px) | Fit rms of the boundary |
| --- | --- | --- | --- |
| Happiness (22.5°) | 12 | 361.02 | 0.11 |
| Awe (67.5°) | 10 | 321.75 | 2.49 (text crosses the edge) |
| Admiration (112.5°) | 5 | 282.57 | 0.36 |
| Surprise (157.5°) | 12 | 360.87 | 0.12 |
| Sadness (202.5°) | 6 | 277.92 | 0.18 |
| Fear (247.5°) | 4 | 219.34 | 0.21 |
| Anger (292.5°) | 2 | 167.06 | 0.21 |
| Anticipation (337.5°) | 5 | 282.42 | 0.26 |

Method: value-to-track crossing at level 153, accepted only where 6 samples before are > 175 and 10–16 samples after lie in the track band 55–125 (this rejects the dark text), median over bisector ±12°.

The two 12s agree to 0.15 px, so placement is repeatable. The mapping is not a formula:

| Model | rms residual | Worst residual |
| --- | --- | --- |
| linear r = 169.3 + 16.41 v | 21.5 px | 35.0 |
| length from centre r = 35.6 v | 79.9 | 104.6 |
| length from hole r = 53.9 + 29.49 v | 56.7 | 81.2 |
| area from centre r = 109.6 √v | 23.3 | 37.5 |
| area of visible annulus r² = 53.9² + 11152 v | 22.2 | 40.4 |
| r = 62.6 + 86.8 √v | 16.6 | 26.0 |
| log r = 94.3 + 105.7 ln v | 13.4 | 21.5 |
| r = 37.6 + 92.9 √v, fitted without the two 5s | 6.8 | 12.7 |

**Verdict:** hand-placed. The two 5s (282.5 px) are drawn longer than the 6 (277.9 px), so no increasing function fits. Without them the closest family is square-root (area-like). Area-true from the centre would put a 5 at 245 px, so the 5s are about 37 px (15%) too long. Do not copy the mapping.

## Colour

| Element | Value | Method |
| --- | --- | --- |
| Value fill | linear gradient `#EDE3CB` at (173.4, 218.7) → `#CFC7EA` at (1005.6, 949.7), axis 41.3° below horizontal (top-left warm to bottom-right lilac) | per-channel least squares rgb = c0 + gx·x + gy·y over 215,057 interior value pixels; rms 3.3 per channel. The gradient directions are R 39.7°, G 41.6°, B 43.3°, averaged. It is one gradient across the whole chart (per-sector medians follow it), not one per wedge |
| Track fill | **the same gradient at 29.5% opacity** over `#232323` | least-squares α between track pixels and the value gradient predicted at the same positions: α = 0.295 (R 0.295, G 0.292, B 0.296), rms 2.3, identical to a free linear fit's rms 2.28. Mean track colour `#5B5759` |
| Text | `#1A1616` class near-black (darkest 8% median (20,14,14) on value, (30,28,27) on track, thin strokes do not reach full ink) | per-text-box darkest 8% median |

## Typography

Family class: neo-grotesque, SF Pro-like. Inter was used in the replica. Ink coverage against Inter renders at 400/500/600: 500 gives ratios 0.96–1.06 for numbers and 0.91–1.03 for labels, so **weight 500 (medium)** for both. Original labels are 4% narrower than Inter 500 (SF Pro Text metrics or −0.5 px tracking); original digits are 5% wider.

| Role | Cap/figure height | Size (Inter) | Baselines (y) |
| --- | --- | --- | --- |
| Number | 27.3 px (rows 267–294) | 37.5 px | 294, 484, 674, 863.5 (pitch 190) |
| Label | 15.6 px | 21.4 px, tracking −0.5 | 326, 516, 705, 895 |

Number baseline to label baseline: 32 px. Number to label size ratio by cap height: 1.72 (not 3×).

Text is centred (`text-anchor: middle`) on four fixed columns x = 314.8, 472.0, 705.3, 864.5 (26.7%, 40.0%, 59.8%, 73.3% of width; ±275 and about ±117 from the centre). The blocks sit on an axis-aligned grid, not on the bisectors: block centres are at r = 292 (±2.9° off the bisector) and r = 310 (±0.4°). The grid's vertical centre is y = 581, 3 px above the chart centre. Two labels (Anticipation, Admiration) and the 6 straddle the value/track edge, which the original ignores; dark text on the track reads at about 2.5:1.

## Replica and diff

`replica.svg` (1179 × 1191), rendered in Chrome through `replica.html` (Inter 500 from Google Fonts) to `replica.png`. `diff.png`: grey = |diff| × 3, red tint = masked text.

**Mask:** bounding boxes of the 16 text components found in the original (dark pixels inside the modelled value wedges below L 150, or inside tracks below L 62, connected-component grouped), dilated 5 px, joined with the replica's own text boxes dilated 3 px. 2.21% of the image.

| Metric | Value |
| --- | --- |
| MAE, text masked | **0.65** / 255 |
| Pixels with max-channel diff > 24, text masked | **0.41%** |
| Value wedge mask IoU (L > 153) | **0.9958** |
| Track + value mask IoU (L > 62) | **0.9960** |
| Unmasked MAE / > 24 | 0.89 / 0.72% |

The residue is the original's sharpening halo along every edge (the value edges overshoot to 225 against a 218 interior) and JPEG ringing in the gaps, which dip to 26 against a 35 page.

## Moneybee version

`moneybee.svg`, `moneybee.png` (1179 × 1191, meant to be shown at 50%, about 590 px wide).

- Black band `#000000`. Tracks `#FFFFFF` at 18% (`#2E2E2E`). Value wedges `#FFFFFF`; **Renewable Energy is the one orange wedge** `#F6A11A`. Text `#000000` on the wedges (black on orange about 10:1). Flat colours: our system has no gradient.
- **Five 72° sectors**, the first centred on 12 o'clock, clockwise in descending order. No "Other" sector: the remaining 50.57% would need a scale four times larger.
- Same track radius (391.6), gap (2.3) and a **single 30 px corner radius for every corner including the apex**, which is the reference's own rule. With 72° slices that rule leaves a 23 px hole, not 54.
- **Mapping: area-true to the drawn shape.** The track stands for 15% of portfolio. Each value wedge's radius was solved by bisection so its drawn area (shoelace area of the rounded path) is v/15 of the drawn track area. Radii: 12.2 → 353.71, 11.74 → 347.09, 8.97 → 304.17, 8.72 → 300.00, 7.8 → 284.10. The closed form r² = 45.1² + (391.6² − 45.1²)·v/15 matches all five within 0.01 px.
- Heading "Top 5 - Sector Allocation (%)" in Instrument Serif 56 (28 px at 50%). Numbers Instrument Serif 76 at r = 205 on each bisector; labels Geist Mono 22 (11 px at 50%), uppercase, tracking 0.1em, broken onto two lines where a label is wider than the wedge.

## Remake as a React component

**Data-driven:** `sectors: { label: string; value: number }[]` from `lib/*`, `scaleMax` (default 15, the value the track stands for), `accentIndex` (default 0, the largest), `startAngle` (default −span/2), plus geometry constants `R = 391.6/1179` of the width, `cornerRadius = 30/1179`, `gap = 2.3/1179`.

**Formulas** (unit circle scaled to the SVG viewBox):
- span = 360/n; sector k covers [start + k·span, start + (k+1)·span].
- side line inset h = gap/2; apex cap: circle of radius rc tangent to both sides, centre at (rc + h)/sin(span/2) on the bisector.
- outer fillet centre: s·u + (h + rc)·n with s = √((R − rc)² − (h + rc)²), u the side direction and n its inward normal; tangent points are s·u + h·n on the side and R·f/|f| on the arc (see `work/geom.py`, `wedge()`).
- value radius: r(v) = √(r0² + (R² − r0²)·v/scaleMax), r0 from the apex cap (45.1 for n = 5, rc = 30). Recompute r0 once per n and rc with the shoelace bisection in `work/make_moneybee.py`, or solve it at build time.

**SVG structure:** `<svg viewBox>` → `<g>` of n track `<path>`s at 18% white → n value `<path>`s (one with `fill="var(--color-honey)"`) → labels. Render the labels as HTML over the SVG, positioned in % from the same polar formula, so the `EYEBROW` class and Instrument Serif size stay in CSS pixels whatever the chart's width. Give the `<svg>` `role="img"` and an `aria-label` listing every sector and value; hide the drawn numbers from assistive tech to avoid double reading.

**Motion:** on entering view (`useInView`, once), each value wedge grows from r = apex radius to r(v): animate a single number t from 0 to 1 and rebuild the path at r = r_apex + t·(r(v) − r_apex); do not scale the path, because scaling would shrink the corner radii. Stagger 80 ms clockwise from the accent wedge, 700 ms, ease-out `cubic-bezier(.2,.7,.2,1)`. Numbers fade in as their wedge passes 60%. Tracks are static. Under `prefers-reduced-motion: reduce`, render t = 1 immediately with no transition; the static SVG is also the server-rendered markup, so the final state is the default and motion is an enhancement.
