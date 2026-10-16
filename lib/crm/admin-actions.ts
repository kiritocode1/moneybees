"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { sendCrmEmail } from "@/lib/crm/mail";
import { buildReply, type ReplyDraft, ReplyInput } from "@/lib/crm/reply";
import { ENQUIRY_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import type { User } from "@/payload-types";

/*
 * What staff do to an enquiry from /admin/inbox/:id. Every action checks the
 * signed-in staff member's role, writes through Payload with their access,
 * and leaves a line on the person's timeline, so the record shows who did
 * what and when.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

async function staff() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users" || !hasRole(user, ...CRM_ROLES)) throw new Error("Only CRM staff can do this.");
  return { payload, user: user as User };
}

const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : (value ?? undefined));

type Staff = Awaited<ReturnType<typeof staff>>;

async function logOnTimeline({ payload, user }: Staff, enquiryId: number, summary: string, extra: { type?: "system" | "note" | "call" | "meeting" | "stage"; body?: string } = {}) {
  const enquiry = await payload.findByID({ collection: "enquiries", id: enquiryId, depth: 0, user, overrideAccess: false });
  await payload.create({
    collection: "activities",
    user,
    overrideAccess: false,
    data: { contact: idOf(enquiry.contact) as number, enquiry: enquiryId, type: extra.type ?? "system", summary, body: extra.body, actor: user.id, at: new Date().toISOString() },
  });
}

/** "Take it": the signed-in person becomes the owner and the clock shows it is being handled. */
export async function takeEnquiry(id: number): Promise<ActionResult> {
  const ctx = await staff();
  const { payload, user } = ctx;
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 0, user, overrideAccess: false });
  await payload.update({
    collection: "enquiries",
    id,
    user,
    overrideAccess: false,
    data: { assignee: user.id, claimedAt: new Date().toISOString(), ...(enquiry.status === "new" ? { status: "open" } : {}) },
  });
  await logOnTimeline(ctx, id, `${user.name} took the enquiry`);
  return { ok: true };
}

export async function assignEnquiry(id: number, assigneeId: number): Promise<ActionResult> {
  const ctx = await staff();
  const { payload, user } = ctx;
  const assignee = await payload.findByID({ collection: "users", id: assigneeId, depth: 0, user, overrideAccess: false });
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 0, user, overrideAccess: false });
  await payload.update({ collection: "enquiries", id, user, overrideAccess: false, data: { assignee: assignee.id, claimedAt: new Date().toISOString(), ...(enquiry.status === "new" ? { status: "open" } : {}) } });
  await logOnTimeline(ctx, id, `${user.name} gave it to ${assignee.name}`);
  return { ok: true };
}

const StatusInput = type({ status: "'open' | 'waiting' | 'closed' | 'spam'", "note?": "string <= 2000" });

export async function setEnquiryStatus(id: number, input: { status: string; note?: string }): Promise<ActionResult> {
  const parsed = StatusInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Choose a status." };
  const ctx = await staff();
  const { payload, user } = ctx;
  if (parsed.status === "closed" && !parsed.note?.trim()) return { ok: false, error: "Say in a line how it was resolved." };
  await payload.update({ collection: "enquiries", id, user, overrideAccess: false, data: { status: parsed.status, ...(parsed.note ? { closingNote: parsed.note } : {}) } });
  await logOnTimeline(ctx, id, `${user.name} marked it ${labelOf(ENQUIRY_STATUSES, parsed.status).toLowerCase()}`, { body: parsed.note });
  return { ok: true };
}

const requestOrigin = async () => {
  const head = await headers();
  return `${head.get("x-forwarded-proto") ?? "https"}://${head.get("x-forwarded-host") ?? head.get("host")}`;
};

