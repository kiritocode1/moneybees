import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";
import { DOCUMENT_ART_NAMES, DOCUMENT_GROUPS } from "@/lib/investor-centre";
import { screenIntro } from "@/lib/admin/screens";

/** The cards are on /investor-centre; any change rebuilds it. */
const rebuild = (req: PayloadRequest) => {
  if (!req.context.skipRevalidate) revalidatePath("/investor-centre");
};
const afterChange: CollectionAfterChangeHook = ({ doc, req }) => (rebuild(req), doc);
const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => (rebuild(req), doc);

/**
 * The Investor Centre's documents (rollout plan step 4), one card each, in
 * this order under their group. A card links to its uploaded file or web
 * address; with neither it says "Available on request". The four groups
 * are fixed in lib/investor-centre.ts, because the menu and the footer link
 * to them. Seeded with the content plan's eleven, without files.
 */
export const Documents: CollectionConfig = {
  slug: "documents",
  labels: { singular: "Document", plural: "Documents" },
  orderable: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "group", "file", "date"],
    // Listed under Website in the sidebar by components/admin/nav-links.tsx.
    group: false,
    hideAPIURL: true,
    components: screenIntro("documents"),
    // All on one page, so any row can be dragged anywhere.
    pagination: { defaultLimit: 50 },
  },
  access: { read: everyone, create: allow("editor", "compliance"), update: allow("editor", "compliance"), delete: allow("editor", "compliance") },
  hooks: { afterChange: [afterChange, auditChange("documents")], afterDelete: [afterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "title", type: "text", required: true, label: "Title on the card" },
      {
        name: "group",
        type: "select",
        required: true,
        label: "Group",
        options: DOCUMENT_GROUPS.map(({ id, heading }) => ({ value: id, label: heading })),
      },
    ] },
    { type: "row", fields: [
      { name: "file", type: "upload", relationTo: "media", label: "File", admin: { description: "The approved PDF. Visitors open it from the card.", components: { Cell: "/components/admin/cells/cells#FileCell" } } },
      { name: "link", type: "text", label: "Or a web address", admin: { description: "For a page on another site, such as SEBI's SCORES. Used only when no file is uploaded." } },
    ] },
    { type: "row", fields: [
      {
        name: "date",
        type: "date",
        label: "Dated",
        admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" }, description: "Printed on the card. Empty shows Date to follow.", components: { Cell: "/components/admin/cells/cells#DateCell" } },
      },
      {
        name: "drawing",
        type: "select",
        required: true,
        label: "Drawing",
        defaultValue: "forms",
        options: Object.entries(DOCUMENT_ART_NAMES).map(([value, label]) => ({ value, label })),
      },
    ] },
    // The card's anchor on the page, kept for the first eleven so links to them hold.
    { name: "anchor", type: "text", admin: { hidden: true } },
  ],
};
