# Whitespace Pattern Cards

Source: https://experiments.thisiswhitespace.com/pattern-cards (pinned 2026-10-11).
`page.html`, `chunks/` (the deployed scripts), `pattern-cards.pretty.js` (chunk 070xmj55pfhp-.js
formatted; the card is the module around line 930), `rest-hover.webm` and `f15/` (15 fps crops of
the black card), `sheet.png` (rest frames, then hover frames).

## Mechanics, read from the source

- Glyph: a 5 × 5 grid per card (`a`, `b`, `c` patterns), each cell `solid`, `ring` or `empty`.
  Cell pitch is size / 5 (size 127), dot radius pitch × dotScale / 2 (0.86), ring stroke
  2r × ringStrokeScale (0.06).
- Morph, every cell, always running: `g = clamp((sin(t · speed · 2π + phase · phaseSpread) +
  fillBias + 1) / 2)`, eased `g < .5 ? (2g)^e / 2 : 1 - (2(1 - g))^e / 2` with e = easing.
  The solid's radius is r(1 − x); a ring of radius r − stroke / 2 is drawn at opacity x. So a
  solid shrinks to a point inside a ring that fades in, then grows back. speed 0.16 (6.25 s a
  cycle), phaseSpread 2.25, easing 3, fillBias −0.34 (mostly solid), phase = 0.45 · row + 0.7 · col
  (a diagonal wave).
- Drip: from the lowest cell of each column, one particle every 1 / spawnRate s (0.6/s) ±
  jitter (0.16), falling at 47 px/s, living 1.7 s, opacity 0.28 fading linearly (fadeStart 0).
  Particles are cells too and morph on the same wave.
- Pointer: scale = 1 + (1 − d / R)^1.6 · (3.8 − 1) inside R = 161 px; 40 relaxation passes push
  overlapping cells apart, keeping their resting gaps; positions and scales ease toward their
  targets with time constants 260 ms and 220 ms (`1 − exp(−dt / τ)`). Particles fade out while the
  pointer is in. The glyph also moves to the card centre (420 ms, cubic-bezier(.22,.61,.36,1),
  stagger up to 320 ms) and the other cards fade to 0.12.
- Shimmer: a blurred white band (162% wide, 38°, 60 px blur, screen blend, 0.2) crosses the card
  in 320 ms every 8 s.

Used by the homepage's two product cards (preview: app/(frontend)/preview/two-ways). Not used:
the other-cards fade (PMS and AIF stay equal) and the move to centre.
