import type { Payload, Where } from "payload";
import { INBOX_TABS, type InboxRow, type InboxTab } from "@/lib/crm/inbox-tabs";
import { enquiryReference } from "@/lib/crm/reference";
import { effectiveSeverity, type EnquiryKind, rank, type Severity } from "@/lib/crm/severity";
import { ENQUIRY_KIND_LABELS, ENQUIRY_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import type { Contact, User } from "@/payload-types";

/*
 * The shared enquiry inbox at /admin/inbox. Every CRM role sees every
 * enquiry (user, 2026-10-12); the tabs only narrow the list. Rows sort by the
 * severity shown now (overdue ones have gone up a level), then by deadline.
 */

export { INBOX_TABS, type InboxRow, type InboxTab };

const OPEN = ["new", "open"];

function whereFor(tab: InboxTab, user: User): Where {
  switch (tab) {
    case "waiting":
      return { status: { in: OPEN } };
    case "mine":
      return { and: [{ assignee: { equals: user.id } }, { status: { in: [...OPEN, "waiting"] } }] };
    case "them":
      return { status: { equals: "waiting" } };
    case "closed":
      return { status: { in: ["converted", "closed", "spam"] } };
  }
}

const nameOf = (value: number | User | Contact | null | undefined) => (value && typeof value === "object" ? value.name : null);

export async function inboxRows(payload: Payload, user: User, tab: InboxTab, now = new Date()): Promise<InboxRow[]> {
  const { docs } = await payload.find({ collection: "enquiries", where: whereFor(tab, user), sort: "-receivedAt", limit: 300, depth: 1, user, overrideAccess: false });
  const rows = docs.map((doc): InboxRow => {
    const answers = (doc.answers ?? {}) as Record<string, string>;
    const shown = effectiveSeverity(doc.severity as Severity, doc.dueAt, doc.status, now);
    return {
      id: doc.id,
      reference: enquiryReference(doc.id),
      name: nameOf(doc.contact) ?? answers.name ?? "Unknown",
      kind: doc.kind as EnquiryKind,
      kindLabel: ENQUIRY_KIND_LABELS[doc.kind as EnquiryKind],
      detail: answers.amount ?? answers.commitment ?? answers.topic ?? answers.subject ?? null,
      severity: shown.severity,
      overdue: shown.overdue,
      status: doc.status,
      statusLabel: labelOf(ENQUIRY_STATUSES, doc.status),
      receivedAt: doc.receivedAt,
      dueAt: doc.dueAt ?? null,
      assignee: nameOf(doc.assignee),
    };
  });
  if (tab === "closed") return rows;
  const due = (row: InboxRow) => (row.dueAt ? new Date(row.dueAt).getTime() : Infinity);
  return rows.sort((a, b) => rank(b.severity) - rank(a.severity) || due(a) - due(b));
}

/** How many enquiries each tab holds, for the tab labels. */
export async function inboxCounts(payload: Payload, user: User): Promise<Record<InboxTab, number>> {
  const entries = await Promise.all(
    INBOX_TABS.map(async ({ key }) => [key, (await payload.count({ collection: "enquiries", where: whereFor(key, user), user, overrideAccess: false })).totalDocs] as const),
  );
  return Object.fromEntries(entries) as Record<InboxTab, number>;
}
