# Goal

Create one client-facing HTML presentation for the Moneybee meeting on 5 September 2026.
The presentation will explain the source-backed Moneybee position, define the proposed work, and collect decisions on design, factsheets, backend, AI, CRM, timelines and terms.
We will check every number against the client documents, test every slide in a browser, and verify the landscape print version.

# One simple diagram

```text
facts -> requirements -> delivery plan -> design review -> terms -> decisions
```

# File table

| File | Today | After |
| --- | --- | --- |
| `Moneybee-client-meeting-plan-05-Sep-2026.html` | Does not exist. The current proposal and meeting brief contain too much text for a live client presentation. | A self-contained 16:9 presentation with source notes, data graphics, requirement decisions, design approval examples, the eight-week schedule, client inputs and commercial terms. |

# Real code for every real choice

## Presentation order

The work plan comes before the three design concepts. Aditi reviews the concepts after Shreyam has seen the proposed scope, process and schedule.

| Slide | Subject | Content or decision |
| ---: | --- | --- |
| 01 | Cover | Moneybee website working session, attendees and date. |
| 02 | Meeting outcomes | List the six decisions required before work starts. |
| 03 | Response to Shreyam | Group his points into accepted, removed, needs clarification and separate scope. |
| 04 | Moneybee PMS record | 19.44% since-inception CAGR against 9.90%, dated 31 July 2026. |
| 05 | Growth of Rs. 10 lakh | Lieflat F6 Paired Rungs compares the common starting amount with both ending values. |
| 06 | Performance by period | Lieflat F12 Dumbbell Queue compares Moneybee PMS with the benchmark across four key periods, including the negative one-year result. |
| 07 | Philosophy and history | Lieflat L11 Trend Lineage dates the group, PMS and AIF history, then separates historical case studies from current results. |
| 08 | Selection process | Lieflat L13 Hourglass Stream shows the documented reduction from roughly 6,000 companies to roughly 20 holdings. |
| 09 | Risk process | An Apple Keynote-style composition built around Lieflat F11 Tick Gauge shows the 30% sector ceiling, 15-to-20 holding range and minimum three-year horizon. |
| 10 | Competitive position | What competitors also say, followed by the Moneybee facts that are specific and source-backed. |
| 11 | Requirements to settle | Backend, AI Editor, AI Research, factsheets, CRM, careers, distributors and WhatsApp. |
| 12 | Backend choice | A forked system diagram shows where a login handoff ends and where API-built portal work begins. |
| 13 | Factsheet workflow | A single scene shows the editor upload, compliance gate, live factsheet and dated archive. |
| 14 | Design and approval process | Show the exact review boards, key screens, named approvers and approval output. |
| 15 | Eight-week schedule | Show design, engineering, content and compliance work in parallel. |
| 16 | Client inputs | Assign each required file, decision and access item to a Moneybee owner and date. |
| 17 | Three design concepts | Present the existing options to Aditi after the plan has been explained. |
| 18 | Contract and payment | Confirm base scope, separate work, AMC, milestones and advance. |
| 19 | Decision record | Record the decisions, owners and next dates before the meeting ends. |

Slides 1 to 10 establish the proposed website position. Slides 11 to 16 explain the work. Slides 17 to 19 collect approval and commercial decisions.

## Moneybee PMS naming

The presentation will use **Moneybee PMS** throughout because the product is being rebranded. Source notes will identify the exact client deck and page without repeating the previous product name in client-facing copy.

## Performance numbers

```diff
- 17-year fund record
- more than 7% CAGR
- benchmark to be confirmed
+ Moneybee PMS since-inception CAGR: 19.44%
+ S&P BSE 500 TRI since-inception CAGR: 9.90%
+ difference: 9.54 percentage points per year
+ period: 1 August 2007 to 31 July 2026, effectively 19 years
+ source: AIF marketing deck, page 12
```

