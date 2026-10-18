import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { TASK_KINDS, TASK_SOURCES } from "@/lib/crm/vocabulary";

/**
 * A follow-up someone owes a person: call back, send documents, meet. Most
 * are made by the work itself (a call's outcome, a meeting, a playbook, a
 * deal moving); `source` says which. An email task can name its letter
 * (an emails/ catalogue id), so Write opens it ready. Done keeps who and
 * when, and `outcome`, the line on what happened, also shown on the timeline.
 */
export const Tasks: CollectionConfig = {
  slug: "tasks",
  admin: { useAsTitle: "title", defaultColumns: ["title", "dueAt", "owner", "doneAt"], group: false },
  defaultSort: "dueAt",
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES), update: allow(...CRM_ROLES), delete: allow(...CRM_ROLES) },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "kind", type: "select", required: true, defaultValue: "todo", options: [...TASK_KINDS] },
      { name: "source", type: "select", required: true, defaultValue: "manual", options: [...TASK_SOURCES] },
    ] },
    { type: "row", fields: [
      { name: "dueAt", type: "date", required: true, index: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      { name: "owner", type: "relationship", relationTo: "users", required: true, index: true },
    ] },
    { name: "contact", type: "relationship", relationTo: "contacts", index: true },
    { name: "enquiry", type: "relationship", relationTo: "enquiries" },
    { name: "deal", type: "relationship", relationTo: "deals" },
    { name: "letter", type: "text", admin: { description: "For an email task: the letter to write, by its id on the Emails page." } },
    // The playbook step it came from (the step's row id), so a step becomes one task and can tick itself.
    { name: "step", type: "text", index: true, admin: { hidden: true } },
    { name: "outcome", type: "textarea" },
    { name: "createdBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true } },
    { name: "doneAt", type: "date", index: true, admin: { position: "sidebar" } },
    { name: "doneBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};
