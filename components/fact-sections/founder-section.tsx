import Image from "next/image";
import { FOUNDER } from "@/lib/insights";
import { BracketLabel } from "./fact-section";

/**
 * The founder, after Wonder Vision's founder statement: a black band with his
 * own words set large in grey across two thirds of the width, and his portrait,
 * name and record beside it at a size the source photo holds sharply.
 */
export default function FounderSection() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="border-t border-t-[rgba(255,255,255,.14)] bg-[#000000] px-[max(32px,calc((100vw_-_1480px)/2))] py-[120px] text-white max-[600px]:px-[22px] max-[600px]:py-[80px]"
    >
      <h2 id="founder-heading">
        <BracketLabel>Why small caps</BracketLabel>
      </h2>
      <div className="mt-[56px] grid grid-cols-[1fr_300px] items-start gap-[80px] max-[1000px]:grid-cols-1 max-[1000px]:gap-[48px]">
        <blockquote className="text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[1.14] font-light tracking-[-.035em] text-[#8c8c8c]">
          {FOUNDER.quote}
        </blockquote>
        <figure className="max-[1000px]:grid max-[1000px]:grid-cols-[140px_1fr] max-[1000px]:gap-[24px]">
          <div className="relative aspect-[868/824] w-full overflow-hidden bg-[#1b1b1b]">
            <Image src="/people/dhiren-shah.jpg" alt={FOUNDER.name} fill sizes="300px" className="object-cover" />
          </div>
          <figcaption className="mt-[22px] max-[1000px]:mt-0">
            <b className="block text-[16px] font-[550] tracking-[-.01em]">{FOUNDER.name}</b>
            <span className="mt-[4px] block text-[11px] tracking-[.06em] text-[#F7A11A]">{FOUNDER.credentials}</span>
            <ul className="mt-[18px] grid list-none gap-[8px] border-t border-t-[rgba(255,255,255,.18)] p-0 pt-[14px] text-[13px] leading-[1.5] text-[rgba(255,255,255,.72)]">
              {FOUNDER.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
