"use client";

import { useDocumentInfo, useForm, useFormFields, useFormInitializing, useLivePreviewContext, useStepNav } from "@payloadcms/ui";
import { BookOpen, Monitor, MousePointerClick, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Banner, BannerAction, BannerTitle } from "@/components/fluid/banner";
import { Button } from "@/components/fluid/button";
import { isPreviewCommand } from "@/lib/pages/sections";
import { SITE_PAGES } from "@/lib/pages/site-pages";

const PATH = "sections";

/** The narrowest width at which the site shows its desktop layout, and the preview's zoom steps from largest. */
const DESKTOP_WIDTH = 1280;
const ZOOMS = [1, 0.75, 0.5];

/** Where a closed banner is remembered, per browser. */
const BANNER_KEY = "mb-editor-banner-closed";
const subscribe = (onChange: () => void) => {
  window.addEventListener(BANNER_KEY, onChange);
  return () => window.removeEventListener(BANNER_KEY, onChange);
};
const bannerClosed = () => {
  try {
    return localStorage.getItem(BANNER_KEY) === "1";
  } catch {
    return false;
  }
};
const closeBanner = () => {
  try {
    localStorage.setItem(BANNER_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(BANNER_KEY));
};

/**
 * Desktop or Phone, in Payload's preview toolbar in place of its size and
 * zoom controls (hidden in components/admin/admin.css). Desktop shows the page
 * at full desktop width, zoomed to fit the pane; Phone at 390 wide.
 */
function DeviceSwitch() {
  const { breakpoint, setBreakpoint, setZoom } = useLivePreviewContext();
  const [toolbar, setToolbar] = useState<Element | null>(null);
  const fitted = useRef(false);
  const fitDesktop = useCallback(() => {
    setBreakpoint("responsive");
    const pane = document.querySelector(".live-preview-window")?.clientWidth ?? 0;
    setZoom(ZOOMS.find((zoom) => pane / zoom >= DESKTOP_WIDTH) ?? ZOOMS[ZOOMS.length - 1]);
  }, [setBreakpoint, setZoom]);

  // The toolbar renders with the preview; wait for it, and fit the page once it is there.
  useEffect(() => {
    let frame = 0;
    const find = () => {
      const found = document.querySelector(".live-preview-toolbar-controls");
      if (!found) return void (frame = requestAnimationFrame(find));
      setToolbar(found);
      if (fitted.current) return;
      fitted.current = true;
      fitDesktop();
    };
    find();
    return () => cancelAnimationFrame(frame);
  }, [fitDesktop]);

  if (!toolbar) return null;
  const phone = breakpoint === "phone";
  return createPortal(
    <div className="fluid mb-device-switch flex items-center gap-1 rounded-[8px] bg-muted p-[3px]" role="group" aria-label="Preview size">
      <Button size="compact" variant={phone ? "ghost" : "secondary"} active={!phone} aria-pressed={!phone} leadingIcon={Monitor} onClick={fitDesktop}>
        Desktop
      </Button>
      <Button
        size="compact"
        variant={phone ? "secondary" : "ghost"}
        active={phone}
        aria-pressed={phone}
        leadingIcon={Smartphone}
        onClick={() => {
          setBreakpoint("phone");
          setZoom(1);
        }}
      >
        Phone
      </Button>
    </div>,
    toolbar,
  );
}

/**
 * The top of an editable page's form. The live page sits beside it; each
 * section there carries a bar (components/site-editor/preview-section.tsx)
 * whose buttons post a message here. Edit opens that section's fields and
 * closes the rest, Up and Down move it, Hide flips its "Hide on the site"
 * switch. Each change marks the form modified, so autosave writes the draft
 * and the preview reloads with it. `?section=N` (the Guide's Edit this
 * section) opens that section on arrival. It also sets the breadcrumb to
 * Website / the page, and tags Payload's status line so admin.css can show it
 * as a badge.
 */
export function PreviewBridge() {
  const { dispatchFields, getField, moveFieldRow, setModified } = useForm();
  const rows = useFormFields(([fields]) => fields[PATH]?.rows);
  const { iframeRef, isLivePreviewing, setIsLivePreviewing } = useLivePreviewContext();
  const { globalSlug, unpublishedVersionCount } = useDocumentInfo();
  const { stepNav, setStepNav } = useStepNav();
  const unpublished = useRef(unpublishedVersionCount);
  const opened = useRef(false);
  const initializing = useFormInitializing();
  const closed = useSyncExternalStore(subscribe, bannerClosed, () => false);
  const page = SITE_PAGES.find((p) => p.slug === globalSlug);

  // Payload sets its own breadcrumb as the view mounts; this one replaces it whenever Payload's comes back.
  useEffect(() => {
    if (page && stepNav[0]?.label !== "Website") setStepNav([{ label: "Website", url: "/admin/website" }, { label: page.name }]);
  }, [page, setStepNav, stepNav]);

  // Payload's status line has no class per state; this one tells admin.css which colour its badge takes.
  useEffect(() => {
    document.querySelector(".doc-controls .status")?.setAttribute("data-mb-state", unpublishedVersionCount > 0 ? "changed" : "published");
  });

  // Payload reloads the preview after each save but not after "Revert to published", which drops the unpublished count to 0.
  useEffect(() => {
    if (unpublished.current > 0 && unpublishedVersionCount === 0) {
      iframeRef.current?.contentWindow?.postMessage({ type: "payload-document-event" }, window.location.origin);
    }
    unpublished.current = unpublishedVersionCount;
  }, [iframeRef, unpublishedVersionCount]);

  const open = useCallback(
    (index: number) => {
      if (!rows) return;
      dispatchFields({ type: "SET_ALL_ROWS_COLLAPSED", path: PATH, updatedRows: rows.map((row, i) => ({ ...row, collapsed: i !== index })) });
      // The row opens on the next render; scroll once it has.
      requestAnimationFrame(() => document.getElementById(`${PATH}-row-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    },
    [dispatchFields, rows],
  );

  // Once the form has loaded; earlier, Payload's initial state collapses every row again.
  useEffect(() => {
    if (opened.current || initializing || !rows?.length) return;
    opened.current = true;
    const asked = new URLSearchParams(window.location.search).get("section");
    const index = Number(asked);
    if (asked !== null && Number.isInteger(index) && index >= 0 && index < rows.length) setTimeout(() => open(index), 300);
  }, [initializing, open, rows]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isPreviewCommand(event.data) || !rows) return;
      const { action, index } = event.data;
      if (index < 0 || index >= rows.length) return;
      if (action === "edit") return open(index);
      if (action === "toggle") {
        const path = `${PATH}.${index}.hidden`;
        dispatchFields({ type: "UPDATE", path, value: !getField(path)?.value });
      } else {
        const to = action === "up" ? index - 1 : index + 1;
        if (to < 0 || to >= rows.length) return;
        moveFieldRow({ path: PATH, moveFromIndex: index, moveToIndex: to });
      }
      setModified(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [dispatchFields, getField, moveFieldRow, open, rows, setModified]);

  if (!isLivePreviewing) {
    return (
      <div className="fluid">
        <Banner className="mb-6" icon={MousePointerClick}>
          <BannerTitle>The page is hidden. Show it to click the section you want to change.</BannerTitle>
          <BannerAction variant="primary" onClick={() => setIsLivePreviewing(true)}>
            Show the page
          </BannerAction>
        </Banner>
      </div>
    );
  }
  return (
    <div className="fluid">
      <DeviceSwitch />
      <Banner className="mb-6" icon={MousePointerClick} dismissible open={!closed} onDismiss={closeBanner} dismissLabel="Close">
        <BannerTitle>Click a section on the page to change it.</BannerTitle>
        <BannerAction variant="ghost" leadingIcon={BookOpen} className="no-underline" href={page ? `/admin/guide?page=${page.key}` : "/admin/guide"}>
          Guide
        </BannerAction>
      </Banner>
    </div>
  );
}
