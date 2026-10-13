"use client";

import { CircleCheck, FileText, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ClipboardEvent, type DragEvent, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { correctSheet, moveSheet, saveSheet, type SheetInput, type SheetResult } from "@/lib/fact-sheets/actions";
import { lastDay, type Month, shiftMonth } from "@/lib/fact-sheets/month";
import { type Period, RETURN, WEALTH } from "@/lib/figure-limits";

export type ScreenMode = "edit" | "waiting" | "review" | "published" | "superseded";

type Row = { period: Period; label: string; ours: string; benchmark: string };
type Column = "ours" | "benchmark";

export type ScreenData = {
  id: number | null;
  mode: ScreenMode;
  products: { id: number; name: string; kind: "pms" | "aif"; benchmark: string }[];
  productId: number;
  month: Month;
  monthName: string;
  rows: Row[];
  wealth: { ours: string; benchmark: string };
  sectors: { name: string; weight: string }[];
  pdf: { id: number; url: string; filename: string } | null;
  correctionReason: string;
  reviewNote: string;
  /** A sheet for this month is already published, so this one replaces it and needs a reason. */
  needsReason: boolean;
  /** The sheet the numbers are checked against: the month before, or the published one a correction replaces. */
  compare: { monthName: string; rows: Partial<Record<Period, { ours: number | null; benchmark: number | null }>>; wealth: { ours: number | null; benchmark: number | null } } | null;
  submittedBy: string | null;
  publishedSameMonthId: number | null;
};

const SHEETS = "/admin/collections/fact-sheets";
/** A return that moved more than this many points from the month before is worth a second look. */
const FAR = 8;
const STATUS: Record<ScreenMode, { label: string; color: "gray" | "orange" | "green" | "blue" }> = {
  edit: { label: "Draft", color: "gray" },
  waiting: { label: "Waiting for approval", color: "orange" },
  review: { label: "Waiting for your approval", color: "orange" },
  published: { label: "On the site", color: "green" },
  superseded: { label: "Replaced by a correction", color: "gray" },
};

/** A typed or pasted number: "−7.45 %" reads as -7.45, an empty box as null, anything else as NaN. */
function parse(value: string): number | null {
  const cleaned = value.replace(/[%,\s]/g, "").replace(/[−–]/g, "-");
  return cleaned === "" ? null : Number(cleaned);
}

const shown = (value: number | null | undefined) => (value === null || value === undefined ? "none" : value.toFixed(2));

type Check = "bad" | "far" | null;

function checkReturn(value: string, before: number | null | undefined): Check {
  const n = parse(value);
  if (n === null) return null;
  if (!Number.isFinite(n) || n < RETURN.min || n > RETURN.max) return "bad";
  return typeof before === "number" && Math.abs(n - before) > FAR ? "far" : null;
}

function checkWealth(value: string, before: number | null | undefined): Check {
  const n = parse(value);
  if (n === null) return null;
  if (!Number.isFinite(n) || n < WEALTH.min || n > WEALTH.max) return "bad";
  return typeof before === "number" && before > 0 && Math.abs(n - before) / before > 0.2 ? "far" : null;
}

const ARROW = "h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent text-title text-foreground hover:bg-hover";
const BOX = "h-9 w-[7.5rem] rounded-lg border bg-background pr-7 pl-2.5 text-right text-body tabular-nums text-foreground outline-none focus:border-[#F6A11A] disabled:opacity-100";
const TONE: Record<Exclude<Check, null>, string> = { bad: "border-[#e5484d]", far: "border-[#f2b441]" };

/** One box of the grid, with the unit inside it and the comparison month's number under it. */
function Box({ value, onChange, onPaste, check, unit, before, beforeLabel, readOnly, label }: {
  value: string;
  onChange?: (value: string) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  check: Check;
  unit: string;
  before: string | null;
  beforeLabel: string;
  readOnly: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <label className="relative">
        <span className="sr-only">{label}</span>
        <input
          value={value}
          inputMode="decimal"
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          onPaste={onPaste}
          className={`${BOX} ${unit.length > 1 ? "pr-10" : ""} ${check ? TONE[check] : "border-border"} ${readOnly ? "cursor-default bg-transparent" : ""}`}
        />
        <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-caption text-muted-foreground">{unit}</span>
      </label>
      {before !== null ? <span className={`text-[11px] tabular-nums ${check === "far" ? "text-[#f2b441]" : "text-muted-foreground/70"}`}>{beforeLabel} {before}</span> : null}
    </div>
  );
}

/** Scales the site preview, a 1440px-wide page, down to the width of its column. */
function useFit(width = 1440) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  return [ref, scale] as const;
}

