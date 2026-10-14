#!/usr/bin/env node
/**
 * Retakes the pictures in /admin/guide (guide-legible plan, approved
 * 2026-10-14) from the running admin, and measures where each numbered
 * control sits, so the rings and numbers follow the screens when they change.
 *
 *   node scripts/guide-shots.mjs [--base https://moneybees.localhost:1355] [--session site] [--only screen-team,how-undo-1]
 *
 * Drives agent-browser. The session must already be signed in to /admin as an
 * admin, or GUIDE_EMAIL and GUIDE_PASSWORD must be set for it to sign in.
 * Use the local QA data, never real clients: the pictures are public files.
 * Writes public/admin-guide/<id>.webp and lib/admin/guide-shots.json, which
 * components/admin/guide reads.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FACT_SHEET_SCREEN, HOW_TO } from "../lib/admin/guide-how-to.ts";
import { SCREENS } from "../lib/admin/screens.ts";

const args = Object.fromEntries(process.argv.slice(2).flatMap((arg, i, all) => (arg.startsWith("--") ? [[arg.slice(2), all[i + 1]]] : [])));
const BASE = args.base ?? "https://moneybees.localhost:1355";
const SESSION = args.session ?? "site";
const ONLY = args.only?.split(",");
const OUT = "public/admin-guide";
const JSON_OUT = "lib/admin/guide-shots.json";
const TMP = join(tmpdir(), "guide-shots");

/** Lists that can be dragged into order only show the handles when sorted by that order. */
const ORDERED = "?sort=_order";

/** Clicks some screens need before their picture. */
const SETUP = { officeDetails: ["click text:Office"] };

const SHOTS = [
  {
    id: "sidebar",
    url: "/admin/collections/team-members",
    width: 1440,
    nav: true,
    area: "css:aside.nav",
    until: "css:.nav__link",
    at: [0, 1, 2, 3].map((n) => `css:.nav-group__label@${n}`),
  },
  ...Object.entries(SCREENS).map(([key, screen]) => ({
    id: `screen-${key}`,
    url: screen.controls.some((c) => c.at.includes("td:first-child")) ? `${screen.href}${ORDERED}` : screen.href,
    setup: SETUP[key],
    at: screen.controls.map((c) => c.at),
  })),
  ...HOW_TO.flatMap((task) => task.steps.flatMap((step, n) => (step.shot ? [{ id: `how-${task.key}-${n + 1}`, ...step.shot }] : []))),
  { id: "fact-sheet-screen", ...FACT_SHEET_SCREEN },
];

