/*
 * Check only. Makes a local QA investor (login written to
 * /tmp/moneybee-investor-login.txt, mode 600), then runs Payload's own
 * forgotPassword for that investor and for the QA admin, capturing the HTML
 * the auth.forgotPassword hooks produce. Nothing is sent.
 * Run: npx payload run .plannotator/email-templates/check/password-emails.ts
 */
import React from "react";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

(globalThis as { React?: typeof React }).React = React;
const out = path.resolve(".plannotator/email-templates/verify/real");
const { getPayload } = await import("payload");
const config = (await import("@payload-config")).default;
const payload = await getPayload({ config });
const captured: { subject?: string; html?: string }[] = [];
const capture = (async (message: { subject?: string; html?: string }) => void captured.push(message)) as typeof payload.sendEmail;
payload.sendEmail = capture;
// forgotPassword calls the adapter itself.
if (payload.email) payload.email.sendEmail = capture;

const login = "/tmp/moneybee-investor-login.txt";
const email = "qa.investor@moneybee.local";
const { totalDocs } = await payload.count({ collection: "investors", where: { email: { equals: email } }, overrideAccess: true });
if (!totalDocs) {
  const password = randomBytes(12).toString("base64url");
  await payload.create({ collection: "investors", overrideAccess: true, data: { name: "QA Investor", email, password, status: "active" } });
  writeFileSync(login, `${email}\n${password}\n`, { mode: 0o600 });
}
if (!existsSync(login)) throw new Error("QA investor exists but its login file is missing");

await payload.forgotPassword({ collection: "investors", data: { email }, context: { origin: "https://moneybees.localhost:1355" }, disableEmail: false });
const admin = readFileSync("/tmp/moneybee-qa-login.txt", "utf8").split("\n")[0];
await payload.forgotPassword({ collection: "users", data: { email: admin }, disableEmail: false });

captured.forEach((message, i) => {
  writeFileSync(path.join(out, `0${5 + i}-reset.html`), message.html ?? "");
  console.log("captured", `0${5 + i}-reset`, "|", message.subject, "|", (message.html ?? "").length, "chars");
});
process.exit(0);
