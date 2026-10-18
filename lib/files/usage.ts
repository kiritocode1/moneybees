import type { Payload } from "payload";
import { CATALOGUE } from "@/emails";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { EMAIL_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import type { Contact } from "@/payload-types";

/*
 * Where every file is used, worked out from what points at it rather than
 * kept by hand, so it cannot drift: team portraits, Investor Centre cards,
 * fact sheets, pictures on the pages, the letters it goes with, and every
 * email that carried it. Keyed by lib/files/library.ts ref.
 */

/** `short` is the list's Used in column; `label` the file panel's line. */
export type Place = { kind: "team" | "card" | "fact-sheet" | "page" | "letter"; short: string; label: string; href: string };
export type SentWith = { emailId: number; person: string; personHref: string | null; subject: string; at: string; status: string; opened: boolean };

const idOf = (value: unknown) => (typeof value === "number" ? value : value && typeof value === "object" && "id" in value && typeof value.id === "number" ? value.id : null);

/** Every Media id in a page under a key named "photo", the one upload field the page sections use (globals/pages/blocks.ts). */
function photosIn(value: unknown, found: Set<number>) {
  if (Array.isArray(value)) for (const item of value) photosIn(item, found);
  else if (value && typeof value === "object") {
    for (const [key, inner] of Object.entries(value)) {
      const id = key === "photo" ? idOf(inner) : null;
      if (id) found.add(id);
      else photosIn(inner, found);
    }
  }
}

/** Catalogue entries by template purpose, so a letter's Goes with links to it on the Emails page. */
const entryByPurpose = new Map(CATALOGUE.flatMap((entry) => (entry.template ? [[STARTER_TEMPLATES[entry.template].purpose as string, entry.id] as const] : [])));

/** `hr` includes emails to applicants, which only HR may read (collections/Emails.ts). */
export async function fileUsage(payload: Payload, { hr }: { hr: boolean }) {
  const places = new Map<string, Place[]>();
  const sent = new Map<string, SentWith[]>();
  const add = (ref: string, place: Place) => places.set(ref, [...(places.get(ref) ?? []), place]);

  const pageGlobals = payload.config.globals.filter((global) => global.slug.endsWith("-page"));
  const [team, cards, sheets, templates, emails, pages] = await Promise.all([
    payload.find({ collection: "team-members", where: { photo: { exists: true } }, limit: 200, depth: 0, overrideAccess: true, select: { name: true, photo: true } }),
    payload.find({ collection: "documents", where: { file: { exists: true } }, limit: 200, depth: 0, overrideAccess: true, select: { title: true, file: true } }),
    payload.find({ collection: "fact-sheets", where: { pdf: { exists: true } }, sort: "-asOf", limit: 300, depth: 1, overrideAccess: true, select: { title: true, pdf: true, status: true, product: true, asOf: true } }),
    payload.find({ collection: "email-templates", limit: 200, depth: 0, overrideAccess: true, select: { name: true, purpose: true, goesWith: true } }),
    payload.find({
      collection: "emails",
      where: { "attachments.ref": { exists: true }, ...(hr ? {} : { application: { exists: false } }) },
      sort: "-createdAt",
      limit: 1000,
      depth: 1,
      overrideAccess: true,
      select: { attachments: true, contact: true, application: true, to: true, subject: true, status: true, createdAt: true },
    }),
    Promise.all(pageGlobals.map(async (global) => ({ global, doc: await payload.findGlobal({ slug: global.slug as never, depth: 0, overrideAccess: true }) }))),
  ]);

  for (const member of team.docs) {
    const id = idOf(member.photo);
    if (id) add(`media:${id}`, { kind: "team", short: "Team", label: `Team, ${member.name}'s portrait`, href: `/admin/collections/team-members/${member.id}` });
  }
  for (const card of cards.docs) {
    const id = idOf(card.file);
    if (id) add(`media:${id}`, { kind: "card", short: "Investor Centre", label: `Investor Centre, the ${card.title} card`, href: `/admin/collections/documents/${card.id}` });
  }
  for (const sheet of sheets.docs) {
    const id = idOf(sheet.pdf);
    if (id) add(`media:${id}`, { kind: "fact-sheet", short: "Fact sheets", label: `Fact sheet, ${sheet.title ?? "untitled"}`, href: `/admin/collections/fact-sheets/${sheet.id}` });
  }
  for (const { global, doc } of pages) {
    const found = new Set<number>();
    photosIn(doc, found);
    const label = typeof global.label === "string" ? global.label : global.slug;
    for (const id of found) add(`media:${id}`, { kind: "page", short: label, label: `${label}, a picture`, href: `/admin/globals/${global.slug}` });
  }

  // A letter's "latest fact sheet" counts against today's newest approved sheet of that product.
  const latest = new Map<string, number>();
  for (const sheet of sheets.docs) {
    const slug = sheet.product && typeof sheet.product === "object" ? sheet.product.slug : null;
    const id = idOf(sheet.pdf);
    if (slug && id && sheet.status === "published" && !latest.has(slug)) latest.set(slug, id);
  }
  for (const row of templates.docs) {
    const entry = entryByPurpose.get(row.purpose);
    for (const ref of row.goesWith ?? []) {
      const slug = ref.startsWith("latest-fact-sheet:") ? ref.slice("latest-fact-sheet:".length) : null;
      const target = slug ? (latest.has(slug) ? `media:${latest.get(slug)}` : null) : ref;
      if (target) add(target, { kind: "letter", short: `${row.name} letter`, label: `Goes with the ${row.name} letter${slug ? ", as the latest fact sheet" : ""}`, href: entry ? `/admin/emails?email=${entry}` : "/admin/emails" });
    }
  }

  for (const email of emails.docs) {
    const contact = email.contact && typeof email.contact === "object" ? (email.contact as Contact) : null;
    const applicant = email.application && typeof email.application === "object" ? email.application : null;
    for (const { ref } of email.attachments ?? []) {
      sent.set(ref, [
        ...(sent.get(ref) ?? []),
        {
          emailId: email.id,
          person: contact?.name ?? applicant?.name ?? email.to,
          personHref: contact ? `/admin/people/${contact.id}` : applicant ? `/admin/hiring/${applicant.id}` : null,
          subject: email.subject,
          at: email.createdAt,
          status: labelOf(EMAIL_STATUSES, email.status),
          opened: ["opened", "clicked"].includes(email.status),
        },
      ]);
    }
  }
  return { places, sent };
}
