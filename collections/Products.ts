import type { CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";

/**
 * One PMS strategy or one AIF scheme. Fact sheets hang off a product, and
 * the benchmark lives here so a page can never mix two.
 */
export const Products: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "name", defaultColumns: ["name", "kind", "benchmark"], group: "Products" },
  access: { read: everyone, create: allow("compliance"), update: allow("compliance"), delete: allow() },
  hooks: { afterChange: [auditChange("products")] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Used in links and code, e.g. moneybee-pms. Do not change once live." } },
    { name: "kind", type: "select", required: true, options: [{ label: "PMS strategy", value: "pms" }, { label: "AIF scheme", value: "aif" }] },
    { name: "benchmark", type: "text", required: true, admin: { description: "Exactly as the returns table prints it, e.g. S&P BSE 500 TRI." } },
    { name: "inception", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "registration", type: "text", admin: { description: "SEBI registration number." } },
    {
      name: "showPerformancePublicly",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Off keeps this product's returns off the public site. AIF returns stay off until compliance clears them (plan §11)." },
    },
  ],
};
