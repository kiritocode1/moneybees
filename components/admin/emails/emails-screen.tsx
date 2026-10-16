"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import type { Channel, Field, MergeField } from "@/emails";
import { drawEmail, findPeople, type PersonHit, saveEmailWords, sendEmailTest, sendEmailTo } from "@/lib/crm/email-desk";

/*
 * The Emails page (emails-view.tsx): every email by who reads it; the chosen
 * one as the reader gets it, with the words staff may change outlined in the
 * email itself; those words beside it, redrawing the email as they change;
 * and, for letters sent from here, the person and the facts. Light and Dark
 * show the email in that scheme whatever this screen's own theme.
 */

export type EntrySummary = { id: string; group: string; name: string; channel: Channel; channelLabel: string };
export type SelectedEmail = EntrySummary & {
  to: string;
  when: string;
  rule: string | null;
  needs: string | null;
  fields: Field[];
  merge: MergeField[];
  /** Null for system emails, whose words are fixed. `designed` marks words made in the old block editor. */
  words: { subject: string; body: string; designed: boolean } | null;
  canEdit: boolean;
  canSend: boolean;
};

type Result = { ok: true } | { ok: false; error: string };

const REDRAW_MS = 450;

/** The email in one scheme ("max-width: 0px" matches nothing), with its editable words outlined. */
function framed(html: string, scheme: "light" | "dark", outline: boolean) {
  const themed = html.replaceAll("(prefers-color-scheme: dark)", scheme === "dark" ? "all" : "(max-width: 0px)");
  if (!outline) return themed;
  const mark =
    "<style>[data-mb-words]{position:relative;outline:2px dashed #2563EB;outline-offset:8px;border-radius:2px;cursor:text;margin-bottom:24px}" +
    '[data-mb-words]::before{content:"Words, click to edit";position:absolute;top:-30px;right:-8px;background:#2563EB;color:#fff;font:600 11px/1 Helvetica,Arial,sans-serif;padding:5px 8px;border-radius:6px}</style>';
  return themed.replace("</head>", `${mark}</head>`);
}

const WHO_SENDS: Record<Channel, string> = {
  automatic: "It sends itself, with the words below.",
  enquiry: "Staff send it from an enquiry, starting from the words below.",
  hiring: "HR sends it from the Hiring desk, starting from the words below.",
  here: "Send it from this page, to one person.",
  mailing: "Send a test to yourself. Sending it to a list waits on the mailing desk.",
  system: "It sends itself. Its words are fixed: they carry the security and duty lines.",
};

