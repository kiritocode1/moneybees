import type { Payload } from "payload";
import { CATALOGUE, type Field } from "@/emails";
import { REPLY_PURPOSES } from "@/lib/crm/enquiry-detail";
import { enquiryReference } from "@/lib/crm/enquiries";
import { suggestedEntity } from "@/lib/crm/entities";
import { emailConnected } from "@/lib/crm/mail";
import { letterFor } from "@/lib/crm/tasks";
import { timelineItem } from "@/lib/crm/timeline";
import { CONTACT_KINDS, CONTACT_SOURCES, DEAL_STAGES, ENQUIRY_KIND_LABELS, ENQUIRY_STATUSES, ENTITY_TYPES, labelOf, LOST_REASONS, TASK_KINDS, TOPICS } from "@/lib/crm/vocabulary";
import { hasRole } from "@/lib/backend/roles";
import { DEFAULT_DETAILS } from "@/lib/site/details";
import type { Contact, Deal, Entity, Investor, Product, User } from "@/payload-types";

/*
 * Everything /admin/people/:id shows, read in one pass with the staff
 * member's own access and flattened for the client screen: who they are,
 * every letter that can go to them, the timeline, their open tasks,
 * enquiries, deals and account.
 */

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);
const DAY = 86_400_000;

/** What the composer's Letter menu offers. An enquiry letter replies on their latest enquiry; a client letter takes its facts; "own" is a plain letter. */
export type LetterOption =
  | { key: string; kind: "enquiry"; name: string; templateId: number; purpose: string; subject: string; body: string; entryId: string | null }
  | { key: string; kind: "here"; name: string; entryId: string; fields: Field[] }
  | { key: "own"; kind: "own"; name: string };