Flyingbee remains separate. The available AIF record is three months at 11.08% and six months at 23.20%, with first close on 30 October 2025. The presentation will not associate the PMS record with the AIF.

The one-year PMS result will remain visible:

| Period | Moneybee PMS | S&P BSE 500 TRI | Difference |
| --- | ---: | ---: | ---: |
| 1 year | -7.45% | 1.95% | -9.40 pp |
| 3 years | 13.96% | 10.67% | +3.29 pp |
| 5 years | 19.79% | 11.01% | +8.78 pp |
| Since inception | 19.44% | 9.90% | +9.54 pp |

All performance slides will include the as-of date, benchmark and a short note that publication requires Moneybee compliance approval.

## Lieflat Charts source and selection

I inspected `larashero3-dotcom/lieflat-charts` at commit `475c9b67ead1f3d63bda73a94b9bf339e9d5c0b6`. The presentation will use its chart-selection rules and the real template blocks named below, not a generic chart library.

| Data story | Selected template | Other candidates checked | Reason |
| --- | --- | --- | --- |
| Rs. 10 lakh at start and two ending values | F6 Paired Rungs, `templates/basics-gallery.html`, block `C2 · paired rungs` | L2 Dot Cascade, F1 Rung Bars, F12 Dumbbell Queue | F6 keeps the common starting amount beside each ending amount. L2 and F1 hide the start. F12 is reserved for period gaps. |
| PMS against benchmark by period | F12 Dumbbell Queue, `templates/basics-gallery.html`, block `C8 · dumbbell queue` | L7 Brand Spectrum, F6 Paired Rungs, F8 Plumb Scatter | F12 places both values on one signed return axis and makes the gap countable. L7 requires a bipolar brand scale. F6 handles negative values poorly. F8 needs a second continuous variable that this data does not have. |
| 6,000 companies to roughly 20 holdings | L13 Hourglass Stream, `templates/lupi-gallery.html`, block `9 · hourglass stream` | F5 Tick Rows, F1 Rung Bars | L13 encodes each stage by width and preserves the loss between stages. The bar options compare stages but do not show the selection flow. |
| 30% sector ceiling | F11 Tick Gauge, `templates/basics-gallery.html`, block `C7 · tick gauge` | F4 Tick Donut, L14 Hundred Field | F11 is a single 0-to-100 policy limit. F4 and L14 imply an observed portfolio composition, which the supplied material does not provide. |
| Group, PMS and AIF history | L11 Trend Lineage, `templates/lupi-gallery.html`, block `6 · trend lineage` | L1 Launch Fan, F2 Hairline Line | L11 is built for dated event sequences. L1 requires current size for each entity. F2 requires a regular daily series. |

This is a presentation, so each selected chart gets a full slide and one conclusion. We will not use the report templates or dashboard-style Glance charts.

Lieflat Charts uses the PolyForm Noncommercial License 1.0.0. Before copying its template code into client work, Aryan will confirm commercial permission. Without that permission, we will keep the chart choices and data contracts but write original SVG, CSS and animation code.

The presentation will use one custom palette across every chart:

```css
:root {
  --bg: #f4f1e9;
  --text: #171714;
  --muted: #7f7c73;
  --grid: #d9d3c6;
  --data: #444239;
  --hero: #f49340;
}
```

The honey colour marks Moneybee PMS or one decision point. Position, length and labels continue to carry the data, so colour is never the only distinction.

## Growth visual

Slide 5 will adapt F6 Paired Rungs. Two pairs of vertical ladders rise from the same Rs. 10 lakh starting amount. The faint ladder is the start. The dark or honey ladder is the ending value.

```text
                       START                 END
Moneybee PMS           Rs. 10 lakh           Rs. 2.885 crore
S&P BSE 500 TRI        Rs. 10 lakh           Rs. 59.7 lakh

One rung = Rs. 10 lakh
Ending value difference = Rs. 2.288 crore
Moneybee ending value = 4.83x the benchmark ending value
```

