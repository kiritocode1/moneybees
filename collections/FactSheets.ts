import type { CollectionConfig, Where } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { afterStatusChange, enforceWorkflow, setTitle, STATUSES } from "@/lib/backend/fact-sheet-workflow";
import { allow, hasRole } from "@/lib/backend/roles";
import { numberWithin, PERIODS, RETURN, SECTOR, WEALTH } from "@/lib/figure-limits";

/** What the public may read: published sheets of products whose returns are cleared for the site. */
const PUBLIC: Where = { status: { equals: "published" }, "product.showPerformancePublicly": { equals: true } };

/**
 * One product's figures for one month: the returns table, the Rs. 1 Mn growth
 * and the sector weights, plus the month's PDF. Every illustration that shows
 * performance reads the latest published sheet. Approval rules live in
 * lib/backend/fact-sheet-workflow.ts.
 */
export const FactSheets: CollectionConfig = {
  slug: "fact-sheets",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "asOf", "updatedAt"],
    group: "This month",
    description: "Draft, submit for review, and compliance publishes. A published sheet never changes; fix a mistake with a new sheet for the same month.",
  },
  versions: { maxPerDoc: 0 },
  access: {
    read: ({ req }) => (req.user?.collection === "users" ? true : PUBLIC),
    create: allow("editor", "compliance"),
    update: allow("editor", "compliance"),
    // Only drafts can be deleted, and only by the people who make them.
    delete: ({ req }) => (hasRole(req.user, "editor", "compliance") ? { status: { equals: "draft" } } : false),
  },
  hooks: {
    beforeChange: [enforceWorkflow, setTitle],
    afterChange: [afterStatusChange, auditChange("fact-sheets")],
  },
  fields: [
    { name: "title", type: "text", admin: { readOnly: true, hidden: true } },
    { name: "product", type: "relationship", relationTo: "products", required: true },
    {
      name: "asOf",
      type: "date",
      required: true,
      label: "Figures as of",
      admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" }, description: "The last day the returns cover, e.g. 31 August 2026." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: STATUSES.map((value) => ({ value, label: { draft: "Draft", in_review: "Waiting for approval", published: "Published", superseded: "Replaced by a newer sheet" }[value] })),
      admin: { position: "sidebar", description: "Draft, then waiting for approval. Compliance publishes." },
    },
    {
      name: "returns",
      type: "array",
      labels: { singular: "Return", plural: "Returns" },
      admin: { description: "One row per period. Leave a value empty when the period has not run; the site prints N/A." },
      validate: (rows: unknown) => {
        const periods = Array.isArray(rows) ? rows.map((row: { period?: string }) => row.period) : [];
        return new Set(periods).size === periods.length || "Each period can appear only once.";
      },
      fields: [
        { name: "period", type: "select", required: true, options: PERIODS.map(({ value, label }) => ({ value, label })) },
        { name: "ours", type: "number", label: "Our return (%)", validate: numberWithin(RETURN, "A return") },
        { name: "benchmark", type: "number", label: "Benchmark return (%)", validate: numberWithin(RETURN, "A return") },
      ],
    },
    {
      name: "wealth",
      type: "group",
      label: "Rs. 1 Mn since inception",
      admin: { description: "What Rs. 1 Mn invested at inception is worth on the as-of date, in Rs. Mn. Leave empty if the deck does not give it." },
      fields: [
        { name: "ours", type: "number", label: "In this product (Rs. Mn)", validate: numberWithin(WEALTH, "The value") },
        { name: "benchmark", type: "number", label: "In the benchmark (Rs. Mn)", validate: numberWithin(WEALTH, "The value") },
      ],
    },
    {
      name: "sectors",
      type: "array",
      maxRows: 10,
      labels: { singular: "Sector", plural: "Top sectors" },
      validate: (rows: unknown) => {
        const total = Array.isArray(rows) ? rows.reduce((sum: number, row: { weight?: number }) => sum + (row.weight ?? 0), 0) : 0;
        return total <= SECTOR.max || `The sector weights add up to ${total.toFixed(2)}%, more than 100%.`;
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "weight", type: "number", required: true, label: "Weight (% of AUM)", validate: numberWithin(SECTOR, "A sector weight") },
      ],
    },
    { name: "pdf", type: "upload", relationTo: "media", label: "Fact sheet PDF" },
    {
      name: "correctionReason",
      type: "textarea",
      admin: { description: "Only when replacing a sheet already published for the same month: what was wrong." },
    },
    { name: "submittedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true } },
    { name: "submittedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
    { name: "approvedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true } },
    { name: "publishedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
  ],
};
