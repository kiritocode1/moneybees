"use client";

import { upload } from "@vercel/blob/client";
import { Check, FileSpreadsheet, FileText, Image as ImageIcon, Lock, Paperclip, Search, Upload, X } from "lucide-react";
import { type DragEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/fluid/button";
import { filesForPicker, finishPublicUpload, registerPrivateFile } from "@/lib/files/actions";
import { fileSize, MAX_EMAIL_FILE_BYTES, MAX_FILE_BYTES, PRIVATE_TYPES, PUBLIC_TYPES } from "@/lib/files/kinds";
import type { FileItem, FilePicks } from "@/lib/files/library";

/*
 * The files an email carries, in every place one is written: the person
 * screen, an enquiry's Reply, HR's emails and the Emails page. Attach opens
 * a picker: the letter's own files first (its Goes with), then what you
 * sent this month, then every other file, with search on top and Upload at
 * the foot. A file dropped on the composer is uploaded and attached. Files
 * uploaded here are private: only the people they are sent to see them.
 */

/** The letter whose Goes with leads the picker: an Email templates row, or a catalogue id. */
export type LetterRef = { templateId?: number; entryId?: string };

const fail = async (response: Response) => ((await response.json().catch(() => ({}))) as { error?: string }).error ?? "The upload failed. Try again.";

/** Private (only the people it is sent to) or public (it can go on the website); `replace` puts it in place of that file. */
export type UploadOptions = { store: "private" | "public"; title?: string; replace?: string };

/**
 * Sends one file to its store and records it: straight from the browser to
 * Vercel Blob when `direct`, else through /api/files/upload as a form.
 */
export async function uploadFile(file: File, { store, title, replace }: UploadOptions, direct: boolean): Promise<FileItem> {
  const types: Record<string, string> = store === "public" ? PUBLIC_TYPES : PRIVATE_TYPES;
  const extension = types[file.type];
  if (!extension) throw new Error(store === "public" ? "A website file must be a PDF or a picture." : "Send a PDF, Word, Excel or picture file.");
  if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is ${fileSize(file.size)}. Files can be up to ${fileSize(MAX_FILE_BYTES)}.`);
  if (direct) {
    const pathname = `${store === "public" ? "uploads" : "files"}/${crypto.randomUUID()}${extension}`;
    const blob = await upload(pathname, file, { access: store, handleUploadUrl: "/api/files/upload", clientPayload: JSON.stringify({ store }), contentType: file.type });
    const result = store === "public" ? await finishPublicUpload({ url: blob.url, pathname, filename: file.name, title, replace }) : await registerPrivateFile({ pathname, filename: file.name, title, replace });
    if (!result.ok) throw new Error(result.error);
    return result.file;
  }
  const form = new FormData();
  form.set("file", file);
  form.set("store", store);
  if (title) form.set("title", title);
  if (replace) form.set("replace", replace);
  const response = await fetch("/api/files/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error(await fail(response));
  return ((await response.json()) as { file: FileItem }).file;
}

/**
 * The attached files and what changes them. `preset` swaps the last
 * letter's own files for the new letter's, and keeps any file attached by
 * hand, so changing the letter never drops a file someone chose.
 */
export function useAttachments(initial: FileItem[] = []) {
  const [files, setFiles] = useState<FileItem[]>(initial);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const direct = useRef<boolean | null>(null);
  const presetRefs = useRef<Set<string>>(new Set());

  const add = useCallback((file: FileItem) => setFiles((now) => (now.some((item) => item.ref === file.ref) ? now : [...now, file])), []);
  const remove = useCallback((ref: string) => setFiles((now) => now.filter((item) => item.ref !== ref)), []);
  const toggle = useCallback((file: FileItem) => setFiles((now) => (now.some((item) => item.ref === file.ref) ? now.filter((item) => item.ref !== file.ref) : [...now, file])), []);

  const uploadFiles = useCallback(
    async (list: FileList | File[]) => {
      setError(null);
      if (direct.current === null) direct.current = (await filesForPicker({})).direct;
      for (const file of Array.from(list)) {
        setUploading((count) => count + 1);
        try {
          add(await uploadFile(file, { store: "private" }, direct.current));
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The upload failed. Try again.");
        } finally {
          setUploading((count) => count - 1);
        }
      }
    },
    [add],
  );

  const preset = useCallback(async (letter: LetterRef | null) => {
    setError(null);
    const suggested = letter ? await filesForPicker(letter).then((picks) => ((direct.current = picks.direct), picks.suggested.filter((item) => item.attachable))) : [];
    const previous = presetRefs.current;
    presetRefs.current = new Set(suggested.map((item) => item.ref));
    setFiles((now) => {
      const kept = now.filter((item) => !previous.has(item.ref) && !presetRefs.current.has(item.ref));
      return [...suggested, ...kept];
    });
  }, []);

  return { files, setFiles, add, remove, toggle, uploadFiles, preset, uploading: uploading > 0, error, setError, direct, refs: files.map((file) => file.ref) };
}

export type Attachments = ReturnType<typeof useAttachments>;

const iconFor = (item: Pick<FileItem, "kind" | "private">) => (item.private ? Lock : item.kind === "Picture" ? ImageIcon : item.kind === "Excel" ? FileSpreadsheet : FileText);

/** Wraps a composer so a file dropped anywhere on it is uploaded and attached. */
export function FileDrop({ attach, children, className }: { attach: Attachments; children: ReactNode; className?: string }) {
  const [over, setOver] = useState(false);
  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes("Files");
  return (
    <div
      className={`relative ${className ?? ""}`}
      onDragOver={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setOver(false);
        void attach.uploadFiles(event.dataTransfer.files);
      }}
    >
      {children}
      {over ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-dashed border-foreground/40 bg-background/80 text-body text-foreground">
          Drop to attach. It stays private to the people you send it to.
        </div>
      ) : null}
    </div>
  );
}

/** The chips, the size when it nears the limit, and Attach. */
export function FileRow({ attach, letter, rules = false, hint }: { attach: Attachments; letter?: LetterRef | null; rules?: boolean; hint?: string }) {
  const [open, setOpen] = useState(false);
  const total = attach.files.reduce((sum, file) => sum + (file.size ?? 0), 0);
  return (
    <div className="grid gap-1.5">
      <div className="relative flex flex-wrap items-center gap-2">
        {attach.files.map((file) => {
          const Icon = iconFor(file);
          return (
            <span key={file.ref} className="inline-flex h-8 max-w-full items-center gap-2 rounded-lg border bg-card pr-1.5 pl-2.5 text-body">
              <Icon size={14} aria-hidden="true" className="shrink-0 text-muted-foreground" />
              {file.href ? (
                <a href={file.href} target="_blank" rel="noreferrer" className="truncate text-foreground no-underline hover:underline">
                  {file.name}
                </a>
              ) : (
                <span className="truncate text-foreground">{file.name}</span>
              )}
              {file.sizeLabel ? <span className="shrink-0 text-caption text-muted-foreground tabular-nums">{file.sizeLabel}</span> : null}
              <button type="button" onClick={() => attach.remove(file.ref)} aria-label={`Remove ${file.name}`} className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:text-foreground">
                <X size={13} aria-hidden="true" />
              </button>
            </span>
          );
        })}
        <Button type="button" size="compact" variant="ghost" leadingIcon={Paperclip} active={open} loading={attach.uploading} onClick={() => setOpen((now) => !now)} aria-expanded={open}>
          {attach.files.length ? "Attach more" : "Attach"}
        </Button>
        {total > MAX_EMAIL_FILE_BYTES * 0.6 ? (
          <span className={`text-caption tabular-nums ${total > MAX_EMAIL_FILE_BYTES ? "text-destructive" : "text-muted-foreground"}`}>
            {fileSize(total)} of {fileSize(MAX_EMAIL_FILE_BYTES)}
          </span>
        ) : null}
        {open ? <Picker attach={attach} letter={letter ?? null} rules={rules} onClose={() => setOpen(false)} /> : null}
      </div>
      {attach.error ? <p className="text-caption text-destructive">{attach.error}</p> : hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Picker({ attach, letter, rules, onClose }: { attach: Attachments; letter: LetterRef | null; rules: boolean; onClose: () => void }) {
  const [picks, setPicks] = useState<FilePicks | null>(null);
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const chooser = useRef<HTMLInputElement>(null);
  const templateId = letter?.templateId;
  const entryId = letter?.entryId;

  useEffect(() => {
    let live = true;
    void filesForPicker({ templateId, entryId, rules }).then((result) => {
      if (!live) return;
      attach.direct.current = result.direct;
      setPicks(result);
    });
    return () => {
      live = false;
    };
  }, [templateId, entryId, rules, attach.direct]);

  useEffect(() => {
    input.current?.focus();
    const away = (event: MouseEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) onClose();
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", escape);
    };
  }, [onClose]);

  const shown = useMemo(() => {
    if (!picks) return null;
    const words = query.trim().toLowerCase();
    const keep = (item: FileItem) => !words || `${item.name} ${item.note}`.toLowerCase().includes(words);
    // A file uploaded since the picker opened is not in its lists yet; it leads the rest.
    const listed = new Set([...picks.suggested, ...picks.recent, ...picks.all].map((item) => item.ref));
    const fresh = attach.files.filter((file) => !listed.has(file.ref));
    return { suggested: picks.suggested.filter(keep), recent: picks.recent.filter(keep), all: [...fresh, ...picks.all].filter(keep) };
  }, [picks, query, attach.files]);
  const attached = new Set(attach.refs);
  const empty = shown && !shown.suggested.length && !shown.recent.length && !shown.all.length;

  return (
    <div ref={box} role="dialog" aria-label="Attach a file" className="absolute top-full left-0 z-20 mt-2 grid w-[min(400px,calc(100vw-48px))] gap-1 rounded-xl border bg-popover p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
      <label className="flex h-8 items-center gap-2 rounded-lg border px-2.5 focus-within:border-foreground/40">
        <Search size={13} aria-hidden="true" className="text-muted-foreground" />
        <input ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files" aria-label="Search files" className="h-full min-w-0 flex-1 border-0 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground" />
      </label>
      <div className="max-h-[360px] overflow-y-auto">
        {!shown ? <p className="px-2.5 py-3 text-caption text-muted-foreground">Finding files…</p> : null}
        {empty ? <p className="px-2.5 py-3 text-caption text-muted-foreground">{query ? "No file by that name." : "No files yet. Upload one below."}</p> : null}
        {shown ? (
          <>
            <Group label={rules ? "Always the newest month" : "Goes with this letter"} items={shown.suggested} attached={attached} onToggle={attach.toggle} />
            <Group label="You sent recently" items={shown.recent} attached={attached} onToggle={attach.toggle} />
            <Group label={shown.suggested.length || shown.recent.length ? "Every other file" : "Files"} items={shown.all} attached={attached} onToggle={attach.toggle} />
          </>
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between border-t px-1 pt-1.5">
        <Button type="button" size="compact" variant="ghost" leadingIcon={Upload} loading={attach.uploading} onClick={() => chooser.current?.click()}>
          Upload a file
        </Button>
        <span className="pr-1.5 text-caption text-muted-foreground">Private to the people you send it to</span>
        <input
          ref={chooser}
          type="file"
          multiple
          hidden
          accept={Object.keys(PRIVATE_TYPES).join(",")}
          onChange={(event) => {
            if (event.target.files?.length) void attach.uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function Group({ label, items, attached, onToggle }: { label: string; items: FileItem[]; attached: Set<string>; onToggle: (item: FileItem) => void }) {
  if (!items.length) return null;
  return (
    <div className="pt-1">
      <p className="px-2.5 pt-1.5 pb-1 text-caption text-muted-foreground">{label}</p>
      {items.map((item) => {
        const Icon = iconFor(item);
        const on = attached.has(item.ref);
        return (
          <button
            key={item.ref}
            type="button"
            disabled={!item.attachable}
            onClick={() => onToggle(item)}
            aria-pressed={on}
            className="grid w-full cursor-pointer grid-cols-[16px_16px_minmax(0,1fr)] items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 py-1.5 text-left hover:bg-accent disabled:cursor-default disabled:opacity-45 disabled:hover:bg-transparent"
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${on ? "border-foreground bg-foreground text-background" : "border-foreground/30"}`}>{on ? <Check size={11} aria-hidden="true" /> : null}</span>
            <Icon size={15} aria-hidden="true" className="text-muted-foreground" />
            <span className="min-w-0">
              <span className="block truncate text-body text-foreground">{item.name}</span>
              <span className="block truncate text-caption text-muted-foreground tabular-nums">{[item.note, item.sizeLabel].filter(Boolean).join(" · ")}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
