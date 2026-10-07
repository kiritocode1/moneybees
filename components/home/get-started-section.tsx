"use client";

import { useShown } from "@/components/about-v2/shared";
import { ENQUIRY_GLYPHS } from "@/components/contact-v2/glyphs";
import { COLUMN, DashedRule, SUBHEAD } from "@/components/hero/editorial";
import Link from "@/components/transition/transition-link";
import { EMAIL, ENQUIRIES, PHONE, PHONE_HREF } from "@/lib/contact-v2";

/*
 * The content plan's Get Started section on Home (§1), built from its own
 * content: the four enquiry options of §11 as study 04's line cards (the
 * /careers openings card), each with the drawing made for that option in
 * components/contact-v2/glyphs.tsx and a link that opens /contact on it.
 * The direct lines sit under the cards.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

export function GetStartedSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.2);
  return (
    <section id="get-started" aria-labelledby="get-started-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[120px] max-[600px]:py-[80px]`}>
        <h2 id="get-started-heading" className={SUBHEAD}>
          Get Started
        </h2>
        <div ref={ref} className="mt-[48px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {ENQUIRIES.map((enquiry, index) => {
            const Glyph = ENQUIRY_GLYPHS[enquiry.glyph];
            return (
              <article
                key={enquiry.id}
                className="flex min-h-[380px] flex-col rounded-[6px] bg-[#F6F6F6] p-[26px] max-md:min-h-[320px]"
                style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(24px)", transition: `opacity ${t(500, index * 80)}, transform ${t(700, index * 80)}` }}
              >
                <h3 className=" font-serif text-[clamp(1.5rem,1.15rem+.7vw,1.9rem)] leading-[1.1] font-normal">{enquiry.name}</h3>
                <div className="flex flex-1 items-center justify-center py-8">
                  <div className="aspect-[4/3] w-[min(100%,170px)]">
                    <Glyph on={shown} />
                  </div>
                </div>
                {/* 04's link: a label and a small outlined square. */}
                <Link
                  href={`/contact?enquiry=${enquiry.id}#enquiry`}
                  aria-label={`Enquire: ${enquiry.name}`}
                  className={`inline-flex w-fit items-center gap-[10px] text-[14px] font-medium text-black no-underline underline-offset-4 hover:underline ${FOCUS}`}
                >
                  Enquire
                  <span aria-hidden="true" className="h-[9px] w-[9px] border border-current" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mt-[28px] flex flex-wrap gap-x-[32px] gap-y-[8px] text-[15px] leading-[1.6]">
          <a href={PHONE_HREF} className={`text-black no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS}`}>
            {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className={`text-black no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS}`}>
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
