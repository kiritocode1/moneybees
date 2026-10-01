# 08 Growing circles: measured spec

Source: `../08-growing-circles.png`, 736 × 552, sRGB. Coordinates are continuous pixels: pixel column `i` covers `[i, i+1]`, so a pixel centre is `i + 0.5`. Percentages are of the 736 px width unless stated. Scripts are in `work/` (`m1.py` to `m4.py`, `gen_replica.py`, `gen_moneybee.py`, `diff.py`, `render.sh`).

## Colours

| Role | Value | Method |
| --- | --- | --- |
| Paper | `#F2EFE8` | most common pixel, 303,122 of 406,272 px |
| Disc red | `#DF2914` | second most common, 30,584 px exact (50,243 px within the red class) |
| Arrow | white, 1 px | peak `#FFEDD5` on red; a 0.95 px line never reaches full white at this scale |
| Figure | `#121216` | median of 151 px with R+G+B < 200 inside the figure box |
| Figure shadow | black at about 85% over red | mean `(69,16,12)` over 129 px; darkest `#290B03` |
| Type | near-black `#161618` | glyph cores |

Class map for all red measurements: `alpha = ((px − paper)·(red − paper)) / |red − paper|²`, 0 on paper, 1 on red.

## Discs

Method: 720 rays from a rough centre, the `alpha = 0.5` crossing found by bilinear sampling at 0.05 px steps, then a least-squares (Kåsa) circle fit, refit after dropping residuals over 1 px. RMS residual 0.042–0.046 px on 543–620 edge points each.

| Disc | Centre (x, y) | Radius | Diameter | % of width |
| --- | --- | --- | --- | --- |
| 1 | 154.34, 195.21 | 34.62 | 69.25 | 9.41% |
| 2 | 243.88, 195.21 | 52.36 | 104.72 | 14.23% |
| 3 | 368.43, 195.20 | 70.10 | 140.19 | 19.05% |
| 4 | 528.45, 195.21 | 87.84 | 175.68 | 23.87% |

- **Growth is linear, not area-true.** The diameter step is 35.47 px every time (4.82% of width), radius step 17.74. The diameters sit near 2 : 3 : 4 : 5 of one step but start 1.7 px short (69.25 = 1.95 steps). Areas run 1 : 2.29 : 4.10 : 6.44, which encode nothing.
- **Gaps.** Edge to edge: 2.56, 2.09, 2.08 px (mean 2.24, 0.30% of width). Centre spacing 89.54, 124.55, 160.02 = r(k) + r(k+1) + gap.
- **Axis.** All centres on y = 195.21 ± 0.01, which is 35.4% of the height.
- **Horizontal centring.** The group spans 119.72 → 616.29, so its centre is 368.0, the canvas centre exactly. Side margins are 119.7 and 119.7 px (16.3%).
- The previously noted 67 / 103 / 138 / 174 px probably came from a stricter threshold. At the 50% edge they are 69.2 / 104.7 / 140.2 / 175.7.

## Arrows

Method: `w = clip((1 − alpha)/1.098)` (white projects to alpha −0.098). Per-row weighted centroid of each chevron arm in a box around the apex, then a line fit x = k·y + b for each arm, with the apex taken as the intersection of the two arms.

- **Line.** Mean column coverage 0.93–0.96, so about 0.95 px wide. Centre y = 195.12 (0.09 px above the disc axis). It starts at the disc's left edge: nothing measurable continues onto the paper, and 116–119 px on the left is JPEG ringing only. It ends at the apex.
- **Apex x − disc centre** = −0.72, −1.54, −0.67, −0.66 px. The tip sits on the disc centre, not at a fixed distance from the edge, so the line length is r − 0.7: 33.9, 50.8, 69.4, 87.2 px.
- **Chevron.** The same size in all four discs. Each arm runs 16.0–16.5 px back and 15.6–16.7 px up or down (the ends thin out in the threshold), at 44.2–44.9° from horizontal, so the design value is 45°. That makes an arm 23.3 px long, a chevron 33 px tall and 16.5 px deep. The chevron is 0.48 of disc 1's diameter and 0.19 of disc 4's, so its size does not scale with the disc.
- **Arm width** 0.80–0.86 px, the same stroke as the line.

## Figure (telescope on disc 4)

