"use client";

import { useShown } from "@/components/about-v2/shared";
import { ENQUIRY_GLYPHS } from "@/components/contact-v2/glyphs";
import { COLUMN, DashedRule, SUBHEAD } from "@/components/hero/editorial";
import { useSiteDetails } from "@/components/site/site-details";
import Link from "@/components/transition/transition-link";
import { ENQUIRIES } from "@/lib/contact-v2";
import { GET_STARTED, type GetStartedContent } from "@/lib/pages/home-content";
import { telHref } from "@/lib/site/details";

/*
 * The content plan's Get Started section on Home (§1), built from its own
 * content: the four enquiry options of §11 as study 04's line cards (the
 * /careers openings card), each with the drawing made for that option in
 * components/contact-v2/glyphs.tsx and a link that opens /contact on it.
 * The direct lines sit under the cards. The heading and link words come from
 * the Home page in /admin; the cards are the Contact page's enquiry choices,
 * and the phone and email come from Office details in /admin.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

export function GetStartedSection({ content = GET_STARTED }: { content?: GetStartedContent }) {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.2);
  const { phones, email } = useSiteDetails();
  return (
    <section id="get-started" aria-labelledby="get-started-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[120px] max-[600px]:py-[80px]`}>
        <h2 id="get-started-heading" className={SUBHEAD}>
          {content.heading}
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
                <h3 className=" font-serif text-[clamp(1.5rem,1.15rem+.7vw,1.9rem)] leading-[1.1] font-semibold">{enquiry.name}</h3>
                <div className="flex flex-1 items-center justify-center py-8">
                  <div className="aspect-[4/3] w-[min(100%,170px)]">
                    <Glyph on={shown} />
                  </div>
                </div>
                {/* 04's link: a label and a small outlined square. */}
                <Link
                  href={`/contact?enquiry=${enquiry.id}#enquiry`}
                  aria-label={`${content.linkLabel}: ${enquiry.name}`}
                  className={`inline-flex w-fit items-center gap-[10px] text-[14px] font-medium text-black no-underline underline-offset-4 hover:underline ${FOCUS}`}
                >
                  {content.linkLabel}
                  <span aria-hidden="true" className="h-[9px] w-[9px] border border-current" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mt-[28px] flex flex-wrap gap-x-[32px] gap-y-[8px] text-[15px] leading-[1.6]">
          {phones[0] ? (
            <a href={telHref(phones[0].number)} className={`text-black no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS}`}>
              {phones[0].number}
            </a>
          ) : null}
          <a href={`mailto:${email}`} className={`text-black no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS}`}>
            {email}
          </a>
        </p>
      </div>
    </section>
  );
}
