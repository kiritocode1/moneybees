# movin mv-03635, "Kinetic type and dot fields cut against product UI"

Source: https://movin.design/video/kinetic-type-and-dot-fields-cut-against-product-ui/
File: `mv-03635.mp4`, 1280×720, 30 fps, 10.09 s, loops. Frames at 15 fps in `f15/`.
Studied frame by frame on 2026-09-24. Timings below are measured off `f15/` (one frame = 67 ms).

## Structure

- Panels separated by 1px black hairlines. One vertical line at x=640. Each column has its own
  horizontal divider, and the dividers move between beats (right column ~y90 to ~y185), so the grid
  reflows rather than staying in quadrants.
- A dark rounded logo tile sits fixed where the lines cross.
- Every panel runs its own loop and cuts at its own time. At any moment roughly one panel is
  changing. There are no crossfades between contents; cuts are hard.
- Ground #F4F3F0-ish off-white, ink black, one orange (brackets, the ball, the waffle, glows).
- The seed motif is a single black dot centred in an empty panel. It precedes the caption, the dot
  field and the wave. A row of four small dots ("• • ○ •") grows into the wave.

## 1. "Thousands of people are using it right now." (dot field)

Plays twice: top-right 0.0 to 2.0 s, top-left 4.4 to 6.6 s.

1. Hard cut to a sparse random scatter on a square lattice. Panel 640×360 holds about 21×12 cells,
   ~30 px pitch, dots ~24 px (80% of pitch).
2. A clear rectangular band left of centre is reserved for the sentence from the first frame. It is
   sized to the finished sentence plus padding, and dots never enter it.
3. Dots fill the remaining cells in random order until every cell is taken, over ~1.1 s. Dots pop in
   at full size, no scale-up.
4. Some cells are hollow: a 1 px grey outline circle instead of a filled dot. About 1 in 12. They
   exist from the first scatter and a few swap between filled and hollow while it holds.
5. The sentence types word by word, ~150 ms a word. The newest word is light grey and darkens when
   the next one lands. Mid-word characters also appear ("Thousands of" before "people").
6. Holds ~1 s once full.
7. Exit: a ripple displaces a few rows (dots bunch into a curve) for 2 to 3 frames, then hard cut to
   the single dot on white.

## 2. "[ Growth isn't the same as understanding ]" (bracket caption)

Plays twice: top-right 2.0 to 4.4 s, top-left 6.6 to 8.6 s. Always follows the dot field.

1. Single black dot, centred, holds ~0.5 s.
2. It is replaced by a closed orange bracket pair "[]" (1 frame), which opens to "[ ]" (1 frame).
3. "Growth" appears inside, first tight "[Growth]", then the brackets ease out to "[ Growth ]" over
   ~0.3 s. Brackets orange, text black, sans ~16 px.
4. Words then add one at a time, ~270 ms each: isn't, the, same, as, understanding. The caption stays
   centred, so each word shifts the whole line left by half its width (measured 13 to 16 px jumps on
   exactly the word frames, no drift between).
5. From the second word, faint grey copies of the current caption fade in behind: a brick layout of
   three rows (above, same row, below), alternate rows offset by half a step. Copies are anchored to
   the caption and update word by word with it. Copy brackets are grey, not orange. Contrast is
   about 20%.
6. The step between copies equals the width of the finished sentence. While the caption is short the
   copies are sparse islands; they close into a seamless ribbon exactly as "understanding" lands.
7. Holds ~0.2 s complete, then cut.

## 3. Other loops

| Loop | Mechanism |
| --- | --- |
| "Let's / talk / about / your" | One word per line, characters typing. The current line has a solid bullet; earlier lines get hollow bullets, go grey, and the stack scrolls up. |
| Dot wave | Starts as four small dots in a row, grows into a sine wave of large dots that travels sideways like a conveyor. Hollow dots interleaved. The wave phase moves continuously. |
| "Produc" / "ct." | Word too big for its panel, cropped. "Produc" enters with a brown to olive gradient fill that settles to black over ~0.6 s. Cut to "ct." sliding with horizontal motion blur, and the full stop is a yellow-orange sphere. |
| Orbs | The sphere becomes an orb labelled "Exploring…", which spawns more orbs in a loose grid ("Focusing…", "Trying…"), gradients shifting orange to cyan. |
| Hex cluster card | "Attributed revenue" counts up $4,001 to $9,856 while hexes fill in with scattered colour, then the colour drains to grey. |
| Ring | Dots on a ring seen in perspective, rotating. Near dots large, some blurred for depth; far dots small, some white-filled or hollow. The centre figure counts down $3.51M to $3.04M. |
| Ticker | Giant figures cropped by the right edge ("−$3.54", "−$7.94", "−$8.14"). Rows add from the top and push down. A small status line cycles beside them: "Searching…", "Drafting response…", "Compiling answer…". |
| KPI cards | Four small cards ($2.87M, $682K, $324K, 38.2%) with large black particles drifting over them at different sizes and blur, and an orange glow sweeping across the cards. |
| "well …" | Huge cropped "well …", cut to "well… you can" at small size. |
| Export to waffle | A black "Export" pill is pressed, becomes one orange square, which is the first cell of a waffle chart. The chart builds while zoomed in, then pulls back to the whole week (this week orange over last week grey). |
| "Resign / 96% staff left" | Icon, label, and a tick bar. |
| Close | "Lumen" logo tile, and the loop wraps to the opening states. |
