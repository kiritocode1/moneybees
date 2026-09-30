# 360 Lexington Ave, stacked cards scroll (details.so/inspo/360lexingtonave-92d4dc)

Source site: https://360lexingtonave.com/ (Framer, Lenis smooth scroll, no GSAP/ScrollTrigger; no window.gsap).
Video pinned: big.mp4 (1920x1196, 60fps, 5.48 s). Frames at 15 fps: frames/f001..f082.jpg. Contact sheet: sheet.jpg.
Live probe at 1440x900: shot-900.png, shot-1300.png, shot-2000.png (best), shot-3000.png.

## Mechanism (one sentence)
Not exploded layers: a sticky 800px stage holds three full-bleed panels; panel 1 sits still, and panels 2 and 3 are translateY'd 950px below the stage and slide up, one after the other, linearly with scroll, landing on top of panel 1 as a half-width right card (2) and a smaller bottom-left card (3), so the panels end up overlapping like stacked sheets.

## Measured (1440x900, Lenis on)
- Wrapper: 3080px tall. Sticky child 800px tall, top:0. Pinned for 2280px of scroll (scrollY 900 to 3180 when wrapper starts at y=900).
- Panel 1 (light, rgba(17,18,19,.04)): 1400x558 at left 20, top 141, never transforms. Number "01".
- Panel 2 (dark brown rgb(46,37,32), text white): 706x558 at left 715, top 141. Starts translateY 950, ends 0. Covers right half of panel 1.
- Panel 3 (navy rgb(24,37,58)): 706x398 at left 20, top 301 (bottom-left). Starts translateY 950, ends 0.
- Rate: 1.0556 px of translate per px of scroll (748.4 at y=1000, 220.6 at y=1500). So each panel travels 950px over ~900px of scroll (about one viewport height).
  - Panel 2: starts at scrollY ~809, done ~1709 (starts while stage is still arriving, 91px before pin).
  - Panel 3: starts ~1719, done ~2619. Remaining ~560px is a hold, then the stage unpins and the next section ("360 Lex has been thoroughly reimagined") scrolls in.
- Easing: none on the transform (linear with scroll progress). Smoothness comes from Lenis (html.lenis.lenis-smooth). Panels stay opacity 1, radius 0, no scale, no shadow.
- Panel gaps: 20px outer margin, 20px inside padding. Card heading Instrument Sans 40px / 400 / -1.2px tracking. Body grey 18-20px. Big index number (01/02/03) ~100px light grey at bottom-left of each card. Image right-aligned in cards 2 and 3 (325x387 on card 2).
- Labels: title, one-sentence body, two-digit index. No connectors or lines.
- Mobile (ssr-variant hidden-857dw3 etc.): separate Framer variant per breakpoint; at 1280x577 it renders stacked cards 418px tall, 20px gap, same sticky pattern, not probed further.

## Moneybee mapping
Fit: this is a sticky cumulative stack, good for things that sit on top of each other and keep earlier content visible. Cheap to build: one sticky div plus `useScroll` (motion) or GSAP ScrollTrigger scrub, `y = 950 * (1 - p)` per panel, p linear, optional Lenis.
1. Flyingbee structure (best fit). Panel 1 "Investors" (full width, light), panel 2 "Fund" (right half, black), panel 3 "Manager" (bottom-left, orange #F6A11A). Trustee, custodian, RTA, brokers as four small chips that arrive inside panel 3 or as a fourth thin strip. Shows who sits on top of whom without a flow diagram.
2. PMS vs AIF. Panel 1 "Investor", panel 2 "PMS" (own securities account, right half), panel 3 "AIF" (pooled fund, bottom-left). The overlap itself says they share one investor base.
3. Portfolio construction steps: Research, Selection, Sizing as three cards. Weaker, because steps read better as a sequence than a pile.
Adaptations: Moneybee palette (white, black, orange, grey #9D9EA1). No images required; put a real number or one line per card (facts only from the decks). Reduced motion: render the three cards static in final positions. Mobile: stack the cards full width, each sliding over the previous, same sticky.
