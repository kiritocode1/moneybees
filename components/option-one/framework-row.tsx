"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

/**
 * The institutions a SEBI-registered portfolio manager necessarily operates
 * within. Every name here is structural rather than commercial: the exchanges
 * trades are executed on, the depositories securities are held at, the regulator
 * and the industry body registration is held with, and the statutory grievance
 * platform. None of them is a partner or an endorsement, which is why the
 * heading says framework and not "our partners" — the same row in the reference
 * would be an untrue claim on a regulated firm's page.
 *
 * Custodian and banker are deliberately absent. Those are firm-specific and
 * belong here only once the client confirms them.
 */
const FRAMEWORK = [
  ["SEBI", "Regulator"],
  ["NSE", "Exchange"],
  ["BSE", "Exchange"],
  ["NSDL", "Depository"],
  ["CDSL", "Depository"],
  ["APMI", "Industry body"],
  ["SCORES", "Redressal"],
] as const;

export default function FrameworkRow() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Regulatory and market framework"
      className="border-y border-y-[rgba(17,17,17,.14)] bg-white px-[max(32px,calc((100vw_-_1480px)/2))] py-[38px] max-[600px]:px-[22px] max-[600px]:py-[30px]"
    >
      <span className="block text-[9px] uppercase tracking-[.14em] text-[rgba(17,17,17,.6)]">
        Regulatory and market framework
      </span>
      {/* Seven equal cells on desktop, folding to four then three so the
          wordmarks never crowd. Each cell centres its own mark, which is what
          keeps the row reading as a rhythm rather than a sentence. */}
      <ul className="mt-[42px] grid list-none grid-cols-7 gap-y-[34px] p-0 max-[900px]:grid-cols-4 max-[600px]:mt-[30px] max-[600px]:grid-cols-3">
        {FRAMEWORK.map(([name, role], index) => (
          <motion.li
            key={name}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : index * 0.06,
              ease: EASE_OUT,
            }}
            className="grid place-items-center gap-[7px] text-center"
          >
            <b className="text-[19px] font-[650] tracking-[-.03em] text-[#111111] max-[600px]:text-[16px]">
              {name}
            </b>
            <small className="text-[8px] uppercase tracking-[.08em] text-[rgba(17,17,17,.5)]">
              {role}
            </small>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
