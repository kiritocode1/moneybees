import type { CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { ENQUIRY_KINDS, SEVERITIES, SEVERITY_LABELS } from "@/lib/crm/severity";
import { ENQUIRY_KIND_LABELS, ENQUIRY_STATUSES } from "@/lib/crm/vocabulary";

/**
 * One message from the /contact form, or one logged by staff. It arrives with
 * a severity, the reasons for it and a playbook (lib/crm/enquiries.ts), sits
 * in the shared inbox at /admin/inbox until someone takes it, and its clock
 * runs until the first reply. The person behind it is a Contact.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: { useAsTitle: "title", defaultColumns: ["title", "severity", "status", "assignee", "receivedAt"], group: false },
  defaultSort: "-receivedAt",
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES, "integration"), update: allow(...CRM_ROLES), delete: allow() },
  hooks: { afterChange: [auditChange("enquiries")] },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "contact", type: "relationship", relationTo: "contacts", required: true, index: true },
    { type: "row", fields: [
      { name: "kind", type: "select", required: true, options: ENQUIRY_KINDS.map((value) => ({ value, label: ENQUIRY_KIND_LABELS[value] })) },
      { name: "status", type: "select", required: true, defaultValue: "new", index: true, options: [...ENQUIRY_STATUSES] },
      { name: "severity", type: "select", required: true, defaultValue: "normal", index: true, options: SEVERITIES.map((value) => ({ value, label: SEVERITY_LABELS[value] })) },
    ] },
    { name: "message", type: "textarea" },
    {
      name: "answers",
      type: "json",
      admin: { description: "Every field the visitor filled in, by the form's field name." },
    },
    {
      name: "triage",
      type: "json",
      admin: { readOnly: true, description: "Why it has this severity: the rules that fired, and the AI's answers when AI triage is on." },
    },
    { name: "receivedAt", type: "date", required: true, index: true, defaultValue: () => new Date().toISOString(), admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } } },
    { name: "dueAt", type: "date", index: true, admin: { position: "sidebar", description: "When the first reply is due, from the playbook." } },
    { name: "firstResponseAt", type: "date", admin: { position: "sidebar", readOnly: true } },
    { name: "assignee", type: "relationship", relationTo: "users", index: true, admin: { position: "sidebar" } },
    { name: "claimedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
    { name: "playbook", type: "relationship", relationTo: "playbooks", admin: { position: "sidebar" } },
    { name: "deal", type: "relationship", relationTo: "deals", admin: { position: "sidebar" } },
    { name: "closingNote", type: "textarea", admin: { condition: (data) => data.status === "closed" || data.status === "spam" } },
    {
      name: "origin",
      type: "group",
      admin: { description: "Where it came from." },
      fields: [
        { type: "row", fields: [
          { name: "page", type: "text" },
          { name: "visitorId", type: "text", index: true },
        ] },
        { name: "utm", type: "json" },
        { name: "ipHash", type: "text", index: true, admin: { hidden: true } },
      ],
    },
  ],
};
