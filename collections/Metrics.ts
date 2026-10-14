import type { CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";

/**
 * Numbers that sit inside sentences, such as the founder's 45+ years. Nothing
 * reads them any more: those numbers are fields in the page records
 * (globals/pages), so the list is hidden from the sidebar (2026-10-14). The
 * table stays; set `hidden` to false to bring it back.
 */
export const Metrics: CollectionConfig = {
  slug: "metrics",
  admin: { useAsTitle: "label", defaultColumns: ["label", "value", "unit"], group: "Publishing", hidden: true },
  access: { read: everyone, create: allow("editor", "compliance"), update: allow("editor", "compliance"), delete: allow() },
  hooks: { afterChange: [auditChange("metrics")] },
  fields: [
    { name: "label", type: "text", required: true },
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { description: "The name code uses, e.g. founderYears. Do not change once live." } },
    { name: "value", type: "number", required: true },
    { name: "unit", type: "select", options: ["none", "percent", "years", "crore", "stocks"], defaultValue: "none" },
  ],
};
