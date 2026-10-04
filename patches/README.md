# Hairline Terrain

`@lucasmarkes/hairline@0.2.0.patch` adds Moneybee's bee to Terrain when the
component receives `data-bee="true"`. It uses Hairline's existing projection,
pointer handling, springs, shared animation loop and reduced-motion setting.
Other figures and Terrain without that attribute retain their original behavior.

The bee comes from `public/moneybee-logo.svg`. Its black contour is split at the
wing roots so the original wings can flap. The orange bands, head and antennae
keep their original paths and colours. The separated resting shapes produced
zero differing pixels against the original at 550 × 620.

Idle flight uses a height multiplier of 0.58; hover uses 1.18. Colours and glow
remain in `components/hero/hero-terrain.module.css`. The patch removes the bundle's
source-map directive because the published map describes the unmodified code.

After a dependency upgrade, recheck idle flight, cursor following, pointer exit,
wing flapping, reduced motion and route navigation before updating this patch.
