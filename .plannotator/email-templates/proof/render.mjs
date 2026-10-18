// Proof only: bundles emails.tsx with esbuild, renders each email to HTML and
// plain text with react-email's render, and writes out/<id>.html, .txt and the
// "current" versions (today's lib/crm/mail.ts layout and the plain-text sends).
// Run from the repo root: node .plannotator/email-templates/proof/render.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const here = path.join(root, ".plannotator/email-templates/proof");
const out = path.join(here, "out");
const store = path.join(root, "node_modules/.pnpm/node_modules");
const require = createRequire(path.join(store, "noop.js"));
const esbuild = require(path.join(root, "node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild"));

mkdirSync(out, { recursive: true });
const bundle = path.join(out, ".emails.mjs");
await esbuild.build({
  entryPoints: [path.join(here, "entry.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  outfile: bundle,
  nodePaths: [store, path.join(root, "node_modules")],
  banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
  logLevel: "warning",
});
const { EMAILS, render, createElement } = await import(`${pathToFileURL(bundle).href}?t=${Date.now()}`);

for (const email of EMAILS) {
  const element = createElement(email.Component);
  writeFileSync(path.join(out, `${email.id}.html`), await render(element));
  writeFileSync(path.join(out, `${email.id}.txt`), await render(element, { plainText: true }));
}

// Today's output, for the before column. emailHtml is copied from lib/crm/mail.ts.
const escape = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const emailHtml = (t, office) =>
  `<!doctype html><html><body style="margin:0;background:#ffffff"><div style="max-width:560px;margin:0 auto;padding:32px 24px;font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111111">${t.trim().split(/\n{2,}/).map((p) => `<p style="margin:0 0 16px">${escape(p).replace(/\n/g, "<br>")}</p>`).join("")}<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e5e5e5;font-size:12px;color:#737373">${escape(office)}</p></div></body></html>`;
const plain = (t) => `<!doctype html><html><body style="margin:0;background:#fff"><pre style="margin:0;padding:24px;font:14px/1.5 -apple-system,Helvetica,Arial,sans-serif;white-space:pre-wrap;color:#111">${escape(t)}</pre></body></html>`;
const current = {
  "enquiry-received": emailHtml("Hello Rohan,\n\nThank you for writing to Moneybee. Your reference is ENQ-00042. Someone from our team will reply to this address.\n\nIf it is urgent, call us on 022-4030 2080.\n\nMoneybee", "Moneybee Group, 303, Tower A, Peninsula Business Park, G.K. Marg, Lower Parel, Mumbai 400013"),
  "sign-in-code": plain("482913 is your code to sign in to the Moneybee investor portal. It expires in 10 minutes.\n\nIf you did not just try to sign in, change your password from the sign-in page."),
  "staff-new-enquiry": plain("PMS enquiry from Rohan Mehta (ENQ-00042).\n\nWhy it is high:\n- PMS ticket above Rs. 5 crore.\n\nPlaybook: Large PMS investor\n\nOpen it: https://www.moneybee.in/admin/inbox/42"),
};
for (const [id, html] of Object.entries(current)) writeFileSync(path.join(out, `${id}.current.html`), html);
console.log("rendered", EMAILS.map((e) => e.id).join(", "));
