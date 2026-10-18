"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TimelineList } from "@/components/admin/timeline";
import { Badge } from "@/components/fluid/badge";
import { dayMonthYear } from "@/lib/site/tokens";
import type { PersonDetail } from "@/lib/crm/person-detail";
import type { FileItem } from "@/lib/files/library";
import type { ActivityType } from "@/lib/crm/vocabulary";
import { Composer, type ComposerTab } from "./composer";
import { AccountPanel, DealPanel, EnquiriesPanel, TasksPanel } from "./person-panels";

/**
 * One person, laid out like an enquiry: who they are, then a composer to
 * write to them or log what happened, their timeline, and beside it each
 * thing that can be decided about them (tasks, enquiries, the deal, their
 * account), each where it lives. No row of buttons: the actions sit in the
 * composer's tabs and in the panel they change.
 */
/** A task being done from here: Write on an email task. Its letter opens, and sending it ticks the task. */
export type TaskAtHand = { id: number; title: string; letter: string | null };
/** A letter opened from elsewhere with some of its fields already known, such as the meeting's time after a deal moves to Meeting. */
export type LetterAtHand = { letter: string; fill: Record<string, string> };

export function PersonScreen({ person, attach, task, opening }: { person: PersonDetail; attach: FileItem | null; task: TaskAtHand | null; opening: LetterAtHand | null }) {
  // Ticks every 30s, as on the enquiry screen, so "in 5m" and overdue stay true.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const [tab, setTab] = useState<ComposerTab>(person.email ? "email" : "call");
  const composer = useRef<HTMLDivElement>(null);
  const openTab = (next: ComposerTab) => {
    setTab(next);
    composer.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Link href="/admin/collections/contacts" className="mt-6 inline-flex items-center gap-1.5 text-caption text-muted-foreground no-underline hover:text-foreground">
        <ArrowLeft size={14} aria-hidden="true" /> People
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{person.kindLabel}</Badge>
          {person.unsubscribed ? <Badge color="amber">Left every mailing</Badge> : null}
        </div>
        <h1 className="mt-3 text-display font-semibold tracking-[-0.01em] text-foreground">{person.name}</h1>
        <p className="mt-1 text-body text-muted-foreground tabular-nums">
          {[
            person.email,
            person.phone ? (
              <a key="phone" href={`tel:${person.phone}`} className="text-muted-foreground hover:text-foreground">
                {person.phone}
              </a>
            ) : null,
            person.city,
            `first wrote ${dayMonthYear(person.firstWrote)}`,
          ]
            .filter(Boolean)
            .flatMap((part, index) => (index ? [" · ", part] : [part]))}
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-10">
          <div ref={composer} className="scroll-mt-24">
            <Composer person={person} tab={tab} onTab={setTab} now={now} attach={attach} task={task} opening={opening} />
          </div>
          <Timeline person={person} now={now} />
        </div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <TasksPanel person={person} now={now} onAdd={() => openTab("task")} />
          <EnquiriesPanel person={person} />
          <DealPanel person={person} />
          <AccountPanel person={person} />
        </aside>
      </div>
    </>
  );
}

const FILTERS: { label: string; types: ActivityType[] | null }[] = [
  { label: "All", types: null },
  { label: "Emails", types: ["email_out", "email_in", "email_event"] },
  { label: "Calls and meetings", types: ["call", "meeting"] },
  { label: "Notes", types: ["note"] },
  { label: "Tasks", types: ["task"] },
];

function Timeline({ person, now }: { person: PersonDetail; now: Date }) {
  const [filter, setFilter] = useState(0);
  const types = FILTERS[filter].types;
  const items = types ? person.timeline.filter((item) => types.includes(item.type)) : person.timeline;
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-2">
        <h2 className="text-title font-semibold text-foreground">Timeline</h2>
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Show">
          {FILTERS.map((option, index) => (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={filter === index}
              onClick={() => setFilter(index)}
              className={`h-7 cursor-pointer rounded-md border-0 px-2.5 text-caption ${filter === index ? "bg-accent text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <TimelineList items={items} now={now} empty={filter ? "Nothing of this kind yet." : "Nothing yet."} />
    </section>
  );
}
