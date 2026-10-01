# 07 isometric block: measured spec

Source: `../07-isometric-block.png`, 736 x 736, alpha 255, resampled JPEG. SVG coordinates (pixel centre =
index + 0.5). Percentages are of 736. Edge method as in `../06/STUDY.md`: nearest-colour classification,
sub-pixel boundary from colour fractions, least-squares lines, vertices by intersection. Scripts:
`measure07.py` (writes `geometry.json`), `build07.py`, plus `../06/edges.py`, `../06/render.sh`,
`../06/diff.py`, `../05/trace.py`.

## Colour

| Item | Colour | Exact-match pixels | Method |
| --- | --- | --- | --- |
| Paper | `#F2EFE8` | 436,489 | histogram |
| Lit: every top face and every face turned to the lower left | `#DF2914` | 19,098 (+676 at (225,40,20)) | histogram |
| Shaded: every face turned to the lower right, and the figure's cast shadow | `#7C1F17` family: (124,31,24) 7,046, (124,31,23) 2,482, (125,31,23) 1,532 | | histogram |
| Figure | `#191519`, median (25,21,25) | | dark-neutral mask |
| Leaders | 1 px, luma drop 85..101 per crossing, black at about 38% on paper | | profiles |

Unlike 06, top faces here are lit, not shaded. Light comes from the upper left, so top and left faces share one
colour and their shared edges are invisible; only the silhouette and the lit/shade boundaries can be measured.

## Projection: parallel, symmetric dimetric at about 20.6°

Edges of one direction stay parallel across the whole solid, so this is a parallel projection. Both horizontal
axes rise at about 20.6°, not 30°, so it is not true isometric (30°) and not 2:1 pixel isometric (26.57°).

| Direction | Edges measured (angle, fit rms px) |
| --- | --- |
| u, down to the right | column top back-right +20.63° (0.06), arm top back +20.26° (0.06), arm front bottom +20.32° (0.05), bar end bottom +20.57° (0.04). Mean **+20.45°**, spread 0.37° |
| v, down to the left | column top back-left −20.55° (0.06), column top front-right −21.51° (0.25), column right-face bottom −20.83° (0.13), arm end top −20.97° (0.12), arm end bottom −20.59° (0.05), bar long bottom −21.48° (0.05), bar long top −21.50° (0.15), bar top back-left −21.48° (0.14). Mean **−21.1°**; the bar is drawn about 0.9° steeper than the column and arm |
| vertical | eight vertical edges, all dx/dy below 8e-4 |

Unit step: one footprint unit = **51.5 px** in x (column 51.42 and 51.74, arm end 51.60, bar end 51.24) and
19.1..19.8 px in y. The equivalent orthographic camera: azimuth 45°, elevation φ = asin(tan 20.6°) = **22.1°**
(true isometric is 35.3°). In that camera one unit is 72.8 px long, and one unit of height is 72.8 cos φ =
**67.5 px** on screen.

Projection used for the remake (origin = the ground point under the column's back corner, O = (350.7, 487.2)):

```
x = 350.7 + 51.5 (u − v)
y = 487.2 + 19.35 (u + v) − 67.5 z
```

## Solid

Three boxes meeting at a corner, one along each axis.

| Box | Footprint (u, v) | Height px | Height, orthographic units | Height in x-units (51.5) |
| --- | --- | --- | --- | --- |
| Column (back) | u 0..1, v 0..1 | 208.3 | 3.09 | 4.04 |
| Arm (to the lower right) | u 0..3, v 0..1 | 117.7 | 1.74 | 2.29 |
| Bar (to the lower left, in front) | u 1..2, v 1..3.40 | 63.1 | 0.93 | 1.23 |

Height ratios column : arm : bar = 3.30 : 1.87 : 1. The bar is 2.40 units long and attaches to the arm's front
face; its long shaded face ends exactly at the arm's front-bottom edge (vertex (402.24, 545.06), two fits agree
within 0.25 px).

