# Moneybee interactive visualizations

## Goal

The decks explain Moneybee through numbers and strategy diagrams, but the current factsheet is primarily a reading reference.
Build a separate HTML showcase with six interactive visuals, each explaining one advertised advantage or investment decision.
Verify every displayed value against the committed factsheets, then operate every control on desktop, mobile and keyboard.

## Shape

```text
Committed facts -> Six interactive visuals -> Review -> Future website sections
```

One scrollable page. Large numbers, orange and black marks on warm white, generous space and short labels. Each visual gets its own full-width section, rather than a dashboard of small cards. Keep the reference image's line-stack treatment for the wealth comparison and the decks' upright pyramid for historical picks. Use the site's existing Rethink Sans if its font asset can be embedded; otherwise use its Helvetica Neue fallback. No new font service.

### Revision from the supplied visual

The first screen is the comparison itself: two equal starting amounts, two ending stacks, large ending values and a bracket showing the ending-value ratio. A short source/date line sits below. No introductory paragraph, boxed summary, toolbar or return table competes with this view. The April/July selector is small and below the visual. The full returns table sits in expandable source details, not in an additional chart-control panel.

Each later section follows the same restraint: one visual statement, one compact interaction where it reveals useful information, and source details below. The research view exposes stage activities on selection; the pyramid exposes company names; the growth view uses a company selector and a compact metric selector. Fiscal-year values appear on focus or selection of the five plotted observations, without a separate time slider.

Keep the source image's visual hierarchy, not its cramped baseline labels. Numeric height uses one continuous zero-baseline scale; the horizontal strokes are texture within that height, not individual holdings or annual observations. Do not attach tooltips to those strokes. The small starting amounts remain visible and equally sized.

## Files

| File | Today | After |
| --- | --- | --- |
| `docs/moneybee-slide-factsheets.json` | Committed page-by-page source data | Read-only input for all six visuals |
| `scripts/build-moneybee-visualizations.py` | Absent | Selects source records, validates required values and emits a standalone file with embedded data, styling and interaction code |
| `Moneybee-interactive-visualizations.html` | Absent | Review showcase, usable offline, with six interactive sections and source details |

## What each interaction does

| Visual | Default view | Interaction and information revealed | Source |
| --- | --- | --- | --- |
| Wealth comparison | Equal Rs. 10 lakh starts; Rs. 2.885 crore PMS and Rs. 59.7 lakh benchmark ends; 4.83x ending-value ratio | Small April / July selector below the visual. Both stacks, date and ratio update together. The complete returns table, including losses, remains in source details. | Group 19; AIF 12 |
| Research selection | Five steps, from screening to monitoring, with ~6,000 universe and ~20 final stocks | Select a step to see its count and actual work: screeners, management meetings, plant visits, valuation and monitoring. Previous/next controls also work on keyboard. | Group 13 |
| Historical picks | Upright five-tier pyramid, >100X at the apex | Select a tier to reveal the associated companies or stock counts. KPI Green Energy, Uni Abex and Pitti link to the next section's matching case study. | Group 20; AIF 11 |
| Business growth | KPI Green Energy revenue, FY20 to FY24: 59 to 1,024 crore | Switch company and Revenue / EBIDTA / PAT. Select one of five years to reveal that year's value and the source's business model, competitive edge and growth thesis. Show a zero-baseline bar series, not stock-price growth. | Group 21, 22, 23 |
| Risk and process | Four risk categories with their actual controls | Switch PMS / AIF, then select liquidity, valuation, market or concentration. Display the matching action. AIF liquidity reveals IPO, buyback and strategic-sale exit routes. Preserve the different source orders. | Group 16, 17; AIF 5, 7 |
| Flyingbee allocation limits | Listed minimum 51%; unlisted maximum 49% | Select either labelled segment to reveal its role and relevant fund terms. The diagram shows stated limits, not a claimed current portfolio mix. | AIF 9 |

## Real decisions

The generator takes table rows from the existing factsheet. It does not maintain another manually typed return history.

```python
group = factsheets["decks"][0]["slides"]
aif = factsheets["decks"][1]["slides"]
pms_returns_july = aif[11]["tables"][0]["rows"]
case_studies = [group[i] for i in (20, 21, 22)]
```

