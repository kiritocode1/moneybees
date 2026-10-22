import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import type { DocumentViewServerProps, Where } from "payload";
import { hasRole } from "@/lib/backend/roles";
import { lastDay, lastMonth, type Month, monthName, monthOf, parseMonth } from "@/lib/fact-sheets/month";
import { PERIODS } from "@/lib/figure-limits";
import { millionsToLakhs, wealthDisplay, type RupeeUnit } from "@/lib/site/tokens";
import type { FactSheet, Media } from "@/payload-types";
import { FactSheetScreen, type ScreenData, type ScreenMode } from "./fact-sheet-screen";

const SHEETS = "/admin/collections/fact-sheets";
const idOf = (value: unknown) => (typeof value === "object" && value !== null && "id" in value ? (value as { id: number }).id : (value as number | null | undefined));
const text = (value: number | null | undefined) => (typeof value === "number" ? value.toFixed(2) : "");
/** Wealth is stored in millions. The grid shows lakhs, and crore from 100 lakh up. */
const wealthFields = (value: number | null | undefined): { text: string; unit: RupeeUnit } => {
  if (typeof value !== "number") return { text: "", unit: "Lakh" };
  const shown = wealthDisplay(value);
  return { text: String(shown.amount), unit: shown.unit };
};
const lakhValue = (value: number | null | undefined) => (typeof value === "number" ? millionsToLakhs(value) : null);

/**
 * Payload's create and edit view for fact sheets, replaced
 * (collections/FactSheets.ts admin.components.views.edit.root) by one guided
 * screen: pick the fund and month, drop in the PDF, fill the grid, see the
 * graphs, send to compliance (plan approved 2026-10-12). This server part
 * loads the sheet, the month before it for comparison, and decides what the
 * signed-in person can do with it; fact-sheet-screen.tsx draws it.
 */
export async function FactSheetView(props: DocumentViewServerProps) {
  const { req } = props.initPageResult;
  const { payload, user } = req;
  if (user?.collection !== "users") redirect("/admin/login");
  const doc = props.doc as Partial<FactSheet> | undefined;
  const id = typeof doc?.id === "number" ? doc.id : null;
  const params = (props.searchParams ?? {}) as Record<string, string | string[] | undefined>;

  // PMS strategies first, the usual monthly job.
  const products = (await payload.find({ collection: "products", depth: 0, limit: 20, sort: "name", overrideAccess: true })).docs.sort((a, b) => Number(a.kind !== "pms") - Number(b.kind !== "pms"));
  const productId = idOf(doc?.product) ?? (Number(params.product) || products.find((p) => p.kind === "pms")?.id || products[0]?.id);
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return (
      <Gutter>
        <p className="fluid mt-10 text-body text-muted-foreground">Add a product under Publishing › Products first.</p>
      </Gutter>
    );
  }
  const month: Month = doc?.asOf ? monthOf(doc.asOf) : (parseMonth(params.month) ?? lastMonth());
  const monthWhere: Where = { product: { equals: product.id }, asOf: { greater_than_equal: `${month}-01`, less_than_equal: `${lastDay(month)}T23:59:59` } };

  // A new sheet for a month that already has one in progress opens that one instead.
  if (!id) {
    const open = await payload.find({ collection: "fact-sheets", where: { and: [monthWhere, { status: { in: ["draft", "in_review"] } }] }, depth: 0, limit: 1, overrideAccess: true });
    if (open.docs[0]) redirect(`${SHEETS}/${open.docs[0].id}`);
  }

  const [sameMonth, earlier] = await Promise.all([
    payload.find({ collection: "fact-sheets", where: { and: [monthWhere, { status: { equals: "published" } }] }, depth: 0, limit: 1, overrideAccess: true }),
    payload.find({ collection: "fact-sheets", where: { product: { equals: product.id }, status: { in: ["published", "superseded"] }, asOf: { less_than: `${month}-01` } }, sort: "-asOf", depth: 0, limit: 1, overrideAccess: true }),
  ]);
  const publishedSameMonth = sameMonth.docs.find((sheet) => sheet.id !== id) ?? null;
  // A correction is compared with the sheet it replaces; a new month with the month before.
  const compare = publishedSameMonth ?? earlier.docs[0] ?? null;

  const status = doc?.status ?? "draft";
  const submittedBy = idOf(doc?.submittedBy);
  const mode: ScreenMode =
    status === "published" ? "published" : status === "superseded" ? "superseded" : status === "in_review" ? (hasRole(user, "compliance") && submittedBy !== user.id ? "review" : "waiting") : hasRole(user, "editor", "compliance") ? "edit" : "waiting";
  const pdf = doc?.pdf ? (typeof doc.pdf === "object" ? (doc.pdf as Media) : await payload.findByID({ collection: "media", id: doc.pdf, depth: 0, overrideAccess: true })) : null;
  const submitter = submittedBy ? await payload.findByID({ collection: "users", id: submittedBy, depth: 0, overrideAccess: true }).catch(() => null) : null;

  const data: ScreenData = {
    id,
    mode,
    products: products.map((p) => ({ id: p.id, name: p.name, kind: p.kind, benchmark: p.benchmark })),
    productId: product.id,
    month,
    monthName: monthName(month),
    rows: PERIODS.map(({ value, label }) => {
      const row = doc?.returns?.find((r) => r.period === value);
      return { period: value, label, ours: text(row?.ours), benchmark: text(row?.benchmark) };
    }),
    wealth: { ours: wealthFields(doc?.wealth?.ours).text, benchmark: wealthFields(doc?.wealth?.benchmark).text },
    wealthUnit: { ours: wealthFields(doc?.wealth?.ours).unit, benchmark: wealthFields(doc?.wealth?.benchmark).unit },
    sectors: doc?.sectors?.map(({ name, weight }) => ({ name, weight: String(weight) })) ?? [],
    pdf: pdf?.url ? { id: pdf.id, url: pdf.url, filename: pdf.filename ?? "Fact sheet PDF" } : null,
    correctionReason: doc?.correctionReason ?? "",
    reviewNote: doc?.reviewNote ?? "",
    needsReason: Boolean(publishedSameMonth) || Boolean(doc?.correctionReason),
    compare: compare
      ? {
          monthName: monthName(monthOf(compare.asOf)),
          rows: Object.fromEntries((compare.returns ?? []).map((r) => [r.period, { ours: r.ours ?? null, benchmark: r.benchmark ?? null }])),
          wealth: { ours: lakhValue(compare.wealth?.ours), benchmark: lakhValue(compare.wealth?.benchmark) },
        }
      : null,
    submittedBy: submitter?.name ?? null,
    publishedSameMonthId: publishedSameMonth?.id ?? null,
  };

  return (
    <Gutter>
      <div className="fluid pb-28">
        <FactSheetScreen data={data} />
      </div>
    </Gutter>
  );
}
