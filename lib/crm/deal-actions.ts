"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { siteOf } from "@/emails/request";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { dueLabel, workingDaysAfter } from "@/lib/crm/due";
import { invitePerson } from "@/lib/crm/portal-invite";
import { markDone, tellNewOwner } from "@/lib/crm/tasks";
import { DEAL_STAGES, labelOf, LOST_REASONS } from "@/lib/crm/vocabulary";
import type { Task, User } from "@/payload-types";

/*
 * Moving a deal, from the board or a person's Deal panel. Some stages ask
 * one thing first, and the move does the rest: Meeting adds the meeting to
 * the owner's tasks; Documents sent notes what went and adds a chase in
 * three working days; Invested keeps the amount and date and can invite
 * the client to the portal; Lost keeps why and closes the deal's open
 * tasks. Each move is one line on the person's timeline.
 */

type Result = { ok: true; notice?: string } | { ok: false; error: string };

const MoveInput = type({
  stage: type.enumerated(...DEAL_STAGES.map(({ value }) => value)),
  "meeting?": { at: "string.date.iso", where: "1 <= string <= 300" },
  "sent?": "string[] <= 20",
  "chase?": "boolean",
  "invested?": { on: "string.date.iso", "amount?": "number >= 0" },
  "invite?": "boolean",
  "lost?": { why: type.enumerated(...LOST_REASONS.map(({ value }) => value)), "note?": "string <= 300" },
});
export type MoveInputs = typeof MoveInput.infer;

async function staff() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users" || !hasRole(user, ...CRM_ROLES)) throw new Error("Only CRM staff can do this.");
  return { payload, user: user as User };
}

const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : (value ?? undefined));
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export async function moveDealTo(dealId: number, input: MoveInputs): Promise<Result> {
  const parsed = MoveInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Fill in what this stage asks for." };
  if (parsed.stage === "meeting" && !parsed.meeting) return { ok: false, error: "Say when and where the meeting is." };
  if (parsed.stage === "invested" && !parsed.invested) return { ok: false, error: "Say when the money came in." };
  if (parsed.stage === "lost" && !parsed.lost) return { ok: false, error: "Say why it was lost." };
  const { payload, user } = await staff();
  const deal = await payload.findByID({ collection: "deals", id: dealId, depth: 0, user, overrideAccess: false });
  if (deal.stage === parsed.stage) return { ok: true };
  const contact = idOf(deal.contact) as number;
  const owner = idOf(deal.owner) ?? user.id;
  const now = new Date();

  await payload.update({
    collection: "deals",
    id: dealId,
    user,
    overrideAccess: false,
    data: {
      stage: parsed.stage,
      ...(parsed.invested ? { investedOn: parsed.invested.on, ...(parsed.invested.amount !== undefined ? { ticketSize: parsed.invested.amount } : {}) } : {}),
      ...(parsed.lost ? { lostWhy: parsed.lost.why, lostReason: parsed.lost.note?.trim() || null } : {}),
    },
  });

  const made: Task[] = [];
  const task = async (title: string, kind: Task["kind"], dueAt: Date) =>
    made.push(await payload.create({ collection: "tasks", overrideAccess: true, data: { title, kind, source: "deal", dueAt: dueAt.toISOString(), owner, contact, deal: dealId, enquiry: idOf(deal.enquiry), createdBy: user.id } }));

  const details: string[] = [];
  if (parsed.meeting) {
    await task(`Meeting, ${parsed.meeting.where}`, "meeting", new Date(parsed.meeting.at));
    details.push(`Meeting ${dueLabel(new Date(parsed.meeting.at), now)}, ${parsed.meeting.where}.`);
  }
  if (parsed.stage === "documents") {
    if (parsed.sent?.length) details.push(`Sent: ${parsed.sent.join(", ")}.`);
    if (parsed.chase) await task("Chase the signed documents", "call", workingDaysAfter(now, 3));
  }
  if (parsed.invested) details.push(`${deal.ticketSize || parsed.invested.amount ? `Rs. ${parsed.invested.amount ?? deal.ticketSize} crore, ` : ""}invested ${day(parsed.invested.on)}.`);
  if (parsed.lost) {
    details.push([labelOf(LOST_REASONS, parsed.lost.why), parsed.lost.note?.trim()].filter(Boolean).join(": "));
    const open = await payload.find({ collection: "tasks", where: { deal: { equals: dealId }, doneAt: { exists: false } }, limit: 50, depth: 0, overrideAccess: true });
    for (const each of open.docs) await markDone(payload, each, user, { body: "The deal was lost.", closed: true });
  }

  await payload.create({
    collection: "activities",
    user,
    overrideAccess: false,
    data: { contact, deal: dealId, type: "stage", summary: `${user.name} moved the deal to ${labelOf(DEAL_STAGES, parsed.stage)}`, body: details.join(" ") || undefined, actor: user.id, at: now.toISOString() },
  });
  await payload.update({ collection: "contacts", id: contact, user, overrideAccess: false, data: { lastActivityAt: now.toISOString() } });
  const origin = siteOf(await headers()) ?? "";
  await tellNewOwner(payload, owner, user, made, origin);

  if (parsed.invite) {
    const invited = await invitePerson(payload, user, contact, origin);
    return invited.ok ? { ok: true, notice: `Moved, and invited to the portal until ${invited.validUntil}.` } : { ok: true, notice: `Moved. The portal invitation did not go: ${invited.error}` };
  }
  return { ok: true };
}

/** The files their recent emails carried, offered when a deal moves to Documents sent. */
export async function filesSentTo(personId: number): Promise<string[]> {
  const { payload } = await staff();
  const { docs } = await payload.find({
    collection: "emails",
    where: { contact: { equals: personId }, "attachments.ref": { exists: true }, createdAt: { greater_than: new Date(Date.now() - 60 * 86_400_000).toISOString() } },
    sort: "-createdAt",
    limit: 20,
    depth: 0,
    overrideAccess: true,
    select: { attachments: true },
  });
  return [...new Set(docs.flatMap((email) => (email.attachments ?? []).map((file) => file.name)))];
}
