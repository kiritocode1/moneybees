# curocapital.dk "Mød vores partnere" (team carousel)

Pinned 2026-10-05: `index.html` (whole page), `partners-section.html` (the section),
`desktop-carousel.trimmed.html` (desktop variant, srcsets stripped), `page.js`
(Alpine `teamCarousel`, minified as `Sc`), `layout.css`.

## Desktop (lg and up), one row, bottoms aligned (`flex items-end gap-gap`)

| slot | width | content | opacity | click |
| --- | --- | --- | --- | --- |
| left column | cols-5 | bio on top (`grow`), then two thumbs (`justify-between`) | | |
| far-left thumb | cols-2 + half col + half gutter, 3:4 | person active+2 | .3 | prev twice, 700ms apart |
| near-left thumb | same | person active+1 | .5 | prev |
| main | cols-5, 3:4 | person active | 1 | |
| arrows | 1 col wide, `left: 100% + gutter`, top 0 of main | two squares, each half a column, gap 8px, bg gray-200, 6x14 chevrons | | prev / next |
| right thumb | 2.5 cols, 3:4 | person active-1 | .5 | next |

Grid: 12 cols, gutter 20px (16px below lg), margin 20px. The row is 12.5 cols wide,
so the right thumb runs past the margin and the section's `overflow-x-clip` cuts it.

## Motion

- Every slot is a clipped window holding every portrait. The shown one sits at
  x 0, opacity 1. The others sit at x -100% or +100%, opacity 0, invisible.
  `transition-all 700ms cubic-bezier(.4,0,.2,1)`. So all four windows push sideways
  at once; going "next" (right arrow) new portraits enter from the right.
- `getOffset(t) = ((t - active + 1) mod n + n) mod n - 1`; 0 shown, one side for -1,
  the other for everything else. Each slot's image list is rotated by its shift.
- Bio: Alpine x-show, enter `600ms cubic-bezier(0,0,.2,1)` from opacity 0 and
  translateY(-1rem); leave `200ms cubic-bezier(.4,0,1,1)` to opacity 0 and
  translateY(1rem). Old and new overlap (both absolute).
- `isBusy` locks input for 700ms. ArrowLeft/ArrowRight on the focused region.
  Each change calls `scrollIntoView({ behavior: "smooth", block: "nearest" })`.
- Heading: translate-y-8 to 0 and opacity on intersect, 700ms ease-out.
- Images fade in on load, 500ms.

## Below lg

A separate Embla loop: slides `flex: 0 0 var(--push-5)` with a left margin pad;
non-selected slides opacity .5 and their info -0.5rem up at .5; selected slide
full. 600ms ease-in-out.
