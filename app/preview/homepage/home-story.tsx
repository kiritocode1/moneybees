"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./home-story.module.css";

const chapters = [
  { label: "The businesses", text: "We mainly invest in brick and mortar companies, traditional businesses that we understand.", image: "/preview/moneybee/story/workplace.avif" },
  { label: "The opportunity", text: "We focus on small companies where we can understand the downside and which have huge potential to grow.", image: "/preview/moneybee/story/workplace.avif" },
  { label: "The work", text: "Annual reports, management meetings and plant visits help us decide what a business is worth. We keep reviewing that decision while we hold it.", image: "/preview/moneybee/story/workplace.avif" },
] as const;

export function MoneybeeIntroduction() {
  return <section id="introduction" className={s.introduction}>
    <h2><span>Traditional businesses.</span><span className={s.indented}><Image src="/video/desk-analysis.jpg" width={230} height={130} alt="" />Understood</span><span className={s.lastLine}>in depth.</span></h2>
    <p>Moneybee invests in smaller Indian companies. We look for businesses we understand, where we can assess the downside and see room for growth.</p>
    <a href="#businesses">How we look at a business <span aria-hidden="true">↓</span></a>
  </section>;
}

export function BusinessStory() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
      const section = root.current;
      if (!section) return;
      const panels = section.querySelectorAll<HTMLElement>("[data-story-panel]");
      const texts = section.querySelectorAll<HTMLElement>("[data-story-text]");
      const markers = section.querySelectorAll<HTMLElement>("[data-story-marker]");
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true } });
      panels.forEach((panel, index) => {
        const photo = panel.querySelector("img");
        if (index > 0) timeline.fromTo(panel, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "none" }, index - 1);
        if (photo) timeline.fromTo(photo, { scale: 1.2 }, { scale: 1, duration: 1, ease: "none" }, Math.max(0, index - 1));
      });
      ScrollTrigger.create({
        trigger: section, start: "top top", end: "bottom bottom",
        onUpdate: ({ progress }) => {
          const active = Math.min(2, Math.floor(progress * 3));
          texts.forEach((text, i) => {
            text.dataset.active = String(i === active);
            text.inert = i !== active;
          });
          markers.forEach((marker, i) => { marker.dataset.active = String(i === active); });
        },
      });
      return () => { texts.forEach(text => { text.inert = false; }); };
    }, root);
    return () => media.revert();
  }, []);

  return <section id="businesses" ref={root} className={s.businesses} aria-label="How Moneybee invests">
    <div className={s.storyFrame}>
      <div className={s.storyLeft}>
        <div className={s.storyIndex} aria-hidden="true">{chapters.map((chapter, index) => <span key={chapter.label} data-story-marker data-active={index === 0}>0{index + 1}</span>)}</div>
        <div className={s.storyTexts}>{chapters.map((chapter, index) => <article key={chapter.label} data-story-text data-active={index === 0} className={s.storyText}>
          <p className={s.chapterLabel}>{chapter.label}</p><h2>{chapter.text}</h2>
          {index < 2 && <p className={s.attribution}>Shreyam Shah <span>On Moneybee&apos;s approach</span></p>}
          {index === 2 && <a href="#research">See the research process</a>}
        </article>)}</div>
        <svg viewBox="0 0 180 120" className={s.motif} aria-hidden="true">{[0, 12, 30, 54, 84, 120].map((x, i) => <rect key={x} x={x} y="0" width={4 + i * 3} height="120" fill="currentColor" />)}</svg>
      </div>
      <div className={s.storyImages} aria-hidden="true">{chapters.map((chapter, index) => <div key={chapter.label} className={s.storyPanel} data-story-panel>
        <Image src={chapter.image} alt="" fill sizes="(max-width: 991px) 100vw, 45vw" style={{ objectPosition: index === 2 ? "75% center" : index === 1 ? "25% center" : "center" }} />
      </div>)}</div>
    </div>
  </section>;
}


const companies = [
  "KPI Green Energy", "Pitti Engineering", "Uni Abex Alloy Products",
  "Fairchem Organics", "Privi Speciality Chemicals", "Tejas Networks",
] as const;

export function InvestmentExamples() {
  return <section id="investments" className={s.investors}>
    <div className={s.investorTop}>
      <div className={s.investorHeading}><h2>Businesses we<br />invested in.</h2></div>
      <div className={s.questions}>
        <details name="investment-examples"><summary>KPI Green Energy<span aria-hidden="true" /></summary><p>Renewable energy. One of the businesses featured in Moneybee&apos;s investment case studies.</p></details>
        <details name="investment-examples"><summary>Pitti Engineering<span aria-hidden="true" /></summary><p>Electrical steel laminations and engineering components. Featured in Moneybee&apos;s investment case studies.</p></details>
        <details name="investment-examples"><summary>Uni Abex Alloy Products<span aria-hidden="true" /></summary><p>Alloy castings for industrial applications. Featured in Moneybee&apos;s investment case studies.</p></details>
      </div>
    </div>
    <ul className={s.companyField} aria-label="Past investment examples">{companies.map(company => <li key={company}>{company}</li>)}</ul>
    <p className={s.exampleNote}>Historical examples from Moneybee&apos;s supplied presentations. Not a list of current holdings or investment recommendations. Past performance does not indicate future results.</p>
  </section>;
}

export function MoneybeeNumbers() {
  return <section id="numbers" className={s.numbers}>
    <h2>Moneybee in numbers</h2>
    <div className={s.numberGrid}>
      <div><p>Companies in the research universe</p><strong>~6,000</strong></div>
      <div><p>Holdings in the PMS portfolio</p><strong>~20</strong></div>
    </div>
    <div className={s.numberFacts}>
      <p><strong>3+ years</strong><span>Minimum PMS investment horizon</span></p>
      <p><strong>30%</strong><span>Stated maximum sector allocation</span></p>
    </div>
    <p className={s.numberSource}>Moneybee Group Profile, April 2026. Approximate company counts; sector limit is a policy ceiling, not current allocation.</p>
  </section>;
}

const team = [
  { name: "Dhiren Shah", role: "Managing Director" },
  { name: "Shreyam Shah", role: "Fund Manager, Flyingbee AIF" },
  { name: "Suprit Shah", role: "Compliance Officer" },
] as const;

export function TeamSection() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const width = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    el.scrollBy({ left: direction * (width + 32), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section id="team" className={s.team}>
    <div className={s.teamHeading}><h2>Meet the team</h2><div className={s.teamControls}><button type="button" aria-label="Previous team member" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next team member" onClick={() => move(1)}>→</button></div></div>
    <div ref={track} className={s.teamTrack} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Moneybee team"
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}
      onPointerDown={event => { if (event.pointerType !== "mouse") return; drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { if (drag.current) event.currentTarget.scrollLeft = drag.current.scroll + drag.current.x - event.clientX; }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}>
      {team.map((person, index) => <article key={person.name} className={s.teamCard} aria-label={`${index + 1} of ${team.length}: ${person.name}`}>
        <div className={s.portraitSpace} aria-hidden="true" />
        <h3>{person.name}</h3><p>{person.role}</p>
      </article>)}
    </div>
    <div className={s.registrations}><p>Portfolio manager <span>INP000001959</span></p><p>Category III AIF <span>IN/AIF3/24-25/1709</span></p></div>
  </section>;
}
