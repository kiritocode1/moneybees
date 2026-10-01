# Case-studies preview verification

Verified at https://moneybees.localhost:1355/preview/case-studies on 1 October 2026, using Agent Browser session `pi-cases`. The existing server was reused without starting, stopping or restarting it. No packages installed, no commits, no production route changes.

## Files

Kept the previous implementation's story panels, drawings, financial charts and preview route. Finished the hero layout and verification.

| File | Result |
| --- | --- |
| `components/case-studies-v3/journey-hero.tsx` | Heading now comes from `CASE_STUDIES_PAGE`. Measured dimetric faces, walker, shadow and leaders retained. |
| `components/case-studies-v3/case-studies.css` | Desktop title starts clear of Pitti's callout. Mobile padding replaces the collapsing SVG margin that displaced names into the figure. |
| `components/case-studies-v3/company-stories.tsx` | Retained and exercised. Exactly one complete article per company. Native scrolling drives bottom-up clip wipes, predecessor shading and snapping. |
| `components/case-studies-v3/financial-chart.tsx` | Retained and verified. Three labelled, zero-based linear financial charts per company. |
| `components/case-studies-v3/historical-timeline.tsx` | Darkened the small PAT unit label for contrast on the grey panel. Corrected its comment. All 15 circles share an area-true scale. |
| `app/preview/case-studies/page.tsx` | Retained the isolated route with shared navigation and footer. No closing CTA section. |
| `.plannotator/batch1/cases/verify-source.mjs` | Added repeatable source geometry and live data checks. |

## References and decisions

- `reference/visual-language/07/STUDY.md` and `moneybee.svg` determined all nine face polygons, painter order, three elbow leaders and the walker. The brief requires `#B77613`, so that replaces the source's `#8C5E22` on shaded faces and shadow. Source SHA-256: `47e19e44635cb4133aac576078ac60fd5da7a2b27e2a89c99dee18054ac84344`.
- `reference/tresmares/NOTES.md`, internal heroes and `contentscrollcenter`, determined the off-axis opener and stacked-panel mechanism. The brief calls this a stacked strategy treatment; the notes identify `contentscrollcenter` as the actual wipe mechanism, while `dropdownssticky` is an accordion. The implementation keeps the requested pin, wipe, darkening and snap behavior rather than substituting an accordion.
- `reference/titangate/NOTES.md` determined the timeline's dashed connector, 48-second dash crawl and 2.25-second travelling band.
- `/pms` and its `pms-v3` components were inspected as the quality reference. None of its product hero, split counter, glyph columns, converging lines, tick rings, perspective blocks or bar charts is reused here.
- Existing business drawings explain power generation, centrifugal casting and motor-core laminations. All company copy and numbers come from `lib/case-studies.ts` and its financial source in `lib/pms.ts`.

## Desktop screenshots, 1440 × 900

| Section | Screenshot |
| --- | --- |
| Opener | [Hero](hero-desktop.jpg) |
| KPI Green Energy | [Story and all financials](kpi-desktop.jpg) |
| Uni Abex Alloy Products | [Story and all financials](uni-desktop.jpg) |
| Pitti Engineering | [Story and all financials](pitti-desktop.jpg) |
| Historical Investment Timeline | [Timeline](timeline-desktop.jpg) |
| Disclaimer | [Disclaimer and surrounding page](disclaimer-desktop.jpg) |

## Mobile screenshots, 390 × 844

| Section | Story | Financial charts |
| --- | --- | --- |
| Opener | [Hero](hero-mobile.jpg) | |
| KPI Green Energy | [Story](kpi-mobile.jpg) | [Charts](kpi-charts-mobile.jpg) |
| Uni Abex Alloy Products | [Story](uni-mobile.jpg) | [Charts](uni-charts-mobile.jpg) |
| Pitti Engineering | [Story](pitti-mobile.jpg) | [Charts](pitti-charts-mobile.jpg) |
| Historical Investment Timeline | [Timeline](timeline-mobile.jpg) | |
| Disclaimer | [Disclaimer](disclaimer-mobile.jpg) | |

Each section was scrolled into view and its reveal allowed to finish. All captures were inspected. Mobile stories are taller than a viewport, so financial charts have their own captures. The Uni Abex drawing continues below the story capture and was separately inspected during scrolling.

Current-state evidence: [Desktop opener before](current-hero-desktop.jpg) and [mobile opener before](current-hero-mobile.jpg). The desktop title no longer intersects Pitti's name, and the mobile name list no longer overlaps the solid.

## Results

- `./node_modules/.bin/tsc --noEmit -p .`: clean on final run.
- `./node_modules/.bin/eslint components/case-studies-v3/*.tsx app/preview/case-studies/page.tsx .plannotator/batch1/cases/verify-source.mjs`: clean.
- `node .plannotator/batch1/cases/verify-source.mjs --runtime`: passes at both 1440 and 390 pixels wide. Checks all 45 financial values, zero baselines, linear vertical scales, latest-year highlights, 15 area-scaled PAT circles, exact library copy and disclaimer, three complete stories and no horizontal overflow. The marker test permits 0.0001 crore of error because Chrome rounds serialized CSS percentages.
- Source test: nine polygons and painter order, three leaders, walker and shadow match the pinned SVG.
- Geometry pixel diff: **0 of 307,200 pixels differ** at 640 × 480. [Pinned figure beside rendered figure](geometry-comparison.png), generated by [the isolated comparison HTML](geometry-comparison.html). Both use the brief's shade colour; text is excluded. This is a figure-only comparison, not a claim that an adapted page matches either reference site pixel for pixel.
- Scroll halfway through the first wipe: `scrollY: 1350`, incoming `clip-path: inset(50% 0% 0%)`, outgoing shade opacity `0.325`. It settled at the second panel, `scrollY: 1800`.
- Reverse scroll from the third panel: `scrollY: 1800`, Pitti returned to `inset(100% 0% 0%)`, Uni Abex shade returned to `0`.
- Normal desktop scroll exercised the first, second and third panels, then exited into the timeline.
- Resizing to 390 pixels removes pinning. `document.documentElement.scrollWidth === 390`.
- Extra fit checks at 768 × 844 and 1440 × 740: all panels have `scrollHeight === clientHeight`, and their last chart stays within the viewport.
- Live reduced-motion switch removes pinning and clip masks, sets every shade to zero and stops all drawing and connector loops. All stories become readable sequential sections. [Reduced-motion Pitti](reduced-motion-desktop.jpg).
- Fresh browser session: no runtime errors.
- Axe scan of `main`: zero violations, 27 passes. SVG contrast checks were incomplete because Axe cannot resolve their image backgrounds. Their text was inspected manually; the small timeline unit uses `#6B6B6B` on `#F6F6F6`.
- Browser session closed. Screenshot assets occupy about 1 MiB.

## Remaining scope

Initials remain the brief's temporary marks until approved company logos are supplied. The preview is complete. Production `/case-studies` is unchanged.

The initial server compile error from missing AIF imports and the later type error in `components/performance-v3/wealth-growth.tsx` cleared during this pass. No files outside the case-studies ownership were changed to resolve either blocker.
