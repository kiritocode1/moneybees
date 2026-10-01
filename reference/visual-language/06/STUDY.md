# 06 stacked blocks: measured spec

Source: `../06-stacked-blocks.png`, 736 x 736, alpha 255, resampled JPEG. Coordinates are SVG coordinates
(pixel centre = index + 0.5, a boundary between rows j and j+1 is y = j+1). Percentages are of 736.

Method for every edge: classify each pixel to the nearest of paper `#F2EFE8`, lit `#DF2914`, shade `#7C1F17`,
ink `#141414`; for each column find the class change, place the boundary with sub-pixel precision by summing
the colour fraction of the six pixels around it (projection of RGB onto the segment between the two class
colours); fit a least-squares line, drop points more than 1.2 px off, refit. Vertices are line intersections.
Scripts: `edges.py`, `measure06.py` (writes `geometry.json`), `runs.py`, `build06.py`, `render.sh`, `diff.py`.

## Colour

| Item | Colour | Exact-match pixels | Method |
| --- | --- | --- | --- |
| Paper | `#F2EFE8` (242,239,232) | 370,066 | histogram |
| Lit face (left side of every block) | `#DF2914` (223,41,20) | 29,227 | histogram |
| Shaded face (right side, undersides and top faces) | `#7C1F17` (124,31,23) | 36,231 | histogram |
| Figure | `#101416`, median (16,20,22) | | dark-neutral mask |
| Leader lines | 1 px, luma drop about 91 per crossing = black at about 38% on paper (renders (181,178,171) + (218,215,208) over two pixels) | | column/row profiles |

There is no third face colour. Tops and undersides take the shade colour, so the shaded right face and a cap
merge into one dark shape.

OKLCH of the pair: lit L 0.583 C 0.218 h 30.6; shade L 0.391 C 0.129 h 29.2. Shade = lit x L 0.671, C 0.592,
hue −1.44°. Contrast lit/shade 2.16:1.

## Projection: two-point perspective, not isometric

Vertical edges are exactly vertical (dx/dy below 1e-4 on all three), so there is no third vanishing point.
Horizontal edges change angle with height, which rules out isometric and dimetric (both keep edges parallel):

| Outline | Left-edge y | Front-edge y | Angle, lit side | Angle, shade side | Fit rms |
| --- | --- | --- | --- | --- | --- |
| A top | 167.03 | 124.55 | −20.16° | +20.13° | 0.11 / 0.05 |
| A bottom | 349.92 | 330.18 | −9.67° | hidden | 0.15 |
| B top | 366.45 | 351.15 | −7.8° / −7.2° (two segments) | +7.38° | 0.35 / 0.05 |
| B bottom | 492.47 | 498.99 | +3.22° | −3.06° | 0.12 / 0.04 |
| C top | 508.10 | 518.55 | +5.28° | hidden | 0.27 |
| C bottom | 542.13 | 560.04 | +8.79° | −8.66° | 0.19 / 0.03 |
| D top | 567.30 | 590.16 | +11.16° | hidden | 0.11 |
| D bottom | 586.92 | 610.78 | +11.64° | −11.62° | 0.04 / 0.04 |

Vertical edges: left x **257.42** (35.0%), front x **373.24** (50.7%), right x **489.02** (66.4%). Face widths
115.82 and 115.78: a symmetric 45° view of a square footprint. The tower's axis is 5.2 px right of the canvas
centre.

Camera fit. With vertical verticals, a pinhole camera predicts `y_front = y_eye + k (y_left − y_eye)` for every
horizontal outline. Least squares over the 8 outlines: **eye level y = 444.8** (60.4% of height, inside block
B), **k = 1.1665**, residual rms 2.47 px, max 3.95 px. The same camera predicts the hidden back corners of the
caps, `y_back = y_eye + (y_left − y_eye) / (2 − 1/k)`: A underside 361.7 (measured 361.7), C top 499.9
(measured 496.7), D top 552.0 (measured 552.3). So it is a real perspective, hand-adjusted by up to 4 px.
Vanishing points on the eye level at x −438 and x 1185 (symmetric about the front edge).

## Blocks

Unit `s` = side of the square footprint. At the side corners' depth one `s` = 115.82 x √2 = **163.8 px**, so
heights measured on the left edge convert directly.

| Block | Left-edge height | Front-edge height | Height in s | Gap above (left edge) | Cap visible |
| --- | --- | --- | --- | --- | --- |
| A (top) | 182.9 | 205.6 | 1.117 | | underside, back corner (371.5, 361.7) hidden by B |
| B | 126.0 | 147.8 | 0.769 | 16.5 px, 0.101 s | none: the eye level passes through it |
| C | 34.0 | 41.5 | 0.208 | 15.6 px, 0.095 s | top face, back corner (371.2, 496.7) hidden by B |
| D (bottom) | 19.6 | 20.6 | 0.120 | 25.2 px, 0.154 s | top face, back corner (372.6, 552.3) hidden by C |

