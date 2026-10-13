/*
 * How urgent an enquiry is, from the rules alone. Every enquiry gets a
 * severity the moment it arrives, with the reasons that set it, so anyone who
 * opens it in /admin sees why. AI triage (lib/crm/triage.ts) can only raise
 * the result, never lower it, and only when it is confident.
 */

/** Lowest first, so the index is the rank. */
export const SEVERITIES = ["low", "normal", "high", "critical"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SEVERITY_LABELS: Record<Severity, string> = { critical: "Critical", high: "High", normal: "Normal", low: "Low" };

/** The four tabs of the /contact form (lib/contact-v2.ts ENQUIRIES). */
export const ENQUIRY_KINDS = ["pms", "aif", "support", "general"] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

export type Reason = { severity: Severity; why: string; source: "rule" | "ai" | "clock" };

export const rank = (severity: Severity) => SEVERITIES.indexOf(severity);
export const highest = (...severities: Severity[]): Severity => severities.reduce((a, b) => (rank(b) > rank(a) ? b : a), "low");

/** The answers on the form that the rules read. The option strings are the form's own (checked in severity.test.ts). */
export const RULE_ANSWERS = {
  topBand: "Above 5 crore",
  withdrawal: "Withdrawal",
  largeInvestorTypes: ["Family office", "Company or trust"],
} as const;

/** Words that mean someone is unhappy with Moneybee, not asking about a product. */
const COMPLAINT = /\b(complain\w*|grievance\w*|scores|fraud\w*|unauthori[sz]ed|legal notice|consumer (forum|court)|not (been )?(received|credited|refunded)|still waiting|escalat\w*)\b/i;

export type EnquiryFacts = {
  kind: EnquiryKind;
  /** Form field name to the value the visitor gave, e.g. { amount: "Above 5 crore" }. */
  answers: Readonly<Record<string, string>>;
  /** The contact already holds a Moneybee product, or gave a client code that matched one. */
  existingInvestor: boolean;
};

/** The default for each tab before any rule fires. */
const BASE: Record<EnquiryKind, Severity> = { pms: "normal", aif: "normal", support: "normal", general: "low" };

/** Every rule that fires, highest first, and the severity they add up to. */
export function rulesSeverity({ kind, answers, existingInvestor }: EnquiryFacts): { severity: Severity; reasons: Reason[] } {
  const reasons: Reason[] = [];
  const text = [answers.message, answers.subject].filter(Boolean).join(" ");
  const complaint = COMPLAINT.test(text);

  if (kind === "support" && answers.topic === RULE_ANSWERS.withdrawal) reasons.push({ severity: "critical", why: "An investor is asking about a withdrawal.", source: "rule" });
  if (complaint && (existingInvestor || kind === "support")) reasons.push({ severity: "critical", why: "An investor raises a complaint or grievance.", source: "rule" });
  else if (complaint) reasons.push({ severity: "high", why: "The message reads like a complaint.", source: "rule" });
  if (kind === "pms" && answers.amount === RULE_ANSWERS.topBand) reasons.push({ severity: "high", why: "PMS ticket above Rs. 5 crore.", source: "rule" });
  if (kind === "aif" && answers.commitment === RULE_ANSWERS.topBand) reasons.push({ severity: "high", why: "AIF commitment above Rs. 5 crore.", source: "rule" });
  if ((RULE_ANSWERS.largeInvestorTypes as readonly string[]).includes(answers.investor ?? "")) reasons.push({ severity: "high", why: `Investing as a ${answers.investor?.toLowerCase()}.`, source: "rule" });
  if (existingInvestor && kind !== "support") reasons.push({ severity: "normal", why: "Already a Moneybee investor.", source: "rule" });

  reasons.sort((a, b) => rank(b.severity) - rank(a.severity));
  return { severity: highest(BASE[kind], ...reasons.map((reason) => reason.severity)), reasons };
}

/** Statuses where someone still owes the visitor a reply, so the clock runs. */
export const WAITING_ON_US = ["new", "open"] as const;

/**
 * The severity an enquiry shows now: one level up once it passes its
 * response target while still waiting on Moneybee. Computed when read, so the
 * stored severity stays what triage decided.
 */
export function effectiveSeverity(stored: Severity, dueAt: string | Date | null | undefined, status: string, now = new Date()): { severity: Severity; overdue: boolean } {
  const overdue = Boolean(dueAt) && (WAITING_ON_US as readonly string[]).includes(status) && new Date(dueAt as string | Date).getTime() < now.getTime();
  if (!overdue) return { severity: stored, overdue };
  return { severity: SEVERITIES[Math.min(rank(stored) + 1, SEVERITIES.length - 1)], overdue };
}
