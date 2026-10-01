import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { ENQUIRIES, EMAIL, enquiryFromParam, enquiryMailto } from "../../../lib/contact-v2.ts";
import { DOCUMENT_GROUPS, NOT_YET_PUBLISHED } from "../../../lib/investor-centre.ts";

const base = "https://moneybees.localhost:1355";
const evidence = [];
function browser(...args) {
  const process = spawnSync("agent-browser", ["--session", "pi-service", "--ignore-https-errors", ...args, "--json"], { encoding: "utf8", timeout: 35000 });
  assert.equal(process.status, 0, `${args.join(" ")}: ${process.stderr || process.stdout}`);
  const response = JSON.parse(process.stdout);
  assert.equal(response.success, true, response.error);
  return response.data;
}
const evaluate = (js) => browser("eval", js).result;
const wait = (js) => browser("wait", "--fn", js);
const settled = "document.getAnimations().every(a => a.effect.getTiming().iterations === Infinity || a.playState === 'finished')";
function open(path) {
  browser("open", `${base}${path}`);
  wait("document.fonts.status === 'loaded' && !!document.querySelector('main h1')");
  browser("snapshot", "-i");
}
function check(name, result) {
  assert.ok(result, name);
  evidence.push({ check: name, passed: true });
  writeFileSync(".plannotator/batch1/service/verification.json", `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`PASS ${name}`);
}

// Compare retained panel dimensions and timing to the pinned source, not a screenshot estimate.
const sourceCSS = readFileSync("reference/tresmares/source/style.pretty.css", "utf8");
const sourceJS = readFileSync("reference/tresmares/source/app.pretty.js", "utf8");
const component = readFileSync("components/investor-v3/investor-sections.tsx", "utf8");
const panelWidth = sourceCSS.match(/\.offcanvas>\.content \{[^}]*width: ([\d.]+)vw/)[1];
check("Pinned off-canvas width retained", component.includes(`w-[${panelWidth}vw]`));
check("Pinned backdrop retained", sourceCSS.includes("background: rgba(0, 0, 0, .7)") && component.includes("background:rgba(0,0,0,.7)"));
check("Pinned expoOut retained", sourceCSS.includes("cubic-bezier(0.16, 1, 0.3, 1)") && component.includes("cubic-bezier(.16,1,.3,1)"));
const sourcePanel = sourceJS.slice(sourceJS.indexOf('key: "openOffcanvas"'));
check("Pinned 800ms off-canvas timing retained", /duration: \.8/.test(sourcePanel) && component.includes("transform .8s"));
check("Pinned card scale and duration retained", /scale: \.96/.test(sourceJS) && component.includes("scale(.96)") && component.includes("transform 2s"));
check("Pinned card positional delay retained", sourceJS.includes("delay: 25e-5 *") && component.includes("getBoundingClientRect().left) * .25"));

for (const enquiry of ENQUIRIES) {
  const values = { name: "Preview QA", email: "qa@example.com", phone: "1234567890", message: "Preview only: A&B / enquiry", ...Object.fromEntries(enquiry.fields.filter(field => field.options).map(field => [field.name, field.options[0]])) };
  const href = new URL(enquiryMailto(enquiry, values));
  check(`${enquiry.id}: mailto recipient, encoded subject and body`, href.pathname === EMAIL && href.searchParams.get("subject") === `${enquiry.name} from Preview QA` && href.searchParams.get("body").includes(values.message));
  check(`${enquiry.id}: parameter selects its option`, enquiryFromParam(enquiry.id) === enquiry.id);
}
check("Unknown parameter falls back", enquiryFromParam("not-an-option") === null);

for (const width of [1440, 390]) {
  browser("set", "viewport", String(width), width === 1440 ? "900" : "844");
  open("/preview/contact?enquiry=aif");
  wait("!!document.querySelector('[role=tab][aria-selected=true]') && document.querySelector('[role=tab][aria-selected=true]').textContent.trim() === 'AIF Enquiry'");
  browser("scrollintoview", "#enquiry");
  browser("fill", "input[name=name]", "Preview QA");
  browser("fill", "input[name=email]", "qa@example.com");
  browser("find", "role", "tab", "click", "--name", "PMS Enquiry");
  check(`${width}: values survive tab switches`, evaluate("document.querySelector('input[name=name]').value === 'Preview QA' && document.querySelector('input[name=email]').value === 'qa@example.com'"));
  browser("press", "ArrowLeft");
  check(`${width}: arrow wraps to General Enquiry`, evaluate("document.activeElement.getAttribute('role') === 'tab' && document.activeElement.textContent.trim() === 'General Enquiry'"));
  browser("press", "Home");
  check(`${width}: Home selects PMS`, evaluate("document.activeElement.textContent.trim() === 'PMS Enquiry'"));
  browser("press", "End");
  check(`${width}: End selects General Enquiry`, evaluate("document.activeElement.textContent.trim() === 'General Enquiry'"));
  for (const enquiry of ENQUIRIES) {
    browser("find", "role", "tab", "click", "--name", enquiry.name);
    browser("snapshot", "-i");
    check(`${width}: ${enquiry.id} fields match data`, evaluate(`JSON.stringify([...document.querySelectorAll('form [name]')].map(el => el.name)) === ${JSON.stringify(JSON.stringify(enquiry.fields.map(field => field.name)))}`));
  }
  const tabRows = evaluate("new Set([...document.querySelectorAll('[role=tab]')].map(el => Math.round(el.getBoundingClientRect().top))).size");
  check(`${width}: enquiry tab row count`, tabRows === (width === 1440 ? 1 : 2));
  browser("find", "role", "button", "click", "--name", "Get Started", "--exact");
  check(`${width}: incomplete form stays on page`, evaluate("document.querySelector('textarea[name=message]').validity.valueMissing && location.pathname === '/preview/contact'"));
  browser("find", "role", "button", "click", "--name", `Copy ${EMAIL}`);
  wait("document.querySelector('[role=status]').textContent === 'Copied'");
  check(`${width}: email copy confirms success`, evaluate("document.querySelector('[role=status]').textContent === 'Copied'"));
  check(`${width}: contact has no horizontal overflow`, evaluate("document.documentElement.scrollWidth === innerWidth"));
  wait(settled);

  open("/preview/investor-centre");
  check(`${width}: two separate login cards`, evaluate("document.querySelectorAll('#logins article').length === 2 && document.querySelectorAll('#logins a').length === 1 && document.querySelectorAll('#logins [aria-disabled=true]').length === 1"));
  check(`${width}: all group anchors exist`, evaluate(`${JSON.stringify(DOCUMENT_GROUPS.map(group => group.id))}.every(id => !!document.getElementById(id))`));
  for (const group of DOCUMENT_GROUPS) {
    open("/preview/investor-centre");
    for (const document of group.documents) {
      browser("find", "role", "button", "click", "--name", document.title, "--exact");
      wait("document.querySelector('dialog').open");
      browser("snapshot", "-i");
      check(`${width}: ${document.id} opens correct details`, evaluate(`document.querySelector('#document-panel-title').textContent === ${JSON.stringify(document.title)} && document.querySelector('#document-panel-status').textContent === ${JSON.stringify(NOT_YET_PUBLISHED)}`));
      browser("press", "Tab");
      check(`${width}: ${document.id} forward focus trap`, evaluate("document.activeElement.getAttribute('aria-label') === 'Close document details'"));
      browser("press", "Shift+Tab");
      check(`${width}: ${document.id} reverse focus trap`, evaluate("document.activeElement.getAttribute('aria-label') === 'Close document details'"));
      if (document.id === "policies") browser("find", "role", "button", "click", "--name", "Close document details");
      else browser("press", "Escape");
      wait(`!document.querySelector('dialog').open && document.activeElement.textContent.trim() === ${JSON.stringify(document.title)} && document.body.style.overflow === ''`);
      check(`${width}: ${document.id} returns focus and unlocks scrolling`, true);
      wait(settled);
      browser("snapshot", "-i");
    }
  }
  wait(settled);
  check(`${width}: missing documents have no file links`, evaluate("document.querySelectorAll('#documents a').length === 0 && document.querySelectorAll('#documents button:disabled').length === 22"));
  check(`${width}: investor has no horizontal overflow`, evaluate("document.documentElement.scrollWidth === innerWidth"));
}

browser("set", "media", "light", "reduced-motion");
open("/preview/investor-centre");
check("Reduced motion keeps offscreen cards fully visible", evaluate("[...document.querySelectorAll('.service-document-card')].every(el => getComputedStyle(el).opacity === '1' && getComputedStyle(el).transform === 'none')"));
browser("find", "role", "button", "click", "--name", "PMS Disclosure Document", "--exact");
wait("document.querySelector('dialog').open");
check("Reduced motion removes panel travel", evaluate("getComputedStyle(document.querySelector('dialog')).transitionDuration === '0s'"));
browser("press", "Escape");
wait("!document.querySelector('dialog').open");
writeFileSync(".plannotator/batch1/service/verification.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`${evidence.length} focused source, data and browser checks passed.`);
