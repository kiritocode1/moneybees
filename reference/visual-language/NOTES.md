# Visual language for the internal pages

The user supplied nine images on 2026-09-30 ("you can use visuals like this but in our colour… clinically study this, as if you were remaking this for us"). Each one is pinned in this folder. The measurements below were read from the files with PIL, at each image's own pixel size. Where a value is an estimate from looking, it says so.

Our colours replace theirs. Their warm paper `#F2EFE8` and grey `#F2F2F2` become our white `#FFFFFF` and panel grey `#F6F6F6`. Their near-blacks `#19171A`, `#222222` and `#232323` become `#000000`. Their red becomes our orange `#F6A11A`.

## Measured studies override this page

Each image now has a measured study in its own folder (`01/` … `09/`): `STUDY.md`, a `replica.svg` diffed against the original in Chrome, and a `moneybee.svg`/`.png` in our colours. Where this page and a `STUDY.md` disagree, the study is right. The corrections to the first pass below are:

| Ref | First pass said | Measured |
| --- | --- | --- |
| 01 | a drawn hole of radius 55; gap 6–8px; corner radius 28; numbers 3× the label size | No hole is drawn. The dark centre is left by rounding each 45° apex with an r 32 arc. The gap is 1.8–2.3px, parallel-sided. The corner radius is about 30 (value wedges 29). The track is the value gradient at 29.5% opacity. The value radii follow no formula (the two 5s are longer than the 6; the best fit is log, rms 13.4px). The number-to-label cap ratio is 1.72. |
| 02 | twelve rings in "impact", semi-transparent | 13 rings, stepped 11.53px at exactly 45°, opaque greys falling linearly. The grid rings are r 28.96 with a 2.19 stroke, tangent. The team rings overlap 27%, the cooperation rings 46.3%. There is no perspective to correct. |
| 04 | radial arrows *into* a square | 30 lines at 12° radiate *out* to r 46 and end in dots. The cards are opaque `#4B4B4B`, not translucent. The fan is one S-shaped cubic curve scaled six times. |
| 05 | about thirteen curves | 12 curves from x 290.2, spaced 24.22px apart, converging at (478.7, 375.8). They are one family of quadratic curves sharing the control point (366.3, 375.8), rms 0.12px, with a 1.26px stroke. Overlaps are opaque, with no darkening. |
| 06 | isometric boxes | Two-point perspective: vertical edges stay vertical, eye level is y 444.8, and the edge angles run from 20.2° at the top to −11.6° at the base. The tops and undersides take the shaded colour. |
| 07 | isometric | Parallel dimetric at about 20.6°, one unit being 51.5px. The top faces are lit, unlike 06. |
| 08 | diameters 67/103/138/174 | 69.25/104.72/140.19/175.68: a linear +35.47px step, measured by circle fit. The earlier numbers were edge-threshold widths. The discs sit on the axis y 195.21 with 2.24px gaps. The arrows are 0.95px, with a fixed 16.5px chevron at 45°. |

Verdict on the isometric shaded face (06/07 renders): `#8C5E22` reads better than black at 85%, because it keeps each figure one lit solid. Black becomes the heaviest mark on the page.

Build notes from reviewing the renders:
- The 05 Moneybee version needs a heavier hairline (the black 1.26px lines read faint on white) and a proper figure silhouette.
- The 01 heading "Top 5 - Sector Allocation (%)" has a hyphen used as a dash. Set it as "Top 5 sector allocation (%)" or with a colon, following the no-dashes-in-visible-copy rule.

## The rules all nine share

