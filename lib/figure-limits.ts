/**
 * What the site's figures can draw, in one place. The admin rejects a value
 * outside these limits with the message beside it, and the components may
 * assume every value they receive is inside them.
 */

/** The return periods a fact sheet can carry, in the order tables print them. */
export const PERIODS = [
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "2Y", label: "2 Years" },
  { value: "3Y", label: "3 Years" },
  { value: "5Y", label: "5 Years" },
  { value: "SI", label: "Since Inception" },
] as const;
export type Period = (typeof PERIODS)[number]["value"];

/** A return, in percent. Below -100% is impossible; the bars scale to whatever else arrives. */
export const RETURN = { min: -99.99, max: 999.99 } as const;

/** Rs. 1 Mn grown to a value in Rs. Mn. The homepage stack changes its disc size for large values. */
export const WEALTH = { min: 0.01, max: 100_000 } as const;

/** One sector's share of the portfolio, in percent; the five together cannot pass 100. */
export const SECTOR = { min: 0.01, max: 100 } as const;

/** Payload validator for a number that may be empty. */
export const numberWithin =
  (limits: { min: number; max: number }, what: string) =>
  (value: number | null | undefined): true | string => {
    if (value === null || value === undefined) return true;
    if (value < limits.min || value > limits.max) return `${what} must be between ${limits.min} and ${limits.max}. You entered ${value}.`;
    return true;
  };
