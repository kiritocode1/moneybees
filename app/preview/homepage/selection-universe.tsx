"use client";

import { useId, useRef } from "react";
import { useInView } from "motion/react";
import s from "./preview.module.css";

const loops = [
  "M955 -47C790 60 879 394 1052 586C1240 795 1502 768 1437 482C1399 313 1173 -90 1047 -62",
  "M724 439C709 232 928 252 1020 482C1120.7 735.65 962.6425 783.4825 865.712 677.953375",
  "M609 552C550 363 732 411 817 583C899 750 810 788 745 758",
  "M565 670C475 538 624 487 670 668C688 735 676 757 654 767",
];
// Reversing the original connector makes the reveal travel from the universe to the portfolio.
const connector = "M1103 424C865 738 339 778 320 529";

function RollingNumber({ value, delayed = false }: { value: string; delayed?: boolean }) {
  return <strong aria-label={value} className={delayed ? s.rollDelayed : undefined}>
    <span className={s.numberRoll} aria-hidden="true">
      {[...value].map((character, index) => {
        if (!/\d/.test(character)) return <span key={index}>{character}</span>;
        const digit = Number(character);
        return <span key={index} className={s.digitWindow}>
          <span className={s.digitReel} style={{
            "--roll-end": `translateY(-${(10 + digit) * 1.15}em)`,
            "--roll-delay": `${index * 0.09}s`,
          } as React.CSSProperties}>
            {Array.from({ length: 20 }, (_, n) => <span key={n}>{n % 10}</span>)}
          </span>
          <span className={s.digitStill}>{character}</span>
        </span>;
      })}
    </span>
  </strong>;
}

export default function SelectionUniverse() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const filterId = useId().replaceAll(":", "");
  return <section id="universe" ref={ref} className={s.universe} data-running={visible}>
    <div className={s.universeMeta}><span>Moneybee</span><span>The selection process</span><span>Queenbee PMS</span></div>
    <h2>A window into<br />our selection process.</h2>
    <svg viewBox="0 0 1400 790" preserveAspectRatio="none" className={s.universeDrawing} fill="none" aria-hidden="true">
      <defs>
        <filter id={filterId} x="-10%" y="-15%" width="120%" height="130%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="soft" />
          <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 120 -25" result="joins" />
          <feMerge><feMergeNode in="joins" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g stroke="white" strokeWidth="2" strokeLinecap="round" filter={`url(#${filterId})`}>
        {loops.map((d) => <path key={d} d={d} className={s.universeLoop} style={{
          "--loop-x": "12px",
          "--loop-y": "-8px",
        } as React.CSSProperties} />)}
        <path d={connector} pathLength="1" className={s.universeConnector} />
        <circle r="5" fill="white" stroke="none" className={s.universeTraveller} />
      </g>
    </svg>
    <div className={s.universeStart}><RollingNumber value="~6,000" /><span>companies in the<br />starting research universe</span></div>
    <div className={s.universeEnd}><RollingNumber value="~20" delayed /><span>holdings in the<br />PMS portfolio</span></div>
    <div className={s.universeBottom}><p>~1,200 investable <b>·</b> ~350 shortlisted <b>·</b> &gt;100 analysed <b>·</b> ~75 investment ideas</p><small>Source: Moneybee Group Profile, April 2026, p. 13. Approximate company counts. Draft for review.</small></div>
  </section>;
}
