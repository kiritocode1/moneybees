"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { createElement } from "react";
import { siteOf } from "@/emails/request";
import { Letter } from "@/emails/prospects";
import { renderEmail } from "@/emails/render";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { sendCrmEmail } from "@/lib/crm/mail";
import { fillTemplate } from "@/lib/crm/template";
import { INVESTS_AS, setEntity } from "@/lib/crm/entities";
import { invitePerson } from "@/lib/crm/portal-invite";
import { markDone, tellNewOwner, tickSteps } from "@/lib/crm/tasks";
import { CONTACT_KINDS, TASK_KINDS, TOPICS } from "@/lib/crm/vocabulary";
import { resolveAttachments } from "@/lib/files/library";
import { siteDetails } from "@/lib/site/load-details";
import type { User } from "@/payload-types";

/*
 * What staff do from a person's screen (/admin/people/:id): log a call, a
 * meeting or a note, with the follow-up it suggests; add, tick off and undo
 * tasks; open or move a deal; change their details; write them a letter in
 * their own words. Letters on an enquiry go through lib/crm/admin-actions.ts
 * and client letters through lib/crm/email-desk.ts, as from those screens.
 * Every action checks the desk role and leaves a line on the timeline.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

async function staff() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users" || !hasRole(user, ...CRM_ROLES)) throw new Error("Only CRM staff can do this.");
  return { payload, user: user as User };
}
type Staff = Awaited<ReturnType<typeof staff>>;

const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : (value ?? undefined));
const kindValues = TASK_KINDS.map(({ value }) => value);

const TaskInput = type({
  title: "1 <= string <= 200",
  kind: type.enumerated(...kindValues),
  dueAt: "string.date.iso",
  ownerId: "number.integer > 0",
  "letter?": "string <= 60 | null",
});
type TaskFields = typeof TaskInput.infer;

/** Their open enquiry and their one open deal, which a new task belongs to as well. */
async function openWork({ payload, user }: Staff, personId: number) {
  const [enquiries, deals] = await Promise.all([
    payload.find({ collection: "enquiries", where: { contact: { equals: personId }, status: { in: ["new", "open", "waiting"] } }, sort: "-receivedAt", limit: 1, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "deals", where: { contact: { equals: personId }, stage: { not_in: ["invested", "lost"] } }, limit: 2, depth: 0, user, overrideAccess: false }),
  ]);
  return { enquiry: enquiries.docs[0]?.id, deal: deals.docs.length === 1 ? deals.docs[0].id : undefined };
}

/** Makes a task for this person, linked to their open enquiry and deal, and tells its owner when someone else gave it. */
async function createTask(ctx: Staff, personId: number, task: TaskFields, source: string) {
  const { payload, user } = ctx;
  const work = await openWork(ctx, personId);
  const created = await payload.create({
    collection: "tasks",
    user,
    overrideAccess: false,
    data: { title: task.title.trim(), kind: task.kind, source: source as never, dueAt: task.dueAt, owner: task.ownerId, contact: personId, enquiry: work.enquiry, deal: work.deal, letter: task.letter ?? null, createdBy: user.id },
  });
  await tellNewOwner(payload, task.ownerId, user, [created], siteOf(await headers()) ?? "");
}

const touch = ({ payload, user }: Staff, personId: number) => payload.update({ collection: "contacts", id: personId, user, overrideAccess: false, data: { lastActivityAt: new Date().toISOString() } });

const OUTCOMES = { spoke: "spoke", no_answer: "no answer", left_message: "left a message", wrong_number: "wrong number" } as const;

const LogInput = type({
  kind: "'call' | 'meeting' | 'note'",
  text: "string <= 10000",
  "outcome?": "'spoke' | 'no_answer' | 'left_message' | 'wrong_number'",
  "then?": TaskInput,
});