The graphic occupies roughly two-thirds of the slide. `Rs. 2.885 crore` is the largest label. A thin bracket between the two ending ladders labels the Rs. 2.288 crore difference. The ladders reveal from the same baseline, then the 4.83x annotation appears. Reduced-motion mode shows the final state immediately.

```html
<figure class="wealth-rungs" aria-labelledby="wealth-title">
  <figcaption id="wealth-title">
    Rs. 10 lakh invested from 1 August 2007 to 31 July 2026
  </figcaption>
  <svg role="img" aria-describedby="wealth-source"></svg>
  <p id="wealth-source">Source: client AIF marketing deck, page 12.</p>
</figure>
```

The terminal positions use the exact 28.85 and 5.97 multiples. The visible rung texture uses one rung per Rs. 10 lakh, with exact values printed at each endpoint. The slide will not imply a year-by-year path because annual values are not available.

## Performance by period

Slide 6 will adapt F12 Dumbbell Queue for four periods: one year, three years, five years and since inception. Each row has one signed return scale. A hollow point marks the S&P BSE 500 TRI, a honey point marks Moneybee PMS, and a hairline joins them.

```text
1 year             -7.45% ---------------- 1.95%     Moneybee trails by 9.40 pp
3 years             10.67% ------ 13.96%             Moneybee leads by 3.29 pp
5 years             11.01% ---------------- 19.79%    Moneybee leads by 8.78 pp
Since inception      9.90% ---------------- 19.44%    Moneybee leads by 9.54 pp
```

One small bead represents one completed percentage point between the two markers. The exact decimals remain printed at both endpoints. On the one-year row, the Moneybee point sits left of the benchmark and uses the same styling as every other Moneybee point. The slide does not hide the negative period.

```html
<figure class="return-dumbbell" aria-labelledby="return-title">
  <figcaption id="return-title">Moneybee PMS and benchmark annualised return</figcaption>
  <svg role="img" aria-describedby="return-source"></svg>
  <table class="sr-only"><!-- Four exact comparison rows. --></table>
  <p id="return-source">As of 31 July 2026. Source: client AIF marketing deck, page 12.</p>
</figure>
```

The chart enters row by row in 80 millisecond steps. Keyboard focus on a row repeats its two values and the difference in a visible detail line. Reduced-motion mode removes the stagger.

## Philosophy, historical results and current results

This section will use two slides rather than adding more text to the risk slide.

### Philosophy and history

Slide 7 will adapt L11 Trend Lineage as three dated hairlines. The group line starts in 2004, the PMS line starts on 1 August 2007, and the Flyingbee line starts at first close on 30 October 2025. All three end at the latest supplied data date, 31 July 2026.

```text
2004                  1 Aug 2007                     30 Oct 2025                  31 Jul 2026
Moneybee Group   ───────────────────────────────────────────────────────────────●
Moneybee PMS           ├────────────────────────────────────────────────────────●
Flyingbee AIF                                           ├────────────────────────●
```

A large `45+ years` founder-experience label sits above the lineage without pretending it is another product start date. Below the lines, KPI Green Energy, Uni Abex Alloy Products and Pitti Engineering appear as `case studies in the client profile, dates and multiples pending`. The current-results marker states `Flyingbee AIF, six months: 23.20% against 1.38%, internal and unaudited`.

It will place the client-stated philosophy above the dates:

- focus on micro, small and medium operating businesses
- prefer traditional businesses the team can understand
- study downside before investing
- look for large growth potential
- stay invested while the business and original investment case remain intact

The 7% to 8% India forecast and 30% to 40% company-growth forecast will be labelled **Shreyam's proposed thesis, source and compliance approval required**. This keeps his language in the discussion without presenting it as a verified statistic.

The supporting facts from the decks are:

