# Goal

Remove the current slide 3 and rebuild the remaining deck around one idea per slide.
Every slide gets a one-word title, one dominant visual, and quiet evidence beneath it. No chips, card grids, eyebrow labels, or prose headlines.
We will prove it with 18-slide screenshots at 1440×900 and 1280×720, keyboard tests, overflow checks, and a landscape PDF.

# One simple diagram

```text
today   [prose headline] -> [panel grid] -> [visible UI chrome]
after   [one word]       -> [one visual] -> [quiet caption]
```

# File table

| File | Today | After |
| --- | --- | --- |
| `Moneybee-client-meeting-plan-05-Sep-2026.html` | 19 slides. Slide 3 is a four-panel recap. Most slides use sentence headlines, top-right chips, repeated eyebrow labels, boxed groups, and a large persistent control pill. | 18 slides. Slide 3 is gone. Titles are one word. Each slide gives most of the canvas to one chart, diagram, screenshot composition, or number. Dates, methods, sources, and caveats sit below the visual in muted text. Controls stay keyboard and button accessible but disappear until hover or focus. |

# Real code for every real choice

## The visual rule

This is shown on a boardroom display in normal daylight. The deck should read from across the room, then reward a closer look with the source line.

I will use Apple's presentation discipline, not Apple's assets or a copied template:

1. One visual claim fills the slide.
2. A one-word title orients the room without narrating the slide.
3. Exact values sit on the graphic where they matter.
4. Method, date, source, and compliance language sit beneath the graphic in muted text.
5. Black and warm-white slides alternate only when the story needs a hard change of pace. Honey marks Moneybee data, never decoration.

From wall: Deck.gallery (`insp_deckgallery`). I inspected the live Apple Event Product Summary 2023 deck in Argent. I will adopt its object scale and dark stage, adapt its tight visual labelling into full-slide financial graphics, and reject its bento mosaic and pill controls because those are the same card grammar the current deck needs to lose.

From skill: Emil Kowalski's `apple-design` and `emil-design-eng` at commit `d23d7f8` (`insp_emil-kowalski-skills-github`). I read both skills. They change the redesign in four concrete ways:

| Before | After | Why |
| --- | --- | --- |
| Custom presentation face | The Apple system font stack | Optical sizing and familiar metrics matter more here than brand decoration. |
| One negative tracking value | Tight tracking only at display sizes; body and captions stay near zero | Tracking must change with size. |
| Horizontal slide transitions on every key press | Slides replace instantly | Keyboard navigation is repeated input. Animation would add latency. |
| Decorative stagger on every label | Static graphics, with motion used only for direct button feedback | Every animation needs a purpose. The visual should carry the explanation. |

The plan also follows the skill's distinction between simplicity and minimalism. Sources and compliance caveats remain because removing necessary context would make the deck less clear, not more Apple-like.

## One-word titles

| New slide | Title | Existing slide | Dominant object |
| ---: | --- | ---: | --- |
| 01 | Moneybee | 01 | Cover wordmark and meeting date as a quiet footer |
| 02 | Today | 02 | Four meeting outcomes on one horizontal line |
| 03 | Record | 04 | 19.44% and 9.90% on one shared baseline |
| 04 | Wealth | 05 | Rs. 10 lakh to Rs. 2.885 crore and Rs. 59.7 lakh |
| 05 | Periods | 06 | Four-row return comparison |
| 06 | Method | 07 | Group, PMS, and AIF chronology with the separation made visual |
| 07 | Selection | 08 | 6,000-to-20 hourglass stream |
| 08 | Risk | 09 | 30% sector ceiling dial with 15–20 holdings and 3+ years below |
| 09 | Position | 10 | One line joining record, process, and limits |
| 10 | Scope | 11 | Included work above a boundary, discovery work below it |
| 11 | Systems | 12 | Existing-app handoff versus API-built screens |
| 12 | Factsheets | 13 | Upload, approval, publication, archive |
| 13 | System | 14 | Type, colour, data, and motion shown directly on the canvas |
| 14 | Timeline | 15 | Eight-week line with parallel work lanes |
| 15 | Owners | 16 | Five names placed along one handoff sequence |
| 16 | Directions | 17 | Three unboxed homepage captures, aligned like products rather than cards |
| 17 | Commercials | 18 | ₹80,000, then 40 / 30 / 30 on one line |
| 18 | Decisions | 19 | Eight fill-in lines with owner and date beneath each decision |

