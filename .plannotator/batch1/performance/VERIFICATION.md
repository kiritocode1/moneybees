# Performance preview verification

Preview: https://moneybees.localhost:1355/preview/performance

## Delivered

- `app/preview/performance/page.tsx`: preview-only route, shared navigation and footer, no closing CTA, excluded from indexing.
- `components/performance-v3/performance-hero.tsx`: retained the previous Tres Mares internal-hero composition and masked year columns. Runtime endpoints are 2007 and 2026, beside the since-inception CAGR from `PMS_ROWS`.
- `components/performance-v3/performance-sections.tsx`: all eight PMS periods, honest negative returns and N/A, the approved PMS chart renderer, AIF section and source methodology. Tightened desktop table rows and restored the chart's original panel colour.
- `components/performance-v3/aif-performance-chart.tsx`: retained the new Flyingbee composition using the same unchanged `LitRows` renderer. All five source periods are present, including three unavailable periods. Benchmark label follows `AIF_NAMES`.
- `components/performance-v3/wealth-growth.tsx`: retained the measured area-true circle construction. Aligned desktop labels to the study's centre-relative positions, fitted mobile values, and fixed reduced-motion and no-script final radii. Kept the shadow's static placement outside its animation wrapper.

## Sources inspected and decisions

- `app/pms/page.tsx` and all six section components under `components/pms-v3/`, plus the rendered `/pms`: the quality and spacing reference. None of its product or scroll figures was reused here.
- `reference/tresmares/NOTES.md`: off-axis internal heading, bottom-aligned table headers, hairline rows and masked odometer.
- `reference/visual-language/NOTES.md` and `08/STUDY.md`, `08/moneybee.svg`: fixed disc centres, 2.24-unit gaps, square-root radii, arrow geometry, silhouette and centre-relative labels. The script below compares captured geometry against this pinned SVG.
- `components/pms-v2/performance-chart.tsx`, `components/motion/lit-rows.tsx`: reused the actual approved chart renderer rather than rebuilding it. Both files remain unchanged.
- `reference/content-plan.txt` §7 and `lib/performance.ts`: section wording, July 2026 data, product names, N/A and disclaimers. No performance figures were retyped into the components.

## Checks

- `./node_modules/.bin/tsc --noEmit -p .`: passed.
- `./node_modules/.bin/eslint components/performance-v3/*.tsx app/preview/performance/page.tsx`: passed.
- `python3 .plannotator/batch1/performance/verify-evidence.py`: passed. Checks pinned circle geometry and area ratios, fixed centres during the reveal, scroll interruption, year endpoints, final reduced-motion radii, row counts and mobile overflow.
- Agent Browser session `pi-perf`: desktop 1440 × 900, mobile 390 × 844, each section scrolled into view and screenshots inspected. `scrollWidth === innerWidth === 390`.
- Ordinary circle reveal observed at radii zero, intermediate radii, and final radii. Scrolling backward and forward during the reveal does not reset centres or the final state.
- Reduced motion: no year animations, no hidden figure labels, final radii, zero transition durations. The initial `r: revert` implementation failed this check and was replaced with explicit final-radius CSS variables.
- Preview returned HTTP 200. A fresh browser session reported no page errors. An earlier browser session retained pre-existing compilation errors from the separate AIF preview; the fresh-session check distinguishes those from this page.
- Browser session closed. No packages installed, commits made, or dev-server lifecycle actions performed.

## Rendered PMS chart comparison

Cropped the actual viewport screenshots at x 192 to 1248 and y 156 to 657. The two chart crops are 1056 × 501.

- Mean absolute RGB error: 0.196, 0.203, 0.202 out of 255.
- Pixels differing by more than 24/255: 786 of 529056, or 0.149%.
- The DOM chart tops differ by 0.28125px. The diff is not pixel-identical; small text and edge differences remain.
- Detailed measurements: `chart-diff.json`. Images: `pms-reference-rows.png`, `pms-preview-rows.png`, `pms-chart-diff.png`.

Unchanged source hashes, SHA-256:

```text
28b3ceada327ec329a3469f56b46db7df7cadccfd02202bf1965765743fd186a  components/pms-v2/performance-chart.tsx
6f64a84908e5de0041c6f3d3af0954ddf721a308aacfbbdfb9bcdfb54e8100d6  components/motion/lit-rows.tsx
```

## Screenshots

All paths are relative to this directory. Each is a viewport screenshot, except the three explicitly named chart crops and diff.

| Section | Desktop | Mobile |
| --- | --- | --- |
| Performance header | [desktop-hero.png](desktop-hero.png) | [mobile-hero.png](mobile-hero.png) |
| PMS table | [desktop-pms-table.png](desktop-pms-table.png) | [mobile-pms-table.png](mobile-pms-table.png) |
| PMS chart | [desktop-pms-chart.png](desktop-pms-chart.png) | [mobile-pms-chart.png](mobile-pms-chart.png) |
| Wealth Growth | [desktop-wealth.png](desktop-wealth.png) | [mobile-wealth.png](mobile-wealth.png) |
| AIF Performance | [desktop-aif.png](desktop-aif.png) | [mobile-aif.png](mobile-aif.png), [N/A continuation](mobile-aif-na.png) |
| Methodology and Disclaimer | [desktop-methodology.png](desktop-methodology.png) | [mobile-methodology.png](mobile-methodology.png) |
| Reduced motion | [desktop-reduced-motion.png](desktop-reduced-motion.png) | [mobile-reduced-motion.png](mobile-reduced-motion.png) |

## Publication decisions

The preview is complete. The source data remains July 2026, not the content plan's August date. Final figures and the AIF benchmark label still need the client's compliance approval before publication, as the existing source notes require. The production `/performance` route was not changed.
