"use client";

import "@react-email/editor/themes/default.css";
import { EmailEditor, type EmailEditorRef } from "@react-email/editor";
import { imageSlashCommand } from "@react-email/editor/plugins";
import { BULLET_LIST, BUTTON, DIVIDER, H1, H2, Inspector, QUOTE, SECTION, type SlashCommandItem, TEXT, THREE_COLUMNS, TWO_COLUMNS } from "@react-email/editor/ui";
import { useField } from "@payloadcms/ui";
import type { Editor, JSONContent } from "@tiptap/core";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { useCurrentEditor } from "@tiptap/react";
import { GripVertical } from "lucide-react";
import type { JSONFieldClientComponent } from "payload";
import { type DragEvent, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { MONEYBEE_EMAIL_THEME } from "@/lib/crm/email-theme";
import { sendTemplateTest } from "@/lib/crm/template-actions";

/*
 * The email template editor (EmailTemplates `design` field). React Email's
 * own editor (@react-email/editor) on Moneybee's theme, with:
 *   - a block palette: click a block to add it at the cursor, or drag it onto
 *     the email and drop it where it should go;
 *   - a handle beside every block to drag it somewhere else (Tiptap's
 *     DragHandle);
 *   - merge fields ({{firstName}} and the rest) that the sender fills in;
 *   - the editor's inspector for the selected block's styles;
 *   - a preview of the exact HTML that will be sent, and a test send.
 * The design (editor JSON) is what staff edit; the HTML and the plain-text
 * version are exported from it on every change and saved beside it, so
 * sending never needs the editor.
 */

const BLOCKS: readonly SlashCommandItem[] = [H1, H2, TEXT, BUTTON, imageSlashCommand, DIVIDER, TWO_COLUMNS, THREE_COLUMNS, SECTION, QUOTE, BULLET_LIST];
const MERGE_FIELDS = [
  { key: "firstName", label: "First name" },
  { key: "name", label: "Full name" },
  { key: "reference", label: "Reference" },
  { key: "senderName", label: "Sender" },
  { key: "role", label: "Role applied for" },
  { key: "keptUntil", label: "Application kept until" },
  { key: "interviewAt", label: "Interview time" },
  { key: "interviewPlace", label: "Interview place" },
  { key: "interviewWith", label: "Interviewer" },
] as const;
const DRAG_TYPE = "application/x-moneybee-email";
const EXPORT_DELAY_MS = 400;

/** A template saved before the editor existed has only plain text; open it as paragraphs. */
function fromPlainText(text: string | null | undefined): string {
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return (text ?? "")
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escape(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

type Insert = { kind: "block"; index: number } | { kind: "merge"; key: string };

/**
 * Where a block goes: never inside a sentence. Dropped on a paragraph, it
 * lands before or after it depending on which half the pointer is over;
 * added by click, it goes after the paragraph holding the cursor, or into
 * that paragraph if it is empty. Returns a cursor inside a fresh empty
 * paragraph, which the block's own insert command then fills.
 */
function blockSlot(editor: Editor, pos: number, pointerY?: number) {
  const $pos = editor.state.doc.resolve(pos);
  if ($pos.depth === 0) return pos;
  if ($pos.parent.isTextblock && $pos.parent.content.size === 0) return pos;
  const start = $pos.before($pos.depth);
  const end = $pos.after($pos.depth);
  const rect = (editor.view.nodeDOM(start) as HTMLElement | null)?.getBoundingClientRect();
  const boundary = pointerY !== undefined && rect && pointerY < rect.top + rect.height / 2 ? start : end;
  editor.chain().insertContentAt(boundary, { type: "paragraph" }).run();
  return boundary + 1;
}

/** Lives inside the editor, so it can reach the Tiptap instance: the drag handle, and drops from the palette. */
function EditorChrome({ onInsertReady }: { onInsertReady: (insert: (what: Insert, at?: { x: number; y: number }) => void) => void }) {
  const { editor } = useCurrentEditor();
  // Where the cursor was while the editor had focus. The editor drops its
  // selection when focus moves to a palette button, so a click-insert reads this.
  const cursor = useRef(0);

  useEffect(() => {
    if (!editor) return;
    const remember = () => {
      if (editor.isFocused) cursor.current = editor.state.selection.from;
    };
    editor.on("selectionUpdate", remember);
    editor.on("focus", remember);
    onInsertReady((what, at) => {
      const hit = at ? editor.view.posAtCoords({ left: at.x, top: at.y })?.pos : undefined;
      const from = Math.min(hit ?? cursor.current, editor.state.doc.content.size);
      if (what.kind === "merge") {
        editor.chain().focus().setTextSelection(from).insertContent(`{{${what.key}}}`).run();
        return;
      }
      const pos = blockSlot(editor, from, at?.y);
      editor.chain().focus().setTextSelection(pos).run();
      BLOCKS[what.index].command({ editor, range: { from: pos, to: pos } });
    });
    return () => {
      editor.off("selectionUpdate", remember);
      editor.off("focus", remember);
    };
  }, [editor, onInsertReady]);

  if (!editor) return null;
  return (
    <DragHandle editor={editor} nested className="mb-drag-handle">
      <span aria-label="Drag to move this block" title="Drag to move">
        <GripVertical size={14} />
      </span>
    </DragHandle>
  );
}

export const TemplateEditorField: JSONFieldClientComponent = ({ path }) => {
  const design = useField<JSONContent | null>({ path });
  const html = useField<string>({ path: "html" });
  const text = useField<string>({ path: "body" });
  const subject = useField<string>({ path: "subject" });
  const editorRef = useRef<EmailEditorRef>(null);
  const insertRef = useRef<((what: Insert, at?: { x: number; y: number }) => void) | null>(null);
  const exportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [view, setView] = useState<"design" | "preview" | "text">("design");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [exporting, startExport] = useTransition();
  const registerInsert = useCallback((insert: (what: Insert, at?: { x: number; y: number }) => void) => {
    insertRef.current = insert;
  }, []);
  const test = useAction();
  const [testSent, setTestSent] = useState(false);

  // The content the editor opens with; read once, so typing never resets it.
  const [initial] = useState(() => design.value ?? fromPlainText(text.value));

  const exportNow = useCallback(
    (ref: EmailEditorRef, quietly: boolean) =>
      startExport(async () => {
        const email = await ref.getEmail();
        html.setValue(email.html, quietly);
        text.setValue(email.text, quietly);
      }),
    [html, text],
  );

  const onUpdate = (ref: EmailEditorRef) => {
    design.setValue(ref.getJSON());
    if (exportTimer.current) clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => exportNow(ref, false), EXPORT_DELAY_MS);
  };

  const onDragStart = (event: DragEvent, what: Insert) => {
    event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(what));
    event.dataTransfer.effectAllowed = "copy";
  };
  const isOurs = (event: DragEvent) => event.dataTransfer.types.includes(DRAG_TYPE);

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, "") }));
    const response = await fetch("/api/media", { method: "POST", body, credentials: "include" });
    if (!response.ok) throw new Error("The image could not be uploaded.");
    const { doc } = (await response.json()) as { doc: { url: string } };
    // Email clients need an absolute address.
    return { url: doc.url.startsWith("/") ? `${window.location.origin}${doc.url}` : doc.url };
  };

  return (
    <div className="fluid mb-email-editor my-6 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsSubtle selectedIndex={["design", "preview", "text"].indexOf(view)} onSelect={(index) => setView((["design", "preview", "text"] as const)[index])} idPrefix="email-view">
          <TabsSubtleItem index={0} label="Design" />
          <TabsSubtleItem index={1} label="Preview" />
          <TabsSubtleItem index={2} label="Plain text" />
        </TabsSubtle>
        <div className="flex items-center gap-2">
          {test.error ? <span className="text-caption text-destructive">{test.error}</span> : testSent ? <span className="text-caption text-muted-foreground">Test sent to your email.</span> : null}
          <Button
            type="button"
            size="compact"
            variant="secondary"
            loading={test.pending || exporting}
            onClick={() => {
              setTestSent(false);
              test.run(() => sendTemplateTest({ subject: subject.value ?? "", html: html.value ?? "", text: text.value ?? "" }), () => setTestSent(true));
            }}
          >
            Send a test to me
          </Button>
        </div>
      </div>

      {/* Hidden, not unmounted, so the editor keeps its undo history while the preview shows. */}
      <div className={view === "design" ? "grid gap-3" : "hidden"}>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Blocks">
          {BLOCKS.map((block, index) => (
            <button
              key={block.title}
              type="button"
              draggable
              onDragStart={(event) => onDragStart(event, { kind: "block", index })}
              onClick={() => insertRef.current?.({ kind: "block", index })}
              title={`${block.description}. Click to add at the cursor, or drag onto the email.`}
              className="inline-flex h-8 cursor-grab items-center gap-1.5 rounded-lg border bg-card px-2.5 text-caption text-foreground hover:bg-accent/50 active:cursor-grabbing [&_svg]:size-3.5"
            >
              {block.icon}
              {block.title}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          {MERGE_FIELDS.map((field) => (
            <button
              key={field.key}
              type="button"
              draggable
              onDragStart={(event) => onDragStart(event, { kind: "merge", key: field.key })}
              onClick={() => insertRef.current?.({ kind: "merge", key: field.key })}
              title={`Inserts {{${field.key}}}, filled in when the email is sent`}
              className="inline-flex h-8 cursor-grab items-center rounded-lg border border-dashed bg-transparent px-2.5 text-caption text-muted-foreground hover:text-foreground"
            >
              {field.label}
            </button>
          ))}
        </div>

        <div
          className="mb-email-canvas grid min-h-[560px] grid-cols-[minmax(0,1fr)_240px] overflow-hidden rounded-xl border"
          onDragOverCapture={(event) => {
            if (isOurs(event)) event.preventDefault();
          }}
          onDropCapture={(event) => {
            if (!isOurs(event)) return;
            event.preventDefault();
            event.stopPropagation();
            insertRef.current?.(JSON.parse(event.dataTransfer.getData(DRAG_TYPE)) as Insert, { x: event.clientX, y: event.clientY });
          }}
        >
          <EmailEditor
            ref={editorRef}
            content={initial}
            theme={MONEYBEE_EMAIL_THEME}
            placeholder="Write the email, or type / for blocks"
            onUpdate={onUpdate}
            onReady={(ref) => {
              if (!html.value) exportNow(ref, true);
            }}
            onUploadImage={uploadImage}
            className="mb-email-surface min-w-0 overflow-y-auto px-10 py-8"
          >
            <EditorChrome onInsertReady={registerInsert} />
            <Inspector.Root className="mb-email-inspector col-start-2 row-start-1 overflow-y-auto border-l p-4">
              <Inspector.Breadcrumb />
              <Inspector.Document />
              <Inspector.Node />
              <Inspector.Text />
            </Inspector.Root>
          </EmailEditor>
        </div>
      </div>

      {view === "preview" ? (
        <div className="grid gap-3">
          <div className="flex gap-1">
            {(["desktop", "phone"] as const).map((option) => (
              <button key={option} type="button" onClick={() => setDevice(option)} className={`h-7 cursor-pointer rounded-md border-0 px-2.5 text-caption ${device === option ? "bg-accent text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}>
                {option === "desktop" ? "Desktop" : "Phone"}
              </button>
            ))}
          </div>
          <div className="flex justify-center rounded-xl border bg-muted p-6">
            <iframe title="Email preview" srcDoc={html.value ?? ""} className="h-[720px] rounded-lg border bg-white" style={{ width: device === "desktop" ? 680 : 375 }} />
          </div>
        </div>
      ) : null}

      {view === "text" ? (
        <pre className="m-0 min-h-60 rounded-xl border bg-card p-5 text-body whitespace-pre-wrap text-foreground">{text.value || "Nothing yet."}</pre>
      ) : null}
    </div>
  );
};
