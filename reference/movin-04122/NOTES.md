# movin mv-04122, "Isometric stack of modular workflow blocks"

Source: https://movin.design/video/isometric-stack-of-modular-workflow-blocks/
File: `mv-04122.mp4`, 1280x720, 60 fps, 8.00 s. Frames at 15 fps in `frames/` (1 frame = 67 ms, t = (n-1)/15).
Right-half crops in `panel/`, contact sheets `sheet0..4.png`, `intro.png`. Best frames: `best-intro-f005.png`,
`best-docked-f072.png`, `best-out-f040.png`. Measured 2026-09-30 by pixel analysis of the light-blue fill
(213,225,253) centroid and bbox per frame, plus viewing every frame of 0 to 3.2 s and 3.2 to 6.4 s.

## Mechanism

Four flat isometric sheets are stacked (01 TRIGGER, 02 AI ACTION, 03 APPROVE, 04 DELIVER). Only sheet 02, which
is blue, slides out sideways along the iso x axis, holds, and slides back in, while thin blue rail markers
run vertically along the stack's dotted guides. Nothing else in the stack moves.

## Layout

- Split frame. Left half: eyebrow "Workflow Builder", 52 px heading "Modular workflows", grey paragraph,
  blue "Learn More" link. Right half (x 640 to 1280): pale grey #FCFCFC panel with the stack, the
  "DROP-IN MODULE" leader label right of sheet 02, and five text pills along the bottom (Sales & CRM,
  Marketing, Customer Support, Finance & Ops, Other).
- Sheets: rounded squares, 1.5 px grey outline (~#DADADA), white fill, mono uppercase labels set on the
  sheet's left edge along the iso axis. Sheet 01 carries a lightning glyph and a four-point sparkle.
- Vertical spacing between docked sheets is about 30 px, so the stack reads ~100 px tall. The gap opens
  to about 55 px (sheet 01 to sheet 02) while sheet 02 is out.
- Blue sheet: fill #D5E1FD, 3D edge (thickness ~10 px, front lower rim) solid #396CF3 (57,108,243),
  1 px dashed inset line inside the fill, a small pill toggle and dot at its right corner.
- Dotted vertical guide lines (grey, 1 px, dashed) at the left and right of the stack.
- Projection is 2:1 dimetric (about 26.6 deg): sheet width ~300 px, depth ~150 px.

## Timeline (first cycle, then loop)

| t (s) | Frame | Element | Change |
| --- | --- | --- | --- |
| 0.00 to 0.20 | 1-4 | Heading | Rises out of a clip mask (baseline-clipped, reveals bottom up), done by 0.2 s |
| 0.13 to 0.33 | 3-6 | Stack | Fades in from ~0 to 100% with blur ~6 px to 0; blue sheet reads first (already blue), grey sheets a frame later |
| 0.27 to 0.5 | 5-8 | Bottom pills | Fade in |
| 0.40 to 0.75 | 7-12 | Eyebrow, paragraph, link | Blur-in, paragraph first, link last (~0.25 s later) |
| 0.33 to 0.53 | 6-9 | Left rail marker | 5x45 px blue bar appears on left dotted guide near sheet 02 |
| 0.53 to 1.73 | 9-27 | Sheet 02 | Slides out. Centroid x 199 to 279 in panel px (~+93 px from docked 187). Fast start, decelerating: 199@0.53, 238@0.93, 262@1.20, 270@1.33, 277@1.60, 279@1.73 |
| 0.9 to 2.0 | 14-31 | Left rail bar | Travels down the left guide, y 240 to 377 (~137 px in ~1.1 s), tracking the sheet's lower rim, then shrinks to a dot and vanishes ~2.2 s |
| 1.5 to 3.4 | 23-52 | Right rail bar | Blue bar rises at sheet 02's right corner, drifts and pulses; bottom-guide spike moves under the stack |
| 1.73 to 3.4 | 27-52 | Sheet 02 | Holds out, drifting a few px (277 to 283) |
| 3.4 to 4.6 | 52-70 | Sheet 02 | Slides back in. 269@3.60, 250@3.87, 238@4.00, 211@4.27, 189@4.53, 187@4.67. Mirror of the out move, slightly slower start |
| 4.67 to 7.3 | 71-110 | Sheet 02 | Docked. The rail bars keep running (left bar down y 264 to 377 then back up, right bar spike) so the stack never sits dead |
| 7.35 to 8.0 | 111-120 | Sheet 02 | Starts the second slide out (x 175 at 7.33 rising to 206 by 7.93). The clip ends before the second peak |

Cycle length is ~6.8 s (slide out start 0.53 s to next slide out start ~7.35 s). Slide duration ~1.2 s each way,
hold out ~1.7 s, hold docked ~2.7 s.

## Easing (inferred)

Out move covers 80 px; first 0.4 s (0.53 to 0.93) covers 39 px, next 0.4 s covers 32 px, last 0.4 s 9 px.
That is ease-out (cubic-bezier about 0.22, 1, 0.36, 1), no overshoot. The way back is symmetric
ease-in-out (slow first 0.2 s: 283 to 269 in 0.27 s, then 90 px in 0.9 s, settling into 187 with no overshoot).
Left-rail bar is linear-ish (about 120 px/s).

## Moneybee mapping

Constraint: no stacked-sheets stock-selection funnel. All uses below are structure or process, not selection.

1. **Portfolio construction layers (lib/pms-v2.ts).** Stack = the layers of a Moneybee portfolio (for
   example core positions, special situations, cash reserve, risk overlay). The orange sheet slides out
   for the layer the copy is describing, shows its name and weight, then docks. Text on the left changes
   per layer. Use the loop only when the reader scrolls to the row, not as ambient motion.
2. **AIF fund structure (lib/aif-v2.ts).** Sheets = trust, manager, custodian, fund units. Slide out the sheet
   whose role the adjacent paragraph explains. Leader label carries the role ("Holds the assets").
3. **Process blocks on Our Approach.** Four sheets = the four process steps; the highlight advances
   down the stack step by step instead of a single sheet looping. This departs from the reference but
   keeps the mechanism: one lit sheet, slide 80 px, rail bar tracking it.

Palette swap: blue #396CF3 to orange #F6A11A, fill #D5E1FD to a 15% orange tint (#FDEBD1), greys to #9D9EA1 at
30 to 40%, labels in the site mono. Only orange on one sheet at a time.

Reduced motion: show the sheet slid out and static; drop the rail bars.