export function EmailsScreen({ entries, selected, subject: firstSubject, html: firstHtml, text: firstText }: { entries: EntrySummary[]; selected: SelectedEmail; subject: string; html: string; text: string }) {
  const router = useRouter();
  const groups = useMemo(() => [...new Set(entries.map((entry) => entry.group))].map((group) => ({ group, entries: entries.filter((entry) => entry.group === group) })), [entries]);

  const [subject, setSubject] = useState(selected.words?.subject ?? "");
  const [body, setBody] = useState(selected.words?.body ?? "");
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(selected.fields.map((field) => [field.key, field.sample])));
  const [person, setPerson] = useState<PersonHit | null>(null);
  const [drawn, setDrawn] = useState({ subject: firstSubject, html: firstHtml, text: firstText });
  const [drawError, setDrawError] = useState<string | null>(null);
  const [view, setView] = useState<"email" | "text">("email");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [height, setHeight] = useState(900);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, startBusy] = useTransition();
  const [edits, setEdits] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const wordsBox = useRef<HTMLTextAreaElement>(null);
  const [room, setRoom] = useState(680);

  const editable = selected.canEdit || selected.channel === "here";
  const changed = selected.words ? subject !== selected.words.subject || body !== selected.words.body : false;
  const draft = () => ({ ...(changed ? { subject, body } : {}), values, ...(person ? { personId: person.id } : {}) });

  // Redraw the email a moment after the words, facts or person change.
  useEffect(() => {
    if (!edits) return;
    const timer = setTimeout(() => {
      void drawEmail(selected.id, draft()).then((result) => {
        if (!result.ok) return setDrawError(result.error);
        setDrawn(result);
        setDrawError(null);
      });
    }, REDRAW_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draft() reads the same state; edits counts every change
  }, [edits]);

  // Size the frame to the email, and let a click on the outlined words jump to the words box.
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    const ready = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      setHeight(doc.body.scrollHeight + 8);
      doc.querySelector("[data-mb-words]")?.addEventListener("click", () => wordsBox.current?.focus());
    };
    if (iframe.contentDocument?.readyState === "complete") ready();
    iframe.addEventListener("load", ready);
    return () => iframe.removeEventListener("load", ready);
  }, [drawn.html, scheme, device, view]);

  // The email keeps its real width (680 or 375) and is scaled down to fit a narrow column, like an inbox preview.
  useEffect(() => {
    const box = stage.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setRoom(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, [view]);
  const width = device === "desktop" ? 680 : 375;
  const scale = Math.min(1, room / width);

  const touched = () => {
    setEdits((count) => count + 1);
    setNote(null);
  };

  const insert = (key: string) => {
    const box = wordsBox.current;
    const start = box?.selectionStart ?? body.length;
    const end = box?.selectionEnd ?? start;
    const token = `{{${key}}}`;
    setBody(`${body.slice(0, start)}${token}${body.slice(end)}`);
    touched();
    requestAnimationFrame(() => {
      box?.focus();
      box?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const act = (run: () => Promise<Result>, done: string, refresh = false) =>
    startBusy(async () => {
      const result = await run();
      if (!result.ok) return setNote({ tone: "error", text: result.error });
      if (done) setNote({ tone: "ok", text: done });
      if (refresh) router.refresh();
    });

  const test = () => act(async () => ((result) => (result.ok ? ({ ok: true } as const) : result))(await sendEmailTest(selected.id, draft())), "Sent to your own email.");

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
      <nav aria-label="Emails" className="grid content-start gap-4">
        {groups.map(({ group, entries: list }) => (
          <div key={group}>
            <h2 className="mb-1.5 text-caption font-medium tracking-[.08em] text-muted-foreground uppercase">{group}</h2>
            <ul className="m-0 grid list-none gap-0.5 p-0">
              {list.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/admin/emails?email=${entry.id}`}
                    aria-current={entry.id === selected.id ? "page" : undefined}
                    className={`flex items-baseline justify-between gap-2 rounded-lg px-2.5 py-1.5 text-body no-underline ${entry.id === selected.id ? "bg-accent text-foreground" : "text-foreground hover:bg-accent/50"}`}
                  >
                    <span className="min-w-0">{entry.name}</span>
                    <span className={`shrink-0 text-caption ${entry.channel === "here" ? "text-foreground" : "text-muted-foreground"}`}>{entry.channelLabel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <section aria-labelledby="email-name" className="min-w-0">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="email-name" className="text-title font-semibold text-foreground">
              {selected.name}
            </h2>
            <Badge variant="dot" color={selected.channel === "here" ? "green" : selected.channel === "mailing" ? "amber" : "gray"} size="compact">
              {selected.channelLabel}
            </Badge>
          </div>
          <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-body">
            <dt className="text-muted-foreground">Subject</dt>
            <dd className="m-0 font-medium text-foreground">{drawn.subject}</dd>
            <dt className="text-muted-foreground">To</dt>
            <dd className="m-0 text-foreground">{person ? `${person.name}, ${person.email}` : selected.to}</dd>
            <dt className="text-muted-foreground">Sent</dt>
            <dd className="m-0 text-foreground">
              {selected.when}. {WHO_SENDS[selected.channel]}
            </dd>
            {selected.rule ? (
              <>
                <dt className="text-muted-foreground">Rule</dt>
                <dd className="m-0 text-foreground">{selected.rule}</dd>
              </>
            ) : null}
            {selected.needs ? (
              <>
                <dt className="text-muted-foreground">Waits on</dt>
                <dd className="m-0 text-foreground">{selected.needs}</dd>
              </>
            ) : null}
          </dl>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <TabsSubtle selectedIndex={view === "email" ? 0 : 1} onSelect={(index) => setView(index === 0 ? "email" : "text")} idPrefix="email-view">
            <TabsSubtleItem index={0} label="Email" />
            <TabsSubtleItem index={1} label="Plain text" />
          </TabsSubtle>
          {view === "email" ? (
            <div className="flex gap-4">
              <Toggle options={["desktop", "phone"] as const} labels={{ desktop: "Desktop", phone: "Phone" }} value={device} onChange={setDevice} />
              <Toggle options={["light", "dark"] as const} labels={{ light: "Light", dark: "Dark" }} value={scheme} onChange={setScheme} />
            </div>
          ) : null}
        </div>
        {drawError ? <p className="mt-2 text-caption text-destructive">{drawError}</p> : null}

        {view === "email" ? (
          <div className="mt-3 rounded-xl border bg-muted p-6">
            <div ref={stage} className="flex justify-center">
              <div style={{ width: width * scale, height: height * scale }}>
                <iframe
                  ref={frame}
                  key={`${scheme}-${device}`}
                  title={`${selected.name}, as the reader sees it`}
                  srcDoc={framed(drawn.html, scheme, editable && Boolean(selected.words))}
                  className="rounded-lg border-0"
                  style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <pre className="mt-3 m-0 rounded-xl border bg-card p-5 text-body whitespace-pre-wrap text-foreground">{drawn.text}</pre>
        )}
      </section>

      <aside className="grid content-start gap-4">
        {selected.words ? (
          <section className="rounded-xl border bg-card p-4" aria-labelledby="words-heading">
            <h2 id="words-heading" className="text-title font-semibold text-foreground">
              Words
            </h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              {selected.canEdit ? "The letter's own words. The facts, signature and disclosures stay as the email draws them." : selected.channel === "here" ? "You can change them for this one email. Compliance or HR change them for good." : "Compliance or HR can change these words."}
            </p>
            <div className="mt-3 grid gap-3">
              <TextInput label="Subject" value={subject} readOnly={!editable} onChange={(event) => (setSubject(event.target.value), touched())} />
              <TextArea ref={wordsBox} label="Words" value={body} readOnly={!editable} onChange={(event) => (setBody(event.target.value), touched())} className="min-h-44" hint="A blank line starts a new paragraph." />
              {editable ? (
                <div className="flex flex-wrap gap-1.5" aria-label="Fill-in words">
                  {selected.merge.map((field) => (
                    <button key={field.key} type="button" onClick={() => insert(field.key)} title={`Inserts {{${field.key}}}, filled in when it sends`} className="inline-flex h-7 cursor-pointer items-center rounded-md border border-dashed bg-transparent px-2 text-caption text-muted-foreground hover:text-foreground">
                      {field.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {selected.words.designed && !changed ? <p className="text-caption text-muted-foreground">These words were designed in the old editor; saving here keeps them as plain words.</p> : null}
              <div className="flex flex-wrap gap-2">
                {selected.canEdit ? (
                  <Button type="button" loading={busy} disabled={!changed || !subject.trim() || !body.trim()} onClick={() => act(() => saveEmailWords(selected.id, { subject, body }), "Saved. Every email of this kind now uses these words.", true)}>
                    Save words
                  </Button>
                ) : null}
                <Button type="button" variant="secondary" loading={busy} onClick={test}>
                  Send a test to me
                </Button>
                {changed ? (
                  <Button type="button" variant="ghost" onClick={() => (setSubject(selected.words?.subject ?? ""), setBody(selected.words?.body ?? ""), touched())}>
                    Undo changes
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border bg-card p-4">
            <h2 className="text-title font-semibold text-foreground">Fixed words</h2>
            <p className="mt-1 text-body text-muted-foreground">{WHO_SENDS[selected.channel]}</p>
            <div className="mt-3">
              <Button type="button" variant="secondary" loading={busy} onClick={test}>
                Send a test to me
              </Button>
            </div>
          </section>
        )}

        {selected.channel === "here" ? (
          <SendPanel
            selected={selected}
            person={person}
            onPerson={(next) => (setPerson(next), touched())}
            values={values}
            onValue={(key, value) => (setValues((current) => ({ ...current, [key]: value })), touched())}
            busy={busy}
            onSend={() =>
              act(async () => {
                const result = await sendEmailTo(selected.id, draft());
                if (!result.ok) return result;
                setNote({ tone: "ok", text: result.status === "sent" ? `Sent to ${person?.name}. It is on their timeline.` : result.status === "logged" ? `Saved on ${person?.name}'s timeline. Not sent: email is not connected.` : "Resend refused it. Check their address and try again." });
                return { ok: true };
              }, "")
            }
          />
        ) : null}

        {note ? <p className={`text-caption ${note.tone === "ok" ? "text-foreground" : "text-destructive"}`}>{note.text}</p> : null}
      </aside>
    </div>
  );
}

/** Who a "Send here" letter goes to, and its facts. Only the desk roles can send. */
function SendPanel({ selected, person, onPerson, values, onValue, busy, onSend }: { selected: SelectedEmail; person: PersonHit | null; onPerson: (person: PersonHit | null) => void; values: Record<string, string>; onValue: (key: string, value: string) => void; busy: boolean; onSend: () => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PersonHit[]>([]);

  useEffect(() => {
    if (person || query.trim().length < 2) return;
    const timer = setTimeout(() => void findPeople(query).then(setHits), 250);
    return () => clearTimeout(timer);
  }, [query, person]);

  if (!selected.canSend) {
    return (
      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-title font-semibold text-foreground">Send to a client</h2>
        <p className="mt-1 text-body text-muted-foreground">Sales, operations or compliance send these from here.</p>
      </section>
    );
  }

  const ready = Boolean(person) && selected.fields.every((field) => field.optional || values[field.key]?.trim());
  return (
    <section className="rounded-xl border bg-card p-4" aria-labelledby="send-heading">
      <h2 id="send-heading" className="text-title font-semibold text-foreground">
        Send to a client
      </h2>
      <p className="mt-0.5 text-caption text-muted-foreground">Fill the facts; the email beside you shows exactly what they receive.</p>
      <div className="mt-3 grid gap-3">
        {person ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
            <span className="min-w-0 text-body">
              <span className="font-medium text-foreground">{person.name}</span>
              <span className="block truncate text-caption text-muted-foreground">{person.email}</span>
            </span>
            <Button type="button" size="compact" variant="ghost" onClick={() => (setQuery(""), setHits([]), onPerson(null))}>
              Change
            </Button>
          </div>
        ) : (
          <div className="grid gap-1.5">
            <TextInput label="To" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or email of someone in People" />
            {query.trim().length >= 2 ? (
              hits.length ? (
                <ul className="m-0 grid list-none gap-0.5 rounded-lg border p-1">
                  {hits.map((hit) => (
                    <li key={hit.id}>
                      <button type="button" onClick={() => onPerson(hit)} className="w-full cursor-pointer rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-body text-foreground hover:bg-accent">
                        {hit.name} <span className="text-caption text-muted-foreground">{hit.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-caption text-muted-foreground">No one in People matches yet. Add them in People first.</p>
              )
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {selected.fields.map((field) =>
            field.kind === "select" ? (
              <label key={field.key} className="col-span-2 grid gap-1 text-caption text-muted-foreground">
                {field.label}
                <select value={values[field.key] ?? ""} onChange={(event) => onValue(field.key, event.target.value)} className="h-9 rounded-lg border bg-background px-2 text-body text-foreground">
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ) : field.kind === "lines" || field.kind === "textarea" ? (
              <div key={field.key} className="col-span-2">
                <TextArea label={field.label} value={values[field.key] ?? ""} onChange={(event) => onValue(field.key, event.target.value)} className="min-h-24" />
              </div>
            ) : (
              <div key={field.key} className={field.label.length > 22 ? "col-span-2" : undefined}>
                <TextInput label={field.optional ? `${field.label} (optional)` : field.label} value={values[field.key] ?? ""} onChange={(event) => onValue(field.key, event.target.value)} />
              </div>
            ),
          )}
        </div>
        <Button type="button" loading={busy} disabled={!ready} onClick={onSend}>
          {person ? `Send to ${person.name}` : "Send"}
        </Button>
      </div>
    </section>
  );
}

function Toggle<T extends string>({ options, labels, value, onChange }: { options: readonly T[]; labels: Record<T, string>; value: T; onChange: (value: T) => void }) {
  return (
    <div className="flex gap-1" role="group">
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`h-7 cursor-pointer rounded-md border-0 px-2.5 text-caption ${value === option ? "bg-accent text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}>
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