1. **One accent per figure.** The single element that answers the question is filled with the accent: the selected cell, the result node, the destination. Everything else is ink line or a flat neutral. On our pages that element is orange, and a figure never has two orange things competing.
2. **Construction is visible.** Hairline leader lines, dotted relationship lines, dashed boxes and axes are part of the picture, not removed. They are thinner and lighter than the shapes they explain.
3. **Two stroke weights.** Primary shapes are about 0.25–0.3% of the figure width: Unit8 rings are roughly 2px at 736px, and the process-sheet circles are 1px at 564px. Construction and relations are hairlines or dotted, at 1px with a 2/3 dash (visual estimate).
4. **Numbered callouts sit outside the figure.** They read "01" in heavy numerals, then a short title, then a small body, and connect to the figure by a hairline with a right-angle elbow (06, 07). Numbers carry the order; the figure carries the meaning.
5. **Scale comes from a tiny human silhouette** (05, 06, 07, 08): a black figure about 3–4% of the image height, standing on the result and often looking ahead with a telescope. It shows scale and ambition without an illustration style. This is optional for us: it is a silhouette, not a cartoon, but decide per figure.
6. **Area and length stay honest.** Sizes follow the numbers. Anything we draw from data must be area-true or length-true and labelled with the real value.

## Our colour roles

| Role | Theirs | Ours |
| --- | --- | --- |
| Page | `#F2EFE8`, `#F2F2F2`, `#19171A` | `#FFFFFF`, panel `#F6F6F6`, band `#000000` |
| Ink line and type | black or white | `#000000` on light, `#FFFFFF` on black |
| Accent face | `#DF2914` (OKLCH 0.583 0.218 30.6) | `#F6A11A` (OKLCH 0.775 0.162 70.5) |
| Accent shaded face (isometric side) | `#7C1F17` (OKLCH 0.391 0.129 29.2) | `#8C5E22`: the same L ×0.67, C ×0.59, hue −1.4° shift applied to our orange. Render it before committing, because a darker orange can read brown. The fallback is black at 85% for the side face. |
| Track or inactive | grey `#5C5857` on `#232323` | `#000000` at 8–12% on white, or `#FFFFFF` at 18% on black |
| Secondary neutral | light lilac `#DAD2DD` | our grey `#9D9EA1` |

## The nine references

### 01 Radial wedges (`01-radial-wedges.png`, 1179×1191)
- **What it is:** a rounded rose chart. Eight 45° sectors around a centre hole. Each sector has a dark full-length "track" wedge and a light "value" wedge on top whose length encodes the number, with the number and label set in the wedge.
- **Measured** (centre ≈ 590, 584): the hole radius is 55px (4.7% of the 1179 width), and the track wedges reach 390px. The value wedges reach 167 (value 2), 219 (4), 281 (5), 278 (6), 321 (10) and 360px (12), so their lengths grow with the value but less than linearly, closer to area than to length. The gap between sectors is about 6–8px. The wedge corners are rounded with a radius of about 28px (estimate). The track colour is `#5C5857`, the value wedge is `#DAD2DD` with a faint diagonal gradient, and the page is `#232323`. The numbers are about 3× the label size, and the labels sit in the track zone at about radius 300.
- **For Moneybee:** the Top 5 sector allocation (Renewable Energy 12.2, Chemicals 11.74, Oil & Gas 8.97, Financials & NBFC 8.72, Capital Goods 7.8, all in %). That makes five wedges, or six with "Other" as a grey track. The value wedges are orange on a black band, the tracks are white at 18%, and the labels are Geist Mono. **Do not use this for returns:** the 1-year PMS return is −7.45%, and a wedge length cannot show a negative honestly.
- **Motion:** each wedge's value length grows from the hole to its value in sequence on scroll. At rest, and under reduced motion, it shows the final state.

### 02 Unit8 circle posters (`02-unit8-circles.png`, 736×992)
- **What it is:** four posters in one system on black, each with a thin white ring figure above one lowercase word set large in the bottom-left. Each poster has the logo top-left, a small tag top-right, and the URL set vertically on the right edge.
- **The four figures:**
  - **building blocks:** a 4×3 grid of rings, two of them filled light grey.
  - **team:** six rings in two rows of three, each row overlapping by about 30% of the diameter, the second row offset by half a ring.
  - **cooperation:** two equal rings stacked vertically, overlapping by about 40% (visual estimate).
  - **impact:** twelve rings stepped diagonally with opacity fading from the back ring to the front.
