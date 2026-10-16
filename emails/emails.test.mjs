// Run with: node --test emails/emails.test.mjs
// Renders every email in the catalogue (emails/index.tsx) from its sample and
// checks what a reader would catch: an unfilled {{field}}, an em dash,
// returns without their disclosure, a missing subject or plain-text version.
// Width on phones is checked in a browser, not here.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// esbuild comes with react-email, a direct dependency, so the test needs nothing extra.
const esbuild = createRequire(createRequire(path.join(root, "package.json")).resolve("react-email"))("esbuild");
const outdir = path.join(root, "node_modules/.cache/emails-test");
mkdirSync(outdir, { recursive: true });
const outfile = path.join(outdir, "catalogue.mjs");
await esbuild.build({
  entryPoints: [path.join(root, "emails/test-entry.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  outfile,
  external: ["react", "react-dom", "react-email"],
  logLevel: "error",
});
const { CATALOGUE, GROUPS, compose, mergeFields, renderEmail, STARTER_TEMPLATES } = await import(pathToFileURL(outfile).href);

test("the catalogue lists every group and unique ids", () => {
  assert.deepEqual([...new Set(CATALOGUE.map((entry) => entry.group))], [...GROUPS]);
  assert.equal(new Set(CATALOGUE.map((entry) => entry.id)).size, CATALOGUE.length);
});

test("every merge field a template uses is one its email fills", () => {
  for (const entry of CATALOGUE.filter((item) => item.template)) {
    const known = new Set(mergeFields(entry).map(({ key }) => key));
    const { subject, body } = STARTER_TEMPLATES[entry.template];
    for (const [, key] of `${subject} ${body}`.matchAll(/\{\{\s*(\w+)\s*\}\}/g)) assert.ok(known.has(key), `${entry.id} uses {{${key}}}, which nothing fills`);
  }
});

for (const entry of CATALOGUE) {
  test(`${entry.group}: ${entry.name}`, async () => {
    const { subject, element } = compose(entry);
    const { html, text } = await renderEmail(element, "https://www.moneybee.in");
    assert.ok(subject.trim(), "has a subject");
    assert.ok(text.trim().length > 100, "has a plain-text version");
    for (const [label, body] of [["subject", subject], ["html", html], ["text", text]]) {
      assert.doesNotMatch(body, /\{\{\s*\w+\s*\}\}/, `no unfilled merge field in the ${label}`);
      assert.doesNotMatch(body, /\u2014/, `no em dash in the ${label}`);
    }
    assert.doesNotMatch(html, /(href|src)="\/(?!\/)/, "every link and image is absolute");
    assert.doesNotMatch(html, /data-absolute-text="true">\/(?!\/)/, "a link written out as text is absolute");
    assert.doesNotMatch(text, /(^|[\s[(])\/(admin|portal|investor-centre|contact|email|pms|aif)\b/m, "the plain text has no relative links");
    if (/Difference \(pts\)/.test(html)) assert.match(html, /not verified|has not been independently verified/, "returns carry their disclosure");
    if (entry.channel === "mailing") assert.ok(entry.needs, "a mailing says what it waits on");
    if (entry.channel === "here") assert.ok(entry.template && entry.fields?.length, "an email sent from the page has words to edit and facts to fill");
  });
}
