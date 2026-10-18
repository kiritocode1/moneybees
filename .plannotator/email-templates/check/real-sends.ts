/*
 * Check only. Runs the real follow-ups (lib/crm/enquiries.ts followUp,
 * lib/hiring/apply.ts followUpApplication) on a fresh local QA enquiry and
 * application, and writes out exactly what would have gone to Resend and to
 * Payload's sendEmail. Nothing is sent: the Resend key is fake and fetch to
 * api.resend.com is answered here. Run: npx payload run .plannotator/email-templates/check/real-sends.ts
 */
import React from "react";
import { writeFileSync } from "node:fs";
import path from "node:path";

// payload run compiles TSX with the classic runtime, which expects React in scope.
(globalThis as { React?: typeof React }).React = React;
process.env.RESEND_API_KEY = "re_check_not_real";

const out = path.resolve(".plannotator/email-templates/verify/real");
let n = 0;
const save = (label: string, email: { subject?: string; html?: string; text?: string; to?: unknown }) => {
  n += 1;
  const base = `${String(n).padStart(2, "0")}-${label}`;
  writeFileSync(path.join(out, `${base}.html`), email.html ?? "");
  writeFileSync(path.join(out, `${base}.txt`), `To: ${JSON.stringify(email.to)}\nSubject: ${email.subject}\n\n${email.text ?? ""}`);
  console.log("captured", base, "|", email.subject);
};

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.includes("api.resend.com")) {
    save("resend", JSON.parse(String(init?.body ?? "{}")));
    return new Response(JSON.stringify({ id: `check-${n}` }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return realFetch(input, init);
}) as typeof fetch;

const { getPayload } = await import("payload");
const config = (await import("@payload-config")).default;
const payload = await getPayload({ config });
payload.sendEmail = (async (message: { subject?: string; html?: string; text?: string; to?: unknown }) => save("staff", message)) as typeof payload.sendEmail;

const { receiveEnquiry, followUp } = await import("@/lib/crm/enquiries");
const enquiry = await receiveEnquiry("pms", { name: "Check Enquirer", email: "check.enquirer@moneybee.local", phone: "+91 98200 00000", amount: "Above 5 crore", city: "Pune", message: "Checking the new emails: how often do you report, and can I see the stocks in my own demat?" }, { page: "/pms" });
if (!enquiry.ok) throw new Error(enquiry.error);
await followUp(enquiry.id, { siteOrigin: "https://moneybees.localhost:1355", aiTriage: false });

const { receiveApplication, followUpApplication } = await import("@/lib/hiring/apply");
const application = await receiveApplication(
  { role: "", team: "research", fields: { name: "Check Applicant", email: "check.applicant@moneybee.local", phone: "+91 98200 00001", city: "Mumbai", why: "Checking the new emails.", experience: "Five years of equity research.", notice: "30", consent: "yes" }, mustHaves: [], resume: null },
  {},
);
if (!application.ok) throw new Error(application.error);
await followUpApplication(application.id, { siteOrigin: "https://moneybees.localhost:1355", aiScreen: false });

// The fake Resend answered "sent"; put the rows back to what really happened.
const { docs } = await payload.find({ collection: "emails", where: { resendId: { like: "check-" } }, limit: 50, depth: 0, overrideAccess: true });
for (const row of docs) await payload.update({ collection: "emails", id: row.id, overrideAccess: true, data: { status: "logged", resendId: null } });
console.log("enquiry", enquiry.reference, "application", application.reference, "reset", docs.length);
process.exit(0);
