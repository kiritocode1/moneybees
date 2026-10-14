import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";
import { screenIntro } from "@/lib/admin/screens";

/** The carousel is on /about; any change rebuilds it. */
const rebuildAbout = (req: PayloadRequest) => {
  if (!req.context.skipRevalidate) revalidatePath("/about");
};
const afterChange: CollectionAfterChangeHook = ({ doc, req }) => (rebuildAbout(req), doc);
const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => (rebuildAbout(req), doc);

/**
 * The people in /about's Our Team carousel, in the order they appear: drag
 * to reorder in the list. Seeded from lib/insights.ts TEAM; the first six
 * keep their photographs in /public until a new one is uploaded.
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team member", plural: "Team" },
  orderable: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role"],
    // Listed under Website in the sidebar by components/admin/nav-links.tsx.
    group: false,
    hideAPIURL: true,
    components: screenIntro("team"),
  },
  access: { read: everyone, create: allow("editor", "hr"), update: allow("editor", "hr"), delete: allow("editor", "hr") },
  hooks: { afterChange: [afterChange, auditChange("team-members")], afterDelete: [afterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { components: { Cell: "/components/admin/cells/cells#PersonCell" } } },
      { name: "role", type: "text", required: true, admin: { description: "As it should read under the name, e.g. Compliance Officer, PMS." } },
    ] },
    { name: "photo", type: "upload", relationTo: "media", label: "Portrait", admin: { description: "A portrait, 3 wide by 4 tall. It shows in grey." } },
    { name: "photoPath", type: "text", admin: { hidden: true } },
    { name: "linkedin", type: "text", label: "LinkedIn address", admin: { description: "Leave empty if not confirmed; the LinkedIn button only shows when this is set." } },
    {
      name: "points",
      type: "array",
      label: "About them",
      labels: { singular: "Line", plural: "Lines" },
      minRows: 1,
      admin: { description: "The first line is set large; the rest are listed under it." },
      fields: [{ name: "point", type: "textarea", required: true }],
    },
  ],
};
