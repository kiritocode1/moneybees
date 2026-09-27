"use client";

import Link from "next/link";
import { useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { AIF_PRODUCT, CONTACT, FAQS, PMS_PRODUCT, RANKINGS } from "@/lib/insights";

type Product = "pms" | "aif";

/*
 * The homepage sections that follow the peer pattern (see the competitor
 * comparison of 2026-09-27): recognition near the top, the two ways to invest,
 * a closing call to talk, and FAQs. Facts are the decks' own.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";
const GUTTER = "px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[22px]";

/** Recognition, after Wonder Vision's: the one centred section, plain facts, ranks in orange. */
export function RecognitionSection() {
  return (
    <section aria-labelledby="recognition-heading" className={`bg-white pt-[110px] pb-[120px] text-center ${GUTTER}`}>
      <h2 id="recognition-heading" className="text-[clamp(3rem,5.4vw,5.6rem)] leading-none font-light tracking-[-.05em] uppercase">
        Recognition
      </h2>
      <p className="mx-auto mt-[26px] max-w-[52ch] text-[16px] leading-[1.6] text-[rgba(0,0,0,.72)]">
        Ranked among India&rsquo;s top performing portfolio managers by PMS Bazaar, December 2024.
      </p>
      <dl className="mx-auto mt-[56px] grid max-w-[980px] grid-cols-3 border-y border-y-[#000] max-[600px]:grid-cols-1">
        {RANKINGS.map(([rank, period]) => (
          <div
            key={period}
            className="border-r border-r-[rgba(0,0,0,.13)] py-[34px] last:border-r-0 max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:last:border-b-0"
          >
            <dt className="text-[clamp(3.4rem,6vw,6rem)] leading-none font-light tracking-[-.05em] text-[#F7A11A]">{rank}</dt>
            <dd className="mt-[12px] text-[13px] uppercase tracking-[.06em] text-[rgba(0,0,0,.6)]">{period}</dd>
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
    facts: [PMS_PRODUCT.points[1], PMS_PRODUCT.points[2], PMS_PRODUCT.points[5]],
  },
  {
    href: "/aif",
    label: "Category III AIF",
    name: AIF_PRODUCT.name,
    lead: AIF_PRODUCT.lead,
    facts: ["Rs. 1 crore minimum", "3-5 years", "At least 51% listed, up to 49% unlisted"],
  },
] as const;

/** One philosophy, two ways to invest: the products up front, each leading to its own page. */
export function TwoWaysSection() {
  return (
    <section id="invest" aria-labelledby="invest-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[100px]`}>
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
              className={`group flex flex-col border border-[rgba(0,0,0,.14)] p-[36px] text-black no-underline transition-colors duration-300 hover:border-[#F7A11A] max-[600px]:p-[24px] ${FOCUS}`}
            >
              <span className={`${EYEBROW} text-black/60`}>{way.label}</span>
              <h3 className="mt-[18px] font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] font-normal">{way.name}</h3>
              <p className={`mt-[14px] text-black/70 ${BODY}`}>{way.lead}</p>
              <ul className="mt-[28px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
                {way.facts.map((fact) => (
                  <li key={fact} className="flex gap-[12px] border-b border-b-[rgba(0,0,0,.13)] py-[12px] text-[15px] leading-[1.45]">
                    <span className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F7A11A]" />
                    {fact}
                  </li>
                ))}
              </ul>
              <span className="mt-[28px] inline-flex items-center gap-[10px] text-[15px] font-medium">
                See the details
                <span className="h-[2px] w-[22px] bg-[#F7A11A] transition-all duration-300 group-hover:w-[40px]" />
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
    <section id="talk" aria-labelledby="talk-heading" className="bg-black text-white">
      <div className={`${COLUMN} grid grid-cols-[1.2fr_1fr] items-end gap-12 py-[110px] max-[900px]:grid-cols-1`}>
        <Rise onView>
          <h2 id="talk-heading" className="font-serif text-[clamp(2.6rem,5vw,4.8rem)] leading-[1.02] font-normal">
            Let&rsquo;s talk about your portfolio
          </h2>
        </Rise>
        <Rise onView delay={0.1}>
          <div className="flex flex-col gap-[22px]">
            <a
              href={`mailto:${CONTACT.emails[1][1]}`}
              className={`inline-flex w-fit items-center rounded-full bg-[#F7A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-colors hover:bg-white ${FOCUS}`}
            >
              Schedule a conversation
            </a>
            <p className="text-[15px] leading-[1.6] text-white/70">
              {CONTACT.phones.map((phone, index) => (
                <span key={phone}>
                  {index > 0 && " · "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={`text-white no-underline hover:text-[#F7A11A] ${FOCUS}`}>
                    {phone}
                  </a>
                </span>
              ))}
              <br />
              <a href={`mailto:${CONTACT.emails[1][1]}`} className={`text-white no-underline hover:text-[#F7A11A] ${FOCUS}`}>
                {CONTACT.emails[1][1]}
              </a>
            </p>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/**
 * FAQs as an accordion, one open at a time. The answers come from
 * lib/insights.ts; a product page passes `product` to show only its questions.
 */
export function FaqSection({ product }: { product?: Product }) {
  const [open, setOpen] = useState<number | null>(0);
  const questions = FAQS.filter(([, , scope]) => !product || scope === "both" || scope === product);
  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-[.8fr_1.2fr] gap-12 py-[110px] max-[900px]:grid-cols-1`}>
        <div>
          <BracketLabel>FAQs</BracketLabel>
          <h2 id="faqs-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Questions we are often asked
          </h2>
        </div>
        <div className="border-t border-t-black">
          {questions.map(([question, answer], index) => {
            const expanded = open === index;
            return (
              <div key={question} className="border-b border-b-[rgba(0,0,0,.13)]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-${index}`}
                    onClick={() => setOpen(expanded ? null : index)}
                    className={`flex w-full items-center justify-between gap-[24px] py-[22px] text-left text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal ${FOCUS}`}
                  >
                    {question}
                    <span
                      aria-hidden="true"
                      className={`relative h-[14px] w-[14px] shrink-0 before:absolute before:top-1/2 before:left-0 before:h-[2px] before:w-full before:-translate-y-1/2 before:bg-[#F7A11A] after:absolute after:top-0 after:left-1/2 after:h-full after:w-[2px] after:-translate-x-1/2 after:bg-[#F7A11A] after:transition-transform after:duration-300 ${expanded ? "after:scale-y-0" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-${index}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <p className="overflow-hidden pr-[40px] text-[16px] leading-[1.6] text-black/70">
                    <span className="block pb-[24px]">{answer}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
