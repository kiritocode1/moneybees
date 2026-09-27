"use client";

import Link from "next/link";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, DashedRule, EYEBROW, HEADING, Rise, SUBHEAD } from "@/components/hero/editorial";
import { AIF_PRODUCT, PERIOD_RETURNS, PMS_PRODUCT, PMS_VS_AIF } from "@/lib/insights";

/*
 * The two products in their decks' own terms, one per product page (/pms and
 * /aif), in the homepage's editorial style: a hero with the product's figures,
 * then its details, and a band that points across to the other product.
 */

export type Product = "pms" | "aif";

const SINCE_INCEPTION = PERIOD_RETURNS.find((row) => row.period === "Since Inception");
const SIX_MONTHS = AIF_PRODUCT.performance.find(([period]) => period === "6 Months");

const PRODUCTS = {
  pms: {
    label: "Portfolio Management Service",
    name: PMS_PRODUCT.name,
    lead: "The stocks sit in your own demat account, chosen and looked after by our research team.",
    other: { href: "/aif", name: AIF_PRODUCT.name },
    figures: [
      ["15–20", "Small and mid-cap stocks"],
      ["3+ years", "The horizon we invest for"],
      [`${SINCE_INCEPTION?.queenbee.toFixed(2)}%`, `A year since 2007, against ${SINCE_INCEPTION?.benchmark.toFixed(2)}% for the S&P BSE 500 TRI`],
      ["None", "Exit load"],
    ],
  },
  aif: {
    label: "Category III Alternative Investment Fund",
    name: AIF_PRODUCT.name,
    lead: AIF_PRODUCT.lead,
    other: { href: "/pms", name: PMS_PRODUCT.name },
    figures: [
      ["Rs. 1 crore", "Minimum investment"],
      ["3–5 years", "Suitable time frame"],
      ["51% / 49%", "At least 51% listed, up to 49% unlisted"],
      [SIX_MONTHS?.[1] ?? "", `Six months, against ${SIX_MONTHS?.[2]} for the S&P BSE 500`],
    ],
  },
} as const;

/** The page's opening, set like the homepage hero: name, lead, the two ways on, and the product's figures in orange. */
export function ProductHero({ product }: { product: Product }) {
  const { label, name, lead, other, figures } = PRODUCTS[product];
  return (
    <section aria-labelledby="product-heading" className="bg-white text-black">
      <div className={`${COLUMN} pt-[200px] pb-[72px] max-md:pt-[140px]`}>
        <Rise>
          <span className={`${EYEBROW} text-black/60`}>{label}</span>
          <h1 id="product-heading" className={`mt-[18px] max-w-[900px] ${HEADING} text-[clamp(3rem,1.6rem+4.6vw,5.4rem)]`}>
            {name}
          </h1>
        </Rise>
        <Rise delay={0.08}>
          <p className={`mt-8 max-w-[640px] text-black/70 ${BODY}`}>{lead}</p>
        </Rise>
        <Rise delay={0.16}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="#talk" className={`${BUTTON} bg-black text-white hover:bg-black/85`}>
              Schedule a conversation
            </a>
            <Link href={other.href} className={`${BUTTON} border border-dashed border-black/10 text-black hover:bg-black/[.03]`}>
              {other.name}
              <CornerBrackets />
            </Link>
          </div>
        </Rise>
      </div>
      <dl className={`${COLUMN} grid grid-cols-4 gap-x-10 gap-y-8 border-t border-dashed border-black/10 pt-[32px] pb-[64px] max-md:grid-cols-2`}>
        {figures.map(([figure, caption]) => (
          <div key={caption}>
            <dt className="font-serif text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none text-[#F7A11A] tabular-nums">{figure}</dt>
            <dd className={`${EYEBROW} mt-[12px] max-w-[26ch] leading-[1.5] text-black/60`}>{caption}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The PMS in full: the deck's line beside every point it makes. */
export function PmsDetails() {
  return (
    <section aria-label="Moneybee PMS in detail" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-start gap-12 py-[100px] md:grid-cols-2`}>
        <Rise onView>
          <h2 className={SUBHEAD}>{PMS_PRODUCT.lead}</h2>
        </Rise>
        <ul className="list-none border-t border-t-black p-0">
          {PMS_PRODUCT.points.map((point) => (
            <li key={point} className={`flex gap-[16px] border-b border-b-[rgba(0,0,0,.13)] py-[18px] ${BODY}`}>
              <span className="mt-[.45em] h-[7px] w-[7px] shrink-0 bg-[#F7A11A]" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The fund in full: every term from the deck, then the returns it prints. */
export function AifDetails() {
  return (
    <section aria-label="Flyingbee Investment Fund in detail" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-start gap-12 py-[100px] md:grid-cols-[.8fr_1.2fr]`}>
        <Rise onView>
          <h2 className={SUBHEAD}>The terms of the fund</h2>
        </Rise>
        <div>
          <dl className="grid grid-cols-[200px_1fr] border-t border-t-black max-[600px]:grid-cols-1">
            {AIF_PRODUCT.terms.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className={`${EYEBROW} border-b border-b-[rgba(0,0,0,.13)] py-[18px] text-black/55 max-[600px]:border-0 max-[600px]:pb-0`}>{term}</dt>
                <dd className="border-b border-b-[rgba(0,0,0,.13)] py-[16px] text-[17px] leading-[1.45]">{value}</dd>
              </div>
            ))}
          </dl>
          <table className="mt-[48px] w-full border-collapse text-left">
            <thead>
              <tr className={`${EYEBROW} text-black/55`}>
                <th className="py-[10px] font-normal">TWRR returns</th>
                <th className="py-[10px] text-right font-normal">Flyingbee</th>
                <th className="py-[10px] text-right font-normal">S&amp;P BSE 500</th>
              </tr>
            </thead>
            <tbody>
              {AIF_PRODUCT.performance.map(([period, fund, index]) => (
                <tr key={period} className="border-t border-t-[rgba(0,0,0,.13)]">
                  <td className="py-[14px] text-[17px]">{period}</td>
                  <td className="py-[14px] text-right font-serif text-[1.6rem] text-[#F7A11A] tabular-nums">{fund}</td>
                  <td className="py-[14px] text-right text-[17px] text-black/60 tabular-nums">{index}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Points across to the other product, with the one line that separates them. */
export function CompareBand({ product }: { product: Product }) {
  const { other } = PRODUCTS[product];
  return (
    <section aria-label="PMS or AIF" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-10 py-[90px] md:grid-cols-[1fr_1fr]`}>
        <h2 className={SUBHEAD}>PMS or AIF?</h2>
        <div className="flex flex-col gap-6">
          <p className={BODY}>{PMS_VS_AIF}</p>
          <Link href={other.href} className="group inline-flex w-fit items-center gap-[10px] text-[16px] font-medium text-black no-underline">
            See {other.name}
            <span className="h-[2px] w-[22px] bg-[#F7A11A] transition-all duration-300 group-hover:w-[40px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
