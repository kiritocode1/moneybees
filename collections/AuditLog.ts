import type { CollectionConfig } from "payload";
import { allow, nobody } from "@/lib/backend/roles";

/** Every change, who made it and what moved. Written only by hooks; nobody edits or deletes it. */
export const AuditLog: CollectionConfig = {
  slug: "audit-log",
  labels: { singular: "Audit entry", plural: "Audit log" },
  admin: { useAsTitle: "summary", defaultColumns: ["createdAt", "actor", "summary"], group: "Accounts" },
  access: { read: allow("compliance"), create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: "actor", type: "relationship", relationTo: "users" },
    { name: "action", type: "text", required: true },
    { name: "collectionSlug", type: "text", required: true, index: true },
    { name: "docId", type: "text", required: true, index: true },
    { name: "summary", type: "text" },
    { name: "changes", type: "json" },
  ],
};
