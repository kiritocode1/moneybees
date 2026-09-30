# movin mv-04076, "Contact permission prompt with glowing friend rows"

Source: https://movin.design/video/contact-permission-prompt-with-glowing-friend-rows/
File: `mv-04076.mp4`, 720x848 (single phone mock, not split), 60 fps, 4.02 s. Frames at 15 fps in `frames/`
(t = (n-1)/15). Best frames: `best-f014.png` (row growing), `best-f022.png`, `best-f034.png`, `best-f060.png`
(final). Sheets: `sheet0.png`, `sheet1.png`, `bottom-f22-37.png`. Measured 2026-09-30: per-frame pixel counts of
the green band, the orange ring and white text, plus every frame viewed.

## Mechanism

Three dark pill rows enter one after another from the left; the middle row alone fills with a green to yellow
gradient sweep that ends in an orange-ringed avatar, so it reads as the lit "winner" among grey rows.
Decorative glyphs pop in around it, then the headline, body copy and a privacy card rise in below.
The final state holds for ~1.8 s.

## Structure and colors (final frame)

- Ground #141414 inside a black phone (#010101) with dynamic island, 9:41 status bar. Everything is dark
  grey on dark grey except the lit row and white text.
- Rows: three pills 82 px tall (lit row y 410 to 491), centre pitch ~105 px (centres ~y 346, 451, 556).
  Each is a horizontal fade from transparent at the left (x ~200) to solid at the avatar circle at the right.
  Dim rows fill ~#1F1F1F to #171717, avatar circle ~64 px, dark with a 2 px lighter rim, grey silhouette.
- Lit row gradient, sampled along y=470 (left to right): #181E21 (x200), #253137 (230), #295252 (260),
  #187964 (300), #0CA073 (340), #32B150 (380), #87AC2E (410), then the avatar. The tail is a fade from
  transparent, teal middle, green, ending yellow-olive at the avatar.
- Avatar ring: #F4AA1F, 4 px stroke, ~66 px outer width (x 430 to 495). Near the Moneybee orange #F6A11A.
- Glow: none as blur. The "glow" is the gradient itself, saturated against grey rows. The glyphs are
  ~10% brighter than the ground.
- Headline white 32 px semibold ("Find your friends!"), body ~16 px #BDBDBD, privacy card a 1 px outlined
  rounded rectangle with a blue lock chip.

## Timeline

| t (s) | Frame | Element | Change |
| --- | --- | --- | --- |
| 0.00 to 0.33 | 1-6 | Status bar and phone | Fade in from black |
| 0.40 to 0.53 | 7-9 | Logo pill | Fade in and settle, ~0.13 s |
| 0.60 to 0.80 | 10-12 | Rows | Rows enter from the left as ghosts, offset in y: top dim row first, then the middle row, then the bottom row (~0.07 s apart) |
| 0.80 to 1.33 | 13-21 | Lit row | Gradient grows: right end 305 to 409 px, left end 238 to 266, avatar ring slides right, left edge of ring 378 to 430 (52 px) |
| 0.87 to 1.40 | 14-22 | Ring | Stroke draws in: pixel count 14, 362, 446, 464, 483, 478, 473, 487, 516 then flat at ~513 |
| 1.0 to 1.5 | 16-23 | Glyph cloud | Checkered flag, flame, dots, four-point sparkles fade in one at a time on the right, each ~0.1 s apart, then stay still |
| 1.53 | 24 | Headline | Fades and rises ~8 px in ~0.13 s, settles by 1.67 s |
| 1.80 to 2.07 | 28-31 | Body copy | Two lines, one after the other, same rise and fade |
| 2.13 to 2.27 | 33-35 | Privacy card | Rises in; the row tail extends left in one frame (green band left edge 266 to 204 px at t=2.20) |
| 2.27 to 4.02 | 35-60 | Everything | Hold. No further motion, then the clip ends |

The lit row settles in 0.6 s from start of the move (0.8 to 1.4 s); avatar position deltas per frame are 8, 10, 12, 10,
4, 6, 0. That is ease-out with a mid-move speed peak (about 180 px/s) and no overshoot. The row stagger is
~70 ms, the glyph stagger ~100 ms, text stagger ~270 ms between headline and body.

## Moneybee mapping (performance page: how we perform)

Data: `PERIOD_RETURNS` in lib/insights.ts (period rows, Moneybee vs benchmark) and lib/aif.ts.

1. **Period rows with one lit row.** Rows are periods (1Y, 3Y, 5Y, since inception). Each row is a
   dim pill with the benchmark return at the right end and the label at the left. The row currently
   in view gets the orange treatment: a bar sweeps from left, its length scaled to Moneybee return (tail
   fades out to transparent as in the reference), ringed marker at the end carrying the number. Grey
   sibling rows show the benchmark as a shorter dim bar. Enter with 70 ms stagger, 0.6 s ease-out
   (cubic-bezier 0.22, 1, 0.36, 1), ring stroke draws in over the last 0.3 s.
2. **Moneybee vs benchmark pair per period.** Instead of rows of different people, each period is two
   stacked pills: the grey benchmark and the lit Moneybee bar. Lit bar palette: gradient from transparent grey
   #9D9EA1 to orange #F6A11A (the reference's teal to yellow is replaced by a single-hue ramp,
   keeping brand). Excess return printed once at the ring.
3. **Alpha callout.** After the rows settle, headline and body rise in below (1.5 s after start, 0.27 s
   stagger), then a one-line outlined card for the SEBI-registered disclosure, mirroring the privacy card.

Notes: keep the glyph cloud out. No decorative particles for an investment firm. Numbers come from
lib/insights.ts; the bar lengths must be proportional to the values. Reduced motion: render the final
frame. Rows animate once on scroll-in, not in a loop.