/** A call, meeting or note on their timeline, and the follow-up ticked under it. A call needs only its outcome. */
export async function logActivity(personId: number, input: typeof LogInput.infer): Promise<ActionResult> {
  const parsed = LogInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Check the follow-up: it needs what, when and who." };
  if (parsed.kind !== "call" && !parsed.text.trim()) return { ok: false, error: "Write something first." };
  if (parsed.kind === "call" && !parsed.outcome) return { ok: false, error: "Say how the call went." };
  const ctx = await staff();
  const { payload, user } = ctx;
  const work = await openWork(ctx, personId);
  const summary = parsed.kind === "call" ? `${user.name} logged a call, ${OUTCOMES[parsed.outcome ?? "spoke"]}` : parsed.kind === "meeting" ? `${user.name} logged a meeting` : `${user.name} added a note`;
  await payload.create({
    collection: "activities",
    user,
    overrideAccess: false,
    data: { contact: personId, enquiry: work.enquiry, deal: work.deal, type: parsed.kind, summary, body: parsed.text.trim() || undefined, actor: user.id, at: new Date().toISOString(), meta: parsed.outcome ? { outcome: parsed.outcome } : undefined },
  });
  if (parsed.then) await createTask(ctx, personId, parsed.then, parsed.kind);
  if (parsed.kind === "call") await tickSteps(payload, work.enquiry, "call", user);
  await touch(ctx, personId);
  return { ok: true };
}

export async function addTask(personId: number, input: TaskFields): Promise<ActionResult> {
  const parsed = TaskInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "A task needs what, when and who." };
  const ctx = await staff();
  await createTask(ctx, personId, parsed, "manual");
  return { ok: true };
}

/** Ticks a task off, with a "Done" line on the person's timeline that its outcome and Undo can find. */
export async function completeTask(taskId: number): Promise<ActionResult> {
  const { payload, user } = await staff();
  // Read with the staff member's own access, so only a task they may see can be ticked.
  const task = await payload.findByID({ collection: "tasks", id: taskId, depth: 0, user, overrideAccess: false });
  if (!task.doneAt) await markDone(payload, task, user);
  return { ok: true };
}

/** The line on what happened, on the task and under its Done line. */
export async function noteTaskOutcome(taskId: number, text: string): Promise<ActionResult> {
  const outcome = text.trim().slice(0, 4000);
  if (!outcome) return { ok: false, error: "Write what happened, or leave it." };
  const { payload, user } = await staff();
  await payload.update({ collection: "tasks", id: taskId, user, overrideAccess: false, data: { outcome } });
  // The Done line is server-written; staff cannot edit activities themselves, so this goes as the server.
  await payload.update({ collection: "activities", where: { task: { equals: taskId }, type: { equals: "task" } }, overrideAccess: true, data: { body: outcome } });
  return { ok: true };
}

/** Undo: the task is open again and its Done line goes. */
export async function reopenTask(taskId: number): Promise<ActionResult> {
  const { payload, user } = await staff();
  await payload.update({ collection: "tasks", id: taskId, user, overrideAccess: false, data: { doneAt: null, doneBy: null, outcome: null } });
  await payload.delete({ collection: "activities", where: { task: { equals: taskId }, type: { equals: "task" } }, overrideAccess: true });
  return { ok: true };
}

const DealInput = type({ product: "number.integer > 0", "ticketSize?": "number >= 0" });

/**
 * Opens a deal for them. When their latest open enquiry has none yet, the
 * deal is that enquiry's, as "Turn into a deal" on the enquiry makes it.
 */
export async function openDeal(personId: number, input: { product: number; ticketSize?: number }): Promise<ActionResult> {
  const parsed = DealInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Choose the product." };
  const ctx = await staff();
  const { payload, user } = ctx;
  const [contact, product, enquiries] = await Promise.all([
    payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false }),
    payload.findByID({ collection: "products", id: parsed.product, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "enquiries", where: { contact: { equals: personId }, status: { in: ["new", "open", "waiting"] }, deal: { exists: false } }, sort: "-receivedAt", limit: 1, depth: 0, user, overrideAccess: false }),
  ]);
  const enquiry = enquiries.docs[0];
  const deal = await payload.create({
    collection: "deals",
    user,
    overrideAccess: false,
    data: { title: `${contact.name}, ${product.name}`, contact: personId, entity: idOf(contact.entity) ?? null, product: product.id, stage: "contacted", ticketSize: parsed.ticketSize, owner: user.id, enquiry: enquiry?.id },
  });
  if (enquiry) await payload.update({ collection: "enquiries", id: enquiry.id, user, overrideAccess: false, data: { status: "converted", deal: deal.id } });
  await tickSteps(payload, enquiry?.id, "deal", user);
  await payload.create({ collection: "activities", user, overrideAccess: false, data: { contact: personId, enquiry: enquiry?.id, deal: deal.id, type: "stage", summary: `${user.name} opened a ${product.name} deal`, actor: user.id, at: new Date().toISOString() } });
  await touch(ctx, personId);
  return { ok: true };
}

