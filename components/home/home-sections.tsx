import Link from "@/components/transition/transition-link";
import { COLUMN } from "@/components/hero/editorial";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

/** The FAQ and Get Started animate on the client, and Two ways carries its own mark styles, so they live in their own files. */
export { FaqSection } from "./faq-section";
export { GetStartedSection } from "./get-started-section";
export { TwoWaysSection } from "./two-ways-section";

/*
 * The homepage sections that follow the peer pattern (see the competitor
 * comparison of 2026-09-27): the two ways to invest, the plan's Get Started
 * section and FAQs, each in its own file and re-exported here, plus the old
 * closing band below. Recognition moved to /about on 2026-10-06.
 */

const FOCUS_ON_DARK =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const EASE = "ease-[cubic-bezier(.23,1,.32,1)]";

/** The old closing band. The homepage replaced it with GetStartedSection (get-started-section.tsx); only the unrouted pages in components/products still render it. */
export function LetsTalkSection() {
  return (
    <section
      id="talk"
      aria-labelledby="talk-heading"
      className="bg-black text-white"
    >
      <div
        className={`${COLUMN} grid grid-cols-[1.2fr_1fr] items-end gap-12 py-[120px] max-[900px]:grid-cols-1 max-[600px]:py-[80px]`}
      >
        {/* No entrance here: this band closes every page and must read even before any reveal runs. */}
        <h2
          id="talk-heading"
          className="font-serif text-[clamp(2.6rem,5vw,4.8rem)] leading-[1.02] font-normal"
        >
          Let&rsquo;s talk about your portfolio
        </h2>
        <div className="flex flex-col gap-[22px]">
          <Link
            href={ENQUIRY_HREF}
            className={`inline-flex w-fit items-center rounded-full bg-[#F6A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[background-color,scale] duration-200 ${EASE} hover:bg-white active:scale-[.97] ${FOCUS_ON_DARK}`}
          >
            Get Started
          </Link>
          {/* The content plan's contact details, not the AIF deck's product line. */}
          <p className="text-[15px] leading-[1.6] text-white/70">
            <a
              href="tel:+912240302080"
              className={`text-white no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS_ON_DARK}`}
            >
              022-4030 2080
            </a>
            <br />
            <a
              href="mailto:info@moneybee.in"
              className={`text-white no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS_ON_DARK}`}
            >
              info@moneybee.in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
