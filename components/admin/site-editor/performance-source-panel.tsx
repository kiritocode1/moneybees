"use client";

import { Badge } from "@/components/fluid/badge";
import { Button } from "@/components/fluid/button";
import { formatReturn } from "@/lib/performance";

export type SheetSummary = {
  id: number;
  title: string;
  rows: { label: string; ours: number | null; benchmark: number | null }[];
  wealth: { ours: number | null; benchmark: number | null };
};

const SHEETS = "/admin/collections/fact-sheets";
const mn = (value: number | null) => (value === null ? "N/A" : `Rs. ${value} Mn`);

/** Drawn by performance-source.tsx: the numbers behind the section's graphs, and the way to change them. */
export function PerformanceSourcePanel({ live, waiting }: { live: SheetSummary | null; waiting: { id: number; title: string; inReview: boolean } | null }) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <p className="text-body font-semibold text-foreground">The graphs in this section</p>
      <p className="mt-1 text-caption text-muted-foreground">
        {live
          ? `They draw from the ${live.title} fact sheet. To change them, add next month's fact sheet. They change once compliance approves it.`
          : "No Moneybee PMS fact sheet is published, so they show the deck's July 2026 numbers. Add a fact sheet to change them."}
      </p>
      {live ? (
        <table className="mt-3 w-full border-collapse text-caption tabular-nums">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1 text-left font-normal" />
              <th className="py-1 text-right font-normal">Moneybee PMS</th>
              <th className="py-1 text-right font-normal">S&amp;P BSE 500 TRI</th>
            </tr>
          </thead>
          <tbody>
            {live.rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="py-1.5 text-muted-foreground">{row.label}</td>
                <td className="py-1.5 text-right text-foreground">{formatReturn(row.ours)}</td>
                <td className="py-1.5 text-right text-foreground">{formatReturn(row.benchmark)}</td>
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="py-1.5 text-muted-foreground">Rs. 1 Mn grew to</td>
              <td className="py-1.5 text-right text-foreground">{mn(live.wealth.ours)}</td>
              <td className="py-1.5 text-right text-foreground">{mn(live.wealth.benchmark)}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {waiting ? (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-caption text-foreground">
          <Badge variant="dot" color={waiting.inReview ? "orange" : "gray"} size="compact">
            {waiting.inReview ? "Waiting for approval" : "Draft"}
          </Badge>
          <a href={`${SHEETS}/${waiting.id}`} className="underline underline-offset-2">
            {waiting.title}
          </a>
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="compact">
          <a href={`${SHEETS}/create`} className="no-underline">Add a fact sheet</a>
        </Button>
        {live ? (
          <Button asChild size="compact" variant="secondary">
            <a href={`${SHEETS}/${live.id}`} className="no-underline">Open {live.title}</a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
