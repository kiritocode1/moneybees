"use client";

import { ArrowLeft, FileText, Globe, Mail, MailOpen, MessageSquare, Phone, Repeat, Settings2, StickyNote, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TextArea } from "@/components/admin/fields";
import { SeverityBadge } from "@/components/admin/severity-badge";
import { useAction } from "@/components/admin/use-action";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { addEnquiryNote } from "@/lib/crm/admin-actions";
import type { EnquiryDetail, TimelineItem } from "@/lib/crm/enquiry-detail";
import { istDateTime, relative } from "@/lib/crm/format";
import { SEVERITY_LABELS } from "@/lib/crm/severity";
import type { ActivityType } from "@/lib/crm/vocabulary";
import { DealPanel, DeadlinePanel, OwnerPanel, PersonPanel, StatusPanel } from "./enquiry-panels";
import { ReplyComposer } from "./reply-composer";

/**
 * One enquiry, laid out so whoever opens it can act without asking anyone:
 * why it is this urgent, what the person sent, the reply, and everything
 * that has happened with them. The side column holds the deadline and
 * playbook, who has it, its status, the person and the deal.
 */
export function EnquiryScreen({ enquiry }: { enquiry: EnquiryDetail }) {
  // Ticks every 30s; relative() calls anything within a minute "just now", so the tick covers the drift.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Link href="/admin/inbox" className="mt-6 inline-flex items-center gap-1.5 text-caption text-muted-foreground no-underline hover:text-foreground">
        <ArrowLeft size={14} aria-hidden="true" /> Enquiries
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={enquiry.severity} />
          {enquiry.overdue ? <Badge color="red">Past reply time</Badge> : null}
          <Badge>{enquiry.statusLabel}</Badge>
        </div>
        <h1 className="mt-3 text-display font-semibold tracking-[-0.01em] text-foreground">{enquiry.title}</h1>
        <p className="mt-1 text-body text-muted-foreground tabular-nums">
          {enquiry.reference} · received {istDateTime(enquiry.receivedAt)} ({relative(enquiry.receivedAt, now)})
          {enquiry.page ? ` · from ${enquiry.page}` : ""}
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-10">
          <Why enquiry={enquiry} />
          <Sent enquiry={enquiry} />
          {enquiry.contact?.email && enquiry.status !== "spam" ? <ReplyComposer enquiry={enquiry} /> : null}
          <Timeline enquiryId={enquiry.id} items={enquiry.timeline} now={now} />
        </div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <DeadlinePanel enquiry={enquiry} now={now} />
          <OwnerPanel enquiry={enquiry} />
          <StatusPanel enquiry={enquiry} />
          <PersonPanel enquiry={enquiry} />
          <DealPanel enquiry={enquiry} />
        </aside>
      </div>
    </>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4 border-b pb-2">
        <h2 className="text-title font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const SOURCE: Record<string, string> = { rule: "Rule", ai: "AI", clock: "Clock" };

function Why({ enquiry }: { enquiry: EnquiryDetail }) {
  const { ai } = enquiry;
  return (
    <Section title={`Why it is ${SEVERITY_LABELS[enquiry.severity].toLowerCase()}`}>
      {enquiry.reasons.length === 0 ? (
        <p className="text-body text-muted-foreground">No rule raised it above the usual level for a {enquiry.kindLabel} enquiry.</p>
      ) : (
        <ul className="m-0 grid list-none gap-2 p-0">
          {enquiry.reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-3 text-body text-foreground">
              <Badge size="compact" variant="dot" color={reason.source === "ai" ? "violet" : reason.source === "clock" ? "red" : "gray"} className="mt-0.5 shrink-0">
                {SOURCE[reason.source]}
              </Badge>
              {reason.why}
            </li>
          ))}
        </ul>
      )}
      {ai ? (
        <p className="mt-3 text-caption text-muted-foreground tabular-nums">
          AI read it {istDateTime(ai.at)}: complaint {Math.round(ai.complaint * 100)}%, spam {Math.round(ai.spam * 100)}%, needs compliance {Math.round(ai.compliance * 100)}%.
        </p>
      ) : null}
    </Section>
  );
}

function Sent({ enquiry }: { enquiry: EnquiryDetail }) {
  return (
    <Section title="What they sent">
      {enquiry.answers.length ? (
        <dl className="m-0 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-6 gap-y-3">
          {enquiry.answers.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-caption text-muted-foreground">{label}</dt>
              <dd className="m-0 mt-0.5 text-body text-foreground break-words">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {enquiry.message ? <p className="mt-5 rounded-xl bg-muted px-4 py-3 text-body whitespace-pre-wrap text-foreground">{enquiry.message}</p> : null}
    </Section>
  );
}

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
  task: MessageSquare,
  system: Settings2,
};

const NOTE_KINDS = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
] as const;

function Timeline({ enquiryId, items, now }: { enquiryId: number; items: TimelineItem[]; now: Date }) {
  const [kind, setKind] = useState<(typeof NOTE_KINDS)[number]["value"]>("note");
  const [text, setText] = useState("");
  const { pending, error, run } = useAction();

  return (
    <Section title="Timeline">
      <form
        className="mb-6 grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => addEnquiryNote(enquiryId, { kind, text }), () => setText(""));
        }}
      >
        <div className="flex gap-1" role="radiogroup" aria-label="What to log">
          {NOTE_KINDS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={kind === option.value}
              onClick={() => setKind(option.value)}
              className={`h-7 cursor-pointer rounded-md border-0 px-2.5 text-caption ${kind === option.value ? "bg-accent text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <TextArea label={`Log a ${kind}`} hideLabel value={text} onChange={(event) => setText(event.target.value)} placeholder={kind === "call" ? "What was said on the call" : kind === "meeting" ? "Who met, and what was agreed" : "A note for whoever opens this next"} className="min-h-16" />
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <div>
          <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={!text.trim()}>
            Add to timeline
          </Button>
        </div>
      </form>

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
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