export async function personDetail(payload: Payload, user: User, id: number, now = new Date()) {
  const contact = await payload.findByID({ collection: "contacts", id, depth: 1, user, overrideAccess: false, disableErrors: true });
  if (!contact) return null;

  const entityId = (typeof contact.entity === "object" ? contact.entity?.id : contact.entity) ?? null;
  const [timeline, enquiries, deals, tasks, staff, products, templates, site, sharing] = await Promise.all([
    payload.find({ collection: "activities", where: { contact: { equals: id } }, sort: "-at", limit: 100, depth: 1, user, overrideAccess: false }),
    payload.find({ collection: "enquiries", where: { contact: { equals: id } }, sort: "-receivedAt", limit: 20, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "deals", where: { contact: { equals: id } }, sort: "-updatedAt", limit: 20, depth: 1, user, overrideAccess: false }),
    payload.find({ collection: "tasks", where: { contact: { equals: id }, doneAt: { exists: false } }, sort: "dueAt", limit: 50, depth: 1, user, overrideAccess: false }),
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "products", sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.find({ collection: "email-templates", where: { purpose: { in: [...REPLY_PURPOSES] } }, sort: "name", limit: 50, depth: 0, user, overrideAccess: false }),
    payload.findGlobal({ slug: "site-details", depth: 0, overrideAccess: true }),
    entityId ? payload.find({ collection: "contacts", where: { entity: { equals: entityId }, id: { not_equals: id } }, limit: 10, depth: 0, user, overrideAccess: false, select: { name: true } }) : null,
  ]);

  // Enquiry letters reply on the latest enquiry that is not spam.
  const enquiry = enquiries.docs.find((doc) => doc.status !== "spam") ?? null;
  const letters: LetterOption[] = [
    ...(enquiry ? templates.docs.map((template) => ({ key: `t:${template.id}`, kind: "enquiry" as const, name: template.name, templateId: template.id, purpose: template.purpose, subject: template.subject, body: template.body ?? "", entryId: letterFor(template.purpose) })) : []),
    ...CATALOGUE.filter((entry) => entry.channel === "here").map((entry) => ({ key: `e:${entry.id}`, kind: "here" as const, name: entry.name, entryId: entry.id, fields: entry.fields ?? [] })),
    { key: "own", kind: "own", name: "A letter in your own words" },
  ];

  const entity = asDoc<Entity>(contact.entity);
  const owner = asDoc<User>(contact.owner);
  const investor = asDoc<Investor>(contact.investor);
  const address = (site.updatedAt ? site : DEFAULT_DETAILS).address;

  return {
    id: contact.id,
    name: contact.name,
    firstName: contact.name.split(/\s+/)[0],
    email: contact.email ?? null,
    phone: contact.phone ?? null,
    city: contact.city ?? null,
    kind: contact.kind,
    kindLabel: labelOf(CONTACT_KINDS, contact.kind),
    source: contact.source ? labelOf(CONTACT_SOURCES, contact.source) : null,
    firstWrote: enquiries.docs.at(-1)?.receivedAt ?? contact.createdAt,
    topics: (contact.topics ?? []) as string[],
    topicLabels: (contact.topics ?? []).map((topic) => labelOf(TOPICS, topic)),
    unsubscribed: Boolean(contact.unsubscribedAt),
    owner: owner ? { id: owner.id, name: owner.name } : null,
    referredBy: asDoc<Contact>(contact.referredBy)?.name ?? null,
    entity: entity ? { id: entity.id, name: entity.name, type: entity.type, typeLabel: labelOf(ENTITY_TYPES, entity.type), others: (sharing?.docs ?? []).map((other) => ({ id: other.id, name: other.name })) } : null,
    /** What their enquiry says they invest through, offered while they have no entity. */
    suggestedEntity: entity ? null : suggestedEntity(enquiries.docs),
    portal: investor ? { id: investor.id, disabled: investor.status === "disabled", invitedAt: investor.invitedAt ?? null, lastSignInAt: investor.lastSignInAt ?? null } : null,
    /** Operations open client accounts (collections/Investors.ts access). */
    canInvite: hasRole(user, "operations"),
    /** The signed-in staff member, who signs anything sent from here. */
    sender: user.name,
    senderId: user.id,
    emailConnected: emailConnected(),
    office: `${address.line1} ${address.line2}`,
    /** The enquiry an enquiry letter replies on. */
    enquiry: enquiry ? { id: enquiry.id, reference: enquiryReference(enquiry.id), kindLabel: ENQUIRY_KIND_LABELS[enquiry.kind as keyof typeof ENQUIRY_KIND_LABELS] } : null,
    letters,
    timeline: timeline.docs.map(timelineItem),
    tasks: tasks.docs.map((task) => ({
      id: task.id,
      title: task.title,
      kind: task.kind,
      kindLabel: labelOf(TASK_KINDS, task.kind),
      dueAt: task.dueAt,
      overdue: new Date(task.dueAt) < now,
      owner: asDoc<User>(task.owner)?.name ?? null,
      letter: task.letter ?? null,
    })),
    /** A phone to call from a Call task. */
    callable: Boolean(contact.phone),
    enquiries: enquiries.docs.map((doc) => {
      const answers = (doc.answers ?? {}) as Record<string, string>;
      return {
        id: doc.id,
        reference: enquiryReference(doc.id),
        kindLabel: ENQUIRY_KIND_LABELS[doc.kind as keyof typeof ENQUIRY_KIND_LABELS],
        detail: answers.amount ?? answers.commitment ?? answers.topic ?? answers.subject ?? null,
        status: doc.status,
        statusLabel: labelOf(ENQUIRY_STATUSES, doc.status),
        receivedAt: doc.receivedAt,
        firstResponseAt: doc.firstResponseAt ?? null,
      };
    }),
    deals: deals.docs.map((deal: Deal) => ({
      id: deal.id,
      productName: asDoc<Product>(deal.product)?.name ?? "Deal",
      kind: asDoc<Product>(deal.product)?.kind ?? "pms",
      entity: asDoc<Entity>(deal.entity)?.name ?? null,
      hasEnquiry: Boolean(enquiry),
      stage: deal.stage,
      stageLabel: labelOf(DEAL_STAGES, deal.stage),
      ticketSize: deal.ticketSize ?? null,
      days: deal.stageChangedAt ? Math.max(0, Math.floor((now.getTime() - new Date(deal.stageChangedAt).getTime()) / DAY)) : null,
      lost: deal.stage === "lost" ? [deal.lostWhy ? labelOf(LOST_REASONS, deal.lostWhy) : null, deal.lostReason].filter(Boolean).join(": ") || null : null,
    })),
    staff: staff.docs.map((member) => ({ id: member.id, name: member.name })),
    products: products.docs.map((product) => ({ id: product.id, name: product.name, kind: product.kind })),
  };
}

export type PersonDetail = NonNullable<Awaited<ReturnType<typeof personDetail>>>;
