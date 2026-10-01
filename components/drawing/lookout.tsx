/*
 * The small black figures the studies put on their drawings for scale, drawn
 * as one person after the lookout in study 08: a head, a neck, shoulders
 * broader than the waist, a coat to the hips, legs that taper to the ankle,
 * and shoes. Three poses share the body:
 *
 *   Person    raising a telescope to the right (05 and 08): /pms selection, /performance, /our-approach
 *   Standing  arms at the sides (06): /pms risk blocks
 *   Walker    mid-stride to the right (07): /about timeline
 *
 * Feet at the origin, facing right, about 98 units from the feet to the top
 * of the head.
 */

/** Feet at the origin, 98.4 units from feet to the top of the head. */
export const PERSON_HEIGHT = 98.4;

function Body() {
  return (
    <>
      <path d="M-7.6-86.2-3.2-86.6-2.4-81.4-7.9-81Z" />
      <path d="M-8.4-82.2C-12.6-81.4-14.4-78.2-14.3-73.6-14.2-68.4-12.4-64-12.2-59.6L-12.8-49.2H1.4L1.2-58.4C1.8-63.6 3.4-67.8 3.2-72.4 3-77.4 0-81.4-3.6-82.4Z" />
    </>
  );
}

/** Both legs straight down, a hairline apart, with their shoes. */
function StandingLegs() {
  return (
    <>
      <path d="M-12.6-49.6H-5.5L-5.2-3.2H-9.8C-10.4-18-11.8-34-12.6-49.6Z" />
      <path d="M-5-49.6H1.4C0.6-34-0.4-18-0.9-3.2H-4.6Z" />
      <path d="M-10.2-3.6H-5.4C-3.8-3.6-2.6-2.4-2.4-0.4V0H-10.6Z" />
      <path d="M-5-3.6H-0.8C1.2-3.6 2.8-2.2 3.2-0.3V0H-5.4Z" />
    </>
  );
}

const ARM = { fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** A standing figure raising a telescope to the right: the head tipped back to the eyepiece, elbow forward. */
export function Person() {
  return (
    <>
      <g fill="#000">
        <ellipse cx="-4.6" cy="-91.4" rx="5.3" ry="6.6" transform="rotate(-16 -4.6 -91.4)" />
        <Body />
        <StandingLegs />
        <path d="M-0.4-92.6 25.9-101.4 24.6-105.2-1.2-95Z" />
        <path d="M25.2-100.2 27.4-100.9 25.7-106 23.5-105.3Z" />
      </g>
      <path d="M-5.6-78.4 8.8-79.6 7.6-92.4" strokeWidth="4.4" {...ARM} />
      <path d="M10.4-93.6 14.6-97.6" strokeWidth="3.6" {...ARM} />
    </>
  );
}

/** A figure standing with its arms at its sides. */
export function Standing() {
  return (
    <>
      <g fill="#000">
        <ellipse cx="-4" cy="-92.2" rx="5.3" ry="6.6" transform="rotate(-4 -4 -92.2)" />
        <Body />
        <StandingLegs />
      </g>
      <path d="M-6.2-78.2C-4.2-71-2.8-63.4-3.2-53.2" strokeWidth="4.4" {...ARM} />
    </>
  );
}

/** A figure mid-stride to the right, the far arm swinging forward and the near arm back. */
export function Walker() {
  return (
    <>
      <path d="M-1.4-78.6C1.6-72 4.4-65.6 6.6-57.8" strokeWidth="4" {...ARM} />
      <g fill="#000">
        <ellipse cx="-3.2" cy="-92.2" rx="5.3" ry="6.6" transform="rotate(-2 -3.2 -92.2)" />
        <Body />
        <path d="M-12.4-50.4-5.4-49.4-14.6-3.6-19-4.8Z" />
        <path d="M-5.6-49.8 1.2-50.2 9.6-4.2 5.2-3.2Z" />
        <path d="M-19.6-5.2-14.4-3.8C-13-3.4-12.6-1.6-13.2-0.2L-20.6-1.8Z" />
        <path d="M4.8-3.6H9.8C11.8-3.6 13.4-2.2 13.8-0.3V0H4.4Z" />
      </g>
      <path d="M-7.4-78.2C-10.4-71.4-13.2-65.4-15.6-57.6" strokeWidth="4.4" {...ARM} />
    </>
  );
}
