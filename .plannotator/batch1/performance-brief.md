# Page brief: /performance, content plan §7

Read `shared-rules.md` in this folder first. Your files: `components/performance-v3/*`, `app/preview/performance/page.tsx` (with `SiteNavigation`/`SiteFooter` like `app/performance/page.tsx`). Agent Browser session: `pi-perf`. Screenshots to `.plannotator/batch1/performance/`. URL: https://moneybees.localhost:1355/preview/performance

Data: `lib/performance.ts` (`PERFORMANCE`, `PMS_ROWS` with all eight periods and N/A, `AIF_ROWS`, `PMS_NAMES`, `AIF_NAMES`, `GROWTH`, `METHOD`, `formatReturn`). Figures are as of 31 July 2026: the label must say so.
**The owner loves the existing PMS bar chart `components/pms-v2/performance-chart.tsx`.** Do not edit it. You may import and place it, and you should build the AIF chart in exactly its visual language as a new component.
Sections:
1. **Header.** Title "Performance" and the "As of 31 July 2026" label, carrying a real figure in Tres Mares' odometer pattern (`reference/tresmares/NOTES.md`, the rolling year counter): the years roll from 2007 to 2026 as the page opens and settle beside the since-inception CAGR, Moneybee PMS against the S&P BSE 500 TRI (from `PMS_ROWS`). Layout after Tres Mares' internal heroes; no index, no button row.
2. **PMS Performance.** All eight periods as a clean table (Tres Mares table styling: head aligned to the bottom, hairline rows, values right-aligned, tabular numerals, N/A where null, negative values shown honestly), alongside or followed by the loved chart component unchanged.
3. **Wealth Growth.** Study 08 area-true growing circles (`reference/visual-language/08/moneybee.svg` and STUDY.md): Rs. 1 Mn in Aug 2007, the S&P BSE 500 TRI's Rs. 5.97 Mn and Moneybee PMS's Rs. 28.85 Mn by Jul 2026 (from `GROWTH`), circle AREA proportional to value, the Moneybee disc the one orange element; discs grow from their centres on scroll.
4. **AIF Performance.** Flyingbee Investment Fund against the S&P BSE 500 (label as `AIF_NAMES` says) for the periods in `AIF_ROWS`, N/A rows shown as N/A, as a new chart in the loved chart's exact language.
5. **Methodology and Disclaimer.** `METHOD.text`, `METHOD.caveat`, `METHOD.guarantee`, set plainly as small text; no extra claims.
