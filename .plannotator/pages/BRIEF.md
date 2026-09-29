# Page builder brief (Moneybee site)

Next.js 16 + React 19 + Tailwind v4. Dev server: https://moneybees.localhost:1355 (already running; do not start another).

## The spec
`.plannotator/pages/content-plan.txt` is the client's Content & Visual Plan. Build your page to its section
EXACTLY: headings, bullet items and names verbatim, every visual it lists, and nothing it does not ask for.
Body/paragraph copy is placeholder lorem ipsum unless the plan gives the words.

## The approved style: copy /our-approach
Read these files end to end first; they are the model the user approved:
- app/our-approach/page.tsx
- components/approach/approach-sections.tsx (hero with numbered index, cards with drawings, white/black split lists, grey-tint card grid)
- components/approach/process-steps.tsx (pinned black band, orange track, stage per step with a drawing)
- components/approach/glyphs.tsx (small SVG explainer drawings that animate from resting to explained state on view)
- lib/approach.ts (copy lives in a lib file, one exported const per section)

Rules of the style:
- Every section gets its own explainer drawing or interaction that SHOWS what the words mean. No section that is only text or a plain list.
- Vary section shapes down the page (white, black band, split, grey #F7F7F8 tint). Two black bands never touch.
- Type: import BODY, COLUMN, EYEBROW, HEADING, SUBHEAD from "@/components/hero/tokens" (never from editorial.tsx in a server component). `Rise` from "@/components/hero/editorial" (client). Section label: `BracketLabel` from "@/components/fact-sections/fact-section". Column = COLUMN (120px side padding on desktop).
- Colours: black, white, orange #F7A11A for CTAs, key numbers, active states; grey tint #F7F7F8. Orange never as a large background; text on orange is black.
- Page shell: wrap in `SiteNavigation` ("@/components/ui/site-navigation"), `<main id="top" className="option-one bg-white text-black">`, end with `LetsTalkSection` ("@/components/home/home-sections") then `SiteFooter` ("@/components/footer/site-footer") with the explore prop as in app/our-approach/page.tsx.
- Orange CTA buttons: rounded-full bg-[#F7A11A] text-black, like LetsTalkSection's "Schedule a conversation".
- No em dashes, no emoji, no northeast arrow (U+2197) anywhere. No captions/source lines under sections. Don't copy wording from the homepage.
- Motion: respect reduced motion (lib/use-reduced-motion.ts or motion-reduce: variants). Keyframes go in a <style> tag inside your component; do NOT edit app/globals.css.

## Boundaries
- Create/edit ONLY the files your task names. Other builders work in the same tree at the same time.
- Do not edit shared files (globals.css, site-navigation, tokens, footer, home-sections, lib/insights.ts, lib/pms.ts, lib/aif.ts). Read-only imports are fine.
- Do not delete files. Do not commit or push.
- `npx tsc --noEmit -p .` is project-wide; ignore errors in files you do not own.

## Verify before reporting
1. tsc clean for your files; `npx eslint <your files>` clean.
2. `agent-browser` at 1440x900 and 390x844: capture every section (scroll to each id; for on-view animations wait ~2s). `document.documentElement.scrollWidth` must equal the viewport width. `agent-browser errors` empty.
3. Look at every screenshot and fix what looks wrong (overlaps, misalignment to the 120px column, clipped text, empty drawings).
Save captures to `.plannotator/pages/<page>/`.

## Report (under 200 words)
Files created; per page, the sections in order with the drawing each uses; verification results; anything the plan asked for that you could not do.
