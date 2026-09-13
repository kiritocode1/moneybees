# Moneybee presentation factsheets

## Goal

The two supplied PDFs contain 49 slides, but there is no complete page-by-page reference with their facts and visuals together.
Create a Markdown factsheet and one standalone HTML file covering all 32 Group Profile slides and all 17 Flyingbee slides.
Verify every page against its rendered source, including diagrams, chart values, tables, dates and disclosures.

## Document shape

```text
Two PDFs -> 49 inspected slides -> Factsheet + HTML
```

The HTML is a reference document for this work. It uses a white background, dark text and restrained orange accents based on the supplied materials. A deck selector and page index lead to one section per slide. Each section places the original slide above readable facts and any reconstructed visual. Search filters sections; printing includes all pages. No external libraries or network requests are needed to open the file.

## Files

| File | Today | After |
| --- | --- | --- |
| `reference/moneybee-presentations/group-profile-apr2026.pdf` | Source is in Downloads | Pinned original, with SHA-256 recorded |
| `reference/moneybee-presentations/flyingbee-aug2026.pdf` | Source is in Downloads | Pinned original, with SHA-256 recorded |
| `docs/moneybee-slide-factsheets.json` | Absent | Structured source for 49 slides, full text, facts, tables, diagrams, footnotes and review notes |
| `docs/moneybee-slide-factsheets.md` | Absent | Readable factsheet of every page, in source order |
| `scripts/build-moneybee-factsheets.py` | Absent | Builds the Markdown and self-contained HTML from the reviewed slide data and source renders |
| `Moneybee-presentation-factsheets.html` | Absent | Complete document with embedded source images, searchable facts and reconstructed diagrams |

## Decisions shown in code

Preserve each slide independently. Similar claims in different decks are separate entries, with their original dates and wording. Facts mean statements in the source, not independently verified claims.

```json
{
  "deck": "flyingbee-aug2026",
  "page": 12,
  "title": "WEALTH CREATION BY MONEYBEE PMS",
  "asOf": "2026-07-31",
  "facts": [
    "Rs. 1 Mn invested on August 1, 2007 becomes Rs. 28.85 Mn with Moneybee PMS, versus Rs. 5.97 Mn with S&P BSE500 TRI."
  ],
  "tables": [],
  "visuals": [],
  "footnotes": [],
  "reviewNotes": [
    "The PMS record appears inside the AIF deck. It is not Flyingbee AIF performance."
  ]
}
```

Populate every table, visual and footnote field after reading the complete page. Keep full source text available beside the factsheet so compression cannot hide a qualification.

```html
<section id="group-profile-p13" data-deck="group-profile">
  <h2>13. Stock selection process</h2>
  <img src="data:image/png;base64,..." alt="Original Group Profile slide 13">
  <div class="slide-facts"><!-- Every factual point and table --></div>
  <figure><!-- Accessible SVG reconstruction of the source diagram --></figure>
  <details><summary>Full source text and disclosures</summary></details>
</section>
```

Reconstruct the pyramids, selection diagrams, structure diagrams and data charts after inspecting their actual geometry and label associations. Preserve the original image alongside each reconstruction. Do not infer chart values from text extraction order. If a value is illegible, record it as unresolved rather than invent it.

```diff
- Merge April and July performance figures into a single current claim
+ Retain each source table on its own page
+ Add a review note where the April summary conflicts with its dated table
```

## Verification

1. Render and inspect all 49 pages at readable resolution, with closer crops for dense tables, pyramids and small print.
2. Check page counts, contiguous numbering, all source text, chart series, units, dates, negative returns, diagram labels and full disclosures.
3. Compare each recreated diagram with its source for meaning, ordering and values. These are readable reconstructions, not a pixel-identical redesign of the decks.
4. Open the HTML locally and check both deck navigation, search, source-image enlargement, mobile layout and print styling. Confirm that it opens without external assets.

## What I am not doing

Changing or deploying the website, rewriting the presentations as marketing copy, merging dated data, removing awkward or conflicting claims, or representing client claims as independently verified facts. No commits or pushes.

The existing research document helps locate topics but does not replace inspection of the PDFs. BLANK discovery returned no match for the full task; follow-up requests encountered a local certificate error. No external design source has been inspected or adopted.
