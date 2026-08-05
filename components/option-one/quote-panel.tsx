"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { QuoteUp } from "reicon-react";
import { EASE_OUT } from "@/lib/ease";

/**
 * A split pull-quote: ink on the left carrying the attribution, warm paper on
 * the right carrying the words.
 *
 * The attribution is the investment desk rather than a named individual, and the
 * words are the firm's own stated position rather than a client's. An invented
 * investor testimonial on a SEBI-registered manager's page would be a
 * misrepresentation, not a placeholder. Swap in a real named quote — with the
 * speaker's sign-off and compliance review — when the client provides one.
 */
export default function QuotePanel() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.8, delay, ease: EASE_OUT },
        };

  return (
    <section
      aria-label="From the investment desk"
      className="grid min-h-[600px] grid-cols-2 max-[900px]:min-h-0 max-[900px]:grid-cols-1"
    >
      <div className="flex flex-col bg-[#111111] p-[52px] text-white max-[600px]:p-[28px]">
        <i className="not-italic text-[#b8862f]" aria-hidden="true">
          <QuoteUp size={54} />
        </i>
        <motion.div {...reveal(0.1)} className="mx-auto mt-[80px] max-[900px]:mt-[42px] max-[900px]:mx-0">
          <Image
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=90"
            alt="A Moneybee portfolio manager at the investment desk"
            width={132}
            height={132}
            className="h-[132px] w-[132px] object-cover"
          />
          <b className="mt-[24px] block text-[15px] font-[550] tracking-[-.02em]">Moneybee Investment Desk</b>
          <small className="mt-[8px] block text-[10px] uppercase tracking-[.1em] text-[rgba(255,255,255,.55)]">
            Mumbai, Maharashtra, India
          </small>
        </motion.div>
      </div>

      <div className="flex flex-col justify-start bg-[#eceae5] p-[52px] max-[600px]:p-[28px]">
        <motion.blockquote
          {...reveal(0.18)}
          className="max-w-[620px] text-[clamp(1.6rem,2.6vw,2.5rem)] font-light leading-[1.14] tracking-[-.035em] text-[#111111]"
        >
          A good company is not a good investment at every price. Most of the work is deciding which of those two
          questions you are actually answering.
        </motion.blockquote>
        <motion.p
          {...reveal(0.28)}
          className="mt-[34px] max-w-[430px] text-[11px] leading-[1.55] text-[rgba(17,17,17,.62)]"
        >
          The clearest evidence of how a manager thinks is what they publish when they are not selling anything.
        </motion.p>
      </div>
    </section>
  );
}
