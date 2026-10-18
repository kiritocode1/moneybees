"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload, type Payload } from "payload";
import { templateRow } from "@/lib/crm/email-template-row";
import { type CatalogueEntry, catalogueEntry, compose, type TemplateWords } from "@/emails";
import { renderEmail } from "@/emails/render";
import { siteOf } from "@/emails/request";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { sendCrmEmail } from "@/lib/crm/mail";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { isFileRef, resolveAttachments } from "@/lib/files/library";
import { siteDetails } from "@/lib/site/load-details";
import type { User } from "@/payload-types";

/*
 * What the /admin Emails page does (components/admin/emails): draw an email
 * with the words and facts as they stand on screen, save a template's words,
 * send a test to yourself, find a person, and send a "Send here" letter to
 * them. Every action checks the signed-in staff member; saving goes through
 * Email templates' own access (compliance and HR), sending needs a desk role.
 */

type Fail = { ok: false; error: string };
const fail = (error: string): Fail => ({ ok: false, error });

const Draft = type({ "subject?": "string <= 200", "body?": "string <= 20000", "values?": "Record<string, string>", "personId?": "number.integer > 0", "attachments?": "string[] <= 10" });
type DraftInput = typeof Draft.infer;

async function signedIn() {
  const payload = await getPayload({ config });
  const head = await headers();
  const { user } = await payload.auth({ headers: head });
  if (user?.collection !== "users") throw new Error("Sign in again.");
  return { payload, user: user as User, origin: siteOf(head) };
}

/** The words on screen if any, else the saved ones. Typed words never carry an old design. */
async function wordsFor(payload: Payload, entry: CatalogueEntry, draft: DraftInput): Promise<TemplateWords | null> {
  const saved = await templateRow(payload, entry);
  if (draft.body === undefined && draft.subject === undefined) return saved ? { subject: saved.subject, body: saved.body ?? "", html: saved.html } : null;
  const starter = entry.template ? STARTER_TEMPLATES[entry.template] : null;
  return { subject: draft.subject ?? saved?.subject ?? starter?.subject ?? "", body: draft.body ?? saved?.body ?? starter?.body ?? "", html: null };
}

async function personFor(payload: Payload, user: User, personId: number | undefined) {
  if (!personId) return null;
  return payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false, disableErrors: true });
}

/** The email as it stands on screen: words, facts and, when chosen, the person's name. Sends nothing. */
export async function drawEmail(id: string, input: DraftInput): Promise<{ ok: true; subject: string; html: string; text: string } | Fail> {
  const entry = catalogueEntry(id);
  const draft = Draft(input);
  if (!entry || draft instanceof type.errors) return fail("This email cannot be drawn.");
  const { payload, user, origin } = await signedIn();
  const person = await personFor(payload, user, draft.personId);
  const email = compose(entry, { template: await wordsFor(payload, entry, draft), values: draft.values, name: person?.name, site: await siteDetails() });
  return { ok: true, subject: email.subject, ...(await renderEmail(email.element, origin)) };
}

const Words = type({ subject: "1 <= string <= 200", body: "1 <= string <= 20000" });

/** Saves an email's words to its template. Email templates' access decides who may (compliance and HR). */
export async function saveEmailWords(id: string, input: { subject: string; body: string }): Promise<{ ok: true } | Fail> {
  const entry = catalogueEntry(id);
  const words = Words(input);
  if (!entry?.template) return fail("This email's words are fixed.");
  if (words instanceof type.errors) return fail("Write a subject and the words.");
  const { payload, user } = await signedIn();
  if (!hasRole(user, "compliance", "hr")) return fail("Only compliance or HR can change an email's words.");
  const row = await templateRow(payload, entry);
  const starter = STARTER_TEMPLATES[entry.template];
  // Plain words replace any old design, so what is saved is what is shown.
  const data = { subject: words.subject, body: words.body, html: null, design: null };
  if (row) await payload.update({ collection: "email-templates", id: row.id, user, overrideAccess: false, data });
  else await payload.create({ collection: "email-templates", user, overrideAccess: false, data: { ...data, name: starter.name, purpose: starter.purpose as never } });
  return { ok: true };
}

const GoesWith = type("string[] <= 10");

