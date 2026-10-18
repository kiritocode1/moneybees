# Careers redesign

## Accepted direction
Candidate-focused careers page within Moneybee's existing black, white, orange and Instrument Serif system. User asked to proceed rather than wait for further clarification. Preserve navigation and footer. No decorative numbering or northeast arrows.

## Changes
- Dedicated photo-led careers hero instead of the shared animated product hero.
- Five compact team enquiry rows instead of illustrated placeholder job cards.
- Actual boardroom photography and factual company/team information instead of lorem culture claims.
- Direct resume email invitation instead of an invented interview sequence.
- Preserve #openings, #life and #apply anchors. Remove the unused culture section from the page.

The existing data had no real vacancies, only five entries titled Role title. The rendered replacement describes teams and career enquiries, not confirmed vacancies. No experience requirements, employment type, salary, benefits or response times were invented. Existing email destination remains info@moneybee.in. No email was sent.

## Source decisions
BLANK discovery and four revised queries did not find a relevant careers-specific reference. Broad gallery results did not support the recruiting decision and were not treated as influences.

Outside-second-brain source inspected: https://careers.blackrock.com/location/mumbai-jobs/45831/1269750-1264418-1275339/4
Observed native job links with job title, location and team metadata. Adopted the readable row hierarchy and direct action. Did not copy BlackRock styling, jobs, search complexity or hiring claims. The cookie overlay remained in the captured reference, while the accessibility tree exposed job structure.

## Verification
- TypeScript noEmit passed.
- ESLint passed for app/careers/page.tsx, components/careers/careers-page-sections.tsx and lib/careers.ts.
- Browser inspected at 1440, 768, 390 and 320px widths.
- No horizontal overflow, lorem or Role title in rendered main content at those widths.
- Both main images loaded at all widths.
- Explore opportunities clicked and reached #openings at the intended 120px header offset.
- Meet the team clicked and navigated to /about#key-members.
- All five enquiry links have team-specific encoded email subjects.
- Reduced-motion preference exercised. New content has no decorative entrance loops; interactive colour transitions have a reduced-motion path.
- Axe main-content audit: 19 passes, zero violations and zero incomplete checks.
- Browser runtime error list empty.
- Screenshots inspected for desktop hero, opportunities, office and resume invitation; mobile hero and narrow-screen rows.

## Limits
The page is presentation-ready as a careers enquiry page, not a verified live vacancy board. Sending or receiving email was not tested. The existing boardroom image is only 573x408 and remains visibly lower-resolution than the team image.

## Evidence
- before-desktop.png
- hero-1440.png
- hero-390.png
- opportunities-1440.png
- opportunities-320.png
- office-desktop.png
- resume-desktop.png
- checks.json

URL: https://moneybees.localhost:1355/careers
