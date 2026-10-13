import Link from "@/components/transition/transition-link";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { TWO_WAYS, type TwoWaysContent } from "@/lib/pages/home-content";
import { FundFigure } from "./fund-figure";

/*
 * One philosophy, two ways to invest: the products up front, each leading to
 * its own page, on exactly equal footing (same size, weight and button). Each
 * card opens on a figure of what the product is (fund-figure.tsx): one
 * investor and a portfolio of their own for PMS, seven investors and one
 * pooled fund of listed and unlisted companies for the AIF. The two cards
 * share row tracks, so their labels, leads, facts and buttons line up whatever
 * the length of each lead. A server component; Rise and FundFigure are the
 * client parts. The words come from the Home page in /admin, which always
 * keeps two cards; without them, today's (TWO_WAYS).
 */

const EASE = "ease-[cubic-bezier(.23,1,.32,1)]";

export function TwoWaysSection({ content = TWO_WAYS }: { content?: TwoWaysContent }) {
  return (
    <section id="invest" aria-labelledby="invest-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[120px] max-[600px]:py-[80px]`}>
        <Rise onView>
          <h2 id="invest-heading" className={SUBHEAD}>
            {content.heading}
          </h2>
        </Rise>
        {/* Five shared rows: mark, label and name, lead, facts, button. */}
        <div className="mt-[48px] grid grid-cols-2 gap-x-[24px] max-[900px]:grid-cols-1 max-[900px]:gap-y-[24px]">
          {content.ways?.map((way, index) => (
            <Link
              key={index}
              href={way.link}
              className={`group row-span-5 grid grid-rows-subgrid gap-y-0 border border-black/[.14] text-black no-underline transition-[border-color,scale] duration-200 ${EASE} hover:border-black focus-visible:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black active:scale-[.99] motion-reduce:active:scale-100`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F6F6]">
                <FundFigure kind={way.kind} />
              </div>
              <div className="px-[36px] pt-[32px] max-[600px]:px-[24px] max-[600px]:pt-[24px]">
                <span className={`${EYEBROW} text-black/60`}>{way.label}</span>
                <h3 className="mt-[14px] font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] font-semibold">{way.name}</h3>
              </div>
              <p className={`mt-[14px] px-[36px] text-black/70 max-[600px]:px-[24px] ${BODY}`}>{way.lead ?? ""}</p>
              <ul className="mx-[36px] mt-[28px] list-none border-t border-t-black/[.13] p-0 max-[600px]:mx-[24px]">
                {way.facts?.map(({ fact }, factIndex) => (
                  <li key={factIndex} className="flex gap-[12px] border-b border-b-black/[.13] py-[12px] text-[15px] leading-[1.45]">
                    <span aria-hidden="true" className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F6A11A]" />
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="px-[36px] pt-[28px] pb-[36px] max-[600px]:px-[24px] max-[600px]:pb-[24px]">
                {/* The whole card is the link, so the button is drawn, not nested. */}
                <span className={`${BUTTON} border border-dashed border-black/10 group-hover:bg-black/[.03]`}>
                  {content.button}
                  <CornerBrackets />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
