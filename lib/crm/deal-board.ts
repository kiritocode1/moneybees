import type { Payload, Where } from "payload";
import { istParts } from "@/lib/crm/due";
import { DEAL_STAGES, type DealStage, labelOf, LOST_REASONS } from "@/lib/crm/vocabulary";
import type { Contact, Deal, Entity, Product, Task, User } from "@/payload-types";

/*
 * The deals board (/admin/deals): each deal of one product kind with its
 * person, the entity they invest through, the amount, how long it has sat
 * at its stage, who owns it, and its next task, so a deal with no next step
 * shows. Invested covers this quarter and Lost the last 90 days; the open
 * stages show everything.
 */

export type DealKind = "pms" | "aif";
export const OPEN_STAGES = ["enquiry", "contacted", "meeting", "documents", "onboarding"] as const satisfies readonly DealStage[];

export type DealCard = {
  id: number;
  person: { id: number; name: string; email: string | null; hasPortal: boolean } | null;
  /** Whether the person has an enquiry, which the Meeting confirmation replies on. */
  hasEnquiry: boolean;
  entity: string | null;
  product: string;
  stage: DealStage;
  stageLabel: string;
  amount: number | null;
  /** Days at this stage; amber from 14. */
  days: number | null;
  owner: { id: number; name: string; initials: string } | null;
  next: { title: string; kind: Task["kind"]; dueAt: string; overdue: boolean } | null;
  investedOn: string | null;
  lost: string | null;
};

const DAY = 86_400_000;
const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

/** The first day of this calendar quarter in Mumbai, as the board's Invested column counts. */
export function quarterStart(now: Date) {
  const { year, month } = istParts(now);
  return new Date(Date.UTC(year, month - (month % 3), 1) - 330 * 60_000);
}

export async function dealBoard(payload: Payload, user: User, { kind, owner }: { kind: DealKind; owner: number | null }, now = new Date()) {
  const products = await payload.find({ collection: "products", where: { kind: { equals: kind } }, limit: 20, depth: 0, user, overrideAccess: false });
  const productIds = products.docs.map((product) => product.id);
  const since = { quarter: quarterStart(now).toISOString(), lost: new Date(now.getTime() - 90 * DAY).toISOString() };
  const where: Where = {
    and: [
      { product: { in: productIds.length ? productIds : [0] } },
      ...(owner ? [{ owner: { equals: owner } }] : []),
      { or: [{ stage: { in: [...OPEN_STAGES] } }, { and: [{ stage: { equals: "invested" } }, { stageChangedAt: { greater_than_equal: since.quarter } }] }, { and: [{ stage: { equals: "lost" } }, { stageChangedAt: { greater_than_equal: since.lost } }] }] },
    ],
  };
  const [deals, staff, counts] = await Promise.all([
    payload.find({ collection: "deals", where, sort: "-updatedAt", limit: 500, depth: 1, user, overrideAccess: false }),
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
    Promise.all(
      (["pms", "aif"] as const).map(async (each) => {
        const ids = (await payload.find({ collection: "products", where: { kind: { equals: each } }, limit: 20, depth: 0, user, overrideAccess: false })).docs.map((product) => product.id);
        const { totalDocs } = await payload.count({ collection: "deals", where: { product: { in: ids.length ? ids : [0] }, stage: { in: [...OPEN_STAGES] } }, user, overrideAccess: false });
        return [each, totalDocs] as const;
      }),
    ),
  ]);

  // A deal's next step: its earliest open task, or failing that its person's.
  const contactIds = deals.docs.map((deal) => (typeof deal.contact === "object" ? deal.contact.id : deal.contact));
  const tasks = deals.docs.length
    ? await payload.find({
        collection: "tasks",
        where: { doneAt: { exists: false }, or: [{ deal: { in: deals.docs.map((deal) => deal.id) } }, { contact: { in: contactIds } }] },
        sort: "dueAt",
        limit: 1000,
        depth: 0,
        user,
        overrideAccess: false,
      })
    : { docs: [] as Task[] };
  const asked = contactIds.length
    ? await payload.find({ collection: "enquiries", where: { contact: { in: contactIds }, status: { not_equals: "spam" } }, limit: 1000, depth: 0, user, overrideAccess: false, select: { contact: true } })
    : { docs: [] };
  const withEnquiry = new Set(asked.docs.map((enquiry) => (typeof enquiry.contact === "object" ? enquiry.contact?.id : enquiry.contact)));
  const nextFor = (deal: Deal, contactId: number) => tasks.docs.find((task) => task.deal === deal.id) ?? tasks.docs.find((task) => task.contact === contactId) ?? null;

  const cards: DealCard[] = deals.docs.map((deal) => {
    const person = asDoc<Contact>(deal.contact);
    const dealOwner = asDoc<User>(deal.owner);
    const next = person ? nextFor(deal, person.id) : null;
    return {
      id: deal.id,
      person: person ? { id: person.id, name: person.name, email: person.email ?? null, hasPortal: Boolean(person.investor) } : null,
      hasEnquiry: person ? withEnquiry.has(person.id) : false,
      entity: asDoc<Entity>(deal.entity)?.name ?? null,
      product: asDoc<Product>(deal.product)?.name ?? "Deal",
      stage: deal.stage,
      stageLabel: labelOf(DEAL_STAGES, deal.stage),
      amount: deal.ticketSize ?? null,
      days: deal.stageChangedAt ? Math.max(0, Math.floor((now.getTime() - new Date(deal.stageChangedAt).getTime()) / DAY)) : null,
      owner: dealOwner ? { id: dealOwner.id, name: dealOwner.name, initials: initials(dealOwner.name) } : null,
      next: next ? { title: next.title, kind: next.kind, dueAt: next.dueAt, overdue: new Date(next.dueAt) < now } : null,
      investedOn: deal.investedOn ?? null,
      lost: deal.stage === "lost" ? [deal.lostWhy ? labelOf(LOST_REASONS, deal.lostWhy) : null, deal.lostReason].filter(Boolean).join(": ") || null : null,
    };
  });

  return {
    kind,
    owner,
    cards,
    counts: Object.fromEntries(counts) as Record<DealKind, number>,
    staff: staff.docs.map((member) => ({ id: member.id, name: member.name })),
    me: user.id,
    /** Operations open client accounts, which moving to Invested offers. */
    canInvite: user.roles?.some((role) => role === "operations" || role === "admin") ?? false,
  };
}

export type DealBoard = Awaited<ReturnType<typeof dealBoard>>;
