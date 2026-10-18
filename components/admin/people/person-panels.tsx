"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { TextInput } from "@/components/admin/fields";
import { useAction } from "@/components/admin/use-action";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { dueLabel } from "@/lib/crm/due";
import { MoveDialog, needsAsking } from "@/components/admin/deals/move-dialog";
import { EntityOffer, InvestsAsForm } from "./invests-as";
import { moveDealTo } from "@/lib/crm/deal-actions";
import { completeTask, inviteToPortal, noteTaskOutcome, openDeal, reopenTask, updatePerson } from "@/lib/crm/person-actions";
import { relative } from "@/lib/crm/format";
import type { PersonDetail } from "@/lib/crm/person-detail";
import { CONTACT_KINDS, DEAL_STAGES, type DealStage, TOPICS } from "@/lib/crm/vocabulary";

/*
 * The side column of /admin/people/:id. Each panel is one decision, as on
 * the enquiry screen: what is owed to them next, their enquiries, the deal
 * and its stage, and their account.
 */

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-caption font-medium text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type Done = { id: number; title: string };

/** Their open tasks. Ticking one keeps it here a moment, for a line on what happened or Undo. */
export function TasksPanel({ person, now, onAdd }: { person: PersonDetail; now: Date; onAdd: () => void }) {
  const [done, setDone] = useState<Done[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const { error, run } = useAction();
  const open = person.tasks.filter((task) => !done.some((item) => item.id === task.id));
  const forget = (id: number) => setDone((now) => now.filter((item) => item.id !== id));

  return (
    <Panel
      title="Tasks"
      action={
        <Button size="compact" variant="ghost" onClick={onAdd}>
          Add a task
        </Button>
      }
    >
      {open.length === 0 && done.length === 0 ? <p className="text-body text-muted-foreground">{person.deals.some((deal) => !["invested", "lost"].includes(deal.stage)) ? "No next step for their deal yet." : "Nothing owed to them."}</p> : null}
      <ul className="m-0 grid list-none p-0">
        {done.map((item) => (
          <li key={item.id} className="grid gap-2 border-b py-2 first:pt-0">
            <div className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7fd3a6] text-[#0b1a12]">
                <Check size={10} aria-hidden="true" />
              </span>
              <span className="text-body text-muted-foreground line-through">{item.title}</span>
              <Button size="compact" variant="ghost" onClick={() => run(() => reopenTask(item.id), () => forget(item.id))}>
                Undo
              </Button>
            </div>
            <form
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 pl-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  run(() => noteTaskOutcome(item.id, notes[item.id] ?? ""), () => forget(item.id));
                }}
              >
                <input
                  value={notes[item.id] ?? ""}
                  onChange={(event) => setNotes({ ...notes, [item.id]: event.target.value })}
                  placeholder="What happened (optional)"
                  aria-label={`What happened: ${item.title}`}
                  className="h-7 min-w-0 rounded-md border bg-transparent px-2 text-caption text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground/40"
                  autoFocus
                />
                <Button type="submit" size="compact" variant="secondary" disabled={!notes[item.id]?.trim()}>
                  Save
                </Button>
              </form>
          </li>
        ))}
        {open.map((task) => (
          <li key={task.id} className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5 border-b py-2 first:pt-0 last:border-b-0 last:pb-0">
            <button
              type="button"
              aria-label={`Done: ${task.title}`}
              onClick={() => {
                setDone((now) => [{ id: task.id, title: task.title }, ...now]);
                run(() => completeTask(task.id));
              }}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded-full border-[1.5px] border-foreground/35 bg-transparent p-0 hover:border-foreground"
            />
            <span className="min-w-0">
              <span className="block text-body text-foreground">{task.title}</span>
              <span className={`block text-caption tabular-nums ${task.overdue ? "text-destructive" : "text-muted-foreground"}`}>
                {task.kindLabel} · {task.overdue ? `overdue, was ${dueLabel(new Date(task.dueAt), now)}` : dueLabel(new Date(task.dueAt), now)}
                {task.owner && task.owner !== person.sender ? ` · ${task.owner}` : ""}
              </span>
              {task.kind === "email" && person.email ? (
                <Link href={`/admin/people/${person.id}?task=${task.id}`} className="text-caption text-foreground">
                  Write
                </Link>
              ) : task.kind === "call" && person.phone ? (
                <a href={`tel:${person.phone}`} className="text-caption text-foreground tabular-nums">
                  Call {person.phone}
                </a>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {error ? <p className="mt-2 text-caption text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function EnquiriesPanel({ person }: { person: PersonDetail }) {
  if (!person.enquiries.length) return null;
  return (
    <Panel title={person.enquiries.length === 1 ? "Enquiry" : "Enquiries"}>
      <ul className="m-0 grid list-none gap-2.5 p-0">
        {person.enquiries.map((enquiry) => (
          <li key={enquiry.id}>
            <Link href={`/admin/inbox/${enquiry.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 no-underline">
              <span className="min-w-0">
                <span className="block text-body text-foreground">
                  {enquiry.kindLabel}
                  {enquiry.detail ? `, ${enquiry.detail}` : ""}
                </span>
                <span className="block text-caption text-muted-foreground tabular-nums">{enquiry.reference}</span>
              </span>
              <Badge size="compact">{enquiry.statusLabel}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/**
 * Their deals with the stage to move each to, or the form to open one.
 * Moving asks what the board's move asks (components/admin/deals/move-dialog.tsx).
 */
export function DealPanel({ person }: { person: PersonDetail }) {
  const router = useRouter();
  const { pending, error, run } = useAction();
  const [moving, setMoving] = useState<{ deal: PersonDetail["deals"][number]; to: DealStage } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [product, setProduct] = useState("");
  const [ticket, setTicket] = useState("");

  if (!person.deals.length) {
    if (!person.products.length) return null;
    return (
      <Panel title="Deal">
        <form
          className="grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => openDeal(person.id, { product: Number(product), ticketSize: ticket ? Number(ticket) : undefined }));
          }}
        >
          <Select value={product} onValueChange={setProduct} size="compact">
            <SelectTrigger placeholder="Product" aria-label="Product" />
            <SelectContent>
              {person.products.map((option, index) => (
                <SelectItem key={option.id} index={index} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TextInput label="Ticket size (Rs. crore)" type="number" min={0} step="0.01" inputMode="decimal" value={ticket} onChange={(event) => setTicket(event.target.value)} />
          <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={!product}>
            Open a deal
          </Button>
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </form>
      </Panel>
    );
  }

  const move = (deal: PersonDetail["deals"][number], to: DealStage) => {
    if (to === deal.stage) return;
    setNotice(null);
    if (needsAsking(to)) return setMoving({ deal, to });
    run(() => moveDealTo(deal.id, { stage: to }));
  };

  return (
    <Panel title={person.deals.length === 1 ? "Deal" : "Deals"}>
      <ul className="m-0 grid list-none gap-4 p-0">
        {person.deals.map((deal) => (
          <li key={deal.id} className="grid gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-body text-foreground">
                {deal.productName}
                {deal.entity ? <span className="block text-caption text-muted-foreground">Through {deal.entity}</span> : null}
              </span>
              {deal.ticketSize ? <span className="text-body text-foreground tabular-nums">Rs. {deal.ticketSize} crore</span> : null}
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <Select value={deal.stage} onValueChange={(stage) => move(deal, stage as DealStage)} size="compact">
                <SelectTrigger aria-label={`Stage of ${deal.productName}`} />
                <SelectContent>
                  {DEAL_STAGES.map((stage, index) => (
                    <SelectItem key={stage.value} index={index} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {deal.days !== null ? <span className={`text-caption tabular-nums ${deal.days >= 14 && !["invested", "lost"].includes(deal.stage) ? "text-[#f0c060]" : "text-muted-foreground"}`}>{deal.days === 0 ? "today" : `${deal.days} ${deal.days === 1 ? "day" : "days"}`}</span> : null}
            </div>
            {deal.stage === "lost" && deal.lost ? <p className="text-caption text-muted-foreground">Lost: {deal.lost}</p> : null}
          </li>
        ))}
      </ul>
      {notice ? <p className="mt-2 text-caption text-muted-foreground">{notice}</p> : null}
      {error ? <p className="mt-2 text-caption text-destructive">{error}</p> : null}
      <Link href={`/admin/deals?kind=${person.deals[0].kind}`} className="mt-3 inline-block text-caption text-muted-foreground hover:text-foreground">
        All deals
      </Link>
      {moving ? (
        <MoveDialog
          deal={{ id: moving.deal.id, kind: moving.deal.kind, personId: person.id, personName: person.name, hasEmail: Boolean(person.email), hasEnquiry: moving.deal.hasEnquiry, amount: moving.deal.ticketSize, hasPortal: Boolean(person.portal) }}
          to={moving.to}
          canInvite={person.canInvite}
          onClose={() => setMoving(null)}
          onDone={({ notice: said, open }) => {
            setMoving(null);
            setNotice(said ?? null);
            if (open) router.push(open);
            else router.refresh();
          }}
        />
      ) : null}
    </Panel>
  );
}

/**
 * Their client portal account: none yet (Invite to the portal, for
 * operations), invited and not yet signed in (Send again), signed in, or
 * switched off.
 */
function Portal({ person }: { person: PersonDetail }) {
  const { pending, error, run } = useAction();
  const [sent, setSent] = useState<string | null>(null);
  const portal = person.portal;
  const invite = (label: string) =>
    person.canInvite && person.email ? (
      <span className="mt-1.5 block">
        <Button
          size="compact"
          variant="secondary"
          loading={pending}
          onClick={() =>
            run(async () => {
              const result = await inviteToPortal(person.id);
              if (result.ok) setSent(`Sent. The link works until ${result.validUntil}.`);
              return result.ok ? { ok: true as const } : result;
            })
          }
        >
          {label}
        </Button>
      </span>
    ) : null;
  return (
    <>
      {!portal ? "No account yet" : portal.disabled ? "Switched off" : portal.lastSignInAt ? `Signed in ${relative(portal.lastSignInAt)}` : portal.invitedAt ? `Invited ${relative(portal.invitedAt)}, not signed in yet` : "Has an account"}
      {sent ? <span className="mt-1 block text-caption text-muted-foreground">{sent}</span> : null}
      {!portal ? invite("Invite to the portal") : !portal.disabled && !portal.lastSignInAt ? invite("Send the invitation again") : null}
      {error ? <span className="mt-1 block text-caption text-destructive">{error}</span> : null}
    </>
  );
}

/** Who they are to Moneybee. Edit turns the rows into fields; consent and tags stay on the full record. */
export function AccountPanel({ person }: { person: PersonDetail }) {
  const [editing, setEditing] = useState(false);
  const blank = { name: person.name, email: person.email ?? "", phone: person.phone ?? "", city: person.city ?? "", kind: person.kind, ownerId: person.owner?.id ?? 0, topics: person.topics };
  const [form, setForm] = useState(blank);
  const [changing, setChanging] = useState(false);
  const { pending, error, run } = useAction();

  if (editing) {
    return (
      <Panel title="Account">
        <form
          className="grid gap-2.5"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => updatePerson(person.id, { ...form, kind: form.kind as never, topics: form.topics as never }), () => setEditing(false));
          }}
        >
          <TextInput label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextInput label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <TextInput label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <TextInput label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
          <div className="grid gap-1.5">
            <span className="text-caption text-muted-foreground">They are</span>
            <Select value={form.kind} onValueChange={(kind) => setForm({ ...form, kind: kind as typeof form.kind })} size="compact">
              <SelectTrigger aria-label="They are" />
              <SelectContent>
                {CONTACT_KINDS.map((kind, index) => (
                  <SelectItem key={kind.value} index={index} value={kind.value}>
                    {kind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <span className="text-caption text-muted-foreground">Owner</span>
            <Select value={String(form.ownerId)} onValueChange={(id) => setForm({ ...form, ownerId: Number(id) })} size="compact">
              <SelectTrigger aria-label="Owner" />
              <SelectContent>
                <SelectItem index={0} value="0">
                  Nobody
                </SelectItem>
                {person.staff.map((member, index) => (
                  <SelectItem key={member.id} index={index + 1} value={String(member.id)}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <fieldset className="m-0 grid gap-1.5 border-0 p-0">
            <legend className="mb-1.5 text-caption text-muted-foreground">Mailings they chose</legend>
            {TOPICS.map((topic) => (
              <label key={topic.value} className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                <input
                  type="checkbox"
                  checked={form.topics.includes(topic.value)}
                  onChange={(event) => setForm({ ...form, topics: event.target.checked ? [...form.topics, topic.value] : form.topics.filter((value) => value !== topic.value) })}
                  className="h-4 w-4 accent-[var(--foreground)]"
                />
                {topic.label}
              </label>
            ))}
          </fieldset>
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="compact" loading={pending} disabled={!form.name.trim()}>
              Save
            </Button>
            <Button type="button" size="compact" variant="ghost" onClick={() => (setForm(blank), setEditing(false))}>
              Cancel
            </Button>
            <Link href={`/admin/collections/contacts/${person.id}`} className="ml-auto text-caption text-muted-foreground hover:text-foreground">
              Every field
            </Link>
          </div>
        </form>
      </Panel>
    );
  }

  const rows: [string, ReactNode][] = [
    ["Portal", <Portal key="portal" person={person} />],
    [
      "Invests as",
      <span key="invests">
        {person.entity ? `${person.entity.name} (${person.entity.typeLabel})` : "Themselves"}
        {person.entity?.others.length ? (
          <span className="block text-caption text-muted-foreground">
            with{" "}
            {person.entity.others.map((other, index) => (
              <span key={other.id}>
                {index ? ", " : ""}
                <Link href={`/admin/people/${other.id}`} className="text-muted-foreground hover:text-foreground">
                  {other.name}
                </Link>
              </span>
            ))}
          </span>
        ) : null}
        {changing ? null : (
          <button type="button" onClick={() => setChanging(true)} className="block cursor-pointer border-0 bg-transparent p-0 text-caption text-muted-foreground underline hover:text-foreground">
            Change
          </button>
        )}
      </span>,
    ],
    ["Mailings", person.unsubscribed ? "Left every mailing" : person.topicLabels.length ? person.topicLabels.join(", ") : "None chosen"],
    ["Owner", person.owner?.name ?? "Nobody yet"],
    ["Came from", person.source ?? "Not recorded"],
    ...(person.referredBy ? ([["Referred by", person.referredBy]] as [string, ReactNode][]) : []),
  ];
  return (
    <Panel
      title="Account"
      action={
        <Button size="compact" variant="ghost" onClick={() => setEditing(true)}>
          Edit
        </Button>
      }
    >
      <dl className="m-0 grid gap-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[100px_minmax(0,1fr)] gap-2 text-body">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="m-0 break-words text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      {changing ? (
        <div className="mt-3 rounded-lg border p-3">
          <InvestsAsForm
            personId={person.id}
            personName={person.name}
            initial={person.entity && person.entity.type !== "individual" ? { type: person.entity.type, name: person.entity.name } : { type: "self", name: "" }}
            submit="Save"
            onDone={() => setChanging(false)}
            onCancel={() => setChanging(false)}
          />
        </div>
      ) : person.suggestedEntity ? (
        <EntityOffer personId={person.id} personName={person.name} suggested={person.suggestedEntity} />
      ) : null}
    </Panel>
  );
}
