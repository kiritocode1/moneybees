import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { DEAL_STAGES } from "@/lib/crm/vocabulary";
import { screenIntro } from "@/lib/admin/screens";

/** Records when a deal last moved, so the board can show how long it has sat in a stage. */
const stampStage: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) =>
  operation === "create" || data.stage !== originalDoc?.stage ? { ...data, stageChangedAt: new Date().toISOString() } : data;

/**
 * One person or entity considering one product. PMS and AIF deals sit on
 * separate boards because the product decides the pipeline; the ticket size
 * is what the board adds up, in Rs. crore.
 */
export const Deals: CollectionConfig = {
  slug: "deals",
  admin: { useAsTitle: "title", defaultColumns: ["title", "stage", "ticketSize", "owner"], group: false, components: screenIntro("deals") },
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES), update: allow(...CRM_ROLES), delete: allow() },
  hooks: { beforeChange: [stampStage], afterChange: [auditChange("deals")] },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "contact", type: "relationship", relationTo: "contacts", required: true, index: true },
      { name: "entity", type: "relationship", relationTo: "entities" },
    ] },
    { type: "row", fields: [
      { name: "product", type: "relationship", relationTo: "products", required: true },
      { name: "stage", type: "select", required: true, defaultValue: "enquiry", options: [...DEAL_STAGES], index: true },
    ] },
    { type: "row", fields: [
      { name: "ticketSize", type: "number", min: 0, label: "Ticket size (Rs. crore)" },
      { name: "expectedClose", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    ] },
    { name: "lostReason", type: "text", admin: { condition: (data) => data.stage === "lost" } },
    { name: "owner", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "enquiry", type: "relationship", relationTo: "enquiries", admin: { position: "sidebar" } },
    { name: "stageChangedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
  ],
};
