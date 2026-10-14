import config from "@payload-config";
import { flag } from "flags/next";
import { getPayload } from "payload";
import { cache } from "react";
import type { CrmSetting } from "@/payload-types";

/*
 * Switches for everything that sends personal data to an AI model or keeps an
 * ID in a visitor's browser (user, 2026-10-12). All start off. Staff flip them
 * in /admin › Desk settings (globals/CrmSettings.ts, user, 2026-10-14:
 * "where are the ai toggles"); compliance owns that screen. On a laptop,
 * FLAG_<KEY>=1 in the environment also turns one on, e.g.
 * FLAG_AI_ENQUIRY_TRIAGE=1.
 */

const OPTIONS = [
  { value: false, label: "Off" },
  { value: true, label: "On" },
];

/** Desk settings, read once per request. Without a database every switch is off. */
const settings = cache(async (): Promise<CrmSetting | null> => {
  if (!process.env.DATABASE_URL) return null;
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });
});

function switchFlag(key: string, description: string, read: (settings: CrmSetting) => boolean | null | undefined) {
  const envKey = `FLAG_${key.toUpperCase().replaceAll("-", "_")}`;
  return flag<boolean>({
    key,
    description,
    defaultValue: false,
    options: OPTIONS,
    decide: async () => {
      if (process.env[envKey] === "1") return true;
      const current = await settings();
      return Boolean(current && read(current));
    },
  });
}

/** Jev reads each new enquiry and can raise its severity (lib/crm/triage.ts). */
export const aiEnquiryTriage = switchFlag("ai-enquiry-triage", "Jev reads new enquiries and can raise their severity, never lower it.", (s) => s.ai?.triage);

/** Jev checks each applicant against the opening's must-haves and scores fit. */
export const aiApplicantScreen = switchFlag("ai-applicant-screen", "Jev checks applicants against the opening's must-haves and scores their fit.", (s) => s.ai?.applicantScreen);

/** Jev checks every outgoing email and broadcast for compliance risks before it sends. */
export const aiComplianceGate = switchFlag("ai-compliance-gate", "Jev holds outgoing emails that promise returns, skip disclaimers or send AIF material to non-holders.", (s) => s.ai?.complianceGate);

/** Haiku reads uploaded resumes into the apply form's fields. */
export const aiResumeParse = switchFlag("ai-resume-parse", "Haiku reads an uploaded resume into the apply form's fields.", (s) => s.ai?.resumeReading);

/** Opus writes reply drafts, briefs and compliance fixes when staff ask. */
export const aiDrafts = switchFlag("ai-drafts", "Opus drafts replies, person briefs and compliance fixes when staff click for one.", (s) => s.ai?.drafts);

/** Keeps an anonymous ID in the visitor's browser so their page views join their record once they enquire. */
export const analyticsVisitorId = switchFlag("analytics-visitor-id", "Keeps an anonymous ID in the visitor's browser so pages read before an enquiry show on their record.", (s) => s.visitorId);