- Moneybee says it has focused on smaller Indian companies that lead their niches.
- The group profile describes management meetings, plant visits and financial analysis.
- The group profile contains case studies for KPI Green Energy, Uni Abex Alloy Products and Pitti Engineering.
- The AIF deck reports six-month Flyingbee performance of 23.20% against 1.38%, based on internal and unaudited calculations.
- The founder profile claims more than 45 years of corporate advisory and wealth-management experience.

Historical stock multiples will not appear without purchase dates, cost basis, account attribution and compliance approval.

### Risk process

Slide 9 will use a full-bleed near-black field, one large gauge and very little body text. It follows Apple's Keynote pacing: one object, one number, then supporting labels. It will not use a list of cards.

The central object adapts F11 Tick Gauge. One hundred radial ticks form a 210-degree dial. Thirty honey ticks stop at a hard marker labelled `sector ceiling, not current allocation`. The centre reads `<= 30%` at display size.

```html
<section class="slide risk-slide" aria-labelledby="risk-title">
  <header>
    <p>Risk process</p>
    <h2 id="risk-title">Limits are set before capital is deployed.</h2>
  </header>
  <svg class="risk-dial" role="img" aria-label="Maximum 30 percent sector allocation">
    <!-- F11 tick-gauge geometry, enlarged for a full slide. -->
  </svg>
  <p class="risk-holdings"><strong>15-20</strong> holdings</p>
  <p class="risk-horizon"><strong>3+ years</strong> minimum horizon</p>
</section>
```

A thin line runs under the dial with six checkpoints: valuation, downside, sizing, liquidity, monitoring and exit. Each checkpoint reveals in sequence and gets one short supporting phrase from the client documents. The whole composition fits one screen without scrolling.

The decks mention a single-stock limit but do not give the number. The final checkpoint will say `single-stock limit: value pending` rather than inventing one.

## Selection visual

Slide 8 will use the real L13 Hourglass Stream structure. Six horizontal strips narrow from roughly 6,000 companies to roughly 20 holdings. Fine threads flow between strips, and the stage name and count sit outside the shape.

```text
~6,000  listed universe
~1,200  initially investable                    20% of universe
  ~350  shortlist                               5.8% of universe
  >100  detailed analysis                      >1.7% of universe
   ~75  investment ideas                        1.25% of universe
   ~20  portfolio construction and monitoring   0.33% of universe
```

Strip width is proportional to the rounded count. One hairline tick represents approximately 20 companies, so the first stage has about 300 ticks and the final stage resolves to one. The stage-to-stage threads use the template's deterministic placement and do not imply a one-to-one company path.

The left margin names the work at each transition: annual reports and screens, management and fundamentals, meetings and plant visits, peer comparison and financial models, then liquidity and risk review. All calculated percentages are labelled approximate.

## Competitive position

The slide will contain only claims that have a source in the reviewed documents or the existing Google research report.

```diff
- Bottom-up research
- High-conviction portfolio
- Long-term wealth creation
- Small-cap specialists
+ Moneybee PMS record from August 2007
+ 19.44% against 9.90% since inception in the latest supplied table
+ Rs. 10 lakh to Rs. 2.885 crore in the same table
+ documented 6,000-to-20 selection process
+ management meetings and plant visits
+ stated 15-to-20 holding range and 30% sector ceiling
+ three named historical case studies available for compliance review
```

The left side will show the common claims used by Marcellus, SageOne, Abakkus, Alchemy and WhiteOak. The right side will show Moneybee's documented facts. Each Moneybee fact will carry a page reference in presenter notes. The public-source competitor references will appear in the appendix.

The slide will use one visual line from history to process to portfolio rather than a grid of identical cards. No unverified AUM, investor count, market ranking or historical return multiple will appear.

## Requirements to settle

The presentation will separate launch requirements from optional work:

