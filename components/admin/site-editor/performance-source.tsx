import type { Payload } from "payload";
import { PERIODS } from "@/lib/figure-limits";
import { PerformanceSourcePanel, type SheetSummary } from "./performance-source-panel";

/** The periods the homepage table shows, in its order. */
const SHOWN = ["1Y", "3Y", "5Y", "SI"] as const;

/**
 * The numbers a performance section draws, from the latest published Moneybee
 * PMS fact sheet, and a newer sheet still waiting for approval. Rendered on
 * the server by Payload. Home splits this: discs on Performance, bars on Returns.
 * The PMS page still shows both.
 */
async function source(payload: Payload, show: "all" | "wealth" | "returns") {
  const { docs } = await payload.find({
    collection: "fact-sheets",
    where: { "product.slug": { equals: "moneybee-pms" }, status: { in: ["published", "in_review", "draft"] } },
    sort: "-asOf",
    depth: 0,
    limit: 12,
    overrideAccess: true,
  });
  const live = docs.find((sheet) => sheet.status === "published");
  const waiting = docs.find((sheet) => sheet.status !== "published" && (!live || sheet.asOf >= live.asOf));
  const summary: SheetSummary | null = live
    ? {
        id: live.id,
        title: live.title ?? "",
        rows: SHOWN.map((period) => {
          const row = live.returns?.find((r) => r.period === period);
          return { label: PERIODS.find((p) => p.value === period)?.label ?? period, ours: row?.ours ?? null, benchmark: row?.benchmark ?? null };
        }),
        wealth: { ours: live.wealth?.ours ?? null, benchmark: live.wealth?.benchmark ?? null },
      }
    : null;
  return (
    <PerformanceSourcePanel
      show={show}
      live={summary}
      waiting={waiting ? { id: waiting.id, title: waiting.title ?? "", inReview: waiting.status === "in_review" } : null}
    />
  );
}

/** Discs and return rows, for the PMS page. */
export async function PerformanceSource({ payload }: { payload: Payload }) {
  return source(payload, "all");
}

/** The growth discs on the Home page's Performance block. */
export async function WealthSource({ payload }: { payload: Payload }) {
  return source(payload, "wealth");
}

/** The long-period bars on the Home page's Returns block. */
export async function ReturnsSource({ payload }: { payload: Payload }) {
  return source(payload, "returns");
}