The current slide 3 is deleted, not merged. Its accepted, removed, input, and separate-scope content already appears in the scope, systems, factsheet, owners, and commercial slides.

```diff
- <section class="slide" id="slide-3" data-title="Proposal response">
-   <h2>What changed after Shreyam's notes.</h2>
-   <div class="decision-grid">...</div>
- </section>
+ <!-- Removed. The later decision slides carry the useful content. -->
```

## Slide anatomy

The current deck explains itself before showing the thing. The new anatomy starts with the thing.

```diff
- <header class="slide-head">
-   <div>
-     <p class="eyebrow">Moneybee PMS · as of 31 July 2026</p>
-     <h2>A dated record, beside its benchmark.</h2>
-   </div>
-   <span class="chip">1 Aug 2007 to 31 Jul 2026</span>
- </header>
- <div class="record-layout">...</div>
- <footer class="source">...</footer>
+ <h2 class="slide-title">Record</h2>
+ <figure class="visual visual--record">
+   <svg aria-label="Moneybee PMS 19.44% since-inception CAGR against 9.90% for S&P BSE 500 TRI"></svg>
+   <figcaption>
+     1 Aug 2007 to 31 Jul 2026. CAGR after expenses.
+     Source: client AIF marketing deck, p. 12. Compliance approval required before publication.
+   </figcaption>
+ </figure>
```

No slide will contain `.eyebrow`, `.chip`, `.decision-card`, `.owner-card`, `.scope-item`, `.concept-card`, or a decorative dashed box.

```diff
- .slide-head { display:flex; justify-content:space-between; }
- .eyebrow { text-transform:uppercase; letter-spacing:.18em; }
- .chip { border:1px solid; border-radius:999px; padding:.45rem .8rem; }
- .decision-grid { display:grid; grid-template-columns:repeat(4,1fr); }
+ body {
+   font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
+ }
+ .slide-title {
+   font-size: clamp(3.75rem, 6.2cqw, 6.75rem);
+   line-height: .94;
+   letter-spacing: -.045em;
+ }
+ .visual { min-height:0; display:grid; grid-template-rows:1fr auto; }
+ .visual > svg,
+ .visual > img { width:100%; height:100%; min-height:0; object-fit:contain; }
+ figcaption {
+   max-width:72ch;
+   padding-top:1.4cqh;
+   color:var(--muted);
+   font-size:clamp(.72rem,.72cqw,.95rem);
+   line-height:1.45;
+ }
```

## Graphics

The user likes the visualisations, so the data contracts remain. The surrounding layouts change.

- `Record` becomes a single baseline with two endpoints. The date moves below it.
- `Wealth` keeps the paired-rung comparison but removes the large title block and bracket copy from the top half. The exact terminal values own the canvas.
- `Periods` labels rows `1 year · TWRR`, `3 years · CAGR`, `5 years · CAGR`, and `since inception · CAGR` directly on the chart.
- `Method` removes the side panel. The three dated product lines fill the slide. Founder experience, case-study caveat, and the current AIF result sit beneath the timeline as three quiet notes.
- `Selection` keeps the hourglass, increases it to roughly 80% of the canvas, and moves process phrases beneath each stage instead of floating at both sides.
- `Risk` keeps the tick gauge. The 15–20 holdings and 3+ year horizon become two plain labels below the dial, not separate blocks.
- `Position` becomes one visual sequence: `2007 -> 19.44% -> 6,000 -> 20 -> 30%`. Common competitor language moves to a single muted sentence below it.
- `Scope`, `Owners`, and `Commercials` use lines and spacing, not containers.
- `Directions` uses the three existing screenshots without borders, numbered circles, card captions, or a review chip. Each gets one word beneath it: `Quiet`, `Landscape`, `Direct`.

