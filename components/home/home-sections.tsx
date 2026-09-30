import Link from "next/link";
import {
  BODY,
  COLUMN,
  DashedRule,
  EYEBROW,
  Rise,
  SUBHEAD,
} from "@/components/hero/editorial";
import { AIF_PRODUCT, CONTACT, PMS_PRODUCT, RANKINGS } from "@/lib/insights";

/** The FAQ is the one interactive block here; it lives in its own client file. */
export { FaqSection } from "./faq-section";

/*
 * The homepage sections that follow the peer pattern (see the competitor
 * comparison of 2026-09-27): recognition near the top, the two ways to invest,
 * a closing call to talk, and FAQs. Facts are the decks' own. Server
 * components: only the Rise wrappers and the FAQ run on the client.
 */

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
const FOCUS_ON_DARK =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const EASE = "ease-[cubic-bezier(.23,1,.32,1)]";
const GUTTER = "px-6 md:px-[120px]";

/**
 * Recognition, after Wonder Vision's: the one centred section, plain facts.
 * Each rank is the value of its period, so the period is the <dt> and the rank
 * the <dd>, shown above it. Ranks are ink; orange marks the ruled top edge.
 */
export function RecognitionSection() {
  return (
    <section
      aria-labelledby="recognition-heading"
      className={`bg-white pt-[120px] pb-[120px] text-center max-[600px]:py-[80px] ${GUTTER}`}
    >
      <h2
        id="recognition-heading"
        className="text-[clamp(3rem,5.4vw,5.6rem)] leading-none font-light tracking-[-.05em] uppercase"
      >
        Recognition
      </h2>
      <p className="mx-auto mt-[26px] max-w-[52ch] text-[16px] leading-[1.6] text-[rgba(0,0,0,.72)]">
        Ranked among India&rsquo;s top-performing portfolio managers by PMS
        Bazaar, December 2024.
      </p>
      <dl className="mx-auto mt-[56px] grid max-w-[980px] grid-cols-3 border-b border-b-black max-[600px]:grid-cols-1">
        {RANKINGS.map(([rank, period]) => (
          <div
            key={period}
            className="relative flex flex-col-reverse justify-end border-t border-t-black border-r border-r-[rgba(0,0,0,.13)] py-[34px] last:border-r-0 max-[600px]:border-r-0"
          >
            <i
              aria-hidden="true"
              className="absolute top-[-2px] left-1/2 h-[3px] w-[32px] -translate-x-1/2 bg-[#F6A11A]"
            />
            <dt className="mt-[12px] text-[13px] uppercase tracking-[.06em] text-black/60">
              {period}
            </dt>
            <dd className="m-0 text-[clamp(3.4rem,6vw,6rem)] leading-none font-light tracking-[-.05em] text-black tabular-nums">
              {rank}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const WAYS = [
  {
    href: "/pms",
    label: "Portfolio Management Service",
    name: PMS_PRODUCT.name,
    lead: "The stocks sit in your own demat account.",
    facts: [
      PMS_PRODUCT.points[1],
      PMS_PRODUCT.points[2],
      PMS_PRODUCT.points[5],
    ],
  },
  {
    href: "/aif",
    label: "Category III AIF",
    name: AIF_PRODUCT.name,
    lead: AIF_PRODUCT.lead,
    facts: [
      "Rs. 1 crore minimum",
      "3 to 5 years",
      "At least 51% listed, up to 49% unlisted",
    ],
  },
] as const;

/** One philosophy, two ways to invest: the products up front, each leading to its own page. */
export function TwoWaysSection() {
  return (
    <section
      id="invest"
      aria-labelledby="invest-heading"
      className="bg-white text-black"
    >
      <DashedRule />
      <div className={`${COLUMN} py-[120px] max-[600px]:py-[80px]`}>
        <Rise onView>
          <h2 id="invest-heading" className={SUBHEAD}>
            Two ways to invest with us
          </h2>
        </Rise>
        <div className="mt-[48px] grid grid-cols-2 gap-[24px] max-[900px]:grid-cols-1">
          {WAYS.map((way) => (
            <Link
              key={way.href}
              href={way.href}
              className={`group flex flex-col border border-[rgba(0,0,0,.14)] p-[36px] text-black no-underline transition-[border-color,scale] duration-200 ${EASE} hover:border-black active:scale-[.99] max-[600px]:p-[24px] ${FOCUS}`}
            >
              <span className={`${EYEBROW} text-black/60`}>{way.label}</span>
              <h3 className="mt-[18px] font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] font-normal">
                {way.name}
              </h3>
              <p className={`mt-[14px] text-black/70 ${BODY}`}>{way.lead}</p>
              <ul className="mt-[28px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
                {way.facts.map((fact) => (
                  <li
                    key={fact}
                    className="flex gap-[12px] border-b border-b-[rgba(0,0,0,.13)] py-[12px] text-[15px] leading-[1.45]"
                  >
                    <span className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F6A11A]" />
                    {fact}
                  </li>
                ))}
              </ul>
              <span className="mt-[28px] inline-flex items-center gap-[10px] text-[15px] font-medium">
                See the details
                {/* Grows on hover by scaleX from its left end, not by width. */}
                <span
                  className={`h-[2px] w-[40px] origin-left scale-x-[.55] bg-[#F6A11A] transition-transform duration-200 ${EASE} group-hover:scale-x-100`}
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The closing ask, before the FAQs: one sentence, the way to book, and the direct lines. */
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
            href="/contact"
            className={`inline-flex w-fit items-center rounded-full bg-[#F6A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[background-color,scale] duration-200 ${EASE} hover:bg-white active:scale-[.97] ${FOCUS_ON_DARK}`}
          >
            Schedule a conversation
          </Link>
          <p className="text-[15px] leading-[1.6] text-white/70">
            {CONTACT.phones.map((phone, index) => (
              <span key={phone}>
                {index > 0 && " · "}
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className={`text-white no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS_ON_DARK}`}
                >
                  {phone}
                </a>
              </span>
            ))}
            <br />
            <a
              href={`mailto:${CONTACT.emails[1][1]}`}
              className={`text-white no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS_ON_DARK}`}
            >
              {CONTACT.emails[1][1]}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
