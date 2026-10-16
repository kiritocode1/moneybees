"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LinkButton } from "@/components/admin/link-button";
import { Badge } from "@/components/fluid/badge";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";

/*
 * The Emails screen (emails-view.tsx): the list of every email by who reads
 * it, and the chosen one as the reader gets it. Dark shows what Apple Mail
 * and Outlook for Mac draw for a reader in dark mode, Light what everyone
 * else sees, regardless of this screen's own theme.
 */

export type EntrySummary = { id: string; group: string; name: string; to: string; when: string; status: "sends" | "planned"; needs?: string; rule?: string };

/**
 * The email in one scheme whatever this screen's theme: its dark-mode rules
 * always on for Dark, never for Light ("max-width: 0px" matches nothing).
 */
const inScheme = (html: string, scheme: "light" | "dark") => html.replaceAll("(prefers-color-scheme: dark)", scheme === "dark" ? "all" : "(max-width: 0px)");

function StatusBadge({ entry }: { entry: EntrySummary }) {
  return (
    <Badge variant="dot" color={entry.status === "sends" ? "green" : "gray"} size="compact" className="shrink-0">
      {entry.status === "sends" ? "Sends" : "Ready, not sent yet"}
    </Badge>
  );
}

export function EmailsScreen({ entries, selected, subject, html, text, template }: { entries: EntrySummary[]; selected: EntrySummary; subject: string; html: string; text: string; template: { name: string; href: string } | null }) {
  const [view, setView] = useState<"email" | "text">("email");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [height, setHeight] = useState(900);
  const frame = useRef<HTMLIFrameElement>(null);

  // A srcDoc frame can finish loading before React attaches onLoad, so measure from the ref too.
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    const measure = () => {
      const doc = iframe.contentDocument;
      if (doc?.body) setHeight(doc.body.scrollHeight + 8);
    };
    if (iframe.contentDocument?.readyState === "complete") measure();
    iframe.addEventListener("load", measure);
    return () => iframe.removeEventListener("load", measure);
  }, [html, scheme, device, view]);
  const groups = useMemo(() => [...new Set(entries.map((entry) => entry.group))].map((group) => ({ group, entries: entries.filter((entry) => entry.group === group) })), [entries]);
  const sending = entries.filter((entry) => entry.status === "sends").length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <nav aria-label="Emails" className="grid content-start gap-5">
        <p className="text-caption text-muted-foreground">
          {entries.length} emails. {sending} send today; the rest are ready and wait on the feature named under each.
        </p>
        {groups.map(({ group, entries: list }) => (
          <div key={group}>
            <h2 className="mb-1.5 text-caption font-medium tracking-[.08em] text-muted-foreground uppercase">{group}</h2>
            <ul className="m-0 grid list-none gap-0.5 p-0">
              {list.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/admin/emails?email=${entry.id}`}
                    aria-current={entry.id === selected.id ? "page" : undefined}
                    className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-body no-underline ${entry.id === selected.id ? "bg-accent text-foreground" : "text-foreground hover:bg-accent/50"}`}
                  >
                    <span className="min-w-0 truncate">{entry.name}</span>
                    {entry.status === "sends" ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22A06B]" aria-label="Sends today" /> : null}
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
            <StatusBadge entry={selected} />
          </div>
          <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-body">
            <dt className="text-muted-foreground">Subject</dt>
            <dd className="m-0 font-medium text-foreground">{subject}</dd>
            <dt className="text-muted-foreground">To</dt>
            <dd className="m-0 text-foreground">{selected.to}</dd>
            <dt className="text-muted-foreground">Sent</dt>
            <dd className="m-0 text-foreground">{selected.when}</dd>
            {selected.rule ? (
              <>
                <dt className="text-muted-foreground">Rule</dt>
                <dd className="m-0 text-foreground">{selected.rule}</dd>
              </>
            ) : null}
            {selected.needs ? (
              <>
                <dt className="text-muted-foreground">Before it sends</dt>
                <dd className="m-0 text-foreground">{selected.needs}</dd>
              </>
            ) : null}
            <dt className="text-muted-foreground">Words</dt>
            <dd className="m-0 text-foreground">{template ? `From the template ${template.name}. The facts, signature and disclosures are filled in from the record.` : "Set in code, with the facts filled in from the record."}</dd>
          </dl>
          {template ? (
            <div className="mt-3">
              <LinkButton href={template.href} icon="pencil">
                Edit the words
              </LinkButton>
            </div>
          ) : null}
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

        {view === "email" ? (
          <div className="mt-3 flex justify-center overflow-x-auto rounded-xl border bg-muted p-6">
            <iframe
              key={`${selected.id}-${scheme}-${device}`}
              title={`${selected.name}, as the reader sees it`}
              srcDoc={inScheme(html, scheme)}
              className="shrink-0 rounded-lg border-0"
              style={{ width: device === "desktop" ? 680 : 375, height }}
              ref={frame}
            />
          </div>
        ) : (
          <pre className="mt-3 m-0 rounded-xl border bg-card p-5 text-body whitespace-pre-wrap text-foreground">{text}</pre>
        )}
      </section>
    </div>
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