async function draftFor({ payload, user }: Staff, id: number, input: ReplyDraft) {
  const parsed = ReplyInput(input);
  if (parsed instanceof type.errors) return { ok: false as const, error: "Write a subject and a message." };
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 1, user, overrideAccess: false });
  const contact = typeof enquiry.contact === "object" ? enquiry.contact : null;
  if (!contact) return { ok: false as const, error: "The enquiry has no person attached." };
  return { ok: true as const, enquiry, contact, email: await buildReply(payload, user, enquiry, contact, parsed, await requestOrigin()) };
}

/** The reply exactly as it will go, for the composer's Preview. Sends nothing. */
export async function previewReply(id: number, input: ReplyDraft): Promise<{ ok: true; html: string } | { ok: false; error: string }> {
  const draft = await draftFor(await staff(), id, input);
  return draft.ok ? { ok: true, html: draft.email.html } : draft;
}

/**
 * Emails the person from the signed-in staff member, drawn as the email its
 * template's purpose calls for (lib/crm/reply.ts). Once it has really gone,
 * the enquiry is "waiting on them" and the reply clock stops; a reply saved
 * while email is not connected leaves both as they were.
 */
export async function replyToEnquiry(id: number, input: ReplyDraft): Promise<ActionResult> {
  const ctx = await staff();
  const { payload, user } = ctx;
  const draft = await draftFor(ctx, id, input);
  if (!draft.ok) return draft;
  const { enquiry, contact, email } = draft;
  if (!contact.email) return { ok: false, error: "This person has no email address on record." };

  const sent = await sendCrmEmail(payload, { to: contact.email, ...email, contact: contact.id, enquiry: id, sentBy: user });
  if (sent.status !== "sent") return { ok: true };
  const now = new Date().toISOString();
  await payload.update({
    collection: "enquiries",
    id,
    user,
    overrideAccess: false,
    data: { status: "waiting", firstResponseAt: enquiry.firstResponseAt ?? now, ...(enquiry.assignee ? {} : { assignee: user.id, claimedAt: now }) },
  });
  await payload.update({ collection: "contacts", id: contact.id, user, overrideAccess: false, data: { lastActivityAt: now } });
  return { ok: true };
}

const NoteInput = type({ kind: "'note' | 'call' | 'meeting'", text: "1 <= string <= 10000" });

export async function addEnquiryNote(id: number, input: { kind: string; text: string }): Promise<ActionResult> {
  const parsed = NoteInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Write something first." };
  const ctx = await staff();
  const { user } = ctx;
  const summary = { note: `${user.name} added a note`, call: `${user.name} logged a call`, meeting: `${user.name} logged a meeting` }[parsed.kind];
  await logOnTimeline(ctx, id, summary, { type: parsed.kind, body: parsed.text });
  return { ok: true };
}

const DealInput = type({ product: "number.integer > 0", "ticketSize?": "number >= 0" });

/** Opens a deal on the product's board from this enquiry, at the Contacted stage, owned by whoever converts it. */
export async function convertToDeal(id: number, input: { product: number; ticketSize?: number }): Promise<ActionResult> {
  const parsed = DealInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Choose the product." };
  const ctx = await staff();
  const { payload, user } = ctx;
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 1, user, overrideAccess: false });
  if (enquiry.deal) return { ok: false, error: "This enquiry already has a deal." };
  const contact = typeof enquiry.contact === "object" ? enquiry.contact : null;
  const product = await payload.findByID({ collection: "products", id: parsed.product, depth: 0, user, overrideAccess: false });
  if (!contact) return { ok: false, error: "The enquiry has no person attached." };

  const deal = await payload.create({
    collection: "deals",
    user,
    overrideAccess: false,
    data: { title: `${contact.name}, ${product.name}`, contact: contact.id, entity: idOf(contact.entity) ?? null, product: product.id, stage: "contacted", ticketSize: parsed.ticketSize, owner: user.id, enquiry: id },
  });
  await payload.update({ collection: "enquiries", id, user, overrideAccess: false, data: { status: "converted", deal: deal.id } });
  await logOnTimeline(ctx, id, `${user.name} opened a ${product.name} deal`, { type: "stage" });
  return { ok: true };
}