The source material remains unchanged. Moneybee PMS and Flyingbee AIF stay separate. The negative one-year result stays visible. No forecast, fee term, portal feature, or compliance claim is added.

## Quiet metadata

Date and method are evidence, not UI. They move under the visual.

```diff
- <span class="chip"><i></i>1 Aug 2007 to 31 Jul 2026</span>
- <p class="mini-note">Width = companies remaining<br>One hairline tick ≈ 20 companies</p>
+ <figcaption>
+   Width represents companies remaining. One hairline tick is about 20 companies.
+   Source: Moneybee group profile, p. 13.
+ </figcaption>
```

The only persistent metadata is a small `03 / 18` in the bottom-right corner. It has no border, background, or label.

## Controls

Keyboard navigation, direct hashes, outline, resume, reduced motion, and print stay. The black control pill goes. Slide changes are instant, including keyboard navigation.

```diff
- .deck-controls {
-   display:flex;
-   position:fixed;
-   bottom:1rem;
-   border:1px solid rgba(255,255,255,.18);
-   border-radius:999px;
-   background:rgba(15,15,14,.94);
- }
+ .slide { transition:none; }
+ .deck-controls {
+   position:fixed;
+   inset:auto 2rem 1.6rem auto;
+   display:flex;
+   opacity:0;
+   transition:opacity 100ms ease-out;
+ }
+ .deck-shell:hover .deck-controls,
+ .deck-controls:focus-within { opacity:1; }
+ .deck-controls button { transition:transform 100ms ease-out; }
+ .deck-controls button:active { transform:scale(.97); }
+ .slide-index { position:absolute; right:4.8cqw; bottom:3.8cqh; color:var(--muted); }
+ @media (hover:none) { .deck-controls { opacity:1; } }
```

Buttons keep visible focus styles and respond on press. Reduced-motion mode keeps the same static slides and removes the small control fade.

## Renumbering

The DOM order becomes the source of truth. Hard-coded slide totals are removed so deleting a slide cannot leave `03 / 19` behind.

```diff
- <span class="slide-number">04 / 19</span>
+ <span class="slide-index" aria-hidden="true"></span>
```

```js
slides.forEach((slide, slideIndex) => {
  const label = `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  slide.querySelector(".slide-index").textContent = label;
});
```

Direct hashes become `#slide-1` through `#slide-18`. The corrected hash parser continues to let a direct `#slide-1` override the saved resume position.

## Verification

1. Confirm exactly 18 slide sections, 18 unique IDs, and 18 generated index labels.
2. Search every visible `h1` and `h2`. Each slide title must be one word.
3. Search for and remove the banned presentation classes and the old slide-3 copy.
4. Compare every number, date, benchmark, product name, source, and commercial term with `docs/moneybee-actual-specs-from-client-documents.md`.
5. Capture all 18 slides at 1440×900 and 1280×720 with reduced motion, then inspect every image.
6. Run `window.__moneybeeDeckReport()` at both sizes. Overflow must be empty.
7. Test arrows, Page Up/Down, Space, Home/End, outline, direct hashes, resume position, print button, and reduced motion. Confirm that a keyboard slide change has no transition delay.
8. Check pointer-down feedback and keyboard focus on the hidden-until-needed controls.
9. Check the browser console after all SVG functions run and run `node --check` on the extracted script.
10. Export the 18-page landscape PDF and inspect page count, clipping, captions, contrast, and hidden controls.

# What I am not doing

- I am not changing the evidence, scope, owners, schedule, or commercials to make the redesign easier.
- I am not removing the negative one-year performance result or combining PMS and AIF history.
- I am not changing `Proposal-moneybee.html`, `Meeting-brief-moneybee.html`, or the three homepage concepts.
- I am not copying Apple artwork, typography, product imagery, or a Keynote template.
- I am not copying Lieflat template code without commercial permission.
- I am not replacing the visualisations with generic photos, icons, dashboard cards, or decorative charts.
- I am not adding a visible presenter toolbar back after removing the current pill.
