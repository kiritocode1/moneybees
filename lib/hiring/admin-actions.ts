"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { hasRole } from "@/lib/backend/roles";
import { sendCrmEmail } from "@/lib/crm/mail";
import { fillTemplate } from "@/lib/crm/template";
import { addHistory, applicantValues } from "@/lib/hiring/apply";
import { deleteResume } from "@/lib/hiring/resume-store";
import { applicationReference, isOpenStage, NEXT, type Stage, stageLabel, STAGES } from "@/lib/hiring/stages";
import type { Application, User } from "@/payload-types";

/*
 * What HR does to an application from /admin/hiring/:id. Every action checks
 * the signed-in person holds HR (or admin), writes through Payload with their
 * access, and adds a line to the application's own timeline. Stages move one
 * step at a time; the server refuses a skipped step whatever the screen sent.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

async function hr() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users" || !hasRole(user, "hr")) throw new Error("Only HR can do this.");
  return { payload, user: user as User };
}
type Ctx = Awaited<ReturnType<typeof hr>>;

const load = ({ payload, user }: Ctx, id: number) => payload.findByID({ collection: "applications", id, depth: 0, user, overrideAccess: false });

const Email = type({ subject: "1 <= string <= 200", body: "1 <= string <= 20000" });
type EmailInput = typeof Email.infer;

/** Emails the applicant from the signed-in person; merge fields are filled for this applicant. */
async function emailApplicant(ctx: Ctx, application: Application, input: EmailInput, summary: string, extra: Record<string, string> = {}) {
  const values = applicantValues(application, { senderName: ctx.user.name, ...extra });
  const sent = await sendCrmEmail(ctx.payload, { to: application.email, subject: fillTemplate(input.subject, values), text: fillTemplate(input.body, values), application: application.id, sentBy: ctx.user, summary });
  await addHistory(ctx.payload, application.id, { kind: "email", summary, actor: ctx.user.id, email: sent.id });
}

async function moveTo(ctx: Ctx, application: Application, stage: Stage, extra: Partial<Application> = {}) {
  await ctx.payload.update({ collection: "applications", id: application.id, user: ctx.user, overrideAccess: false, data: { stage, ...(stage === "closed" ? {} : { closeReason: null }), ...extra } });
  await addHistory(ctx.payload, application.id, { kind: "stage", summary: `${ctx.user.name} moved it to ${stageLabel(stage)}`, actor: ctx.user.id });
}

/** True when `to` is the next stage after the application's own. */
const isNext = (application: Application, to: Stage) => isOpenStage(application.stage) && NEXT[application.stage].stage === to;

export async function takeApplication(id: number): Promise<ActionResult> {
  const ctx = await hr();
  await ctx.payload.update({ collection: "applications", id, user: ctx.user, overrideAccess: false, data: { owner: ctx.user.id } });
  await addHistory(ctx.payload, id, { kind: "owner", summary: `${ctx.user.name} took it`, actor: ctx.user.id });
  return { ok: true };
}

export async function assignApplication(id: number, ownerId: number): Promise<ActionResult> {
  const ctx = await hr();
  const owner = await ctx.payload.findByID({ collection: "users", id: ownerId, depth: 0, user: ctx.user, overrideAccess: false });
  if (!hasRole({ ...owner, collection: "users" as const }, "hr")) return { ok: false, error: `${owner.name} does not have the HR role.` };
  await ctx.payload.update({ collection: "applications", id, user: ctx.user, overrideAccess: false, data: { owner: owner.id } });
  await addHistory(ctx.payload, id, { kind: "owner", summary: `${ctx.user.name} gave it to ${owner.name}`, actor: ctx.user.id });
  return { ok: true };
}

/** Shortlist, and Mark as hired: the two moves that need nothing filled in. */
export async function advanceApplication(id: number, to: "shortlisted" | "hired"): Promise<ActionResult> {
  const ctx = await hr();
  const application = await load(ctx, id);
  if (!isNext(application, to)) return { ok: false, error: `It is at ${stageLabel(application.stage)}, so it cannot move to ${stageLabel(to)} yet.` };
  await moveTo(ctx, application, to);
  return { ok: true };
}

const InterviewInput = type({ at: "string.date.iso", with: "1 <= string <= 120", place: "1 <= string <= 200", "note?": "string <= 4000", "email?": Email });

const interviewTime = (at: string) => new Date(at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });

/** Adds an interview, invites them if asked, and moves a shortlisted application to Interview. */
export async function addInterview(id: number, input: { at: string; with: string; place: string; note?: string; email?: EmailInput }): Promise<ActionResult> {
  const parsed = InterviewInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Fill in when, with whom and where." };
  const ctx = await hr();
  const application = await load(ctx, id);
  if (!["shortlisted", "interview"].includes(application.stage)) return { ok: false, error: "Shortlist the application before adding an interview." };
  const interviews = [...(application.interviews ?? []), { at: new Date(parsed.at).toISOString(), with: parsed.with, place: parsed.place, note: parsed.note }];
  await ctx.payload.update({ collection: "applications", id, user: ctx.user, overrideAccess: false, data: { interviews } });
  await addHistory(ctx.payload, id, { kind: "interview", summary: `Interview ${interviewTime(parsed.at)}, with ${parsed.with}`, body: parsed.place, actor: ctx.user.id });
  if (parsed.email) await emailApplicant(ctx, application, parsed.email, "Interview invitation", { interviewAt: interviewTime(parsed.at), interviewPlace: parsed.place, interviewWith: parsed.with });
  if (application.stage === "shortlisted") await moveTo(ctx, application, "interview");
  return { ok: true };
}

