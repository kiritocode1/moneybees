# 09 Process diagram sheet: measured spec

Source: `../09-process-diagram-sheet.png`, 564 × 1056. Coordinates are continuous pixels: pixel `i` covers `[i, i+1]`. Scripts are in `work/` (`meas.py`, `rings.py`, `s1.py`, `gen_replica.py`, `gen_moneybee.py`, `run_diff.py`).

## Scale and line weight

The pin is a downscale of a larger sheet, so every 1 px source line arrives as a grey blur. I measured lines by their **integrated darkness**: the sum over the line's cross-section of (242 − L), in levels·px.

| Class | Integrated darkness | Apparent line | What it is at source | Method |
| --- | --- | --- | --- | --- |
| Ink line (rings, arrows, boxes) | 93 | 1.31 px at `#ABABAB` | 0.49 px of `#333333`, a hairline at 2× | ring fitter: integral ÷ peak (1.30–1.35 px, peak lum 158–172) |
| Rule, leader, baseline | 69–71 | 1.5 px at `#C4C4C4` | lighter grey hairline | three-row profile 229 / 199 / 229 at y 69–71 |
| Dotted | 88 per px averaged | dots 1:1 | same weight as the ink line | autocorrelation of the row or arc profile |
| Fill | | `#333333` | nodes, square, core | median of 7×7 blocks; 11,489 px with lum < 80, median 51 |
| Paper | | `#F2F2F2` | | most common pixel, 465,969 of 595,584 |

- **Dot period**, from the first autocorrelation peak: 2.19 px on straight connectors and box edges, 2.30 px along the targeting ring's arc, and 2.35 px along the half-rings. That is roughly 1.1 px dots with 1.1 px gaps, so at source a 1:1 dotted line.
- **"Dashed" and "dotted" are the same pattern** in this pin: the box edges and connectors share the 2.19 px period.
- **Sharpening.** Filled shapes show a resize halo, a light edge (lum 253) and a dark rim (lum 36–39), 1 px wide.

## Page grid

- **Margins.** The rules run x 24.0 → 540.5, leaving 24 px on each side (4.3%). Text starts at x 32–37.
- **One axis.** Every diagram is centred on the page axis x = 282.0 (564/2): stage 1's middle ring is at 282.00, stage 2 spans 68.4 → 492.8 (centre 280.6), stage 3 spans 57.3 → 508.1 (282.7), stage 4's centre is at 281.10, and the title is centred at 282.
- **Title** "Brand Communication Process": ink y 32 → 47, x 180 → 384, bold, about 14 px.
- **Section rules** sit at y 70.5, 285.5, 508.5 and 739.5 (stage heights 215, 223, 231).
- **Stage heading.**
  - **Position.** The ink top is 10–13 px below its rule, and the baseline is at rule + 23.5.
  - **Number** "1"–"4" in bold at x 36–45.
  - **Title** in regular at x 51, about 12 px.
  - **Korean subtitle** at x 53, about 8 px, with its baseline 13.5 px under the title's.
- **Diagram axis below each rule:** 115.9 px (stage 1), 130.2 (stage 2), 117.3 (stage 3), and 175.5 to stage 4's baseline.
- **List block.** The column headings' baseline is at 944.6, 29.6 below stage 4's baseline. The first item is +18.9 below that, then items every 13.0 px. Columns start at x 32, 168, 296 and 432 (a pitch of about 133). Column 4 lines up with stage 4's labels (431.5).

## Stage 1: chain of five rings

- **Method.** Ring centreline fits on inverted luminance, 1,440 rays each (RMS 0.10–0.13 px).
- **Geometry.** r = 34.40 for all five, centres at x 153.73 + 64.13·k on y 186.35. The pitch is 64.13 and the overlap is 2r − p = 4.67 px, **6.8% of the diameter**, so the rings only just interlock.
- **Labels.** Two centred lines inside each ring, about 7.4 px.

## Stage 2: Venn to node to box to square

- **Venn.**
  - **Rings.** Three at r = 32.34, with centres (125.45, 388.00), (100.72, 430.27) and (150.22, 430.28).
  - **Triangle.** Its sides are 49.0, 49.0 and 49.5 (1.52 r), so it is equilateral to within 1%. The centroid is (125.46, 416.18).
  - **Start dot.** A filled dot of r ≈ 1.2 at (125.5, 415.4), where all three rings overlap.
- **Connector.** A dotted line at y = 415.65 on all four segments: dot → node, node → box, box → square, each with one open chevron.
- **Node.** A filled disc of r = 33.56 (3.8% larger than the Venn rings) centred at (247.58, 415.59).
- **Chevrons.** Open, in the ink line, with apexes at (309.5, 415.6) and (410.5, 415.4). Each arm runs 9.0 px back and ±8.2 px (fitted at 41.6–42.5°, so about 42°). The apex stops 16.6 px and 18.2 px before the next element.
- **Box.** Dotted, at x 326.14 → 383.91 and y 367.89 → 463.26 (57.8 × 95.4), holding four items at a 18.6 px pitch.
- **Square.** Filled, 64.07 × 64.09 at (428.74, 383.37), centred on the connector (415.41). Its side is 0.95 of the node's diameter.
- **Element centres** fall at x 125.5, 247.6, 355.0 and 460.8 (spacing 122, 107, 106).

