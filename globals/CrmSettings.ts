import type { GlobalConfig } from "payload";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { screenIntro } from "@/lib/admin/screens";

/** Defaults the enquiry desk runs on. A playbook's own reply time wins over these. */
export const CrmSettings: GlobalConfig = {
  slug: "crm-settings",
  label: "Enquiry settings",
  admin: { group: "Settings", hideAPIURL: true, components: { elements: screenIntro("enquirySettings") } },
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
      label: "AI",
      admin: {
        description: "Every AI feature starts off. Each sends only what its line says, through Vercel AI Gateway with zero data retention, and needs Gateway credits to run.",
      },
      fields: [
        { type: "row", fields: [
          { name: "triage", type: "checkbox", defaultValue: false, label: "Read new enquiries (Jev)", admin: { description: "Sends the enquiry's answers, without name, email or phone. Jev can raise its severity, never lower it." } },
          { name: "triageConfidence", type: "number", required: true, defaultValue: 0.7, min: 0.5, max: 0.99, label: "Raise severity when the AI is at least this sure" },
        ] },
        { type: "row", fields: [
          { name: "complianceGate", type: "checkbox", defaultValue: false, label: "Check emails before they send (Jev)", admin: { description: "Sends each outgoing email. One that promises returns, skips a disclaimer or sends AIF material to a non-holder is held for compliance." } },
          { name: "complianceBlock", type: "number", required: true, defaultValue: 0.5, min: 0.05, max: 0.95, label: "Hold an email when a compliance risk is at least this likely" },
        ] },
        { name: "drafts", type: "checkbox", defaultValue: false, label: "Draft replies and briefs when staff ask (Opus)", admin: { description: "Sends the enquiry, its playbook and the person's history, only when someone clicks Draft." } },
        { name: "resumeReading", type: "checkbox", defaultValue: false, label: "Read uploaded resumes into the apply form (Haiku)", admin: { description: "Sends the applicant's resume as they upload it." } },
        { name: "applicantScreen", type: "checkbox", defaultValue: false, label: "Score applicants against the opening (Jev)", admin: { description: "Sends each application and the opening's must-haves." } },
      ],
    },
    {
      name: "visitorId",
      type: "checkbox",
      defaultValue: false,
      label: "Remember a visitor's page views before they enquire",
      admin: { description: "Keeps an anonymous ID in the visitor's browser, so the pages they read show on their record once they enquire." },
    },
  ],
};
