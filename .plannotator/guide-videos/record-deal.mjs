// Proof recording for the Guide videos: a deal from Contacted to Invested,
// shown as Asha Rao (sales) on Ananya Bose's demo deal. Resets the demo data,
// records with Agent Browser's pointer overlay, and writes WebVTT captions
// from the time each step really started.
// Needs the `guide-rec` session signed in as asha.sales@moneybee.local.
// Run: node .plannotator/guide-videos/record-deal.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(here, "out");
const name = "deal-lifecycle";
const site = "https://moneybees.localhost:1355";
mkdirSync(out, { recursive: true });

const ab = (...args) => execFileSync("agent-browser", ["--session", "guide-rec", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

/** Each step: the caption shown while it happens, what to do, and how long to hold after. */
const STEPS = [
  { caption: "Deals shows every prospective investment by stage. This is the PMS board.", hold: 3500 },
  { caption: "The line under the title adds up the open deals and counts the ones with nothing planned.", run: [["find", "text", "open PMS", "hover"]], hold: 3500 },
  { caption: "Ananya Bose: Rs. 2 crore, three days at Contacted, and No next step in amber.", run: [["hover", "article[aria-label^='Ananya']"]], hold: 4000 },
  { caption: "To move a deal, hover its card and press Move. You can also click the card and press M.", run: [["click", "button[aria-label='Move Ananya Bose']"]], hold: 3000 },
  { caption: "Pick the stage it has reached. Meeting asks one thing first.", run: [["find", "role", "menuitemradio", "hover", "--name", "Meeting"]], hold: 2000, then: [["find", "role", "menuitemradio", "click", "--name", "Meeting"]] },
  { caption: "When and where. The time starts on the next working day at 11:00.", run: [["click", "input[placeholder^='At the office']"], ["type", "input[placeholder^='At the office']", "At the office, Lower Parel"]], hold: 2500 },
  { caption: "Leave Then write the Meeting confirmation ticked, and press Move to Meeting.", run: [["find", "role", "button", "hover", "--name", "Move to Meeting"]], hold: 2500, then: [["find", "role", "button", "click", "--name", "Move to Meeting"], ["wait", "--url", "**/admin/people/**"], ["wait", "--load", "networkidle"]] },
  { caption: "Her page opens with the Meeting confirmation already written, the time and place filled in.", run: [["find", "text", "Meeting confirmation", "hover"]], hold: 4500 },
  { caption: "The meeting is in her tasks now, so the deal has a next step.", run: [["find", "text", "Meeting, At the office", "hover"]], hold: 3500 },
  { caption: "Back on the board, her card shows the meeting where No next step was.", run: [["back"], ["wait", "--load", "networkidle"], ["wait", "1000"], ["hover", "article[aria-label^='Ananya']"]], hold: 4000 },
  { caption: "When the money lands, move her to Invested. It asks the amount and the date.", run: [["click", "button[aria-label='Move Ananya Bose']"], ["find", "role", "menuitemradio", "click", "--name", "Invested"]], hold: 3500 },
  { caption: "Operations see one more box here: Invite to the portal. Press Move to Invested.", run: [["find", "role", "button", "hover", "--name", "Move to Invested"]], hold: 3500, then: [["find", "role", "button", "click", "--name", "Move to Invested"], ["wait", "--url", "**/admin/people/**"], ["wait", "--load", "networkidle"]] },
  { caption: "For a PMS client the Welcome letter opens next, with the account date filled in.", run: [["find", "text", "Welcome, PMS account opened", "hover"]], hold: 4000 },
  { caption: "Every move is a line on her timeline, with who made it.", run: [["scroll", "down", "520"], ["wait", "800"], ["find", "text", "moved the deal to Invested", "hover"]], hold: 4500 },
];

const stamp = (ms) => {
  const t = Math.max(0, ms);
  const h = String(Math.floor(t / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((t % 3_600_000) / 60_000)).padStart(2, "0");
  const s = String(Math.floor((t % 60_000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}.${String(Math.floor(t % 1000)).padStart(3, "0")}`;
};

execFileSync("npx", ["payload", "run", ".plannotator/guide-videos/demo-reset.ts"], { cwd: root, stdio: "ignore" });
ab("open", `${site}/admin/deals`);
ab("wait", "--load", "networkidle");
ab("mouse", "move", "720", "60");
await wait(800);

const video = resolve(out, `${name}.mp4`);
ab("record", "start", video, "--cursor");
const start = Date.now();
const cues = [];
try {
  for (const step of STEPS) {
    const at = Date.now() - start;
    for (const command of step.run ?? []) ab(...command);
    await wait(step.hold);
    for (const command of step.then ?? []) ab(...command);
    cues.push({ at, caption: step.caption });
  }
  await wait(600);
} finally {
  ab("record", "stop");
}
const end = Date.now() - start;
const vtt = ["WEBVTT", "", ...cues.flatMap((cue, index) => [`${index + 1}`, `${stamp(cue.at)} --> ${stamp(cues[index + 1]?.at ?? end)}`, cue.caption, ""])].join("\n");
writeFileSync(resolve(out, `${name}.vtt`), vtt);
writeFileSync(resolve(out, `${name}.chapters.json`), JSON.stringify(cues.map((cue) => ({ at: Math.round(cue.at / 100) / 10, caption: cue.caption })), null, 2));
console.log(`recorded ${name}: ${(end / 1000).toFixed(1)}s, ${cues.length} captions`);
