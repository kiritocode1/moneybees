import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES, ROLES } from "@/lib/backend/roles";
import { ENQUIRY_KINDS, SEVERITIES, SEVERITY_LABELS } from "@/lib/crm/severity";
import { ENQUIRY_KIND_LABELS, STEP_TICKS, STEP_WHEN } from "@/lib/crm/vocabulary";
import { screenIntro } from "@/lib/admin/screens";

/**
 * What to do with an enquiry of a given kind and severity: how fast to
 * answer, who should take it, the steps, and the template to start the reply
 * from. The first playbook (lowest order) that matches is shown on the
 * enquiry, so anyone who opens it knows the right approach. When someone
 * takes the enquiry, each step becomes their task, due when the step says
 * (lib/crm/tasks.ts); a step can tick itself when its event happens. A step
 * marked as a rule stays a line to keep in mind.
 */
export const Playbooks: CollectionConfig = {
  slug: "playbooks",
  admin: { useAsTitle: "name", defaultColumns: ["name", "kinds", "severities", "responseHours"], group: "Settings", components: screenIntro("playbooks") },
  defaultSort: "order",
  access: { read: allow(...CRM_ROLES), create: allow("compliance"), update: allow("compliance"), delete: allow("compliance") },
  fields: [
    { name: "name", type: "text", required: true },
    { type: "row", fields: [
      {
        name: "kinds",
        type: "select",
        hasMany: true,
        options: ENQUIRY_KINDS.map((value) => ({ value, label: ENQUIRY_KIND_LABELS[value] })),
        admin: { description: "Leave empty for every kind." },
      },
      {
        name: "severities",
        type: "select",
        hasMany: true,
        options: SEVERITIES.map((value) => ({ value, label: SEVERITY_LABELS[value] })),
        admin: { description: "Leave empty for every severity." },
      },
    ] },
    { type: "row", fields: [
      { name: "responseHours", type: "number", required: true, min: 0.25, label: "Reply within (hours)" },
      { name: "order", type: "number", required: true, defaultValue: 100, admin: { description: "Lower wins when several match." } },
    ] },
    { name: "handlerRoles", type: "select", hasMany: true, options: ROLES.filter((role) => role !== "integration").map((role) => role), label: "Who should take it" },
    {
      name: "steps",
      type: "array",
      labels: { singular: "Step", plural: "Steps" },
      fields: [
        { name: "step", type: "text", required: true },
        { type: "row", fields: [
          { name: "when", type: "select", required: true, defaultValue: "reply", options: [...STEP_WHEN], label: "Due", admin: { description: "Each step becomes a task for whoever takes the enquiry." } },
          { name: "ticksWhen", type: "select", options: [...STEP_TICKS], label: "Ticks itself when", admin: { description: "Leave empty to tick it by hand." } },
        ] },
      ],
    },
    { name: "template", type: "relationship", relationTo: "email-templates", label: "Reply template" },
  ],
};
