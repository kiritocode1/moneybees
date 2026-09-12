"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import SiteNavigation from "@/components/ui/site-navigation";
import s from "./preview.module.css";
import ResearchChart from "./research-chart";
import PreviewFooter from "./preview-footer";

const stages = [
  { label: "Discover", heading: "Which businesses deserve\na closer look?", copy: "We screen companies for size, financial fundamentals and management quality before committing to deeper research.", number: "~6,000", definition: "companies in the starting universe", detail: "~1,200 investable · ~350 shortlisted", note: "01 / The starting universe" },
  { label: "Investigate", heading: "Understand how the\nbusiness makes money.", copy: "We read annual reports, speak with management and visit plants. We compare the business with its peers to understand its earnings, prospects and risks.", number: ">100", definition: "companies studied in greater depth", detail: "~350 shortlisted · ~75 investment ideas", note: "02 / Research and conviction" },
  { label: "Construct & review", heading: "Keep testing the\nreasons we invested.", copy: "Valuation, liquidity and sector exposure shape the portfolio. We review holdings quarterly and reconsider an investment when changes in the business challenge our original assessment.", number: "~20", definition: "holdings in the PMS portfolio", detail: "Portfolio construction · Risk monitoring", note: "03 / Selection and monitoring" },
] as const;

function ResearchSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (window.matchMedia("(min-width: 901px)").matches && !reduceMotion) {
      setActive(Math.min(2, Math.floor(progress * 3)));
    }
  });
  const stage = stages[active];

  function chooseStage(index: number) {
    setActive(index);
    const section = ref.current;
    if (!section || reduceMotion || window.innerWidth <= 900) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((index + 0.2) / 3), behavior: "instant" });
  }

  return (
    <section id="research" ref={ref} className={s.researchTrack}>
      <div className={s.researchFrame}>
        <div className={s.visualPanel} data-stage={active}>
          <span className={s.visualKicker}>Moneybee / Investment approach</span>
          <ResearchChart progress={scrollYProgress} stage={active} />
          <small className={s.chartNote}>Investment process illustration. Not portfolio allocation.</small>
        </div>
        <div className={s.researchCopy}>
          <div className={s.ruleHeading}><span><i /> {String(active + 1).padStart(2, "0")}</span><span>How we build a portfolio</span></div>
          <div className={s.stageCopy} aria-live="polite">
            <p className={s.eyebrow}>{stage.note}</p>
            <h2>{stage.heading}</h2>
            <p className={s.description}>{stage.copy}</p>
            <div className={s.researchMetric}><strong>{stage.number}</strong><span>{stage.definition}</span></div>
            <p className={s.researchDetail}>{stage.detail}<small>Approximate PMS company counts.</small></p>
            <a className={s.textLink} href="#universe">View the selection stages</a>
          </div>
          <div className={s.stageControls} aria-label="Research stages">
            {stages.map((item, index) => <button type="button" key={item.label} aria-pressed={active === index} onClick={() => chooseStage(index)}>
              <span className={s.stageIcon}>{String(index + 1).padStart(2, "0")}</span>{item.label}<span className={s.stageLine} />
            </button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function OwnershipDiagram({ pooled = false }: { pooled?: boolean }) {
  const rows = [55, 130, 205];
  return <svg viewBox="0 0 500 260" fill="none" aria-hidden="true">
    <g strokeWidth="1.5">
      {rows.map((y, i) => <g key={y}>
        <circle cx="70" cy={y} r="15" stroke="#242424" />
        <path d={pooled ? `M85 ${y}C170 ${y} 170 130 224 130` : `M85 ${y}H340`} stroke={i === 1 ? "#F9A11B" : "#a6a5a0"} />
        {!pooled && <><rect x="340" y={y - 24} width="94" height="48" rx="24" stroke={i === 1 ? "#F9A11B" : "#a6a5a0"} />{[365, 387, 409].map(x => <circle key={x} cx={x} cy={y} r="5" fill={i === 1 ? "#F9A11B" : "#333"} />)}</>}
      </g>)}
      {pooled && <><circle cx="288" cy="130" r="64" stroke="#F9A11B" /><ellipse cx="288" cy="130" rx="29" ry="64" stroke="#F9A11B" /><path d="M352 130H422" stroke="#242424" /><circle cx="432" cy="130" r="10" fill="#242424" /></>}
    </g>
  </svg>;
}

export default function HomepagePreview() {
  return (
    <div className={s.preview}>
      <SiteNavigation>
        <main>
          <section id="performance" className={s.hero}>
            <div className={s.heroVisual}>
              <svg className={s.heroArtwork} viewBox="0 0 2048 1472" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image className={s.heroMotion} href="/preview/moneybee/hero-bars-motion.svg" width="2048" height="1472" /><image className={s.heroStill} href="/preview/moneybee/hero-bars.svg" width="2048" height="1472" /></svg>
              <div className={s.heroContent}>
            <div className={s.heroIntro}>
              <h1>Investment management with the discipline to be selective.</h1>
            </div>
            <div className={s.performanceGrid}>
              <div className={s.performanceMain}><div className={s.returnValue}>19.44<span>%</span></div><p>Since-inception CAGR</p></div>
              <div className={s.performanceBenchmark}><p className={s.eyebrow}>S&P BSE 500 TRI</p><div className={s.benchmarkValue}>9.90<span>%</span></div></div>

            </div>
              </div>
            </div>
            <div id="record" className={s.performanceNote}><span>Queenbee PMS inception: 1 August 2007. Figures as at 31 July 2026.</span><span>Draft figures from supplied client material, pending publication approval.<br />Past performance is not indicative of future results.</span></div>
            <a href="#research" className={s.nextSection}>How we select investments <span>↓</span></a>
          </section>

          <ResearchSection />

          <section id="universe" className={s.universe}>
            <div className={s.universeMeta}><span>Moneybee</span><span>The selection process</span><span>Queenbee PMS</span></div>
            <h2>A window into<br />our selection process.</h2>
            <svg viewBox="0 0 1400 790" preserveAspectRatio="xMidYMid slice" className={s.universeDrawing} fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M955 -47C790 60 879 394 1052 586C1240 795 1502 768 1437 482C1399 313 1173 -90 1047 -62" />
              <path d="M724 439C709 232 928 252 1020 482C1126 749 945 788 851 660" />
              <path d="M609 552C550 363 732 411 817 583C899 750 810 788 745 758" />
              <path d="M565 670C475 538 624 487 670 668C688 735 676 757 654 767" />
              <path d="M320 529C339 778 865 738 1103 424" />
            </g></svg>
            <div className={s.universeStart}><strong>~6,000</strong><span>companies in the<br />starting research universe</span></div>
            <div className={s.universeEnd}><strong>~20</strong><span>holdings in the<br />PMS portfolio</span></div>
            <div className={s.universeBottom}><p>~1,200 investable <b>·</b> ~350 shortlisted <b>·</b> &gt;100 analysed <b>·</b> ~75 investment ideas</p><small>Source: Moneybee Group Profile, April 2026, p. 13. Approximate company counts. Draft for review.</small></div>
          </section>

          <section id="products" className={s.products}>
            <div className={s.productHeading}><p className={s.eyebrow}>Ways to invest</p><h2>How would you<br />hold your investment?</h2></div>
            <div className={s.productGrid}>
              <article><div className={s.productTitle}><span>01 / Portfolio Management Services</span><h3>Queenbee PMS</h3></div><OwnershipDiagram /><div className={s.diagramCaption}><span>Individual investors</span><span>Separate portfolios</span></div><h4>Securities held<br />in your name.</h4><p>We manage the portfolio. You hold the securities in your own account.</p><Link className={s.textLink} href="/pms">Explore PMS</Link></article>
              <article><div className={s.productTitle}><span>02 / Alternative Investment Fund</span><h3>Flyingbee AIF</h3></div><OwnershipDiagram pooled /><div className={s.diagramCaption}><span>Multiple investors</span><span>A pooled fund</span></div><h4>Units in a<br />pooled fund.</h4><p>You hold units in Flyingbee, a Category III AIF. The fund invests pooled capital according to its stated mandate.</p><Link className={s.textLink} href="/aif">Explore AIF</Link></article>
            </div>
            <p className={s.productFootnote}>Ownership illustrations only. Review each product’s eligibility, terms and risks before investing.</p>
          </section>
          <PreviewFooter />
        </main>
      </SiteNavigation>
      <aside className={s.previewBar} aria-label="Section preview navigation"><span>Section studies <b>Draft</b></span><nav><a href="#performance">Performance</a><a href="#research">Research</a><a href="#universe">Full visual</a><a href="#products">PMS / AIF</a><a href="#footer">Footer</a></nav><Link href="/">Current homepage</Link></aside>
    </div>
  );
}
