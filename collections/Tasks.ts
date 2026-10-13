import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";

/** A follow-up someone owes: call back, send documents. The Today screen lists each person's open tasks by due date. */
export const Tasks: CollectionConfig = {
  slug: "tasks",
  admin: { useAsTitle: "title", defaultColumns: ["title", "dueAt", "owner", "doneAt"], group: false },
  defaultSort: "dueAt",
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES), update: allow(...CRM_ROLES), delete: allow(...CRM_ROLES) },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "dueAt", type: "date", required: true, index: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      { name: "owner", type: "relationship", relationTo: "users", required: true, index: true },
    ] },
    { name: "contact", type: "relationship", relationTo: "contacts", index: true },
    { name: "enquiry", type: "relationship", relationTo: "enquiries" },
    { name: "deal", type: "relationship", relationTo: "deals" },
    { name: "doneAt", type: "date", index: true, admin: { position: "sidebar" } },
    { name: "doneBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};
