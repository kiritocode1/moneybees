# Insight cards on the homepage, and a page behind each one

## 1. Goal

The homepage at `/` makes claims about research and risk but shows no numbers from Moneybee's own presentations. The insight cards hold those numbers, but they live on a dark preview route in a different visual language.
After this change the homepage gets a section of six cards drawn in its own palette. Each card opens a page at `/insights/<slug>` with a larger, scroll-driven version of the same figure plus the full data, the period, the method and the source page.
Proof: screenshots at 390 / 900 / 1440 against these previews, a hover and keyboard pass on every card, a scroll recording of the first fact page, plus `tsc`, ESLint and a clean console.

## 2. Visual explanation

```text
Homepage section  ->  card (teaser loop on hover)  ->  /insights/<slug>
                                                        pinned figure + scroll steps
                                                        full table
                                                        method and source
                                                        next card
```

### Current: the homepage as the client has seen it

![Current homepage, 1440](current-home-1440.png)

### Proposed preview: the new section, rest state (runnable at `/preview/insights-section`)

Cards are paper with ink linework, square corners and the site's `#F7A11A`, on the same grey `#9D9EA1` band the principles use. The chamfered corners are gone because nothing else on the site has them.

![Proposed section, 1440](proposed-section-1440.png)

### Proposed preview: hover

On hover a card flips to the ink panel the homepage already uses ("Nothing hidden", the stats), so the reference's light/dark swap survives, inverted. Keyboard focus gets the same state.

![Hover state](proposed-hover-1440.png)

### Proposed preview: 390px

![Proposed section, 390](proposed-section-390.png)

Known issue in this preview: the forced line break in the heading leaves "we" alone on its own line at 390px. The build drops the `<br />` below 600px and lets the heading wrap naturally.

Cards 004, 005 and 006 in these screenshots still draw the old growth, risk and allocation figures. They get replaced, as shown below.

### Storyboards for the three replacement figures

![Storyboard](new-figures-storyboard.png)

| Card | Fact and source | Motion on hover |
| --- | --- | --- |
| 004 KPI Green growth | Revenue ₹59 cr to ₹1,024 cr, profit ₹6 cr to ₹162 cr, FY20 to FY24. Group profile slide 21. | Paired isometric bars per year rise in turn, drawn as growth since FY20 so the heights are honest: revenue 17×, profit 27×. Profit is orange. |
| 005 Portfolio limits | 15 to 20 holdings, no sector above 30%. Group profile pages 16 and 17. | Blocks stack into five sector columns under a 30% ceiling. One column reaches the ceiling, the ceiling lights, and the next block goes to another column. |
| 006 Returns by period | Queenbee against S&P BSE 500 TRI, 1 month to since inception, as at 31 July 2026. AIF deck page 12. | Paired bars fill in period by period. The one-year bar drops below the line (−7.45%) and stays visible. It ends on since inception, 19.44% against 9.90%. |

Fund allocation (51/49) is dropped. It is a SEBI Category III rule, not a Moneybee fact, and it belongs in the AIF terms table.

### Fact page template, using the wealth card as the example

![Fact page wireframe](fact-page-wireframe.png)

Four parts, identical on all six pages:

1. **The fact.** The headline is the number itself, with the period and the benchmark directly under it. The card's figure is pinned on the right at full size and advances with scroll through three or four steps on the left. Under reduced motion the pin is dropped and the figure shows its final state, the same way `ChapterStack` does it.
2. **The data.** The full source table on the grey band. On the returns page that includes the −7.45% year.
3. **How it was measured.** Method, caveats and the source file and page.
4. **Next.** A link to the next card in the sequence, on the ink band.

Headline for each page:

| Slug | Headline |
| --- | --- |
| `wealth` | ₹10 lakh became ₹2.885 crore |
| `research` | From ~6,000 companies to ~20 |
| `picks` | Six holdings that went past 10× |
| `kpi-green` | Profit grew 27× in four years |
| `limits` | 15 to 20 holdings, no sector above 30% |
| `returns` | 19.44% a year since 2007, and one weak year |

## 3. File table

