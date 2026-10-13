/** A month as the fact sheet screen handles it: "2026-09". */
export type Month = `${number}-${string}`;

/** The month a date falls in, in India. */
export const monthOf = (iso: string): Month => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(0, 7) as Month;

/** The month before the one `now` falls in: the month a new sheet is usually for. */
export function lastMonth(now = new Date()): Month {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` as Month;
}

/** Steps a month forward or back. */
export function shiftMonth(month: Month, by: number): Month {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + by, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` as Month;
}

/** The month's last day, which a sheet's figures run to: "2026-09-30". */
export function lastDay(month: Month) {
  const [year, m] = month.split("-").map(Number);
  return `${month}-${String(new Date(Date.UTC(year, m, 0)).getUTCDate()).padStart(2, "0")}`;
}

/** "September 2026". */
export const monthName = (month: Month) => new Date(`${month}-15T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

/** A valid "YYYY-MM", or null. */
export const parseMonth = (value: unknown): Month | null => (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? (value as Month) : null);
