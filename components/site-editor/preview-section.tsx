"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, type LucideIcon, Pencil } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { type PreviewCommand, SECTION_KINDS, type SectionKind } from "@/lib/pages/sections";
import { useInAdminPreview, usePreviewScale } from "./use-in-admin-preview";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

/**
 * One icon button on the bar: the icon, and its name as a tooltip below it
 * and as the accessible name. Greyed out when the section cannot move that way.
 */
function BarButton({ icon: Icon, label, disabled, onClick }: { icon: LucideIcon; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`group/button relative inline-flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full text-black transition-colors duration-150 hover:bg-black/[.06] disabled:cursor-default disabled:text-black/25 disabled:hover:bg-transparent ${FOCUS}`}
    >
      <Icon aria-hidden="true" size={15} strokeWidth={1.75} />
      <span className="pointer-events-none absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 rounded-[5px] bg-black px-[7px] py-[3px] text-[11px] leading-[14px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100 group-focus-visible/button:opacity-100 group-disabled/button:hidden">
        {label}
      </span>
    </button>
  );
}

const send = (action: PreviewCommand["action"], index: number) =>
  window.parent.postMessage({ source: "mb-preview", action, index } satisfies PreviewCommand, window.location.origin);

/**
 * One section of a page with unpublished changes. Inside /admin's preview it
 * carries a bar with the section's name, Edit, and icon buttons to move it up
 * or down and hide or show it (each named in a tooltip), and a
 * click anywhere on it opens its fields (components/admin/site-editor/
 * preview-bridge.tsx does the work). Links inside do not navigate there, so
 * the preview stays on the page being edited. A hidden section shows greyed
 * out so it can be found and shown again. Outside the preview it renders as
 * the published page would.
 */
export function PreviewSection({ index, count, kind, hidden, children }: { index: number; count: number; kind: SectionKind; hidden: boolean; children: ReactNode }) {
  const inPreview = useInAdminPreview();
  // The bar and the hidden tag keep their size on screen however far the preview is zoomed out.
  const zoom = 1 / usePreviewScale();
  if (!inPreview) return hidden ? null : <>{children}</>;
  const { name } = SECTION_KINDS[kind];

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-preview-bar]")) return;
    // Buttons inside a section (an FAQ answer, say) keep working; links and plain areas open the fields.
    if (target.closest("button") && !target.closest("a")) return;
    event.preventDefault();
    event.stopPropagation();
    send("edit", index);
  };

  return (
    <div data-preview-section={index} className="group/preview relative cursor-pointer" onClickCapture={onClickCapture}>
      {/* The bar rides down a tall section so it stays in reach; it takes no height of its own. */}
      <div className="pointer-events-none sticky top-[84px] z-[60] h-0">
        <div
          data-preview-bar=""
          style={{ zoom }}
          className="pointer-events-auto absolute top-3 left-3 flex items-center gap-[2px] rounded-full border border-black/10 bg-white p-[3px] font-sans shadow-[0_4px_16px_rgba(0,0,0,.12)]"
        >
          <span className="pr-[8px] pl-[10px] text-[12px] leading-none font-semibold whitespace-nowrap text-black">{name}</span>
          <button
            type="button"
            className={`inline-flex h-[28px] cursor-pointer items-center gap-[5px] rounded-full bg-[#F6A11A] pr-[11px] pl-[9px] text-[12px] leading-none font-medium text-black transition-colors duration-150 hover:bg-[#F6A11A]/80 ${FOCUS}`}
            onClick={() => send("edit", index)}
          >
            <Pencil aria-hidden="true" size={13} strokeWidth={2} />
            Edit
          </button>
          <BarButton icon={ArrowUp} label="Move up" disabled={index === 0} onClick={() => send("up", index)} />
          <BarButton icon={ArrowDown} label="Move down" disabled={index === count - 1} onClick={() => send("down", index)} />
          <BarButton icon={hidden ? Eye : EyeOff} label={hidden ? "Show on the site" : "Hide on the site"} onClick={() => send("toggle", index)} />
        </div>
      </div>
      {hidden ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[59] flex justify-end p-3">
          <span style={{ zoom }} className="inline-flex items-center gap-[6px] rounded-full bg-black px-[10px] py-[6px] text-[12px] leading-none font-medium text-white">
            <EyeOff aria-hidden="true" size={13} strokeWidth={2} />
            Hidden on the site
          </span>
        </div>
      ) : null}
      <div className={`outline-2 -outline-offset-2 outline-transparent transition-[outline-color,opacity] duration-150 group-hover/preview:outline-[#F6A11A] ${hidden ? "opacity-35" : ""}`}>
        {children}
      </div>
    </div>
  );
}
