"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DuePicker, KindSelect, OwnerSelect } from "@/components/admin/tasks/task-fields";
import { TextArea, TextInput } from "@/components/admin/fields";
import { FileDrop, FileRow, useAttachments } from "@/components/admin/files/file-row";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/fluid/select";
import { previewReply, replyToEnquiry } from "@/lib/crm/admin-actions";
import { followUpFor } from "@/lib/crm/due";
import { drawEmail, sendEmailTo } from "@/lib/crm/email-desk";
import { addTask, logActivity, previewOwnLetter, sendOwnLetter } from "@/lib/crm/person-actions";
import type { LetterOption, PersonDetail } from "@/lib/crm/person-detail";
import { fillTemplate, liveTags } from "@/lib/crm/template";
import type { FileItem } from "@/lib/files/library";
import { completeTask } from "@/lib/crm/person-actions";
import type { LetterAtHand, TaskAtHand } from "./person-screen";
import type { TaskKind } from "@/lib/crm/vocabulary";

/*
 * The person screen's composer: Email to write to them, Call, Meeting and
 * Note to log what happened (each with the follow-up it suggests), Task to
 * plan the next step. An email is any letter that can go to them: a reply on
 * their enquiry, a client letter with its facts, or a letter in your own
 * words, sent through the same actions as the enquiry and Emails screens, so
 * what Preview draws is what goes.
 */

export type ComposerTab = "email" | "call" | "meeting" | "note" | "task";
const TABS: { value: ComposerTab; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
  { value: "task", label: "Task" },
];

/** `attach` arrives from Send to someone on the Files screen: a letter opens with it attached. */
type Props = { person: PersonDetail; tab: ComposerTab; onTab: (tab: ComposerTab) => void; now: Date; attach: FileItem | null; task: TaskAtHand | null; opening: LetterAtHand | null };