Key vertices (SVG px): column top (350.70, 278.89), (402.12, 298.26), (350.65, 318.08), (298.96, 298.29);
column right face bottom (350.65, 408.54), (402.12, 388.96); arm end top (504.46, 427.07), (452.86, 446.83);
arm end ground (504.46, 544.76), (452.86, 564.15); bar top (402.24, 481.93), (278.58, 530.63),
(227.34, 511.03); bar ground (278.58, 593.72), (227.34, 574.48). Silhouette x range 227.34..504.46
(30.9%..68.5%), y range 278.89..593.72.

Visible faces: lit = column top, column front-left (v = 1), arm top, arm front-left, bar top, bar end (v = 3.4);
shaded = column right face (from the column top down to the arm top, 90.5 px), arm end face (u = 3), bar long
face (u = 2).

## Figure and shadow

Walking silhouette on the bar top, stride open, facing right. Head top y 469, feet about 508.5: **39.5 px**
tall, 7..8 px at the shoulders. In model space the feet stand at u 1.37, v 2.99: near the bar's centreline and
0.41 units from its front end. Height = 0.63 of the bar height, 0.19 of the column, 0.77 of a unit.

Shadow: shade colour laid on the lit bar top, from the feet (265, 508) to about (312, 521): 49 px long (1.24 x
the figure), 15.5° below horizontal to the right, about 5 px wide, darkest at the far end where the head's
shadow is. It runs into the bar's front-top edge, so the long face and the shadow meet.

## Callouts and leaders

| Callout | Numeral ink | Vertical | Elbow y | Ends at | Attaches to |
| --- | --- | --- | --- | --- | --- |
| 03 | x 428..451, cap top 166 | x 438.9, from y 193 | 363.7 | x 402.12 | column right edge (298.3..389.0), 72% down |
| 01 | x 120..138, cap top 396 | x 132.2, from y 424 | 555.0 | x 227.34 | bar end-face left edge (511.0..574.5), 69% down |
| 02 | x 533..555, cap top 429 | x 545.5, from y 453 | 536.0 | x 504.46 | arm end right edge (427.1..544.8), 92% down |

Same rules as 06: the vertical drops from the numeral's ink centre, starts 9..13 px under the numeral baseline,
turns once at a right angle and ends on an outer vertical silhouette edge.

## Typography

| Role | Measure | Implied size | Position |
| --- | --- | --- | --- |
| Title "Business Growth" | cap about 10.5 px (rows 165..175) | 14.4 px semibold | x 146, baseline 176 |
| Subtitle "INFOGRAPHICS TEMPLATE" | cap 7 px (rows 183..189) | 9.6 px regular | x 146, baseline 190 |
| Numerals | cap 14..15 px | about 20 px bold | 03 x 428, 01 x 120, 02 x 533 |
| Headings | cap about 7.5 px, top-aligned to the numeral | 10.5 px bold | 03 x 457, 01 x 148, 02 x 561 |
| Body | 2 x 6 lines, pitch 6.7 px, paragraph starts 53 px apart | about 5.3 px | 65 px column |

The callouts are placed to the solid, not to a grid: 03 starts 26 px right of the column's right edge, 02 starts
28.5 px right of the arm end, 01 shares the 120 / 148 columns used in 06. The title sits top-left at x 146,
level with callout 03.

## Replica and diff

`replica.svg` from `build07.py`: nine face polygons on the measured vertices (back to front: column and arm,
then the bar), the figure and its shadow traced from the original, leaders as measured, Inter Tight text.
Chrome render `replica.png`.

Mask (`masks.json`, 10.63% of pixels): title (140,158)-(262,195); 03 text (420,158)-(560,280); 01 text
(112,388)-(245,516); 02 text (525,422)-(650,543); figure and its shadow (256,464)-(318,526).

| Metric | Value |
| --- | --- |
| MAE, unmasked | 0.34 / 255 |
| Pixels with any channel off by more than 24, unmasked | 0.47% |
| IoU of the solid (lit or shade) | **0.999** |
| IoU lit / shade | 0.990 / 0.987 |

