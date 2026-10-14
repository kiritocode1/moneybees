"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useRef } from "react";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/fluid/table";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { istDateTime, relative } from "@/lib/crm/format";
import { HIRING_TABS, type HiringRow, type Stage } from "@/lib/hiring/stages";

const ALL = "all";

/**
 * The hiring list. Tabs are the stages, the select narrows it to one role,
 * and a row opens the applicant. Arrow keys or j/k move between rows and
 * Enter opens one, as in Enquiries.
 */
export function HiringScreen({
  tab,
  role,
  rows,
  counts,
  roles,
  interviewsThisWeek,
  resumesStored,
}: {
  tab: Stage;
  role: string;
  rows: HiringRow[];
  counts: Record<Stage, number>;
  roles: { value: string; label: string }[];
  interviewsThisWeek: number;
  resumesStored: boolean;
}) {
  const router = useRouter();
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const now = new Date();
  const go = (next: { tab?: Stage; role?: string }) => {
    const params = new URLSearchParams({ tab: next.tab ?? tab });
    const chosen = next.role ?? role;
    if (chosen && chosen !== ALL) params.set("role", chosen);
    router.push(`/admin/hiring?${params}`);
  };
  const open = (row: HiringRow) => router.push(`/admin/hiring/${row.id}`);
  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, index: number) => {
    const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[event.key];
    if (step) {
      event.preventDefault();
      rowRefs.current[Math.min(Math.max(index + step, 0), rows.length - 1)]?.focus();
    } else if (event.key === "Enter") open(rows[index]);
  };
  const summary = [
    counts.new === 0 ? "No new applications." : `${counts.new} new ${counts.new === 1 ? "application" : "applications"}.`,
    interviewsThisWeek ? `${interviewsThisWeek} ${interviewsThisWeek === 1 ? "interview" : "interviews"} in the next seven days.` : "",
  ].join(" ");

  return (
    <>
      <header className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Hiring</h1>
          <p className="mt-1 text-body text-muted-foreground">{summary}</p>
          {resumesStored ? null : <p className="mt-1 text-body text-destructive">Resumes are not being kept: private file storage is not connected, so the apply form asks for experience instead.</p>}
          <ScreenIntro screen="hiring" />
        </div>
        <TabsSubtle selectedIndex={HIRING_TABS.findIndex(({ key }) => key === tab)} onSelect={(index) => go({ tab: HIRING_TABS[index].key })} idPrefix="hiring">
          {HIRING_TABS.map(({ key, label }, index) => (
            <TabsSubtleItem key={key} index={index} label={counts[key] ? `${label} ${counts[key]}` : label} />
          ))}
        </TabsSubtle>
      </header>

      {roles.length ? (
        <div className="mb-4 w-72">
          <Select value={role || ALL} onValueChange={(value) => go({ role: value })} size="compact">
            <SelectTrigger placeholder="All roles" aria-label="Role" />
            <SelectContent>
              {[{ value: ALL, label: "All roles" }, ...roles].map((option, index) => (
                <SelectItem key={option.value} index={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed px-6 py-10 text-center text-body text-muted-foreground">No applications here.</p>
      ) : (
        <Table aria-label="Applications">
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[120px]">Must-haves</TableHead>
              <TableHead className="w-[130px]">Notice</TableHead>
              <TableHead className="w-[120px]">Applied</TableHead>
              <TableHead className="w-[160px]">{tab === "closed" ? "Why closed" : "With"}</TableHead>
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
                  <span className="text-foreground">{row.name}</span>
                  <span className="ml-2 text-caption text-muted-foreground tabular-nums">{row.reference}</span>
                </TableCell>
                <TableCell>
                  {row.role}
                  {row.team ? <span className="text-muted-foreground">, {row.team}</span> : null}
                </TableCell>
                <TableCell className="tabular-nums">
                  {row.mustHaves ? <span className={row.mustHaves.yes === row.mustHaves.of ? "text-success" : "text-foreground"}>{`${row.mustHaves.yes} of ${row.mustHaves.of}`}</span> : <span className="text-muted-foreground">None asked</span>}
                </TableCell>
                <TableCell>{row.notice}</TableCell>
                <TableCell className="tabular-nums" title={istDateTime(row.receivedAt)}>
                  {relative(row.receivedAt, now)}
                </TableCell>
                <TableCell>{tab === "closed" ? (row.closeReason ?? "") : (row.owner ?? <span className="text-muted-foreground">Nobody yet</span>)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