Blocks shrink downward (1.117, 0.769, 0.208, 0.120 s) and the lowest gap is the widest. Gaps show paper as
two wedges each: A/B tips at x 326.6 and 417.8 (y 357.0); B/C at 357.5 and 385.7 (y 498.1); C/D at 345.9 and
399.7 (y 555.8). Painter's order that reproduces every overlap: D, C, A, B.

## Figure

Plain standing silhouette on the roof of A, no shadow. Bbox x 330..339, head top y 100, feet 138.4, exactly on
A's lit top edge line at x 335.5 (the roof is not visible from below, so the feet sit on that edge). Height
**38.4 px**: 18.7% of A's front height, 0.234 s. It stands 38 px left of the front corner.

## Callouts and leaders

Numbered bottom-up and alternating sides: **01 → D (left), 02 → C (right), 03 → B (left), 04 → A (right)**.

| Callout | Numeral ink | Vertical | Elbow y | Ends at | Where it attaches |
| --- | --- | --- | --- | --- | --- |
| 03 | x 120..143, cap top 178 | x 132.2, from y 205.5 | 376.0 | x 257.42 | B's left edge, 9.5 px under its top corner |
| 04 | x 521..545, cap top 178 | x 533.8, from y 201.0 | 283.4 | x 489.02 | A's right edge at 63.6% of its height |
| 01 | x 120..138, cap top 418 | x 132.2, from y 446.5 | 576.85 | x 257.42 | D's left edge at its midpoint (577.1) |
| 02 | x 521..544, cap top 418 | x 533.8, from y 442.5 | 524.9 | x 489.02 | C's right edge at its midpoint (525.2) |

Method: row and column luma profiles, centroid of the luma drop. Each leader drops from the numeral's ink
centre (131.5 and 533), starts 9..13 px under the numeral baseline, turns once at a right angle and stops on an
outer vertical edge of the tower. Never on a face interior.

## Typography

Same grotesk as 05. Sizes are cap height / 0.727.

| Role | Measure | Implied size | Position |
| --- | --- | --- | --- |
| Numerals | cap 15 px (rows 178..192) | 20.6 px bold | x 120 (left), 521 (right) |
| Heading "Lorem ipsum dolor" | cap about 7.5 px, top-aligned with the numeral | 10.5 px bold | x 149 / 550, 80 px wide |
| Body | 2 paragraphs x 6 lines, line pitch 6.7 px, paragraph starts 53.6 px apart | about 5.3 px | x 148..213 (65 px column) |
| Callout rows | cap tops 178 and 418 | | row pitch 240 px |
| Title "Business Growth and / Scalability" | cap 10 px | 13.8 px semibold | x 552, baselines 657 and 673 |
| Subtitle "INFOGRAPHICS TEMPLATE" | cap 8 px | about 11 px regular | x 552, baseline 689 |

Grid: left text column x 120 (16.3%), tower 257.42..489.02, right text column x 521 (70.8%); the right column
starts 32 px after the tower, the left column's body ends 44 px before it.

## Replica and diff

`replica.svg` (from `build06.py`): every face is a polygon on the measured vertices; each block's shade is one
outline (right face plus cap), all shade outlines in one group under all lit faces, leaders as measured, figure
traced from the original, Inter Tight text at the measured sizes. Chrome render `replica.png`.

Mask (`masks.json`, 13.05% of pixels): the four text blocks (114,172)-(242,292), (515,172)-(642,292),
(114,412)-(242,532), (515,412)-(642,532); title (545,640)-(700,695); figure (324,94)-(346,139). Leader lines
outside those boxes are measured.

| Metric | Value |
| --- | --- |
| MAE, unmasked | 0.53 / 255 |
| Pixels with any channel off by more than 24, unmasked | 0.57% |
| IoU of the solid (lit or shade) | **0.994** |
| IoU lit / shade | 0.983 / 0.996 |

`iou.png` shows the only disagreement is a sub-pixel fringe on the sloped edges. First pass was already above
0.95; no geometry iteration was needed beyond averaging B's top edge from its two measured segments.

## Moneybee version

