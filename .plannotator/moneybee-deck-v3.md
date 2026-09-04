# Goal

Today the deck is 18 slides of one-word title, one big visual, and a five-line grey paragraph. That paragraph is the "too much text, not much information" problem, and stripping motion made it feel dead.
After: 20 bento slides. Each is a hero tile plus 2-4 fact tiles, one 14-word source line, and a staggered build. Job portal, group switcher, distributor and CRM get real slides. Timeline fits one month. The design-system slide is gone.
Proof: 20 screenshots at 1440x900 and 1280x720, motion measured against Emil's standards table, overflow empty, 20-page landscape PDF that still carries the full compliance text.

# One simple diagram

```text
now     one word  ->  one big visual  ->  5-line grey caption
after   one word  ->  hero tile + fact tiles  ->  one source line
```

# What changes, slide by slide

| # | Slide | Change |
| ---: | --- | --- |
| 3 | Record | Absorbs Wealth. Hero = Rs. 10 lakh rungs. Tiles: 19.44%, 9.90%, +9.54 pp, 19 years |
| 11 | Group | **New.** Switching between PMS, AIF, broking, advisory without mixing registrations |
| 13 | Careers | **New.** Multi-step Typeform-style portal. The slide you said was missing |
| 14 | Distributor | **New.** Compliance-first qualification gate, not a retail funnel |
| 15 | CRM | **New.** Where all four forms land and who owns the CRM |
| 16 | Timeline | 8 weeks becomes 4 |
| — | System | **Deleted.** Type/colour/data/motion specimens go |

Order: Moneybee, Today, Record, Periods, Method, Selection, Risk, Position, Scope, Systems, Group, Factsheets, Careers, Distributor, CRM, Timeline, Owners, Directions, Commercials, Decisions.

Merging Record and Wealth is my call, not yours. Four performance slides out of eighteen is what crowded out the build topics. Say so if you want Wealth back as its own slide.

# Real code for every real choice

## The bento grid

The current anatomy puts everything not-the-visual into one grey paragraph. The grid gives each fact its own tile, so nothing has to be a sentence.

```diff
- .slide { grid-template-rows: auto 1fr; }
- .visual { grid-template-rows: 1fr; grid-auto-rows: auto; }
- figcaption { max-width: 72ch; font-size: clamp(.72rem,.72cqw,.95rem); line-height: 1.45; }
+ .bento {
+   display: grid;
+   grid-template-columns: repeat(12, 1fr);
+   grid-auto-rows: minmax(0, 1fr);
+   gap: 1.1cqw;
+ }
+ .tile {
+   display: grid;
+   align-content: space-between;
+   padding: 2.6cqh 1.8cqw;
+   border-radius: 1.15cqw;
+   background: var(--tile);
+ }
+ .tile--hero { grid-column: span 8; grid-row: span 2; }
+ .tile--fact { grid-column: span 4; }
+ .tile__value { font-size: 3.4cqw; line-height: .92; letter-spacing: -.045em; font-weight: 600; }
+ .tile__label { font-size: .82cqw; letter-spacing: 0; color: var(--muted); }
+ .foot { font-size: .78cqw; color: var(--muted); }   /* 14 words, hard cap */
```

`--tile` is `#ffffff` at 62% on paper slides and `#ffffff` at 5% on dark ones. Tiles are the only rounded shape in the deck, so they never read as the old cards.

## Where the compliance text goes

It cannot just disappear, and it should not be on the wall. The visible foot line is capped at 14 words. The full caveat stays in the DOM and the print stylesheet brings it back, so the circulated PDF is still the compliance record.

```diff
- <figcaption>1 August 2007 to 31 July 2026, effectively 19 years. Since-inception CAGR, after
-   expenses. Source: client AIF marketing deck, page 12, APMI table. Client-supplied confidential
-   material. Compliance approval is required before public use.</figcaption>
+ <p class="foot">1 Aug 2007 – 31 Jul 2026 · AIF deck p.12 · APMI</p>
+ <p class="note">Since-inception CAGR, after expenses. Client-supplied confidential material.
+   Compliance approval required before public use.</p>
```

```css
.note { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
@media print {
  .note { position: static; width: auto; height: auto; clip: auto;
          font-size: 7pt; color: #79766e; }   /* the PDF keeps the full record */
}
```

## Motion, with the standard it comes from

Pi read `review-animations/STANDARDS.md`, hit "never animate keyboard-initiated actions", and killed everything. That rule is about command palettes fired 100+ times a day. A slide's content build is seen once per meeting and its purpose is **explanation**, which the same file lists as valid, under a row that reads "marketing / explanatory: can be longer."

