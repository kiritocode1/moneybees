import { APIError, type CollectionBeforeLoginHook, type CollectionConfig } from "payload";
import { auditChange } from "@/lib/backend/audit";
import { allow, hasRole, nobodyField } from "@/lib/backend/roles";
import { screenIntro } from "@/lib/admin/screens";

/** A disabled account cannot sign in, whatever the password. */
const refuseDisabled: CollectionBeforeLoginHook = ({ user }) => {
  if (user.status === "disabled") throw new APIError("This account is switched off. Write to info@moneybee.in to have it turned back on.", 403);
};

/**
 * Investors who sign in to /portal. Moneybee staff create the accounts; there
 * is no public sign-up. These accounts never open /admin. Five wrong
 * passwords lock the account for ten minutes; a session lasts two hours.
 */
export const Investors: CollectionConfig = {
  slug: "investors",
  labels: { singular: "Client account", plural: "Client accounts" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "status", "updatedAt"], group: "Settings", components: screenIntro("clientAccounts") },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600_000,
    forgotPassword: {
      expiration: 30 * 60_000,
      generateEmailSubject: () => "Set your Moneybee portal password",
      // Drawn by emails/security.tsx SetPassword; imported here only when an email is sent.
      generateEmailHTML: async (args) => (await import("@/emails/password-emails")).investorPasswordEmail(args),
    },
  },
  access: {
    admin: () => false,
    read: ({ req }) => (hasRole(req.user, "operations") ? true : req.user?.collection === "investors" ? { id: { equals: req.user.id } } : false),
    create: allow("operations", "integration"),
    update: allow("operations", "integration"),
    delete: allow(),
  },
  hooks: { beforeLogin: [refuseDisabled], afterChange: [auditChange("investors")] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text" },
    {
      name: "clientCodes",
      type: "text",
      hasMany: true,
      admin: { description: "Back-office client codes. Statement files named with these codes go to this investor." },
    },
    { name: "status", type: "select", required: true, defaultValue: "active", options: ["active", "disabled"], admin: { position: "sidebar" } },
    {
      // Browsers that passed the emailed code. Each is a hash of a cookie, never the cookie itself.
      name: "trustedDevices",
      type: "array",
      access: { read: nobodyField, create: nobodyField, update: nobodyField },
      admin: { hidden: true },
      fields: [
        { name: "hash", type: "text", required: true },
        { name: "lastUsedAt", type: "date", required: true },
      ],
    },
  ],
};