function browser(...command) {
  return execFileSync("agent-browser", ["--session", SESSION, "--ignore-https-errors", ...command], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

/** Runs `body` in the page with `locate` defined, and returns its JSON result. */
function run(body) {
  const out = JSON.parse(browser("--json", "eval", `(() => { ${LOCATE}\n${body} })()`));
  if (!out.success) throw new Error(out.error ?? "eval failed");
  return out.data.result;
}

/*
 * In the page: finds a control from its `at` (lib/admin/screens.ts) and
 * returns the element and its box in the top page's coordinates, or null.
 */
const LOCATE = String.raw`
const INTERACTIVE = "a,button,input,select,textarea,label,th,[role=button],[role=tab]";
const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
const words = (el) => (el.innerText || "").replace(/\s+/g, " ").trim();
const innermost = (els) => els.filter((el) => !els.some((other) => other !== el && el.contains(other)));
function locate(spec) {
  let doc = document, scale = 1, ox = 0, oy = 0, s = spec.trim();
  if (s.startsWith("frame:")) {
    const frame = document.querySelector("iframe.iframe-loader__iframe") || document.querySelector("iframe");
    if (!frame || !frame.contentDocument) return null;
    const box = frame.getBoundingClientRect();
    doc = frame.contentDocument; scale = box.width / frame.offsetWidth; ox = box.x; oy = box.y; s = s.slice(6);
  }
  let up = null;
  const caret = s.indexOf(" ^ ");
  if (caret > -1) { up = s.slice(caret + 3); s = s.slice(0, caret); }
  let index = 0;
  const nth = s.match(/@(\d+)$/);
  if (nth) { index = Number(nth[1]); s = s.slice(0, nth.index); }
  // A bare selector, as after frame:, is CSS.
  const prefix = s.match(/^(css|text|has|label):/), kind = prefix ? prefix[1] : "css", arg = prefix ? s.slice(prefix[0].length) : s;
  let found = [];
  if (kind === "css") found = [...doc.querySelectorAll(arg)].filter(visible);
  else if (kind === "label") found = [...doc.querySelectorAll("[aria-label]")].filter((el) => el.getAttribute("aria-label") === arg && visible(el));
  else {
    const hits = [...doc.body.querySelectorAll("*")].filter((el) => (kind === "text" ? words(el) === arg : words(el).includes(arg)) && visible(el));
    const live = hits.filter((el) => el.matches(INTERACTIVE));
    found = innermost(live.length ? live : hits);
  }
  let el = found[index];
  if (el && up) el = el.closest(up);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { el, box: { x: ox + r.x * scale, y: oy + r.y * scale, w: r.width * scale, h: r.height * scale } };
}
`;

/** Waits until every control is on the page, up to 30 seconds: the live preview can take that long the first time. */
function waitFor(at) {
  for (let i = 0; i < 75; i++) {
    if (run(`return ${JSON.stringify(at)}.every((spec) => locate(spec));`)) return;
    execFileSync("sleep", ["0.4"]);
  }
  throw new Error(`not found: ${at.filter((spec) => !run(`return Boolean(locate(${JSON.stringify(spec)}));`)).join(", ")}`);
}

/**
 * Where to crop and where each control sits. The crop takes in the controls
 * with room around them, and is never shorter than 400 so a single control
 * keeps its surroundings.
 */
function measure(shot) {
  return run(`
    const at = ${JSON.stringify(shot.at)};
    const first = locate(at[0]);
    if (first.box.y < 0 || first.box.y + first.box.h > innerHeight) first.el.scrollIntoView({ block: "center" });
    const boxes = at.map((spec) => locate(spec).box);
    const vw = innerWidth, vh = innerHeight;
    let crop;
    if (${JSON.stringify(shot.area ?? null)}) {
      const area = locate(${JSON.stringify(shot.area ?? "")}).box;
      const links = ${JSON.stringify(shot.until ?? null)} ? [...document.querySelectorAll(${JSON.stringify((shot.until ?? "css:x").slice(4))})].filter(visible) : [];
      const bottom = links.length ? Math.max(...links.map((el) => el.getBoundingClientRect().bottom)) + 20 : area.y + area.h;
      crop = { x: area.x, y: area.y, w: area.w, h: Math.min(bottom, vh) - area.y };
    } else {
      const pad = 40, minH = 400;
      // At 1024 a screen keeps its full width and its title. At 1440, the page
      // editor, the picture is one whole side: the preview for anything in
      // it or right of centre, the fields otherwise. Nothing is cut in half.
      const frame = document.querySelector("iframe.iframe-loader__iframe");
      const right = vw > 1024 && (at.some((spec) => spec.startsWith("frame:")) || Math.min(...boxes.map((b) => b.x)) > vw / 2);
      const title = vw <= 1024 ? [...document.querySelectorAll("h1")].find(visible) : null;
      const all = title ? [...boxes, title.getBoundingClientRect()].map((b) => ({ x: b.x, y: b.y, w: b.w ?? b.width, h: b.h ?? b.height })) : boxes;
      let y0 = Math.min(...all.map((b) => b.y)) - pad, y1 = Math.max(...all.map((b) => b.y + b.h)) + pad;
      let x0 = 0, x1 = vw;
      if (vw > 1024) {
        const split = frame ? frame.getBoundingClientRect().x : vw * 0.4;
        if (right) x0 = Math.min(split - 16, Math.min(...boxes.map((b) => b.x)) - pad);
        else x1 = Math.max(split, Math.max(...boxes.map((b) => b.x + b.w)) + pad);
      }
      // Something in the live preview is shown from the top of the preview, with the Desktop and Phone switch above it.
      if (right && frame && at.some((spec) => spec.startsWith("frame:"))) y0 = Math.min(y0, frame.getBoundingClientRect().y - 48);
      // A short crop grows downward, so it still starts at the title or the preview's top.
      if (y1 - y0 < minH) y1 = y0 + minH;
      // A crop that would start inside the top bar starts above it instead.
      if (y0 < 80) { y1 += Math.max(0, -y0); y0 = 0; }
      if (y0 < 0) { y1 -= y0; y0 = 0; } if (y1 > vh) { y0 -= y1 - vh; y1 = vh; } y0 = Math.max(0, y0);
      crop = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
    // Everything a number must not cover: words, fields, buttons and pictures,
    // on the page and inside the live preview.
    const busy = [];
    const collect = (doc, scale, ox, oy) => {
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      const range = doc.createRange();
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        // Words only a screen reader gets sit in a 1px box; they cover nothing.
        const holder = node.parentElement?.getBoundingClientRect();
        if (!node.textContent.trim() || !holder || holder.width <= 2 || holder.height <= 2) continue;
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) busy.push({ x: ox + r.x * scale, y: oy + r.y * scale, w: r.width * scale, h: r.height * scale });
      }
      for (const el of doc.querySelectorAll("input,textarea,select,button,img,svg,[role=button]")) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height) busy.push({ x: ox + r.x * scale, y: oy + r.y * scale, w: r.width * scale, h: r.height * scale });
      }
    };
    collect(document, 1, 0, 0);
    const frame = document.querySelector("iframe.iframe-loader__iframe");
    if (frame?.contentDocument?.body) { const f = frame.getBoundingClientRect(); collect(frame.contentDocument, f.width / frame.offsetWidth, f.x, f.y); }
    const hits = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const inside = (b) => b.x >= crop.x + 2 && b.y >= crop.y + 2 && b.x + b.w <= crop.x + crop.w - 2 && b.y + b.h <= crop.y + crop.h - 2;
    // The number goes beside its ring: left, right, above or below, the first
    // that is inside the picture and clear of everything, else the one that
    // covers least.
    const sides = boxes.map((b, i) => {
      const spots = {
        left: { x: b.x - 35, y: b.y + b.h / 2 - 12 },
        right: { x: b.x + b.w + 11, y: b.y + b.h / 2 - 12 },
        top: { x: b.x + b.w / 2 - 12, y: b.y - 33 },
        bottom: { x: b.x + b.w / 2 - 12, y: b.y + b.h + 9 },
      };
      const others = boxes.filter((_, j) => j !== i);
      const scored = ["left", "right", "top", "bottom"]
        .map((side) => ({ side, m: { ...spots[side], w: 24, h: 24 } }))
        .filter(({ m }) => inside(m) && !others.some((o) => hits(m, o)))
        .map(({ side, m }) => ({ side, covered: busy.reduce((sum, r) => sum + overlap(m, r), 0) }));
      return scored.find((spot) => spot.covered === 0)?.side ?? scored.sort((a, b) => a.covered - b.covered)[0]?.side ?? "left";
    });
    return { vw, crop, boxes, sides };
  `);
}

const pct = (n) => Math.round(n * 10000) / 100;

function take(shot) {
  const at = Array.isArray(shot.at) ? shot.at : [shot.at];
  browser("set", "viewport", String(shot.width ?? 1024), "1000", "2");
  browser("open", `${BASE}${shot.url}`);
  browser("wait", "--load", "networkidle");
  if (run("return location.pathname.startsWith('/admin/login');")) throw new Error("the session is signed out; sign it in to /admin first");
  // The sidebar stays shut except in the picture of the sidebar itself.
  if (run(`return Boolean(document.querySelector(".template-default--nav-open")) !== ${Boolean(shot.nav)};`)) {
    run(`document.querySelector(".nav-toggler").click(); return true;`);
    execFileSync("sleep", ["0.6"]);
  }
  for (const step of shot.setup ?? []) {
    const spec = step.replace(/^click /, "");
    waitFor([spec]);
    run(`locate(${JSON.stringify(spec)}).el.click(); return true;`);
  }
  waitFor(at);
  // The Next.js badge only exists in development.
  run(`document.querySelectorAll("nextjs-portal").forEach((el) => el.style.setProperty("display", "none")); return true;`);
  // Let fades and the live preview's first paint finish.
  execFileSync("sleep", ["0.8"]);
  const { vw, crop, boxes, sides } = measure({ ...shot, at });
  const raw = join(TMP, `${shot.id}.png`);
  browser("screenshot", raw);
  const dpr = Number(execFileSync("magick", ["identify", "-format", "%w", raw], { encoding: "utf8" })) / vw;
  const px = (n) => Math.round(n * dpr);
  execFileSync("magick", [raw, "-crop", `${px(crop.w)}x${px(crop.h)}+${px(crop.x)}+${px(crop.y)}`, "+repage", "-quality", "90", join(OUT, `${shot.id}.webp`)]);
  return {
    src: `/admin-guide/${shot.id}.webp`,
    w: Math.round(crop.w),
    h: Math.round(crop.h),
    marks: boxes.map((b, i) => ({
      x: pct((b.x - crop.x) / crop.w),
      y: pct((b.y - crop.y) / crop.h),
      w: pct(b.w / crop.w),
      h: pct(b.h / crop.h),
      side: sides[i],
    })),
  };
}

function signIn() {
  if (!process.env.GUIDE_EMAIL || !process.env.GUIDE_PASSWORD) return;
  browser("open", `${BASE}/admin/login`);
  browser("wait", "--load", "networkidle");
  browser("fill", "input[name=email]", process.env.GUIDE_EMAIL);
  browser("fill", "input[name=password]", process.env.GUIDE_PASSWORD);
  browser("click", "button[type=submit]");
  browser("wait", "--load", "networkidle");
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
signIn();
const result = ONLY && existsSync(JSON_OUT) ? JSON.parse(readFileSync(JSON_OUT, "utf8")) : {};
const failed = [];
for (const shot of SHOTS) {
  if (ONLY && !ONLY.includes(shot.id)) continue;
  // A second try covers a page that was still settling.
  for (const attempt of [1, 2]) {
    try {
      result[shot.id] = take(shot);
      console.log(`ok   ${shot.id}`);
      break;
    } catch (error) {
      if (attempt === 1) continue;
      failed.push(shot.id);
      console.log(`FAIL ${shot.id}: ${(error.stderr || error.stdout || error.message).toString().slice(-600)}`);
    }
  }
}
if (!ONLY) {
  // A full run drops pictures no shot asks for any more.
  for (const file of readdirSync(OUT)) if (!result[file.replace(/\.webp$/, "")]) rmSync(join(OUT, file));
}
writeFileSync(JSON_OUT, `${JSON.stringify(Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`);
console.log(`${Object.keys(result).length} pictures in ${OUT}${failed.length ? `; failed: ${failed.join(", ")}` : ""}`);
process.exit(failed.length ? 1 : 0);
