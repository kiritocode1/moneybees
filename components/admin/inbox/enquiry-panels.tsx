"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { assignEnquiry, convertToDeal, setEnquiryStatus, takeEnquiry } from "@/lib/crm/admin-actions";
import type { EnquiryDetail } from "@/lib/crm/enquiry-detail";
import { istDateTime, relative, span } from "@/lib/crm/format";

/*
 * The side column of /admin/inbox/:id. Each panel is one decision: when the
 * reply is due and how to handle it, who has it, where it stands, who the
 * person is, and whether it is now a deal.
 */

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 text-caption font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

const ROLE_LABELS: Record<string, string> = { admin: "Admin", sales: "Sales", operations: "Operations", compliance: "Compliance", editor: "Editor", hr: "HR" };

export function DeadlinePanel({ enquiry, now }: { enquiry: EnquiryDetail; now: Date }) {
  const { playbook } = enquiry;
  const due = enquiry.dueAt ? new Date(enquiry.dueAt) : null;
  return (
    <Panel title={enquiry.firstResponseAt ? "First reply" : "Reply by"}>
      {enquiry.firstResponseAt ? (
        <p className="text-title font-semibold text-foreground tabular-nums">
          Sent {istDateTime(enquiry.firstResponseAt)}
          <span className="block text-caption font-normal text-muted-foreground">{span(new Date(enquiry.firstResponseAt).getTime() - new Date(enquiry.receivedAt).getTime())} after it arrived</span>
        </p>
      ) : due ? (
        <p className={`text-title font-semibold tabular-nums ${enquiry.overdue ? "text-destructive" : "text-foreground"}`}>
          {istDateTime(due)}
          <span className="block text-caption font-normal text-muted-foreground">{enquiry.overdue ? `Overdue by ${span(now.getTime() - due.getTime())}` : relative(due, now)}</span>
        </p>
      ) : (
        <p className="text-body text-muted-foreground">No deadline set.</p>
      )}

      {playbook ? (
        <div className="mt-4 border-t pt-3">
          <p className="text-body font-medium text-foreground">{playbook.name}</p>
          {playbook.handlers.length ? <p className="mt-0.5 text-caption text-muted-foreground">Best taken by {playbook.handlers.map((role) => ROLE_LABELS[role] ?? role).join(", ")}</p> : null}
          {playbook.steps.length ? (
            <ol className="mt-3 mb-0 grid list-decimal gap-1.5 pl-5 text-body text-foreground marker:text-muted-foreground">
              {playbook.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 border-t pt-3 text-caption text-muted-foreground">No playbook matches this kind and severity yet. Compliance can add one under CRM settings.</p>
      )}
    </Panel>
  );
}

export function OwnerPanel({ enquiry }: { enquiry: EnquiryDetail }) {
  const { pending, error, run } = useAction();
  return (
    <Panel title="Taken by">
      <p className="text-body text-foreground">{enquiry.assignee?.name ?? "Nobody yet"}</p>
      <div className="mt-3 grid gap-2">
        {!enquiry.assignee ? (
          <Button onClick={() => run(() => takeEnquiry(enquiry.id))} loading={pending}>
            Take it
          </Button>
        ) : null}
        <Select value={enquiry.assignee ? String(enquiry.assignee.id) : ""} onValueChange={(value) => run(() => assignEnquiry(enquiry.id, Number(value)))} size="compact">
          <SelectTrigger placeholder="Give it to someone" aria-label="Give it to someone" />
          <SelectContent>
            {enquiry.staff.map((member, index) => (
              <SelectItem key={member.id} index={index} value={String(member.id)}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
      </div>
    </Panel>
  );
}

export function StatusPanel({ enquiry }: { enquiry: EnquiryDetail }) {
  const { pending, error, run } = useAction();
  const [closing, setClosing] = useState(false);
  const [note, setNote] = useState("");
  const done = ["closed", "spam", "converted"].includes(enquiry.status);

  return (
    <Panel title="Where it stands">
      <p className="text-body text-foreground">{enquiry.statusLabel}</p>
      {enquiry.closingNote ? <p className="mt-1 text-caption whitespace-pre-wrap text-muted-foreground">{enquiry.closingNote}</p> : null}
      {closing ? (
        <form
          className="mt-3 grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => setEnquiryStatus(enquiry.id, { status: "closed", note }), () => setClosing(false));
          }}
        >
          <TextArea label="How was it resolved?" value={note} onChange={(event) => setNote(event.target.value)} className="min-h-16" autoFocus />
          <div className="flex gap-2">
            <Button type="submit" size="compact" loading={pending} disabled={!note.trim()}>
              Close
            </Button>
            <Button type="button" size="compact" variant="ghost" onClick={() => setClosing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {done ? (
            <Button size="compact" variant="secondary" loading={pending} onClick={() => run(() => setEnquiryStatus(enquiry.id, { status: "open" }))}>
              Reopen
            </Button>
          ) : (
            <>
              {enquiry.status !== "waiting" ? (
                <Button size="compact" variant="secondary" loading={pending} onClick={() => run(() => setEnquiryStatus(enquiry.id, { status: "waiting" }))}>
                  Waiting on them
                </Button>
              ) : null}
              <Button size="compact" variant="secondary" onClick={() => setClosing(true)}>
                Close
              </Button>
              <Button size="compact" variant="ghost" loading={pending} onClick={() => run(() => setEnquiryStatus(enquiry.id, { status: "spam", note: "Marked as spam" }))}>
                Spam
              </Button>
            </>
          )}
        </div>
      )}
      {error ? <p className="mt-2 text-caption text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function PersonPanel({ enquiry }: { enquiry: EnquiryDetail }) {
  const { contact } = enquiry;
  if (!contact) return null;
  const rows = [
    ["Email", contact.email ? <a href={`mailto:${contact.email}`} className="text-foreground">{contact.email}</a> : null],
    ["Phone", contact.phone ? <a href={`tel:${contact.phone}`} className="text-foreground tabular-nums">{contact.phone}</a> : null],
    ["City", contact.city],
    ["Earlier enquiries", contact.earlierEnquiries ? String(contact.earlierEnquiries) : "None"],
  ] as const;
  return (
    <Panel title="Person">
      <p className="text-body font-medium text-foreground">{contact.name}</p>
      <p className="text-caption text-muted-foreground">
        {contact.kindLabel}
        {enquiry.existingInvestor && contact.kindLabel !== "Investor" ? ", holds a Moneybee product" : ""}
      </p>
      <dl className="mt-3 mb-0 grid gap-1.5">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 text-body">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="m-0 break-words">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <Link href={`/admin/collections/contacts/${contact.id}`} className="mt-3 inline-block text-caption text-muted-foreground hover:text-foreground">
        Open their record
      </Link>
    </Panel>
  );
}

export function DealPanel({ enquiry }: { enquiry: EnquiryDetail }) {
  const { pending, error, run } = useAction();
  const preferred = enquiry.products.find((product) => product.kind === enquiry.kind);
  const [product, setProduct] = useState(preferred ? String(preferred.id) : "");
  const [ticket, setTicket] = useState("");

  if (enquiry.deal) {
    return (
      <Panel title="Deal">
        <Link href={`/admin/collections/deals/${enquiry.deal.id}`} className="text-body text-foreground">
          {enquiry.deal.title}
        </Link>
      </Panel>
    );
  }
  if (enquiry.kind === "support" || enquiry.status === "spam" || enquiry.products.length === 0) return null;

  return (
    <Panel title="Turn into a deal">
      <form
        className="grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => convertToDeal(enquiry.id, { product: Number(product), ticketSize: ticket ? Number(ticket) : undefined }));
        }}
      >
        <Select value={product} onValueChange={setProduct} size="compact">
          <SelectTrigger placeholder="Product" aria-label="Product" />
          <SelectContent>
            {enquiry.products.map((option, index) => (
              <SelectItem key={option.id} index={index} value={String(option.id)}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TextInput label="Ticket size (Rs. crore)" type="number" min={0} step="0.01" inputMode="decimal" value={ticket} onChange={(event) => setTicket(event.target.value)} />
        <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={!product}>
          Open deal
        </Button>
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
      </form>
    </Panel>
  );
}