| File | Today | After |
| --- | --- | --- |
| `app/page.tsx` | Homepage, no figures from the decks | Adds `<InsightsSection />` after `#about`, before `#what-we-do`, and adds "Figures" to the footer's Explore list. Nothing else on the page changes. |
| `components/insight-cards/insight-cards.tsx` | Nine cards, dark reference palette, cards are `<article>` | Adds `tone: "reference" \| "site"` and an optional `href` per card. With `href`, the card renders as a `<Link>` so it is a real navigation target. The preview route keeps `tone="reference"`. |
| `components/insight-cards/insight-cards.module.css` | Dark palette, chamfer | Adds a `.row[data-tone="site"]` palette block, the same values as the preview CSS, and drops the chamfer under that tone. |
| `components/insight-cards/moneybee-figures.tsx` | Growth, Risk and Allocation figures are unsourced | `GrowthFigure` redrawn as KPI Green paired bars. `RiskFigure` becomes `LimitsFigure`. `AllocationFigure` becomes `ReturnsFigure`. Each exported figure also takes a `progress` value so the fact page can drive it with scroll. |
| `components/insight-cards/figures.tsx` | Hover clock `useFigureFrame` | Adds a branch: when `progress` is given, the frame reads it instead of the clock. The three reference figures are untouched. |
| `lib/insights.ts` *(new)* | | One typed record per fact: slug, card title, figure, headline, lead, scroll steps, table rows, method, source. The section, the cards and the pages all read this, so a number exists in exactly one place. |
| `components/insights/insights-section.tsx` *(new)* | | The homepage section shown in the preview. |
| `app/insights/[slug]/page.tsx` *(new)* | | The fact page template, statically generated for the six slugs. |
| `app/preview/insights-section/*` | Preview only | Deleted once the real section lands. |

## 4. Decisions in code

The single source of the numbers, so the card label, the page headline and the table can't drift apart:

```ts
// lib/insights.ts
export const INSIGHTS = [
  {
    slug: "wealth",
    title: "Wealth since 2007",
    figure: "wealth",
    headline: ["₹10 lakh became", "₹2.885 crore"],
    lead: "Queenbee PMS, 1 August 2007 to 31 July 2026. The S&P BSE 500 TRI turned the same amount into ₹59.7 lakh.",
    source: "Flyingbee AIF marketing presentation, August 2026, page 12",
    // ...steps, table, method
  },
  // ...five more
] as const satisfies readonly Insight[];

export type InsightSlug = (typeof INSIGHTS)[number]["slug"];
```

The card switches between hover-driven and scroll-driven without a second figure implementation:

```diff
- export function useFigureFrame(active: boolean, draw: (time: number) => void)
+ export function useFigureFrame(active: boolean, draw: (time: number) => void, progress?: MotionValue<number>)
+ // With progress, the fact page owns the clock: each scroll step maps to a
+ // fixed time, so the figure lands on the same composed pose every visit.
```

The card becomes a link only where there is somewhere to go:

```diff
- <article ref={ref} className={styles.card} ...>
+ const Shell = href ? Link : "article";
+ <Shell ref={ref} href={href} className={styles.card} ...>
```

## 5. Left out

- **The three reference figures** (bars, pie, beacon) stay on the preview route only. They show demo data, not Moneybee's.
- **Compliance.** The 100× multiples and the return table are client-supplied and not yet approved for public use (`docs/moneybee-actual-specs-from-client-documents.md`, lines 68 and 276). The site is `noindex` already. Every fact page shows its source and method, and each needs sign-off before launch.
- **Existing homepage copy** with unsourced lines ("explained from memory", the "₹50 lakh" PMS minimum) is not changed in this pass. I'd do that next, swapping in the deck numbers.
- **Real photography.** Every image is still Unsplash.
- **Still to verify in the build:** isometric versions of the three new figures (the storyboards are flat), how the orange beam reads on the ink hover state (it goes brownish at low opacity in the preview), and pinning on the fact page at 900px.

## Build order

1. `lib/insights.ts`, the site tone on the cards, the homepage section. Check against the preview.
2. The three replacement figures, card size.
3. The fact page template with `wealth`, recorded while scrolling.
4. The other five pages.
