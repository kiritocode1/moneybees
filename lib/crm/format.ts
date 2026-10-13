/** Dates the way the Mumbai office reads them: "12 Oct, 3:40 pm", in India time. */
export function istDateTime(value: string | Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

/** "3h 20m", "2d 4h", "45m": the gap between two moments, largest two units. */
export function span(ms: number) {
  const minutes = Math.max(1, Math.round(Math.abs(ms) / 60_000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const rest = minutes % 60;
  if (days) return hours ? `${days}d ${hours}h` : `${days}d`;
  if (hours) return rest ? `${hours}h ${rest}m` : `${hours}h`;
  return `${rest}m`;
}

/** "in 3h 20m", "3h 20m ago", or "just now" within a minute either way (clocks and refreshes drift by seconds). */
export function relative(value: string | Date, now = new Date()) {
  const ms = new Date(value).getTime() - now.getTime();
  if (Math.abs(ms) < 60_000) return "just now";
  return ms > 0 ? `in ${span(ms)}` : `${span(ms)} ago`;
}

/** First and last initials for an avatar. */
export const initials = (name: string | null | undefined) =>
  (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .filter((_, index, all) => index === 0 || index === all.length - 1)
    .join("")
    .toUpperCase();
