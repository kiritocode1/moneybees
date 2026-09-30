# kobbe.io reference (pinned 2026-09-30)

Source: index.html, BaseLayout.css (Tailwind v4, Astro). Screenshots: v1440-0..5.png, full-1440.png, full-390.png.

## Style in 3 sentences
Warm off-white page (oklch 98.2% .002 84.6, about #FAF9F7), charcoal text (oklch 28.9% 0, about #333), one weight (400) of Inter for almost everything, with headings that are the same size as running text plus a grey second half of the sentence. There are no rules, no dividers and no colour accents on the page; structure comes from vast whitespace (288px above the first section, 128px between sections) and rounded muted panels (oklch 96.5%) holding product screenshots that fade out at the bottom. The only illustration is a pen-and-ink raster (webp) of small people walking along a stone quay, in grey with muted red/tan clothing, that sits at the bottom of the hero.

## Token table
| Item | kobbe | ours |
|---|---|---|
| Sans | Inter variable, self-hosted woff2, 100-900 | Rethink Sans (body/UI) |
| Serif | none | Instrument Serif (headings + body) |
| Mono | Geist Mono declared, unused on home | Geist Mono, eyebrow 11px / .1em uppercase |
| H1 | clamp(1.5rem, 2.5vw, 2.25rem) = 36px @1440, lh 1.25, ls -.025em, w400, max-w 64rem | HEADING clamp(2.5rem..3.375rem), lh 1.1, ls -.02em; page H1s up to 5rem |
| H2 | clamp(1.25rem, 2vw, 1.35rem) = 21.6px, lh 1.25, ls -.025em, w400, mt-4 | SUBHEAD clamp(2.125rem..3rem), lh 1.1 |
| Body | 16px/24px w400; UI 14px/20px w500 | BODY clamp(1.25rem..1.5rem), lh 1.2 |
| Section label | 16px muted grey text, no caps, no mono | EYEBROW mono caps / BracketLabel |
| Text colours | fg oklch(28.9% 0) ; muted oklch(55.6% .008 84.6) used for second half of each heading | black; black/70 |
| Background | oklch(98.2% .002 84.6); panels oklch(96.5% .004 84.6); border oklch(91.2% .006 84.6) | white |
| Accent | none on the home page; brand blue oklch(49% .091 241.5) used only in charts and links inside screenshots | #F6A11A |
| Container | 1216px content (112px margins at 1440), max-w-5xl (64rem) for headings, text column about 700px | COLUMN 1512px max, 120px gutters |
| Section spacing | hero pt 288px (lg), sections mt-32 (128px), py-24 mobile | 110-220px padding |
| Radius | 10px panels (--radius .625rem), 8px nav button, 10px CTA, 2px logos | rounded-full buttons |
| Buttons | solid charcoal, white 14/16px w500 text, hover bg /85, no shadow, no border | pill, 14px w500, scale .97 on press |
| Shadow | 8-layer soft elevation scale, panel = 1px white ring + 2px 8% ink ring | none/rules |
| Nav | sticky, two floating pill groups (Menu left; links + CTA right), 60px, translucent grey chip bg | full-width nav |
| Motion | see below | Rise .7s cubic-bezier(.22,1,.36,1); ease-out-strong .23,1,.32,1 |

## Graphics and illustration language
- Hero art is not vector: `quay.*.webp` plus `sprite-NN.webp` frames of hand-drawn pen and wash people, greyscale with one or two muted colours (dusty red, tan). Stone quay strip runs full-bleed and scrolls under the sticky nav (visible at the top of v1440-1.png).
- Product proof is real UI screenshots in a 10px muted panel, cropped and faded at the bottom with a gradient mask, inner shadow ring. No isometric drawing, no stroke icons on the page. No SVG larger than 150px exists (measured: 0 large svgs).
- Charts inside screenshots use a single thin blue line with pale fill and a dotted comparison line.

## Motion cadence
- No GSAP, ScrollTrigger, Lenis or Webflow (all `false`). Astro + Tailwind, ClientRouter for page transitions.
- Keyframes in the CSS: enter/exit (tailwindcss-animate style, .15s default), footer-boat-bob (4s ease-in-out infinite alternate, translateY 3% to -6% with 1deg rotate), drift, step, glide, hop (hero sprites walking; bodies not captured, see gaps).
- Hover: opacity to .7 on Menu, bg to 85% on CTA, .15 to .2s. Easing cubic-bezier(.22,1,.36,1) appears in the sheet, otherwise (.4,0,.2,1).
- Net: almost static. Movement is limited to the hero characters, the footer boat and hover fades.

## Adopt / adapt / reject
| Item | Verdict | Reason |
|---|---|---|
| Two-tone heading (dark first sentence, grey rest, same size) | Adapt | Fits an institution: calm hierarchy with no size shouting. Use in Instrument Serif at our existing sizes, black + #9D9EA1 (our grey), body-size not headline-size on inner pages. |
| Whitespace scale (288 hero top, 128 between sections) | Adopt | Matches "premium, spacious". Our 110-220 is close; standardise on 128 between sections. |
| Single-weight type, no bold | Adopt | Weight 400 everywhere is what reads expensive. We already use w400 serif. |
| Warm off-white bg + muted panel + hairline border | Adapt | Client palette says white; keep white page, use a #F6F6F5-ish panel only for figure frames. Do not go beige. |
| No coloured rules, no accent noise | Adapt | Keep orange to numerals, a hairline or a single honeycomb mark; kobbe uses zero colour, so ours should stay under kobbe's ceiling, not above. |
| Faded-bottom screenshot panels | Adapt | Only for a dashboard/portfolio-report mockup, and only with real figures from the decks. Facts-only rule applies. |
| Pen-and-ink illustrated crowd | Reject as-is | Whimsical, closer to the cartoon the client ruled out, and off-topic for a PMS/AIF. If a drawn element is wanted, a single engraved-style honeycomb line study would carry the same craft. |
| Raster sprite illustration generally | Reject | 0 SVG figures; ours are SVG line drawings, which scale and stay crisp and are easier to explain-by-animation. |
| Floating pill nav (Menu chip + CTA chip) | Adapt | Chip look with 1px white ring is refined; keep our overlay menu but consider the chip surface on scroll. |
| Solid charcoal 8-10px radius button | Adapt | Our pill is more distinctive; take the charcoal fill, no shadow, hover /85 for the primary. Keep pill or use 10px, not both. |
| Elevation shadow scale | Adapt | Use only the 2-ring panel shadow on figure frames; skip the 8-layer ones. |
| Near-static motion, hover fades .15-.2s | Adopt | Right cadence for financial services. Our Rise .7s is already in range; do not add scroll-linked effects beyond the approved fly-through. |
| Inter | Reject | We have Rethink + Instrument Serif; serif headings are the main difference from kobbe and the better fit for the institution posture. |

## Access gaps
- Bodies of drift/step/glide/hop keyframes and the hero JS were not extracted (sprite timing unmeasured). page.js is a 47-byte prefetch stub; hero logic is inline in index.html.
- Only the home page was examined. Mobile screenshot full-390.png saved but not inspected.
- Screenshots initially landed in repo root and were moved here.
