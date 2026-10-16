/*
 * Dates and times as emails write them, always in India's time zone, since
 * the server runs in UTC.
 */

const IST = "Asia/Kolkata";

/** "16 Oct 2026, 10:42 am", for a fact box. */
export const shortDateTime = (value: string | Date) =>
  new Date(value).toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).replace(/\b(am|pm)\b/i, (m) => m.toLowerCase());

/** "10:42 am on Friday 17 October 2026", for a sentence. */
export function longDateTime(value: string | Date) {
  const date = new Date(value);
  const time = date.toLocaleString("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
  const day = date.toLocaleDateString("en-GB", { timeZone: IST, weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");
  return `${time} on ${day}`;
}

/** "2:42 pm today, in 4 hours" or "11:00 am on Monday 19 October, in 2 days", for a reply clock. */
export function dueIn(value: string | Date, now = new Date()) {
  const due = new Date(value);
  const hours = Math.round((due.getTime() - now.getTime()) / 3_600_000);
  const sameDay = due.toLocaleDateString("en-GB", { timeZone: IST }) === now.toLocaleDateString("en-GB", { timeZone: IST });
  const time = due.toLocaleString("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
  const when = sameDay ? `${time} today` : `${time} on ${due.toLocaleDateString("en-GB", { timeZone: IST, weekday: "long", day: "numeric", month: "long" }).replace(",", "")}`;
  if (hours < 0) return `${when}, ${-hours} hours ago`;
  return `${when}, in ${hours < 48 ? `${hours} hours` : `${Math.round(hours / 24)} days`}`;
}
