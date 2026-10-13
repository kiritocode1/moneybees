import type { GlobalConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";

/** Defaults the enquiry desk runs on. A playbook's own reply time wins over these. */
export const CrmSettings: GlobalConfig = {
  slug: "crm-settings",
  label: "Enquiry settings",
  admin: { group: "Settings" },
  access: { read: allow(...CRM_ROLES), update: allow("compliance") },
  fields: [
    {
      name: "responseHours",
      type: "group",
      label: "Reply within (hours), when no playbook says otherwise",
      fields: [
        { type: "row", fields: [
          { name: "critical", type: "number", required: true, defaultValue: 2, min: 0.25 },
          { name: "high", type: "number", required: true, defaultValue: 8, min: 0.25 },
          { name: "normal", type: "number", required: true, defaultValue: 24, min: 0.25 },
          { name: "low", type: "number", required: true, defaultValue: 72, min: 0.25 },
        ] },
      ],
    },
    { name: "acknowledge", type: "checkbox", defaultValue: true, label: "Email the visitor that their enquiry arrived" },
    {
      name: "ai",
      type: "group",
      label: "AI thresholds",
      admin: { description: "Only used while the matching AI flag is on." },
      fields: [
        { type: "row", fields: [
          { name: "triageConfidence", type: "number", required: true, defaultValue: 0.7, min: 0.5, max: 0.99, label: "Raise severity when the AI is at least this sure" },
          { name: "complianceBlock", type: "number", required: true, defaultValue: 0.5, min: 0.05, max: 0.95, label: "Hold an email when a compliance risk is at least this likely" },
        ] },
      ],
    },
  ],
};
