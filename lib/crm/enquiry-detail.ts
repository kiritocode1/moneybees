import type { Payload } from "payload";
import { answersFor, enquiryReference } from "@/lib/crm/enquiries";
import { effectiveSeverity, type EnquiryKind, type Reason, type Severity } from "@/lib/crm/severity";
import type { TriageAnswers } from "@/lib/crm/triage";
import { ACTIVITY_TYPES, type ActivityType, CONTACT_KINDS, EMAIL_STATUSES, ENQUIRY_KIND_LABELS, ENQUIRY_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import type { Contact, Email, Playbook, User } from "@/payload-types";

/*
 * Everything /admin/inbox/:id shows, read in one pass with the staff
 * member's own access and flattened to plain values for the client screen.
 */

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);

export type TimelineItem = { id: number; type: ActivityType; typeLabel: string; summary: string; body: string | null; at: string; actor: string | null; emailStatus: string | null };

export async function enquiryDetail(payload: Payload, user: User, id: number, now = new Date()) {
  const enquiry = await payload.findByID({ collection: "enquiries", id, depth: 1, user, overrideAccess: false, disableErrors: true });
  if (!enquiry) return null;
  const contact = asDoc<Contact>(enquiry.contact);
  const playbookRef = asDoc<Playbook>(enquiry.playbook);

  const [playbook, timeline, earlier, staff, products, templates] = await Promise.all([
    playbookRef ? payload.findByID({ collection: "playbooks", id: playbookRef.id, depth: 1, user, overrideAccess: false }) : null,
    contact ? payload.find({ collection: "activities", where: { contact: { equals: contact.id } }, sort: "-at", limit: 80, depth: 1, user, overrideAccess: false }) : null,
    contact ? payload.count({ collection: "enquiries", where: { contact: { equals: contact.id }, id: { not_equals: id } }, user, overrideAccess: false }) : null,
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "products", sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "email-templates", where: { purpose: { in: ["enquiry_reply", "follow_up"] } }, sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
  ]);

  const triage = (enquiry.triage ?? {}) as { rules?: Reason[]; ai?: TriageAnswers; existingInvestor?: boolean };
  const shown = effectiveSeverity(enquiry.severity as Severity, enquiry.dueAt, enquiry.status, now);
  const playbookTemplate = playbook && typeof playbook.template === "object" ? playbook.template : null;
  const assignee = asDoc<User>(enquiry.assignee);
  const kind = enquiry.kind as EnquiryKind;

  return {
    id: enquiry.id,
    /** The signed-in staff member, who signs any reply. */
    sender: user.name,
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
    deal: asDoc(enquiry.deal) ? { id: (enquiry.deal as { id: number }).id, title: (enquiry.deal as { title: string }).title } : null,
    playbook: playbook
      ? {
          name: playbook.name,
          responseHours: playbook.responseHours,
          handlers: playbook.handlerRoles ?? [],
          steps: (playbook.steps ?? []).map((step) => step.step),
          template: playbookTemplate ? { id: playbookTemplate.id, name: playbookTemplate.name, subject: playbookTemplate.subject, body: playbookTemplate.body } : null,
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
        }
      : null,
    timeline: (timeline?.docs ?? []).map(
      (item): TimelineItem => ({
        id: item.id,
        type: item.type as ActivityType,
        typeLabel: labelOf(ACTIVITY_TYPES, item.type),
        summary: item.summary,
        body: item.body ?? null,
        at: item.at,
        actor: asDoc<User>(item.actor)?.name ?? null,
        emailStatus: asDoc<Email>(item.email) ? labelOf(EMAIL_STATUSES, (item.email as Email).status) : null,
      }),
    ),
    staff: staff.docs.map((member) => ({ id: member.id, name: member.name })),
    products: products.docs.map((product) => ({ id: product.id, name: product.name, kind: product.kind })),
    templates: [...(playbookTemplate ? [playbookTemplate] : []), ...templates.docs.filter((template) => template.id !== playbookTemplate?.id)].map((template) => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
    })),
  };
}

export type EnquiryDetail = NonNullable<Awaited<ReturnType<typeof enquiryDetail>>>;
