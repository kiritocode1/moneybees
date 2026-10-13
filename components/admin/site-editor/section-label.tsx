"use client";

import { useRowLabel } from "@payloadcms/ui";
import { Badge } from "@/components/fluid/badge";
import { isSectionKind, SECTION_KINDS } from "@/lib/pages/sections";

type Row = { blockType?: unknown; hidden?: boolean | null; heading?: string | null; quote?: string | null };

/**
 * A section's row in the page form: a picture of the section, its name in
 * full and the start of its heading, so staff recognise it without opening
 * it. Built for the narrow column beside the preview: the name wraps rather
 * than cuts off, and a hidden section says so on its own line.
 */
export function SectionLabel() {
  const { data } = useRowLabel<Row>();
  const kind = isSectionKind(data?.blockType) ? SECTION_KINDS[data.blockType] : null;
  const words = data?.heading || data?.quote;
  return (
    <span className="pointer-events-none flex min-w-0 items-center gap-3 py-1.5">
      {kind ? <img src={kind.picture} alt="" className="h-12 w-18 shrink-0 rounded-[6px] border border-border object-cover object-top" /> : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <b className="text-body leading-tight font-semibold text-foreground">{kind?.name ?? "Section"}</b>
        {words ? <span className="line-clamp-1 text-caption text-muted-foreground">{words}</span> : null}
        {data?.hidden ? (
          <Badge variant="dot" color="gray" size="compact" className="mt-1 w-fit">
            Hidden on the site
          </Badge>
        ) : null}
      </span>
    </span>
  );
}
