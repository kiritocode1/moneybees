/*
 * The Guide's "Fact sheets, explained" (components/admin/guide), for staff
 * new to how a fund reports its numbers (user, 2026-10-13: explain it like a
 * story). The worked example is built from the live sheet in the view, so it
 * never goes stale. NOT_CONNECTED lists what the sheet does not reach yet;
 * remove a line when the page it names starts reading fact sheets.
 */

/** Why a new sheet goes up every month. */
export const WHY_MONTHLY: { title: string; text: string }[] = [
  {
    title: "The numbers move every day",
    text: "The fund owns shares, and their prices change daily. Once a month the fund freezes the picture at the month's last day, works the returns out properly and publishes that snapshot. That snapshot is the fact sheet.",
  },
  {
    title: "Investors compare funds month by month",
    text: "Investors and distributors line funds up on their latest month. A site still showing June in October looks neglected, or picked to look good.",
  },
  {
    title: "The rules want a date and a method",
    text: "SEBI's rules for showing performance ask for the date the numbers run to, returns after fees, the benchmark beside them, and the line that SEBI has not verified them. The industry body, APMI, also collects every PMS's monthly returns and publishes comparisons.",
  },
];

/** The two kinds of row on a sheet. */
export const ROW_KINDS: { title: string; text: string }[] = [
  {
    title: "1 month to 1 year: plain returns",
    text: "How much the money grew over that stretch, ending on the sheet's date.",
  },
  {
    title: "3 years, 5 years and since inception: yearly averages",
    text: "The steady growth per year that would turn the starting amount into today's. Funds call it CAGR. Every row is a window ending at month-end, so next month every number moves, which is why each sheet carries a fresh set.",
  },
];

/** What happens, in order, from the PDF to the site. */
export const JOURNEY: { who: string; text: string }[] = [
  { who: "Editor", text: "Opens Publishing › Fact sheets › Create New. The screen starts on last month and shows the previous sheet's number under every box." },
  { who: "Editor", text: "Drops in the PDF and copies the numbers into the grid. A number that moved more than 8 points turns amber; an impossible one turns red. The site's graphs redraw on the right as they type. Nothing is public yet." },
  { who: "Editor", text: "Presses Send to compliance. Compliance is told, and Today counts it. The editor cannot approve their own sheet." },
  { who: "Compliance", text: "Opens the same screen, read-only, and checks every number against the PDF. Approves it, or sends it back with a note the editor sees." },
  { who: "The site", text: "Once approved, the new month goes live and the old one is marked Replaced. On the Home page the discs, the returns table, the numbers in the Performance paragraph and the since-inception figure at the top change. On the PMS page the bars, the full table, the growth discs and the date change. The method note in the footer takes the new date." },
  { who: "Later", text: "If a published month turns out wrong, Correct this month opens a copy, asks what was wrong, and goes through compliance again. Approving it replaces the month." },
];

/** What every sheet keeps, for good. */
export const KEPT: string[] = [
  "The fund and the month.",
  "All eight returns, for the fund and its benchmark.",
  "What Rs. 1 Mn grew to since the fund began.",
  "The top sectors.",
  "The PDF itself.",
  "Who entered it, who approved it, and when.",
  "Every earlier month, marked Replaced, and every correction with its reason. Nothing is overwritten.",
];

/** What the records do not hold. */
export const NOT_KEPT: string[] = [
  "Months before July 2026. Older months need their PDFs entered.",
  "Daily values, and each investor's own returns. Every client's portfolio differs a little; those belong in the client portal, not the public site.",
  "Calendar-year returns, such as 2024 and 2025 on their own. There is no box for them yet.",
];

/** Places a fact sheet does not reach yet. */
export const NOT_CONNECTED: string[] = [
  "The fact sheet PDF is not on the site. To publish it, add it in Website › Documents.",
  "Top sectors are saved but shown nowhere.",
  "Flyingbee sheets reach the AIF page only once Show performance publicly is on for Flyingbee in Publishing › Products. SEBI needs the benchmarking agency's report first.",
];
