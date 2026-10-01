"use client";

import { useShown } from "@/components/about-v2/shared";
import { type LineArt, LineArtFigure } from "@/components/drawing/line-art";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { applyHref, CAREERS_LOREM, OPENINGS, RESUME_HREF, TEAM_NAMES, type Team } from "@/lib/careers";

/*
 * Current Openings (content plan §10, "Clean job-opening cards") as study 04's
 * line cards (reference/visual-language/04): a title, one line of description,
 * a centred line drawing with exactly one orange element, and a link with a
 * small outlined square at the bottom left. On this white page the cards are
 * the panel grey with black line art. The drawings are 04's own
 * (components/drawing/line-art.tsx), one per team the plan names:
 *
 *   Investment research   the cylinder, one ring orange: data, studied layer by layer
 *   Portfolio management  the orange square distributing to three holdings
 *   Advisory              the fan from one orange line: one view, many clients
 *   Compliance            a framed set of rules, one rule orange
 *   Financial services    the burst: thirty lines out from one orange square
 *   Any team              the open frame with the orange arrow leaving it: send a resume
 */

/** Each team's drawing from the shared 04 set. */
const TEAM_ART: Record<Team | "any", LineArt> = {
  research: "cylinder",
  portfolio: "distribute",
  advisory: "fan",
  compliance: "rules",
  services: "burst",
  any: "exit",
};

/** 04's link: a label and a small outlined square. */
function CardLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-[10px] text-[14px] font-medium text-black no-underline underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
      {children}
      <span aria-hidden="true" className="h-[9px] w-[9px] border border-current" />
    </a>
  );
}

type Card = { key: string; art: Team | "any"; team: string; title: string; text: string; link: { href: string; label: string } };

const CARDS: Card[] = [
  ...OPENINGS.map((opening, index) => ({
    key: `${opening.team}-${index}`,
    art: opening.team,
    team: TEAM_NAMES[opening.team],
    title: opening.role,
    text: opening.text,
    link: { href: applyHref(`${opening.role}, ${TEAM_NAMES[opening.team]}`), label: "Apply" },
  })),
  { key: "any", art: "any", team: "Any team", title: "Not listed here?", text: CAREERS_LOREM.short, link: { href: RESUME_HREF, label: "Send Your Resume" } },
];

export function OpeningCards() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.15);
  return (
    <section id="openings" aria-labelledby="openings-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-black/60`}>01</span>
            <h2 id="openings-heading" className={`mt-[14px] ${SUBHEAD}`}>
              Current Openings
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, index) => {
            return (
              <article
                key={card.key}
                className="flex min-h-[400px] flex-col rounded-[6px] bg-[#F6F6F6] p-[26px] max-md:min-h-[340px]"
                style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(24px)", transition: `opacity ${t(500, index * 80)}, transform ${t(700, index * 80)}` }}
              >
                <span className={`${EYEBROW} text-black/60`}>{card.team}</span>
                <h3 className="mt-[12px] font-serif text-[clamp(1.5rem,1.15rem+.7vw,1.9rem)] leading-[1.1] font-normal">{card.title}</h3>
                <p className="mt-[8px] text-[15px] leading-[1.5] text-black/65">{card.text}</p>
                <div className="flex flex-1 items-center justify-center py-8">
                  <LineArtFigure art={TEAM_ART[card.art]} on={shown} delay={200 + index * 80} className="w-[min(100%,150px)]" />
                </div>
                <CardLink href={card.link.href}>{card.link.label}</CardLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
