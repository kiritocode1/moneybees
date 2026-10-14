import type { Payload, Where } from "payload";
import { TEAM_NAMES, type Team } from "@/lib/careers";
import { emailConnected } from "@/lib/crm/mail";
import { EMAIL_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import { applicantValues } from "@/lib/hiring/apply";
import { resumesStored } from "@/lib/hiring/resume-store";
import type { ApplicantScreen } from "@/lib/hiring/screen";
import { applicationReference, CLOSE_REASONS, HIRING_TABS, type HiringRow, noticeLabel, OPEN_STAGES, type Stage, stageLabel } from "@/lib/hiring/stages";
import type { Application, Email, Opening, User } from "@/payload-types";

/*
 * What /admin/hiring and /admin/hiring/:id show, read with the staff
 * member's own access (HR and admin) and flattened for the client screens.
 */

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);

function whereFor(stage: Stage, opening: number | "open" | null): Where {
  const role: Where[] = opening === "open" ? [{ opening: { exists: false } }] : opening ? [{ opening: { equals: opening } }] : [];
  return { and: [{ stage: { equals: stage } }, ...role] };
}

const mustHaveCount = (application: Application) => {
  const asked = application.mustHaves?.length ?? 0;
  return asked ? { yes: (application.mustHaves ?? []).filter(({ answer }) => answer === "yes").length, of: asked } : null;
};

const rowOf = (doc: Application): HiringRow => ({
  id: doc.id,
  reference: applicationReference(doc.id),
  name: doc.name,
  role: doc.roleTitle,
  team: doc.opening ? null : TEAM_NAMES[doc.team as Team] ?? null,
  mustHaves: mustHaveCount(doc),
  notice: noticeLabel(doc.notice),
  receivedAt: doc.receivedAt,
  owner: asDoc<User>(doc.owner)?.name ?? null,
  stage: doc.stage as Stage,
  closeReason: doc.closeReason ? labelOf(CLOSE_REASONS, doc.closeReason) : null,
});

/** One tab of the list, newest first; Closed and Hired most recently changed first. */
export async function hiringRows(payload: Payload, user: User, stage: Stage, opening: number | "open" | null) {
  const { docs } = await payload.find({ collection: "applications", where: whereFor(stage, opening), sort: stage === "closed" || stage === "hired" ? "-updatedAt" : "-receivedAt", limit: 300, depth: 1, user, overrideAccess: false });
  return docs.map(rowOf);
}

export async function hiringCounts(payload: Payload, user: User, opening: number | "open" | null): Promise<Record<Stage, number>> {
  const entries = await Promise.all(HIRING_TABS.map(async ({ key }) => [key, (await payload.count({ collection: "applications", where: whereFor(key, opening), user, overrideAccess: false })).totalDocs] as const));
  return Object.fromEntries(entries) as Record<Stage, number>;
}

/** The roles for the list's filter: every opening that has applications, and open applications. */
export async function hiringRoles(payload: Payload, user: User) {
  const { docs } = await payload.find({ collection: "openings", sort: "_order", limit: 200, depth: 0, user, overrideAccess: false });
  const counts = await Promise.all(docs.map(async (opening) => ({ opening, count: (await payload.count({ collection: "applications", where: { opening: { equals: opening.id } }, user, overrideAccess: false })).totalDocs })));
  const open = (await payload.count({ collection: "applications", where: { opening: { exists: false } }, user, overrideAccess: false })).totalDocs;
  return [
    ...counts.filter(({ count }) => count > 0).map(({ opening, count }) => ({ value: String(opening.id), label: `${opening.title} (${count})` })),
    ...(open ? [{ value: "open", label: `Open applications (${open})` }] : []),
  ];
}

/** Interviews from now to the end of the next seven days, soonest first. */
export async function upcomingInterviews(payload: Payload, user: User, now = new Date()) {
  const until = new Date(now.getTime() + 7 * 86_400_000);
  const { docs } = await payload.find({ collection: "applications", where: { and: [{ stage: { in: [...OPEN_STAGES] } }, { "interviews.at": { greater_than_equal: now.toISOString() } }, { "interviews.at": { less_than: until.toISOString() } }] }, limit: 100, depth: 0, user, overrideAccess: false });
  return docs
    .flatMap((doc) => (doc.interviews ?? []).filter(({ at }) => new Date(at) >= now && new Date(at) < until).map((interview) => ({ id: doc.id, name: doc.name, role: doc.roleTitle, at: interview.at, with: interview.with })))
    .sort((a, b) => a.at.localeCompare(b.at));
}

