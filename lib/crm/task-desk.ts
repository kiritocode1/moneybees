import type { Payload, Where } from "payload";
import { istAt } from "@/lib/crm/due";
import { enquiryReference } from "@/lib/crm/reference";
import { labelOf, TASK_KINDS, TASK_SOURCES, type TaskKind } from "@/lib/crm/vocabulary";
import type { Contact, Deal, Enquiry, Product, Task, User } from "@/payload-types";

/*
 * The Tasks desk (/admin/tasks) and the task rows Today shows: each task
 * with who it is for, its enquiry and deal, when it is due, and what to do
 * from the row (the number to call, the letter to write).
 */

export const TASK_TABS = [
  { key: "mine", label: "Mine" },
  { key: "team", label: "Team" },
  { key: "asked", label: "Asked of others" },
  { key: "done", label: "Done" },
] as const;
export type TaskTab = (typeof TASK_TABS)[number]["key"];

export type TaskRow = {
  id: number;
  title: string;
  kind: TaskKind;
  kindLabel: string;
  dueAt: string;
  overdue: boolean;
  doneAt: string | null;
  doneBy: string | null;
  outcome: string | null;
  owner: { id: number; name: string } | null;
  person: { id: number; name: string; phone: string | null; email: string | null } | null;
  enquiry: { id: number; reference: string } | null;
  deal: { id: number; label: string } | null;
  /** "From a playbook", "From a call"; empty for one added by hand. */
  source: string | null;
  letter: string | null;
};

const DONE_DAYS = 14;
const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);

export function taskRow(task: Task, now: Date): TaskRow {
  const person = asDoc<Contact>(task.contact);
  const owner = asDoc<User>(task.owner);
  const enquiry = asDoc<Enquiry>(task.enquiry);
  const deal = asDoc<Deal>(task.deal);
  const product = deal ? asDoc<Product>(deal.product) : null;
  return {
    id: task.id,
    title: task.title,
    kind: task.kind,
    kindLabel: labelOf(TASK_KINDS, task.kind),
    dueAt: task.dueAt,
    overdue: !task.doneAt && new Date(task.dueAt) < now,
    doneAt: task.doneAt ?? null,
    doneBy: asDoc<User>(task.doneBy)?.name ?? null,
    outcome: task.outcome ?? null,
    owner: owner ? { id: owner.id, name: owner.name } : null,
    person: person ? { id: person.id, name: person.name, phone: person.phone ?? null, email: person.email ?? null } : null,
    enquiry: enquiry ? { id: enquiry.id, reference: enquiryReference(enquiry.id) } : null,
    deal: deal ? { id: deal.id, label: `${product?.name ?? "Deal"}${deal.ticketSize ? `, Rs. ${deal.ticketSize} cr` : ""}` } : null,
    source: task.source && task.source !== "manual" ? `From ${labelOf(TASK_SOURCES, task.source).replace(/^A /, "a ")}` : null,
    letter: task.letter ?? null,
  };
}

const open: Where = { doneAt: { exists: false } };

function whereFor(tab: TaskTab, user: User, now: Date): Where {
  if (tab === "mine") return { and: [open, { owner: { equals: user.id } }] };
  if (tab === "asked") return { and: [open, { createdBy: { equals: user.id } }, { owner: { not_equals: user.id } }] };
  if (tab === "done") return { and: [{ doneAt: { greater_than: new Date(now.getTime() - DONE_DAYS * 86_400_000).toISOString() } }, { or: [{ owner: { equals: user.id } }, { doneBy: { equals: user.id } }] }] };
  return open;
}

/** Tasks for one tab, at most 300, soonest first (Done: latest first). */
export async function taskRows(payload: Payload, user: User, tab: TaskTab, now = new Date()) {
  const { docs } = await payload.find({ collection: "tasks", where: whereFor(tab, user, now), sort: tab === "done" ? "-doneAt" : "dueAt", limit: 300, depth: 2, user, overrideAccess: false });
  return docs.map((task) => taskRow(task, now));
}

/** How many of this person's tasks are overdue or due today: the menu's count. */
export async function dueCount(payload: Payload, user: User, now = new Date()) {
  const { totalDocs } = await payload.count({ collection: "tasks", where: { and: [open, { owner: { equals: user.id } }, { dueAt: { less_than: istAt(now, 1, 0).toISOString() } }] }, user, overrideAccess: false });
  return totalDocs;
}

export async function taskDesk(payload: Payload, user: User, tab: TaskTab, now = new Date()) {
  const [rows, counts, staff] = await Promise.all([
    taskRows(payload, user, tab, now),
    Promise.all(TASK_TABS.map(async ({ key }) => [key, (await payload.count({ collection: "tasks", where: whereFor(key, user, now), user, overrideAccess: false })).totalDocs] as const)),
    payload.find({ collection: "users", where: { roles: { in: ["sales", "operations", "compliance", "admin"] } }, sort: "name", limit: 100, depth: 0, user, overrideAccess: false }),
  ]);
  return { tab, rows, counts: Object.fromEntries(counts) as Record<TaskTab, number>, staff: staff.docs.map((member) => ({ id: member.id, name: member.name })), me: user.id };
}

export type TaskDesk = Awaited<ReturnType<typeof taskDesk>>;
