"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { SeverityBadge } from "@/components/admin/severity-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/fluid/table";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { istDateTime, relative } from "@/lib/crm/format";
import { INBOX_TABS, type InboxRow, type InboxTab } from "@/lib/crm/inbox-tabs";
import { ScreenIntro } from "@/components/admin/screen-intro";

/** Reloads the list this often, so new enquiries and the deadlines stay current while the screen is open. */
const REFRESH_MS = 60_000;

/**
 * The inbox list. Tabs narrow it; a row opens the enquiry. Arrow keys or j/k
 * move between rows and Enter opens one, so a desk can be worked from the
 * keyboard.
 */
export function InboxScreen({ tab, rows, counts }: { tab: InboxTab; rows: InboxRow[]; counts: Record<InboxTab, number> }) {
  const router = useRouter();
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const now = new Date();
  const overdue = rows.filter((row) => row.overdue).length;

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  const open = (row: InboxRow) => router.push(`/admin/inbox/${row.id}`);
  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, index: number) => {
    const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[event.key];
    if (step) {
      event.preventDefault();
      rowRefs.current[Math.min(Math.max(index + step, 0), rows.length - 1)]?.focus();
    } else if (event.key === "Enter") open(rows[index]);
  };

  return (
    <>
      <header className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Enquiries</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {counts.waiting === 0 ? "Nothing is waiting on us." : `${counts.waiting} waiting on us.`}
            {tab === "waiting" && overdue > 0 ? ` ${overdue} ${overdue === 1 ? "is" : "are"} past the reply time.` : ""}
          </p>
          <ScreenIntro screen="enquiries" />
        </div>
        <TabsSubtle selectedIndex={INBOX_TABS.findIndex(({ key }) => key === tab)} onSelect={(index) => router.push(`/admin/inbox?tab=${INBOX_TABS[index].key}`)} idPrefix="inbox">
          {INBOX_TABS.map(({ key, label }, index) => (
            <TabsSubtleItem key={key} index={index} label={counts[key] ? `${label} ${counts[key]}` : label} />
          ))}
        </TabsSubtle>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed px-6 py-10 text-center text-body text-muted-foreground">No enquiries here.</p>
      ) : (
        <Table aria-label="Enquiries">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Severity</TableHead>
              <TableHead>From</TableHead>
              <TableHead>About</TableHead>
              <TableHead className="w-[150px]">Received</TableHead>
              <TableHead className="w-[170px]">{tab === "closed" ? "Status" : "Reply by"}</TableHead>
              <TableHead className="w-[160px]">Taken by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                index={index}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                tabIndex={0}
                onClick={() => open(row)}
                onKeyDown={(event) => onRowKey(event, index)}
                className="cursor-pointer outline-none focus-visible:[&>td]:text-foreground"
              >
                <TableCell>
                  <SeverityBadge severity={row.severity} size="compact" />
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{row.name}</span>
                  <span className="ml-2 text-caption text-muted-foreground tabular-nums">{row.reference}</span>
                </TableCell>
                <TableCell>
                  {row.kindLabel}
                  {row.detail ? <span className="text-muted-foreground">, {row.detail}</span> : null}
                </TableCell>
                <TableCell className="tabular-nums" title={istDateTime(row.receivedAt)}>
                  {relative(row.receivedAt, now)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {tab === "closed" ? (
                    row.statusLabel
                  ) : row.overdue && row.dueAt ? (
                    <span className="text-destructive">Overdue {relative(row.dueAt, now).replace(" ago", "")}</span>
                  ) : row.dueAt ? (
                    <span title={istDateTime(row.dueAt)}>{relative(row.dueAt, now)}</span>
                  ) : (
                    "No deadline"
                  )}
                </TableCell>
                <TableCell>{row.assignee ?? <span className="text-muted-foreground">Nobody yet</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
