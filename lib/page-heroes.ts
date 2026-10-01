/**
 * The heroes of the internal pages, on the /pms and /aif template
 * (components/pms-v3/product-hero.tsx): each page's own mark, its plan heading
 * as the stepped title, one sentence and the facts that sum the page up.
 * Facts come from the content plan and the decks via lib/*; a figure here is
 * never repeated as a section on the same page.
 */

import { ABOUT } from "@/lib/about-v2";
import { CAREERS, RESUME_HREF, RESUME_EMAIL } from "@/lib/careers";
import { CONTACT, PMS_APPROACH, PMS_VS_AIF } from "@/lib/insights";
import { PERFORMANCE } from "@/lib/performance";
import type { ProductHeroData } from "@/lib/pms-v3-hero";

const [onboarding, productQueries, grievance] = CONTACT.emails;

export const COMPARE_HERO = {
  mark: "compare",
  title: ["PMS vs AIF", "Understanding the Difference"],
  sentence: PMS_VS_AIF,
  actions: [{ label: "Get Started", href: "/contact" }],
  // Three facts a side, PMS and AIF alternating, none of them a row of the comparison below.
  figures: [
    { label: "PMS since", value: "Aug 2007" },
    { label: "Flyingbee first close", value: "Oct 2025" },
    { label: "PMS horizon", value: "At least 3 years" },
    { label: "AIF time frame", value: "3 to 5 years" },
    { label: "PMS portfolio", value: "15 to 20 stocks" },
    { label: "AIF minimum", value: "Rs. 1 crore" },
  ],
} as const satisfies ProductHeroData;

/** The portfolio approach's rules (plan §3) sum the page up; the core philosophy has its own section below. */
export const APPROACH_HERO = {
  mark: "approach",
  title: ["Our Investment", "Approach"],
  sentence: PMS_APPROACH,
  figures: [
    { label: "Portfolio", value: "15 to 20 stocks" },
    { label: "Horizon", value: "At least 3 years" },
    { label: "Maximum sector allocation", value: "30%" },
    { label: "Review", value: "Quarterly" },
  ],
} as const satisfies ProductHeroData;

export const PERFORMANCE_HERO = {
  mark: "performance",
  title: ["Performance"],
  sentence: "Moneybee PMS and the Flyingbee Investment Fund, period by period, against their benchmarks.",
  figures: [
    { label: "As of", value: PERFORMANCE.asOf.replace("As of ", "") },
    { label: "PMS since", value: "Aug 2007" },
    { label: "PMS benchmark", value: "S&P BSE 500 TRI" },
    { label: "Flyingbee first close", value: "Oct 2025" },
    { label: "AIF benchmark", value: "S&P BSE 500" },
    { label: "Returns", value: "Time-weighted, after expenses" },
  ],
} as const satisfies ProductHeroData;

export const CASES_HERO = {
  mark: "cases",
  title: ["Our Investment", "Journey"],
  sentence: "Three historical examples of how Moneybee identified a business opportunity.",
  figures: [
    { label: "Renewable power", value: "KPI Green Energy" },
    { label: "Specialised castings", value: "Uni Abex Alloy Products" },
    { label: "Electrical steel", value: "Pitti Engineering" },
    { label: "Financials", value: "FY20 to FY24, Rs. crore" },
  ],
} as const satisfies ProductHeroData;

export const TEAM_HERO = {
  mark: "team",
  title: ["People Behind", "Moneybee"],
  sentence: ABOUT.company[1],
  figures: [
    { label: "Moneybee Group since", value: "2004" },
    { label: "Founder's experience", value: "45+ years" },
    { label: "PMS since", value: "Aug 2007" },
    { label: "Office", value: "Lower Parel, Mumbai" },
  ],
} as const satisfies ProductHeroData;

export const CAREERS_HERO = {
  mark: "careers",
  title: ["Build Your Career", "with Moneybee"],
  sentence: CAREERS.lead,
  actions: [
    { label: "View Open Positions", href: "#openings" },
    { label: "Send Your Resume", href: RESUME_HREF, outline: true },
  ],
  figures: [
    { label: "Office", value: "Lower Parel, Mumbai" },
    { label: "Moneybee Group since", value: "2004" },
    { label: "Resumes to", value: RESUME_EMAIL },
  ],
} as const satisfies ProductHeroData;

export const CONTACT_HERO = {
  mark: "contact",
  title: ["Let's Start a", "Conversation"],
  sentence: `Moneybee Group, ${CONTACT.address[0]} ${CONTACT.address[1]}`,
  actions: [{ label: "Get Started", href: "#enquiry" }],
  figures: [
    { label: "Phone", value: "022-4030 2080" },
    { label: "Email", value: "info@moneybee.in" },
    { label: onboarding[0], value: onboarding[1] },
    { label: productQueries[0], value: productQueries[1] },
    { label: grievance[0], value: grievance[1] },
  ],
} as const satisfies ProductHeroData;

export const INVESTOR_HERO = {
  mark: "investor",
  title: ["Investor", "Centre"],
  sentence: "Investor information and regulatory documents, in one place.",
  figures: [
    { label: "Client login", value: "moneybee.in" },
    { label: "Distributor login", value: "On request" },
    { label: onboarding[0], value: onboarding[1] },
    { label: grievance[0], value: grievance[1] },
    { label: "SEBI complaints", value: "SCORES" },
    { label: "Online dispute resolution", value: "ODR" },
  ],
} as const satisfies ProductHeroData;
