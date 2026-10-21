"use client";

import { useEffect, useId, useRef, useState } from "react";
import measured from "@/lib/admin/guide-videos.json";
import { ROLE_NAMES, type GuideVideo as GuideVideoEntry } from "@/lib/admin/guide-videos";

/** The length and chapter times scripts/guide-videos.mjs measured for each recording. */
type MeasuredVideo = { seconds: number; chapters: { at: number; caption: string }[] };

const MEASURED: Record<string, MeasuredVideo | undefined> = measured;

/** Seconds as a player shows them: 60.9 is 1:00. */
function length(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

/**
 * One recorded video: native controls and captions, with its chapters beside
 * it on wide screens and under it on narrow ones. The chapter being played is
 * lit; pressing one jumps there. A video without a recording yet draws
 * nothing, so a definition can be written before it is filmed.
 */
export function GuideVideo({ video, onClose, focusOnOpen = false, className = "" }: { video: GuideVideoEntry; onClose?: () => void; focusOnOpen?: boolean; className?: string }) {
  const measuredVideo = MEASURED[video.id];
  const titleId = useId();
  const figure = useRef<HTMLElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const chapters = useRef<HTMLOListElement>(null);
  const [chapter, setChapter] = useState(0);

  // Captions are on by default. Some browsers ignore a track's default
  // attribute until the media has loaded, so turn the first track on too.
  useEffect(() => {
    const element = player.current;
    if (!element) return;
    const show = () => {
      const track = element.textTracks[0];
      if (track) track.mode = "showing";
    };
    show();
    element.addEventListener("loadedmetadata", show);
    return () => element.removeEventListener("loadedmetadata", show);
  }, []);

  // A player opened from Watch first takes focus, so a keyboard user lands in
  // the thing that just appeared instead of on the card above it. The page is
  // moved by the caller; focusing must not move it a second time.
  useEffect(() => {
    if (focusOnOpen) figure.current?.focus({ preventScroll: true });
  }, [focusOnOpen]);

  // Keep the chapter being played in the list's own view as playback passes
  // it, without moving the page.
  useEffect(() => {
    const list = chapters.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !active) return;
    const box = list.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.top < box.top) list.scrollTop -= box.top - item.top;
    else if (item.bottom > box.bottom) list.scrollTop += item.bottom - box.bottom;
  }, [chapter]);

  if (!measuredVideo) return null;

  const jump = (index: number) => {
    const element = player.current;
    if (!element) return;
    element.currentTime = measuredVideo.chapters[index].at + 0.05;
    setChapter(index);
    void element.play();
  };

  // The last chapter whose time has passed is the one being played.
  const follow = () => {
    const element = player.current;
    if (!element) return;
    let playing = 0;
    measuredVideo.chapters.forEach((each, index) => {
      if (element.currentTime >= each.at) playing = index;
    });
    setChapter(playing);
  };

  return (
    <figure ref={figure} tabIndex={focusOnOpen ? -1 : undefined} aria-labelledby={titleId} className={`m-0 focus:outline-none ${className}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <figcaption id={titleId} className="text-[17px] leading-6 font-semibold text-foreground">
          Watch: {video.title}
        </figcaption>
        <span className="text-[14px] leading-5 text-muted-foreground">
          Filmed as {ROLE_NAMES[video.role]} · {length(measuredVideo.seconds)} · captions on
        </span>
        {onClose ? (
          <button type="button" onClick={onClose} className="ml-auto rounded-md px-2 py-1 text-[14px] leading-5 font-medium text-muted-foreground hover:bg-hover hover:text-foreground">
            Close
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 min-[1200px]:grid-cols-[minmax(0,1fr)_300px]">
        <video
          ref={player}
          className="block h-auto w-full rounded-xl border bg-black"
          controls
          preload="metadata"
          playsInline
          poster={`/admin-guide/videos/${video.id}.webp`}
          aria-label={video.title}
          onTimeUpdate={follow}
        >
          <source src={`/admin-guide/videos/${video.id}.mp4`} type="video/mp4" />
          <track kind="captions" srcLang="en" label="English" src={`/admin-guide/videos/${video.id}.vtt`} default />
          Your browser cannot play this video.
        </video>
        <ol ref={chapters} aria-label="Chapters" className="m-0 grid max-h-[560px] list-none content-start gap-0.5 overflow-y-auto p-0">
          {measuredVideo.chapters.map((each, index) => (
            <li key={each.at}>
              <button
                type="button"
                onClick={() => jump(index)}
                aria-current={index === chapter ? "true" : undefined}
                className="grid w-full grid-cols-[44px_minmax(0,1fr)] gap-2 rounded-lg px-2.5 py-2 text-left text-[14px] leading-[1.45] text-muted-foreground hover:bg-hover hover:text-foreground aria-[current]:bg-muted aria-[current]:text-foreground aria-[current]:shadow-[inset_2px_0_0_#2563EB]"
              >
                <span className="font-mono text-[12px] leading-[1.9] text-muted-foreground">{length(each.at)}</span>
                <span>{each.caption}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/**
 * Watch first: a poster for each start-to-finish story recorded so far. A
 * poster opens its player below the grid, and the same poster closes it.
 */
export function WatchFirst({ videos }: { videos: readonly GuideVideoEntry[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const last = useRef<string | null>(null);
  const chosen = videos.find((video) => video.id === open);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }, [open]);

  const close = () => {
    const reopened = last.current;
    setOpen(null);
    if (reopened) requestAnimationFrame(() => document.getElementById(`watch-${reopened}`)?.focus());
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {videos.map((video) => {
          const measuredVideo = MEASURED[video.id];
          if (!measuredVideo) return null;
          const on = open === video.id;
          return (
            <button
              key={video.id}
              id={`watch-${video.id}`}
              type="button"
              aria-expanded={on}
              aria-controls="watch-player"
              onClick={() => {
                last.current = video.id;
                setOpen(on ? null : video.id);
              }}
              className={`grid overflow-hidden rounded-xl border bg-card text-left hover:bg-hover ${on ? "border-[#2563EB] ring-1 ring-[#2563EB]" : ""}`}
            >
              <img src={`/admin-guide/videos/${video.id}.webp`} alt="" loading="lazy" className="block aspect-[16/10] w-full object-cover" />
              <span className="grid gap-0.5 px-3.5 py-3">
                <span className="text-[15px] leading-6 font-semibold text-foreground">{video.title}</span>
                <span className="text-[13px] leading-5 text-muted-foreground">
                  {ROLE_NAMES[video.role]} · {length(measuredVideo.seconds)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div id="watch-player" ref={panel} className="scroll-mt-24">
        {chosen ? (
          <div className="mt-6">
            <GuideVideo key={chosen.id} video={chosen} onClose={close} focusOnOpen />
          </div>
        ) : null}
      </div>
    </>
  );
}
