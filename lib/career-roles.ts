import type { Team } from "@/lib/careers";

/** Presentation fixtures only. Replace with approved vacancies before publishing live jobs. */
export type CareerRole = {
  id: string;
  title: string;
  team: Team;
  location: string;
  employment: string;
  summary: string;
  responsibilities: readonly string[];
  status: "sample";
};

/** Sample roles demonstrate search, filtering and pagination without claiming live vacancies. */
export const CAREER_ROLES = [
  { id: "equity-research", title: "Equity Research Analyst", team: "research", location: "Mumbai", employment: "Full-time", summary: "Research listed companies and build a view of their businesses, financial performance and valuation.", responsibilities: ["Analyse company financials and industry developments.", "Build financial models and document investment research."], status: "sample" },
  { id: "investment-associate", title: "Investment Associate", team: "portfolio", location: "Mumbai", employment: "Full-time", summary: "Support investment analysis and the ongoing review of portfolio companies.", responsibilities: ["Track business developments across portfolio companies.", "Prepare analysis for investment discussions."], status: "sample" },
  { id: "advisory-analyst", title: "Corporate Advisory Analyst", team: "advisory", location: "Mumbai", employment: "Full-time", summary: "Support corporate research, business modelling and valuation assignments.", responsibilities: ["Research businesses and comparable companies.", "Prepare financial analysis and presentation materials."], status: "sample" },
  { id: "compliance-associate", title: "Compliance Associate", team: "compliance", location: "Mumbai", employment: "Full-time", summary: "Support compliance documentation and the review of internal processes.", responsibilities: ["Maintain documentation and reporting records.", "Assist with compliance reviews and follow-up tasks."], status: "sample" },
  { id: "operations-associate", title: "Investment Operations Associate", team: "services", location: "Mumbai", employment: "Full-time", summary: "Support the records and coordination involved in day-to-day investment operations.", responsibilities: ["Maintain operational records and reconcile information.", "Coordinate documentation with internal teams."], status: "sample" },
  { id: "research-intern", title: "Investment Research Intern", team: "research", location: "Mumbai", employment: "Internship", summary: "Assist with company and sector research while developing financial analysis skills.", responsibilities: ["Gather company information and industry data.", "Support research notes and financial analysis."], status: "sample" },
  { id: "portfolio-analyst", title: "Portfolio Analyst", team: "portfolio", location: "Mumbai", employment: "Full-time", summary: "Support portfolio monitoring and investment reporting.", responsibilities: ["Review portfolio data and company updates.", "Prepare reports for the investment team."], status: "sample" },
  { id: "client-services", title: "Client Services Associate", team: "services", location: "Mumbai", employment: "Full-time", summary: "Support client communication and documentation across financial services.", responsibilities: ["Coordinate client documentation.", "Track enquiries and work with the relevant internal teams."], status: "sample" },
] as const satisfies readonly CareerRole[];