Method: a darkness map (paper → black on paper, red R channel → black on the disc), printed as ASCII art and read row by row (`work/figdark.npy`).

- **Height.** From the top of the head (y 77.0) to the feet (y 113.9) is 36.9 px, 6.7% of the image height and 21% of disc 4's diameter.
- **Feet.** Centred at x ≈ 523.0, which is 5.5 px left of the disc centre. They stand 6.5 px inside the disc's top edge (the disc top is y 107.37), so the disc reads as ground seen slightly from above.
- **Head.** An ellipse at (521.0, 80.2), rx 2.3, ry 2.9.
- **Telescope.** A 1.7 px bar from (524.2, 79.6) to (534.1, 76.3), rising about 20°, with its tip at (534.1, 76.3).
- **Arm.** The upper arm is horizontal at y 83.7–85.5 from x 518 to 529.4. The forearm rises at x 527.5–529 to the telescope.
- **Body.** 7 px wide (517.3–524.3) from y 86 to 97. Legs 4–5 px wide down to y 113.9, with a hairline gap between them.
- **Shadow.** Cast to the right and down the disc face, from the feet to x 584, a length of about 62 px (1.7 × the figure height). It drops 9–10 px over that length (≈ 9° below horizontal) and is 2–3 px thick, with a small blob at its far end (the telescope's shadow). It is clipped to the disc.

## Type and columns

Method: an ink map `(L_paper − L)/(L_paper − 25)` below y = 300. Row bands come from the row sums, column extents from ink columns above 0.3.

- **Column left edges** (first ink) are 123, 213, 337 and 497 px. Minus each disc's centre that is −31.3, −30.9, −31.4, −31.45. **Each text column starts 31.3 px left of its own disc's centre** (0.904 × r1), so column 1 starts 3.3 px inside disc 1's left edge and every other column keeps the same offset from its disc centre. Columns are not spaced evenly (90, 124, 160 px): they inherit the disc spacing.
- **Common top line.** The numerals' cap tops sit at y 328.4 in every column, 45.3 px below the largest disc's bottom (283.05). The text does not follow each disc's own bottom.
- **Numerals** "01"–"04": figure height 13.0 px (328.4 → baseline 341.3), a heavy grotesk about 18 px, black weight, 20–23 px wide.
- **Heading** "Lorem ipsum / dolor": cap height ≈ 7.6 px, x-height ≈ 5.2, so about 10.5 px semibold. Baselines are at 358.2 and 373.2 (line pitch 15.0, 1.43), and the lines are 52 px wide.
- **Body.** Two paragraphs of 6 lines. The x-height is ≈ 2.7 px, so about 5 px regular, with a line pitch of 6.2 px. First baselines are at 387.6 and 436.4, 48.8 apart (6 lines plus an 11.6 px gap). The measure is 58–63 px (≈ 8% of width).
- **Rhythm.** From the numeral baseline to the heading baseline is 16.9 px. From the heading's second baseline to the first body baseline is 14.4 px.
- **Vertical centring.** The figure's top (77) to the last body line (471.5) centres at 274.3, against a canvas centre of 276. The whole composition, figure included, is centred vertically.

## Replica (`replica.svg`, `replica.png`, `diff.png`)

The replica uses the measured disc centres and radii, the arrow model above, a traced polygon for the figure and shadow, and text in Inter Tight 800/600/400 at the measured sizes, with tracking tightened until the word widths matched to within 2 px. It was rendered in Chrome with agent-browser at 736 × 552, DPR 1.

| Metric | Text masked | Unmasked |
| --- | --- | --- |
| Mean absolute error (0–255, RGB) | **0.72** | 2.20 |
| Pixels differing by more than 24/255 | **0.94%** | 2.91% |
| IoU of the red disc mask (alpha > 0.5) | **0.9949** | 0.957 |

- **Text mask.** One rectangle, x 110–580 × y 320–480, covering all four text columns.
- **Unmasked IoU.** Dark text also classifies as "red" on the paper→red axis, which is why the unmasked IoU drops.
- **Residual error** is JPEG ringing along every disc edge (1 px), antialiasing of the 0.95 px arrow lines, and the hand-traced figure outline.

## Moneybee (`moneybee.svg` / `moneybee.png`, `moneybee-linear.svg` / `moneybee-linear.png`)

Both variants are 736 × 552 on `#FFFFFF`. They keep the same axis rule, the 2.24 px gap, centring, the arrow (a 0.95 px white line from the disc edge to 0.68 px short of the centre, with 16.5 px arms at 45°), columns at cx − 0.91·r_smallest, a 45.3 px gap from the largest disc to the first cap, and a vertically centred composition.

- **Area-true** (`moneybee.svg`):
  - **Discs.** d ∝ √value, with d1 = 60 px, so the diameters are 60, 146.60 and 322.27 (1 : 2.443 : 5.371).
  - **Colours.** Rs. 1 Mn invested in Aug 2007 is grey `#9D9EA1`. Rs. 5.97 Mn in the S&P BSE 500 TRI is black. Rs. 28.85 Mn in Moneybee PMS by Jul 2026 is the one orange disc, with the figure on it.
  - **Type.** Values are in Instrument Serif 27 px, and the labels in Geist Mono 9.5 px on two lines (name, date).
  - **Figure.** It stays at its measured human size (36.9 px) rather than scaling with the disc, so it keeps working as a scale reference.
  - **Reading.** The three discs are not a chain: 5.97 does not grow into 28.85. The arrows keep the reference's "time moves right" reading inside each disc, and the labels name the two outcomes of the same Rs. 1 Mn. If this reads as a chain in review, drop the arrow from disc 2.
- **Linear** (`moneybee-linear.svg`):
  - **Discs.** 140, 176 and 212 px (a +36 px step, the reference's 35.47 rounded). The first two are black and "Under-estimated" is orange with the figure.
  - **Type.** Numerals "01"–"03" in Instrument Serif 30 px, stage names in Instrument Serif 21 px.
  - **Why this size.** It starts at 140 rather than 104 so that "Under-researched" fits between column 1 and column 2, which are 160 px apart.

## Remake as a React component

```ts
type Stage = { value: number; label: string[]; display: string; tone: "grey" | "ink" | "accent" };
type Props = { stages: Stage[]; scale: "area" | "linear"; unit: number; step?: number; figureOn?: number };
```

**Geometry, all derived from the data:**

- **Diameter.** For area scaling, `d_i = unit · √(value_i / value_0)`. For linear scaling, `d_i = unit + step · i` (the reference is unit 69.25 and step 35.47; ours is 140 and 36).
- **Centres.** `cx_0 = (W − Σd − gap·(n−1))/2 + d_0/2`, and `cx_i = cx_{i−1} + d_{i−1}/2 + gap + d_i/2`, with `gap = 0.003·W`.
- **Axis.** `cy = top + figureHeight − 6.5 + r_max`, where `top = (H − composition)/2` and `composition = figureHeight − 6.5 + 2·r_max + 45.3 + textBlock`.
- **Arrow.** A line from `cx − r` to `cx − 0.68`. The chevron points are `(apex − 16.5, cy ∓ 16.5)`: fixed, not scaled.
- **Text column.** `x_i = cx_i − 0.91·min(r)`. The cap top is at `cy + r_max + 45.3`.
- **Figure.** The feet go to `(cx − 5.5, cy − r + 6.5)`. The figure is clipped to the disc, and its shadow is clipped by the same `clipPath`.

**SVG structure:**

```text
svg[role=img aria-label]
  defs > clipPath#clip-i (one per disc)
  g.disc*
    circle
    g[clip-path] > line + polyline
  g[clip-path=last] > path.shadow
  g.figure
  g.column*
    text.value
    text.label*
```

**Motion**, driven by scroll with `IntersectionObserver` or a scroll timeline:

1. Discs scale from 0 to 1 about their own centres, left to right, 90 ms apart, over 420 ms with `cubic-bezier(.2,.7,.2,1)`. The area-true variant must animate the radius (`r`), not a transform scale on the group, so that the gaps stay 2.24 px while it grows.
2. Each arrow line draws on with `stroke-dashoffset` (length r − 0.7) once its disc has landed, and the chevron fades in during its last 80 ms.
3. The figure and shadow fade in (opacity 0 → 1, y +4 → 0) after the last disc.
4. The columns fade in and rise 6 px, 60 ms apart.

Under `prefers-reduced-motion: reduce`, render the static final state with no transitions. The static SVG is the source of truth, and the animation only interpolates toward it.
