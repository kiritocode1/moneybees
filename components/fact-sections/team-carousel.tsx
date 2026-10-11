"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import TransitionLink from "@/components/transition/transition-link";
import { TEAM, type TeamMember } from "@/lib/insights";
import styles from "./team-carousel.module.css";
import { BUTTON } from "@/components/hero/tokens";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

/*
 * curocapital.dk's "Mød vores partnere", copied 1:1 from its markup, script and
 * stylesheet (pinned in reference/curocapital, values in NOTES.md there): the
 * grid, type sizes, motion and controls are the source's. The colours, font,
 * words and people are Moneybee's: the section sits on the homepage's white and
 * black, the portraits are grey as elsewhere on the site, and the arrows use
 * its grey. The profile panel is ours (approved 2026-10-09): the name in the
 * display face, the role as a mono label, the bio as a lead and ruled rows,
 * then the enquiry and the person's LinkedIn.
 */
const SLIDE_MS = 700;
const EASE_IN_OUT = "cubic-bezier(.4,0,.2,1)";
const COUNT = TEAM.length;
/*
 * The source sets name, role and phone text at line-height: normal, which in its
 * font is 1.19 (ascent 1, descent .19, measured). Ours differs, so it is set outright.
 */
const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2";

/** LinkedIn's mark (Simple Icons). */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const wrap = (index: number) => ((index % COUNT) + COUNT) % COUNT;

/** The source's 6x14 chevrons. */
const CHEVRONS = {
  previous: "M6 11.7124L6 14L-4.76837e-07 8.37369V5.59427L6 0L6 1.9902L0.857142 6.75782V6.82645L6 11.7124Z",
  next: "M0 2.20974L0 5.28922e-05L5.99997 5.66382L5.99997 8.36861L0 14.0001L0 11.9967L5.14283 7.19732V7.12824L0 2.20974Z",
} as const;

