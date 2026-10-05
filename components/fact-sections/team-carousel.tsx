"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { type KeyboardEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import TransitionLink from "@/components/transition/transition-link";
import { TEAM, type TeamMember } from "@/lib/insights";
import { KEY_MEMBERS } from "@/lib/team";
import styles from "./team-carousel.module.css";

/*
 * curocapital.dk's "Mød vores partnere", copied 1:1 from its markup, script and
 * stylesheet (pinned in reference/curocapital, values in NOTES.md there): the
 * grid, type sizes, motion and controls are the source's. The colours, font,
 * words and people are Moneybee's: the section sits on the homepage's white and
 * black, the portraits are grey as elsewhere on the site, and the arrows use
 * its grey.
 */
const SLIDE_MS = 700;
const EASE_IN_OUT = "cubic-bezier(.4,0,.2,1)";
const COUNT = TEAM.length;
/*
 * The source sets name, role and phone text at line-height: normal, which in its
 * font is 1.19 (ascent 1, descent .19, measured). Ours differs, so it is set outright.
 */
const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2";

const wrap = (index: number) => ((index % COUNT) + COUNT) % COUNT;

/** The source links "Om <name>" to a page per person; ours exist only for the people on /team. */
const ABOUT = new Map<string, string>(KEY_MEMBERS.map((person) => [person.name, `/team#${person.id}`]));

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

/** The source's outlined button: on desktop hover a chevron slides in and the label moves right. */
function Action({ href, children }: { href: string; children: ReactNode }) {
  return (
    <TransitionLink
      href={href}
      className={`group relative flex w-fit cursor-pointer border border-current/30 px-3 py-2 pl-8 text-base leading-6 transition-all duration-300 ease-in-out lg:pl-3 lg:hover:border-current lg:hover:pl-8 lg:hover:backdrop-blur-xs ${RING}`}
    >
      <span className="absolute top-1/2 left-3 -translate-y-1/2 lg:left-6 lg:opacity-0 lg:transition-all lg:duration-300 lg:ease-in-out lg:group-hover:left-3 lg:group-hover:opacity-100">
        <svg width="6" height="14" viewBox="0 0 6 14" fill="none" aria-hidden="true" className="size-3">
          <path d={CHEVRONS.next} fill="currentColor" />
        </svg>
      </span>
      <span className="flex transition-transform duration-500 select-none lg:py-0.5">{children}</span>
    </TransitionLink>
  );
}

function Actions({ member, className }: { member: TeamMember; className: string }) {
  const about = ABOUT.get(member.name);
  return (
    <div className={className}>
      <Action href="/contact">Get in touch</Action>
      {about && <Action href={about}>About {member.name.split(" ")[0]}</Action>}
    </div>
  );
}

/**
 * The bio text, cut to as many 20px lines as fit the space left above the
 * thumbnails, as the source does on desktop.
 */
function ClampedPoints({ points }: { points: readonly string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const clamp = () => {
      const available = box.clientHeight;
      if (!available) return;
      let lines = Math.max(1, Math.floor(available / (parseFloat(getComputedStyle(text).lineHeight) || 20)));
      text.style.webkitLineClamp = String(lines);
      while (box.scrollHeight > available && lines > 1) {
        lines -= 1;
        text.style.webkitLineClamp = String(lines);
      }
    };
    clamp();
    const observer = new ResizeObserver(clamp);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={boxRef} className="relative min-h-0 w-full grow overflow-hidden">
      <div ref={textRef} className="text-sm leading-5 tracking-[-.02em]" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {points.map((point) => (
          <p key={point} className="mb-[1.35em] last:mb-0">
            {point}
          </p>
        ))}
      </div>
    </div>
  );
}

type Look = { opacity: string; visibility: string; translate: string };

/**
 * Alpine's x-show transition as the source runs it: the start look and the
 * transition go on at once, a frame later the element is shown, a frame after
 * that the end look goes on, and the element is hidden once the transition's
 * time is up. Visibility is not in Tailwind's transition list, so it switches
 * at the end look: the leaving bio vanishes at once while the new one drops in.
 */
function xShow(el: HTMLElement, show: boolean, transition: string, start: Look, end: Look, ms: number) {
  Object.assign(el.style, start, { transition });
  requestAnimationFrame(() => {
    if (show) el.style.display = "";
    requestAnimationFrame(() => {
      Object.assign(el.style, end);
      window.setTimeout(() => {
        if (!show) el.style.display = "none";
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
    if (leaving) xShow(leaving, false, "opacity 200ms cubic-bezier(.4,0,1,1), translate 200ms cubic-bezier(.4,0,1,1)", SHOWN, { opacity: "0", visibility: "hidden", translate: "0 calc(var(--spacing) * 4)" }, 200);
    if (entering) xShow(entering, true, "opacity 600ms cubic-bezier(0,0,.2,1), translate 600ms cubic-bezier(0,0,.2,1)", { opacity: "0", visibility: "hidden", translate: "0 calc(var(--spacing) * -4)" }, SHOWN, 600);
  }, [active]);
  return TEAM.map((member, index) => (
    <div
      key={member.name}
      ref={(el) => {
        refs.current[index] = el;
      }}
      className="absolute inset-0 flex w-[var(--cols-4)] flex-col gap-4"
      // Only the first is shown on the first render; xShow owns display after that.
      style={index === 0 ? undefined : { display: "none" }}
    >
      <div className="shrink-0">
        <h3 className="text-[length:calc(var(--rem)*1.5)] leading-[1.19] font-medium">{member.name}</h3>
        <p className="mt-2 text-sm leading-[1.19] tracking-[-.02em]">{member.role}</p>
      </div>
      <ClampedPoints points={member.points} />
      <Actions member={member} className="mt-4 flex shrink-0 gap-4" />
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
      <Heading id="team-heading" className="text-[length:calc(var(--rem)*3)] leading-[1.1] font-normal" />
      <div className="relative flex w-full items-end gap-[var(--grid-gutter)]">
        <div className="flex w-[var(--cols-5)] flex-col justify-between gap-4 self-stretch">
          <div className="relative z-20 w-full grow pr-[var(--grid-margin)]">
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
        <Heading className="text-[length:calc(var(--rem)*1.5)] leading-[1.19] font-normal" />
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
                  <div>
                    <h3 className="text-[length:calc(var(--rem)*1.25)] leading-[1.19] font-medium">{person.name}</h3>
                    <p className="mt-2 text-sm leading-[1.19] tracking-[-.02em]">{person.role}</p>
                  </div>
                  <div className="line-clamp-7 text-sm leading-[1.19] tracking-[-.02em]">
                    {person.points.map((point) => (
                      <p key={point} className="mb-[1.35em] last:mb-0">
                        {point}
                      </p>
                    ))}
                  </div>
                  <Actions member={person} className="relative z-[2] mt-4 flex flex-col gap-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The homepage team section, then the team photograph. */
export default function TeamCarousel() {
  return (
    <>
      <section id="team" aria-labelledby="team-heading" className={`${styles.grid} relative overflow-x-clip bg-white py-24 text-black lg:py-32`}>
        <Row />
        <Rail />
      </section>
      {/* The team photograph from moneybee.in: the one real image large enough to run full width. */}
      <div className="relative aspect-[1920/1080] max-h-[88svh] w-full overflow-hidden">
        <Image src="/people/moneybee-team.jpg" alt="The Moneybee team at the Mumbai office" fill sizes="100vw" className="object-cover object-[50%_40%]" />
      </div>
    </>
  );
}