| Area | Launch position | Decision needed |
| --- | --- | --- |
| Website editor | Required for approved page content, people, performance fields and factsheet uploads. | Content owners, fields and approval rights. |
| AI Research | Optional separate discovery. | Internal or public, data sources, access, outputs and review. |
| Factsheets | Upload and archive are in the proposed launch scope. | Public, qualified or login-only access. |
| Investor portal | Login entry point is in scope. API-built screens are separate until documented. | Existing web application or API-only backend. |
| CRM | Public forms can post to an API or webhook. | CRM name, fields, credentials and enquiry owners. |
| Careers | Role pages and application intake can be included. Rating, calendar and email workflow need a process review. | Base intake or full applicant workflow. |
| Distributors | A compliance-led enquiry page can be included. | Eligible regions, audience and owner. |
| WhatsApp | Website opt-in and click-to-chat can be scoped. Product data push and pull belongs to the AWS platform. | Provider, approved flows and AWS owner. |

Editorial copywriting is removed as a separate fee because Shreyam will write the copy. We will still structure and edit supplied text.

## Backend choice

Slide 12 will use one large forked system diagram instead of two text boxes. A browser silhouette labelled `Moneybee website` sits on the left. A vertical line marks the boundary between website work and Moneybee's AWS platform.

```text
                                              MONEYBEE AWS
                                            ┌────────────────────┐
                              solid path   ->│ Existing web app   │  base handoff
┌───────────────────┐   LOGIN  ─────────────│ auth + 2FA + data  │
│ Moneybee website  │                       └────────────────────┘
│ public pages      │
└───────────────────┘   PORTAL  · · · -> [new screens] -> [API]     separate quote
                              dashed path       our build      AWS owner
```

The base route uses a solid honey line that ends at the existing application. The API route uses a dashed grey line, inserts a new browser-screen silhouette before the API, and carries a `separate scope` label. A brace below the route names the four items required for pricing: screen list, endpoint docs, authentication and sample responses.

```html
<section class="slide backend-slide" aria-labelledby="backend-title">
  <h2 id="backend-title">Where does the website stop?</h2>
  <svg class="backend-map" role="img" aria-label="Two backend integration paths">
    <g id="website-frame"><!-- public website silhouette --></g>
    <path class="route route--handoff"><!-- included login handoff --></path>
    <g id="existing-app"><!-- Moneybee application silhouette --></g>
    <path class="route route--api"><!-- separately priced portal route --></path>
    <g id="new-screens"><!-- screens we would build --></g>
    <g id="aws-api"><!-- API owned by Moneybee --></g>
  </svg>
</section>
```

The route strokes draw from left to right when the slide opens. Reduced-motion mode displays both complete routes. The meeting should end with one route selected and a technical call booked with the AWS owner. No portal price will be proposed before the choice is clear.

## Factsheet workflow and illustration

Slide 13 will show one monthly factsheet moving through the system. This is an interface demonstration, not another set of charts.

```text
EDITOR                         COMPLIANCE                         INVESTOR VIEW
┌──────────────────┐           ┌──────────────┐                  ┌────────────────────────────┐
│ Upload PDF       │  ------>  │ Approved     │  ------------>  │ Moneybee PMS               │
│ Product          │           │ by / date    │                  │ Factsheet · 31 Jul 2026     │
│ As-of date       │           └──────────────┘                  │ 19.44% since inception      │
│ Access setting   │                                               Download PDF              │
└──────────────────┘                                           └────────────────────────────┘
                                                                         |
                                                                         v
                                                               ── dated archive strip ──
```

The left side looks like a real editor drawer with a PDF filename, product selector, as-of date, access setting and status. The centre is a narrow compliance gate. The right side is a large browser mockup of the published factsheet page using the approved July values:

- Moneybee PMS
- as of 31 July 2026
- since inception 19.44% against 9.90%
- one year -7.45%, three years 13.96%, five years 19.79%
- download link, source note and disclaimer area