/** A headshot that fades in over 500ms once loaded. The original file, the largest we have. */
function Portrait({ person, alt }: { person: TeamMember; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={person.photo}
      alt={alt}
      fill
      unoptimized
      onLoad={() => setLoaded(true)}
      className="object-cover object-[50%_20%] grayscale transition-opacity duration-500 ease-in-out"
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}

/**
 * The source's heading reveal: Alpine hides it once running, then on the first
 * intersection drops the classes, so it rises 2rem and fades in over 700ms
 * (transition-all, ease-out).
 */
function Heading({ id, className }: { id?: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState<boolean | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setShown(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShown(true);
      observer.disconnect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <h2
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700 ease-out`}
      style={shown === false ? { translate: "0 calc(var(--spacing) * 8)", visibility: "hidden", opacity: 0 } : undefined}
    >
      Our Team
    </h2>
  );
}

/** The enquiry as the site's orange pill, and the person's LinkedIn when one is confirmed. */
function Actions({ member, className }: { member: TeamMember; className: string }) {
  const { linkedin } = member;
  return (
    <div className={className}>
      <TransitionLink href={ENQUIRY_HREF} className={`${BUTTON} bg-[#F6A11A] text-black hover:bg-black hover:text-white`}>
        Get in touch
      </TransitionLink>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className={`${BUTTON} gap-2 border border-black/20 text-black hover:border-black`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[15px] fill-current">
            <path d={LINKEDIN_PATH} />
          </svg>
          LinkedIn
        </a>
      )}
    </div>
  );
}

/**
 * One person's panel: the name in the display face over the role as a mono
 * label, the first line of the bio as a lead, the rest as ruled rows.
 */
function Profile({ member, size }: { member: TeamMember; size: "large" | "small" }) {
  const [lead, ...rest] = member.points;
  return (
    <>
      <div className="shrink-0">
        <h3 className={`font-serif leading-[1.02] font-bold tracking-[-.025em] ${size === "large" ? "text-[length:calc(var(--rem)*2.4)]" : "text-[length:calc(var(--rem)*1.6)]"}`}>
          {member.name}
        </h3>
        <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] leading-normal tracking-[.1em] text-black/55 uppercase">{member.role}</p>
      </div>
      <div className="mt-2 min-h-0 border-t border-black/15 pt-5">
        <p className="text-[length:calc(var(--rem)*1.125)] leading-[1.45] tracking-[-.01em] text-black">{lead}</p>
        {rest.length > 0 && (
          <ul className="mt-5 list-none p-0">
            {rest.map((point) => (
              <li key={point} className="border-t border-black/10 py-3 text-sm leading-[1.5] text-black/65">
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

type Look = { opacity: string; visibility: string; translate: string };

/**
 * Alpine's x-show transition as the source runs it: the start look goes on at
 * once, the transition with it, and two frames later the end look. Visibility
 * is not in Tailwind's transition list, so it switches at the end look: the
 * leaving bio vanishes at once while the new one drops in. The source hides
 * with display: none; ours stay laid out (hidden by visibility) so the panel
 * is always as tall as the longest bio, so the start look is set with no
 * transition, as it would be on a hidden element.
 */
function xShow(el: HTMLElement, transition: string, start: Look, end: Look, ms: number) {
  Object.assign(el.style, start, { transition: "none" });
  void el.offsetHeight;
  el.style.transition = transition;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      Object.assign(el.style, end);
      window.setTimeout(() => {
        el.style.transition = "";
      }, ms);
    });
  });
}

const SHOWN: Look = { opacity: "1", visibility: "visible", translate: "0 calc(var(--spacing) * 0)" };

/**
 * Every bio, one shown at a time. A change hides the old one (200ms, ease-in,
 * down 1rem) and shows the new one (600ms, ease-out, from 1rem up).
 */
function Bios({ active }: { active: number }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const shownRef = useRef(active);
  useLayoutEffect(() => {
    const from = shownRef.current;
    if (from === active) return;
    shownRef.current = active;
    const leaving = refs.current[from];
    const entering = refs.current[active];
    if (leaving) xShow(leaving, "opacity 200ms cubic-bezier(.4,0,1,1), translate 200ms cubic-bezier(.4,0,1,1)", SHOWN, { opacity: "0", visibility: "hidden", translate: "0 calc(var(--spacing) * 4)" }, 200);
    if (entering) xShow(entering, "opacity 600ms cubic-bezier(0,0,.2,1), translate 600ms cubic-bezier(0,0,.2,1)", { opacity: "0", visibility: "hidden", translate: "0 calc(var(--spacing) * -4)" }, SHOWN, 600);
  }, [active]);
  // Every bio shares one grid cell, so the panel is as tall as the longest one.
  return TEAM.map((member, index) => (
    <div
      key={member.name}
      ref={(el) => {
        refs.current[index] = el;
      }}
      className="flex w-[var(--cols-4)] flex-col gap-4 [grid-area:1/1]"
      // Only the first is shown on the first render; xShow owns the look after that.
      style={index === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
    >
      <Profile member={member} size="large" />
      <Actions member={member} className="mt-auto flex shrink-0 flex-wrap gap-3 pt-4" />
    </div>
  ));
}

/**
 * One clipped window holding every portrait. It shows the person `shift`
 * places from the active one; the rest wait a window's width to either side,
 * transparent, so each step pushes the old portrait out as the new one enters.
 */
function Window({ active, shift }: { active: number; shift: number }) {
  const shown = wrap(active + shift);
  return (
    <div className="relative h-full w-full overflow-hidden">
      {TEAM.map((person, index) => {
        // The source's getOffset: 0 is shown, -1 waits on the left, the rest wait on the right.
        const offset = wrap(index - shown + 1) - 1;
        const on = offset === 0;
        return (
          <div
            key={person.name}
            className="absolute inset-0"
            style={{
              transform: on ? "none" : `translateX(${offset < 0 ? -100 : 100}%)`,
              opacity: on ? 1 : 0,
              visibility: on ? "visible" : "hidden",
              zIndex: on ? 10 : 0,
              transition: `all ${SLIDE_MS}ms ${EASE_IN_OUT}`,
            }}
          >
            <Portrait person={person} alt={on && shift === 0 ? person.name : ""} />
          </div>
        );
      })}
    </div>
  );
}

function Thumb({ active, shift, opacity, onClick }: { active: number; shift: number; opacity: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Show ${TEAM[wrap(active + shift)].name}`}
      className={`aspect-[3/4] w-[calc(var(--cols-2)+var(--half-col)+var(--half-gutter))] shrink-0 cursor-pointer ${RING}`}
      style={{ opacity }}
    >
      <Window active={active} shift={shift} />
    </button>
  );
}

function Arrow({ direction, busy, onClick }: { direction: keyof typeof CHEVRONS; busy: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "next" ? "Next team member" : "Previous team member"}
      className={`flex aspect-square size-1/2 items-center justify-center bg-[#EDEEEF] transition-opacity duration-300 ease-in-out ${busy ? "cursor-wait opacity-50" : ""} ${RING}`}
    >
      <svg width="6" height="14" viewBox="0 0 6 14" fill="none" aria-hidden="true" className="size-4">
        <path d={CHEVRONS[direction]} fill="currentColor" />
      </svg>
    </button>
  );
}

/**
 * Desktop (1024px up): the active bio over two faded portraits on the left,
 * the active portrait with the arrows beside it, and the next person on the
 * right, running off the edge. The left thumbnails step back, the right one forward.
 */
function Row() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const step = (by: 1 | -1) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setActive((current) => wrap(current + by));
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    timers.current.push(
      window.setTimeout(() => {
        locked.current = false;
        setBusy(false);
      }, SLIDE_MS),
    );
  };
  // The far thumbnail is two steps away; the source takes them one after the other.
  const stepBackTwice = () => {
    step(-1);
    timers.current.push(window.setTimeout(() => step(-1), SLIDE_MS));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Team carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative hidden w-full gap-10 overflow-clip px-[var(--grid-margin)] lg:grid"
    >
      <Heading id="team-heading" className="font-serif text-[length:calc(var(--rem)*3)] leading-[1.1] font-bold" />
      <div className="relative flex w-full items-end gap-[var(--grid-gutter)]">
        <div className="flex w-[var(--cols-5)] flex-col justify-between gap-4 self-stretch">
          <div className="relative z-20 grid w-full grow pr-[var(--grid-margin)]">
            <Bios active={active} />
          </div>
          <div className="flex w-full items-end justify-between gap-[var(--grid-gutter)]">
            <Thumb active={active} shift={-2} opacity={0.3} onClick={stepBackTwice} />
            <Thumb active={active} shift={-1} opacity={0.5} onClick={() => step(-1)} />
          </div>
        </div>

        <div className="relative aspect-[3/4] w-[var(--cols-5)] shrink-0">
          <Window active={active} shift={0} />
          <div className="absolute top-0 left-[calc(100%+var(--grid-gutter))] flex w-[var(--cols-1)] gap-2">
            <Arrow direction="previous" busy={busy} onClick={() => step(-1)} />
            <Arrow direction="next" busy={busy} onClick={() => step(1)} />
          </div>
        </div>

        <Thumb active={active} shift={1} opacity={0.5} onClick={() => step(1)} />
      </div>
    </div>
  );
}

/**
 * Below 1024px, the source's phone carousel: an Embla loop that autoplays
 * every 4s. The slide in view is at full strength, its portrait grown from
 * four columns to the full slide and its bio settled 0.5rem down into place.
 */
function Rail() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true }, [
    Autoplay({ playOnInit: true, delay: 4000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const select = () => setSelected(emblaApi.selectedScrollSnap());
    select();
    emblaApi.on("select", select).on("reInit", select);
    return () => {
      emblaApi.off("select", select).off("reInit", select);
    };
  }, [emblaApi]);

  return (
    <div className="grid w-full gap-5 lg:hidden">
      <div className="pl-[var(--grid-margin)]">
        <Heading className="font-serif text-[length:calc(var(--rem)*1.5)] leading-[1.19] font-bold" />
      </div>
      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex w-full touch-pan-y items-start [backface-visibility:hidden]">
          {TEAM.map((person, index) => {
            const on = index === selected;
            return (
              <div
                key={person.name}
                className="grid h-fit min-w-0 shrink-0 flex-[0_0_var(--push-5)] [transform:translateZ(0)] gap-4 overflow-clip pl-[var(--grid-margin)] transition-opacity duration-[600ms] ease-in-out"
                style={{ opacity: on ? 1 : 0.5 }}
              >
                <div className="flex aspect-[3/4] h-fit w-full shrink-0 items-end">
                  <div className={`relative aspect-[3/4] h-fit origin-bottom transition-all duration-[600ms] ease-in-out ${on ? "w-full" : "w-[var(--cols-4)]"}`}>
                    <Portrait person={person} alt={person.name} />
                  </div>
                </div>
                <div
                  className="relative z-[2] flex w-full flex-col gap-4 transition-all duration-[600ms] ease-in-out"
                  style={{ opacity: on ? 1 : 0.5, translate: on ? "0 0" : "0 calc(var(--spacing) * -2)" }}
                >
                  <Profile member={person} size="small" />
                  <Actions member={person} className="relative z-[2] mt-2 flex flex-wrap gap-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** /about's team section (on the homepage until 2026-10-08, when the client dropped the team photograph under it). */
export default function TeamCarousel() {
  return (
    <section id="team" aria-labelledby="team-heading" className={`${styles.grid} relative scroll-mt-[96px] overflow-x-clip bg-white py-24 text-black lg:py-32`}>
      <Row />
      <Rail />
    </section>
  );
}