First pass; no iteration needed.

## Moneybee version

`moneybee.svg` / `moneybee.png`, 1472 x 736: left panel shade `#8C5E22`, right panel black at 85%. Lit
`#F6A11A`, page white, leaders `#9D9EA1`, callouts 01/02/03 "Lorem ipsum" with Instrument Serif numerals and
labels and Rethink Sans lorem, placeholder heading "Lorem ipsum" in Instrument Serif 28 at the title position.
The figure is a plain walking silhouette (head, torso, two straight legs) at the measured spot and height,
with a parallelogram shadow in the shade colour along the measured 15.5° direction.

**Verdict: `#8C5E22` reads better here too, more clearly than in 06.** With brown, the black figure, its
brown shadow and the brown long face are three separate values, so the figure reads as walking on the bar. With
black 85% the shadow is `#262626` next to a black figure (1.4:1) and runs into a `#262626` long face, so legs,
shadow and face fuse into one dark shape. The black version also reads as a two-tone graphic rather than one
lit solid.

Implementation note: here a shaded face does sit in front of a lit face (the bar's long face covers part of the
arm's front face), so the 06 trick of one translucent shade group under all lit faces does not work. Each shaded
face is drawn in depth order over a white knockout of itself, so black 85% renders as flat `#262626` and the
orange behind never shows through.

## Remake as a React component

**Data-driven parameters.** `boxes: {u0, u1, v0, v1, h}[]` in footprint units; `unitPx` (51.5), `angle`
(20.6°), origin; callouts `{n, label, body, box, edge: 'left' | 'right', at: 0..1}`; figure `{u, v, heightPx}`;
colours.

**Projection matrix** (orthographic, azimuth 45°, elevation φ = asin(tan angle)):

```ts
const t = Math.tan(angle);                  // 0.376
const b = unitPx * Math.SQRT2 * Math.cos(Math.asin(t));   // 67.5, screen px per unit of height
const project = (u: number, v: number, z: number) => [
  ox + unitPx * (u - v),
  oy + unitPx * t * (u + v) - b * z,
];
// [x y]^T = O + [[a, -a, 0], [a t, a t, -b]] [u v z]^T,  a = unitPx
```

For round numbers in the remake use heights 3, 1.75 and 1 (measured 3.09, 1.74, 0.93) and bar length 2.4.

**Faces per box.** Top `(u0,v0,h) (u1,v0,h) (u1,v1,h) (u0,v1,h)` lit; front-left `(u0,v1,h) (u1,v1,h)
(u1,v1,0) (u0,v1,0)` lit; front-right `(u1,v0,h) (u1,v1,h) (u1,v1,0) (u1,v0,0)` shade. Paint boxes in order of
`u1 + v1` ascending (column 2, arm 4, bar 5.4). Shaded faces get a white knockout polygon under them when the
shade is translucent.

**SVG structure.**

```
<svg aria-hidden>
  <g class="leaders" stroke="#9D9EA1" fill="none"> <path pathLength="1"/> per callout </g>
  <g class="box" data-i> <polygon class="top"/> <polygon class="left"/> <polygon class="right"/> </g> per box
  <g class="walker"> <path class="shadow"/> <g class="figure"/> </g>
</svg>
<ol class="callouts"> HTML, positioned from project() of each anchor </ol>
```

**Entrance.** On entering the viewport: boxes extrude from their footprints (`h` from 0 to its value, faces
recomputed per frame, or a `scaleY` about each box's ground line) in paint order, 500 ms each, 150 ms stagger,
ease-out. When the bar lands, the figure and shadow fade in 0.6 units behind their final spot and walk forward
along −v to (u 1.37, v 2.99) over 1.2 s, linear. Leaders draw after their box lands, then the callout fades.
Under `prefers-reduced-motion: reduce`, render the final state: full heights, figure at its final spot, leaders
drawn, no transforms. The static markup is the final state; motion is added only when allowed.
