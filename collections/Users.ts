import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, allowField, hasRole, ROLES } from "@/lib/backend/roles";

/** The very first account becomes the admin, so a fresh database can be set up from /admin. */
const firstUserIsAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== "create") return data;
  const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true, req });
  return totalDocs === 0 ? { ...data, roles: ["admin"] } : data;
};

/**
 * Moneybee staff. The only accounts that can open /admin; investors and
 * distributors get their own collections later (plan §4). Five wrong
 * passwords lock the account for ten minutes; a session lasts two hours.
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Staff member", plural: "Staff" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "roles"], group: "Accounts" },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600_000 },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    create: allow(),
    update: ({ req, id }) => hasRole(req.user) || req.user?.id === id,
    delete: allow(),
  },
  hooks: { beforeChange: [firstUserIsAdmin], afterChange: [auditChange("users")] },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      options: [...ROLES],
      access: { update: allowField() },
      admin: { description: "Admin can do everything. Compliance approves anything that shows numbers. Only an admin can change roles." },
    },
  ],
};
