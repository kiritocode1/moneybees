import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { TEMPLATE_PURPOSES } from "@/lib/crm/vocabulary";
import { screenIntro } from "@/lib/admin/screens";

/**
 * Emails staff send from /admin, and the automatic ones, designed in React
 * Email's editor (components/admin/email-editor). `design` is what staff
 * edit; `html` and `body` (plain text) are exported from it on every change,
 * so sending never needs the editor. Merge fields in double braces are filled
 * in at send time: {{firstName}}, {{name}}, {{reference}}, {{role}}, {{senderName}}.
 */
export const EmailTemplates: CollectionConfig = {
  slug: "email-templates",
  labels: { singular: "Email template", plural: "Email templates" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "purpose", "updatedAt"], group: "Settings", components: screenIntro("emailTemplates") },
  access: { read: allow(...CRM_ROLES, "hr"), create: allow("compliance", "hr"), update: allow("compliance", "hr"), delete: allow("compliance") },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true },
      { name: "purpose", type: "select", required: true, options: [...TEMPLATE_PURPOSES], index: true },
    ] },
    { name: "subject", type: "text", required: true },
    {
      name: "design",
      type: "json",
      label: "Email",
      admin: { components: { Field: "/components/admin/email-editor/template-editor-field#TemplateEditorField" } },
    },
    { name: "html", type: "textarea", admin: { hidden: true } },
    { name: "body", type: "textarea", label: "Plain text", admin: { hidden: true } },
  ],
};
