# 05 converging lines: measured spec

Source: `../05-converging-lines.png`, 736 x 736, RGBA with alpha 255 everywhere, no DPI or ICC data.
The file is a resampled JPEG (Pinterest size). Thin red lines carry chroma loss and ringing, so colours on
hairlines are measured through luma mass, not single-pixel samples.

Coordinates below are SVG coordinates: pixel column `j` covers `[j, j+1)`, so a pixel centre is `j + 0.5`.
Percentages are of the 736 px width.

Scripts in this folder: `measure_curves.py` (column tracing, per-curve fits), `fit_global.py` (one model for
all curves), `measure_text.py` (ink runs), `trace.py` (silhouette tracing), `build05.py` (replica),
`moneybee05.py` (our version). Shared tools live in `../06/`: `render.sh` (Chrome render through
agent-browser), `diff.py` (metrics).

## Canvas and colour

| Item | Value | Method |
| --- | --- | --- |
| Canvas | 736 x 736 | PIL size |
| Paper | `#F2EFE8` (242,239,232), 473,507 exact pixels (87.4%) | pixel histogram |
| Curve red | `#DF2914` at full opacity | overlap core samples (213..220, 20..27, 15..26), same red as the 06/07 lit face within JPEG noise |
| Figure + shadow | `#101416`, median (16,20,22) | dark-neutral mask, Y < 110 |
| Text | near black, min luma 0 on headings; body reads grey (min luma 111..135) only because it is 4.5 px type | luma |

Overlap does not darken. The fan's core where 12 lines stack is (213..220, 20..27, 15..26), which is the plain
fill red, so the lines are opaque strokes with normal blending, not multiply. The few darker pixels (165,10,6)
sit at the taper tip and are JPEG ringing.

## Layout grid

| Line | x or y | % of W | Method |
| --- | --- | --- | --- |
| Numeral column left edge | x 98 | 13.3% | ink runs, `measure_text.py` x 94..119 |
| Text column (title, headings, body) left edge | x 121..122 | 16.5% | ink runs |
| Body right edge | x 276 | 37.5% | ink runs, thr luma 215 |
| Fan start | x 290.2 | 39.4% | global fit `x0` |
| Gap text to fan | 14 px | 1.9% | 290.2 − 276 |
| Fan tip (curves end, tangent horizontal) | x 478.7 | 65.0% | global fit `ex` |
| Convergence and horizon y | y 375.83 | 51.1% of H | global fit `yc`; horizon luma centroid at x=500 gives 375.84 |
| Horizon end | x 631.5 | 85.8% | luma mass per column falls to 0 at x=632 |
| Figure feet | x 564, y 375.8 | 76.6% | dark mask rows 370..376 |

The drawing has no centred axis. Everything hangs off the text column: the top curve starts at y 242.6, 1.6 px
under the first numeral cap top (241), and the bottom curve starts at 509.0, level with the last body line of
step 04 (ink rows 507..514).

## The curves

Count: **12** (not 13). Column scans from x=290 to x=413 find exactly 12 separable red crossings in 107
consecutive columns; they merge after x≈413.

Start points (x=290 column centroids, SVG y): 242.3, 266.5, 290.8, 315.2, 339.4, 363.7, 388.0, 412.3, 436.6,
460.9, 485.2, 509.4. Spacing 24.22 px (3.29% W), perfectly even (fit residual below 0.2 px). Three curves per
text step: 12 = 4 steps x 3.

Curve family, least-squares distance fit of each traced centreline (Nelder-Mead on point-to-curve distance):

- Per-curve **quadratic** Bézier: rms 0.07..0.15 px. Per-curve cubic (end tangent horizontal): rms 0.07..0.11
  px, not a meaningful gain, and its end control points are unconstrained because the lines merge before the
  end. The designer used quadratics.
- **One quadratic family fits all 12 curves** (7 parameters): rms **0.123 px**, max 0.485 px.
  `P0 = (290.24, 242.63 + 24.219 i)`, `P1 = (361.74, 375.83 + 0.060 (y_i − 375.83))`, `P2 = (478.73, 375.83)`.
- Simplest variant, shared control point on the axis (`k = 0`): rms **0.133 px**, max 0.490 px.
  `P0 = (289.90, 242.15 + 24.308 i)`, `P1 = (366.33, 375.83)`, `P2 = (492.39, 375.83)`. Every curve shares P1
  and P2. The end x is weakly determined (merged lines hide it), which is why the two variants put P2 at 478.7
  or 492.4 with equal fit. Use this variant for the component.

