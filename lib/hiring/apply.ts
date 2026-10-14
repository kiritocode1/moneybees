import config from "@payload-config";
import { type } from "arktype";
import { getPayload, type Payload } from "payload";
import { type Team, TEAM_NAMES } from "@/lib/careers";
import { sendCrmEmail } from "@/lib/crm/mail";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";
import { resumesStored, resumeType, saveResume } from "@/lib/hiring/resume-store";
import { screenApplicant } from "@/lib/hiring/screen";
import { applicationReference, NOTICE_PERIODS } from "@/lib/hiring/stages";
import type { Application, Opening } from "@/payload-types";

/*
 * What happens when someone sends the apply form (/careers/apply, plan
 * .plannotator/hiring-cycle/plan.md):
 *   1. the role must be Live, or the application is an open one for a team;
 *   2. the answers are checked, one yes or no per must-have;
 *   3. the resume, if any, is checked by its first bytes and kept privately;
 *   4. the application is written with the day it will be deleted.
 * Then, after the applicant has their reference (`followUpApplication`): the
 * confirmation email, the email to HR, and Jev's reading when it is on.
 */

const isEmail = type("string.email");
/** Vercel refuses request bodies over 4.5 MB, so a resume stops at 4. */
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const RATE = { count: 5, windowMs: 10 * 60_000 };
const LIMITS = { name: 120, email: 200, phone: 40, city: 80, linkedin: 300, why: 2000, experience: 4000 } as const;

export type ApplyInput = {
  /** The opening's anchor, or empty for an open application. */
  role: string;
  /** For an open application: which team. */
  team?: string;
  fields: Readonly<Record<string, string>>;
  /** "yes" or "no" for each of the opening's must-haves, in order. */
  mustHaves: readonly string[];
  resume?: { bytes: Uint8Array; name: string } | null;
};
export type ApplyOrigin = { page?: string; ipHash?: string };
export type ApplyReceived = { ok: true; id: number; reference: string; email: string } | { ok: false; error: string };

