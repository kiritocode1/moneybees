# Trim the menu, move performance onto /pms and /aif

**Problem.** The menu lists every page in the content plan plus a login row, so it carries links that repeat the bar or point into other pages. Performance has its own page, away from the products it describes.

**Result.** A ten-link menu. Each product's returns sit directly under its hero. `/performance` is gone.

**Proof.** Menu captured open at 1440 and 390 wide. `/pms` and `/aif` captured from the hero down through the returns. `tsc`, lint and a build pass with no link left to `/performance`.

## Your answers, as I read them

- **"for now keep it"**: Investor Centre stays in the menu for now, so phones can still reach it. A better route to it comes later.
- **The Careers arrow**: Careers moves below Contact Us.
- Our Team, Performance and the Client Login / Distributor Login row come out.

If either reading is wrong, mark it here and I'll change the plan.

## Menu, after

The left column stays exactly as you drew it. The right column loses three links and Careers swaps with Contact Us.

| Left | Right |
| --- | --- |
| Home | Case Studies |
| About Us | Contact Us |
| PMS | Careers |
| AIF | Investor Centre |
| PMS vs AIF | |
| Our Approach | |

The menu grid currently splits links evenly by count (`ceil(n / 2)` rows in `overlay-menu.tsx`). Ten links would split 5 and 5 and push Our Approach to the right column. I'll pass the row count (6) from `site-navigation.tsx` so the left column keeps its six.

The top bar does not change: Home, About Us, PMS, AIF, Our Approach, Investor Centre, Client Login, Get Started.

## Pages, after

```
/pms   hero → Performance (chart unchanged + full-period table) → Wealth Growth → Why → Philosophy → Selection → Portfolio → Risk → doors
/aif   hero → Performance (AIF rows + table + method note)       → Opportunity → Pooling → Structure → Approach → Key Terms → doors
```

- **/pms.** The chart you asked me to keep (`performance-chart.tsx`) stays as it is: 1Y, 3Y, 5Y and SI. Under its panel I add the table /performance shows, with all eight periods (1M to SI), so the short periods are not lost. Wealth Growth (the discs) follows as its own section.
- **/aif.** The AIF rows and table from /performance go directly under the hero. I add the same small-print method and disclaimer line the PMS chart carries, because the content plan requires it beside any figures. Its label becomes "Performance" to match /pms.
- **Methodology drawing** (the chained sub-periods). I recommend dropping it. Both pages already print the method text under the figures, so a separate Methodology section would repeat it.

## Files

| File | Change |
| --- | --- |
| `components/ui/site-navigation.tsx` | Remove three menu links and the login row; Careers after Contact Us; pass 6 rows |
| `components/ui/overlay-menu.tsx` | Optional `primaryRows` prop, default stays `ceil(n / 2)`; skip the secondary row when it is empty |
| `components/pms-v2/performance-chart.tsx` | Add the eight-period table under the panel. Nothing else in it changes |
| `components/performance/performance-sections.tsx` | Keep the AIF section and the table, set the AIF section's id to `performance`, add the method line. Remove the PMS section and Methodology |
| `app/(frontend)/pms/page.tsx` | Add Wealth Growth after the chart |
| `app/(frontend)/aif/page.tsx` | Add the AIF performance section after the hero; footer gets "Performance" → `#performance` |
| `app/(frontend)/performance/page.tsx` | Delete |
| `app/sitemap.ts`, `lib/revalidate.ts` | Drop `/performance` |
| Home record section + 5 page footers | Home's "Performance" link goes to `/pms#performance`; the footer "Performance" entries are removed |
| `lib/page-heroes.ts`, `preview/headers` | Drop `PERFORMANCE_HERO` |

## Left out, and known gaps

- **Client Login under 480px.** The bar hides it below 480px and sends it to the menu's login row, which this removes. On phones the only way in is the login card at the end of each page. Same "better system later" as Investor Centre.
- **Distributor Login** leaves the site entirely. It was only a mailto to the office.
- New products created in the backend no longer have a fallback page for their figures. `revalidate.ts` will say so.