Stroke width: **1.26 px** (0.17% W). Method: integrated luma drop across each crossing, times cos of the local
slope, divided by the luma drop of one pixel of solid `#DF2914` (146.0); median over 624 crossings in x 300..360,
IQR 1.19..1.32.

## Horizon line

One line continues from the fan tip along y 375.83 to x 631.5 (length 153 px from the tip, 20.8% W). Width
equals about 0.95 px of solid red (luma mass 0.95 at x 486..526). Opacity then falls: 0.80 at x 534, 0.62 at 550,
0.53 at 558, flat about 0.55 from 598 to 614, 0.28 at 622, 0.17 at 630, 0 at 632. It runs through the figure's
feet and 68 px past them. The JPEG turns it pinkish grey (176,141,139); by luma it is solid red.

## Figure

Plain standing silhouette with a telescope raised to the upper right, standing on the horizon.

| Item | Value | Method |
| --- | --- | --- |
| Height | 42 px (head top 333.75 to feet 375.8), 5.7% W | dark mask bbox |
| Relative size | 15.8% of the fan height (266.4 px) | ratio |
| Body width | 7..8 px at the shoulders, 3..4 px at the legs | row runs |
| Telescope | reaches x 574 at y 334..342 | row runs |
| Shadow | black, cast to the lower right from the feet (566,376) to (627,388): 62 px long, 11° below horizontal, ends in a small hollow loop (the telescope and head) | dark mask rows 376..388 |

## Typography