`moneybee.svg` / `moneybee.png`, 1472 x 736, two panels with identical geometry. Left: shade `#8C5E22`.
Right: black at 85%. Lit faces `#F6A11A`, page white, leaders `#9D9EA1` 1 px on the measured paths, plain
38 px silhouette on the roof. Callouts: 01 Liquidity risk (D), 02 Valuation risk (C), 03 Market risk (B),
04 Concentration risk (A); numerals Instrument Serif 24, labels Instrument Serif 17, lorem body Rethink Sans
8/11.5 at 72% black. Heading "Risk management" in Instrument Serif 28 where the original title sat. No
subtitle, no caption.

`#8C5E22` is the source relation applied to our orange: OKLCH L x0.671, C x0.589, hue −0.9° (source: x0.671,
x0.592, −1.4°).

**Verdict: `#8C5E22` reads better.** It keeps the tower one solid lit from the left: the step from orange to
brown is the same lightness step as red to maroon, so the eye reads it as the orange's own shadow and the gaps
read as tops and undersides. Black 85% (renders `#262626`) turns the right half into a second material. At
7.2:1 against the orange it becomes the heaviest mark on the page, heavier than the black type, so the tower
reads as two half-towers and pulls attention from the numbered labels. Black ink also stands at 3.7:1 on the
brown but 1.4:1 on the black face, which matters in 07 where the figure's shadow falls next to a shaded face.
The case for black is palette discipline: it adds no fifth colour. If the system rules out new colours, use
black 85% and keep the figure on a lit face.

Implementation note: a translucent shade must not stack. Here all shade outlines sit in one `<g
opacity=".85">` beneath the lit faces, which is valid for this tower because no shaded face is ever in front of
a lit face of another block.

## Remake as a React component

**Data-driven parameters.** `blocks: {label, body, height}[]` listed top to bottom (heights in `s`), `gaps[]`
in `s`, footprint `s` in px, front-edge x, ground y, eye level y, `k` (perspective strength), colours, and which
side each callout sits on (alternating, numbered from the bottom).

**Formulas** (source values: sPx 163.8, xF 373.24, yGround 586.92, yEye 444.8, k 1.1665):

```ts
const half = sPx / Math.SQRT2;                         // 115.8: side corners at xF ± half
const xL = xF - half, xR = xF + half;
const ySide = (Y: number) => yGround - Y * sPx;        // model height Y (in s) at the side corners
const yFront = (ys: number) => yEye + k * (ys - yEye);
const yBack = (ys: number) => yEye + (ys - yEye) / (2 - 1 / k);

function faces(y0: number, y1: number) {                // block from model height y0 up to y1
  const [tS, bS] = [ySide(y1), ySide(y0)];
  const [tF, bF] = [yFront(tS), yFront(bS)];
  const lit = [[xL, tS], [xF, tF], [xF, bF], [xL, bS]];
  const right = [[xF, tF], [xR, tS], [xR, bS], [xF, bF]];
  const cap = bS < yEye ? [[xL, bS], [xF, bF], [xR, bS], [xF, yBack(bS)]]   // underside, seen from below
            : tS > yEye ? [[xL, tS], [xF, tF], [xR, tS], [xF, yBack(tS)]]   // top face, seen from above
            : null;                                                          // eye level inside the block
  return { lit, shade: cap ? union(right, cap) : right };
}
```

The union is a single hexagon (right face plus cap), as in `build06.py`. Paint order: blocks by distance from
the eye level, farthest first, so the eye-level block is last. That rule gives A, D, C, B; `build06.py` uses
D, C, A, B, which is equivalent because A never overlaps C or D.

Leader for callout i: `M xCol,yStart V yElbow H (left ? xL : xR)`, with `yElbow` the midpoint of the block's
outer edge for thin blocks and a fixed offset from the callout for tall ones (the source mixes both; use the
midpoint rule everywhere for the remake).

**SVG structure.**

```
<svg aria-hidden>
  <g class="leaders" stroke="#9D9EA1" fill="none"> <path pathLength="1"/> x4 </g>
  <g class="shade" fill="#8C5E22"> <polygon/> per block </g>
  <g class="lit" fill="#F6A11A"> <polygon/> per block </g>
  <g class="figure">plain silhouette on the top block</g>
</svg>
<ol class="callouts"> absolutely placed HTML: numeral, label, body </ol>
```

**Entrance.** On entering the viewport, or scrubbed through the section: blocks assemble bottom-up (01 first).
Each block rises 24 px into place and fades in over 450 ms, ease-out, 120 ms stagger; gaps open from zero to
their measured size as the next block lands. After block i lands, its leader draws (`stroke-dashoffset` 1 → 0,
300 ms) and callout i fades in. The figure appears last. Under `prefers-reduced-motion: reduce`, render the
final state with no transforms or dash offsets; the static markup is the final state and motion classes are
only added when motion is allowed.
