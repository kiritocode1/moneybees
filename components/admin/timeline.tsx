"use client";

import { CircleCheck, FileText, Globe, Mail, MailOpen, Paperclip, Phone, Repeat, Settings2, StickyNote, Users } from "lucide-react";
import { Badge } from "@/components/fluid/badge";
import { istDateTime, relative } from "@/lib/crm/format";
import type { TimelineItem } from "@/lib/crm/timeline";
import type { ActivityType } from "@/lib/crm/vocabulary";

/*
 * A person's timeline as the enquiry and person screens draw it: one line per
 * thing that happened, newest first, with what became of each email and the
 * files it carried.
 */

const ICONS: Record<ActivityType, typeof Mail> = {
  form: FileText,
  email_out: Mail,
  email_in: MailOpen,
  email_event: MailOpen,
  call: Phone,
  meeting: Users,
  note: StickyNote,
  page_view: Globe,
  stage: Repeat,
  task: CircleCheck,
  system: Settings2,
};

export function TimelineList({ items, now, empty = "Nothing yet." }: { items: TimelineItem[]; now: Date; empty?: string }) {
  if (!items.length) return <p className="text-body text-muted-foreground">{empty}</p>;
  return (
    <ol className="m-0 grid list-none gap-0 p-0">
      {items.map((item) => {
        const Icon = ICONS[item.type] ?? Settings2;
        return (
          <li key={item.id} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-5 before:absolute before:top-7 before:bottom-0 before:left-[13.5px] before:w-px before:bg-border last:before:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border bg-card text-muted-foreground">
              <Icon size={13} aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-body text-foreground">{item.summary}</span>
                {item.emailStatus ? (
                  <Badge size="compact" color={item.emailOk ? "gray" : "amber"}>
                    {item.emailStatus}
                  </Badge>
                ) : null}
                <span className="text-caption text-muted-foreground tabular-nums" title={istDateTime(item.at)}>
                  {relative(item.at, now)}
                </span>
              </div>
              {item.body ? <p className="mt-1 line-clamp-4 text-body whitespace-pre-wrap text-muted-foreground">{item.body}</p> : null}
              {item.files.length ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.files.map((name) => (
                    <span key={name} className="inline-flex h-6 items-center gap-1 rounded-md bg-muted px-2 text-caption text-muted-foreground">
                      <Paperclip size={11} aria-hidden="true" />
                      {name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
