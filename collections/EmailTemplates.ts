import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { TEMPLATE_PURPOSES } from "@/lib/crm/vocabulary";

/**
 * The words of Moneybee's emails: a subject and the letter's own paragraphs
 * per email (`purpose`), edited on the /admin Emails page beside the email
 * itself (components/admin/emails), so this list is kept off the sidebar.
 * The emails in emails/ draw the frame, facts, signature and disclosures
 * around these words. Merge fields in double braces are filled in at send
 * time; each email lists the ones it fills. `design` and `html` hold words
 * made in the earlier block editor; saving on the Emails page clears them.
 * `goesWith` lists the files attached whenever the letter is picked
 * (lib/files/library.ts refs), set by compliance on the Emails page.
 */
export const EmailTemplates: CollectionConfig = {
  slug: "email-templates",
  labels: { singular: "Email template", plural: "Email templates" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "purpose", "updatedAt"], group: "Settings", hidden: true },
  access: { read: allow(...CRM_ROLES, "hr"), create: allow("compliance", "hr"), update: allow("compliance", "hr"), delete: allow("compliance") },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true },
      { name: "purpose", type: "select", required: true, options: [...TEMPLATE_PURPOSES], index: true },
    ] },
    { name: "subject", type: "text", required: true },
    { name: "body", type: "textarea", label: "Words" },
    { name: "design", type: "json", admin: { hidden: true } },
    { name: "html", type: "textarea", admin: { hidden: true } },
    { name: "goesWith", type: "text", hasMany: true, admin: { hidden: true } },
  ],
};
