"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { istAt } from "@/lib/crm/due";
import { TASK_TABS, type TaskDesk } from "@/lib/crm/task-desk";
import { QuickTaskForm } from "./quick-task";
import { TaskList } from "./task-list";

/** Reloads the list this often, so tasks others add and the overdue line stay current. */
const REFRESH_MS = 60_000;

/**
 * The Tasks desk, laid out like Enquiries: a count line, tabs, the quick
 * add bar, then the tasks by when they are due. Team shows who owns each.
 */
export function TasksScreen({ desk }: { desk: TaskDesk }) {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => (setNow(new Date()), router.refresh()), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  const overdue = desk.rows.filter((task) => task.overdue).length;
  const today = desk.rows.filter((task) => !task.overdue && new Date(task.dueAt) < istAt(now, 1, 0)).length;
  const line =
    desk.tab === "done"
      ? "What was done in the last two weeks."
      : [overdue ? `${overdue} overdue.` : null, today ? `${today} due today.` : null].filter(Boolean).join(" ") || (desk.rows.length ? "Nothing overdue or due today." : "Nothing to do.");

  return (
    <>
      <header className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Tasks</h1>
          <p className="mt-1 text-body text-muted-foreground">{line}</p>
          <ScreenIntro screen="tasks" />
        </div>
        <TabsSubtle selectedIndex={TASK_TABS.findIndex(({ key }) => key === desk.tab)} onSelect={(index) => router.push(`/admin/tasks?tab=${TASK_TABS[index].key}`)} idPrefix="tasks">
          {TASK_TABS.map(({ key, label }, index) => (
            <TabsSubtleItem key={key} index={index} label={desk.counts[key] && key !== "done" ? `${label} ${desk.counts[key]}` : label} />
          ))}
        </TabsSubtle>
      </header>

      {desk.tab === "done" ? null : (
        <div className="mb-6 rounded-xl border bg-card p-2">
          <QuickTaskForm context={{ person: null, staff: desk.staff, me: desk.me }} now={now} />
        </div>
      )}

      <TaskList
        key={desk.tab}
        rows={desk.rows}
        now={now}
        showOwner={desk.tab !== "mine"}
        done={desk.tab === "done"}
        empty={{ mine: "Nothing owed by you. Tasks come from calls, playbooks and deals, or press T to add one.", team: "Nobody on the desk owes anyone anything.", asked: "Nothing you gave someone else is open.", done: "Nothing done in the last two weeks." }[desk.tab]}
      />
    </>
  );
}
