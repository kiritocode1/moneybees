import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES, nobody } from "@/lib/backend/roles";
import { EMAIL_STATUSES } from "@/lib/crm/vocabulary";

/**
 * Every email the CRM sends or receives, with what Resend reported back:
 * delivered, opened, clicked, bounced. Written only by server code
 * (lib/crm/mail.ts and the Resend webhook), so the record is what happened.
 */
export const Emails: CollectionConfig = {
  slug: "emails",
  admin: { useAsTitle: "subject", defaultColumns: ["subject", "to", "status", "createdAt"], group: false },
  access: { read: allow(...CRM_ROLES, "hr"), create: nobody, update: nobody, delete: allow() },
  fields: [
    { type: "row", fields: [
      { name: "direction", type: "select", required: true, options: ["out", "in"] },
      { name: "status", type: "select", required: true, index: true, options: [...EMAIL_STATUSES] },
    ] },
    { name: "from", type: "text", required: true },
    { name: "to", type: "text", required: true, index: true },
    { name: "subject", type: "text", required: true },
    { name: "text", type: "textarea" },
    { name: "contact", type: "relationship", relationTo: "contacts", index: true },
    { name: "enquiry", type: "relationship", relationTo: "enquiries", index: true },
    { name: "sentBy", type: "relationship", relationTo: "users" },
    { name: "inReplyTo", type: "relationship", relationTo: "emails" },
    { name: "resendId", type: "text", index: true, admin: { readOnly: true } },
    { name: "events", type: "array", admin: { readOnly: true }, fields: [
      { name: "type", type: "text", required: true },
      { name: "at", type: "date", required: true },
    ] },
  ],
};
