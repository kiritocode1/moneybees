import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { CONTACT_KINDS, CONTACT_SOURCES, TOPICS } from "@/lib/crm/vocabulary";
import { screenIntro } from "@/lib/admin/screens";

/** One person per email: lowercase it and keep phones as digits, so the website, imports and staff entries land on the same row. */
const normalise: CollectionBeforeChangeHook = ({ data }) => ({
  ...data,
  ...(typeof data.email === "string" ? { email: data.email.trim().toLowerCase() || null } : {}),
  ...(typeof data.phone === "string" ? { phone: data.phone.replace(/[^\d+]/g, "") || null } : {}),
});

/**
 * Everyone Moneybee talks to: prospects from the website or offline,
 * investors, distributors. The one CRM the client asked for (Linear update,
 * 4 Sep): website leads, offline entries and portal investors are all rows
 * here, and every touch is an Activity on the person's timeline.
 */
export const Contacts: CollectionConfig = {
  slug: "contacts",
  labels: { singular: "Person", plural: "People" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "kind", "owner", "lastActivityAt"],
    group: false,
    listSearchableFields: ["name", "email", "phone"],
    components: screenIntro("people"),
  },
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES, "integration"), update: allow(...CRM_ROLES, "integration"), delete: allow() },
  hooks: { beforeChange: [normalise], afterChange: [auditChange("contacts")] },
  fields: [
    { name: "name", type: "text", required: true },
    { type: "row", fields: [
      { name: "email", type: "email", unique: true, index: true },
      { name: "phone", type: "text", index: true },
      { name: "city", type: "text" },
    ] },
    { type: "row", fields: [
      { name: "kind", type: "select", required: true, defaultValue: "prospect", options: [...CONTACT_KINDS] },
      { name: "source", type: "select", options: [...CONTACT_SOURCES] },
    ] },
    { name: "entity", type: "relationship", relationTo: "entities", admin: { description: "The family, HUF, company or trust the money comes from, if not the person themselves." } },
    { name: "owner", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "referredBy", type: "relationship", relationTo: "contacts", admin: { position: "sidebar", description: "The distributor or investor who sent them." } },
    { name: "investor", type: "relationship", relationTo: "investors", admin: { position: "sidebar", description: "Their client portal account, once they invest." } },
    { name: "tags", type: "text", hasMany: true, admin: { position: "sidebar" } },
    {
      name: "topics",
      type: "select",
      hasMany: true,
      options: [...TOPICS],
      admin: { description: "Mailings this person agreed to receive. Broadcasts only go to people who chose the broadcast's topic." },
    },
    {
      name: "consent",
      type: "group",
      admin: { description: "When and where they agreed, and the wording they saw (DPDP Rules 2025)." },
      fields: [
        { type: "row", fields: [
          { name: "at", type: "date" },
          { name: "source", type: "text" },
        ] },
        { name: "wording", type: "textarea" },
      ],
    },
    { name: "unsubscribedAt", type: "date", admin: { position: "sidebar", description: "Set when they leave every mailing. No broadcast reaches them after this." } },
    { name: "lastActivityAt", type: "date", index: true, admin: { position: "sidebar", readOnly: true } },
    { name: "visitorIds", type: "text", hasMany: true, admin: { hidden: true } },
    { name: "enquiries", type: "join", collection: "enquiries", on: "contact" },
    { name: "deals", type: "join", collection: "deals", on: "contact" },
  ],
};
