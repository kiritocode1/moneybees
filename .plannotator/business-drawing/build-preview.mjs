import { readFileSync, writeFileSync } from "node:fs";
import { render } from "./plate.mjs";
const html = readFileSync("preview.html", "utf8");
const sample = JSON.parse(readFileSync("tejas.json", "utf8"));
// Replace each rendered sample plate (ids tj and tj2) with a fresh render.
const swap = (src, id) => src.replace(new RegExp(`<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">\\n<defs><pattern id="${id}-hatch"[\\s\\S]*?</svg>`), render(sample, id));
writeFileSync("preview.html", swap(swap(html, "tj"), "tj2"));
console.log("rebuilt");
