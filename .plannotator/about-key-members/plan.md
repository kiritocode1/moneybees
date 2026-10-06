# Key Team Members moves to /about, /team goes

**Problem.** /team and /about both show the team. The /team card section is the one you want to keep.
**Result.** /about shows Key Team Members as its section 03, in place of "The people behind the portfolio". /team is deleted, and every link to it lands on /about instead.
**Proof.** /team returns 404, no `/team` links remain, and /about at 1440 and 390 matches the preview below.

```
/about:  Hero → 01 Founder → 02 What the group does → 03 [Key Team Members] → 04 Timeline → 05 Story
                                                         ↑ replaces the name list
/team:   deleted. Nav, footers and the homepage carousel point at /about#key-members
```

## Current and proposed, 1440

Preview route: `https://moneybees.localhost:1355/preview/about-team` (deleted once this lands).

Current /about section 03:

![Current, 1440](shots/current-1440.png)

Proposed. The section is unchanged from /team, except the eyebrow will read **03** instead of 02:

![Proposed, 1440](shots/proposed-1440.png)

Proposed at 390 (top):

![Proposed, 390](shots/proposed-390-top.png)

## Two decisions

**1. The "Our Team" menu item.**
- **Recommended: keep it and point it at `/about#key-members`.** The client's plan lists Our Team in the nav, and the footers and the homepage carousel's "About Shreyam" links need a target anyway.
- Or remove it from the menu, the same way Insights went.

**2. The grey seam.** This section is `#F7F7F8` and the timeline after it is `#F6F6F6`, so the two run together with no break:

![Proposed seam with the timeline, 1440](shots/proposed-seam-1440.png)

- **Recommended: make the timeline white.** The moved section stays exactly as it is on /team. The Story section after the timeline already has its own dashed top rule.
- Or leave both grey.

## Files

| File | Change |
| --- | --- |
| `app/about/page.tsx` | `PeopleSection` becomes `KeyMembersSection`; footer "Our team" points to `#key-members` |
| `components/team/team-sections.tsx` | Eyebrow 02 → 03. `FounderBand` and its drawing go, because /about has its own founder band |
| `lib/team.ts` | `FOUNDER_PERSON` and the unused `TEAM` heading go |
| `app/team/page.tsx` | Deleted |
| `components/about-v3/people-section.tsx` | Deleted, along with `PEOPLE`, `WORK` and `DETAILS` in `lib/about-v3.ts`, which only it used |
| `lib/page-heroes.ts`, `lib/pms-v3-hero.ts`, `components/pms-v3/marks.tsx`, `app/preview/headers/page.tsx` | `TEAM_HERO` and the `team` hero mark go |
| `components/ui/site-navigation.tsx` | Our Team, per decision 1 |
| `app/page.tsx`, `app/contact/page.tsx`, `app/our-approach/page.tsx`, `app/preview/contact/page.tsx` | Footer Team links point to `/about#key-members` |
| `components/fact-sections/team-carousel.tsx` | The "About <name>" links point to `/about#<id>` |
| `app/sitemap.ts` | `/team` removed |
| `components/about-v3/timeline-section.tsx` | Background white, per decision 2 |

## Left out

- **No redirect from /team.** The site is not live yet, so nobody has the old URL saved.
- **The /team founder band is gone.** It had a "45+ years" timeline drawing that /about's founder section does not have. /about keeps its own founder section as it is.
