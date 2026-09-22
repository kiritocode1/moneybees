# Finish the homepage, revised after review

The homepage needs an introduction between the hero and research visuals.
Copy the attached Medusmo split-section mechanism with Moneybee copy and existing research imagery.
Verify the transition, scroll sequence and mobile layout against the pinned source.

## Page order

```
Hero → Dark introduction → Research → Selection → Products → Footer
```

## What changes

Add one full-width dark introduction immediately after the hero. On desktop it pins for a three-part sequence. The left column holds short statements. Right-hand images reveal upward as the visitor scrolls. Scrolling back reverses the sequence.

The live source uses a 1.25fr / 1fr split, a 100vh sticky frame, and a #31312f background. Its text transitions over .4s with cubic-bezier(.445,.05,.55,.95). Right-hand panels grow from 0vh to 100vh with scroll, while images scale from 1.2 to 1. These values are pinned in reference/medusmo/site.css and site-motion.js.

Use the same layout and motion, with intentional brand adaptations:
- Use black at the hero seam and throughout the introduction so there is no colour break.
- Use the current Moneybee font, white text and muted grey stripe motif.
- Use public/video/research-desk.jpg and desk-analysis.jpg as research illustrations. Do not label them as photographs of Moneybee's office.
- Keep necessary performance dates/disclosures readable on the black transition beneath the existing hero artwork. Remove the light-coloured strip between the artwork and introduction.
- Preserve the accepted hero artwork, heading, numbers, navbar, research pie, selection drawing and footer.

## Copy in the sequence

1. "We invest in Indian businesses with capable management, sound economics and room to grow."
2. "Annual reports are one part of the work. We meet management, visit plants and compare a business with its peers."
3. "We keep reviewing the reasons we invested. A change in the business can change our decision to hold it."

These statements use the supplied group-profile research notes. They introduce Moneybee's work without expanding product terms or repeating the 6,000-to-20 diagram. No extra subtitle. A single "Our approach" link continues to the research section.

## File changes

| File | Today | After |
| --- | --- | --- |
| app/preview/homepage/preview.tsx | Hero leads straight to research | Inserts the dark introduction after hero |
| app/preview/homepage/preview.module.css | Light disclosure strip beneath hero | Black strip with readable dates and disclosure text |
| app/preview/homepage/home-introduction.tsx | Absent | Three-part scroll sequence using existing GSAP and local imagery |
| app/preview/homepage/home-introduction.module.css | Absent | Source-derived split, spacing, mobile stacking and reduced-motion states |
| reference/medusmo/dark-slider.html, site.css, site-motion.js | Now pinned | Source for comparison and retained values |
| scripts/check-moneybee-introduction.mjs | Absent | Checks the retained layout and motion values against pinned source |

## Implementation decisions

```diff
 </section> // hero
+<HomeIntroduction />
 <ResearchSection />
```

```css
.introductionFrame {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  position: sticky;
  top: 0;
  height: 100vh;
  background: #000;
}
```

```tsx
gsap.fromTo(panel, { height: "0vh" }, {
  height: "100vh",
  ease: "none",
  scrollTrigger: {
    trigger,
    start: "top bottom",
    end: "bottom bottom",
    scrub: true,
  },
});
```

Below the source's 991px desktop threshold, stack readable text and images without scroll pinning. Reduced motion also shows the content without animated wipes. Clean up ScrollTriggers when leaving the route.

## Verification

Capture the source and preview at the same desktop viewport and at each sequence state. Compare retained column ratio, image boundaries, text placement and motion values. Report intentional copy, image, typeface and colour differences separately. Verify the hero-to-introduction seam by scrolling across it. Check mobile overflow, keyboard access, reduced motion, ESLint and TypeScript.

## Outside this pass

No factsheet section, team cards, careers block, expanded PMS/AIF explanations or added emphasis on Queenbee/Flyingbee names. No changes to separate product pages, backend, CRM, login, analytics or production homepage. No commit or push.

The named Medusmo section is the only new visual source for this pass. This plan replaces the previous remaining-sections proposal.