The face is a tight grotesk (Helvetica Now Display or Neue Haas style). Sizes are font sizes implied by cap
height / 0.727 (Inter Tight's cap ratio, used for the replica).

| Role | Cap height | Implied size | Weight | Position | Method |
| --- | --- | --- | --- | --- | --- |
| Title "Project Steps" | 15 px (rows 130..144) | 20.6 px | bold, 3 px stems | x 121, baseline 145 | ink run on the P |
| Subtitle "INFOGRAPHICS TEMPLATE" | 10 px (rows 155..164) | 13.8 px | regular, 1.2 px stems | x 121, baseline 165 | ink run on the I |
| Title to subtitle baseline | 20 px | | | | |
| Numerals 01..04 | 12 px | 16.5 px | bold | x 98, cap top 241 + 77 i | ink runs x 94..119 |
| Step heading "Lorem ipsum dolor" | 7 px, x-height 5 px | 9.7 px | bold | x 122, cap top aligned to the numeral cap top | ink runs |
| Body | x-height about 2.5 px | about 4.5 px | regular | x 122 to 276, 3 lines, blank, 2 lines | 4x zoom |

Vertical rhythm of a step (all steps identical, pitch **77.0 px** exactly, 10.5% W): numeral and heading cap
top at 0; heading baseline +7; body lines at +14, +20, +26 (pitch 5.9..6.0 px), paragraph gap about 4 px extra,
then +36, +42. Title cap top 130 sits 111 px above the first step.

## Replica and diff

`replica.svg` is generated by `build05.py` from `global_fit.json`: the 12 quadratics (k variant), the horizon
as a 1 px line with a gradient matching the opacity profile above, the figure and shadow traced from the
original (marching squares on a 4x bilinear coverage map, RDP 0.12 px), and Inter Tight text sized from the
measured caps with `textLength` set to the measured ink widths. Rendered in Chrome at 736 x 736, DPR 1
(`replica.png`).

Mask for MAE and %diff (`masks.json`, 10.65% of pixels): title (112,122)-(300,172); each step's text block
(92, 236+77i)-(286, 290+77i); figure and shadow (552,326)-(646,394). Everything else, including every curve and
the horizon, is measured.

| Metric | Value |
| --- | --- |
| MAE, unmasked | 0.60 / 255 |
| Pixels with any channel off by more than 24, unmasked | 0.88% |
| Red mask IoU, hard (R − (G+B)/2 > 40) | **0.784** |
| Red IoU, soft (Σmin/Σmax of red coverage) | 0.681 |
| 1 px tolerance: recall / precision / F | 0.998 / 0.968 / **0.983** |
| Hard IoU after 1 px dilation of both masks | 0.889 |

The hard IoU does not reach 0.95 and I could not get it there by moving geometry. The cause is the source, not
the curve positions: the centreline fit is 0.12 px rms, and 99.8% of the original's red pixels lie within 1 px
of the replica's. A 1.26 px hairline in a chroma-subsampled JPEG has a blotchy red mask; re-encoding my own
render as JPEG q95..q60 moves the hard IoU to 0.78..0.71, so the ceiling for any exact vector at this
resolution is about 0.78. Stroke widths 1.0 and 1.5 gave 0.765 and 0.776. `diff.png` (heatmap, blue = masked)
and `iou.png` (grey both, blue original only, orange replica only) show the residue is a half-pixel fringe along
the lines and the horizon, where the JPEG left the line below the redness threshold.

## Moneybee version

`moneybee.svg`, rendered to `moneybee.png`. Same geometry as the replica (the k variant, same start points,
same convergence, same step pitch 77 and first cap top 241), on page `#FFFFFF`.

- Curves: 12 black hairlines, 0.75 px. Where they stack near the tip they close into solid black, the same
  behaviour as the red original (opaque strokes).
- The converged portfolio line is `#F6A11A`, 2 px, from x 466.7 (12 px into the black tip, so there is no gap)
  to the figure's feet at x 564. It stops at the figure instead of running 68 px past, so the figure stands at
  the line's end.
- Figure: plain silhouette, 42 px, head circle, torso and two legs, no telescope and no shadow. The telescope
  and the cast shadow were the cartoon parts.
- Heading "Stock selection" in Instrument Serif 30 px at x 119, baseline 146. No subtitle.
- Numerals 01..04 Instrument Serif 22 px at x 96. Step names (Screen, Shortlist, Analyse, Decision Making) in
  Instrument Serif 16/17. Descriptions (docx wording, as supplied) in Rethink Sans 7.6/10.5 px at 72% black,
  in a 156 px column from x 122, so the text keeps its 14 px gap to the fan start. The longest description
  wraps to four lines and still ends above the next step (77 px pitch).
- No caption, no source line, no arrow. The "at least 3-year horizon" idea is carried only by the line
  running on to the figure.

## Remake as a React component

**Data-driven parameters.** `steps: {name, description}[]`; `curvesPerStep` (3); fan box
`{x0, yTop, yBottom}` taken from the text column (yTop = first numeral cap top, yBottom = last body line);
`horizonEnd` (the figure's x); `figureHeight`; colours. Nothing else is free.

**Formulas** (measured ratios, H = yBottom − yTop = 266.4 in the source):

```ts
const N = steps.length * curvesPerStep;               // 12
const yc = (yTop + yBottom) / 2;                       // 375.8
const H = yBottom - yTop;
const cx = x0 + 0.287 * H;                             // shared control point  (76.4 / 266.4)
const ex = x0 + 0.760 * H;                             // shared end point      (202.5 / 266.4)
const curve = (i: number) => {
  const y = yTop + (i * H) / (N - 1);
  return `M${x0},${y} Q${cx},${yc} ${ex},${yc}`;       // one quadratic family, fit rms 0.13 px
};
const figureX = x0 + 1.03 * H;                         // 564 in the source
const figureHeight = 0.158 * H;                        // 42
```

**SVG structure.** One `<svg viewBox="0 0 W H">` holding the drawing only; the step list is HTML in the same
grid cell so it wraps, scales and stays selectable:

```
<svg aria-hidden>
  <g class="fan" fill="none" stroke="#000" stroke-width="0.75" vector-effect="non-scaling-stroke">
    <path pathLength="1" d={curve(i)} />  x N
  </g>
  <line class="portfolio" x1={ex - 12} y1={yc} x2={figureX} y2={yc} stroke="#F6A11A" />
  <g class="figure">circle + rect torso + two leg rects</g>
</svg>
<ol class="steps"> numeral (Instrument Serif), name, description (Rethink Sans) </ol>
```

Rows of the `<ol>` sit on a fixed 77/736 pitch (10.5% of the drawing width) so curve starts and step tops stay
locked when the SVG scales; use a CSS grid with the SVG and the list in one area and the pitch as a
`calc` of the container width, or measure row tops with a ResizeObserver and feed yTop/yBottom back in.

**Entrance.** Triggered once when the figure enters the viewport (IntersectionObserver, threshold 0.4), or
scrubbed by scroll progress through the section.

1. Curves draw on with `stroke-dashoffset` 1 → 0 (pathLength 1), outer pair first and moving inward, 40 ms
   stagger, 700 ms each, ease-out. Step i's three curves start with step i's text fade (opacity + 6 px rise).
2. When the last curve lands, the orange line grows from the tip to the figure (`scaleX` from its left end,
   500 ms).
3. The figure fades in when the line reaches it (200 ms).

Under `prefers-reduced-motion: reduce` render the final state directly: no dash arrays, no transforms, all
opacity 1. The static markup is the final state; animation classes are only added when motion is allowed, so
a no-JS or reduced-motion visitor never sees a half-drawn fan.
