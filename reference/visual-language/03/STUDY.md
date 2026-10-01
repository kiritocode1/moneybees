# 03 Futerra glyph columns: measured spec

Source: `../03-futerra-glyph-columns.png`, 736 × 920 RGBA (alpha 255). It is a 16:9 presentation slide mounted on a dark page. Coordinates are SVG units (pixel `i` covers `[i, i+1]`). The file is soft and JPEG-blocky, so every stroke under 2 px is blurred across 2–3 pixels. Scripts: `work/comps.py` (component boxes), `work/tri.py` (triangle fits), `work/make_replica.py`, `work/variants.py`, `work/eval03.py`.

## Canvas and card

| Item | Value | Method |
| --- | --- | --- |
| Page | `#19171A` (25,23,26), sd 0 | median of rows 0–200 |
| Card | `#222222` (34,34,34), square corners | median of the card interior; the corner pixels show no rounding deficit |
| Card rect | x 46.8 → 687.9, y 279.7 → 639.8: **641.1 × 360.1**, ratio 1.780 (16:9) | sub-pixel coverage: sum of (L − 25)/(34 − 25) across rows 300 and 620 = 641.1 and 641.4; edge rows 278–280 and 639–640 |
| Placement | card centre (367.35, 459.75), page centre (368, 460) | from the rect |
| Slide scale | 641.1 / 1920 = 0.334, so 1 px here ≈ 3 px on a 1920 slide | ratio |

## Grid

All x values are card-relative, then % of card width.

| Line | x | % | Method |
| --- | --- | --- | --- |
| Header/footer inset (label, page number) | 10.2 | 1.6% | left edge of "FUTERRA" and "97" boxes (x = 57) |
| Column 1 left | 36.2 | 5.65% | shared left edge of glyph, heading and body (x = 83) |
| Column 2 left | 244.2 | 38.1% | x = 291 |
| Column 3 left | 452.7 | 70.6% | x = 499.5 |
| Column pitch | 208.25 | 32.5% | differences 208.0 and 208.5 |
| Column width / gutter | about 152 / 56 (inferred) | 23.7% / 8.7% | 3w + 2g = 641.1 − 2 × 36.2 with w + g = 208.25; the widest body line reaches 153 px |
| Right inset of star | 12.4 | 1.9% | star centre x 672.9 |

Everything is flush left and ragged right. The glyph's left edge sits on the column line (82.0, 291.8, 499.4).

## Vertical rhythm (card-relative y)

| Element | y | Method |
| --- | --- | --- |
| Label cap top / baseline | 9.3 / 16.3 | row ink profile, rows 289–295 |
| Glyph top / centre / bottom | 66.3 / 88.1 / 110 | glyph fits below |
| Heading line 1 cap top / baseline | 125.0 / 137.3 | row profile: ramp at 404–405, x-height step at 408, drop at 417 |
| Heading baselines | 137.3, 156.3, 175.3 (pitch 19.0) | drops at 417, 436, 455 |
| Body first baseline | 206.3 (31 below the last heading baseline) | x-band rows 482–485, drop at 486 |
| Body line pitch / paragraph gap | 7.1 / +5.6 (a paragraph break adds 0.8 line) | baselines 486, 493, 500.3, then 513, 520, 527, 534, 541.5, 548.5 |
| Page number baseline | 351.3 | rows 624–630 |

Glyph bottom to heading cap top: 15 px. The body starts at the same y in all three columns whatever the heading length, because every heading is set to exactly three lines.

## Glyphs (each about 42–44 px across, white `#F9F9F9`)

| Glyph | Construction | Method |
| --- | --- | --- |
| 1, Joy | **7 equilateral triangles, side 10.4, apex pointing outward**, centroids on a circle r = 16.06 about (103.83, 368.34), at 0°, 51.0°, 104.7°, 152.3°, 207.2°, 254.9°, 308.4° (7-fold: ideal step 51.43°, max deviation 2.2°). No circle is drawn; the centre is empty. Outer extent r = 21.8 | 7 connected components; per blob, grid search of side (9–13), rotation (0–120°) and ±0.5 px shift against the coverage patch; side 9.75–10.25 by blob, then 10.4 won the Chrome variant test (binary IoU 0.913 vs 0.892) |
| 2, Collective | **Ring r = 19.75, stroke 1.66** (sd of radius over 360° 0.09), **filled disc r = 11.0** concentric, **one orbit dot r ≈ 2.9 on the ring at 121°** (centre at r 19.5). Centre (312.33, 367.33) | disc: coverage centroid and area 381.1 → r 11.01; ring: coverage-weighted radius per degree; dot: angle where ring ink width jumps from 1.66 to 4.66, then excess coverage area 26.9 px² |
| 3, Enhances | **12 spokes at k × 30°, stroke 1.8**, from r 5.5 to 16.6; **hub ring r 4.6** (ink 3.5 → 5.8); **tip rings centred at r 18.4, radius 1.8, stroke 1.8** (outer edge 2.7, a pinhole centre at 0.23 coverage). Centre (520.5, 367.5) | centre by maximising 12-fold spoke coverage; spoke width = angular ink integral at r 9 and 12 (1.81, 1.80, sd 0.07); radial profiles along and between spokes |

Rules shared by all three: 42–44 px outer diameter (6.6% of card width), strokes 1.66–1.8 px (4% of the glyph), filled elements mixed with strokes, radial symmetry, and each glyph left-aligned to its column.

## Typography

