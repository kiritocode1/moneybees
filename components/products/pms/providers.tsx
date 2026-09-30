"use client";

import { motion } from "motion/react";
import { EYEBROW } from "@/components/hero/editorial";
import { PMS_PRODUCT } from "@/lib/insights";
import { PMS_HEADINGS, PROVIDERS, REPORTING } from "@/lib/pms";
import { MONO, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * Best practices, group profile p27: the four service providers around the
 * PMS, and the reporting a client receives. The reporting runs across one
 * financial year: two statements every month, then the audited statements
 * when the year closes.
 */

const NODES = [
  { x: 112, y: 64 },
  { x: 528, y: 64 },
  { x: 112, y: 296 },
  { x: 528, y: 296 },
] as const;
const CENTRE = { x: 320, y: 180 };

function ProviderMap() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className="w-full">
      <svg viewBox="0 0 640 360" role="img" aria-label={`Moneybee PMS and its service providers: ${PROVIDERS.map((provider) => `${provider.name} for ${provider.service.toLowerCase()}`).join(", ")}.`} className="block h-auto w-full overflow-visible">
        {NODES.map((node, index) => (
          <motion.path
            key={index}
            d={`M${node.x} ${node.y} C ${node.x} ${CENTRE.y}, ${(node.x + CENTRE.x) / 2} ${CENTRE.y}, ${CENTRE.x} ${CENTRE.y}`}
            fill="none"
            stroke="rgba(0,0,0,.45)"
            strokeWidth="1"
            strokeDasharray="3 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: run ? 1 : 0, opacity: run ? 1 : 0 }}
            transition={at(0.35 + index * 0.12, 0.9)}
          />
        ))}
        <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: run ? 1 : 0, scale: run ? 1 : 0.85 }} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} transition={at(0, 0.6)}>
          <rect x={CENTRE.x - 92} y={CENTRE.y - 30} width="184" height="60" rx="30" fill="#000" />
          <text x={CENTRE.x} y={CENTRE.y + 7} textAnchor="middle" className="fill-white font-serif text-[22px]">
            {PMS_PRODUCT.name}
          </text>
        </motion.g>
        {NODES.map((node, index) => (
          <motion.g
            key={PROVIDERS[index].name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: run ? 1 : 0, y: run ? 0 : 8 }}
            transition={at(0.9 + index * 0.12, 0.5)}
          >
            <rect x={node.x - 110} y={node.y - 30} width="220" height="60" fill="#fff" stroke="rgba(0,0,0,.18)" strokeDasharray="2 4" />
            {/* The corner marks, as on the site's dashed buttons. */}
            {[
              [-110, -30, 1, 1],
              [110, -30, -1, 1],
              [-110, 30, 1, -1],
              [110, 30, -1, -1],
            ].map(([dx, dy, sx, sy]) => (
              <path
                key={`${dx}${dy}`}
                d={`M${node.x + dx} ${node.y + dy + sy * 7}V${node.y + dy}H${node.x + dx + sx * 7}`}
                fill="none"
                stroke="#000"
                strokeWidth="1.4"
              />
            ))}
            <circle cx={node.x - 88} cy={node.y} r="5" fill={ORANGE} />
            <text x={node.x - 74} y={node.y - 3} className="fill-black font-serif text-[19px]">
              {PROVIDERS[index].name}
            </text>
            <text x={node.x - 74} y={node.y + 16} className={`${MONO} fill-black/55 text-[9px] tracking-[.08em] uppercase`}>
              {PROVIDERS[index].service}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/** Financial year months, April to March. */
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] as const;

/** Twelve months, two statements each, then the audited year-end statements. */
function ReportingYear() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div className={`${EYEBROW} mb-[20px] flex flex-wrap gap-x-[22px] gap-y-[10px] text-black/70`}>
        <span className="flex items-center gap-[8px]">
          <i className="h-[10px] w-[10px] bg-[#F6A11A]" />
          {REPORTING[0][1]}
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[10px] w-[10px] bg-black" />
          {REPORTING[1][1]}
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[10px] w-[10px] border border-black" />
          {REPORTING[2][1]}
        </span>
      </div>
      <ol className="grid list-none grid-cols-[repeat(12,1fr)_1.6fr] gap-[4px] p-0 max-[700px]:grid-cols-6">
        {MONTHS.map((month, index) => (
          <li key={month} className="border-t border-t-[rgba(0,0,0,.2)] pt-[10px]">
            <span className={`${MONO} text-[10px] tracking-[.06em] text-black/55 uppercase`}>{month}</span>
            <div className="mt-[10px] grid gap-[4px]">
              <motion.span
                className="block h-[18px] origin-left bg-[#F6A11A]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: run ? 1 : 0 }}
                transition={at(0.1 + index * 0.08, 0.35)}
              />
              <motion.span
                className="block h-[18px] origin-left bg-black"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: run ? 1 : 0 }}
                transition={at(0.18 + index * 0.08, 0.35)}
              />
            </div>
          </li>
        ))}
        <li className="border-t border-t-black pt-[10px] max-[700px]:col-span-6">
          <span className={`${MONO} text-[10px] tracking-[.06em] text-black uppercase`}>Year end</span>
          <motion.div
            className="mt-[10px] flex h-[40px] items-center justify-center border border-black text-center font-serif text-[16px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: run ? 1 : 0, scale: run ? 1 : 0.9 }}
            transition={at(0.1 + 12 * 0.08 + 0.2, 0.5)}
          >
            Audited
          </motion.div>
        </li>
      </ol>
    </div>
  );
}

/** Who looks after the money alongside us, and what the client receives. */
export default function Providers() {
  return (
    <PmsSection id="providers">
      <PmsSectionHead id="providers" label="Best practices" heading={PMS_HEADINGS.providers} wide />
      <div className="mt-[72px] grid grid-cols-[1.2fr_.8fr] items-center gap-[64px] max-[900px]:grid-cols-1 max-[900px]:gap-[40px]">
        <div className="max-[700px]:hidden">
          <ProviderMap />
        </div>
        <dl className="border-t border-t-black">
          {PROVIDERS.map((provider) => (
            <div key={provider.name} className="grid grid-cols-[1fr_1.2fr] gap-6 border-b border-b-[rgba(0,0,0,.13)] py-[18px]">
              <dt>
                <span className={`${EYEBROW} block text-black/55`}>{provider.service}</span>
                <span className="mt-[6px] block font-serif text-[1.5rem] leading-[1.1]">{provider.name}</span>
              </dt>
              <dd className="text-[15px] leading-[1.5] text-black/70">{provider.role}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-[110px] max-[900px]:mt-[72px]">
        <h3 className="font-serif text-[clamp(1.9rem,2.6vw,2.4rem)] leading-[1.1] font-normal">{PMS_HEADINGS.reporting}</h3>
        <div className="mt-[32px]">
          <ReportingYear />
        </div>
      </div>
    </PmsSection>
  );
}
