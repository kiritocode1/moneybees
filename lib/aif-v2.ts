/**
 * Copy for /aif, from the Content & Visual Plan §4 "AIF Page, Flyingbee
 * Investment Fund". Headings, the introduction, the Category III explanation,
 * the structure, the seven approach points and the five key terms are the
 * plan's wording. Body copy marked LOREM is placeholder until the client
 * supplies it.
 *
 * Compliance: the plan asks that terms, tax treatment, eligibility, fees and
 * regulatory statements be checked against the latest approved fund documents
 * before this page is published.
 */

import { ENQUIRY_HREF } from "@/lib/contact-v2";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const FLYINGBEE = {
  heading: "Flyingbee Investment Fund",
  intro:
    "Flyingbee Investment Fund is a Category III AIF managed by Moneybee. The fund focuses on opportunities in high-growth listed and pre-IPO/unlisted companies.",
  /** The introduction's second sentence, set beside Strategic Opportunity; the hero carries the first. */
  // A non-breaking hyphen in "pre‑IPO", so the line never splits the word.
  focus: "The fund focuses on opportunities in high-growth listed and pre\u2011IPO/unlisted companies.",
  /** The plan's "Explore Flyingbee / Get Started" button, split into its two actions. */
  start: { label: "Get Started", href: ENQUIRY_HREF },
} as const;

/**
 * Three of the five benefits on the Flyingbee deck's "Strategic Opportunity
 * with Flyingbee Investment Fund" slide (August 2026, page 8), the three not
 * said elsewhere on /aif. Titles are the slide's; the lines are its facts in
 * plain words. The tax line is a regulatory statement: check it against the
 * approved fund documents before publication.
 */
export const OPPORTUNITY = {
  heading: "Strategic Opportunity",
  steps: [
    { title: "Seasoned background", text: "Over 45 years of experience in corporate advisory and wealth management." },
    { title: "Exclusive access", text: "Access to early-stage winners and to opportunities the wider market overlooks." },
    { title: "Simplified tax", text: "Category III AIF income is taxed at the fund level, so it is tax free in the investor's hands." },
  ],
} as const;

/** The plan's explanation, with its "the presentation explains that" dropped. */
export const CATEGORY_III = {
  heading: "Why Category III AIF?",
  text: "An AIF is a privately pooled investment vehicle. Unlike PMS, where investors directly hold securities in their own demat accounts, AIF investors receive units of the fund.",
} as const;

/** Investors → Flyingbee Investment Fund → Moneybee Investment Manager, and the four parties around the fund. Drawn on /aif as names only (components/aif-v3/structure-section.tsx). */
export const STRUCTURE = {
  heading: "Flyingbee Structure",
  chain: ["Investors", "Flyingbee Investment Fund", "Moneybee Investment Manager"],
  parties: ["Trustee", "Custodian and Fund Accountant", "Registrar and Transfer Agent", "Brokers"],
} as const;

/** The plan's seven points, verbatim, as the order the process runs in. */
export const APPROACH_STEPS = [
  "Fundamental research",
  "Quality management",
  "Competitive advantage",
  "Reasonable valuations",
  "Risk-reward analysis",
  "Long-term value creation",
  "Unbiased decision making",
] as const;

/** The plan's key terms. `label` and `value` split each line; `glyph` picks its drawing. */
export const KEY_TERMS = [
  { label: "Minimum investment", value: "Rs. 1 crore", glyph: "minimum" },
  { label: "Suitable time frame", value: "3 to 5 years", glyph: "horizon" },
  { label: "Investment in", value: "Listed and pre-IPO/unlisted opportunities", glyph: "universe" },
  { label: "Benchmark", value: "S&P BSE 500 TRI", glyph: "benchmark" },
  { label: "Exit load", value: "No exit load, subject to approved fund documents", glyph: "exit" },
] as const;

export const AIF_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