Family class: neo-grotesque (Neue Haas / Helvetica Now class), with a true italic for one word per heading ("Joy", "Collective", "Enhances"). Replica uses Inter Tight.

| Role | Measure | Estimate |
| --- | --- | --- |
| Heading | cap 12.3, x-height 9.0 (x/cap 0.74), 3 lines, pitch 19.0 | about 17 px (Inter Tight 16.8), line-height 1.13, regular weight, `#FBFBFB` peak |
| Body | cap 5.3, x-height 4.0, pitch 7.1 | about 7.3 px, line-height 0.97 (tight), white or near-white: peak 227, thin strokes never reach full ink |
| Label "FUTERRA" | cap 7 | about 9.6 px uppercase, `#CCCCCC` peak |
| Page number "97" | cap 6.5 | about 9 px |
| Star (top right) | a sparkle about 4 px, centre (672.9, 294.7) | unresolved at this size |
| Up arrow (bottom right) | 5 × 6 px at (675.6, 623–629) | an up arrow, not ↗ |

## Replica and diff

`replica.svg` (736 × 920) → Chrome (`replica.html`, Inter Tight 400/500 + italic) → `replica.png`; `diff.png` (|diff| × 3, red = masked).

**Mask:** the eight text boxes measured on the original (label, three headings, three bodies, page number) dilated 3 px, joined with the replica's text boxes dilated 2 px. 11.58% of the image. Glyphs, star and arrow are not masked.

| Metric | Value |
| --- | --- |
| MAE, text masked | **0.16** / 255 |
| Pixels with max-channel diff > 24, text masked | **0.13%** |
| Card mask IoU (L > 29.5, text masked) | 0.990 |
| Glyph 1 IoU (L > 144) | 0.903 |
| Glyph 2 IoU | **0.951** |
| Glyph 3 IoU | 0.821 |
| Unmasked MAE / > 24 | 4.91 / 4.64% (the body text, which differs in font) |

**Where it falls short:** glyph 3 is twelve 1.8 px spokes and twelve 3.6 px rings; in this JPEG they are 2–3 px blurs, so a sharp render cannot pass 0.95 at a binary threshold. A 24-variant sweep of stroke (1.8–2.2), tip ring (1.8–2.1), hub (4.6–5.0) and tip radius (18.4–18.8) left the measured values best (IoU 0.815 at matched cell alignment, soft IoU 0.785). Glyph 1's triangles are 10 px, so one pixel of edge is 20% of each.

## Moneybee version

`moneybee.svg`, `moneybee.png`: the card only, 641 × 360 (the page around the card is the Pinterest mount, not the design), black `#000000`, meant to be shown at 2× (1282 px). Every x/y is the reference's card-relative value.

- Label "PHILOSOPHY" in Geist Mono 5.5 (11 px at 2×), tracking 0.1em, `#9D9EA1`, at the reference's label position. No page number, star or arrow.
- Glyphs at the reference column lines and centre y 88.1, radius 21, stroke 1.8, white:
  - **Undiscovered:** a 5 × 5 field of dots (pitch 9, r 1.5) with one dot found: an orange dot (r 2.9, the figure's only orange element) inside a white ring (r 6).
  - **Under-researched:** the reference's 12-spoke burst with three adjacent spokes missing, coverage with a gap.
  - **Under-estimated:** the reference's ring and disc (19.75 / 11): the price inside the value, with a short measured tick across the gap between them.
- Headings Instrument Serif 19 (38 px at 2×), one line each. The italic is the root of each word, the prefix stays roman: Un*discovered*, Under-*researched*, Under-*estimated*.
- Body placeholder lorem in Rethink Sans 7.2 (14.4 px at 2×), line pitch 9.6, `#9D9EA1`, first baseline 31 below the heading baseline (the reference's gap).

## Remake as a React component

**Data-driven:** `items: { prefix: string; italic: string; body: string; glyph: 'found' | 'coverage' | 'gap' }[]` from `lib/approach.ts` (which already has `word` and `glyph` keys), `eyebrow`, and `accent` (which glyph carries the orange; only one).

**Layout:** CSS grid, not SVG, for the text. Columns `grid-template-columns: repeat(3, 1fr)` with a gap of 8.7% of the card width and 5.65% side padding; on narrow screens one column. Each column: glyph (`<svg viewBox="-21 -21 42 42" width="42">` at 1×, 84 at 2×) → heading → body, top-aligned so bodies line up when headings share a line count.

**Glyph formulas** (unit = glyph radius 21):
- found: dots at ((j − 2)·9, (i − 2)·9) for i, j in 0..4, skipping the found cell; ring r 6 and dot r 2.9 at that cell.
- coverage: spokes at θ = 30k° for k not in the gap set; line from r 5.5 to 16.6, tip ring at r 18.4 (r 1.8), hub ring r 4.6.
- gap: ring r 19.75, disc r 11, tick from r 12.6 to 18.2.

**Motion:** each column rises in on entering view (the site's `Rise`), staggered 120 ms left to right. Inside the glyphs: dots of the field fade in by distance from the found cell and the orange dot lands last (Undiscovered); spokes draw on with `stroke-dashoffset` clockwise and the gap stays empty (Under-researched); the ring draws on, then the disc scales from 0.6 to 1 so the gap closes to its final size (Under-estimated). 500–700 ms, ease-out. Under `prefers-reduced-motion: reduce`, no movement: the SVG renders in its final state and columns appear without translation.
