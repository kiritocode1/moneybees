"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { PERIOD_RETURNS, WEALTH } from "@/lib/insights";

/**
 * Antimetal's "representational gap" chart (reference/antimetal/source,
 * .repgap), rebuilt on the deck's wealth figure: Rs. 1 Mn from August 2007 to
 * July 2026, Moneybee PMS against the S&P BSE 500 TRI (AIF presentation p12).
 *
 * The deck gives the two end values, not the yearly path, so each curve is the
 * constant-rate path between Rs. 1 Mn and its end value. The geometry (viewBox,
 * axis, ticks, stroke widths, dash pattern, label boxes) is copied from the
 * pinned source.
 */

const X0 = 129;
const X1 = 666;
const BASE = 520;
/** Rs. Mn at the top of the plot. */
const CEILING = 30;
const y = (value: number) => BASE - (value / CEILING) * (BASE - 40);
const curve = (end: number) =>
  Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    return `${i ? "L" : "M"}${(X0 + (X1 - X0) * t).toFixed(1)} ${y(end ** t).toFixed(1)}`;
  }).join(" ");

const SINCE = PERIOD_RETURNS.find((row) => row.period === "Since Inception");
/** Where the gap is measured, most of the way along. */
const GAP_T = 0.82;
const GAP_X = X0 + (X1 - X0) * GAP_T;
const GAP_TOP = y(WEALTH.queenbee ** GAP_T);
const GAP_BOTTOM = y(WEALTH.benchmark ** GAP_T);

const xTicks = Array.from({ length: 20 }, (_, i) => ({ x: X0 + 27.35 * (i + 1), major: (i + 1) % 5 === 0 }));
const yTicks = Array.from({ length: 20 }, (_, i) => ({ y: BASE - 25.7 * (i + 1), major: (i + 1) % 5 === 0 }));

const EYEBROW = "font-[family-name:var(--font-geist-mono)] text-[10px] leading-normal tracking-[.1em] uppercase";
const POP = [0.34, 1.55, 0.6, 1] as const;

export default function WealthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  // Drawn when in view with either motion setting; reduced motion zeroes the durations instead, so hydration matches.
  const run = inView;
  const at = (delay: number, duration = 0.6) => ({ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay });
  const pct = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div ref={ref} className="relative aspect-[680/560] w-full max-w-[680px]">
      <svg
        viewBox="0 0 680 560"
        role="img"
        aria-label={`Rs. 1 Mn invested in August 2007 grew to Rs. ${WEALTH.queenbee} Mn in Moneybee PMS by July 2026, against Rs. ${WEALTH.benchmark} Mn in the S&P BSE 500 TRI.`}
        className="block h-full w-full overflow-visible"
      >
        <motion.g initial={false} animate={{ opacity: run ? 1 : 0 }} transition={at(0)}>
          <line x1={X0} y1="6" x2={X0} y2={BASE} stroke="rgba(0,0,0,.34)" strokeDasharray="2 5" strokeLinecap="round" />
          <line x1={X0} y1={BASE} x2="676" y2={BASE} stroke="rgba(0,0,0,.34)" strokeDasharray="2 5" strokeLinecap="round" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: run ? 1 : 0 }} transition={at(0.05, 0.65)} strokeLinecap="round">
          {xTicks.map(({ x, major }) => (
            <line key={x} x1={x} y1="524" x2={x} y2={major ? 532 : 528} stroke={major ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.28)"} />
          ))}
          {yTicks.map(({ y: ty, major }) => (
            <line key={ty} x1={major ? 117 : 121} y1={ty} x2="125" y2={ty} stroke={major ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.28)"} />
          ))}
        </motion.g>

        <motion.path
          d={curve(WEALTH.benchmark)}
          fill="none"
          stroke="#9D9EA1"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ ...at(0.3, 1.6), ease: [0.45, 0, 0.2, 1] }}
        />
        <motion.path
          d={curve(WEALTH.queenbee)}
          fill="none"
          stroke="#F7A11A"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ ...at(0.3, 1.6), ease: [0.45, 0, 0.2, 1] }}
        />
        {(
          [
            [WEALTH.benchmark, "#9D9EA1"],
            [WEALTH.queenbee, "#F7A11A"],
          ] as const
        ).map(([value, fill]) => (
          <motion.circle
            key={fill}
            cx={X1}
            cy={y(value)}
            r="4.6"
            fill={fill}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            initial={false}
            animate={{ scale: run ? 1 : 0, opacity: run ? 1 : 0 }}
            transition={{ ...at(1.9, 0.5), ease: POP }}
          />
        ))}
        <motion.g
          stroke="#000"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(2.2, 0.18)}
        >
          <line x1={GAP_X} y1={GAP_TOP + 4} x2={GAP_X} y2={GAP_BOTTOM - 4} />
          <path d={`M${GAP_X - 8} ${GAP_TOP + 12} L${GAP_X} ${GAP_TOP + 4} L${GAP_X + 8} ${GAP_TOP + 12}`} />
          <path d={`M${GAP_X - 8} ${GAP_BOTTOM - 12} L${GAP_X} ${GAP_BOTTOM - 4} L${GAP_X + 8} ${GAP_BOTTOM - 12}`} />
        </motion.g>
      </svg>

      {/* .graph__labels: HTML over the SVG so the mono type stays crisp. */}
      <div aria-hidden="true" className="absolute inset-0">
        <motion.span
          className={`${EYEBROW} absolute bg-[#FDEFE2] px-[9px] py-[5px] text-right whitespace-nowrap text-black`}
          style={{ left: `${(X1 / 680) * 100}%`, top: `${((y(WEALTH.queenbee) - 12) / 560) * 100}%`, translate: "-100% -100%" }}
          initial={false}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(2.1)}
        >
          Moneybee PMS
          <br />
          Rs. {WEALTH.queenbee} Mn
        </motion.span>
        <motion.span
          className={`${EYEBROW} absolute bg-[#F7F7F8] px-[9px] py-[5px] text-right whitespace-nowrap text-black`}
          style={{ left: `${(X1 / 680) * 100}%`, top: `${((y(WEALTH.benchmark) + 40) / 560) * 100}%`, translate: "-100% 0" }}
          initial={false}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(2.1)}
        >
          S&amp;P BSE 500 TRI
          <br />
          Rs. {WEALTH.benchmark} Mn
        </motion.span>
        {SINCE && (
          <motion.span
            className={`${EYEBROW} absolute bg-black px-[10px] py-[5px] whitespace-nowrap text-white`}
            // Above and left of the arrow's head, where the convex curve leaves the plot empty.
            style={{ left: `${((GAP_X - 14) / 680) * 100}%`, top: `${((GAP_TOP - 6) / 560) * 100}%`, translate: "-100% -100%" }}
            initial={false}
            animate={{ opacity: run ? 1 : 0 }}
            transition={at(2.3, 0.18)}
          >
            {pct(SINCE.queenbee)} against {pct(SINCE.benchmark)} a year
          </motion.span>
        )}
        <motion.span
          className={`${EYEBROW} absolute top-[78%] left-[16%] -translate-1/2 -rotate-90 whitespace-nowrap text-[rgba(0,0,0,.55)]`}
          initial={false}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(0.1, 0.7)}
        >
          Value of Rs. 1 Mn
        </motion.span>
        <motion.span
          className={`${EYEBROW} absolute top-[99%] left-[23%] -translate-1/2 whitespace-nowrap text-[rgba(0,0,0,.55)]`}
          initial={false}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(0.1, 0.7)}
        >
          2007 to 2026
        </motion.span>
      </div>
    </div>
  );
}
