import Link from "@/components/transition/transition-link";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { ProductMark } from "@/components/pms-v3/marks";
import { AIF_PRODUCT, PMS_PRODUCT } from "@/lib/insights";
import type { MarkKind } from "@/lib/pms-v3-hero";

/*
 * One philosophy, two ways to invest: the products up front, each leading to
 * its own page, on exactly equal footing (same size, weight and button). Each
 * card opens on its product's mark from the /pms and /aif heroes
 * (components/pms-v3/marks.tsx), split on its centre line as there; hovering
 * or focusing the card closes the split, a preview of the page it opens. The
 * two cards share row tracks, so their labels, leads, facts and buttons line
 * up whatever the length of each lead. A server component; Rise is the client part.
 */

const WAYS: readonly { href: string; mark: MarkKind; label: string; name: string; lead: string; facts: readonly string[] }[] = [
  {
    href: "/pms",
    mark: "pms",
    label: "Portfolio Management Service",
    name: PMS_PRODUCT.name,
    lead: "The stocks sit in your own demat account.",
    facts: [PMS_PRODUCT.points[1], PMS_PRODUCT.points[2], PMS_PRODUCT.points[5]],
  },
  {
    href: "/aif",
    mark: "aif",
    label: "Category III AIF",
    name: AIF_PRODUCT.name,
    lead: AIF_PRODUCT.lead,
    facts: ["Rs. 1 crore minimum", "3 to 5 years", "At least 51% listed, up to 49% unlisted"],
  },
];

/** The mark's halves rest apart (their inline offset); the card's hover or focus closes them. */
const MARK_CSS = `
.tw-half { transition: transform .7s cubic-bezier(.87,0,.13,1) }
.tw-card:hover .tw-half, .tw-card:focus-visible .tw-half { transform: translateX(0) scale(1) !important }
@media (prefers-reduced-motion: reduce) { .tw-half { transition: none } }
`;

const EASE = "ease-[cubic-bezier(.23,1,.32,1)]";

export function TwoWaysSection() {
  return (
    <section id="invest" aria-labelledby="invest-heading" className="bg-white text-black">
      <style>{MARK_CSS}</style>
      <DashedRule />
      <div className={`${COLUMN} py-[120px] max-[600px]:py-[80px]`}>
        <Rise onView>
          <h2 id="invest-heading" className={SUBHEAD}>
            Two ways to invest with us
          </h2>
        </Rise>
        {/* Five shared rows: mark, label and name, lead, facts, button. */}
        <div className="mt-[48px] grid grid-cols-2 gap-x-[24px] max-[900px]:grid-cols-1 max-[900px]:gap-y-[24px]">
          {WAYS.map((way) => (
            <Link
              key={way.href}
              href={way.href}
              className={`tw-card group row-span-5 grid grid-rows-subgrid gap-y-0 border border-black/[.14] text-black no-underline transition-[border-color,scale] duration-200 ${EASE} hover:border-black focus-visible:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black active:scale-[.99] motion-reduce:active:scale-100`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F6F6]">
                <ProductMark kind={way.mark} className="absolute inset-x-0 top-[12%] mx-auto h-[76%] w-full overflow-visible" halfClassName="tw-half" />
              </div>
              <div className="px-[36px] pt-[32px] max-[600px]:px-[24px] max-[600px]:pt-[24px]">
                <span className={`${EYEBROW} text-black/60`}>{way.label}</span>
                <h3 className="mt-[14px] font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] font-normal">{way.name}</h3>
              </div>
              <p className={`mt-[14px] px-[36px] text-black/70 max-[600px]:px-[24px] ${BODY}`}>{way.lead}</p>
              <ul className="mx-[36px] mt-[28px] list-none border-t border-t-black/[.13] p-0 max-[600px]:mx-[24px]">
                {way.facts.map((fact) => (
                  <li key={fact} className="flex gap-[12px] border-b border-b-black/[.13] py-[12px] text-[15px] leading-[1.45]">
                    <span aria-hidden="true" className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F6A11A]" />
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="px-[36px] pt-[28px] pb-[36px] max-[600px]:px-[24px] max-[600px]:pb-[24px]">
                {/* The whole card is the link, so the button is drawn, not nested. */}
                <span className={`${BUTTON} border border-dashed border-black/10 group-hover:bg-black/[.03]`}>
                  See the details
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
