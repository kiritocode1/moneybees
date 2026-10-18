import { ACTIVITY_TYPES, type ActivityType, EMAIL_STATUSES, labelOf } from "@/lib/crm/vocabulary";
import type { Activity, Email, User } from "@/payload-types";

/*
 * One line of a person's timeline, flattened for the client screens (the
 * enquiry and the person): what happened, when, by whom, and for an email,
 * what became of it and the files it carried. Read activities at depth 1.
 */

export type TimelineItem = {
  id: number;
  type: ActivityType;
  typeLabel: string;
  summary: string;
  body: string | null;
  at: string;
  actor: string | null;
  emailStatus: string | null;
  emailOk: boolean | null;
  files: string[];
};

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);

export function timelineItem(item: Activity): TimelineItem {
  const email = asDoc<Email>(item.email);
  return {
    id: item.id,
    type: item.type as ActivityType,
    typeLabel: labelOf(ACTIVITY_TYPES, item.type),
    summary: item.summary,
    body: item.body ?? null,
    at: item.at,
    actor: asDoc<User>(item.actor)?.name ?? null,
    emailStatus: email ? labelOf(EMAIL_STATUSES, email.status) : null,
    emailOk: email ? !["logged", "failed", "bounced"].includes(email.status) : null,
    files: (email?.attachments ?? []).map((file) => file.name),
  };
}
