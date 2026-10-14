"use client";

import { ArrowLeft, CalendarClock, FileText, Mail, Repeat, Settings2, StickyNote, UserRound } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { LinkButton } from "@/components/admin/link-button";
import { useAction } from "@/components/admin/use-action";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { istDateTime, relative } from "@/lib/crm/format";
import { addApplicationNote, addInterview, sendApplicantEmail } from "@/lib/hiring/admin-actions";
import type { ApplicantDetail } from "@/lib/hiring/desk";
import { EmailDraft, useDraft } from "./email-draft";
import { OwnerPanel, PersonPanel, RolePanel, StagePanel, KeepPanel } from "./applicant-panels";

/**
 * One application, laid out so HR can decide without opening anything else:
 * the must-haves and their answers, the resume, what they wrote, interviews,
 * an email, and the timeline. The side column holds the next step, who has
 * it, their details, the role once someone is hired, and the deletion date.
 */
export function ApplicantScreen({ applicant }: { applicant: ApplicantDetail }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const [interviewing, setInterviewing] = useState(false);
  const interviews = useRef<HTMLElement>(null);
  const yes = applicant.mustHaves.filter(({ answer }) => answer === "yes").length;
  const startInterview = () => {
    setInterviewing(true);
    requestAnimationFrame(() => interviews.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <Link href="/admin/hiring" className="mt-6 inline-flex items-center gap-1.5 text-caption text-muted-foreground no-underline hover:text-foreground">
        <ArrowLeft size={14} aria-hidden="true" /> Hiring
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="dot" color={applicant.stage === "hired" ? "green" : applicant.stage === "closed" ? "gray" : "blue"}>
            {applicant.closeReason ? `${applicant.stageLabel}, ${applicant.closeReason.toLowerCase()}` : applicant.stageLabel}
          </Badge>
          {applicant.mustHaves.length ? <Badge color={yes === applicant.mustHaves.length ? "green" : "amber"}>{`${yes} of ${applicant.mustHaves.length} must-haves`}</Badge> : null}
          {applicant.appliedBefore ? <Badge>Applied before</Badge> : null}
        </div>
        <h1 className="mt-3 text-display font-semibold tracking-[-0.01em] text-foreground">{applicant.name}</h1>
        <p className="mt-1 text-body text-muted-foreground tabular-nums">
          {applicant.role}
          {applicant.team && !applicant.opening ? `, ${applicant.team}` : ""} · {applicant.reference} · applied {istDateTime(applicant.receivedAt)} ({relative(applicant.receivedAt, now)})
          {applicant.page ? ` · from ${applicant.page}` : ""}
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-10">
          {applicant.mustHaves.length ? <MustHaves applicant={applicant} /> : null}
          <Resume applicant={applicant} />
          <Wrote applicant={applicant} />
          <Interviews applicant={applicant} open={interviewing} setOpen={setInterviewing} sectionRef={interviews} now={now} />
          {applicant.stage !== "closed" ? <Composer applicant={applicant} /> : null}
          <Timeline applicant={applicant} now={now} />
        </div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <StagePanel applicant={applicant} onInterview={startInterview} />
          <RolePanel applicant={applicant} />
          <OwnerPanel applicant={applicant} />
          <PersonPanel applicant={applicant} />
          <KeepPanel applicant={applicant} />
        </aside>
      </div>
    </>
  );
}

function Section({ title, children, action, sectionRef }: { title: string; children: ReactNode; action?: ReactNode; sectionRef?: React.Ref<HTMLElement> }) {
  return (
    <section ref={sectionRef} className="scroll-mt-24">
      <div className="mb-3 flex items-center justify-between gap-4 border-b pb-2">
        <h2 className="text-title font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MustHaves({ applicant }: { applicant: ApplicantDetail }) {
  const { screen } = applicant;
  return (
    <Section title="Must-haves" action={<span className="text-caption text-muted-foreground">Their answers</span>}>
      <ul className="m-0 grid list-none p-0">
        {applicant.mustHaves.map(({ question, answer }, index) => {
          const read = screen?.mustHaves[index];
          return (
            <li key={question} className="flex items-baseline justify-between gap-4 border-b py-2.5 text-body last:border-b-0">
              <span className="text-foreground">
                {question}
                {read ? <span className="ml-2 text-caption text-muted-foreground tabular-nums">Jev: {Math.round(read.probability * 100)}% likely</span> : null}
              </span>
              <span className={answer === "yes" ? "text-success" : "text-destructive"}>{answer === "yes" ? "Yes" : "No"}</span>
            </li>
          );
        })}
      </ul>
      {screen ? (
        <p className="mt-3 text-caption text-muted-foreground tabular-nums">
          Jev read their answers {istDateTime(screen.at)} and rates the fit {screen.fit.choice} ({Math.round(screen.fit.probability * 100)}% sure). A suggestion, from what they wrote.
        </p>
      ) : null}
    </Section>
  );
}

function Resume({ applicant }: { applicant: ApplicantDetail }) {
  const { resume } = applicant;
  if (!resume) {
    return (
      <Section title="Resume">
        <p className="text-body text-muted-foreground">They applied without a resume. Their experience is under What they wrote.</p>
      </Section>
    );
  }
  const pdf = resume.type === "application/pdf";
  return (
    <Section
      title="Resume"
      action={
        <LinkButton href={`${resume.href}?download=1`} external>
          Download
        </LinkButton>
      }
    >
      {pdf ? (
        <iframe title={`${applicant.name}'s resume`} src={resume.href} className="h-[640px] w-full rounded-xl border bg-white" />
      ) : (
        <p className="flex items-center gap-2 text-body text-muted-foreground">
          <FileText size={16} aria-hidden="true" /> {resume.name}: a Word file. Download it to read it.
        </p>
      )}
    </Section>
  );
}

function Wrote({ applicant }: { applicant: ApplicantDetail }) {
  return (
    <Section title="What they wrote">
      <dl className="m-0 grid gap-4">
        {applicant.why ? (
          <div>
            <dt className="text-caption text-muted-foreground">Why this role</dt>
            <dd className="m-0 mt-1 rounded-xl bg-muted px-4 py-3 text-body whitespace-pre-wrap text-foreground">{applicant.why}</dd>
          </div>
        ) : null}
        {applicant.experience ? (
          <div>
            <dt className="text-caption text-muted-foreground">Their experience</dt>
            <dd className="m-0 mt-1 rounded-xl bg-muted px-4 py-3 text-body whitespace-pre-wrap text-foreground">{applicant.experience}</dd>
          </div>
        ) : null}
      </dl>
    </Section>
  );
}

/** "2026-10-21T11:00", a datetime-local value, for tomorrow at 11 in the browser's own time. */
const tomorrowAtEleven = () => {
  const date = new Date(Date.now() + 86_400_000);
  date.setHours(11, 0, 0, 0);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function Interviews({ applicant, open, setOpen, sectionRef, now }: { applicant: ApplicantDetail; open: boolean; setOpen: (open: boolean) => void; sectionRef: React.Ref<HTMLElement>; now: Date }) {
  const canAdd = applicant.stage === "shortlisted" || applicant.stage === "interview";
  const [at, setAt] = useState(tomorrowAtEleven);
  const [who, setWho] = useState(applicant.sender);
  const [place, setPlace] = useState("Moneybee, Lower Parel");
  const [note, setNote] = useState("");
  const [invite, setInvite] = useState(true);
  const draft = useDraft(applicant, "interview_invite");
  const { pending, error, run } = useAction();

  return (
    <Section
      title="Interviews"
      sectionRef={sectionRef}
      action={
        canAdd && !open ? (
          <Button size="compact" variant="secondary" leadingIcon={CalendarClock} onClick={() => setOpen(true)}>
            Add an interview
          </Button>
        ) : null
      }
    >
      {applicant.interviews.length ? (
        <ul className="m-0 mb-4 grid list-none gap-3 p-0">
          {applicant.interviews.map((interview) => (
            <li key={interview.at + interview.with} className="rounded-xl border px-4 py-3">
              <p className="text-body text-foreground tabular-nums">
                {istDateTime(interview.at)} <span className="text-muted-foreground">({relative(interview.at, now)})</span>
              </p>
              <p className="text-body text-muted-foreground">
                With {interview.with}, at {interview.place}
              </p>
              {interview.note ? <p className="mt-1 text-body whitespace-pre-wrap text-foreground">{interview.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : !open ? (
        <p className="text-body text-muted-foreground">{canAdd ? "None yet." : applicant.stage === "new" ? "Shortlist them first." : "None."}</p>
      ) : null}

      {open && canAdd ? (
        <form
          className="grid gap-3 rounded-xl border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addInterview(applicant.id, { at: new Date(at).toISOString(), with: who, place, note: note || undefined, email: invite ? draft.draft : undefined }), () => setOpen(false));
          }}
        >
          <div className="grid items-start gap-3 sm:grid-cols-3">
            <TextInput label="When" type="datetime-local" value={at} onChange={(event) => setAt(event.target.value)} required />
            <TextInput label="With" value={who} onChange={(event) => setWho(event.target.value)} required />
            <TextInput label="Where" value={place} onChange={(event) => setPlace(event.target.value)} hint="An address, or a video link." required />
          </div>
          <TextArea label="Note for the team (optional)" value={note} onChange={(event) => setNote(event.target.value)} className="min-h-16" />
          <label className="flex items-center gap-2 text-body text-foreground">
            <input type="checkbox" checked={invite} onChange={(event) => setInvite(event.target.checked)} className="h-4 w-4 accent-current" />
            Email them the invitation
          </label>
          {invite ? <EmailDraft applicant={applicant} state={draft} note={`From ${applicant.sender} at Moneybee to ${applicant.email}. When, where and with whom are filled in from above.`} /> : null}
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" size="compact" loading={pending}>
              {invite ? "Add and send the invitation" : "Add the interview"}
            </Button>
            <Button type="button" size="compact" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </Section>
  );
}

function Composer({ applicant }: { applicant: ApplicantDetail }) {
  const draft = useDraft(applicant, null);
  const { pending, error, run } = useAction();
  return (
    <Section title={`Email ${applicant.values.firstName}`}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => sendApplicantEmail(applicant.id, draft.draft), () => draft.setDraft({ subject: "", body: "" }));
        }}
      >
        <EmailDraft applicant={applicant} state={draft} />
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <div>
          <Button type="submit" loading={pending} disabled={!draft.draft.subject.trim() || !draft.draft.body.trim()} leadingIcon={Mail}>
            {applicant.emailConnected ? "Send" : "Save without sending"}
          </Button>
        </div>
      </form>
    </Section>
  );
}

const ICONS = { applied: FileText, stage: Repeat, email: Mail, interview: CalendarClock, note: StickyNote, owner: UserRound, system: Settings2 } as const;

function Timeline({ applicant, now }: { applicant: ApplicantDetail; now: Date }) {
  const [text, setText] = useState("");
  const { pending, error, run } = useAction();
  return (
    <Section title="Timeline">
      <form
        className="mb-6 grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => addApplicationNote(applicant.id, text), () => setText(""));
        }}
      >
        <TextArea label="Add a note" hideLabel value={text} onChange={(event) => setText(event.target.value)} placeholder="A note for whoever opens this next" className="min-h-16" />
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <div>
          <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={!text.trim()}>
            Add to timeline
          </Button>
        </div>
      </form>
      <ol className="m-0 grid list-none gap-0 p-0">
        {applicant.history.map((item) => {
          const Icon = ICONS[item.kind as keyof typeof ICONS] ?? Settings2;
          return (
            <li key={item.key} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-5 before:absolute before:top-7 before:bottom-0 before:left-[13.5px] before:w-px before:bg-border last:before:hidden">
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