The PDF's ending amounts live in prose. Record those explicitly in the generator with assertions against the relevant source strings, and make the ratio an explicit calculation.

```js
const snapshot = snapshots[selectedSnapshot];
const endingValueRatio = snapshot.pmsMillion / snapshot.benchmarkMillion;
renderStacks(snapshot); // Both bars use the same zero-baseline scale.
renderDate(snapshot.asOf);
renderRatio(endingValueRatio.toFixed(2));
```

Dates are discrete source snapshots. There is no time scrubber between 2007 and 2026 because the decks do not supply an annual portfolio series. Short transitions connect states, but intermediate animation values are not labelled as historical observations.

```html
<fieldset aria-label="Performance snapshot">
  <label><input type="radio" name="snapshot" value="apr2026">30 Apr 2026</label>
  <label><input type="radio" name="snapshot" value="jul2026" checked>31 Jul 2026</label>
</fieldset>
<output aria-live="polite" id="wealth-result"></output>
```

The pyramid is a hierarchy of claims, not a measured distribution. Tier area is not proportional to returns or portfolio allocation. Selection highlights one tier without changing its shape or ranking.

```js
function selectTier(index) {
  selectedTier = index;
  renderTierSelection(index);
  renderCompanies(pyramidRows[index]);
}
```

Use native HTML controls and SVG for the visuals, with embedded JavaScript and no CDN libraries. Every hover interaction has a click and keyboard equivalent. Reduced-motion mode changes state immediately. Keep figures, source date and the relevant performance qualification visible; put the full source text in an expandable detail panel linked to the factsheet page.

## Verification

1. Check all snapshot amounts, table rows, company series, pyramid labels and allocation limits against the committed data. Verify negative returns stay negative and NA is not converted to zero.
2. Operate both wealth snapshots, the full returns disclosure, five selection stages, five pyramid tiers, three companies, three financial metrics, five fiscal-year observations, both risk modes and both allocation segments.
3. Check keyboard focus, selected states, touch-sized controls, live result announcements, reduced motion and no page overflow at 390px.
4. Inspect screenshots for the wealth comparison, pyramid, company-growth view and mobile layout. Check the browser console and offline loading.

## What I am not doing

Changing the homepage, deploying, committing or pushing this new work, inventing historical prices or returns, adding a future-return calculator, presenting unsupported sector/index claims as verified, or using the conflicting April page 11 performance summary.

The long performance record and historical picks remain labelled PMS even though they also appear in the AIF deck. Source-only claims remain review material rather than automatically approved public copy.

## Reference decisions

- From wall: [Bartosz Ciechanowski](https://ciechanow.ski/earth-and-sun/) `insp_bartosz-ciechanowski`. Read the article's date/time and eccentricity-control explanations. Adapt the mechanism of one control changing one understandable result. This is an interaction influence, not a visual copy or source-code reuse.
- From wall and explicitly requested by Aryan: [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) `insp_lieflat-charts-github`. Read the complete `SKILL.md` and chart catalog; inspected F1 Rung Bars and F6 Paired Rungs in the Basics gallery. Use its chart-selection and interaction principles to understand the design: select by what the data represents, keep proportional scales, make each chart communicate one conclusion, and only attach interactions to real information. The user requested this study explicitly. No template code is copied under its noncommercial licence.
- Candidate comparison: F1's few-category line stacks fit the supplied wealth example; F6's grouped pairs add structure that this two-outcome comparison does not need; F12's horizontal before/after arrangement is less direct than the supplied vertical stacks. For research, L13's funnel is relevant in principle, but its decorative flow lines cannot imply actual tracked company paths. For allocation, L14's hundred-unit field would imply a complete observed mix, so the stated minimum/maximum limits remain labelled boundaries instead.
- The supplied Moneybee screenshot and committed slide images determine the visual style and factual relationships. Unrelated BLANK results for animated image sliders, ASCII logos and backend data tooling were rejected during candidate screening.
- The `ui-skills` CLI is absent. The available frontend-design skill supplies implementation guidance; the user's explicit simple-visual direction takes precedence over decorative suggestions.
