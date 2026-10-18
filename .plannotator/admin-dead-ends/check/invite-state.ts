// Local check of a portal invitation: the account, its link's expiry, the person's tie to it, and the timeline line.
// Writes the set-password token to /tmp/mb-check/invite-token.txt for the browser check; prints nothing secret.
// Run: npx payload run .plannotator/admin-dead-ends/check/invite-state.ts
import { writeFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const person = await payload.findByID({ collection: "contacts", id: 4, depth: 0, overrideAccess: true });
const investorId = typeof person.investor === "object" ? person.investor?.id : person.investor;
const investor = await payload.findByID({ collection: "investors", id: investorId as number, depth: 0, overrideAccess: true, showHiddenFields: true });
const days = (new Date(investor.resetPasswordExpiration as string).getTime() - Date.now()) / 86_400_000;
console.log({ linked: Boolean(investorId), status: investor.status, invitedAt: Boolean(investor.invitedAt), invitedBy: investor.invitedBy, lastSignInAt: investor.lastSignInAt ?? null, linkDaysLeft: days.toFixed(2), hasToken: Boolean(investor.resetPasswordToken) });
writeFileSync("/tmp/mb-check/invite-token.txt", String(investor.resetPasswordToken ?? ""));
const line = await payload.find({ collection: "activities", where: { contact: { equals: 4 }, summary: { like: "invited them" } }, limit: 1, depth: 0, overrideAccess: true });
console.log("timeline:", line.docs[0]?.summary, "|", line.docs[0]?.body);
const emails = await payload.count({ collection: "emails", where: { subject: { like: "investor portal account" } }, overrideAccess: true });
console.log("kept as CRM email rows (must be 0):", emails.totalDocs);
process.exit(0);