Two different things, two different answers:

| Motion | Frequency | Verdict | Value |
| --- | --- | --- | --- |
| Slide-to-slide swap | 30-60 per meeting | Near-imperceptible | 140ms opacity, no transform |
| Tile build | Once per slide | Standard | 260ms, 55ms stagger |
| Chart draw | Once per slide | Explanatory | 700ms ease-out |
| Button press | Occasional | Feedback | 120ms, scale .97 |

```diff
- .slide { transition: none; }
- /* no reveal, no draw, no stagger */
+ :root { --ease-out: cubic-bezier(.23, 1, .32, 1); }
+ .slide { transition: opacity 140ms var(--ease-out); }
+
+ /* Transitions, not keyframes: arrowing fast retargets mid-flight instead of restarting. */
+ .tile {
+   opacity: 0;
+   transform: translateY(1.1cqh) scale(.985);   /* never scale(0) */
+   transition: opacity 260ms var(--ease-out), transform 260ms var(--ease-out);
+   transition-delay: calc(var(--i) * 55ms);
+ }
+ .is-active .tile { opacity: 1; transform: none; }
```

Stagger caps at six tiles, so the last tile lands 275ms after the first. Nothing blocks input: the presenter can arrow straight through a building slide.

```css
@media (prefers-reduced-motion: reduce) {
  .tile { transform: none; transition: opacity 160ms ease; }   /* gentler, not zero */
  .chart-draw { stroke-dashoffset: 0; transition: none; }
}
```

## Careers — the slide that was missing

Multi-step, Typeform-style, one question per screen. Hero tile is the step flow; fact tiles say what it costs the candidate and where the answer goes.

```text
┌──────────────────────────────────────────┬─────────────────┐
│  ●────────○────────○────────○            │   4 STEPS       │
│  Role     Fit      Work      Contact     │   one question  │
│                                          │   per screen    │
│  ┌────────────────────────────────────┐  ├─────────────────┤
│  │  Which role?                       │  │   ~3 MIN        │
│  │  ○ Research analyst                │  │   to complete   │
│  │  ● Portfolio operations            │  ├─────────────────┤
│  │  ○ Compliance                      │  │   AUTO-ACK      │
│  └────────────────────────────────────┘  │   + CRM record  │
└──────────────────────────────────────────┴─────────────────┘
  Launch build. Ratings and scheduling quoted after discovery.
```

The visible step card is a real rendered form, not a screenshot. The honey dot sits on step 1 and the rail is the progress indicator, which is the whole point of the Typeform comparison: the candidate always sees how much is left.

Scope line stays honest. The self-enclosing form, the CRM record and the acknowledgement email are in the launch build. Ratings, pipeline and calendar workflow stay in discovery, where the current deck already puts them.

## Timeline — one month

Eight weeks becomes four. Same lanes, compressed, with the two review gates kept because they are the dates that actually bind.

```text
        W1              W2              W3              W4
Design  ███ concept ─── ███ screens
Build           ████████████████████████████ pages · editor · factsheets · forms
Content ██████ structure ──────── ███ compliance review
QA                                        ██████ a11y · perf · browsers
Launch  ◆ start                                          ◆ go-live
```

Compressing to four weeks holds only if design approval lands in W2 and content arrives in W1. That is a real commercial commitment and it should be said out loud on the slide rather than implied by a bar.

# Verification

1. Exactly 20 sections, 20 IDs, 20 generated `NN / 20` labels, all titles one word.
2. Screenshot all 20 at 1440x900 and 1280x720, inspect every one.
3. `window.__moneybeeDeckReport()` overflow empty at both sizes.
4. Measure the four motion values against the table above in the live browser, not by reading the CSS.
5. Confirm no tile stagger blocks navigation: arrow through all 20 in under 4 seconds, no stuck state.
6. Reduced-motion: transforms gone, opacity kept.
7. Every figure re-checked against `docs/moneybee-actual-specs-from-client-documents.md`.
8. 20-page landscape PDF via real Chrome; confirm the `.note` compliance text prints.

# What I am not doing

- Not changing any performance figure, source page reference, or compliance caveat. The negative one-year result stays.
- Not merging Moneybee PMS and Flyingbee AIF, and not attaching the 2007 record to the AIF.
- Not adding a fee illustration slide. You left it out of the four.
- Not promising ratings, pipeline or calendar workflow in the careers launch scope.
- Not touching `Proposal-moneybee.html`, `Meeting-brief-moneybee.html`, or the three homepage concepts.
- Not adding spring physics or gesture handling. This is a deck driven by an arrow key, not a touch surface.
