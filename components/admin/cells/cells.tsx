"use client";

import { FileText, Globe } from "lucide-react";
import Link from "next/link";
import type { DefaultCellComponentProps } from "payload";
import type { ReactNode } from "react";
import { Badge } from "@/components/fluid/badge";

/*
 * List cells for the Website lists (admin-ergonomics plan C): badges and
 * pictures where Payload prints raw text. Set as `admin.components.Cell` on
 * the field in collections/Documents.ts, Openings.ts, TeamMembers.ts and
 * CaseStudies.ts. A first-column cell carries the link to the record itself.
 */

/**
 * The first column's link to the record, as Payload's own cell draws it.
 * Payload does not hand a custom first-column cell its link, so it is built
 * from the row.
 */
function Linked({ collectionSlug, columnIndex, linkURL, rowData, children }: Pick<DefaultCellComponentProps, "collectionSlug" | "columnIndex" | "linkURL" | "rowData"> & { children: ReactNode }) {
  const href = linkURL ?? (columnIndex === 0 || columnIndex === undefined ? `/admin/collections/${collectionSlug}/${rowData.id}` : null);
  return href ? (
    <Link href={href} prefetch={false}>
      {children}
    </Link>
  ) : (
    children
  );
}

/** People › Name: opens the person's screen (/admin/people/:id), not the data form. */
export function ContactNameCell({ cellData, rowData }: DefaultCellComponentProps) {
  return (
    <Link href={`/admin/people/${rowData.id}`} prefetch={false}>
      {String(cellData ?? "Unnamed")}
    </Link>
  );
}

/** Client accounts › Status: Invited until their first sign-in, then Active; Disabled when switched off. */
export function InvestorStatusCell({ rowData }: DefaultCellComponentProps) {
  const status = rowData.status === "disabled" ? "Disabled" : rowData.invitedAt && !rowData.lastSignInAt ? "Invited" : "Active";
  return (
    <span className="fluid">
      <Badge variant="dot" color={status === "Active" ? "green" : status === "Invited" ? "amber" : "gray"} size="compact">
        {status}
      </Badge>
    </span>
  );
}

/** Documents › File: a PDF or a web address, or an amber No file. */
export function FileCell({ cellData, rowData }: DefaultCellComponentProps) {
  const link = typeof rowData.link === "string" && rowData.link.trim() !== "";
  return (
    <span className="fluid">
      {cellData ? (
        <Badge variant="solid" color="gray" size="compact">
          <span className="inline-flex items-center gap-1">
            <FileText aria-hidden="true" className="h-3 w-3" />
            PDF
          </span>
        </Badge>
      ) : link ? (
        <Badge variant="solid" color="gray" size="compact">
          <span className="inline-flex items-center gap-1">
            <Globe aria-hidden="true" className="h-3 w-3" />
            Web page
          </span>
        </Badge>
      ) : (
        <Badge variant="dot" color="amber" size="compact">
          No file
        </Badge>
      )}
    </span>
  );
}

/** Documents › Dated: the date as the card prints it, or Date to follow. */
export function DateCell({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return <span className="fluid text-muted-foreground">Date to follow</span>;
  return <span>{new Date(String(cellData)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</span>;
}

/** Openings › Kind: Live, Sample or Closed. */
const KINDS = { live: { label: "Live", color: "green" }, sample: { label: "Sample", color: "gray" }, closed: { label: "Closed", color: "red" } } as const;

export function KindCell({ cellData }: DefaultCellComponentProps) {
  const kind = KINDS[cellData as keyof typeof KINDS] ?? KINDS.sample;
  return (
    <span className="fluid">
      <Badge variant="dot" color={kind.color} size="compact">
        {kind.label}
      </Badge>
    </span>
  );
}

/** Team › Name: the portrait beside the name, in grey as the carousel shows it. */
export function PersonCell({ cellData, rowData, collectionSlug, columnIndex, linkURL }: DefaultCellComponentProps) {
  const photo = typeof rowData.photo === "object" && rowData.photo?.url ? String(rowData.photo.url) : typeof rowData.photoPath === "string" ? rowData.photoPath : "";
  return (
    <span className="fluid inline-flex items-center gap-2.5">
      {photo ? (
        <img src={photo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover grayscale" />
      ) : (
        <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full bg-muted" />
      )}
      <Linked collectionSlug={collectionSlug} columnIndex={columnIndex} linkURL={linkURL} rowData={rowData}>
        {String(cellData ?? "")}
      </Linked>
    </span>
  );
}

/** Case studies › Company: the initials badge beside the name, as the page draws it. */
export function CompanyCell({ cellData, rowData, collectionSlug, columnIndex, linkURL }: DefaultCellComponentProps) {
  return (
    <span className="fluid inline-flex items-center gap-2.5">
      <span aria-hidden="true" className="grid h-8 min-w-8 shrink-0 place-items-center rounded-md border px-1 text-caption font-semibold text-foreground">
        {String(rowData.mark ?? "")}
      </span>
      <Linked collectionSlug={collectionSlug} columnIndex={columnIndex} linkURL={linkURL} rowData={rowData}>
        {String(cellData ?? "")}
      </Linked>
    </span>
  );
}
