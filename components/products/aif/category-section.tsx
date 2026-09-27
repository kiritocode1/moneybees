"use client";

import { motion, useInView } from "motion/react";
import { Fragment, type ReactNode, useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, DashedRule, EYEBROW, SUBHEAD } from "@/components/hero/editorial";
import { AIF_CATEGORIES, AIF_HEADINGS, CATEGORY_TABLE } from "@/lib/aif";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The underlined word the slide marks in a cell, drawn as an orange rule under it. */
function Marked({ text, word }: { text: string; word: string | null | undefined }) {
  if (!word) return <>{text}</>;
  const at = text.indexOf(` ${word} `);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at + 1)}
      <span className="underline decoration-[#F7A11A] decoration-2 underline-offset-[5px]">{word}</span>
      {text.slice(at + 1 + word.length)}
    </>
  );
}

/**
 * A small drawing for the rows where the difference is a shape rather than a
 * word: leverage allowed or not, where tax falls, and whether the scheme is
 * closed for three years or open.
 */
function Glyph({ row, column }: { row: string; column: number }) {
  const cat3 = column === 2;
  const stroke = cat3 ? "#000" : "rgba(0,0,0,.4)";
  const accent = cat3 ? "#F7A11A" : "rgba(0,0,0,.4)";
  let body: ReactNode = null;
  if (row === "Leverage") {
    body = cat3 ? (
      <path d="M5 9 L9 13 L17 4" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M6 4 L16 14 M16 4 L6 14" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    );
  } else if (row === "Taxation") {
    // The fund as a square, the investor as a dot; the orange mark is where the tax falls.
    body = (
      <>
        <rect x="2" y="4" width="10" height="10" fill="none" stroke={stroke} strokeWidth="1.3" />
        <line x1="12" y1="9" x2="30" y2="9" stroke={stroke} strokeWidth="1.3" strokeDasharray="2 3" />
        <circle cx="35" cy="9" r="4" fill="none" stroke={stroke} strokeWidth="1.3" />
        {cat3 ? <rect x="4.5" y="6.5" width="5" height="5" fill={accent} /> : <circle cx="35" cy="9" r="1.8" fill={stroke} />}
      </>
    );
  } else if (row === "Type of scheme") {
    body = cat3 ? (
      <path d="M2 4 V14 M2 9 H40" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="0 0" />
    ) : (
      <path d="M2 4 V14 M2 9 H30 M30 4 V14" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    );
  }
  if (!body) return null;
  return (
    <svg viewBox="0 0 44 18" width="44" height="18" aria-hidden="true" className="mb-[10px] block overflow-visible">
      {body}
    </svg>
  );
}

/**
 * The deck's three-category table (AIF presentation p2), set as a figure: Cat
 * III stands on its own raised card, lifted over the other two, and the rows
 * arrive one by one once the table is in view. On a phone each feature
 * becomes its own block, Cat III last and marked.
 */
export default function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const time = (delay: number, duration = 0.7) => ({ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: EASE });

  return (
    <section id="categories" aria-labelledby="categories-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} pt-[110px] pb-[120px]`}>
        <BracketLabel>AIFs are classified into three categories</BracketLabel>
        <h2 id="categories-heading" className={`mt-[18px] max-w-[980px] ${SUBHEAD}`}>
          {AIF_HEADINGS.category}
        </h2>

        <div ref={ref} className="relative mt-[72px] max-md:hidden">
          {/* The raised Cat III card sits behind the table's last column. */}
          <motion.div
            aria-hidden="true"
            className="absolute top-[-18px] bottom-[-18px] left-[76%] w-[24%] border border-black bg-white shadow-[0_18px_50px_rgba(0,0,0,.09)]"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={time(0.05, 0.8)}
          >
            <motion.i
              className="absolute top-[-1px] left-[-1px] h-[4px] w-[calc(100%+2px)] origin-left bg-[#F7A11A]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: inView ? 1 : 0 }}
              transition={time(0.5, 0.9)}
            />
          </motion.div>
          <table className="relative w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[27%]" />
              <col className="w-[27%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead>
              <tr>
                <th className={`${EYEBROW} pb-[22px] font-normal text-black/55`}>Feature</th>
                {AIF_CATEGORIES.map((category, column) => (
                  <th
                    key={category}
                    className={`pb-[22px] font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] leading-none font-normal ${column === 2 ? "px-[26px] pt-[18px] text-[#F7A11A]" : "pr-[24px] text-black/45"}`}
                  >
                    {category}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORY_TABLE.map((row, index) => (
                <motion.tr
                  key={row.feature}
                  className="align-top"
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={time(0.25 + index * 0.1)}
                >
                  <th scope="row" className={`${EYEBROW} border-t border-t-[rgba(0,0,0,.13)] py-[24px] pr-[24px] font-normal text-black/60`}>
                    {row.feature}
                  </th>
                  {row.cells.map((cell, column) => (
                    <td
                      key={column}
                      className={`border-t py-[22px] text-[17px] leading-[1.45] ${
                        column === 2 ? "border-t-[rgba(0,0,0,.13)] px-[26px] text-black" : "border-t-[rgba(0,0,0,.13)] pr-[24px] text-black/50"
                      }`}
                    >
                      <Glyph row={row.feature} column={column} />
                      <Marked text={cell} word={row.mark?.[column]} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one block per feature, the three categories stacked with Cat III last and marked. */}
        <dl className="mt-[48px] border-t border-t-black md:hidden">
          {CATEGORY_TABLE.map((row) => (
            <Fragment key={row.feature}>
              <dt className={`${EYEBROW} pt-[22px] pb-[10px] text-black/60`}>{row.feature}</dt>
              <dd className="grid gap-[8px] border-b border-b-[rgba(0,0,0,.13)] pb-[22px]">
                {row.cells.map((cell, column) => (
                  <p
                    key={column}
                    className={`grid grid-cols-[64px_1fr] gap-[12px] text-[15px] leading-[1.45] ${
                      column === 2 ? "border-l-[3px] border-l-[#F7A11A] bg-[#FDEFE2]/60 py-[8px] pl-[10px] text-black" : "pl-[13px] text-black/50"
                    }`}
                  >
                    <span className={`${EYEBROW} pt-[3px] ${column === 2 ? "text-black" : "text-black/45"}`}>{AIF_CATEGORIES[column].replace(" AIF", "")}</span>
                    <span>
                      <Marked text={cell} word={row.mark?.[column]} />
                    </span>
                  </p>
                ))}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}
