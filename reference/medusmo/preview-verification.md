# Preview verification

Verified the isolated `/preview/homepage` route after adding the source chart, supplied footer artwork and supplied hero artwork.

- `node scripts/prepare-moneybee-preview.mjs --check`: all 233 PNG byte hashes match the embedded source assets. Timeline intervals, dimensions and 103% parent scale match the pinned JSON.
- Footer SVG: six original rectangles/gradients and 192 stops preserved. Removed only the text wordmark and its shadow filter.
- Hero SVG: fourteen original rectangles/gradients and 448 stops preserved. Removed only the text wordmark and its shadow filter.
- Chart frames 0, 116 and 232: compared rendered SVG crops at 564 × 540 against an independent canvas rendering of the pinned PNG and original parent transform. Mean RGB channel error rounds to 0.0000 for each frame; maximum channel error is 1/255. Browser page screenshots were cropped using the SVG bounding box. Direct SVG-selector export omitted its external image and was discarded as invalid evidence.
- Desktop scroll reached frames 0, 116 and 232. Mobile stage control returned to frame 0. Reduced-motion controls worked with a 760px section rather than a long pinned scroll.
- Screenshots reviewed at 1440 × 1000 and 390 × 844. No horizontal overflow at 390px. No browser errors.
- Focused ESLint and TypeScript checks passed.

The original chart uses raster images inside SVG, not newly drawn vector wedges. Its greys and baked grain are retained. The preview maps its full timeline to the existing research scroll section; surrounding copy and layout differ from Medusmo. It is a process illustration, not a financial allocation chart.

Latest hero revision removes the category/location/date row, introductory paragraph and decorative divider lines. Financial labels and the separate dated performance disclosure remain. Actual homepage and shared navigation were not edited.