- **For Moneybee:**
  - **building blocks → Portfolio approach:** a grid of rings with 15–20 filled orange is "a concentrated portfolio of approximately 15–20 high-conviction stocks". It could also show the maximum sector allocation of 30%.
  - **cooperation (overlapping rings):** do NOT use for PMS vs AIF. The user rejected it on 2026-10-01: "it's a vs, not a mixture". PMS vs AIF is two equal, separate rings side by side.
  - **team → /team or /about:** six rings.
  - **impact → wealth growth or the philosophy's progression.**
- **Motion:** rings draw on with `stroke-dashoffset`. Fills land last, in orange.

### 03 Futerra glyph columns (`03-futerra-glyph-columns.png`, 736×920)
- **What it is:** a dark card with three equal columns. Each column holds a small white glyph of about 40px (triangles around a circle; a circle with an orbiting dot; a radial burst of dots), a three-line heading with one word in italic, and a small justified-left body. There's a section label top-left, a page number bottom-left, and a small star top-right.
- **For Moneybee:** the philosophy's three stages, Undiscovered, Under-researched and Under-estimated, get one bespoke glyph each. They're set in Instrument Serif with one word in italic (the font has an italic), for example "Under-*researched*". The same pattern fits What We Look For (six) and What We Don't Do (five) as two-column groups. There are no captions beyond the docx lines.

### 04 PayTo line cards (`04-payto-line-cards.png`, 735×453)
- **What it is:** four translucent grey cards (about `#4B4B4B`) on a black gradient. Each card has a title, a one-line description, a centred line illustration in white with exactly one orange element, and a link bottom-left.
- **The four illustrations:**
  - a database cylinder with one orange ring
  - lines fanning from one orange line
  - an orange square with radial arrows pointing into it
  - an orange square with arrows out to three hollow squares
- **For Moneybee:** AIF key terms, one card each: minimum investment (a ring with one orange cell), time frame (a line with an orange segment of 3–5 years), listed and unlisted (two sets of squares), benchmark (a line against an orange line), and exit load. They could also be the seven Why Moneybee PMS points. On our white pages the cards are `#F6F6F6` with black line art and one orange element. On a black band they're white line art with one orange element.

### 05 Converging lines (`05-converging-lines.png`, 736×736)
- **What it is:** about thirteen red curves leave evenly spaced points on a vertical line at the left and converge to a single point. From there one red line runs right along the horizon to a tiny figure holding a telescope. Where the curves meet, the red deepens because the strokes overlap. Four numbered steps sit to the left. The page is `#F2EFE8`.
- **For Moneybee: the stock selection process,** replacing the current trapezoid funnel. Many lines (the universe from financial information, screeners, reports, news flow and team experience) converge through Screen, Shortlist, Analyse and Decision Making into one line (the portfolio). The figure at the end is the long view: "At least 3-year investment horizon". The numbered steps are the docx's own. The curves are black hairlines until the portfolio line, which is orange.
- **Motion:** the curves draw on in step order as the reader scrolls. At each step some curves fade to 10% (dropped companies) and the survivors carry on to the point.

### 06 Stacked blocks (`06-stacked-blocks.png`, 736×736)
- **What it is:** a tower of four isometric boxes of different heights with gaps between them, a tiny figure on the top face, and four numbered callouts with elbow leader lines to the boxes. The faces are `#DF2914` (lit) and `#7C1F17` (shaded).
- **For Moneybee:** the Risk management framework (liquidity, valuation, market and concentration risk) as four stacked blocks, or the Portfolio approach rules.
- **Caution:** the memory note [[no-selection-sheets-funnel]] bans an isometric stacked-sheets *selection funnel*. These are solid blocks with callouts, not a funnel, but show it in preview before using it.
- **In our colours:** lit faces `#F6A11A`, shaded faces `#8C5E22` (or black at 85%), black hairline leaders.