## Stage 3: targeting ring, container and feedback

- **Rings.** r = 26.43 for all of them, on axis y 625.84: "소비자" at 83.71, Contents at 208.81, Story at 437.23 and Style at 481.71. Story and Style overlap by 8.4 px (15.9% of the diameter).
- **Brand node.** A filled disc of r = 26.46 at (342.01, 625.84), the same size as the rings.
- **Journal ring.** At (342.01, 671.87), directly under Brand, overlapping it by 6.85 px (13%).
- **Targeting ring.** Dotted, r = 65.22, concentric with Contents to within 0.05 px. This is 2.47 × the ring radius. It was fitted on a 3×3 box blur so that the dots merge.
- **"edm" container.** Dotted, x 298.7 → 385.31 and y 565.5 → 710.33 (86.6 × 144.8). It holds Brand and Journal with 16.8 px of side clearance.
- **Solid arrows** on y 625.84:
  - **Spans.** 110.1 → 179.5, 235.2 → 312.5, and 410.8 → 372.5, the last pointing left into Brand.
  - **Small chevrons.** 5.0 px deep, ±4.6 px (about 43°). This is half the size of stage 2's.
  - **Gap.** Each apex stops 2.9–4.0 px before its target circle.
- **Feedback path.** A solid line from Journal's left edge (315.6, 671.85) left to x 209.1, then up to a chevron whose apex is at (209.3, 656). That apex is 3.9 px below Contents, and the path makes one right-angle turn.

## Stage 4: concentric half-rings

