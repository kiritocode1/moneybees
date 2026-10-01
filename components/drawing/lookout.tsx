/*
 * The lookout: the tiny standing figure studies 05 and 08 put on the result,
 * raising a telescope to the right. Used by /pms (selection lines) and
 * /performance (wealth discs).
 */

/** Feet at the origin, 98.4 units from feet to the top of the head. */
export const PERSON_HEIGHT = 98.4;

/** A plain standing figure raising a telescope to the right. */
export function Person() {
  return (
    <>
      <g fill="#000">
        <circle cx="0.4" cy="-91.6" r="6.8" />
        <rect x="-2.3" y="-87" width="4.8" height="8" />
        <path d="M-5.5-80.5C-8.5-80-9.2-76-9.2-71L-9.4-52-10.2-31H9.4L8.2-52 8-71C8-77 6-80.5 2.5-81Z" />
        <path d="M-6.4-33H-1.4L-1.8-3H-5.8Z" />
        <path d="M1-33H6.2L7.4-3H3.2Z" />
        <rect x="-6.6" y="-3.4" width="6.8" height="3.4" rx="1.5" />
        <rect x="2.8" y="-3.4" width="7.8" height="3.4" rx="1.5" />
        <path d="M5.76-92.61 31.17-101.8 31.4-101.24 34.18-102.36 31.85-108.11 29.07-106.99 29.3-106.43 4.64-95.39Z" />
      </g>
      <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3-76 12.5-80 19.4-99.2" strokeWidth="4.8" />
        <path d="M0-76 7-80.5 9.6-94.6" strokeWidth="4.2" />
      </g>
    </>
  );
}

