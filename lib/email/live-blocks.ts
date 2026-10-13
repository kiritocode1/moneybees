/*
 * Live blocks: the parts of an email template that are filled in when the
 * email is sent, not when it is designed. A performance chart always shows
 * the latest published fact sheet, a signature always shows whoever sends.
 *
 * In the editor a live block is one node (components/admin/email-editor/
 * live-block-node.tsx) holding its kind and settings. On export it becomes a
 * marker, MB:LIVE:<base64url json>:END, which lib/email/render.ts replaces
 * with the block rendered from current data (lib/email/blocks.tsx).
 * This file is shared by the editor and the server, so it imports nothing
 * from either.
 */

import type { Period } from "@/lib/figure-limits";

export const LIVE_KINDS = ["header", "performance", "growth", "sectors", "figures", "chart", "factsheet", "signature", "footer"] as const;
export type LiveKind = (typeof LIVE_KINDS)[number];

export type PerformanceConfig = { product: string; style: "bars" | "table"; periods: Period[] };
export type GrowthConfig = { product: string };
export type SectorsConfig = { product: string };
export type FiguresConfig = { items: { value: string; label: string }[] };
export type ChartConfig = { title: string; unit: "%" | "Rs. crore" | "Rs. lakh" | ""; valueLabel: string; compareLabel: string; rows: { label: string; value: number; compare?: number | null }[] };
export type FactsheetConfig = { product: string; label: string };
export type FooterConfig = { unsubscribe: boolean };
type NoConfig = Record<string, never>;

export type LiveConfig = {
  header: NoConfig;
  performance: PerformanceConfig;
  growth: GrowthConfig;
  sectors: SectorsConfig;
  figures: FiguresConfig;
  chart: ChartConfig;
  factsheet: FactsheetConfig;
  signature: NoConfig;
  footer: FooterConfig;
};

export type LiveBlock = { [K in LiveKind]: { kind: K; config: LiveConfig[K] } }[LiveKind];

/** What the palette shows, and what a new block starts with. `data` marks blocks that read fact sheets. */
export const LIVE_BLOCKS: { [K in LiveKind]: { title: string; description: string; data: boolean; defaults: LiveConfig[K] } } = {
  header: { title: "Logo", description: "Moneybee's logo across the top", data: false, defaults: {} },
  performance: { title: "Returns", description: "Returns against the benchmark from the latest published fact sheet, with the required disclaimer", data: true, defaults: { product: "moneybee-pms", style: "bars", periods: ["1Y", "3Y", "5Y", "SI"] } },
  growth: { title: "Growth", description: "What Rs. 1 Mn at inception is worth now, against the benchmark", data: true, defaults: { product: "moneybee-pms" } },
  sectors: { title: "Sectors", description: "Top sectors as a share of AUM from the latest fact sheet", data: true, defaults: { product: "flyingbee" } },
  figures: { title: "Key figures", description: "Up to three large numbers with a label under each", data: false, defaults: { items: [{ value: "45+", label: "Years in Indian markets" }, { value: "15 to 20", label: "Stocks in the portfolio" }, { value: "30%", label: "Most in any one sector" }] } },
  chart: { title: "Chart", description: "A bar chart from numbers you type in", data: false, defaults: { title: "", unit: "%", valueLabel: "Moneybee PMS", compareLabel: "", rows: [{ label: "FY24", value: 12 }, { label: "FY25", value: 18 }, { label: "FY26", value: 9 }] } },
  factsheet: { title: "Fact sheet", description: "A button to the latest published fact sheet PDF", data: true, defaults: { product: "moneybee-pms", label: "Read the fact sheet" } },
  signature: { title: "Signature", description: "The sender's name, role and number, filled in when sent", data: false, defaults: {} },
  footer: { title: "Footer", description: "Office address, and an unsubscribe line for mailings", data: false, defaults: { unsubscribe: false } },
};

const MARKER = /MB:LIVE:([A-Za-z0-9_-]+):END/g;

const toBase64Url = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromBase64Url = (code: string) => new TextDecoder().decode(Uint8Array.from(atob(code.replace(/-/g, "+").replace(/_/g, "/")), (char) => char.charCodeAt(0)));

/** The text a live block exports as. */
export const liveMarker = (block: LiveBlock) => `MB:LIVE:${toBase64Url(JSON.stringify(block))}:END`;

/** Reads a marker back; null when it is not one of ours. */
export function readMarker(code: string): LiveBlock | null {
  try {
    const block = JSON.parse(fromBase64Url(code)) as LiveBlock;
    return (LIVE_KINDS as readonly string[]).includes(block.kind) ? block : null;
  } catch {
    return null;
  }
}

/** Every marker in an exported email, in order. */
export function findMarkers(text: string) {
  return [...text.matchAll(MARKER)].map((match) => ({ code: match[1], block: readMarker(match[1]) }));
}

export { MARKER };

/** Merge fields the sender fills in, with the sample used in previews and test sends. */
export const MERGE_FIELDS = [
  { key: "firstName", label: "First name", sample: "Rohan" },
  { key: "name", label: "Full name", sample: "Rohan Mehta" },
  { key: "reference", label: "Reference", sample: "ENQ-00042" },
  { key: "senderName", label: "Sender", sample: "" },
  { key: "role", label: "Role applied for", sample: "Equity Research Analyst" },
  { key: "unsubscribeUrl", label: "Unsubscribe link", sample: "https://www.moneybee.in/preferences" },
] as const;
export type MergeKey = (typeof MERGE_FIELDS)[number]["key"];
