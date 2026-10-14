import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";
import { TEAM_NAMES } from "@/lib/careers";
import { screenIntro } from "@/lib/admin/screens";

/** The roles are on /careers; any change rebuilds it. */
const rebuild = (req: PayloadRequest) => {
  if (!req.context.skipRevalidate) revalidatePath("/careers");
};
const afterChange: CollectionAfterChangeHook = ({ doc, req }) => (rebuild(req), doc);
const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => (rebuild(req), doc);

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "role";

/** A new role's web address, /careers/apply/<anchor>, from its name: "equity-research-analyst", then "-2" if taken. */
const setAnchor: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== "create" || data.anchor || !data.title) return data;
  const base = slugify(String(data.title));
  for (let n = 1; ; n += 1) {
    const anchor = n === 1 ? base : `${base}-${n}`;
    const { totalDocs } = await req.payload.count({ collection: "openings", where: { anchor: { equals: anchor } }, overrideAccess: true, req });
    if (totalDocs === 0) return { ...data, anchor };
  }
};

/**
 * The roles on /careers (rollout plan step 8), in this order. Seeded with
 * the eight sample roles from lib/career-roles.ts, marked Sample: the page
 * says a sample is not a live vacancy. HR sets a real role to Live, which
 * opens its apply form at /careers/apply/<anchor> (lib/hiring/apply.ts), and
 * to Closed once it is filled: it leaves the site, its applications stay.
 */
export const Openings: CollectionConfig = {
  slug: "openings",
  labels: { singular: "Opening", plural: "Openings" },
  orderable: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "team", "status"],
    // Listed under Website in the sidebar by components/admin/nav-links.tsx.
    group: false,
    hideAPIURL: true,
    components: screenIntro("openings"),
    pagination: { defaultLimit: 50 },
  },
  access: { read: everyone, create: allow("hr", "editor"), update: allow("hr", "editor"), delete: allow("hr", "editor") },
  hooks: { beforeChange: [setAnchor], afterChange: [afterChange, auditChange("openings")], afterDelete: [afterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "title", type: "text", required: true, label: "Role" },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "live",
        label: "Kind",
        options: [
          { value: "live", label: "Live vacancy" },
          { value: "sample", label: "Sample, not a vacancy" },
          { value: "closed", label: "Closed, not on the site" },
        ],
        admin: { description: "Live takes applications. A sample is labelled on the page as not a live vacancy. Closed leaves the site and keeps its applications.", components: { Cell: "/components/admin/cells/cells#KindCell" } },
      },
    ] },
    { type: "row", fields: [
      { name: "team", type: "select", required: true, label: "Team", options: Object.entries(TEAM_NAMES).map(([value, label]) => ({ value, label })) },
      { name: "location", type: "text", required: true, label: "Location", defaultValue: "Mumbai" },
      { name: "employment", type: "text", required: true, label: "Type", defaultValue: "Full-time", admin: { description: "e.g. Full-time, Internship." } },
    ] },
    { name: "summary", type: "textarea", required: true, label: "Summary" },
    {
      name: "responsibilities",
      type: "array",
      label: "About the work",
      labels: { singular: "Line", plural: "Lines" },
      minRows: 1,
      fields: [{ name: "line", type: "text", required: true, label: "Line" }],
    },
    {
      name: "mustHaves",
      type: "array",
      label: "Must-haves",
      labels: { singular: "Must-have", plural: "Must-haves" },
      admin: { description: "Each one is asked as a yes or no question on the apply form, e.g. \"Two or more years of equity research\"." },
      fields: [{ name: "line", type: "text", required: true, label: "Must-have" }],
    },
    // The role's id in the page and its apply address, /careers/apply/<anchor>; set from the name when a role is added.
    { name: "anchor", type: "text", index: true, admin: { hidden: true } },
  ],
};
