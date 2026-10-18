import type { CollectionConfig } from "payload";
import { allow, CRM_ROLES, everyone } from "@/lib/backend/roles";
import { screenIntro } from "@/lib/admin/screens";

/**
 * Public files: fact sheet PDFs and images the site shows. Anything private,
 * such as investor statements, goes in its own collection with its own access
 * (Private files). Both are listed on the Files screen (/admin/files, Desk
 * menu), so Media is kept off Payload's sidebar; its list and edit form stay
 * reachable for alt text and focus.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "File", plural: "Files" },
  admin: { group: false, components: screenIntro("files") },
  // Staff who design email templates add the images those emails show.
  access: { read: everyone, create: allow("editor", "hr", ...CRM_ROLES), update: allow("editor", "compliance"), delete: allow() },
  upload: { mimeTypes: ["application/pdf", "image/*"] },
  fields: [{ name: "alt", type: "text", admin: { description: "What the file shows, for screen readers." } }],
};
