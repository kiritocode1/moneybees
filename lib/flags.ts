import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

/*
 * Switches for everything that sends personal data to an AI model or keeps an
 * ID in a visitor's browser (user, 2026-10-12). All start off. On Vercel they
 * are toggled in the project's Flags tab once FLAGS (the Vercel Flags SDK key)
 * is set. Without it, as on a laptop, each reads FLAG_<KEY>=1 from the
 * environment, e.g. FLAG_AI_ENQUIRY_TRIAGE=1.
 */

const OPTIONS = [
  { value: false, label: "Off" },
  { value: true, label: "On" },
];

function switchFlag(key: string, description: string) {
  if (process.env.FLAGS) return flag<boolean>({ key, description, defaultValue: false, options: OPTIONS, adapter: vercelAdapter() });
  const envKey = `FLAG_${key.toUpperCase().replaceAll("-", "_")}`;
  return flag<boolean>({ key, description, defaultValue: false, options: OPTIONS, decide: () => process.env[envKey] === "1" });
}

/** Jev reads each new enquiry and can raise its severity (lib/crm/triage.ts). */
export const aiEnquiryTriage = switchFlag("ai-enquiry-triage", "Jev reads new enquiries and can raise their severity, never lower it.");

/** Jev checks each applicant against the opening's must-haves and scores fit. */
export const aiApplicantScreen = switchFlag("ai-applicant-screen", "Jev checks applicants against the opening's must-haves and scores their fit.");

/** Jev checks every outgoing email and broadcast for compliance risks before it sends. */
export const aiComplianceGate = switchFlag("ai-compliance-gate", "Jev holds outgoing emails that promise returns, skip disclaimers or send AIF material to non-holders.");

/** Haiku reads uploaded resumes into the apply form's fields. */
export const aiResumeParse = switchFlag("ai-resume-parse", "Haiku reads an uploaded resume into the apply form's fields.");

/** Opus writes reply drafts, briefs and compliance fixes when staff ask. */
export const aiDrafts = switchFlag("ai-drafts", "Opus drafts replies, person briefs and compliance fixes when staff click for one.");

/** Keeps an anonymous ID in the visitor's browser so their page views join their record once they enquire. */
export const analyticsVisitorId = switchFlag("analytics-visitor-id", "Keeps an anonymous ID in the visitor's browser so pages read before an enquiry show on their record.");
