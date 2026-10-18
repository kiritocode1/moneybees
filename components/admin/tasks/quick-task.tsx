"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/fluid/dialog";
import { workingDaysAfter } from "@/lib/crm/due";
import { addTask } from "@/lib/crm/person-actions";
import { type ContactHit, findContacts, taskContext } from "@/lib/crm/task-actions";
import { kindFromTitle } from "@/lib/crm/task-kind";
import { DuePicker, OwnerSelect, type StaffOption } from "./task-fields";

/*
 * Adding a task in one line: what, for whom, when, who. On the Tasks desk
 * it sits above the list; anywhere else in /admin, T opens it, with the
 * person filled in when you are on their screen or their enquiry. The kind
 * comes from the words ("Call…" is a call), so there is one less choice.
 */

export type QuickContext = { person: ContactHit | null; staff: StaffOption[]; me: number };

const inputClass = "h-7 min-w-0 rounded-md border bg-transparent px-2.5 text-body text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground/40";

/** Who the task is for: typed and picked, or fixed when the screen already says. */
function PersonPicker({ value, onChange }: { value: ContactHit | null; onChange: (person: ContactHit | null) => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ContactHit[]>([]);
  useEffect(() => {
    if (value || query.trim().length < 2) return;
    const timer = setTimeout(() => void findContacts(query).then(setHits), 200);
    return () => clearTimeout(timer);
  }, [query, value]);
  if (value) {
    return (
      <span className="inline-flex h-7 min-w-0 items-center gap-2 rounded-md border px-2.5 text-body text-foreground">
        <span className="truncate">{value.name}</span>
        <button type="button" aria-label={`Not ${value.name}`} onClick={() => (onChange(null), setQuery(""), setHits([]))} className="ml-auto flex cursor-pointer border-0 bg-transparent p-0 text-muted-foreground hover:text-foreground">
          <X size={13} aria-hidden="true" />
        </button>
      </span>
    );
  }
  return (
    <div className="relative min-w-0">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="For whom" aria-label="For whom" className={`${inputClass} w-full`} />
      {query.trim().length >= 2 ? (
        <ul className="absolute top-full right-0 left-0 z-20 m-0 mt-1 grid list-none gap-0.5 rounded-lg border bg-popover p-1 shadow-lg">
          {hits.length ? (
            hits.map((hit) => (
              <li key={hit.id}>
                <button type="button" onClick={() => onChange(hit)} className="w-full cursor-pointer rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-body text-foreground hover:bg-accent">
                  {hit.name} {hit.detail ? <span className="text-caption text-muted-foreground">{hit.detail}</span> : null}
                </button>
              </li>
            ))
          ) : (
            <li className="px-2 py-1.5 text-caption text-muted-foreground">No one in People matches.</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

export function QuickTaskForm({ context, now, onDone, autoFocus = false, layout = "bar" }: { context: QuickContext; now: Date; onDone?: () => void; autoFocus?: boolean; layout?: "bar" | "stack" }) {
  const [title, setTitle] = useState("");
  const [person, setPerson] = useState<ContactHit | null>(context.person);
  const [dueAt, setDueAt] = useState(() => workingDaysAfter(now, 1).toISOString());
  const [owner, setOwner] = useState(context.me);
  // Bumped after each add, so the person search starts empty again.
  const [round, setRound] = useState(0);
  const { pending, error, run } = useAction();
  const ready = Boolean(title.trim() && person);

  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!person) return;
        run(
          () => addTask(person.id, { title, kind: kindFromTitle(title), dueAt, ownerId: owner }),
          () => {
            setTitle("");
            if (!context.person) setPerson(null);
            setRound((count) => count + 1);
            onDone?.();
          },
        );
      }}
    >
      <div className={layout === "bar" ? "grid gap-2 md:grid-cols-[minmax(0,1fr)_200px_200px_170px_auto] md:items-start" : "grid gap-2.5"}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task, for example Call about the meeting" aria-label="What to do" className={inputClass} autoFocus={autoFocus} />
        <PersonPicker key={round} value={person} onChange={setPerson} />
        <DuePicker value={dueAt} onChange={setDueAt} now={now} />
        <OwnerSelect staff={context.staff} me={context.me} value={owner} onChange={setOwner} />
        <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={!ready}>
          Add
        </Button>
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
    </form>
  );
}

/** What part of /admin the person is on, for filling in who a task is for. */
const placeOf = (pathname: string) => {
  const person = /^\/admin\/people\/(\d+)/.exec(pathname)?.[1];
  const enquiry = /^\/admin\/inbox\/(\d+)/.exec(pathname)?.[1];
  return { personId: person ? Number(person) : undefined, enquiryId: enquiry ? Number(enquiry) : undefined };
};

const typing = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || Boolean(target.closest("[role=dialog],[role=listbox],[role=menu]")));

/** T anywhere in /admin (not while typing) opens quick add; or `open` from a button such as Then add a task. */
export function QuickTaskDialog({ open, onClose, person }: { open: boolean; onClose: () => void; person?: ContactHit | null }) {
  const pathname = usePathname();
  const [context, setContext] = useState<QuickContext | null>(null);
  useEffect(() => {
    if (!open) return;
    let live = true;
    void taskContext(person ? { personId: person.id } : placeOf(pathname)).then((found) => {
      if (live) setContext(found);
    });
    return () => {
      live = false;
    };
  }, [open, pathname, person]);
  if (!open || !context) return null;
  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent size="lg" className="fluid">
        <DialogHeader>
          <DialogTitle>Add a task</DialogTitle>
        </DialogHeader>
        <QuickTaskForm context={context} now={new Date()} onDone={onClose} autoFocus layout="stack" />
      </DialogContent>
    </Dialog>
  );
}

/** Mounted once for all of /admin (components/admin/admin-provider.tsx): listens for T. */
export function QuickTaskKey() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const outside = /^\/admin\/(login|logout|create-first-user|forgot|reset)/.test(pathname) || !pathname.startsWith("/admin");
  useEffect(() => {
    if (outside) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "t" || event.metaKey || event.ctrlKey || event.altKey || typing(event.target)) return;
      event.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [outside]);
  return <QuickTaskDialog open={open} onClose={() => setOpen(false)} />;
}