A horizontal archive rail sits behind the investor browser. The current approved file is in honey. Earlier supplied files use muted outlines and keep their real dates when Moneybee provides them. No sample month will be invented.

The animation follows the PDF from upload to approval to publication. It stops at the compliance gate when the status is not approved. The access selector visually changes the final destination between public page, qualified enquiry and investor login.

The base scope remains manual upload, metadata, approval status, latest-file display and archive. It does not include automated factsheet generation, data extraction from PDFs or invented holdings, sector, fee or risk data.

## Design review process

The slide will show the actual material reviewed at each stage.

| Review | What Moneybee sees | Approval output | Approver |
| --- | --- | --- | --- |
| Direction | Three complete homepage concepts on desktop and mobile. | One selected concept and written change list. | Aditi |
| Design system | Type scale, colour roles, grid, spacing, buttons, forms, tables, chart styles, factsheet styles and motion. | Approved system board. | Aditi and Shreyam |
| Key screens | Homepage, PMS, AIF, factsheet library, disclosure centre and mobile navigation. | Approved layouts before full build. | Aditi and Shreyam |
| Regulated content | Performance, fees, hurdle and high-water-mark illustration, risk text, registrations and disclaimers. | Written publication approval. | Pournima and Suprit |
| Final site | Complete responsive pages with approved content. | Launch approval. | Named Moneybee signatory |

The same slide will contain a small visual example of the system board:

```text
TYPE        DISPLAY 64/68     HEADING 36/40     BODY 18/28     DATA 20/24 TABULAR
COLOUR      INK              WARM PAPER         HONEY          MUTED LINE
DATA        PAIRED RUNGS     DUMBBELL QUEUE     HOURGLASS      TICK GAUGE
COMPONENTS  NAV              BUTTON             FORM           TABLE           DOWNLOAD
MOTION      SLIDE REVEAL     CHART DRAW          REDUCED-MOTION FALLBACK
```

Feedback is consolidated once per review. We revise the same board or screens until the named approver signs off. The schedule assumes one consolidated response within one working day. Later changes to an approved stage use the contract's change process.

## Eight-week schedule

```text
W0       contract, advance, owners, access and source files
W1       explain plan, select concept, establish design system
W2       approve design system and key screen direction
W3       approve homepage, PMS, AIF, factsheet and disclosure layouts
W4-W6    build pages, editor, factsheet upload, forms, CRM and login handoff
W7       load content, complete compliance review, accessibility, performance and QA
W8       final approval, launch, handover and training
```

Engineering can begin on approved content models and stable components while page reviews continue. Performance figures, fees and regulated copy will not publish before written compliance approval.

The schedule starts when Moneybee pays the advance, names the approvers and supplies the kickoff inputs. Delayed inputs or consolidated feedback move the dependent dates by the same number of working days.

API-built portal screens, AI Research, advanced applicant tracking, WhatsApp product integration and work inside Moneybee's AWS system receive separate schedules.

## Client inputs

| Moneybee input | Owner to confirm | Our output |
| --- | --- | --- |
| Selected concept and consolidated design feedback | Aditi | Approved design system and key screens |
| Positioning and final copy | Shreyam | Structured and edited page copy |
| Performance table, fee terms, disclaimers and approval | Pournima and Suprit | Charts, tables and disclosure layouts |
| Vector logo and original brand files | Suprit | Production asset set |
| Existing factsheets and monthly upload process | Owner required | Upload, archive and display workflow |
| AWS application or API documentation | AWS owner required | Login handoff or separately quoted portal screens |
| CRM details and enquiry owners | Owner required | Form and CRM connection |
| Hiring workflow | Shreyam | Careers scope and separate workflow estimate |
| Distributor audience and eligible regions | Compliance owner required | Distributor page and enquiry route |

## Contract and payment

The commercial slide will show the current proposal baseline and the decisions still required:

