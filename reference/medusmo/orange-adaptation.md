# Orange segment adaptation

The user requested a segment that belongs to the animation and narrows into a tiny sliver, instead of a late orange overlay.

`scripts/prepare-moneybee-orange-chart.py` modifies a copy of the pinned Lottie. The original layers, frame intervals and transforms remain unchanged. It remaps the original right-half surface into a shrinking orange face and expands an adjacent grey face into the released area. The source surface textures supply the grain and shading. The original left-side segmentation continues throughout.

The orange face narrows from 180 degrees to 4 degrees using a continuous smoothstep curve. Every frame contains orange. The copied Lottie is `public/preview/moneybee/chart-orange.json`; the preview loads its extracted frames through `orange-chart-manifest.json`. The rejected SVG clip/filter overlay has been removed.

Verification: all 233 copied Lottie PNG assets byte-match the rendered extracted PNG files; source layer/timing metadata matches. Orange pixel counts at first/middle/last are 30694, 15730 and 724. The maximum adjacent-frame increase is one pixel from raster antialiasing. The geometric angle decreases throughout. First, intermediate and final assets inspected, and final state rendered in the browser. Focused ESLint and TypeScript checks pass; no browser errors.

This is an intentional adaptation of the source animation, not an exact reproduction. No AI image request was needed after the user offered updating the copied Lottie as an alternative.
