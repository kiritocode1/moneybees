import type { CollectionConfig } from "payload";
import { allow, everyone } from "@/lib/backend/roles";

/**
 * Public files: fact sheet PDFs and images the site shows. Anything private,
 * such as investor statements, goes in its own collection with its own access.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "File", plural: "Files" },
  admin: { group: "Files" },
  access: { read: everyone, create: allow("editor", "compliance"), update: allow("editor", "compliance"), delete: allow() },
  upload: { mimeTypes: ["application/pdf", "image/*"] },
  fields: [{ name: "alt", type: "text", admin: { description: "What the file shows, for screen readers." } }],
};