```html
<dl class="commercial-summary">
  <div><dt>Base engagement</dt><dd>Rs. 80,000, exclusive of applicable taxes</dd></div>
  <div><dt>Payment</dt><dd>40% advance, 30% at design approval, 30% at go-live</dd></div>
  <div><dt>Base scope</dt><dd>Final items listed in the signed contract schedule.</dd></div>
  <div><dt>Separate work</dt><dd>API-built portal screens, AI Research, advanced hiring workflow, WhatsApp product integration and work inside AWS.</dd></div>
  <div><dt>AMC</dt><dd>Services, response times, included hours, exclusions and annual fee to be agreed in writing.</dd></div>
</dl>
```

If the meeting changes the Rs. 80,000 base scope, the contract will record the revised work and price before the advance is paid.

## HTML implementation

The file will use the installed `visual-explainer` slide-deck patterns. It will be a complete standalone HTML document with embedded CSS, SVG and JavaScript.

Required controls:

- one `100dvh` slide per section
- previous and next controls
- arrow, Page Up, Page Down, Space, Home and End navigation
- progress, slide count and outline
- `#slide-N` links
- resume position in local storage
- visible keyboard focus
- reduced-motion mode
- landscape print styles
- native SVG charts with semantic fallback tables

The visual direction for this meeting deck is near-black, warm paper and Moneybee honey. It uses one sans family with tabular figures and large type. Most slides contain one large object and no more than three supporting labels. No stock photography, gradient text, glass cards, finance icons or decorative dashboards.

From wall: Deck.gallery (`insp_deckgallery`). The Palantir investor update informed the order of highlights, detail and appendix. The Apple product summary informed the full-bleed object treatment, large labels and sequential reveals used on the risk, backend and factsheet slides. Its dense all-in-one product grid is not copied.

From the user-supplied chart source: Lieflat Charts commit `475c9b6`. F6 provides the wealth ladders, F12 the return comparison, L13 the selection stream, F11 the sector-limit dial and L11 the dated product lines. Each implementation starts from the named template block if commercial-use permission is confirmed. Otherwise, the SVG code will be original while preserving the selected data contract.

## Verification

1. Compare all Moneybee values and dates with `docs/moneybee-actual-specs-from-client-documents.md` and the source deck pages.
2. Confirm that client-facing product copy uses `Moneybee PMS`, not the previous PMS name. Search for `17-year`, unsourced `7% to 8%`, and unsourced `30% to 40%` outside the clearly labelled client-thesis slide.
3. Open the file in Agent Browser and review all 19 slides at 1440 by 900 and 1280 by 720.
4. Run the slide overflow check with reduced motion enabled. No slide may use automatic shrinking as the final fix.
5. Navigate with keyboard, outline, slide rail and direct hashes.
6. Check browser console output after every chart has rendered and run `node --check` on the extracted script.
7. Confirm commercial-use permission before copying any Lieflat Charts template code.
8. Capture screenshots of the cover, wealth rungs, return dumbbell, selection stream, risk dial, backend map, factsheet scene, approval board, schedule and commercial summary.
9. Print to landscape PDF and check clipping, page breaks, contrast and source notes.

# What I am not doing

- I am not changing `Proposal-moneybee.html`, `Meeting-brief-moneybee.html` or the three website concepts.
- I am not using the previous product name in client-facing PMS copy.
- I am not presenting the PMS record as Flyingbee AIF performance.
- I am not drawing a year-by-year performance line without annual return data.
- I am not publishing the 7% to 8% India forecast, 30% to 40% company-growth forecast or historical stock multiples as verified facts.
- I am not designing an investor portal before the AWS backend path is known.
- I am not including automated factsheet generation in an upload-only requirement.
- I am not including a full applicant-tracking system, public AI assistant or WhatsApp product integration in the base scope without a separate specification and price.
- I am not selecting one of the three website concepts on Moneybee's behalf.
- I am not copying PolyForm Noncommercial template code into client work without commercial-use permission.
