#!/usr/bin/env node
/**
 * Records the Guide's videos (guide-videos plan, approved 2026-10-17) from the
 * running admin, as defined in lib/admin/guide-videos.ts.
 *
 *   node scripts/guide-videos.mjs [--only deal-lifecycle,lost-deal] [--base https://moneybees.localhost:1355]
 *
 * For each video: resets the demo people (scripts/guide-demo.ts), signs an
 * Agent Browser session in as the video's role, records the screen with the
 * pointer showing while it runs the steps, and writes captions from the time
 * each step began. The role logins share one password, read from the file in
 * GUIDE_PASSWORD_FILE (default /tmp/moneybee-qa-login.txt, second line) and
 * never printed. Local demo data only: the videos are public files.
 *
 * Writes public/admin-guide/videos/<id>.mp4 (1920 wide), .vtt and .webp, and
 * lib/admin/guide-videos.json with each video's length and chapter times.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GUIDE_VIDEOS } from "../lib/admin/guide-videos.ts";

const args = Object.fromEntries(process.argv.slice(2).flatMap((arg, i, all) => (arg.startsWith("--") ? [[arg.slice(2), all[i + 1]]] : [])));
const BASE = args.base ?? "https://moneybees.localhost:1355";
const ONLY = args.only?.split(",");
const OUT = "public/admin-guide/videos";
const JSON_OUT = "lib/admin/guide-videos.json";
const TMP = join(tmpdir(), "guide-videos");

/** The test login for each role (.plannotator/admin-dead-ends/check/role-logins.ts makes them). */
const LOGINS = { sales: "asha.sales@moneybee.local", operations: "rahul.operations@moneybee.local", compliance: "vikram.compliance@moneybee.local", hr: "meera.hr@moneybee.local", editor: "neha.editor@moneybee.local" };

const password = () => {
  const file = process.env.GUIDE_PASSWORD_FILE ?? "/tmp/moneybee-qa-login.txt";
  const line = existsSync(file) ? readFileSync(file, "utf8").split("\n")[1]?.trim() : undefined;
  if (!line) throw new Error(`no password on the second line of ${file}`);
  return line;
};

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

function browser(session, command) {
  const full = command[0] === "open" && command[1]?.startsWith("/") ? ["open", `${BASE}${command[1]}`] : command;
  return execFileSync("agent-browser", ["--session", session, "--ignore-https-errors", ...full], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

/** Signs the role's session in, unless it already is. */
function signIn(session, role) {
  browser(session, ["set", "viewport", "1440", "900", "2"]);
  browser(session, ["open", "/admin"]);
  browser(session, ["wait", "--load", "networkidle"]);
  if (!browser(session, ["get", "url"]).includes("/admin/login")) return;
  browser(session, ["fill", "input[name=email]", LOGINS[role]]);
  browser(session, ["fill", "input[name=password]", password()]);
  browser(session, ["press", "Enter"]);
  browser(session, ["wait", "--url", "**/admin", "--timeout", "30000"]);
}

const stamp = (ms) => {
  const t = Math.max(0, Math.round(ms));
  const part = (n, size = 2) => String(n).padStart(size, "0");
  return `${part(Math.floor(t / 3_600_000))}:${part(Math.floor((t % 3_600_000) / 60_000))}:${part(Math.floor((t % 60_000) / 1000))}.${part(t % 1000, 3)}`;
};

async function record(video) {
  const session = `guide-${video.role}`;
  execFileSync("npx", ["payload", "run", "scripts/guide-demo.ts"], { env: { ...process.env, GUIDE_DEMO: "1" }, stdio: "ignore" });
  signIn(session, video.role);
  browser(session, ["open", video.start]);
  browser(session, ["wait", "--load", "networkidle"]);
  browser(session, ["mouse", "move", "720", "40"]);
  await wait(800);

  mkdirSync(TMP, { recursive: true });
  const raw = join(TMP, `${video.id}.mp4`);
  rmSync(raw, { force: true });
  browser(session, ["record", "start", raw, "--cursor"]);
  const start = Date.now();
  const starts = [];
  // A step's closing action (a click that changes page) belongs to the next caption, so it starts then.
  let next = null;
  let failed = null;
  try {
    for (const [index, step] of video.steps.entries()) {
      starts.push(next ?? Date.now() - start);
      next = null;
      try {
        for (const command of step.run ?? []) browser(session, command);
        await wait(step.hold ?? 3000);
        if (step.then?.length) next = Date.now() - start;
        for (const command of step.then ?? []) browser(session, command);
      } catch (error) {
        failed = `step ${index + 1} ("${step.caption.slice(0, 50)}"): ${String(error.stderr ?? error.message).trim().split("\n")[0]}`;
        break;
      }
    }
    await wait(800);
  } finally {
    browser(session, ["record", "stop"]);
  }
  if (failed) throw new Error(failed);
  const end = Date.now() - start;
  return { raw, end, starts };
}

/** Caption cues: each step's caption from when it began to when the next began. */
function cues(video, starts, end) {
  return video.steps.map((step, index) => ({ at: starts[index] ?? 0, until: starts[index + 1] ?? end, caption: step.caption }));
}

mkdirSync(OUT, { recursive: true });
const result = existsSync(JSON_OUT) ? JSON.parse(readFileSync(JSON_OUT, "utf8")) : {};
let failures = 0;
for (const video of GUIDE_VIDEOS.filter((each) => !ONLY || ONLY.includes(each.id))) {
  try {
    const { raw, end, starts } = await record(video);
    const timed = cues(video, starts, end);
    const mp4 = join(OUT, `${video.id}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale=1920:-2:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
    const poster = join(TMP, `${video.id}.png`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(video.poster ?? 1.5), "-i", mp4, "-frames:v", "1", "-vf", "scale=1280:-2", poster]);
    execFileSync("magick", [poster, "-quality", "82", join(OUT, `${video.id}.webp`)]);
    writeFileSync(join(OUT, `${video.id}.vtt`), ["WEBVTT", "", ...timed.flatMap((cue, index) => [String(index + 1), `${stamp(cue.at)} --> ${stamp(cue.until)}`, cue.caption, ""])].join("\n"));
    const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], { encoding: "utf8" }).trim());
    result[video.id] = { seconds: Math.round(seconds * 10) / 10, chapters: timed.map((cue) => ({ at: Math.round(cue.at / 100) / 10, caption: cue.caption })) };
    console.log(`ok   ${video.id} ${seconds.toFixed(1)}s`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${video.id}: ${error.message}`);
  }
}
writeFileSync(JSON_OUT, `${JSON.stringify(Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`);
console.log(`${Object.keys(result).length} videos in ${OUT}${failures ? `, ${failures} failed` : ""}`);
process.exit(failures ? 1 : 0);