const PersonInput = type({
  name: "1 <= string <= 200",
  email: "string <= 200",
  phone: "string <= 40",
  city: "string <= 100",
  kind: type.enumerated(...CONTACT_KINDS.map(({ value }) => value)),
  ownerId: "number.integer >= 0",
  topics: type.enumerated(...TOPICS.map(({ value }) => value)).array(),
});

/** Their details, as Edit on the Account panel changes them. Consent and tags stay on the full record. */
export async function updatePerson(personId: number, input: typeof PersonInput.infer): Promise<ActionResult> {
  const parsed = PersonInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Check the name and email." };
  if (parsed.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email.trim())) return { ok: false, error: "That email address does not look right." };
  const { payload, user } = await staff();
  try {
    await payload.update({
      collection: "contacts",
      id: personId,
      user,
      overrideAccess: false,
      data: { name: parsed.name.trim(), email: parsed.email.trim() || null, phone: parsed.phone.trim() || null, city: parsed.city.trim() || null, kind: parsed.kind, owner: parsed.ownerId || null, topics: parsed.topics },
    });
  } catch {
    return { ok: false, error: "Another person already has that email address." };
  }
  return { ok: true };
}

/** Invite to the portal: their client account and a set-password email (lib/crm/portal-invite.ts). */
export async function inviteToPortal(personId: number): Promise<{ ok: true; validUntil: string } | { ok: false; error: string }> {
  const { payload, user } = await staff();
  return invitePerson(payload, user, personId, siteOf(await headers()) ?? "");
}

const InvestsAsInput = type({ type: type.enumerated(...INVESTS_AS.map(({ value }) => value)), name: "string <= 200" });

/** What they invest as: themselves, or an HUF, family office, company or trust by name (lib/crm/entities.ts). */
export async function setInvestsAs(personId: number, input: typeof InvestsAsInput.infer): Promise<ActionResult> {
  const parsed = InvestsAsInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Choose what they invest as." };
  if (parsed.type !== "self" && !parsed.name.trim()) return { ok: false, error: "Give its name, as on its PAN." };
  const { payload, user } = await staff();
  await setEntity(payload, user, personId, parsed.type === "self" ? { type: "self" } : { type: parsed.type, name: parsed.name });
  return { ok: true };
}

const LetterInput = type({ subject: "1 <= string <= 200", body: "1 <= string <= 20000", "attachments?": "string[] <= 10" });

/** A plain letter from the signed-in staff member, in their own words, with no enquiry behind it. */
async function ownLetter({ payload, user }: Staff, personId: number, input: typeof LetterInput.infer) {
  const person = await payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false });
  const values = { name: person.name, firstName: person.name.split(/\s+/)[0], senderName: user.name };
  const subject = fillTemplate(input.subject, values);
  const words = { text: fillTemplate(input.body, values) };
  // No enquiry, so no reference: the frame leaves the Ref. line out.
  const element = createElement(Letter, { name: person.name, reference: "", words, sender: { name: user.name, email: user.email }, eyebrow: "Moneybee", title: subject, reason: "You are receiving this email from your contact at Moneybee.", site: await siteDetails() });
  const origin = siteOf(await headers()) ?? "";
  return { person, subject, words: words.text, origin, ...(await renderEmail(element, origin)) };
}

export async function previewOwnLetter(personId: number, input: typeof LetterInput.infer): Promise<{ ok: true; html: string } | { ok: false; error: string }> {
  const parsed = LetterInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Write a subject and a message." };
  const letter = await ownLetter(await staff(), personId, parsed);
  return { ok: true, html: letter.html };
}

export async function sendOwnLetter(personId: number, input: typeof LetterInput.infer): Promise<{ ok: true; status: "sent" | "logged" | "failed" } | { ok: false; error: string }> {
  const parsed = LetterInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Write a subject and a message." };
  const ctx = await staff();
  const letter = await ownLetter(ctx, personId, parsed);
  if (!letter.person.email) return { ok: false, error: "This person has no email address on record." };
  const files = await resolveAttachments(ctx.payload, ctx.user, parsed.attachments, letter.origin);
  if (!files.ok) return files;
  const sent = await sendCrmEmail(ctx.payload, { to: letter.person.email, subject: letter.subject, html: letter.html, text: letter.text, words: letter.words, contact: personId, sentBy: ctx.user, attachments: files.attachments });
  await touch(ctx, personId);
  return { ok: true, status: sent.status };
}
