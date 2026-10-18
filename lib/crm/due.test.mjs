// Run with: node --test lib/crm/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { dueLabel, duePresets, followUpFor, fromLocalInput, toLocalInput, workingDaysAfter } from "./due.ts";

// Thursday 15 October 2026, 11:00 in Mumbai.
const thursday = new Date("2026-10-15T05:30:00Z");
// Friday 16 October 2026, 17:30 in Mumbai.
const fridayEvening = new Date("2026-10-16T12:00:00Z");

const iso = (at) => at.toISOString();

test("on a Thursday morning: later today, tomorrow, Monday, a week", () => {
  const presets = duePresets(thursday);
  assert.deepEqual(presets.map((preset) => preset.label), ["Later today", "Tomorrow", "Monday", "In a week"]);
  assert.equal(iso(presets[0].at), "2026-10-15T11:30:00.000Z"); // 17:00 IST
  assert.equal(iso(presets[1].at), "2026-10-16T04:30:00.000Z"); // Fri 10:00 IST
  assert.equal(iso(presets[2].at), "2026-10-19T04:30:00.000Z"); // Mon 10:00 IST
  assert.equal(iso(presets[3].at), "2026-10-22T04:30:00.000Z");
});

test("on a Friday evening the next working day is Monday, and Monday is not offered twice", () => {
  const presets = duePresets(fridayEvening);
  assert.deepEqual(presets.map((preset) => preset.label), ["Monday", "In a week"]);
  assert.equal(iso(presets[0].at), "2026-10-19T04:30:00.000Z");
});

test("working days skip the weekend", () => {
  assert.equal(iso(workingDaysAfter(fridayEvening, 2)), "2026-10-20T04:30:00.000Z"); // Tuesday
});

test("a call with no answer asks to call again on the next working day", () => {
  const next = followUpFor("call", "no_answer", fridayEvening);
  assert.equal(next.on, true);
  assert.equal(next.title, "Call again");
  assert.equal(iso(next.at), "2026-10-19T04:30:00.000Z");
  assert.equal(followUpFor("call", "spoke", thursday).on, false);
  assert.equal(followUpFor("meeting", undefined, thursday).letter, "meeting-follow-up");
});

test("labels and the date input read Mumbai time", () => {
  assert.equal(dueLabel(new Date("2026-10-16T04:30:00Z"), thursday), "Fri, 10:00");
  assert.equal(dueLabel(new Date("2026-10-15T11:30:00Z"), thursday), "Today, 17:00");
  assert.equal(toLocalInput(new Date("2026-10-17T04:30:00Z")), "2026-10-17T10:00");
  assert.equal(iso(fromLocalInput("2026-10-17T10:00")), "2026-10-17T04:30:00.000Z");
});