/** Moves an interviewed application to Offer, emailing the offer if one was written. */
export async function makeOffer(id: number, input: { email?: EmailInput }): Promise<ActionResult> {
  const ctx = await hr();
  const application = await load(ctx, id);
  if (!isNext(application, "offer")) return { ok: false, error: "Add an interview before making an offer." };
  if (input.email) {
    const email = Email(input.email);
    if (email instanceof type.errors) return { ok: false, error: "Write a subject and a message, or untick the email." };
    if (/\[Write the terms here/.test(email.body)) return { ok: false, error: "Write the terms where the brackets are before sending." };
    await emailApplicant(ctx, application, email, "Offer");
  }
  await moveTo(ctx, application, "offer");
  return { ok: true };
}

/** Closes an open application as not taken forward, with or without the email. */
export async function notTakenForward(id: number, input: { email?: EmailInput }): Promise<ActionResult> {
  const ctx = await hr();
  const application = await load(ctx, id);
  if (!isOpenStage(application.stage)) return { ok: false, error: "It is already finished." };
  if (input.email) {
    const email = Email(input.email);
    if (email instanceof type.errors) return { ok: false, error: "Write a subject and a message, or close without emailing." };
    await emailApplicant(ctx, application, email, "Not taken forward");
  }
  await moveTo(ctx, application, "closed", { closeReason: "not_taken_forward" });
  return { ok: true };
}

/** Undoes the last move: one stage back, or a closed application back to New. */
export async function stepBack(id: number): Promise<ActionResult> {
  const ctx = await hr();
  const application = await load(ctx, id);
  const order = STAGES.map(({ value }) => value).filter((value) => value !== "closed");
  const index = order.indexOf(application.stage as (typeof order)[number]);
  const to: Stage | undefined = application.stage === "closed" ? "new" : index > 0 ? order[index - 1] : undefined;
  if (!to) return { ok: false, error: "It is already at the first stage." };
  await moveTo(ctx, application, to);
  return { ok: true };
}

export async function sendApplicantEmail(id: number, input: EmailInput): Promise<ActionResult> {
  const email = Email(input);
  if (email instanceof type.errors) return { ok: false, error: "Write a subject and a message." };
  const ctx = await hr();
  await emailApplicant(ctx, await load(ctx, id), email, email.subject);
  return { ok: true };
}

const NoteInput = type("1 <= string <= 10000");

export async function addApplicationNote(id: number, text: string): Promise<ActionResult> {
  const note = NoteInput(text.trim());
  if (note instanceof type.errors) return { ok: false, error: "Write something first." };
  const ctx = await hr();
  await addHistory(ctx.payload, id, { kind: "note", summary: `${ctx.user.name} added a note`, body: note, actor: ctx.user.id });
  return { ok: true };
}

/** Deletes the application and its resume now, leaving one line in the audit log that names no one. */
export async function deleteApplication(id: number): Promise<ActionResult> {
  const ctx = await hr();
  const application = await load(ctx, id);
  if (application.resume?.key) await deleteResume(application.resume.key);
  await ctx.payload.delete({ collection: "applications", id, user: ctx.user, overrideAccess: false });
  await ctx.payload.create({
    collection: "audit-log",
    overrideAccess: true,
    data: { actor: ctx.user.id, action: "delete", collectionSlug: "applications", docId: String(id), summary: `Deleted application ${applicationReference(id)} and its resume on request`, changes: {} },
  });
  return { ok: true };
}

/** Takes a filled role off the website. Its applications stay. */
export async function closeRole(openingId: number): Promise<ActionResult> {
  const ctx = await hr();
  await ctx.payload.update({ collection: "openings", id: openingId, user: ctx.user, overrideAccess: false, data: { status: "closed" } });
  return { ok: true };
}

const TellInput = type({ ids: "number.integer[] >= 1", email: Email });

/** Tells the others still open on a filled role, each with the email filled in for them, and closes them. */
export async function tellOthers(openingId: number, input: { ids: number[]; email: EmailInput }): Promise<ActionResult> {
  const parsed = TellInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "Choose at least one person, and write the email." };
  const ctx = await hr();
  for (const id of parsed.ids) {
    const application = await load(ctx, id);
    const opening = typeof application.opening === "object" ? application.opening?.id : application.opening;
    if (opening !== openingId || !isOpenStage(application.stage)) continue;
    await emailApplicant(ctx, application, parsed.email, "Not taken forward, role filled");
    await moveTo(ctx, application, "closed", { closeReason: "role_filled" });
  }
  return { ok: true };
}
