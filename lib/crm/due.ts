/*
 * When a task is due, picked rather than typed: Later today, Tomorrow (the
 * next working day, so Monday on a Friday), Monday, In a week, or a date
 * and time. Everything is Mumbai time (IST, UTC+5:30, no daylight saving).
 * Pure, so the browser and the server agree and a test can pin the clock.
 */

const IST_MINUTES = 330;
const DAY = 86_400_000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** The calendar date and weekday in Mumbai, and the minutes since its midnight. */
export function istParts(at: Date) {
  const shifted = new Date(at.getTime() + IST_MINUTES * 60_000);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate(), weekday: shifted.getUTCDay(), minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes() };
}

/** The moment it is `hour`:`minute` in Mumbai, `days` calendar days after `from`'s Mumbai date. */
export function istAt(from: Date, days: number, hour: number, minute = 0) {
  const { year, month, day } = istParts(from);
  return new Date(Date.UTC(year, month, day + days, hour, minute) - IST_MINUTES * 60_000);
}

const weekend = (at: Date) => [0, 6].includes(istParts(at).weekday);

/** `count` working days after `from` (Saturday and Sunday skipped), at `hour` in Mumbai. */
export function workingDaysAfter(from: Date, count: number, hour = 10) {
  let at = istAt(from, 0, hour);
  for (let left = count; left > 0; ) {
    at = new Date(at.getTime() + DAY);
    if (!weekend(at)) left -= 1;
  }
  return at;
}

export type DuePreset = { key: "today" | "tomorrow" | "monday" | "week"; label: string; at: Date };

/**
 * The choices offered at `now`. Later today only before 4 pm; Monday only
 * when the next working day is not already Monday.
 */
export function duePresets(now: Date): DuePreset[] {
  const next = workingDaysAfter(now, 1);
  const nextName = WEEKDAYS[istParts(next).weekday];
  const tomorrow = istAt(now, 1, 10).getTime() === next.getTime();
  const daysToMonday = (8 - istParts(now).weekday) % 7 || 7;
  const monday = istAt(now, daysToMonday, 10);
  return [
    ...(istParts(now).minutes < 16 * 60 ? [{ key: "today" as const, label: "Later today", at: istAt(now, 0, 17) }] : []),
    { key: "tomorrow", label: tomorrow ? "Tomorrow" : nextName, at: next },
    ...(monday.getTime() !== next.getTime() ? [{ key: "monday" as const, label: "Monday", at: monday }] : []),
    { key: "week", label: "In a week", at: istAt(now, 7, 10) },
  ];
}

/** "Fri, 10:00", "20 Oct, 10:00": short enough for a menu, exact enough to trust. */
export function dueLabel(at: Date, now: Date) {
  const time = at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  const days = Math.round((istAt(at, 0, 0).getTime() - istAt(now, 0, 0).getTime()) / DAY);
  if (days === 0) return `Today, ${time}`;
  if (days > 0 && days < 7) return `${at.toLocaleDateString("en-GB", { weekday: "short", timeZone: "Asia/Kolkata" })}, ${time}`;
  return `${at.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}, ${time}`;
}

/** A follow-up's first suggestion for each way a call or meeting ended, as in the plan: No answer, call again tomorrow. */
export function followUpFor(kind: "call" | "meeting" | "note", outcome: string | undefined, now: Date) {
  if (kind === "meeting") return { on: true, kind: "email" as const, title: "Send the meeting follow-up", letter: "meeting-follow-up", at: istParts(now).minutes < 16 * 60 ? istAt(now, 0, 17) : workingDaysAfter(now, 1) };
  if (kind === "call" && outcome === "no_answer") return { on: true, kind: "call" as const, title: "Call again", letter: null, at: workingDaysAfter(now, 1) };
  if (kind === "call" && outcome === "left_message") return { on: true, kind: "call" as const, title: "Call again", letter: null, at: workingDaysAfter(now, 2) };
  return { on: false, kind: kind === "call" ? ("call" as const) : ("todo" as const), title: "", letter: null, at: workingDaysAfter(now, 1) };
}

/** The value a datetime-local input shows for `at`, in Mumbai time. */
export function toLocalInput(at: Date) {
  const { year, month, day, minutes } = istParts(at);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/** A datetime-local input's value, read as Mumbai time. */
export function fromLocalInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - IST_MINUTES * 60_000);
}
