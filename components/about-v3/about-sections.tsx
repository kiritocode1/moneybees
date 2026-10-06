import Image from "next/image";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING } from "@/components/hero/tokens";
import { ABOUT } from "@/lib/about-v2";
import { AREAS, HERO_PHOTO } from "@/lib/about-v3";

/*
 * /about with photographs, content plan §2: the heading and company text over
 * the team photograph and the group's four areas as photographs. The founder
 * band, the key team members and the Moneybee story sit between them (about-v2
 * and components/team). Server components; Rise is the client part.
 */

/** Heading and company text, then the team across the column. The founder band follows it. */
export function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 gap-10 pt-[150px] md:grid-cols-12 md:gap-x-6 md:pt-[200px]`}>
        <div className="md:col-span-7">
          <Rise>
            <BracketLabel>About us</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="about-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {ABOUT.heading}
            </h1>
          </Rise>
        </div>
        <div className="md:col-span-5 md:self-end">
          {ABOUT.company.map((paragraph, index) => (
            <Rise key={paragraph} delay={0.12 + index * 0.06}>
              <p className={`text-black/70 ${BODY} ${index ? "mt-5" : ""}`}>{paragraph}</p>
            </Rise>
          ))}
        </div>
      </div>
      <div className={`${COLUMN} mt-[72px] pb-[120px] max-md:mt-12 max-md:pb-[80px]`}>
        <Rise delay={0.2}>
          <div className="relative aspect-[1272/600] w-full overflow-hidden bg-[#F2F2F2] max-md:aspect-[4/3]">
            <Image
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              fill
              priority
              sizes="(max-width: 1512px) 100vw, 1272px"
              className="object-cover"
              style={{ objectPosition: HERO_PHOTO.position }}
            />
          </div>
        </Rise>
      </div>
    </section>
  );
}

/** The four areas the company text names, a photograph each. */
export function AreasSection() {
  return (
    <section id="group" aria-labelledby="group-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} pt-[120px] max-md:pt-[80px]`}>
        <h2 id="group-heading">
          <BracketLabel>02 · What the group does</BracketLabel>
        </h2>
      </div>
      <ul className={`${COLUMN} mt-10 grid list-none grid-cols-2 gap-x-6 gap-y-10 pb-[40px] md:grid-cols-4`}>
        {AREAS.map((area, index) => (
          <li key={area.name}>
            <Rise onView delay={index * 0.06}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F2F2F2]">
                <Image
                  src={area.src}
                  alt={area.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 306px"
                  className="object-cover grayscale contrast-[1.05]"
                  style={{ objectPosition: area.position }}
                />
              </div>
              <div className="mt-4 flex items-baseline gap-3 border-t border-black pt-3">
                <span className={`${EYEBROW} text-black/50`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[clamp(1.25rem,1rem+.6vw,1.6rem)] leading-[1.15]">{area.name}</span>
              </div>
            </Rise>
          </li>
        ))}
      </ul>
    </section>
  );
}