### 07 Isometric block (`07-isometric-block.png`, 736×736)
- **What it is:** one isometric L/T-shaped solid with a figure walking along its lower arm casting a shadow, and three numbered callouts. The colours are the same as 06.
- **For Moneybee:** a single "path" figure: the Careers "How to apply" steps, or a case study's timeline. It's lower priority.

### 08 Growing circles (`08-growing-circles.png`, 736×552)
- **What it is:** four red discs on one horizontal axis, growing left to right. Each has a thin white arrow from its left edge to past its centre. The figure with the telescope stands on the largest disc, and the four numbered steps sit below.
- **Measured:** the diameters are 67, 103, 138 and 174px, so each disc is +36px (a linear step). All four centres sit on y ≈ 195. The gaps between discs are 3–4px, so they almost touch. The fill is `#DF2914` on `#F2EFE8`.
- **For Moneybee: wealth growth, area-true.** ₹1 Mn in August 2007 became ₹5.97 Mn in the S&P BSE 500 TRI and ₹28.85 Mn in Moneybee PMS by July 2026 (deck, `WEALTH` in `lib/insights.ts`). With area proportional to value, the diameters are d, 2.44d and 5.37d. The benchmark disc is black or grey, the Moneybee disc orange, and the figure stands on the orange disc.
- **Alternatives:** the philosophy's three stages as three growing discs, or the timeline 2004, Aug 2007, Oct 2025.
- **Motion:** each disc scales up from its centre as it enters; the arrows draw on after.

### 09 Process diagram sheet (`09-process-diagram-sheet.png`, 564×1056)
- **What it is:** a vertical process sheet on `#F2F2F2`. Numbered stages are separated by full-width hairline rules, each with a small title top-left. The stages use a small vocabulary of shapes:
  - a chain of five touching rings holding text
  - a three-ring Venn joined by a dotted arrow to a filled black node, then a dashed box with a list, then a filled black square
  - a dotted "targeting" ring around a node, with solid arrows in and a feedback arrow looping back
  - four concentric half-rings numbered 1–4 over a baseline, with the filled core at the centre, a diagonal "Flexibility" arrow, and labels tied to the rings by hairline leaders
  
  Four labelled columns of lists close the sheet. The ink is black. Rings are 1px, and the filled nodes are solid black.
- **For Moneybee: Our Approach.**
  - **The six-step process:** Screen, Shortlist, Analyse, Decision Making, Monitor and Exit become a chain of six rings. The Analyse ring holds its own Venn of management meetings, plant visits and financial modelling. Monitor loops back with the dotted feedback arrow. Exit is the filled node, in orange.
  - **What We Look For and What We Don't Do:** two list columns under a rule.
  - **The four risks:** the concentric half-rings, with the portfolio as the filled orange core and the four risks as rings 1–4.
  - This vocabulary also fits the AIF structure if it ever returns (Investors → Fund → Manager, with the four parties as rings around the fund).

## Build notes for our stack
- Draw every figure as inline SVG in a React component, with its data taken from `lib/*` (no numbers typed into the SVG). This follows the existing `components/drawing/plate.tsx` helpers (`Draw`, `Hatch`, `tr`).
- Scroll motion uses the site's existing CSS scroll-driven `Rise`/`view()` timeline where possible, or `useInView` plus transitions, as in the /about sections. Under `prefers-reduced-motion`, every figure renders its final state.
- One orange element per figure. Labels are Geist Mono uppercase at 11px (`EYEBROW`), headings Instrument Serif, and numbers can be Instrument Serif at display size, like Titan Gate's stat numbers.
- No captions that explain the figure ([[no-subtitles]]), and no ↗ arrow.
