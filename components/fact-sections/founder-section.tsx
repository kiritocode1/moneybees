import Image from "next/image";
import { FOUNDER } from "@/lib/insights";
import { COLUMN } from "@/components/hero/tokens";
import { BracketLabel } from "./fact-section";

/**
 * The founder, after Wonder Vision's founder statement: a black band with his
 * own words set large in grey across two thirds of the width, and his portrait,
 * name and role beside it at a size the source photo holds sharply. His
 * degrees and the four points under them came off on 2026-10-12 (user), and
 * the band tightened to fit what is left.
 */
export default function FounderSection() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="border-t border-t-[rgba(255,255,255,.14)] bg-[#000000] py-[96px] text-white max-[600px]:py-[64px]"
    >
      <div className={COLUMN}>
        <h2 id="founder-heading">
          <BracketLabel>Why small caps</BracketLabel>
        </h2>
        <div className="mt-[40px] grid grid-cols-[1fr_300px] items-start gap-[80px] max-[1000px]:grid-cols-1 max-[1000px]:gap-[48px]">
          <blockquote className="text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[1.14] font-light tracking-[-.035em] text-[#8c8c8c]">
            {FOUNDER.quote}
          </blockquote>
          <figure className="max-[1000px]:grid max-[1000px]:grid-cols-[140px_1fr] max-[1000px]:gap-[24px]">
            <div className="relative aspect-[868/824] w-full overflow-hidden bg-[#1b1b1b]">
              <Image
                src="/people/dhiren-shah.jpg"
                alt={FOUNDER.name}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-[22px] max-[1000px]:mt-0">
              <b className="block text-[16px] font-[550] tracking-[-.01em]">
                {FOUNDER.name}
              </b>
              <span className="mt-[4px] block text-[11px] tracking-[.06em] text-[#F6A11A]">
                {FOUNDER.role}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
