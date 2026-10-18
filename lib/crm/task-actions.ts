"use server";

import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { dueCount } from "@/lib/crm/task-desk";
import type { User } from "@/payload-types";

/*
 * What quick add (the T key, the Tasks desk's bar) and the Desk menu ask
 * the server. Adding, ticking and undoing a task are the person screen's
 * own actions (lib/crm/person-actions.ts).
 */

async function desk() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  return user?.collection === "users" && hasRole(user, ...CRM_ROLES) ? { payload, user: user as User } : null;
}

export type ContactHit = { id: number; name: string; detail: string | null };

/** People whose name, email or phone holds the words typed: a task can be for someone with no email. */
export async function findContacts(query: string): Promise<ContactHit[]> {
  const ctx = await desk();
  const words = query.trim().slice(0, 80);
  if (!ctx || words.length < 2) return [];
  const { docs } = await ctx.payload.find({
    collection: "contacts",
    where: { or: [{ name: { like: words } }, { email: { like: words } }, { phone: { like: words.replace(/[^\d+]/g, "") || words } }] },
    sort: "name",
    limit: 8,
    depth: 0,
    user: ctx.user,
    overrideAccess: false,
  });
  return docs.map((doc) => ({ id: doc.id, name: doc.name, detail: doc.email ?? doc.phone ?? null }));
}

/** Who a task added here is for: the person on screen, or an enquiry's person; and who could own it. */
export async function taskContext(at: { personId?: number; enquiryId?: number }) {
  const ctx = await desk();
  if (!ctx) return null;
  const { payload, user } = ctx;
  const personId = at.personId ?? (at.enquiryId ? ((await payload.findByID({ collection: "enquiries", id: at.enquiryId, depth: 0, user, overrideAccess: false, disableErrors: true }))?.contact as number | null | undefined) : undefined);
  const [person, staff] = await Promise.all([
    personId ? payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false, disableErrors: true }) : null,
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
  ]);
  return { person: person ? { id: person.id, name: person.name, detail: person.email ?? person.phone ?? null } : null, staff: staff.docs.map((member) => ({ id: member.id, name: member.name })), me: user.id };
}

/** The Desk menu's count beside Tasks: yours, overdue or due today. Null for staff without the desk. */
export async function myDueCount(): Promise<number | null> {
  const ctx = await desk();
  return ctx ? dueCount(ctx.payload, ctx.user) : null;
}
