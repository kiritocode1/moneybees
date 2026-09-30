/**
 * The scroll timing of the philosophy fly-through, with no three.js import, so
 * the section can read it on first render while three.js itself loads only
 * through the dynamic import of ./tholos.
 */

export const COLUMN_COUNT = 6;

/** Progress where the descent ends and the orbit begins, and where the orbit hands over to the centre. */
export const DESCENT_END = 0.14;
export const ORBIT_END = 0.86;

/** The scroll progress at which pillar `index` is centred on screen. */
export const pillarCentre = (index: number) => DESCENT_END + ((index + 0.5) / COLUMN_COUNT) * (ORBIT_END - DESCENT_END);
