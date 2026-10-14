import type { CollectionConfig } from "payload";
import { allow, nobody } from "@/lib/backend/roles";
import { TEAM_NAMES } from "@/lib/careers";
import { CLOSE_REASONS, NOTICE_PERIODS, STAGES } from "@/lib/hiring/stages";

/**
 * One application from /careers/apply (lib/hiring/apply.ts), worked at
 * /admin/hiring. The person's details live here, not in Contacts, so the sales
 * roles never see a candidate. Only server code creates one. `history` is the
 * application's own timeline; there is no audit hook, because it would copy
 * personal data into a log the deletion date never reaches.
 */
export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Application", plural: "Applications" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "roleTitle", "stage", "receivedAt"], group: false, hideAPIURL: true },
  defaultSort: "-receivedAt",
  access: { read: allow("hr"), create: nobody, update: allow("hr"), delete: allow("hr") },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "text", required: true, index: true },
      { name: "phone", type: "text" },
    ] },
    { type: "row", fields: [
      { name: "city", type: "text" },
      { name: "linkedin", type: "text", label: "LinkedIn" },
      { name: "notice", type: "select", options: [...NOTICE_PERIODS] },
    ] },
    { type: "row", fields: [
      { name: "opening", type: "relationship", relationTo: "openings", index: true, admin: { description: "Empty for an open application." } },
      { name: "roleTitle", type: "text", required: true, admin: { description: "The role as it was named when they applied." } },
      { name: "team", type: "select", options: Object.entries(TEAM_NAMES).map(([value, label]) => ({ value, label })) },
    ] },
    { type: "row", fields: [
      { name: "stage", type: "select", required: true, defaultValue: "new", index: true, options: [...STAGES] },
      { name: "closeReason", type: "select", options: [...CLOSE_REASONS], admin: { condition: (data) => data.stage === "closed" } },
      { name: "owner", type: "relationship", relationTo: "users", index: true },
    ] },
    {
      name: "mustHaves",
      type: "array",
      labels: { singular: "Must-have", plural: "Must-haves" },
      admin: { description: "Each must-have on the opening when they applied, and their answer." },
      fields: [
        { type: "row", fields: [
          { name: "question", type: "text", required: true },
          { name: "answer", type: "select", required: true, options: ["yes", "no"] },
        ] },
      ],
    },
    { name: "why", type: "textarea", label: "Why this role" },
    { name: "experience", type: "textarea", admin: { description: "Asked only when they sent no resume." } },
    {
      name: "resume",
      type: "group",
      admin: { description: "Kept privately (lib/hiring/resume-store.ts) and opened from the Hiring screen." },
      fields: [
        { type: "row", fields: [
          { name: "key", type: "text", admin: { hidden: true } },
          { name: "name", type: "text", admin: { readOnly: true } },
          { name: "size", type: "number", admin: { readOnly: true } },
          { name: "type", type: "text", admin: { readOnly: true } },
        ] },
      ],
    },
    {
      name: "interviews",
      type: "array",
      fields: [
        { type: "row", fields: [
          { name: "at", type: "date", required: true, index: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
          { name: "with", type: "text", required: true },
          { name: "place", type: "text", required: true },
        ] },
        { name: "note", type: "textarea" },
      ],
    },
    {
      name: "history",
      type: "array",
      admin: { readOnly: true, description: "Everything that happened to the application, newest last." },
      fields: [
        { type: "row", fields: [
          { name: "at", type: "date", required: true },
          { name: "kind", type: "select", required: true, options: ["applied", "stage", "email", "interview", "note", "owner", "system"] },
          { name: "actor", type: "relationship", relationTo: "users" },
        ] },
        { name: "summary", type: "text", required: true },
        { name: "body", type: "textarea" },
        { name: "email", type: "relationship", relationTo: "emails" },
      ],
    },
    { name: "screen", type: "json", admin: { readOnly: true, description: "Jev's reading of the answers, when Score applicants is on. A suggestion only." } },
    { name: "receivedAt", type: "date", required: true, index: true, admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
    { name: "consentAt", type: "date", required: true, admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
    { name: "deleteAfter", type: "date", required: true, index: true, admin: { position: "sidebar", description: "The application and its resume are deleted on this day." } },
    {
      name: "origin",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        { name: "page", type: "text" },
        { name: "ipHash", type: "text", index: true, admin: { hidden: true } },
      ],
    },
  ],
};
