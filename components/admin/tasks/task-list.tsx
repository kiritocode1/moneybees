"use client";

import { Check, CircleCheck, Mail, Phone, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { dueLabel, istAt } from "@/lib/crm/due";
import { completeTask, noteTaskOutcome, reopenTask } from "@/lib/crm/person-actions";
import type { TaskRow } from "@/lib/crm/task-desk";
import { QuickTaskDialog } from "./quick-task";

/*
 * Tasks as the Tasks desk and Today show them: grouped by when they are due,
 * overdue first. Each row is done from the row: the number to call, or Write,
 * which opens the person's composer on the task's letter (sending it ticks
 * the task). Ticking one keeps it at the top a moment, for a line on what
 * happened, a follow-up, or Undo.
 */

const GROUPS = ["Overdue", "Today", "Tomorrow", "This week", "Later"] as const;

/** Which group a due time falls in, by Mumbai days. */
function groupOf(dueAt: string, now: Date): (typeof GROUPS)[number] {
  const at = new Date(dueAt);
  if (at < now) return "Overdue";
  if (at < istAt(now, 1, 0)) return "Today";
  if (at < istAt(now, 2, 0)) return "Tomorrow";
  if (at < istAt(now, 7, 0)) return "This week";
  return "Later";
}

function KindIcon({ kind }: { kind: TaskRow["kind"] }) {
  const props = { size: 14, "aria-hidden": true, className: "text-muted-foreground" } as const;
  if (kind === "call") return <Phone {...props} />;
  if (kind === "email") return <Mail {...props} />;
  if (kind === "meeting") return <Users {...props} />;
  return <CircleCheck {...props} />;
}

function Chips({ task }: { task: TaskRow }) {
  const chip = "inline-flex h-5 items-center rounded px-1.5 text-caption text-muted-foreground no-underline bg-muted hover:text-foreground";
  return (
    <>
      {task.person ? (
        <Link href={`/admin/people/${task.person.id}`} className={chip}>
          {task.person.name}
        </Link>
      ) : null}
      {task.enquiry ? (
        <Link href={`/admin/inbox/${task.enquiry.id}`} className={`${chip} tabular-nums`}>
          {task.enquiry.reference}
        </Link>
      ) : null}
      {task.deal ? <span className={chip}>{task.deal.label}</span> : null}
      {task.source ? <span className="text-caption text-muted-foreground">{task.source}</span> : null}
    </>
  );
}

/** The thing to do from the row: call the number, or write the letter. */
function DoIt({ task }: { task: TaskRow }) {
  if (task.kind === "call" && task.person?.phone) {
    return (
      <Button size="compact" variant="secondary" leadingIcon={Phone} render={<a href={`tel:${task.person.phone}`} className="no-underline" />}>
        {task.person.phone}
      </Button>
    );
  }
  if (task.kind === "email" && task.person?.email) {
    return (
      <Button size="compact" variant="secondary" leadingIcon={Mail} render={<Link href={`/admin/people/${task.person.id}?task=${task.id}`} className="no-underline" />}>
        Write
      </Button>
    );
  }
  return null;
}

export function TaskList({ rows, now, showOwner = false, done = false, empty }: { rows: TaskRow[]; now: Date; showOwner?: boolean; done?: boolean; empty: string }) {
  const [justDone, setJustDone] = useState<TaskRow[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [followUp, setFollowUp] = useState<TaskRow["person"] | undefined>(undefined);
  const { error, run } = useAction();
  const forget = (id: number) => setJustDone((now) => now.filter((task) => task.id !== id));
  const open = rows.filter((task) => !justDone.some((item) => item.id === task.id));

  const tick = (task: TaskRow) => {
    setJustDone((now) => [task, ...now]);
    run(() => completeTask(task.id));
  };

  const row = (task: TaskRow) => (
    <li key={task.id} className="grid grid-cols-[18px_16px_minmax(0,1fr)] items-start gap-2.5 border-t px-2 py-2.5 sm:grid-cols-[18px_16px_minmax(0,1fr)_auto_128px] sm:items-center">
      {done ? (
        <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7fd3a6] text-[#0b1a12] sm:mt-0">
          <Check size={10} aria-hidden="true" />
        </span>
      ) : (
        <button type="button" aria-label={`Done: ${task.title}`} onClick={() => tick(task)} className="mt-0.5 h-4 w-4 cursor-pointer rounded-full border-[1.5px] border-foreground/35 bg-transparent p-0 hover:border-foreground sm:mt-0" />
      )}
      <span className="mt-0.5 sm:mt-0">
        <KindIcon kind={task.kind} />
      </span>
      <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className={done ? "text-body text-muted-foreground" : "text-body text-foreground"}>{task.title}</span>
        <Chips task={task} />
        {showOwner && task.owner ? <span className="text-caption text-muted-foreground">{task.owner.name}</span> : null}
        {done && task.outcome ? <span className="basis-full text-caption text-muted-foreground">{task.outcome}</span> : null}
      </span>
      <span className="col-start-3 sm:col-start-auto">{done ? null : <DoIt task={task} />}</span>
      <span className={`col-start-3 text-caption tabular-nums sm:col-start-auto sm:text-right ${task.overdue ? "text-destructive" : "text-muted-foreground"}`}>
        {done && task.doneAt ? `Done ${dueLabel(new Date(task.doneAt), now)}` : dueLabel(new Date(task.dueAt), now)}
      </span>
    </li>
  );

  if (!open.length && !justDone.length) return <p className="rounded-xl border border-dashed px-6 py-10 text-center text-body text-muted-foreground">{empty}</p>;

  return (
    <div className="grid gap-6">
      {justDone.length ? (
        <section aria-label="Just done">
          <ul className="m-0 grid list-none p-0">
            {justDone.map((task) => (
              <li key={task.id} className="grid gap-2 border-t px-2 py-2.5">
                <div className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-2.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7fd3a6] text-[#0b1a12]">
                    <Check size={10} aria-hidden="true" />
                  </span>
                  <span className="text-body text-muted-foreground line-through">{task.title}</span>
                  <Button size="compact" variant="ghost" onClick={() => run(() => reopenTask(task.id), () => forget(task.id))}>
                    Undo
                  </Button>
                </div>
                <form
                  className="grid gap-2 pl-7 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    run(() => noteTaskOutcome(task.id, notes[task.id] ?? ""), () => forget(task.id));
                  }}
                >
                  <input
                    value={notes[task.id] ?? ""}
                    onChange={(event) => setNotes({ ...notes, [task.id]: event.target.value })}
                    placeholder="What happened (optional)"
                    aria-label={`What happened: ${task.title}`}
                    className="h-8 min-w-0 rounded-lg border bg-transparent px-2.5 text-body text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground/40"
                  />
                  <Button type="submit" size="compact" variant="secondary" disabled={!notes[task.id]?.trim()}>
                    Save to timeline
                  </Button>
                  {task.person ? (
                    <Button type="button" size="compact" variant="ghost" onClick={() => setFollowUp(task.person)}>
                      Then add a task
                    </Button>
                  ) : null}
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {done ? (
        <ul className="m-0 grid list-none p-0">{open.map(row)}</ul>
      ) : (
        GROUPS.map((group) => {
          const tasks = open.filter((task) => groupOf(task.dueAt, now) === group);
          if (!tasks.length) return null;
          return (
            <section key={group} aria-label={group}>
              <h2 className="mb-1.5 flex items-baseline gap-2 px-2 text-body font-semibold text-foreground">
                {group}
                <span className={`font-normal tabular-nums ${group === "Overdue" ? "text-destructive" : "text-muted-foreground"}`}>{tasks.length}</span>
              </h2>
              <ul className="m-0 grid list-none p-0">{tasks.map(row)}</ul>
            </section>
          );
        })
      )}
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <QuickTaskDialog open={followUp !== undefined} onClose={() => setFollowUp(undefined)} person={followUp ? { id: followUp.id, name: followUp.name, detail: followUp.email ?? followUp.phone } : null} />
    </div>
  );
}
