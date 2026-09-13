import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const referenceCss = readFileSync("reference/medusmo/site.css", "utf8");
const referenceMotion = readFileSync("reference/medusmo/site-motion.js", "utf8");
const css = readFileSync("app/preview/homepage/home-story.module.css", "utf8");
const component = readFileSync("app/preview/homepage/home-story.tsx", "utf8");
for (const value of ["grid-template-columns:1.25fr 1fr", "height:100vh", "position:sticky", "max-width:26.5rem", ".4s cubic-bezier(.445,.05,.55,.95)"]) {
  assert(referenceCss.includes(value), `Not in pinned CSS: ${value}`);
  assert(css.includes(value), `Preview drift: ${value}`);
}
assert(referenceMotion.includes("scale: 1.2") && component.includes("scale: 1.2"));
assert(referenceMotion.includes("scrub: true") && component.includes("scrub: true"));
console.log("Retained source values verified: split, sticky height, text width, easing, image scale and scroll scrub.");
console.log("Intentional differences: Moneybee copy, font, black background, image crops; clip-path wipe replaces height wipe.");
