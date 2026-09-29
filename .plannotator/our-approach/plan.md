# Our Approach page

## Goal

The nav's "Our Approach" points at a homepage anchor, but the content plan (§6) asks for a page of its own.
After this, `/our-approach` holds the philosophy, the six-step process, what we look for and won't do, and the four risks.
Proof: the preview below renders at 1440 and 390 wide with no horizontal scroll, and the nav link lands on it.

## What it looks like

Preview (live now): https://moneybees.localhost:1355/preview/our-approach

The page reuses sections that are already live. Only the hero is new.

```
Hero (new)  →  Philosophy fly-through (from /)  →  Six-step process (from /aif)
            →  Discipline lists (unused today)  →  Risk framework (from /pms)  →  Let's talk, footer
```

| Spec §6 block | Section used | Deck source |
|---|---|---|
| Core philosophy | `PhilosophyFlythrough`, six pillars | group profile p12, AIF p4 |
| Stock selection process, 6 steps | AIF `ProcessSection`, the ribbon | AIF p5: Screen, Shortlist, Due Diligence, Decision Making, Monitor, Exit |
| What we look for / What we don't do | `DisciplineSection`, plus red flags and exit | AIF p5 to 6 |
| Risk management | PMS `Risks`, four wedges | group profile p16 |

### Proposed preview: hero, desktop 1440

![hero desktop](./hero-desktop.png)

### Proposed preview: hero, phone 390

![hero mobile](./hero-mobile.png)

### Reused sections, as they render on the page

Six-step process:

![process](./process.png)

Discipline lists:

![discipline](./discipline.png)

Risk framework:

![risk](./pms-risk-panel.png)

Philosophy, mid-scroll. The headless capture browser drew no WebGL, so the columns are missing here. They render in a normal browser.

![philosophy](./philosophy-pillars.png)

## Files

| File | Today | After |
|---|---|---|
| `components/approach/approach-hero.tsx` | new | Eyebrow, "Our investment approach", the deck's approach line, four anchor links |
| `app/our-approach/page.tsx` | missing | The route, moved from the preview |
| `app/preview/our-approach/page.tsx` | preview | Deleted once the real route exists |
| `components/ui/site-navigation.tsx` | "Our Approach" → `/#philosophy-pillars` | → `/our-approach` |
| Footer `explore` lists on each page | "Our philosophy" and "Our process" → homepage anchors | → `/our-approach#philosophy-pillars` and `/our-approach#process` |

## Decisions in the code

```diff
- { label: "Our Approach", href: "/#philosophy-pillars" },
+ { label: "Our Approach", href: "/our-approach" },
```

The hero lead is `PMS_APPROACH` from `lib/insights.ts` (group profile p9), not new copy. The page title "Our investment approach" is the spec's heading.

The six steps come from the AIF deck's ribbon, not the PMS funnel. The ribbon has exactly the spec's six names. The PMS funnel groups stages differently and has no Exit step.

## Left out

- The homepage keeps its philosophy and process sections. Removing them from `/` is a separate decision.
- `DisciplineSection` also shows Red flags and Exit. The spec lists neither, but both are in the same deck slide. Say if they should go.
- Exit appears twice, as step 6 and as a list. Acceptable, or drop the list.
- Not yet checked in the real build: the philosophy WebGL on a phone, and anchor scroll offsets under the fixed nav.
