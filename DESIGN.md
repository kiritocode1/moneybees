---
name: Moneybee
description: An open research desk for considered investment decisions.
colors:
  working-yellow: "#E5B91F"
  highlighted-yellow: "#F4D96B"
  paper: "#F6F4EC"
  clean-sheet: "#FCFBF6"
  ink: "#171813"
  graphite: "#5B5C54"
  hairline: "#D9D6CB"
typography:
  display:
    fontFamily: "Libre Franklin, Helvetica Neue, sans-serif"
    fontSize: "clamp(3.5rem, 7.8vw, 8.25rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Libre Franklin, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 4.75rem)"
    fontWeight: 550
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Libre Franklin, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Libre Franklin, Helvetica Neue, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 550
    lineHeight: 1.25
    letterSpacing: "0.01em"
rounded:
  control: "2px"
  media: "0px"
spacing:
  compact: "12px"
  control: "16px"
  section: "clamp(96px, 12vw, 176px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.clean-sheet}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  button-primary-hover:
    backgroundColor: "{colors.working-yellow}"
    textColor: "{colors.ink}"
  button-quiet:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 18px"
---

# Design System: Moneybee

## Overview

**Creative North Star: "The Open Research Desk"**

The interface should feel like reviewing a well-prepared investment file in bright morning light. Evidence is laid out, annotated and compared. The page is calm because the work is legible, not because it is empty. Moneybee yellow behaves like a physical working surface and highlighter, while warm paper and dark ink carry the institutional material.

The system rejects finance-category styling and the saturated editorial-minimal lane. It is neither a bank brochure nor a typographic mood board. Each major section must contain something to inspect, compare or operate: research material, process states, product structures, methodology or regulatory documents.

**Key Characteristics:**

- White-led composition with one committed yellow working surface.
- One mature sans-serif family with real weight contrast.
- One decisive, bespoke research still life rather than generic corporate stock.
- Visual instruments instead of repeated headings and card grids.
- Purposeful motion that reveals relationships and state.

## Colors

The palette comes from paper, graphite, black ink and a yellow highlighter.

### Primary

- **Working Yellow** (#E5B91F): a committed brand surface for the process instrument, history and the final invitation. It is never a small decorative stripe.
- **Highlighted Yellow** (#F4D96B): selected states, annotations and focus-adjacent emphasis.

### Neutral

- **Paper** (#F6F4EC): the primary page ground.
- **Clean Sheet** (#FCFBF6): raised working areas and controls.
- **Ink** (#171813): primary text, diagrams and decisive actions.
- **Graphite** (#5B5C54): supporting copy and secondary labels.
- **Hairline** (#D9D6CB): structural rules and table divisions.

**The Working Surface Rule.** Yellow must carry a meaningful region or selected state. Never spend it on dots, side stripes or random words.

## Typography

**Display Font:** Libre Franklin (with Helvetica Neue fallback)
**Body Font:** Libre Franklin (with Helvetica Neue fallback)

**Character:** sober, open and materially grounded. Franklin proportions feel established without imitating a private bank. The single family keeps documents, navigation and expressive display type in the same institutional voice.

### Hierarchy

- **Display** (600, clamp(3.5rem, 7.8vw, 8.25rem), 0.9): one hero statement only.
- **Headline** (550, clamp(2.25rem, 4.5vw, 4.75rem), 0.96): names a single idea or instrument.
- **Title** (550, 1.25rem, 1.15): product names, process stages and document titles.
- **Body** (400, 1rem, 1.65): plain language capped at 70 characters per line.
- **Label** (550, 0.75rem, 0.01em): brief metadata in sentence case, never a repeated all-caps kicker.

**The One Sentence Rule.** A section may have one headline and one explanatory paragraph before the working surface begins. If it needs more, the design has failed to make the idea visible.

## Elevation

The system is flat by default. Depth comes from overlapping physical media, tonal surfaces and state changes. Shadows appear only where a paper layer lifts above another paper layer, and remain broad and faint.

### Shadow Vocabulary

- **Paper Lift** (`0 24px 60px rgba(23, 24, 19, 0.12)`): used only for the hero document and a dragged or selected research artefact.

**The Flat Evidence Rule.** Tables, navigation and process controls never float. If a box needs a shadow to feel important, its hierarchy is wrong.

## Components

### Buttons

- **Shape:** precise corners with a slight physical softness (2px).
- **Primary:** Ink background, Clean Sheet text and compact 16px by 20px padding.
- **Hover / Focus:** background becomes Working Yellow, text becomes Ink, arrow moves four pixels. Focus receives a two-pixel Ink outline with a three-pixel offset.
- **Quiet:** Clean Sheet background with an Ink hairline. It is used for downloads and secondary actions.

### Cards / Containers

- **Corner Style:** square media and two-pixel controls.
- **Background:** Paper or Clean Sheet.
- **Shadow Strategy:** flat unless representing a physical sheet.
- **Border:** one-pixel Hairline divisions.
- **Internal Padding:** varies by function; instruments use tighter controls and generous working areas.

### Navigation

The desktop navigation is one quiet line with an active yellow index. Hover reveals destination context instead of only underlining text. Mobile uses a full-width index that expands in place and preserves the page underneath.

### Process Lens

Four named stages share one working surface. Selecting a stage changes the material crop, one sentence and the active annotation. The transition is a short mask and crossfade, not a carousel slide.

### Product Comparator

PMS and AIF share the same rows so eligibility, ownership, structure and documentation can be compared without reading two separate marketing cards. Switching product moves one yellow selection field and updates only the values.

### Performance Methodology Explorer

Four views explain benchmark comparison, rolling returns, drawdown and fees. It contains no invented return figures. The visual state is a methodology preview marked as awaiting compliance-approved data.

## Do's and Don'ts

### Do:

- **Do** make process, product structure, methodology and regulation directly inspectable.
- **Do** use Working Yellow (#E5B91F) as a meaningful surface or selected state.
- **Do** use one decisive bespoke image of real research materials.
- **Do** vary section treatment around the narrative instead of repeating a template.
- **Do** respect reduced motion and keep all interactions keyboard operable.

### Don't:

- **Don't** use generic Indian financial-services design, especially navy-and-gold private-bank styling.
- **Don't** use fintech dashboards, glass cards, glowing gradients, candlesticks, bulls, arrows or animated counters.
- **Don't** use generic office meetings, handshakes, skyscraper glass or stock-photo diversity theatre.
- **Don't** use aggressive conversion funnels, urgency, sales enthusiasm or "Invest now" language.
- **Don't** use luxury-finance templates made from alternating dark sections, oversized serif slogans or identical card grids.
- **Don't** use text-wall editorial minimalism where every section is another oversized heading.
- **Don't** use decorative motion or full-page transitions.
- **Don't** use colored side-stripe borders, gradient text, glassmorphism or cards inside cards.
