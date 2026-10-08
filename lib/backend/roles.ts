import type { Access, FieldAccess, PayloadRequest } from "payload";

/**
 * Staff roles. A person can hold several. Admin passes every check; the rest
 * open only the collections their job needs (plan §4). Investors and
 * distributors are separate accounts and never hold a role.
 */
export const ROLES = ["admin", "editor", "compliance", "sales", "hr", "operations", "integration"] as const;
export type Role = (typeof ROLES)[number];

/** True when the user is staff and is an admin or holds one of `roles`. */
export function hasRole(user: PayloadRequest["user"] | undefined, ...roles: readonly Role[]): boolean {
  if (user?.collection !== "users") return false;
  return Boolean(user.roles?.some((role) => role === "admin" || roles.includes(role)));
}

/** Collection access for staff holding any of `roles`. `allow()` is admin only. */
export const allow =
  (...roles: readonly Role[]): Access =>
  ({ req }) =>
    hasRole(req.user, ...roles);

/** Field access for staff holding any of `roles`. */
export const allowField =
  (...roles: readonly Role[]): FieldAccess =>
  ({ req }) =>
    hasRole(req.user, ...roles);

/** Readable by anyone, including the public site. */
export const everyone: Access = () => true;

/** Nobody through the API or admin; only server code with `overrideAccess`. */
export const nobody: Access = () => false;

/** The same, for a single field. */
export const nobodyField: FieldAccess = () => false;
