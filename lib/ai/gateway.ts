/*
 * Which model does what, through Vercel AI Gateway (user, 2026-10-12):
 *   decide  - Jev answers typed questions with probabilities: severity,
 *             complaint, must-haves, compliance risks. Runs on every record.
 *   extract - Haiku turns a resume into fields. Runs on every upload.
 *   write   - Opus drafts replies and briefs, only when someone asks.
 * Fable is left out: it cannot run under zero data retention, and every
 * prompt here carries personal data. Ids are the gateway's (dots, not
 * dashes); https://ai-gateway.vercel.sh/v1/models lists them.
 */
export const MODELS = {
  decide: "typesafe-ai/jev",
  extract: "anthropic/claude-haiku-5.5",
  write: "anthropic/claude-opus-5.5",
} as const;

/** The features spend is reported by, as gateway tags. */
export type AiFeature = "enquiry-triage" | "applicant-screen" | "compliance-gate" | "resume-parse" | "drafts";

/**
 * Gateway options every call sends: only providers with a zero data
 * retention agreement, and the staff member and feature for the spend report.
 * Locally the gateway authenticates with VERCEL_OIDC_TOKEN from `vercel env
 * pull`; on Vercel it is automatic.
 */
export function gatewayOptions(feature: AiFeature, userId?: string | number) {
  return {
    gateway: {
      zeroDataRetention: true,
      tags: [`feature:${feature}`],
      ...(userId === undefined ? {} : { user: `staff-${userId}` }),
    },
  };
}