/** A Live opening by its anchor, or by "opening-<id>" for one added before anchors were set. */
export async function liveOpening(payload: Payload, role: string): Promise<Opening | null> {
  const id = /^opening-(\d+)$/.exec(role)?.[1];
  const { docs } = await payload.find({
    collection: "openings",
    where: { and: [{ status: { equals: "live" } }, id ? { id: { equals: Number(id) } } : { anchor: { equals: role } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return docs[0] ?? null;
}

function readFields(raw: Readonly<Record<string, string>>, hasResume: boolean): { values: Record<string, string> } | { error: string } {
  const value = (key: keyof typeof LIMITS) => (raw[key] ?? "").trim();
  const values = Object.fromEntries((Object.keys(LIMITS) as (keyof typeof LIMITS)[]).map((key) => [key, value(key)]));
  const required: [keyof typeof LIMITS, string][] = [["name", "your full name"], ["email", "your email"], ["phone", "your phone number"], ["city", "the city you live in"], ["why", "why this role"]];
  if (!hasResume) required.push(["experience", "your experience, since there is no resume"]);
  for (const [key, label] of required) if (!values[key]) return { error: `Fill in ${label}.` };
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (values[key].length > LIMITS[key]) return { error: `That is too long. Keep it under ${LIMITS[key]} characters.` };
  }
  if (isEmail(values.email) instanceof type.errors) return { error: "That email address doesn't look right." };
  if (!/^[+\d][\d\s()-]{6,}$/.test(values.phone)) return { error: "That phone number doesn't look right." };
  if (values.linkedin && !/^(https?:\/\/)?([\w-]+\.)?linkedin\.com\//i.test(values.linkedin)) return { error: "Paste the link to your LinkedIn profile, or leave it empty." };
  const notice = (raw.notice ?? "").trim();
  if (!NOTICE_PERIODS.some((option) => option.value === notice)) return { error: "Choose your notice period." };
  if (raw.consent !== "yes") return { error: "Tick the box to let Moneybee keep your application." };
  return { values: { ...values, email: values.email.toLowerCase(), notice } };
}

const addMonths = (from: Date, months: number) => {
  const date = new Date(from);
  date.setMonth(date.getMonth() + months);
  return date;
};

export async function receiveApplication(input: ApplyInput, origin: ApplyOrigin): Promise<ApplyReceived> {
  const payload = await getPayload({ config });

  const opening = input.role ? await liveOpening(payload, input.role) : null;
  if (input.role && !opening) return { ok: false, error: "This role is no longer open. The careers page lists the ones that are." };
  const team = (opening?.team ?? input.team ?? "") as Team;
  if (!(team in TEAM_NAMES)) return { ok: false, error: "Choose the team you would like to work in." };

  const read = readFields(input.fields, Boolean(input.resume));
  if ("error" in read) return { ok: false, error: read.error };
  const { values } = read;

  const questions = (opening?.mustHaves ?? []).map(({ line }) => line);
  if (input.mustHaves.length !== questions.length || input.mustHaves.some((answer) => answer !== "yes" && answer !== "no")) {
    return { ok: false, error: "Answer yes or no to each of the role's must-haves." };
  }

  let kind: ReturnType<typeof resumeType> = null;
  if (input.resume) {
    if (!resumesStored()) return { ok: false, error: "Resumes cannot be uploaded at the moment. Go back and continue without one." };
    if (input.resume.bytes.byteLength > MAX_RESUME_BYTES) return { ok: false, error: "That file is over 4 MB. Save a smaller PDF and try again." };
    kind = resumeType(input.resume.bytes.subarray(0, 8));
    if (!kind) return { ok: false, error: "Upload your resume as a PDF or Word file." };
  }

  if (origin.ipHash) {
    const since = new Date(Date.now() - RATE.windowMs).toISOString();
    const { totalDocs } = await payload.count({ collection: "applications", where: { "origin.ipHash": { equals: origin.ipHash }, receivedAt: { greater_than: since } }, overrideAccess: true });
    if (totalDocs >= RATE.count) return { ok: false, error: "We've had several applications from this connection in the last few minutes. Try again shortly." };
  }

  const settings = await payload.findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });
  const receivedAt = new Date();
  const key = input.resume && kind ? await saveResume(input.resume.bytes, kind) : null;
  const roleTitle = opening?.title ?? "Open application";

  const application = await payload.create({
    collection: "applications",
    overrideAccess: true,
    data: {
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      linkedin: values.linkedin || undefined,
      notice: values.notice as Application["notice"],
      opening: opening?.id,
      roleTitle,
      team,
      stage: "new",
      mustHaves: questions.map((question, index) => ({ question, answer: input.mustHaves[index] as "yes" | "no" })),
      why: values.why,
      experience: values.experience || undefined,
      resume: key && input.resume && kind ? { key, name: input.resume.name.slice(0, 200), size: input.resume.bytes.byteLength, type: kind.type } : undefined,
      history: [{ at: receivedAt.toISOString(), kind: "applied", summary: opening ? `Applied for ${roleTitle}` : `Sent an open application for ${TEAM_NAMES[team]}` }],
      receivedAt: receivedAt.toISOString(),
      consentAt: receivedAt.toISOString(),
      deleteAfter: addMonths(receivedAt, settings.hiring?.keepMonths ?? 12).toISOString(),
      origin: { page: origin.page, ipHash: origin.ipHash },
    },
  });
  return { ok: true, id: application.id, reference: applicationReference(application.id), email: values.email };
}

/** "14 October 2027", the way the deletion date is written to an applicant. */
export const longDate = (value: string | Date) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** The merge fields an email to this applicant can use. An open application's {{role}} reads "a role in Compliance". */
export const applicantValues = (application: Pick<Application, "id" | "name" | "roleTitle" | "opening" | "team" | "deleteAfter">, extra: Record<string, string | undefined> = {}) => ({
  firstName: application.name.split(/\s+/)[0],
  name: application.name,
  reference: applicationReference(application.id),
  role: application.opening || !application.team ? application.roleTitle : `a role in ${TEAM_NAMES[application.team as Team]}`,
  keptUntil: longDate(application.deleteAfter),
  ...extra,
});

type HistoryEntry = NonNullable<Application["history"]>[number];

/** Adds one line to an application's own timeline. */
export async function addHistory(payload: Payload, id: number, entry: Omit<HistoryEntry, "id" | "at"> & { at?: string }) {
  const current = await payload.findByID({ collection: "applications", id, depth: 0, overrideAccess: true });
  await payload.update({ collection: "applications", id, overrideAccess: true, data: { history: [...(current.history ?? []), { ...entry, at: entry.at ?? new Date().toISOString() }] } });
}

/**
 * The work after the applicant has their reference: Jev's reading (when on),
 * the confirmation, and the email to HR. Each step logs its own failure, so
 * one failing does not stop the rest.
 */
export async function followUpApplication(id: number, options: { siteOrigin: string; aiScreen: boolean }) {
  const payload = await getPayload({ config });
  const application = await payload.findByID({ collection: "applications", id, depth: 0, overrideAccess: true });
  const settings = await payload.findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });

  if (options.aiScreen) {
    try {
      const screen = await screenApplicant(application);
      await payload.update({ collection: "applications", id, overrideAccess: true, data: { screen } });
      await addHistory(payload, id, { kind: "system", summary: "Jev read the answers" });
    } catch (error) {
      payload.logger.error({ err: error, msg: "Applicant screen failed", applicationId: id });
    }
  }

  if (settings.hiring?.acknowledge !== false) {
    try {
      const template = (await payload.find({ collection: "email-templates", where: { purpose: { equals: "application_ack" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? STARTER_TEMPLATES.applicationAck;
      const values = applicantValues(application);
      const html = "html" in template && template.html ? fillTemplateHtml(template.html, values) : undefined;
      const sent = await sendCrmEmail(payload, { to: application.email, subject: fillTemplate(template.subject, values), text: fillTemplate(template.body ?? "", values), html, application: id, summary: "Confirmation" });
      await addHistory(payload, id, { kind: "email", summary: "Confirmation", email: sent.id });
    } catch (error) {
      payload.logger.error({ err: error, msg: "Application confirmation failed", applicationId: id });
    }
  }

  try {
    const { docs: staff } = await payload.find({ collection: "users", where: { roles: { in: ["hr", "admin"] } }, limit: 50, depth: 0, overrideAccess: true });
    if (staff.length) {
      const yes = (application.mustHaves ?? []).filter(({ answer }) => answer === "yes").length;
      const asked = application.mustHaves?.length ?? 0;
      await payload.sendEmail({
        to: staff.map((user) => user.email),
        subject: `New application: ${application.name}, ${application.roleTitle}`,
        text: [
          `${application.name} applied for ${application.roleTitle} (${applicationReference(id)}).`,
          asked ? `Must-haves: ${yes} of ${asked}.` : null,
          `Open it: ${options.siteOrigin}/admin/hiring/${id}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      });
    }
  } catch (error) {
    payload.logger.error({ err: error, msg: "HR notification failed", applicationId: id });
  }
}
