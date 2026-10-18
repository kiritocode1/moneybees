import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { ACTIVITY_TYPES } from "@/lib/crm/vocabulary";

/**
 * One line on a person's timeline: a form they sent, an email either way,
 * a call, a note, a page they read. Server code writes most of them; staff
 * add calls, meetings and notes. Only an admin edits or removes one.
 */
export const Activities: CollectionConfig = {
  slug: "activities",
  admin: { useAsTitle: "summary", defaultColumns: ["at", "type", "summary", "contact"], group: false },
  defaultSort: "-at",
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES), update: allow(), delete: allow() },
  fields: [
    { name: "contact", type: "relationship", relationTo: "contacts", required: true, index: true },
    { type: "row", fields: [
      { name: "type", type: "select", required: true, options: [...ACTIVITY_TYPES] },
      { name: "at", type: "date", required: true, index: true, defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: "dayAndTime" } } },
    ] },
    { name: "summary", type: "text", required: true },
    { name: "body", type: "textarea" },
    { name: "enquiry", type: "relationship", relationTo: "enquiries", index: true },
    { name: "deal", type: "relationship", relationTo: "deals", index: true },
    { name: "email", type: "relationship", relationTo: "emails" },
    // A task's "Done" line, so Undo and its outcome find the line again.
    { name: "task", type: "relationship", relationTo: "tasks", index: true },
    { name: "actor", type: "relationship", relationTo: "users" },
    { name: "meta", type: "json", admin: { hidden: true } },
  ],
};