/**
 * The fact sheet screen (components/admin/fact-sheet/fact-sheet-view.tsx loads
 * it). One layout in every state: the PDF, the grid, the site's graphs. Only
 * the buttons change: a draft is sent to compliance, compliance approves or
 * sends back, a published month can be corrected.
 */
export function FactSheetScreen({ data }: { data: ScreenData }) {
  const router = useRouter();
  const [rows, setRows] = useState(data.rows);
  const [wealth, setWealth] = useState(data.wealth);
  const [sectors, setSectors] = useState(data.sectors);
  const [pdf, setPdf] = useState(data.pdf);
  const [reason, setReason] = useState(data.correctionReason);
  const [note, setNote] = useState("");
  const [sendingBack, setSendingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const preview = useRef<HTMLIFrameElement>(null);
  const [fitRef, scale] = useFit();

  const editable = data.mode === "edit";
  const product = data.products.find((p) => p.id === data.productId) ?? data.products[0];
  const compare = data.compare;

  const setCell = (index: number, column: Column, value: string) => setRows((current) => current.map((row, i) => (i === index ? { ...row, [column]: value } : row)));

  /**
   * Pasting several numbers fills the boxes below; two numbers on a line fill
   * both columns. A blank line, N/A or a dash keeps its row and leaves it
   * empty, so a period the PDF has no figure for does not shift the rest up.
   */
  const pasteInto = (index: number, column: Column) => (event: ClipboardEvent<HTMLInputElement>) => {
    const lines = event.clipboardData
      .getData("text")
      .replace(/\s+$/, "")
      .split(/\r?\n/)
      .map((line) =>
        line
          .trim()
          .split(/\t|\s{2,}/)
          .map((cell) => cell.trim())
          .filter((cell) => cell === "" || /^(n\/?a|-|\u2013|\u2014)$/i.test(cell) || Number.isFinite(parse(cell) ?? Number.NaN))
          .map((cell) => (/^(n\/?a|-|\u2013|\u2014)$/i.test(cell) ? "" : cell)),
      );
    if (lines.length < 2 && (lines[0]?.length ?? 0) < 2) return;
    event.preventDefault();
    setRows((current) =>
      current.map((row, i) => {
        const cells = lines[i - index];
        if (i < index || !cells) return row;
        return column === "ours" && cells.length > 1 ? { ...row, ours: cells[0], benchmark: cells[1] } : column === "ours" && cells.length === 1 && cells[0] === "" ? { ...row, ours: "", benchmark: "" } : { ...row, [column]: cells[0] ?? "" };
      }),
    );
  };

  const checks = rows.flatMap((row) => [checkReturn(row.ours, compare?.rows[row.period]?.ours), checkReturn(row.benchmark, compare?.rows[row.period]?.benchmark)]).concat([checkWealth(wealth.ours, compare?.wealth.ours), checkWealth(wealth.benchmark, compare?.wealth.benchmark)]);
  const bad = checks.filter((check) => check === "bad").length;
  const far = checks.filter((check) => check === "far").length;
  const empty = rows.flatMap((row) => [row.ours, row.benchmark]).filter((value) => value.trim() === "").length;
  const filled = rows.length * 2 - empty;
  const missingReason = data.needsReason && reason.trim() === "";

  const figures = useCallback(() => {
    const value = (text: string) => {
      const n = parse(text);
      return n !== null && Number.isFinite(n) ? n : null;
    };
    return {
      rows: rows.map((row) => ({ period: row.label, short: row.period, ours: value(row.ours), benchmark: value(row.benchmark) })),
      wealth: { start: 1, ours: value(wealth.ours) ?? 0, benchmark: value(wealth.benchmark) ?? 0 },
      asOf: lastDay(data.month),
    };
  }, [rows, wealth, data.month]);

  // The preview frame asks for the figures once loaded; after that each change is posted.
  const post = useCallback(() => {
    preview.current?.contentWindow?.postMessage({ source: "mb-figures", kind: product.kind, figures: figures() }, window.location.origin);
  }, [figures, product.kind]);
  useEffect(() => {
    post();
    const onReady = (event: MessageEvent) => {
      if (event.origin === window.location.origin && (event.data as { source?: string })?.source === "mb-figures-ready") post();
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, [post]);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") return setError("The fact sheet has to be a PDF.");
    setUploading(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    body.append("_payload", JSON.stringify({ alt: `${product.name} fact sheet, ${data.monthName}` }));
    const response = await fetch("/api/media", { method: "POST", body, credentials: "include" }).catch(() => null);
    setUploading(false);
    if (!response?.ok) return setError("The PDF did not upload. Try again.");
    const { doc } = (await response.json()) as { doc: { id: number; url: string; filename: string } };
    setPdf({ id: doc.id, url: doc.url, filename: doc.filename });
  };

  const run = (action: () => Promise<SheetResult>) =>
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.ok) return setError(result.error);
      if (result.id === data.id) router.refresh();
      else router.push(`${SHEETS}/${result.id}`);
    });

  const input = (): SheetInput => ({
    id: data.id,
    product: product.id,
    month: data.month,
    returns: rows.map((row) => {
      const ours = parse(row.ours);
      const benchmark = parse(row.benchmark);
      return { period: row.period, ours: Number.isFinite(ours) ? ours : null, benchmark: Number.isFinite(benchmark) ? benchmark : null };
    }),
    wealth: { ours: parse(wealth.ours), benchmark: parse(wealth.benchmark) },
    sectors: sectors.filter((s) => s.name.trim() !== "" && Number.isFinite(parse(s.weight))).map((s) => ({ name: s.name.trim(), weight: parse(s.weight) ?? 0 })),
    pdf: pdf?.id ?? null,
    correctionReason: reason.trim(),
  });

  const pick = (productId: number, month: Month) => router.push(`${SHEETS}/create?product=${productId}&month=${month}`);
  const title = data.id ? `${product.name}, ${data.monthName}` : "Add a month's numbers";
  const before = (value: number | null | undefined) => (compare ? shown(value) : null);
  const beforeLabel = compare?.monthName.split(" ")[0] ?? "";

  return (
    <div className="mt-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">{title}</h1>
          <p className="mt-1 max-w-[70ch] text-body text-muted-foreground">
            {
              {
                edit: "Copy the numbers from the fact sheet into the grid. Compliance checks them against the PDF before they go on the site.",
                waiting: `With compliance${data.submittedBy ? `, sent by ${data.submittedBy}` : ""}. It goes on the site once someone from compliance approves it.`,
                review: `Check each number against the PDF.${compare ? ` Numbers that moved a lot since ${compare.monthName} are marked.` : ""} Approving puts them on the site.`,
                published: "On the site. A published month never changes; correct it with a new version if something is wrong.",
                superseded: "A corrected version replaced this one on the site.",
              }[data.mode]
            }
          </p>
          <Link href="/admin/guide#fact-sheets" className="mt-1 inline-block text-caption text-muted-foreground underline underline-offset-2 hover:text-foreground">
            New to fact sheets? How they work
          </Link>
        </div>
        {data.id ? (
          <Badge variant="dot" color={STATUS[data.mode].color}>
            {STATUS[data.mode].label}
          </Badge>
        ) : null}
      </header>

      {!data.id ? (
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_18rem]">
          {data.products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p.id, data.month)}
              className={`cursor-pointer rounded-xl border bg-card p-4 text-left ${p.id === product.id ? "border-[#F6A11A] shadow-[inset_0_0_0_1px_#F6A11A]" : "border-border hover:bg-hover"}`}
            >
              <span className="block text-body font-semibold text-foreground">{p.name}</span>
              <span className="text-caption text-muted-foreground">{p.kind === "pms" ? "PMS strategy" : "AIF scheme"}, against the {p.benchmark}</span>
            </button>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-2">
            <button type="button" aria-label="Month before" onClick={() => pick(product.id, shiftMonth(data.month, -1))} className={ARROW}>
              ‹
            </button>
            <span className="text-center">
              <span className="block text-title font-semibold text-foreground">{data.monthName}</span>
              <span className="text-caption text-muted-foreground">Figures as of {Number(lastDay(data.month).slice(8))} {data.monthName.split(" ")[0].slice(0, 3)}</span>
            </span>
            <button type="button" aria-label="Month after" onClick={() => pick(product.id, shiftMonth(data.month, 1))} className={ARROW}>
              ›
            </button>
          </div>
        </div>
      ) : null}

      {data.mode === "edit" && data.reviewNote ? (
        <p className="mt-6 rounded-xl border border-[#f2b441]/40 bg-[#f2b441]/10 px-4 py-3 text-body text-foreground">
          <b className="font-semibold">Compliance sent this back:</b> {data.reviewNote}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-[#e5484d]/40 bg-[#e5484d]/10 px-4 py-3 text-body text-foreground">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,20rem)_minmax(0,27rem)_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-body font-semibold text-foreground">
            <Step n={1} /> The fact sheet PDF
          </h2>
          {pdf ? (
            <>
              <p className="mt-2 flex items-center justify-between gap-2 text-caption text-muted-foreground">
                <a href={pdf.url} target="_blank" rel="noreferrer" className="truncate text-foreground underline underline-offset-2">
                  {pdf.filename}
                </a>
                {editable ? (
                  <button type="button" className="shrink-0 cursor-pointer text-foreground underline underline-offset-2" onClick={() => setPdf(null)}>
                    Change
                  </button>
                ) : null}
              </p>
              <iframe title="The fact sheet PDF" src={pdf.url} className="mt-3 h-[34rem] w-full rounded-lg border border-border bg-white" />
            </>
          ) : editable ? (
            <PdfDrop uploading={uploading} onFile={upload} />
          ) : (
            <p className="mt-3 text-caption text-muted-foreground">No PDF was added.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-body font-semibold text-foreground">
            <Step n={2} /> The numbers
          </h2>
          <table className="mt-3 w-full border-collapse">
            <thead>
              <tr className="text-caption text-muted-foreground">
                <th className="pb-2 text-left font-normal" />
                <th className="pb-2 text-right font-normal">{product.name}</th>
                <th className="pb-2 text-right font-normal">{product.benchmark}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.period} className="border-t border-border">
                  <td className="py-2 pr-2 align-top text-caption text-muted-foreground">
                    <span className="inline-block pt-2">{row.label}</span>
                  </td>
                  {(["ours", "benchmark"] as const).map((column) => (
                    <td key={column} className="py-2 pl-2 align-top">
                      <Box
                        label={`${row.label}, ${column === "ours" ? product.name : product.benchmark}`}
                        value={row[column]}
                        onChange={(value) => setCell(index, column, value)}
                        onPaste={pasteInto(index, column)}
                        check={editable || data.mode === "review" ? checkReturn(row[column], compare?.rows[row.period]?.[column]) : null}
                        unit="%"
                        before={before(compare?.rows[row.period]?.[column])}
                        beforeLabel={beforeLabel}
                        readOnly={!editable}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="py-2 pr-2 align-top text-caption text-muted-foreground">
                  <span className="inline-block pt-2">Rs. 1 Mn grew to</span>
                </td>
                {(["ours", "benchmark"] as const).map((column) => (
                  <td key={column} className="py-2 pl-2 align-top">
                    <Box
                      label={`Rs. 1 Mn grew to, ${column === "ours" ? product.name : product.benchmark}`}
                      value={wealth[column]}
                      onChange={(value) => setWealth((current) => ({ ...current, [column]: value }))}
                      check={editable || data.mode === "review" ? checkWealth(wealth[column], compare?.wealth[column]) : null}
                      unit="Mn"
                      before={before(compare?.wealth[column])}
                      beforeLabel={beforeLabel}
                      readOnly={!editable}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {(editable || data.mode === "review") && far > 0 ? (
            <p className="mt-3 rounded-lg bg-[#f2b441]/10 px-3 py-2 text-caption text-[#f2b441]">
              {far === 1 ? "One number" : `${far} numbers`} moved a lot since {compare?.monthName}. Check {far === 1 ? "it" : "them"} against the PDF.
            </p>
          ) : null}
          {editable && bad > 0 ? <p className="mt-3 rounded-lg bg-[#e5484d]/10 px-3 py-2 text-caption text-[#e5484d]">A box has something that is not a possible number.</p> : null}
          {editable ? <p className="mt-3 text-caption text-muted-foreground">Leave a box empty if the period has not run; the site prints N/A. You can paste a whole column from the PDF.</p> : null}
          <Sectors sectors={sectors} editable={editable} onChange={setSectors} />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-body font-semibold text-foreground">
            <Step n={3} /> How the site will look
          </h2>
          <div ref={fitRef} className="mt-3 overflow-hidden rounded-lg border border-border bg-white" style={{ height: 1460 * scale }}>
            <iframe
              ref={preview}
              title="The site's graphs with these numbers"
              src="/live-preview/figures"
              onLoad={post}
              className="origin-top-left border-0"
              style={{ width: 1440, height: 1460, transform: `scale(${scale})` }}
            />
          </div>
          <p className="mt-2 text-caption text-muted-foreground">{product.kind === "pms" ? "The Performance section on the Home page, drawn from the boxes." : "The returns as the site would draw them."}</p>
        </section>
      </div>

      {editable && data.needsReason ? (
        <label className="mt-5 block rounded-xl border border-border bg-card p-4">
          <span className="text-body font-semibold text-foreground">What was wrong with the published {data.monthName}?</span>
          <span className="mt-1 block text-caption text-muted-foreground">This replaces the month already on the site, so compliance needs to know why.</span>
          <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} className="mt-3 w-full rounded-lg border border-border bg-background p-2.5 font-[inherit] text-body text-foreground outline-none focus:border-[#F6A11A]" />
        </label>
      ) : null}

      <footer className="sticky bottom-0 z-10 mt-6 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 backdrop-blur">
        {editable ? (
          // Three checks as chips: how full the grid is, numbers that moved far, and the PDF.
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="solid" color={filled === rows.length * 2 ? "green" : "gray"}>
              <span className="inline-flex items-center gap-1">
                <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />
                {filled} of {rows.length * 2} filled{empty ? `, ${empty} N/A` : ""}
              </span>
            </Badge>
            <Badge variant="solid" color={far ? "amber" : "gray"}>
              <span className="inline-flex items-center gap-1">
                <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" />
                {far ? `${far} to check` : "Nothing to check"}
              </span>
            </Badge>
            <Badge variant="solid" color={pdf ? "green" : "amber"}>
              <span className="inline-flex items-center gap-1">
                <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                {pdf ? "PDF attached" : "No PDF yet"}
              </span>
            </Badge>
          </div>
        ) : (
          <p className="text-caption text-muted-foreground">{data.mode === "review" ? "Approve only once every number matches the PDF." : STATUS[data.mode].label}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {editable ? (
            <>
              <Button variant="secondary" loading={pending} onClick={() => run(() => saveSheet(input(), false))}>
                Save and finish later
              </Button>
              <Button loading={pending} disabled={bad > 0 || filled === 0 || missingReason} onClick={() => run(() => saveSheet(input(), true))}>
                Send to compliance
              </Button>
            </>
          ) : null}
          {data.mode === "waiting" && data.id !== null ? (
            <Button variant="secondary" loading={pending} onClick={() => run(() => moveSheet(data.id as number, "draft"))}>
              Take it back to change it
            </Button>
          ) : null}
          {data.mode === "review" && data.id !== null ? (
            sendingBack ? (
              <>
                <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="What needs fixing" className="h-9 w-72 rounded-lg border border-border bg-background px-2.5 text-body text-foreground outline-none focus:border-[#F6A11A]" />
                <Button variant="secondary" loading={pending} disabled={note.trim() === ""} onClick={() => run(() => moveSheet(data.id as number, "draft", note.trim()))}>
                  Send back
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setSendingBack(true)}>
                  Send back
                </Button>
                <Button loading={pending} onClick={() => run(() => moveSheet(data.id as number, "published"))}>
                  Approve and publish
                </Button>
              </>
            )
          ) : null}
          {data.mode === "published" && data.id !== null ? (
            <Button variant="secondary" loading={pending} onClick={() => run(() => correctSheet(data.id as number))}>
              Correct this month
            </Button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#F6A11A] text-[12px] font-bold text-black">{n}</span>;
}

/** A drop zone for the PDF that also opens the file picker. */
function PdfDrop({ uploading, onFile }: { uploading: boolean; onFile: (file: File | undefined) => void }) {
  const [over, setOver] = useState(false);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setOver(false);
    onFile(event.dataTransfer.files[0]);
  };
  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`mt-3 flex h-[34rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center ${over ? "border-[#F6A11A] bg-[#F6A11A]/5" : "border-border"}`}
    >
      <span className="text-body font-medium text-foreground">{uploading ? "Uploading…" : "Drop the month's fact sheet here"}</span>
      <span className="text-caption text-muted-foreground">or click to choose the PDF. It stays open here while you copy the numbers.</span>
      <input type="file" accept="application/pdf" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
    </label>
  );
}

/** The optional top sectors: a short list of names and weights. */
function Sectors({ sectors, editable, onChange }: { sectors: ScreenData["sectors"]; editable: boolean; onChange: (sectors: ScreenData["sectors"]) => void }) {
  const [open, setOpen] = useState(sectors.length > 0);
  if (!editable && sectors.length === 0) return null;
  return (
    <div className="mt-4 border-t border-border pt-3">
      <button type="button" onClick={() => setOpen(!open)} className="cursor-pointer text-caption text-muted-foreground hover:text-foreground">
        Top sectors (optional) {open ? "▾" : "▸"}
      </button>
      {open ? (
        <div className="mt-2 grid gap-2">
          {sectors.map((sector, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={sector.name}
                readOnly={!editable}
                placeholder="Sector"
                onChange={(event) => onChange(sectors.map((s, i) => (i === index ? { ...s, name: event.target.value } : s)))}
                className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 text-body text-foreground outline-none focus:border-[#F6A11A]"
              />
              <label className="relative">
                <span className="sr-only">Weight</span>
                <input
                  value={sector.weight}
                  readOnly={!editable}
                  inputMode="decimal"
                  onChange={(event) => onChange(sectors.map((s, i) => (i === index ? { ...s, weight: event.target.value } : s)))}
                  className={`${BOX} w-24 border-border`}
                />
                <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-caption text-muted-foreground">%</span>
              </label>
              {editable ? (
                <Button variant="ghost" size="icon-compact" aria-label={`Remove ${sector.name || "sector"}`} onClick={() => onChange(sectors.filter((_, i) => i !== index))}>
                  ×
                </Button>
              ) : null}
            </div>
          ))}
          {editable && sectors.length < 10 ? (
            <Button variant="ghost" size="compact" className="w-fit" onClick={() => onChange([...sectors, { name: "", weight: "" }])}>
              Add a sector
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
