import Image from "next/image";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, HEADING } from "@/components/hero/tokens";
import { ABOUT } from "@/lib/about-v2";
import { HERO_PHOTO } from "@/lib/about-v3";

/*
 * /about's opening, content plan §2: the heading and company text over the
 * team photograph. A server component; Rise is the client part. The founder
 * band and the Moneybee story are in about-v2, the key team members in
 * components/team, the group's four areas in areas-section.tsx.
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
