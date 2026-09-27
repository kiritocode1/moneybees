/**
 * The editorial class strings from antimetal.com's layout (pinned in
 * reference/antimetal/source). A plain module, not a client one, so server
 * components can read the strings too; editorial.tsx re-exports them.
 */

/** .text-subhead */
export const SUBHEAD = "font-serif text-[clamp(2.125rem,.6667rem+3.6458vw,3rem)] leading-[1.1] font-normal tracking-[-.021em]";
/** .text-body */
export const BODY = "font-serif text-[clamp(1.25rem,.8333rem+1.0417vw,1.5rem)] leading-[1.2] font-normal";
/** .text-eyebrow. The font is loaded in the root layout. */
export const EYEBROW = "font-[family-name:var(--font-geist-mono)] text-[10px] leading-normal tracking-[.1em] uppercase";
/** .text-heading. Tracking eased from -.037em: Instrument Serif is narrower than Signifier. */
export const HEADING = "font-serif text-[clamp(2.5rem,1.0417rem+3.6458vw,3.375rem)] leading-[1.1] font-normal tracking-[-.02em]";
/** .text-button with the button shell. */
export const BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center rounded-full px-[24.5px] py-[12.5px] text-[14px] leading-[1.5] font-medium whitespace-nowrap no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";
/** The source's 1512px column with 120px gutters. */
export const COLUMN = "mx-auto w-full max-w-[1512px] px-6 md:px-[120px]";
