# Page brief: /pms-vs-aif, content plan §5

Read `shared-rules.md` in this folder first.

**Your files (create only these):** `components/compare-v3/*`, `app/preview/pms-vs-aif/page.tsx`. Screenshots go in `/Users/blank/Desktop/CREATE/moneybees/.plannotator/batch1/compare/`. Agent Browser session name: `pi-compare`. Do not edit any existing file. Other agents own `components/aif-v3/`, `components/approach-v3/` and their preview routes.

**Preview route:** `app/preview/pms-vs-aif/page.tsx` with `SiteNavigation` and `SiteFooter` like `app/pms-vs-aif/page.tsx`. URL: https://moneybees.localhost:1355/preview/pms-vs-aif

**Content** (data in `lib/compare.ts`: `COMPARE.heading`, `CHAINS`, `COMPARISON`, `EXPLANATION`, `COMPARE_LINKS`; and `PMS_VS_AIF` in `lib/insights.ts`, a deck line: "In a PMS you own the stocks in your own demat account. In an AIF you own units of the fund."). Everything on this page treats PMS and AIF with exactly equal size, weight and colour: this is a hard requirement from the client.
1. **Header.** Title "PMS vs AIF: Understanding the Difference" laid out like Tres Mares' "section index" internal hero (title in the right half, one sentence bottom-left; read `reference/tresmares/NOTES.md`, "How internal pages open"), with the deck line as the sentence. The header's figure: the Unit8 "cooperation" panel (`reference/visual-language/02/`, the PMS · AIF panel): two EQUAL rings, labelled PMS and AIF in Geist Mono, whose overlap is the one orange element; on load or scroll the rings slide together into their overlap.
2. **Simple Comparison.** The five rows of `COMPARISON`, as two exactly equal columns headed PMS and AIF, after Tres Mares' comparison table (on a black band if it reads better), rows revealing in sequence. Each row can carry a pair of small matching line glyphs, identical in weight for both sides.
3. **The two diagrams** the plan asks for, "PMS → Investor → Securities, and AIF → Fund → Investments" (`CHAINS`), drawn in the process-sheet vocabulary of study 09 (`reference/visual-language/09/STUDY.md`): rings joined by dotted arrows, identical geometry for both chains, side by side at equal width, drawing on in sequence. Put each side's line from `EXPLANATION` directly under its chain (this replaces a separate "Simple Explanation" block, so the explanation is not shown twice); keep the heading "Simple Explanation" over this section.
4. End with the two equal links of `COMPARE_LINKS` (identical button style).
