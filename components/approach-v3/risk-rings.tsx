"use client";

import { useShown } from "@/components/about-v2/shared";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { APPROACH_LOREM, RISKS } from "@/lib/approach";

/*
 * Risk management (content plan §6) as the last stage of study 09: concentric
 * half-rings standing on a baseline, the core filled, a constant step between
 * rings and the core's radius 0.88 of that step. The core is the portfolio in
 * orange; the four rings are the risks around it, and the closing columns
 * carry each risk's name and text.
 */

type Motion = { shown: boolean; t: (ms: number, delay?: number) => string };

function Rings({ step, font, shown, t, className }: { step: number; font: number; className: string } & Motion) {
  const core = step * 0.88;
  const radius = (ring: number) => core + step * ring;
  const outer = radius(RISKS.length);
  return (
    <svg viewBox={`${-outer - 4} ${-outer - 4} ${outer * 2 + 8} ${outer + 4}`} width={outer * 2 + 8} className={`mx-auto block h-auto max-w-full ${className}`} aria-hidden="true">
      <path
        d={`M${-core} 0A${core} ${core} 0 0 1 ${core} 0Z`}
        fill="#F6A11A"
        style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "scale(.4)", transformBox: "fill-box", transformOrigin: "50% 100%", transition: `opacity ${t(420)}, transform ${t(700)}` }}
      />
      <text x={0} y={-core * 0.42} textAnchor="middle" dominantBaseline="central" fontSize={font} className="font-sans" fill="#000" style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(400, 500)}` }}>
        Portfolio
      </text>
      {RISKS.map((risk, index) => {
        const r = radius(index + 1);
        const delay = 420 + index * 160;
        return (
          <g key={risk.name} style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(520, delay)}` }}>
            <path d={`M${-r} 0A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke="#000" strokeWidth={1.25} strokeDasharray="1.6 2" />
          </g>
        );
      })}
    </svg>
  );
}

export function RiskRings() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="risk" aria-labelledby="risk-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <h2 id="risk-heading" className={`m-0 ${SUBHEAD}`}>
          Risk Management
        </h2>
        <div ref={ref} className="mt-14 md:mt-16">
          <Rings step={54} font={14} className="max-md:hidden" shown={shown} t={t} />
          <Rings step={32} font={10.5} className="md:hidden" shown={shown} t={t} />
          <div aria-hidden="true" className="h-px origin-left bg-black/40" style={{ transform: shown ? "none" : "scaleX(0)", transition: `transform ${t(1000)}` }} />
          <ol className="m-0 mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {RISKS.map((risk, index) => (
              <li key={risk.name} style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(12px)", transition: `opacity ${t(500, 700 + index * 120)}, transform ${t(700, 700 + index * 120)}` }}>
                <h3 className=" font-serif text-[clamp(1.6rem,1.3rem+.8vw,2rem)] leading-[1.1] font-normal">{risk.name}</h3>
                <p className="mt-3 max-w-[32ch] text-[15px] leading-[1.55] text-black/60">{APPROACH_LOREM.short}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