export async function applicantDetail(payload: Payload, user: User, id: number) {
  const application = await payload.findByID({ collection: "applications", id, depth: 1, user, overrideAccess: false, disableErrors: true });
  if (!application) return null;
  const opening = asDoc<Opening>(application.opening);
  const owner = asDoc<User>(application.owner);

  const [staff, templates, earlier, others] = await Promise.all([
    payload.find({ collection: "users", where: { roles: { in: ["hr", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "email-templates", where: { purpose: { in: ["application_reject", "interview_invite", "offer", "other"] } }, sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.count({ collection: "applications", where: { and: [{ email: { equals: application.email } }, { id: { not_equals: id } }] }, user, overrideAccess: false }),
    opening ? payload.find({ collection: "applications", where: { and: [{ opening: { equals: opening.id } }, { id: { not_equals: id } }, { stage: { in: [...OPEN_STAGES] } }] }, limit: 100, depth: 0, user, overrideAccess: false }) : null,
  ]);

  return {
    id: application.id,
    reference: applicationReference(application.id),
    name: application.name,
    email: application.email,
    phone: application.phone ?? null,
    city: application.city ?? null,
    linkedin: application.linkedin ? (/^https?:\/\//.test(application.linkedin) ? application.linkedin : `https://${application.linkedin}`) : null,
    notice: noticeLabel(application.notice),
    role: application.roleTitle,
    team: application.team ? TEAM_NAMES[application.team as Team] : null,
    opening: opening ? { id: opening.id, title: opening.title, status: opening.status } : null,
    stage: application.stage as Stage,
    stageLabel: stageLabel(application.stage),
    closeReason: application.closeReason ? labelOf(CLOSE_REASONS, application.closeReason) : null,
    mustHaves: (application.mustHaves ?? []).map(({ question, answer }) => ({ question, answer })),
    screen: (application.screen ?? null) as ApplicantScreen | null,
    why: application.why ?? null,
    experience: application.experience ?? null,
    resume: application.resume?.key ? { name: application.resume.name ?? "Resume", type: application.resume.type ?? "", size: application.resume.size ?? 0, href: `/api/hiring/resume/${application.id}` } : null,
    interviews: (application.interviews ?? []).map(({ at, with: who, place, note }) => ({ at, with: who, place, note: note ?? null })).sort((a, b) => a.at.localeCompare(b.at)),
    history: [...(application.history ?? [])].reverse().map((entry, index) => ({
      key: entry.id ?? String(index),
      at: entry.at,
      kind: entry.kind,
      summary: entry.summary,
      body: entry.body ?? null,
      actor: asDoc<User>(entry.actor)?.name ?? null,
      emailStatus: asDoc<Email>(entry.email) ? labelOf(EMAIL_STATUSES, (entry.email as Email).status) : null,
      emailOk: asDoc<Email>(entry.email) ? !["logged", "failed", "bounced"].includes((entry.email as Email).status) : null,
    })),
    receivedAt: application.receivedAt,
    deleteAfter: application.deleteAfter,
    page: application.origin?.page ?? null,
    owner: owner ? { id: owner.id, name: owner.name } : null,
    appliedBefore: earlier.totalDocs,
    others: (others?.docs ?? []).map((other) => ({ id: other.id, name: other.name, stage: stageLabel(other.stage) })),
    staff: staff.docs.map((member) => ({ id: member.id, name: member.name })),
    templates: templates.docs.map((template) => ({ id: template.id, name: template.name, purpose: template.purpose, subject: template.subject, body: template.body ?? "" })),
    /** Merge field values for the composer; interview fields are filled from the interview form. */
    values: { ...applicantValues(application), senderName: user.name },
    sender: user.name,
    emailConnected: emailConnected(),
    resumesStored: resumesStored(),
  };
}

export type ApplicantDetail = NonNullable<Awaited<ReturnType<typeof applicantDetail>>>;
