import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, everyone } from "@/lib/backend/roles";
import { TEAM_NAMES } from "@/lib/careers";

/** The roles are on /careers; any change rebuilds it. */
const rebuild = (req: PayloadRequest) => {
  if (!req.context.skipRevalidate) revalidatePath("/careers");
};
const afterChange: CollectionAfterChangeHook = ({ doc, req }) => (rebuild(req), doc);
const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => (rebuild(req), doc);

/**
 * The roles on /careers (rollout plan step 8), in this order. Seeded with
 * the eight sample roles from lib/career-roles.ts, marked Sample: the page
 * says a sample is not a live vacancy. HR sets a real role to Live. Applying
 * stays a resume email until the careers build adds its own steps.
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
    description: "The roles on the Careers page, in this order. Drag a row to move one.",
    pagination: { defaultLimit: 50 },
  },
  access: { read: everyone, create: allow("hr", "editor"), update: allow("hr", "editor"), delete: allow("hr", "editor") },
  hooks: { afterChange: [afterChange, auditChange("openings")], afterDelete: [afterDelete] },
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
        ],
        admin: { description: "A sample is labelled on the page as not a live vacancy.", components: { Cell: "/components/admin/cells/cells#KindCell" } },
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
    // The role's id in the page, kept for the first eight.
    { name: "anchor", type: "text", admin: { hidden: true } },
  ],
};
