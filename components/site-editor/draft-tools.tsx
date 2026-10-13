"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useInAdminPreview, useOrigin } from "./use-in-admin-preview";

/**
 * Rendered only while staff view unpublished changes (Next's draft mode, set
 * by /live-preview). In /admin's preview it reloads the page each time the
 * draft saves. In a normal tab it says the page is a draft and links back to
 * the published one, because the draft cookie lasts the whole visit.
 */
export function DraftTools({ path }: { path: string }) {
  const router = useRouter();
  const inPreview = useInAdminPreview();
  const origin = useOrigin();
  if (!origin) return null;
  if (inPreview) return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />;
  return (
    <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-3 rounded-full bg-black py-[8px] pr-[8px] pl-[16px] text-[13px] text-white shadow-[0_4px_16px_rgba(0,0,0,.2)]">
      You are seeing unpublished changes
      <a href={`/live-preview/exit?path=${encodeURIComponent(path)}`} className="rounded-full bg-white px-[12px] py-[6px] font-medium text-black no-underline hover:bg-white/85">
        Show the live page
      </a>
    </div>
  );
}
