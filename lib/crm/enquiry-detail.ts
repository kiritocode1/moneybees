import type { Payload } from "payload";
import { answersFor, enquiryReference } from "@/lib/crm/enquiries";
import { suggestedEntity } from "@/lib/crm/entities";
import { emailConnected } from "@/lib/crm/mail";
import { effectiveSeverity, type EnquiryKind, type Reason, type Severity } from "@/lib/crm/severity";
import type { TriageAnswers } from "@/lib/crm/triage";
import { taskRow } from "@/lib/crm/task-desk";
import { timelineItem } from "@/lib/crm/timeline";
import { CONTACT_KINDS, DEAL_STAGES, ENQUIRY_KIND_LABELS, ENQUIRY_STATUSES, ENTITY_TYPES, labelOf, STEP_WHEN } from "@/lib/crm/vocabulary";
import { DEFAULT_DETAILS } from "@/lib/site/details";
import type { Contact, Deal, Playbook, User } from "@/payload-types";

/*
 * Everything /admin/inbox/:id shows, read in one pass with the staff
 * member's own access and flattened to plain values for the client screen.
 */

/** The templates a reply can start from; each purpose draws its own email (lib/crm/reply.ts). */
export const REPLY_PURPOSES = ["enquiry_reply", "pms_introduction", "aif_introduction", "meeting_confirmation", "follow_up", "pms_checklist", "aif_checklist"] as const;

async function officeLine(payload: Payload) {
  const saved = await payload.findGlobal({ slug: "site-details", depth: 0, overrideAccess: true });
  const { address } = saved.updatedAt ? saved : DEFAULT_DETAILS;
  return `${address.line1} ${address.line2}`;
}

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);

export type { TimelineItem } from "@/lib/crm/timeline";

export async function enquiryDetail(payload: Payload, user: User, id: number, now = new Date()) {
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 1, user, overrideAccess: false, disableErrors: true });
  if (!enquiry) return null;
  const contact = asDoc<Contact>(enquiry.contact);
  const playbookRef = asDoc<Playbook>(enquiry.playbook);

  const entityId = (contact && (typeof contact.entity === "object" ? contact.entity?.id : contact.entity)) ?? null;
  const [playbook, timeline, earlier, staff, products, templates, stepTasks, entity] = await Promise.all([
    playbookRef ? payload.findByID({ collection: "playbooks", id: playbookRef.id, depth: 1, user, overrideAccess: false }) : null,
    contact ? payload.find({ collection: "activities", where: { contact: { equals: contact.id } }, sort: "-at", limit: 80, depth: 1, user, overrideAccess: false }) : null,
    contact ? payload.count({ collection: "enquiries", where: { contact: { equals: contact.id }, id: { not_equals: id } }, user, overrideAccess: false }) : null,
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "products", sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "email-templates", where: { purpose: { in: [...REPLY_PURPOSES] } }, sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "tasks", where: { enquiry: { equals: id }, step: { exists: true } }, limit: 50, depth: 1, user, overrideAccess: false }),
    entityId ? payload.findByID({ collection: "entities", id: entityId, depth: 0, user, overrideAccess: false, disableErrors: true }) : null,
  ]);
  const taskForStep = new Map(stepTasks.docs.map((task) => [task.step, taskRow(task, now)]));

  const triage = (enquiry.triage ?? {}) as { rules?: Reason[]; ai?: TriageAnswers; existingInvestor?: boolean };
  const shown = effectiveSeverity(enquiry.severity as Severity, enquiry.dueAt, enquiry.status, now);
  const playbookTemplate = playbook && typeof playbook.template === "object" ? playbook.template : null;
  const assignee = asDoc<User>(enquiry.assignee);
  const kind = enquiry.kind as EnquiryKind;

  return {
    id: enquiry.id,
    /** The signed-in staff member, who signs any reply. */
    sender: user.name,
    /** False while RESEND_API_KEY is unset: replies are saved, not sent. */
    emailConnected: emailConnected(),
    reference: enquiryReference(enquiry.id),
    title: enquiry.title,
    kind,
    kindLabel: ENQUIRY_KIND_LABELS[kind],
    status: enquiry.status,
    statusLabel: labelOf(ENQUIRY_STATUSES, enquiry.status),
    storedSeverity: enquiry.severity as Severity,
    severity: shown.severity,
    overdue: shown.overdue,
    reasons: [...(triage.rules ?? []), ...(shown.overdue ? [{ severity: shown.severity, why: "Past its reply time, so it shows one level up.", source: "clock" } satisfies Reason] : [])],
    ai: triage.ai ?? null,
    existingInvestor: Boolean(triage.existingInvestor),
    answers: answersFor(kind, (enquiry.answers ?? {}) as Record<string, string>).filter(({ label }) => label !== "Message"),
    message: enquiry.message ?? null,
    page: enquiry.origin?.page ?? null,
    receivedAt: enquiry.receivedAt,
    dueAt: enquiry.dueAt ?? null,
    firstResponseAt: enquiry.firstResponseAt ?? null,
    closingNote: enquiry.closingNote ?? null,
    assignee: assignee ? { id: assignee.id, name: assignee.name } : null,
    deal: asDoc<Deal>(enquiry.deal) ? { id: (enquiry.deal as Deal).id, title: (enquiry.deal as Deal).title, stageLabel: labelOf(DEAL_STAGES, (enquiry.deal as Deal).stage) } : null,
    /** What this enquiry says they invest through, offered while the person has no entity. */
    suggestedEntity: contact && !entity ? suggestedEntity([enquiry]) : null,
    playbook: playbook
      ? {
          name: playbook.name,
          responseHours: playbook.responseHours,
          handlers: playbook.handlerRoles ?? [],
          // Each step as the task it became once someone took the enquiry; a rule stays a line to keep in mind.
          steps: (playbook.steps ?? []).map((step) => ({ id: step.id ?? step.step, text: step.step, rule: step.when === "rule", when: labelOf(STEP_WHEN, step.when), task: (step.id && taskForStep.get(step.id)) || null })),
          template: playbookTemplate ? { id: playbookTemplate.id, name: playbookTemplate.name, purpose: playbookTemplate.purpose, subject: playbookTemplate.subject, body: playbookTemplate.body } : null,
        }
      : null,
    contact: contact
      ? {
          id: contact.id,
          name: contact.name,
          firstName: contact.name.split(/\s+/)[0],
          email: contact.email ?? null,
          phone: contact.phone ?? null,
          city: contact.city ?? null,
          kindLabel: labelOf(CONTACT_KINDS, contact.kind),
          earlierEnquiries: earlier?.totalDocs ?? 0,
          entity: entity ? { name: entity.name, typeLabel: labelOf(ENTITY_TYPES, entity.type) } : null,
        }
      : null,
    timeline: (timeline?.docs ?? []).map(timelineItem),
    staff: staff.docs.map((member) => ({ id: member.id, name: member.name })),
    products: products.docs.map((product) => ({ id: product.id, name: product.name, kind: product.kind })),
    templates: [...(playbookTemplate ? [playbookTemplate] : []), ...templates.docs.filter((template) => template.id !== playbookTemplate?.id)].map((template) => ({
      id: template.id,
      name: template.name,
      purpose: template.purpose,
      subject: template.subject,
      body: template.body,
    })),
    /** The person screen, where everything about them is. */
    personHref: contact ? `/admin/people/${contact.id}` : null,
    /** Where a meeting is held unless the composer says otherwise: the office in Office details. */
    office: await officeLine(payload),
  };
}

export type EnquiryDetail = NonNullable<Awaited<ReturnType<typeof enquiryDetail>>>;
