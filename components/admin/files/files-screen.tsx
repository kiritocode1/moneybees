"use client";

import { FileSpreadsheet, FileText, Image as ImageIcon, Lock, Mail, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "@/components/admin/fields";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/fluid/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/fluid/table";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { findPeople, type PersonHit } from "@/lib/crm/email-desk";
import { istDateTime } from "@/lib/crm/format";
import { deleteFile, makeDocumentCard } from "@/lib/files/actions";
import { fileSize, isPublicType, PRIVATE_TYPES } from "@/lib/files/kinds";
import type { FileDetail, FileRow, FilesScreenData } from "@/lib/files/screen-data";
import { uploadFile } from "./file-row";

/*
 * The Files screen, laid out like Enquiries: a count line, tabs, then the
 * files with where each is used and how often it was sent. A row opens it
 * beside the list: the file itself, who can see it, every place that uses
 * it and every email it went with, and what can be done with it next.
 */

const TABS = [
  { key: "all", label: "All", keep: () => true },
  { key: "pdf", label: "PDFs", keep: (file: FileRow) => file.kind === "PDF" },
  { key: "pictures", label: "Pictures", keep: (file: FileRow) => file.kind === "Picture" },
  { key: "private", label: "Private", keep: (file: FileRow) => file.private },
  // Not used: nothing on the site or in a letter uses it, and it was never sent. Candidates to delete.
  { key: "unused", label: "Not used", keep: (file: FileRow) => file.places.length === 0 && file.sentCount === 0 },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
/**
 * Marks a picture broken when it failed before React was listening: a
 * server-drawn <img> can error before hydration, so onError never fires.
 */
const checkLoaded = (setBroken: (broken: boolean) => void) => (img: HTMLImageElement | null) => {
  if (img?.complete && img.naturalWidth === 0) setBroken(true);
};

/** The icon for a file's kind; a lock for a private one. */
function FileIcon({ file, size }: { file: Pick<FileRow, "kind" | "private">; size: number }) {
  const props = { size, "aria-hidden": true } as const;
  if (file.private) return <Lock {...props} />;
  if (file.kind === "Picture") return <ImageIcon {...props} />;
  if (file.kind === "Excel") return <FileSpreadsheet {...props} />;
  return <FileText {...props} />;
}

export function FilesScreen({ data }: { data: FilesScreenData }) {
  const router = useRouter();
  const params = useSearchParams();
  const tab = (TABS.find((option) => option.key === params.get("tab"))?.key ?? "all") as TabKey;
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const counts = useMemo(() => Object.fromEntries(TABS.map((option) => [option.key, data.rows.filter(option.keep).length])) as Record<TabKey, number>, [data.rows]);
  const rows = useMemo(() => {
    const words = query.trim().toLowerCase();
    const keep = TABS.find((option) => option.key === tab)?.keep ?? (() => true);
    return data.rows.filter((file) => keep(file) && (!words || `${file.name} ${file.note} ${file.places.map((place) => place.label).join(" ")}`.toLowerCase().includes(words)));
  }, [data.rows, tab, query]);

  const go = (next: { tab?: TabKey; file?: string | null }) => {
    const search = new URLSearchParams(params.toString());
    if (next.tab) search.set("tab", next.tab);
    if (next.file === null) search.delete("file");
    else if (next.file) search.set("file", next.file);
    router.push(`/admin/files?${search.toString()}`, { scroll: false });
  };
  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, index: number) => {
    const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[event.key];
    if (step) {
      event.preventDefault();
      rowRefs.current[Math.min(Math.max(index + step, 0), rows.length - 1)]?.focus();
    } else if (event.key === "Enter") go({ file: rows[index].ref });
  };

  const unused = counts.unused;
  return (
    <>
      <header className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Files</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {data.rows.length === 1 ? "1 file." : `${data.rows.length} files.`}
            {unused ? ` ${unused} ${unused === 1 ? "is" : "are"} not used anywhere.` : ""}
          </p>
          <ScreenIntro screen="files" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TabsSubtle selectedIndex={TABS.findIndex((option) => option.key === tab)} onSelect={(index) => go({ tab: TABS[index].key })} idPrefix="files">
            {TABS.map((option, index) => (
              <TabsSubtleItem key={option.key} index={index} label={counts[option.key] ? `${option.label} ${counts[option.key]}` : option.label} />
            ))}
          </TabsSubtle>
          <Button leadingIcon={Upload} onClick={() => setUploading(true)}>
            Upload
          </Button>
        </div>
      </header>

      <div className={`grid items-start gap-6 ${data.detail ? "xl:grid-cols-[minmax(0,1fr)_400px]" : ""}`}>
        <div className="min-w-0">
          <label className="mb-3 flex h-9 max-w-[360px] items-center gap-2 rounded-lg border px-3 focus-within:border-foreground/40">
            <Search size={14} aria-hidden="true" className="text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files" aria-label="Search files" className="h-full min-w-0 flex-1 border-0 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed px-6 py-10 text-center text-body text-muted-foreground">{query ? "No file by that name." : tab === "unused" ? "Every file is used somewhere." : "No files here yet."}</p>
          ) : (
            <Table aria-label="Files">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[52px]">
                    <span className="sr-only">Preview</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[130px]">Kind</TableHead>
                  <TableHead>Used in</TableHead>
                  <TableHead className="w-[90px]">Sent</TableHead>
                  <TableHead className="w-[90px]">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((file, index) => (
                  <TableRow
                    key={file.ref}
                    index={index}
                    ref={(node) => {
                      rowRefs.current[index] = node;
                    }}
                    tabIndex={0}
                    onClick={() => go({ file: file.ref })}
                    onKeyDown={(event) => onRowKey(event, index)}
                    aria-selected={data.detail?.ref === file.ref}
                    className={`cursor-pointer outline-none focus-visible:[&>td]:text-foreground ${data.detail?.ref === file.ref ? "[&>td]:bg-accent/60" : ""}`}
                  >
                    <TableCell>
                      <Thumb file={file} />
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground">{file.name}</span>
                      {file.private ? <Lock size={12} aria-label="Private" className="ml-1.5 inline align-[-1px] text-muted-foreground" /> : null}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {file.kind}
                      {file.sizeLabel ? ` · ${file.sizeLabel}` : ""}
                    </TableCell>
                    <TableCell>{file.places.length ? [...new Set(file.places.map((place) => place.short))].join(", ") : file.sentCount ? "Sent by email" : <span className="text-[#f0c060]">Not used</span>}</TableCell>
                    <TableCell className="tabular-nums">{file.sentCount ? (file.sentCount === 1 ? "once" : file.sentCount === 2 ? "twice" : `${file.sentCount} times`) : ""}</TableCell>
                    <TableCell className="tabular-nums" title={istDateTime(file.updatedAt)}>
                      {shortDate(file.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {data.detail ? <FilePanel key={data.detail.ref} file={data.detail} data={data} onClose={() => go({ file: null })} /> : null}
      </div>

      {uploading ? <UploadDialog data={data} onClose={() => setUploading(false)} onDone={(ref) => (setUploading(false), go({ file: ref, tab: "all" }), router.refresh())} /> : null}
    </>
  );
}

/** A picture's own thumbnail, or a page for anything else, or when the picture will not load. */
function Thumb({ file }: { file: Pick<FileRow, "kind" | "private" | "href" | "name"> }) {
  const [broken, setBroken] = useState(false);
  if (file.kind === "Picture" && file.href && !broken) return <img ref={checkLoaded(setBroken)} src={file.href} alt="" onError={() => setBroken(true)} className="h-10 w-8 rounded object-cover" loading="lazy" />;
  return (
    <span className="flex h-10 w-8 items-center justify-center rounded border bg-muted text-muted-foreground">
      <FileIcon file={file} size={14} />
    </span>
  );
}

function Preview({ file }: { file: FileDetail }) {
  const [broken, setBroken] = useState(false);
  if (!file.href) return null;
  if (broken) return <p className="rounded-lg bg-muted px-4 py-6 text-center text-body text-muted-foreground">The file is missing from storage. Replace it, or delete it if nothing uses it.</p>;
  if (file.kind === "Picture") return <img ref={checkLoaded(setBroken)} src={file.href} alt={file.name} onError={() => setBroken(true)} className="max-h-[260px] w-full rounded-lg bg-muted object-contain" />;
  if (file.kind === "PDF") return <iframe src={`${file.href}#toolbar=0&view=FitH`} title={file.name} className="h-[300px] w-full rounded-lg border bg-muted" />;
  return (
    <div className="flex h-[140px] items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <FileIcon file={file} size={28} />
    </div>
  );
}

function FilePanel({ file, data, onClose }: { file: FileDetail; data: FilesScreenData; onClose: () => void }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"replace" | "delete" | "card" | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const absolute = file.href && !file.private ? new URL(file.href, typeof window === "undefined" ? "https://moneybee.in" : window.location.origin).toString() : null;

  return (
    <aside className="grid gap-4 rounded-xl border bg-card p-4 xl:sticky xl:top-24" aria-label={file.name}>
      <Preview file={file} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-title font-semibold break-words text-foreground">{file.name}</h2>
          <p className="mt-0.5 text-caption text-muted-foreground tabular-nums">
            {file.kind}
            {file.sizeLabel ? ` · ${file.sizeLabel}` : ""} · updated {shortDate(file.updatedAt)}
          </p>
        </div>
        <Button size="compact" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {file.can.send && file.attachable ? (
          <Button size="compact" leadingIcon={Mail} onClick={() => setSending((now) => !now)} active={sending}>
            Send to someone
          </Button>
        ) : null}
        {file.can.replace ? (
          <Button size="compact" variant="secondary" onClick={() => setDialog("replace")}>
            Replace
          </Button>
        ) : null}
      </div>
      {sending ? <SendTo fileRef={file.ref} /> : null}

      <dl className="m-0 grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-body">
        <dt className="text-muted-foreground">Who can see it</dt>
        <dd className="m-0 text-foreground">{file.private ? "Only the people it is sent to" : "Anyone, it can be on the website"}</dd>
        {!file.attachable ? (
          <>
            <dt className="text-muted-foreground">Sending</dt>
            <dd className="m-0 text-foreground">Not yet: {file.note.toLowerCase()}</dd>
          </>
        ) : null}
      </dl>

      <section>
        <h3 className="mb-1.5 text-caption font-medium text-muted-foreground">Used in</h3>
        {file.places.length ? (
          <ul className="m-0 grid list-none gap-1 p-0">
            {file.places.map((place) => (
              <li key={`${place.kind}-${place.href}-${place.label}`}>
                <Link href={place.href} className="text-body text-foreground">
                  {place.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-2">
            <p className="text-body text-muted-foreground">{file.sentCount ? "Nothing on the site or in a letter. It goes by email only." : "Not used anywhere."}</p>
            {file.can.card ? (
              <div>
                <Button size="compact" variant="secondary" onClick={() => setDialog("card")}>
                  Make it a document card
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-1.5 flex justify-between text-caption font-medium text-muted-foreground">
          <span>Sent with</span>
          {file.sentCount ? <span className="tabular-nums">{file.sentCount}</span> : null}
        </h3>
        {file.sent.length ? (
          <ul className="m-0 grid list-none p-0">
            {file.sent.map((email) => (
              <li key={email.emailId} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 border-t py-1.5 first:border-t-0">
                <span className="min-w-0">
                  {email.personHref ? (
                    <Link href={email.personHref} className="text-body text-foreground">
                      {email.person}
                    </Link>
                  ) : (
                    <span className="text-body text-foreground">{email.person}</span>
                  )}
                  <span className="block truncate text-caption text-muted-foreground">
                    {email.subject} · {shortDate(email.at)}
                  </span>
                </span>
                <Badge size="compact" color={email.opened ? "green" : "gray"}>
                  {email.status}
                </Badge>
              </li>
            ))}
            {file.sentCount > file.sent.length ? <li className="pt-1.5 text-caption text-muted-foreground">{file.sentCount - file.sent.length} more</li> : null}
          </ul>
        ) : (
          <p className="text-body text-muted-foreground">Not sent yet.</p>
        )}
      </section>

      <div className="flex flex-wrap gap-1 border-t pt-3">
        {file.href ? (
          <Button size="compact" variant="ghost" render={<a href={file.private ? `${file.href}?download=1` : file.href} download className="no-underline" />}>
            Download
          </Button>
        ) : null}
        {absolute ? (
          <Button size="compact" variant="ghost" onClick={() => void navigator.clipboard.writeText(absolute).then(() => setCopied(true))}>
            {copied ? "Link copied" : "Copy link"}
          </Button>
        ) : null}
        {!file.private ? (
          <Button size="compact" variant="ghost" render={<Link href={`/admin/collections/media/${file.ref.split(":")[1]}`} className="no-underline" />}>
            Alt text and focus
          </Button>
        ) : null}
        {file.can.delete ? (
          <Button size="compact" variant="ghost" className="ml-auto text-destructive hover:text-destructive" onClick={() => setDialog("delete")}>
            Delete
          </Button>
        ) : null}
      </div>

      {dialog === "replace" ? <ReplaceDialog file={file} data={data} onClose={() => setDialog(null)} onDone={() => (setDialog(null), router.refresh())} /> : null}
      {/* Closing the panel navigates, which reloads the list without the file. */}
      {dialog === "delete" ? <DeleteDialog file={file} onClose={() => setDialog(null)} onDone={() => (setDialog(null), onClose())} /> : null}
      {dialog === "card" ? <CardDialog file={file} data={data} onClose={() => setDialog(null)} /> : null}
    </aside>
  );
}

/** Who to send it to: the person screen opens with the file attached, ready for a letter. */
function SendTo({ fileRef }: { fileRef: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PersonHit[]>([]);
  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = setTimeout(() => void findPeople(query).then(setHits), 250);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="grid gap-1.5">
      <TextInput label="To" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or email of someone in People" autoFocus />
      {query.trim().length >= 2 ? (
        hits.length ? (
          <ul className="m-0 grid list-none gap-0.5 rounded-lg border p-1">
            {hits.map((hit) => (
              <li key={hit.id}>
                <button type="button" onClick={() => router.push(`/admin/people/${hit.id}?attach=${encodeURIComponent(fileRef)}`)} className="w-full cursor-pointer rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-body text-foreground hover:bg-accent">
                  {hit.name} <span className="text-caption text-muted-foreground">{hit.email}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-caption text-muted-foreground">No one in People matches yet.</p>
        )
      ) : null}
    </div>
  );
}

/** A file picked by clicking or dropping, checked against what the store takes. */
function FileChooser({ file, onFile, accept }: { file: File | null; onFile: (file: File) => void; accept: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      onDragOver={(event) => (event.preventDefault(), setOver(true))}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        const dropped = event.dataTransfer.files[0];
        if (dropped) onFile(dropped);
      }}
      className={`grid w-full cursor-pointer place-items-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center ${over ? "border-foreground/50 bg-accent" : "bg-transparent"}`}
    >
      <Upload size={18} aria-hidden="true" className="text-muted-foreground" />
      <span className="text-body text-foreground">{file ? file.name : "Choose a file, or drop it here"}</span>
      <span className="text-caption text-muted-foreground">{file ? fileSize(file.size) : "PDF, picture, Word or Excel, up to 25 MB"}</span>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        onChange={(event) => {
          const chosen = event.target.files?.[0];
          if (chosen) onFile(chosen);
          event.target.value = "";
        }}
      />
    </button>
  );
}

function UploadDialog({ data, onClose, onDone }: { data: FilesScreenData; onClose: () => void; onDone: (ref: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [store, setStore] = useState<"private" | "public">(data.canUploadPrivate ? "private" : "public");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canPublic = !file || isPublicType(file.type);
  const choose = (next: File) => {
    setFile(next);
    setError(null);
    if (!title) setTitle(next.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "));
    if (!isPublicType(next.type)) setStore("private");
  };
  const send = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const saved = await uploadFile(file, { store, title }, data.targets[store]);
      onDone(saved.ref);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent size="lg" className="fluid">
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
          <DialogDescription>It is listed here and can be attached to any email.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FileChooser file={file} onFile={choose} accept={Object.keys(PRIVATE_TYPES).concat("image/webp").join(",")} />
          <TextInput label="Name" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Disclosure Document, October 2026" />
          <fieldset className="m-0 grid gap-2 border-0 p-0">
            <legend className="mb-1.5 text-caption text-muted-foreground">Who can see it</legend>
            {data.canUploadPrivate ? (
              <label className="flex cursor-pointer items-start gap-2.5 text-body text-foreground">
                <input type="radio" name="store" checked={store === "private"} onChange={() => setStore("private")} className="mt-1 accent-[var(--foreground)]" />
                <span>
                  Only the people we send it to
                  <span className="block text-caption text-muted-foreground">For the Flyingbee PPM, fee illustrations, anything for one client. It never has a public address.</span>
                </span>
              </label>
            ) : null}
            <label className={`flex items-start gap-2.5 text-body ${canPublic ? "cursor-pointer text-foreground" : "text-muted-foreground"}`}>
              <input type="radio" name="store" checked={store === "public"} disabled={!canPublic} onChange={() => setStore("public")} className="mt-1 accent-[var(--foreground)]" />
              <span>
                Anyone, it can go on the website
                <span className="block text-caption text-muted-foreground">{canPublic ? "For document cards, fact sheets, portraits and page pictures." : "Only a PDF or a picture can go on the website."}</span>
              </span>
            </label>
          </fieldset>
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy} disabled={!file || !title.trim()} onClick={() => void send()}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReplaceDialog({ file, data, onClose, onDone }: { file: FileDetail; data: FilesScreenData; onClose: () => void; onDone: () => void }) {
  const [next, setNext] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = file.private ? "private" : "public";
  const send = async () => {
    if (!next) return;
    setBusy(true);
    setError(null);
    try {
      await uploadFile(next, { store, replace: file.ref }, data.targets[store]);
      onDone();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent size="lg" className="fluid">
        <DialogHeader>
          <DialogTitle>Replace {file.name}</DialogTitle>
          <DialogDescription>
            {file.places.length ? `This changes ${file.places.length === 1 ? "1 place" : `${file.places.length} places`}. ` : "It is not used anywhere yet. "}
            Emails already sent keep the copy they carried.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {file.places.length ? (
            <ul className="m-0 grid list-disc gap-1 pl-5 text-body text-foreground">
              {file.places.map((place) => (
                <li key={`${place.kind}-${place.label}`}>{place.label}</li>
              ))}
            </ul>
          ) : null}
          <FileChooser file={next} onFile={(chosen) => (setNext(chosen), setError(null))} accept={file.private ? Object.keys(PRIVATE_TYPES).join(",") : "application/pdf,image/png,image/jpeg,image/webp"} />
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy} disabled={!next} onClick={() => void send()}>
            Replace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ file, onClose, onDone }: { file: FileDetail; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const used = file.places.length > 0;
  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="fluid">
        <DialogHeader>
          <DialogTitle>{used ? `${file.name} is still used` : `Delete ${file.name}?`}</DialogTitle>
          <DialogDescription>{used ? "Take it out of these first, then delete it." : file.sentCount ? "Emails that carried it keep their copy. The file itself cannot be brought back." : "It cannot be brought back."}</DialogDescription>
        </DialogHeader>
        {used ? (
          <ul className="m-0 grid list-none gap-1 p-0">
            {file.places.map((place) => (
              <li key={`${place.kind}-${place.label}`}>
                <Link href={place.href} className="text-body text-foreground">
                  {place.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {used ? "Close" : "Cancel"}
          </Button>
          {used ? null : (
            <Button
              loading={busy}
              onClick={async () => {
                setBusy(true);
                const result = await deleteFile(file.ref);
                setBusy(false);
                if (result.ok) onDone();
                else setError(result.error);
              }}
            >
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CardDialog({ file, data, onClose }: { file: FileDetail; data: FilesScreenData; onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState(file.name);
  const [group, setGroup] = useState<string>(data.groups[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="fluid">
        <DialogHeader>
          <DialogTitle>Make it a document card</DialogTitle>
          <DialogDescription>A card on the Investor Centre that opens this PDF.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <TextInput label="Title on the card" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="grid gap-1.5">
            <span className="text-caption text-muted-foreground">Group</span>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger aria-label="Group" />
              <SelectContent>
                {data.groups.map((option, index) => (
                  <SelectItem key={option.id} index={index} value={option.id}>
                    {option.heading}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={busy}
            disabled={!title.trim() || !group}
            onClick={async () => {
              setBusy(true);
              const result = await makeDocumentCard(file.ref, { title, group: group as never });
              setBusy(false);
              if (result.ok) router.push(result.href);
              else setError(result.error);
            }}
          >
            Make the card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
