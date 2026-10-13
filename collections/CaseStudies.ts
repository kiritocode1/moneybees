import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";

/** The studies are on /case-studies; any change rebuilds it. */
const rebuild = (req: PayloadRequest) => {
  if (!req.context.skipRevalidate) revalidatePath("/case-studies");
};
const afterChange: CollectionAfterChangeHook = ({ doc, req }) => (rebuild(req), doc);
const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => (rebuild(req), doc);

/**
 * The companies on /case-studies (rollout plan step 7), in this order: each
 * gets its own section, and a row of the PAT timeline under them. Seeded with
 * the content plan's three from lib/case-studies.ts. Compliance should review
 * every change: a named stock on the site reads as a recommendation.
 */
export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case studies" },
  orderable: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "drawing"],
    // Listed under Website in the sidebar by components/admin/nav-links.tsx.
    group: false,
    hideAPIURL: true,
    description: "The companies on the Case Studies page, in this order. Drag a row to move one.",
  },
  access: { read: everyone, create: allow("editor", "compliance"), update: allow("editor", "compliance"), delete: allow("editor", "compliance") },
  hooks: { afterChange: [afterChange, auditChange("case-studies")], afterDelete: [afterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, label: "Company", admin: { components: { Cell: "/components/admin/cells/cells#CompanyCell" } } },
      { name: "mark", type: "text", required: true, label: "Initials in the badge", admin: { description: "Two or three letters, until an approved logo is supplied." } },
      {
        name: "drawing",
        type: "select",
        required: true,
        label: "Business drawing",
        defaultValue: "power",
        options: [
          { value: "power", label: "Power plant" },
          { value: "casting", label: "Castings" },
          { value: "laminations", label: "Steel laminations" },
        ],
      },
    ] },
    { name: "business", type: "textarea", required: true, label: "Business model" },
    { name: "edge", type: "textarea", required: true, label: "Competitive edge" },
    { name: "growth", type: "textarea", required: true, label: "Growth prospect" },
    {
      name: "financials",
      type: "array",
      label: "Five years, Rs. crore",
      labels: { singular: "Year", plural: "Years" },
      minRows: 5,
      maxRows: 5,
      admin: { description: "Oldest first. The chart and the timeline redraw from these." },
      fields: [
        { type: "row", fields: [
          { name: "year", type: "text", required: true, label: "Year, e.g. FY24" },
          { name: "revenue", type: "number", required: true, min: 0, label: "Revenue" },
          { name: "ebitda", type: "number", required: true, label: "EBITDA" },
          { name: "pat", type: "number", required: true, label: "PAT" },
        ] },
      ],
    },
    // The study's anchor on the page, kept for the first three so links to them hold.
    { name: "anchor", type: "text", admin: { hidden: true } },
  ],
};
