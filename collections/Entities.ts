import type { CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, CRM_ROLES } from "@/lib/backend/roles";
import { ENTITY_TYPES } from "@/lib/crm/vocabulary";

/** A family, HUF, company or trust that invests. HNI money usually arrives through one, with several people attached. */
export const Entities: CollectionConfig = {
  slug: "entities",
  labels: { singular: "Entity", plural: "Entities" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "type"], group: false },
  access: { read: allow(...CRM_ROLES), create: allow(...CRM_ROLES), update: allow(...CRM_ROLES), delete: allow() },
  hooks: { afterChange: [auditChange("entities")] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "type", type: "select", required: true, defaultValue: "individual", options: [...ENTITY_TYPES] },
    { name: "people", type: "join", collection: "contacts", on: "entity" },
  ],
};
