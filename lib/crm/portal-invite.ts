import { randomBytes } from "node:crypto";
import type { Payload } from "payload";
import { createElement } from "react";
import { longDateTime } from "@/emails/format";
import { renderEmail } from "@/emails/render";
import { PortalInvitation, portalInvitationSubject } from "@/emails/security";
import { hasRole } from "@/lib/backend/roles";
import { siteDetails } from "@/lib/site/load-details";
import type { User } from "@/payload-types";

/*
 * Invite to the portal, from a person's page: makes their client account
 * (or finds the one already made), ties it to them, and emails a
 * set-password link that works once for seven days. The account's password
 * is random and never shown; the client sets their own. The email carries
 * the link, so it is not kept on the CRM's Emails record, where staff could
 * read the link and use it; their timeline says it was sent and until when.
 * Investors' access lets operations make accounts.
 */

const VALID_DAYS = 7;

const mask = (email: string) => email.replace(/^(.)[^@]*(@.*)$/, "$1…$2");

export async function invitePerson(payload: Payload, user: User, personId: number, origin: string): Promise<{ ok: true; validUntil: string } | { ok: false; error: string }> {
  if (!hasRole(user, "operations")) return { ok: false, error: "Operations open client accounts. Ask them to invite this person." };
  const person = await payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false });
  const email = person.email?.trim().toLowerCase();
  if (!email) return { ok: false, error: "Add their email address first: it is what they sign in with." };

  const linked = typeof person.investor === "object" ? person.investor?.id : person.investor;
  const found = linked
    ? await payload.findByID({ collection: "investors", id: linked, depth: 0, user, overrideAccess: false, disableErrors: true })
    : (await payload.find({ collection: "investors", where: { email: { equals: email } }, limit: 1, depth: 0, user, overrideAccess: false })).docs[0];
  if (found?.status === "disabled") return { ok: false, error: "Their account is switched off. Turn it back on under Client accounts first." };
  if (found?.lastSignInAt) return { ok: false, error: "They already sign in to the portal. If they forgot the password, they can ask for a new one on the sign-in page." };

  const now = new Date();
  const investor =
    found ??
    (await payload.create({
      collection: "investors",
      user,
      overrideAccess: false,
      data: { name: person.name, email, phone: person.phone ?? undefined, password: randomBytes(32).toString("base64url"), status: "active", clientCodes: [] },
    }));
  if (!linked) await payload.update({ collection: "contacts", id: personId, user, overrideAccess: false, data: { investor: investor.id } });

  // Payload's set-password token lasts the collection's 30 minutes; an invitation waits seven days.
  const token = await payload.forgotPassword({ collection: "investors", data: { email }, disableEmail: true, overrideAccess: true });
  const expires = new Date(now.getTime() + VALID_DAYS * 86_400_000);
  await payload.update({ collection: "investors", id: investor.id, overrideAccess: true, data: { invitedAt: now.toISOString(), invitedBy: user.id, resetPasswordExpiration: expires.toISOString() } as never });

  const validUntil = longDateTime(expires.toISOString());
  const message = await renderEmail(
    createElement(PortalInvitation, {
      name: person.name,
      href: `/portal/reset?token=${token}`,
      validUntil,
      account: mask(email),
      invitedBy: `${user.name}, Moneybee`,
      loginHref: "/portal/login",
      clientCodes: (investor.clientCodes ?? []) as string[],
      site: await siteDetails(),
    }),
    origin,
  );
  await payload.sendEmail({ to: email, subject: portalInvitationSubject(), ...message });
  await payload.create({
    collection: "activities",
    overrideAccess: true,
    data: { contact: personId, type: "system", summary: `${user.name} invited them to the client portal`, body: `The email lets them set a password until ${validUntil}.`, actor: user.id, at: now.toISOString() },
  });
  return { ok: true, validUntil };
}