- **Centre.** (281.10, 916.03), found with free-centre fits of each dotted ring on a blurred image (RMS 0.08–0.10). It sits about 1 px below the baseline's centre (y 915.0), so the rings stand on the baseline.
- **Radii.** 27.2 for the filled core (fitted with its centre fixed to the rings'), then 57.91, 88.74 and 119.59 for the dotted rings. **The step is constant at 30.83**, and the core counts as the first band: r_k = 27.1 + 30.83·k, so the core radius is 0.88 of the step. The rings' ends meet the baseline at x 161, 192, 223 and 339, 370, 400.
- **Baseline.** A rule-weight line centred on y 915.0 (rows 914 and 915 at lum 205–207), x 36 → 526.
- **Leaders.** Rule-weight lines:
  - one at y 796.5, tangent to the top of the r = 119.59 ring;
  - one at y 889.0, tangent to the top of the core;
  - both run from the axis x = 281 to x = 425.06;
  - a vertical at x = 425.06 drops from 796.5 to the baseline.
- **Labels** start at x 431.5 and are vertically centred on their leaders.
- **Numbers.** Bold numerals "4", "3" and "2" sit on the axis in the bands between rings. "1" is white inside the core.
- **"Flexibility" arrow.**
  - **Angle.** Exactly 45.02°, from a line fit x = 0.9994·y − 633.58 over rows 830–888.
  - **Length.** It runs from the core's edge (261.9, 896.9) to a small filled head at (184.5, 818.5), 110 px long.
  - **Tip.** At radius 137.3, which is 17.7 px outside the outer ring.
  - **Weight.** Its line is darker than a ring line (integrated 123).
  - **Head.** A filled triangle of about 4–5 px.

## Replica (`replica.svg`, `replica.png`, `diff.png`)

Built from the values above. Lines are drawn at their apparent weight in this pin (ink 1.31 px `#ABABAB`, rules 1.5 px `#C4C4C4`, dots 1.3 px `#6E6E6E` with a `1.1 1.1` dash array) and fills are `#333333`. Text is Noto Sans KR at the measured sizes. It was rendered in Chrome at 564 × 1056, DPR 1.

**Text mask.** 28 rectangles covering the title, the headings, every label inside or next to a shape (tight boxes, so the rings stay compared), the stage 4 numbers and labels, and the list block (listed in `work/metrics.json`). Compared pixels: 509,464 of 595,584.

| Metric | Value |
| --- | --- |
| Mean absolute error, text masked | **1.23** (unmasked 3.32) |
| Pixels off by more than 24/255, text masked | **0.86%** (unmasked 2.89%) |
| IoU of filled shapes (lum < 128 inside node, square, Brand, core) | **0.981** |
| IoU of all ink (lum < 212), strict | 0.839. By stage: 0.908, 0.919, 0.829, 0.682 |
| Ink F-score, 1 px tolerance | **0.987**. By stage: 1.000, 0.990, 0.996, 0.960 |

- **Why the strict line IoU is low.** A 1.3 px grey line flips in and out of a lum < 212 mask with sub-pixel phase. The dotted lines cannot match dot for dot, because the phase of each dash array is unknown. Stage 4 is the lowest: four dotted arcs plus the resize halo on the core.
- **Accuracy.** The 1-px-tolerant score and the filled-shape IoU show the geometry is placed to within a pixel.
- **Not measured.** The typeface (the Latin looks like a DIN-style humanist sans; Noto Sans KR stands in) and the exact dot phase.

## Moneybee (`moneybee.svg`, `moneybee.png`, 564 × 672)

The sheet is `#FFFFFF`. Ink is `#000` in 1 px lines, rules and leaders are 1 px `#9D9EA1`, dots are 1 px with a `1.1 1.1` dash array, and fills are orange `#F6A11A`, one per figure. The title "Our Approach" is in Instrument Serif 22 px, centred on x 282. Rules sit at 70.5, 285.5 and 509.5, x 24 → 540. Stage headings are an Instrument Serif 17 px number at x 36 and title at x 51.5, with the baseline at rule + 23.5.

1. **Stock Selection Process.**
   - **Chain.** Six rings at the measured r 34.40 and pitch 64.13, centred on 282 (cx 121.68 → 442.32) on axis rule + 116.
   - **Labels.** Geist Mono 7.4 px uppercase, one line per ring except "Decision / Making".
   - **Exit** is the one filled node: orange, no outline, like the reference's filled node.
   - **Loop.** Monitor loops back to Analyse along a dotted path 24 px under the chain, ending in the reference's small solid chevron 3.7 px under Analyse. `LOOP_TO` is one parameter; I chose Analyse (re-analysing a held stock). Change it to Screen if the deck says so.
2. **Risk Management.**
   - **Bands.** An orange core labelled "PORTFOLIO" (Geist Mono) and four dotted half-rings. The core-to-step ratio is the measured 0.88, scaled to core 24 and step 27, so the radii are 24, 51, 78, 105 and 132. The larger step would have pushed the labels past the right margin.
   - **Base.** The baseline is 1 px grey at y 474.5, x 36 → 526.
   - **Order.** Liquidity, Valuation, Market and Concentration risk run from the inside out, with numerals 1–4 in Instrument Serif on the axis bands.
   - **Leaders.** Each ring's leader is tangent at its top and runs to x 425, with the vertical dropping to the baseline and labels in Geist Mono at x 431.5, exactly where the reference puts them.
   - **Omitted.** The "Flexibility" arrow, which has no counterpart in our content.
3. **What We Look For / What We Don't Do.**
   - **Heading.** The stage heading carries both column titles, at x 51.5 and x 296 (the reference's column 3).
   - **Items.** Rethink Sans 9 px, 13 px line pitch, with 4 px extra between items. The last "don't" item wraps to two lines.

## Remake as a React component

```ts
type Step = { id: string; label: string[] };
type Props = {
  selection: { steps: Step[]; accent: string; loopFrom: string; loopTo: string };
  risk: { core: string; bands: string[] };           // inside to outside
  lists: { title: string; items: string[] }[];       // one or two columns
  width?: number;                                     // default 564
};
```

**Formulas** (s = width / 564):

- **Chain.** `r = 34.40·s`, `pitch = 64.13·s` (overlap 6.8% of d), `cx_k = 282·s + (k − (n−1)/2)·pitch`. The accent step is a filled disc of `r + stroke/2`.
- **Loop.** A path `M cx_from, cy+r+3.7 V cy+r+24 H cx_to V cy+r+3.7`, with the chevron `(±4.6, +5)` at the end.
- **Half-rings.** `r_k = core + step·k`, `core = 0.88·step`. Pick `step` so that `282·s + r_max ≤ 425·s − 12`. Each ring is an arc `M cx−r,cy A r r 0 0 1 cx+r,cy`, and the core is the same arc closed with `Z`.
- **Leaders.** `y_k = base − r_k`, from the axis to `x = 425·s`, with the label at `431.5·s` and its baseline at `y_k + 2.6·s`.
- **Stage rhythm.** Heading baseline at rule + 23.5, figure axis at rule + 116 to 130. The half-ring stage's outer ring top sits 57 px under its rule.

**SVG structure:**

```text
svg[role=img]
  text.title
  g.stage[data-n=1]
    line.rule
    text.num
    text.title
    g.chain
      circle.accent
      circle*
    g.labels
    polyline.loop[dotted]
    polyline.chevron
  g.stage[data-n=2]
    line.rule
    text*
    line.base
    path.core
    g.bands > path[dotted]*
    g.leaders
    g.labels
    g.numerals
  g.stage[data-n=3]
    line.rule
    text*
    g.col*
```

**Motion**, per stage as it scrolls into view:

- **Stage 1.** Each ring draws on with `stroke-dashoffset` from its left point clockwise, left to right, 70 ms apart. The Exit disc fills orange last (scale 0.9 → 1, opacity 0 → 1). The loop's dots then run from Monitor to Analyse by animating `stroke-dashoffset` over the whole path length, and the chevron appears at the end.
- **Stage 2.** The baseline draws left to right. The core rises (clip-path inset from the bottom), then each half-ring sweeps from its left foot to its right foot, 80 ms apart. Leaders draw from the axis to x 425, and labels fade in.
- **Stage 3.** The two columns fade and rise 6 px, items 40 ms apart.

Under `prefers-reduced-motion: reduce`, skip all of it and render the final SVG. The static markup is the end state, and animations only interpolate to it.
