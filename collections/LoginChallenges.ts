import type { CollectionConfig } from "payload";
import { nobody } from "@/lib/backend/roles";

/**
 * One pending sign-in between the password and the emailed code. Only server
 * code reads or writes these (lib/auth/portal.ts); the code is stored hashed
 * and the session token encrypted.
 */
export const LoginChallenges: CollectionConfig = {
  slug: "login-challenges",
  admin: { hidden: true },
  access: { read: nobody, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: "investor", type: "relationship", relationTo: "investors", required: true },
    { name: "nonceHash", type: "text", required: true },
    { name: "codeHash", type: "text", required: true },
    { name: "sealedToken", type: "text", required: true },
    { name: "sessionExpires", type: "date", required: true },
    { name: "expiresAt", type: "date", required: true, index: true },
    { name: "attempts", type: "number", required: true, defaultValue: 0 },
    { name: "consumedAt", type: "date" },
  ],
};