function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`h-7 cursor-pointer rounded-md border-0 px-2.5 text-caption ${value === option.value ? "bg-accent text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Composer({ person, tab, onTab, now, attach, task, opening }: Props) {
  return (
    <section className="rounded-xl border bg-card p-4" aria-label="Write or log">
      <Segmented options={person.email ? TABS : TABS.filter((option) => option.value !== "email")} value={tab} onChange={onTab} label="What to do" />
      <div className="mt-4">
        {tab === "email" ? <EmailForm person={person} attach={attach} task={task} opening={opening} /> : null}
        {tab === "call" || tab === "meeting" || tab === "note" ? <LogForm key={tab} kind={tab} person={person} now={now} /> : null}
        {tab === "task" ? <TaskForm person={person} now={now} /> : null}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- email

type Meeting = { when: string; where: string; link: string; with: string };

/** The letter a task names, by its Emails page id: a client letter, or a reply on their enquiry. */
const letterKey = (person: PersonDetail, letter: string | null) => person.letters.find((option) => (option.kind === "here" || option.kind === "enquiry") && option.entryId === letter)?.key ?? null;

function EmailForm({ person, attach: arriving, task, opening }: { person: PersonDetail; attach: FileItem | null; task: TaskAtHand | null; opening: LetterAtHand | null }) {
  const merge = { firstName: person.firstName, name: person.name, reference: person.enquiry?.reference ?? "", senderName: person.sender };
  const fill = opening?.fill ?? {};
  // Opened from a task's Write, the task's letter is ready as if picked; a task with no letter opens a letter in your own words.
  const [start] = useState(() => {
    const key = task ? (letterKey(person, task.letter) ?? "own") : opening ? (letterKey(person, opening.letter) ?? "") : arriving ? "own" : "";
    return { key, letter: person.letters.find((option) => option.key === key) ?? null };
  });
  const [key, setKey] = useState(start.key);
  const [subject, setSubject] = useState(() => (start.letter?.kind === "enquiry" ? fillTemplate(start.letter.subject, merge) : ""));
  const [body, setBody] = useState(() => (start.letter?.kind === "enquiry" ? fillTemplate(start.letter.body, merge) : ""));
  const [values, setValues] = useState<Record<string, string>>(() => (start.letter?.kind === "here" ? Object.fromEntries(start.letter.fields.map((field) => [field.key, fill[field.key] ?? (field.key === "manager" ? person.sender : "")])) : {}));
  const [meeting, setMeeting] = useState<Meeting>({ when: fill.when ?? "", where: fill.where ?? person.office, link: "", with: person.sender });
  const [followUp, setFollowUp] = useState({ meetingOn: "", steps: "" });
  const [preview, setPreview] = useState<{ html?: string; error?: string } | null>(null);
  const [drawing, startDrawing] = useTransition();
  const [sent, setSent] = useState<string | null>(null);
  const { pending, error, run } = useAction();
  const attach = useAttachments(arriving ? [arriving] : []);
  const letter = person.letters.find((option) => option.key === key) ?? null;
  // The task's letter brings its own files, as picking it would.
  const { preset } = attach;
  useEffect(() => {
    if (start.letter?.kind === "enquiry") void preset({ templateId: start.letter.templateId });
    else if (start.letter?.kind === "here") void preset({ entryId: start.letter.entryId });
  }, [start, preset]);

  const groups = useMemo(() => {
    const kinds: { kind: LetterOption["kind"]; label: string }[] = [
      { kind: "enquiry", label: person.enquiry ? `On their enquiry, ${person.enquiry.reference}` : "" },
      { kind: "here", label: "Client letters" },
      { kind: "own", label: "Other" },
    ];
    return kinds.map((group) => ({ ...group, letters: person.letters.filter((option) => option.kind === group.kind) })).filter((group) => group.letters.length);
  }, [person.letters, person.enquiry]);

  const choose = (next: string) => {
    const chosen = person.letters.find((option) => option.key === next);
    setKey(next);
    setPreview(null);
    setSent(null);
    if (!chosen) return;
    if (chosen.kind === "enquiry") {
      setSubject(fillTemplate(chosen.subject, merge));
      setBody(fillTemplate(chosen.body, merge));
      void attach.preset({ templateId: chosen.templateId });
    } else if (chosen.kind === "here") {
      setValues(Object.fromEntries(chosen.fields.map((field) => [field.key, field.key === "manager" ? person.sender : ""])));
      void attach.preset({ entryId: chosen.entryId });
    } else {
      setSubject("");
      setBody("");
      void attach.preset(null);
    }
  };

  const purpose = letter?.kind === "enquiry" ? letter.purpose : null;
  // The meeting's time and date show in the words as they are typed below; the server fills them again on send.
  const tags = { meetingAt: meeting.when, meetingOn: followUp.meetingOn };
  const liveSubject = liveTags(subject, tags);
  const liveBody = liveTags(body, tags);
  const replyDraft = () => ({
    subject,
    body,
    purpose: purpose ?? undefined,
    attachments: attach.refs,
    ...(purpose === "meeting_confirmation" ? { meeting: { when: meeting.when, where: meeting.where, with: meeting.with, ...(meeting.link ? { link: meeting.link } : {}) } } : {}),
    ...(purpose === "follow_up" ? { followUp } : {}),
  });

  const ready = (() => {
    if (!letter) return false;
    if (letter.kind === "here") return letter.fields.every((field) => field.optional || values[field.key]?.trim());
    if (!subject.trim() || !body.trim()) return false;
    if (purpose === "meeting_confirmation") return Boolean(meeting.when.trim() && meeting.where.trim() && meeting.with.trim());
    if (purpose === "follow_up") return Boolean(followUp.meetingOn.trim());
    return true;
  })();

  const showPreview = () =>
    startDrawing(async () => {
      if (!letter) return;
      const result =
        letter.kind === "enquiry" && person.enquiry
          ? await previewReply(person.enquiry.id, replyDraft())
          : letter.kind === "here"
            ? await drawEmail(letter.entryId, { values, personId: person.id })
            : await previewOwnLetter(person.id, { subject, body });
      setPreview(result.ok ? { html: result.html } : { error: result.error });
    });

  const send = () =>
    run(
      async () => {
        if (!letter) return { ok: false as const, error: "Choose a letter." };
        const result =
          letter.kind === "enquiry" && person.enquiry
            ? await replyToEnquiry(person.enquiry.id, replyDraft())
            : letter.kind === "here"
              ? await sendEmailTo(letter.entryId, { values, personId: person.id, attachments: attach.refs })
              : await sendOwnLetter(person.id, { subject, body, attachments: attach.refs });
        if (!result.ok) return result;
        if ("status" in result && result.status === "failed") return { ok: false as const, error: "Resend refused it. Check their address and try again." };
        // Written from a task's Write: the letter is what the task asked for.
        if (task) await completeTask(task.id);
        return { ok: true as const };
      },
      () => {
        setSent(`${person.emailConnected ? `Sent to ${person.name}.` : `Saved on ${person.name}'s timeline. Not sent: email is not connected.`}${task ? ` Ticked off: ${task.title}.` : ""}`);
        setKey("");
        setPreview(null);
        attach.setFiles([]);
      },
    );

  return (
    <FileDrop attach={attach} className="grid gap-3">
      <div className="grid gap-1.5">
        <span className="text-caption text-muted-foreground">Letter</span>
        <Select value={key} onValueChange={choose}>
          <SelectTrigger placeholder="Choose a letter" aria-label="Letter" />
          <SelectContent>
            {(() => {
              let index = 0;
              return groups.map((group) => (
                <SelectGroup key={group.kind}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.letters.map((option) => (
                    <SelectItem key={option.key} index={index++} value={option.key}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ));
            })()}
          </SelectContent>
        </Select>
      </div>

      {letter && letter.kind !== "here" ? (
        <>
          <TextInput label="Subject" value={liveSubject.shown} onChange={(event) => setSubject(liveSubject.back(event.target.value))} />
          <TextArea label="Message" value={liveBody.shown} onChange={(event) => setBody(liveBody.back(event.target.value))} className="min-h-40" placeholder={`Your words. "Dear ${person.name}," and your signature are added for you.`} />
        </>
      ) : null}

      {purpose === "meeting_confirmation" ? (
        <div className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
          <TextInput label="When" value={meeting.when} onChange={(event) => setMeeting({ ...meeting, when: event.target.value })} placeholder="Tuesday 20 October, 11:00 am" />
          <TextInput label="With" value={meeting.with} onChange={(event) => setMeeting({ ...meeting, with: event.target.value })} />
          <TextInput label="Where" value={meeting.where} onChange={(event) => setMeeting({ ...meeting, where: event.target.value })} />
          <TextInput label="Video call link, if not in person" value={meeting.link} onChange={(event) => setMeeting({ ...meeting, link: event.target.value })} placeholder="https://" />
        </div>
      ) : null}
      {purpose === "follow_up" ? (
        <div className="grid gap-3 rounded-xl border p-3">
          <TextInput label="Date of the meeting" value={followUp.meetingOn} onChange={(event) => setFollowUp({ ...followUp, meetingOn: event.target.value })} placeholder="20 October 2026" />
          <TextArea label="Agreed next steps, one per line, each saying who and by when" value={followUp.steps} onChange={(event) => setFollowUp({ ...followUp, steps: event.target.value })} className="min-h-24" />
        </div>
      ) : null}

      {letter?.kind === "here" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {letter.fields.map((field) =>
            field.kind === "select" ? (
              <label key={field.key} className="grid gap-1.5 text-caption text-muted-foreground sm:col-span-2">
                {field.label}
                <select value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} className="h-9 rounded-lg border bg-background px-2 text-body text-foreground">
                  <option value="">Choose</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ) : field.kind === "lines" || field.kind === "textarea" ? (
              <div key={field.key} className="sm:col-span-2">
                <TextArea label={field.label} value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} className="min-h-24" placeholder={field.sample} />
              </div>
            ) : (
              <TextInput key={field.key} label={field.optional ? `${field.label} (optional)` : field.label} value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} placeholder={field.sample} />
            ),
          )}
        </div>
      ) : null}

      {letter ? <FileRow attach={attach} letter={letter.kind === "enquiry" ? { templateId: letter.templateId } : letter.kind === "here" ? { entryId: letter.entryId } : null} /> : null}

      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      {sent && !letter ? <p className="text-caption text-foreground">{sent}</p> : null}
      {letter ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="secondary" loading={drawing} disabled={!ready} onClick={showPreview}>
            Preview
          </Button>
          <Button type="button" loading={pending} disabled={!ready} onClick={send}>
            {person.emailConnected ? `Send to ${person.name}` : "Save without sending"}
          </Button>
        </div>
      ) : null}

      {preview ? (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-caption text-muted-foreground">Exactly what {person.name} will receive</span>
            <Button type="button" size="compact" variant="ghost" onClick={() => setPreview(null)}>
              Close preview
            </Button>
          </div>
          {preview.error ? <p className="text-caption text-destructive">{preview.error}</p> : <iframe title="Email preview" srcDoc={preview.html} className="h-[720px] w-full rounded-xl border bg-muted" />}
        </div>
      ) : null}
    </FileDrop>
  );
}

// ---------------------------------------------------------------- due and follow-up

type Then = { on: boolean; kind: TaskKind; title: string; dueAt: string; ownerId: number; letter: string | null };

/** The follow-up under a call, meeting or note: ticked, what, when and who. */
function ThenRow({ person, then, onChange, now }: { person: PersonDetail; then: Then; onChange: (then: Then) => void; now: Date }) {
  return (
    <div className="grid gap-2 border-t pt-3 md:grid-cols-[auto_120px_minmax(0,1fr)_200px_170px] md:items-start">
      <label className="flex h-7 cursor-pointer items-center gap-2 text-body text-foreground">
        <input type="checkbox" checked={then.on} onChange={(event) => onChange({ ...then, on: event.target.checked })} className="h-4 w-4 accent-[var(--foreground)]" />
        Then
      </label>
      <KindSelect value={then.kind} onChange={(kind) => onChange({ ...then, kind, on: true })} />
      <input
        value={then.title}
        onChange={(event) => onChange({ ...then, title: event.target.value, on: true })}
        placeholder="What to do next"
        aria-label="What to do next"
        className="h-7 min-w-0 rounded-md border bg-transparent px-2.5 text-body text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground/40"
      />
      <DuePicker value={then.dueAt} onChange={(dueAt) => onChange({ ...then, dueAt, on: true })} now={now} />
      <OwnerSelect staff={person.staff} me={person.senderId} value={then.ownerId} onChange={(ownerId) => onChange({ ...then, ownerId, on: true })} />
    </div>
  );
}

const OUTCOMES = [
  { value: "spoke", label: "Spoke" },
  { value: "no_answer", label: "No answer" },
  { value: "left_message", label: "Left a message" },
  { value: "wrong_number", label: "Wrong number" },
] as const;
type Outcome = (typeof OUTCOMES)[number]["value"];

const thenFor = (kind: "call" | "meeting" | "note", outcome: Outcome | undefined, now: Date, ownerId: number): Then => {
  const next = followUpFor(kind, outcome, now);
  return { on: next.on, kind: next.kind, title: next.title, dueAt: next.at.toISOString(), ownerId, letter: next.letter };
};

/** A call, meeting or note, and the follow-up it suggests: a call with no answer comes with "Call again", tomorrow. */
function LogForm({ kind, person, now }: { kind: "call" | "meeting" | "note"; person: PersonDetail; now: Date }) {
  const [outcome, setOutcome] = useState<Outcome | undefined>(kind === "call" ? "spoke" : undefined);
  const [text, setText] = useState("");
  const [then, setThen] = useState<Then>(() => thenFor(kind, kind === "call" ? "spoke" : undefined, now, person.owner?.id ?? person.senderId));
  const { pending, error, run } = useAction();

  const pickOutcome = (next: Outcome) => {
    setOutcome(next);
    setThen(thenFor(kind, next, now, then.ownerId));
  };

  const ready = (kind === "call" || text.trim()) && (!then.on || then.title.trim());
  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        run(
          () => logActivity(person.id, { kind, text, outcome, then: then.on ? { title: then.title, kind: then.kind, dueAt: then.dueAt, ownerId: then.ownerId, letter: then.letter } : undefined }),
          () => {
            setText("");
            setThen(thenFor(kind, kind === "call" ? "spoke" : undefined, new Date(), then.ownerId));
            if (kind === "call") setOutcome("spoke");
          },
        );
      }}
    >
      {kind === "call" ? (
        <div className="grid gap-1.5">
          <span className="text-caption text-muted-foreground">How did it go</span>
          <Segmented options={[...OUTCOMES]} value={outcome ?? "spoke"} onChange={pickOutcome} label="How did it go" />
        </div>
      ) : null}
      <TextArea
        label={kind === "call" ? "What was said" : kind === "meeting" ? "Who met, and what was agreed" : "Note"}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-20"
        placeholder={kind === "note" ? "A note for whoever opens this next" : undefined}
      />
      <ThenRow person={person} then={then} onChange={setThen} now={now} />
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" loading={pending} disabled={!ready}>
          Add to timeline
        </Button>
      </div>
    </form>
  );
}

/** The next step, planned by hand: what, which kind, when and who. */
function TaskForm({ person, now }: { person: PersonDetail; now: Date }) {
  const fresh = (): Then => ({ ...thenFor("note", undefined, now, person.owner?.id ?? person.senderId), on: true });
  const [task, setTask] = useState<Then>(fresh);
  const { pending, error, run } = useAction();
  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        run(() => addTask(person.id, { title: task.title, kind: task.kind, dueAt: task.dueAt, ownerId: task.ownerId }), () => setTask(fresh()));
      }}
    >
      <TextInput label="What to do" value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} placeholder={`Call ${person.firstName} about the meeting`} autoFocus />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <span className="text-caption text-muted-foreground">Kind</span>
          <KindSelect value={task.kind} onChange={(kind) => setTask({ ...task, kind })} />
        </div>
        <div className="grid gap-1.5">
          <span className="text-caption text-muted-foreground">When</span>
          <DuePicker value={task.dueAt} onChange={(dueAt) => setTask({ ...task, dueAt })} now={now} />
        </div>
        <div className="grid gap-1.5">
          <span className="text-caption text-muted-foreground">Who</span>
          <OwnerSelect staff={person.staff} me={person.senderId} value={task.ownerId} onChange={(ownerId) => setTask({ ...task, ownerId })} />
        </div>
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" loading={pending} disabled={!task.title.trim()}>
          Add task
        </Button>
      </div>
    </form>
  );
}
