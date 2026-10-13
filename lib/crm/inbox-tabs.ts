import type { EnquiryKind, Severity } from "@/lib/crm/severity";

/** The inbox tabs and the row shape, shared by the server query (lib/crm/inbox.ts) and the client list. */
export const INBOX_TABS = [
  { key: "waiting", label: "Waiting on us" },
  { key: "mine", label: "Mine" },
  { key: "them", label: "Waiting on them" },
  { key: "closed", label: "Closed" },
] as const;
export type InboxTab = (typeof INBOX_TABS)[number]["key"];

export type InboxRow = {
  id: number;
  reference: string;
  name: string;
  kind: EnquiryKind;
  kindLabel: string;
  /** The answer that sizes it: amount band, commitment or support topic. */
  detail: string | null;
  severity: Severity;
  overdue: boolean;
  status: string;
  statusLabel: string;
  receivedAt: string;
  dueAt: string | null;
  assignee: string | null;
};
