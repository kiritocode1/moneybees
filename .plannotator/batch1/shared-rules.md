# Shared brief: Moneybee internal page rebuild (read fully before starting)

You are building one internal page of the Moneybee website, a boutique Indian portfolio manager (Moneybee PMS and Flyingbee, a Category III AIF). Repo: `/Users/blank/Desktop/CREATE/moneybees`. Stack: Next.js 16.2 App Router, React 19.2, Tailwind v4, TypeScript strict, gsap 3.15 and motion 12 already installed. Do NOT install packages. Do NOT commit. Do NOT start, stop or restart the dev server: it is running at https://moneybees.localhost:1355 (self-signed; use `agent-browser --ignore-https-errors` or curl with `--cacert /Users/blank/.portless/ca.pem`). If it is down, stop and say so in your final message.

## What the client and owner want
- The owner approved the new /pms page (`app/pms/page.tsx`, components in `components/pms-v3/`). Study it first: it is the quality bar. Open https://moneybees.localhost:1355/pms and read its components.
- Your page must use DIFFERENT visuals from /pms. /pms already uses: the product hero (orange hexagon mark, stepped title, 6-figure strip), a sticky split with a 01/07 counter, Futerra-style glyph columns, converging lines, Titan Gate's tick-ring stats band, perspective stacked blocks, the bar chart. Do not repeat those (the product hero on /aif is the one allowed reuse).
- The owner's references, already studied and measured, with Moneybee-colour renders you can build from:
  - `reference/visual-language/NOTES.md` (read the "Measured studies override this page" table first), and per image `reference/visual-language/<01..09>/STUDY.md`, `moneybee.svg`, `moneybee.png`: 01 radial wedges, 02 Unit8 ring posters (grid, overlapping team rings, two equal rings, a 45° trail), 03 glyph columns, 04 line cards (one orange element each), 05 converging lines, 06 stacked blocks, 07 dimetric block, 08 growing circles (area-true and linear variants), 09 process-diagram sheet (ring chains, Venn into a node, dotted feedback arrow, concentric half-rings with leaders, list columns).
  - `reference/tresmares/NOTES.md` (Tres Mares: how internal pages open, stacked strategy panels, offset stat columns, odometer counters, accordion that builds its mark, comparison table) and `reference/titangate/NOTES.md` (Titan Gate: section openers, dashed connector lines, large faded step numbers, staggered list lines, text effects). Screenshots live beside the notes.
- The owner wants "really smart layout, really good scroll sections, really good everything", in Moneybee's colours, clinically rebuilt from those references, not loosely imitated.

## Content rules
- Content plan (the client's spec): `reference/content-plan.txt`. Headings and list items are its wording, verbatim. Facts come only from it and the repo's `lib/*.ts` (read data from `lib`, do not retype numbers). Where the plan gives no body text, use short lorem placeholders, never invented claims.
- No eyebrow-plus-heading-plus-index headers and never an "on this page" index. A page header must carry something real: a figure, a fact or a drawing that explains the page.
- No captions or subtitles that explain the UI or the figure. No "Source:" lines. No closing "Let's talk about your portfolio" band.
- PMS and AIF, wherever they appear together, get exactly equal size, weight and treatment, side by side, neither lit over the other.
- Never use the northeast arrow (↗) or any rotated/drawn equivalent.
- No em dashes in visible copy; a docx dash becomes a colon.

## Design rules
- Colours: page white `#FFFFFF`, black `#000000`, orange `#F6A11A` (exactly one accent element or group per figure), grey `#9D9EA1` for construction only (not for text under 18px; text greys must be at least `#767676` on white), panels `#F6F6F6`, isometric/perspective shaded orange `#B77613`. Black bands are allowed for selected premium sections.
- Fonts already loaded: Instrument Serif (`font-serif`, headings and display numbers), Rethink Sans (body), Geist Mono (`font-[family-name:var(--font-geist-mono)]`, labels). Instrument Serif italic is not loaded globally: see `components/pms-v3/philosophy.tsx` for how it loads it locally.
- Use the shared tokens in `components/hero/tokens.ts` (COLUMN, HEADING, SUBHEAD, BODY, EYEBROW, BUTTON), `BracketLabel` from `components/fact-sections/fact-section.tsx`, `useShown`/`hexPoints` from `components/about-v2/shared.ts`, links via `@/components/transition/transition-link` (default export, same props as next/link).
- Motion: entrance and scroll-driven via IntersectionObserver/`useInView`, CSS scroll-driven timelines, or gsap; no scroll hijacking; every figure renders its final static state under `prefers-reduced-motion`.
- Mobile: no horizontal scroll at 390px; sticky/pinned effects degrade to plain stacked layouts below 768px.
- TypeScript strict, no `any`. Short comments only where they explain intent, in the repo's style (a JSDoc line above components and data).

## Verification (required before you finish)
1. `./node_modules/.bin/tsc --noEmit -p .` clean, and `./node_modules/.bin/eslint <your files>` clean.
2. Render your preview route with Agent Browser in your OWN session name (given in your page brief): `agent-browser --session <name> --ignore-https-errors set viewport 1440 900`, `open <url>`, scroll each section into view, wait for reveals, `screenshot <ABSOLUTE path>`. Full-page screenshots do not trigger scroll reveals; take viewport shots per section. Repeat at 390×844. Check `document.documentElement.scrollWidth` equals the viewport width at 390.
3. Look at every screenshot yourself and fix what looks wrong, misaligned, cramped, clipped or generic. Iterate until it would pass a demanding design review.
4. Keep screenshots small in number (disk is limited): about one per section per width. Close your browser session at the end (`agent-browser --session <name> close`).

## Final message (under 300 words)
Files created, the preview URL, each section's visual and which reference it comes from, screenshot paths, verification results, and anything unfinished or that needs the owner's decision.
