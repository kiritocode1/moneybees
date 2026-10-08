import type { CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";

/**
 * Numbers that sit inside sentences, such as the founder's 45+ years. The
 * sentences stay in code and read the value by key, so one edit changes every
 * page that says it.
 */
export const Metrics: CollectionConfig = {
  slug: "metrics",
  admin: { useAsTitle: "label", defaultColumns: ["label", "value", "unit"], group: "Website" },
  access: { read: everyone, create: allow("editor", "compliance"), update: allow("editor", "compliance"), delete: allow() },
  hooks: { afterChange: [auditChange("metrics")] },
  fields: [
    { name: "label", type: "text", required: true },
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { description: "The name code uses, e.g. founderYears. Do not change once live." } },
    { name: "value", type: "number", required: true },
    { name: "unit", type: "select", options: ["none", "percent", "years", "crore", "stocks"], defaultValue: "none" },
  ],
};
