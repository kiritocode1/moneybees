import type { CollectionAfterDeleteHook, CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { deletePrivate } from "@/lib/backend/private-blob";
import { allow, CRM_ROLES } from "@/lib/backend/roles";

const removeFile: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc.key) await deletePrivate(doc.key);
  return doc;
};

/**
 * Files only the people they are sent to may see: the Flyingbee PPM, fee
 * illustrations, anything for one client. The file itself sits in the
 * private store (lib/backend/private-blob.ts) under files/; this row holds
 * its name and size. Staff open one signed in at /api/files/private/:id and
 * emails carry it as an attachment, never as a link. Files that may go on
 * the website are Media.
 */
export const PrivateFiles: CollectionConfig = {
  slug: "private-files",
  labels: { singular: "Private file", plural: "Private files" },
  // Listed with Media on the Files screen, never on its own.
  admin: { useAsTitle: "title", hidden: true },
  access: { read: allow(...CRM_ROLES, "hr"), create: allow(...CRM_ROLES, "hr"), update: allow(...CRM_ROLES, "hr"), delete: allow("compliance") },
  hooks: { afterChange: [auditChange("private-files")], afterDelete: [removeFile] },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "filename", type: "text", required: true },
      { name: "mimeType", type: "text", required: true },
      { name: "filesize", type: "number", required: true },
    ] },
    { name: "key", type: "text", required: true, unique: true, admin: { readOnly: true } },
    { name: "uploadedBy", type: "relationship", relationTo: "users", admin: { readOnly: true } },
  ],
};