/** Saves the files a letter always carries (its Goes with). Email templates' access decides who may (compliance and HR). */
export async function saveGoesWith(id: string, refs: string[]): Promise<{ ok: true } | Fail> {
  const entry = catalogueEntry(id);
  const parsed = GoesWith(refs);
  if (!entry?.template) return fail("This email carries no files.");
  if (parsed instanceof type.errors || !parsed.every(isFileRef)) return fail("One of those files cannot be used.");
  const { payload, user } = await signedIn();
  if (!hasRole(user, "compliance", "hr")) return fail("Only compliance or HR can change what a letter goes with.");
  const row = await templateRow(payload, entry);
  const starter = STARTER_TEMPLATES[entry.template];
  if (row) await payload.update({ collection: "email-templates", id: row.id, user, overrideAccess: false, data: { goesWith: parsed } });
  else await payload.create({ collection: "email-templates", user, overrideAccess: false, data: { name: starter.name, purpose: starter.purpose as never, subject: starter.subject, body: starter.body, goesWith: parsed } });
  return { ok: true };
}

/** The email as it stands, to the signed-in staff member, subject marked [Test]. */
export async function sendEmailTest(id: string, input: DraftInput): Promise<{ ok: true; to: string } | Fail> {
  const drawn = await drawEmail(id, input);
  if (!drawn.ok) return drawn;
  const { payload, user } = await signedIn();
  const sent = await sendCrmEmail(payload, { to: user.email, subject: `[Test] ${drawn.subject}`, html: drawn.html, text: drawn.text, sentBy: user });
  if (sent.status === "logged") return fail("Email is not connected, so the test was saved but not sent.");
  if (sent.status === "failed") return fail("Resend refused the test. Try again, or check the address on your account.");
  return { ok: true, to: user.email };
}

export type PersonHit = { id: number; name: string; email: string; kind: string | null };

/** People with an email address whose name or email contains the words typed. */
export async function findPeople(query: string): Promise<PersonHit[]> {
  const { payload, user } = await signedIn();
  if (!hasRole(user, ...CRM_ROLES)) return [];
  const words = query.trim().slice(0, 80);
  if (words.length < 2) return [];
  const { docs } = await payload.find({
    collection: "contacts",
    where: { and: [{ email: { exists: true } }, { or: [{ name: { like: words } }, { email: { like: words } }] }] },
    sort: "name",
    limit: 8,
    depth: 0,
    user,
    overrideAccess: false,
  });
  return docs.filter((doc) => doc.email).map((doc) => ({ id: doc.id, name: doc.name, email: doc.email as string, kind: doc.kind ?? null }));
}

/** A placeholder left in square brackets, such as "[Why the change is being made]". */
const PLACEHOLDER = /\[[^\]]{3,}\]/;

/**
 * Sends a "Send here" letter to one person from the signed-in staff member,
 * with the words, facts and files on screen. It goes on their timeline like a reply.
 * Refused while a [placeholder] or a required fact is left.
 */
export async function sendEmailTo(id: string, input: DraftInput): Promise<{ ok: true; status: "sent" | "logged" | "failed" } | Fail> {
  const entry = catalogueEntry(id);
  const draft = Draft(input);
  if (!entry || entry.channel !== "here" || draft instanceof type.errors) return fail("This email is not sent from here.");
  const { payload, user, origin } = await signedIn();
  if (!hasRole(user, ...CRM_ROLES)) return fail("Only the desk (sales, operations, compliance) can send these.");
  const person = await personFor(payload, user, draft.personId);
  if (!person?.email) return fail("Choose who it goes to.");

  const values = draft.values ?? {};
  const missing = (entry.fields ?? []).find((field) => !field.optional && !values[field.key]?.trim());
  if (missing) return fail(`Fill in ${missing.label.toLowerCase()}.`);
  const words = await wordsFor(payload, entry, draft);
  const left = [words?.body ?? "", ...Object.values(values)].find((text) => PLACEHOLDER.test(text));
  if (left) return fail(`Replace the part in square brackets first: ${PLACEHOLDER.exec(left)?.[0]}`);

  const files = await resolveAttachments(payload, user, draft.attachments, origin ?? "");
  if (!files.ok) return files;

  const email = compose(entry, { template: words, values, name: person.name, site: await siteDetails() });
  const rendered = await renderEmail(email.element, origin);
  const sent = await sendCrmEmail(payload, { to: person.email, subject: email.subject, ...rendered, words: email.words.text, contact: person.id, sentBy: user, summary: entry.name, attachments: files.attachments });
  return { ok: true, status: sent.status };
}
