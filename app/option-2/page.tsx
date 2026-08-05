"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const NAV = ["About", "Approach", "Offerings"] as const;

const insights = [
  {
    title: "Why patience remains an edge",
    copy: "A practical note on time horizons, market noise, and the discipline required to let a sound thesis compound.",
    author: "Investment desk",
    role: "Moneybee Securities",
    image: "/option-2/avatar-2.jpg",
  },
  {
    title: "Reading beyond the quarter",
    copy: "How business quality, capital allocation, and durable unit economics shape our long-term research process.",
    author: "Research team",
    role: "Fundamental analysis",
    image: "/option-2/avatar-1.jpg",
  },
  {
    title: "The price of conviction",
    copy: "Why a good company is not automatically a good investment, and where valuation enters every decision.",
    author: "Portfolio team",
    role: "Moneybee Securities",
    image: "/option-2/avatar-3.jpg",
  },
  {
    title: "Risk before return",
    copy: "Position sizing, balance-sheet strength, and the questions we ask before committing client capital.",
    author: "Risk desk",
    role: "Portfolio oversight",
    image: "/option-2/avatar-4.jpg",
  },
] as const;

const approach = [
  {
    title: "Fundamental research",
    copy: "We understand the business before we value the security: its economics, incentives, history, and competitive position.",
    image: "/option-2/tab-research.jpg",
    ticker: "Fundamental research",
  },
  {
    title: "Long-term ownership",
    copy: "Business performance drives returns over years. Market noise drives them over weeks. We invest in the first.",
    image: "/option-2/tab-ownership.jpg",
    ticker: "Long-term ownership",
  },
  {
    title: "Valuation discipline",
    copy: "A good company is not a good investment at every price. Price is a decision in itself, not a detail of one.",
    image: "/option-2/tab-discipline.jpg",
    ticker: "Valuation discipline",
  },
] as const;

const principles = [
  ["Independent thinking", "Conviction comes from evidence we gather ourselves.", "/option-2/principle-1.avif"],
  ["Know every holding", "A focused portfolio keeps every decision visible and explainable.", "/option-2/principle-2.avif"],
  ["Act with patience", "Low turnover lets a sound thesis mature without needless friction.", "/option-2/feature-video.jpg"],
  ["Protect the downside", "Risk is considered before capital is committed, not after.", "/option-2/principle-3.avif"],
] as const;

const testimonials = [
  {
    quote: "Moneybee brought structure and calm to decisions that once felt driven by market noise.",
    copy: "The process is clear, the communication is direct, and every holding has a reason we can understand.",
    name: "Long-term investor",
    role: "Portfolio Management Service",
    image: "/option-2/avatar-2.jpg",
    tone: "light",
  },
  {
    quote: "The relationship begins with listening, not with a product.",
    copy: "Our objectives, risk appetite, and time horizon were understood before the portfolio conversation began.",
    name: "Moneybee investor",
    role: "Private client",
    image: "/option-2/avatar-1.jpg",
    tone: "green",
  },
  {
    quote: "We know what we own and why we own it.",
    copy: "That transparency has made it easier to remain patient through the inevitable movement of markets.",
    name: "Long-term investor",
    role: "Alternative Investment Fund",
    image: "/option-2/avatar-3.jpg",
    tone: "light",
  },
] as const;

const faqs = [
  ["What is Moneybee's investment approach?", "We use fundamental research, independent thinking, valuation discipline, and a long holding period to make investment decisions."],
  ["Who can invest in the Portfolio Management Service?", "The PMS is intended for eligible investors who meet the applicable regulatory minimum and are comfortable with equity-market risk."],
  ["How is portfolio risk managed?", "Risk is addressed through business-quality filters, valuation discipline, position sizing, portfolio construction, and ongoing review."],
  ["How often will I hear from the team?", "Investors receive periodic reporting and direct communication designed to explain portfolio decisions, performance, and material changes."],
  ["How can I begin a conversation?", "Use the investor portal or contact the Moneybee team to discuss your objectives, time horizon, and suitability before investing."],
] as const;

function Mark() {
  return (
    <span aria-hidden="true" className="relative block h-[28px] w-[31px]">
      <span className="absolute left-0 top-[3px] h-[17px] w-[12px] rounded-[2px] bg-current" />
      <span className="absolute left-[10px] top-[3px] h-[12px] w-[12px] rounded-[2px] bg-current" />
      <span className="absolute bottom-[2px] right-0 h-[9px] w-[9px] rounded-[2px] bg-current" />
      <span className="absolute left-[9px] top-[12px] h-[9px] w-[7px] bg-[#f3f2ee]" />
    </span>
  );
}

function Tag({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <span className={`inline-flex min-h-[29px] items-center rounded-[3px] px-4 text-[11px] font-medium uppercase tracking-[.12em] ${inverse ? "bg-[#f3f2ee] text-[#292c2a]" : "bg-[#849a84] text-[#f3f2ee]"}`}>
      {children}
    </span>
  );
}

function ArrowButton({ direction, onClick, disabled }: { direction: "left" | "right"; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-10 w-10 place-items-center rounded-full text-[20px] transition duration-300 disabled:opacity-30 ${direction === "right" ? "bg-[#637d65] text-white hover:scale-105" : "text-[#637d65] hover:bg-black/5"}`}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}

function PrimaryButton({ children, href = "#contact", ghost = false }: { children: React.ReactNode; href?: string; ghost?: boolean }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-[3px] border px-6 text-[15px] no-underline transition-colors ${ghost ? "border-[#d6d2c8] text-[#2d2b27] hover:border-[#637d65]" : "border-[#637d65] bg-[#637d65] text-white"}`}
    >
      <span className="relative z-[2] transition-transform duration-300 group-hover:-translate-y-[150%]">{children}</span>
      <span aria-hidden className="absolute translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">{children}</span>
      {!ghost && <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-[#292c2a] transition-transform duration-300 group-hover:scale-y-100" />}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header data-hero-nav className="absolute inset-x-3 top-3 z-40 h-14 rounded-[4px] bg-[rgba(243,242,238,.82)] p-1 text-[#2d2b27] backdrop-blur-md md:inset-x-4">
      <div className="flex h-full items-center">
        <a href="#top" aria-label="Moneybee home" className="ml-4 mr-8 flex items-center text-[#292c2a]">
          <Mark />
        </a>
        <nav className="hidden h-full flex-1 items-center justify-between md:flex">
          <div className="flex h-full items-center">
            {NAV.map((label) => (
              <div key={label} className="group/nav flex h-full items-center">
                <button type="button" className="flex h-full items-center gap-3 px-5 text-[15px]">
                  {label}<span className="mt-[-3px] rotate-45 border-b border-r border-current p-[3px] transition-transform group-hover/nav:rotate-[225deg]" />
                </button>
                <div className="pointer-events-none invisible absolute left-0 right-0 top-[52px] translate-y-2 rounded-b-[4px] bg-[#f3f2ee] p-8 opacity-0 shadow-xl transition duration-300 group-hover/nav:pointer-events-auto group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                  <div className="grid grid-cols-[.8fr_1.2fr_.75fr] gap-10">
                    <div>
                      <p className="text-[28px] font-light">{label === "About" ? "Built around patient capital" : label === "Approach" ? "Research before conviction" : "Ways to invest with us"}</p>
                      <p className="mt-5 max-w-[36ch] text-sm leading-6 text-black/55">A clear view of our philosophy, process, and the responsibilities that come with managing long-term capital.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["01", "02", "03"].map((n, index) => (
                        <a key={n} href={index === 0 ? "#about" : index === 1 ? "#approach" : "#stewardship"} className="group/card block">
                          <div className="relative h-36 overflow-hidden rounded-[3px]">
                            <Image src={["/option-2/feature-left.jpg", "/option-2/feature-right.avif", "/option-2/principle-3.avif"][index]} alt="" fill sizes="220px" className="object-cover transition-transform duration-700 group-hover/card:scale-105" />
                          </div>
                          <span className="mt-2 block text-[10px] uppercase tracking-[.12em]">{label} {n}</span>
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between rounded-[3px] bg-[#e5e2da] p-6">
                      <p className="text-[20px] leading-[1.25]">Small steps, big outcomes.</p>
                      <a href="#contact" className="mt-8 text-sm underline decoration-black/20 underline-offset-4">Speak with the team →</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <a href="#insights" className="px-5 text-[15px]">Perspectives</a>
          </div>
          <div className="flex h-full items-center gap-7">
            <a href="https://www.moneybee.in/register.php" className="text-[15px]">Investor login</a>
            <a href="#contact" className="grid h-12 place-items-center rounded-[3px] bg-[#637d65] px-6 text-[15px] text-white">Get started</a>
          </div>
        </nav>
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto mr-3 grid h-10 w-10 place-items-center md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-[3px]">
            <span className={`h-[2px] w-full bg-current transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-full bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-full bg-current transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      <div className={`absolute inset-x-0 top-[60px] overflow-hidden rounded-[4px] bg-[#292c2a] text-[#f3f2ee] transition-[max-height,opacity] duration-500 md:hidden ${open ? "visible max-h-[520px] opacity-100" : "pointer-events-none invisible max-h-0 opacity-0"}`}>
        <nav className="space-y-0 p-5">
          {[["About", "#about"], ["Approach", "#approach"], ["Offerings", "#stewardship"], ["Perspectives", "#insights"], ["Investor login", "https://www.moneybee.in/register.php"]].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 text-xl font-light">
              {label}<span>↗</span>
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-5 flex h-12 items-center justify-center rounded-[3px] bg-[#637d65]">Get started</a>
        </nav>
      </div>
    </header>
  );
}

export default function Option2() {
  const root = useRef<HTMLElement>(null);
  const insightTrack = useRef<HTMLDivElement>(null);
  const testimonialTrack = useRef<HTMLDivElement>(null);
  const tabMedia = useRef<HTMLDivElement>(null);
  const [activeApproach, setActiveApproach] = useState(2);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-nav]", { y: -18, autoAlpha: 0, duration: 0.7 })
          .from("[data-hero-tag]", { y: 18, autoAlpha: 0, duration: 0.65 }, "-=.2")
          .from("[data-hero-title]", { y: 60, autoAlpha: 0, duration: 1.05 }, "-=.4")
          .from("[data-hero-copy]", { y: 24, autoAlpha: 0, duration: 0.75 }, "-=.55");

        gsap.to("[data-hero-media]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "+=900", scrub: 1 },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: Number(element.dataset.revealY || 42),
            autoAlpha: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((element) => {
          gsap.from(element.children, {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 82%", once: true },
          });
        });

        gsap.to("[data-marquee]", { xPercent: -50, duration: 18, repeat: -1, ease: "none" });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.fromTo(element, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
      }, scope);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!tabMedia.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(tabMedia.current, { autoAlpha: 0.35, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" });
  }, [activeApproach]);

  const shift = (track: React.RefObject<HTMLDivElement | null>, amount: number) => {
    track.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <main ref={root} id="top" className="option-two overflow-clip bg-[#f3f2ee] text-[#2d2b27]">
      <section className="relative flex min-h-svh p-2" aria-label="Moneybee introduction">
        <Header />
        <div className="relative min-h-[calc(100svh-16px)] w-full overflow-hidden rounded-[4px] bg-[#637d65]">
          <video data-hero-media autoPlay loop muted playsInline poster="/option-2/hero-poster.jpg" className="absolute -inset-y-[8%] h-[116%] w-full object-cover">
            <source src="/option-2/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,35,31,.20)_0%,rgba(25,27,24,.12)_35%,rgba(23,25,21,.58)_100%)]" />
          <div className="absolute inset-x-[4.5%] bottom-[8%] z-10 grid items-end gap-12 text-[#f3f2ee] md:grid-cols-[2.05fr_.95fr]">
            <div>
              <div data-hero-tag className="mb-5 md:hidden">
                <span className="inline-flex items-center gap-3 rounded-[4px] bg-white/[.06] px-3 py-2 text-[12px] uppercase tracking-[.18em]"><i className="h-1 w-1 rounded-full bg-[#a9ff12]" /> Built for the long term <i className="h-1 w-1 rounded-full bg-[#a9ff12]" /></span>
              </div>
              <div className="relative max-w-[850px]">
                <h1 data-hero-title className="text-[clamp(3.2rem,5.55vw,5rem)] font-light leading-[1.1] tracking-[-.035em]">
                  <span className="md:block">We invest with </span>
                  <span className="md:block">discipline for long-term </span>
                  <span>outcomes</span>
                </h1>
                <span data-hero-tag className="absolute bottom-3 left-[345px] hidden items-center gap-3 rounded-[4px] bg-white/[.06] px-4 py-3 text-[11px] uppercase tracking-[.18em] md:inline-flex"><i className="h-1 w-1 rounded-full bg-[#a9ff12]" /> Built for the long term <i className="h-1 w-1 rounded-full bg-[#a9ff12]" /></span>
              </div>
            </div>
            <p data-hero-copy className="max-w-[340px] text-[15px] leading-6 text-white/90 md:mb-1">Moneybee manages capital through fundamental research, independent thinking, and patient ownership.</p>
          </div>
        </div>
      </section>

      <section id="about" className="overflow-hidden px-4 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1232px]">
          <div data-reveal className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
            <Tag>The Moneybee way</Tag>
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.2] tracking-[-.025em]">A focused investment practice built on clarity, conviction, and the patience to let good decisions compound.</h2>
          </div>
          <div data-stagger className="mt-16 grid gap-4 md:mt-20 md:grid-cols-3">
            <article className="relative flex min-h-[430px] flex-col justify-between rounded-[5px] bg-[#e5e2da] p-6 md:min-h-[500px]">
              <i aria-hidden className="absolute right-2 top-2 h-3 w-3 rounded-[2px] bg-[#637d65]" />
              <h3 className="max-w-[9ch] text-[31px] font-light leading-[1.4]">Independent thinking. Evidence first.</h3>
              <p className="max-w-[34ch] text-[15px] leading-6">Consensus is a starting point, never a reason to own a business. Conviction comes from work we can explain.</p>
            </article>
            <article className="relative min-h-[500px] overflow-hidden rounded-[5px] bg-[#899090]">
              <video autoPlay loop muted playsInline poster="/option-2/about-poster.jpg" className="absolute inset-0 h-full w-full object-cover"><source src="/option-2/about.mp4" type="video/mp4" /></video>
              <span aria-hidden className="absolute bottom-2 left-2 flex gap-1">{[0,1,2,3,4].map((n)=><i key={n} className="h-3 w-3 rounded-[2px] bg-[#e5e2da]" />)}</span>
            </article>
            <article className="relative flex min-h-[430px] flex-col justify-between rounded-[5px] bg-[#637d65] p-6 text-[#f3f2ee] md:min-h-[500px]">
              <i aria-hidden className="absolute right-2 top-2 h-3 w-3 rounded-[2px] bg-[#e5e2da]" />
              <h3 className="max-w-[11ch] text-[31px] font-light leading-[1.4]">Downside before upside</h3>
              <p className="max-w-[34ch] text-[15px] leading-6 text-white/90">Valuation, position sizing, and balance-sheet strength are considered before capital is committed.</p>
            </article>
          </div>
          <div data-reveal className="mt-14 flex justify-center gap-2"><PrimaryButton>Get started</PrimaryButton><PrimaryButton ghost>Our approach</PrimaryButton></div>
        </div>
      </section>

      <section id="insights" className="overflow-hidden bg-[#e5e2da] px-4 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-end justify-between gap-8">
            <div data-reveal>
              <Tag>From the investment desk</Tag>
              <h2 className="mt-9 max-w-[650px] text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.25] tracking-[-.025em]">Research, observations, and ideas for thinking clearly about long-term capital.</h2>
            </div>
            <div className="hidden gap-2 md:flex"><ArrowButton direction="left" onClick={()=>shift(insightTrack,-536)} /><ArrowButton direction="right" onClick={()=>shift(insightTrack,536)} /></div>
          </div>
          <div ref={insightTrack} data-reveal className="option-two-track mt-16 flex snap-x gap-6 overflow-x-auto pb-2">
            {insights.map((item) => (
              <article key={item.title} className="flex min-h-[384px] w-[min(86vw,512px)] shrink-0 snap-start flex-col justify-between rounded-[4px] border-t-[7px] border-[#637d65] bg-[#f3f2ee] p-10">
                <div><h3 className="text-[24px] font-light">{item.title}</h3><p className="mt-7 max-w-[43ch] text-[15px] leading-6">{item.copy}</p><a href="#contact" className="mt-7 inline-block text-[15px]">Read note <span className="ml-3">›</span></a></div>
                <div className="flex items-center gap-4 border-t border-black/10 pt-6">
                  <Image src={item.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                  <div><strong className="block text-[15px] font-medium">{item.author}</strong><span className="text-[13px] text-black/55">{item.role}</span></div>
                </div>
              </article>
            ))}
          </div>
          <div data-reveal className="mt-16 flex justify-center gap-2"><PrimaryButton>Get started</PrimaryButton><PrimaryButton ghost>View all notes</PrimaryButton></div>
        </div>
      </section>

      <section id="approach" className="flex min-h-svh bg-[#e5e2da] p-2">
        <div className="grid w-full overflow-hidden rounded-[4px] bg-[#292c2a] text-[#f3f2ee] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-20 md:px-[9%] lg:py-16">
            <div data-reveal><Tag inverse>Investment approach</Tag><h2 className="mt-6 max-w-[570px] text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.28]">The principles that guide every Moneybee investment decision.</h2></div>
            <div data-stagger className="mt-12 space-y-2">
              {approach.map((item,index)=>(
                <button key={item.title} type="button" onClick={()=>setActiveApproach(index)} className={`grid w-full grid-cols-[48px_1fr] gap-x-4 rounded-[3px] p-5 text-left transition-colors duration-300 ${activeApproach===index?"bg-[#637d65]":"hover:bg-white/[.035]"}`}>
                  <span className="mt-1 grid h-7 w-7 rotate-45 place-items-center border-b-2 border-r-2 border-current opacity-80"><i className="h-2 w-2 border-b-2 border-r-2 border-current" /></span>
                  <span><strong className="text-[17px] font-medium">{item.title}</strong><span className="mt-4 block max-w-[43ch] text-[15px] leading-6 text-white/80">{item.copy}</span></span>
                </button>
              ))}
            </div>
          </div>
          <div ref={tabMedia} className="relative min-h-[520px] overflow-hidden lg:min-h-0">
            <Image key={approach[activeApproach].image} src={approach[activeApproach].image} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-x-0 top-1/2 overflow-hidden -translate-y-1/2 whitespace-nowrap text-[clamp(3.5rem,7vw,7rem)] font-light text-white">
              <div data-marquee className="flex w-max">{[0,1,2,3].map(n=><span key={n} className="pr-7">{approach[activeApproach].ticker} →</span>)}</div>
            </div>
            <span aria-hidden className="absolute right-2 top-2 flex gap-1"><i className="h-3 w-3 rounded-[2px] bg-white" /><i className="h-3 w-3 rounded-[2px] bg-white" /><i className="h-3 w-3 rounded-[2px] bg-white" /></span>
          </div>
        </div>
      </section>

      <section id="stewardship" className="overflow-hidden px-4 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-[1360px]">
          <div data-reveal><Tag>Stewardship</Tag><h2 className="mt-10 max-w-[1100px] text-[clamp(2.45rem,4vw,4rem)] font-light leading-[1.28] tracking-[-.03em]">Designed to bring clarity, responsibility, and long-term alignment to every portfolio we manage.</h2></div>
          <p data-reveal className="ml-auto mt-16 max-w-[560px] text-[15px] leading-6 text-black/65">Moneybee is built for investors who value a comprehensible process over market predictions. We research deeply, communicate plainly, and treat every mandate as capital held in trust.</p>
          <div data-stagger className="mt-24 grid gap-4 md:grid-cols-[1.25fr_.85fr]">
            <article className="group relative min-h-[540px] overflow-hidden rounded-[4px] text-white md:min-h-[720px]">
              <Image data-parallax src="/option-2/feature-left.jpg" alt="A landscape seen from above" fill sizes="(max-width:768px) 100vw, 60vw" className="h-[110%]! object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/5" />
              <h3 className="absolute left-6 top-10 max-w-[8ch] text-[clamp(3.5rem,5vw,5rem)] font-light leading-[.95]">Built to tame complexity</h3>
              <p className="absolute bottom-8 left-6 max-w-[38ch] text-[15px] leading-6">Focused portfolios, transparent thinking, and a process designed to remain useful through changing markets.</p>
            </article>
            <div className="grid gap-4 md:grid-rows-[1.12fr_.88fr]">
              <article className="relative min-h-[420px] overflow-hidden rounded-[4px] text-white"><Image data-parallax src="/option-2/feature-right.avif" alt="A field moving in the wind" fill sizes="(max-width:768px) 100vw, 40vw" className="h-[110%]! object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><strong className="absolute bottom-7 left-6 text-[clamp(3rem,4vw,4.5rem)] font-light">₹50L</strong><p className="absolute bottom-7 right-6 max-w-[20ch] text-sm">Regulatory minimum for Portfolio Management Services.</p></article>
              <article className="relative min-h-[300px] overflow-hidden rounded-[4px] bg-[#637d65] p-7 text-white"><Image src="/option-2/hero-poster.jpg" alt="" fill sizes="40vw" className="object-cover opacity-40" /><div className="absolute inset-0 bg-[#637d65]/45" /><h3 className="relative max-w-[12ch] text-[34px] font-light leading-[1.18]">A process made to be understood.</h3><p className="absolute bottom-7 left-7 max-w-[34ch] text-sm leading-5">Every position should have a clear thesis, a price, and a reason to remain in the portfolio.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-4 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div data-reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center"><Tag>Trust builds outcomes</Tag><h2 className="mt-9 text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.3]">The disciplines that keep long-term investing grounded and accountable.</h2></div>
          <div data-stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([title,copy,image])=>(
              <article key={title} className="group relative min-h-[500px] overflow-hidden rounded-[5px] text-white">
                <Image src={image} alt="" fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                <div className="absolute inset-x-5 bottom-6"><h3 className="border-l border-white/70 pl-3 text-[22px] font-light">{title}</h3><p className="mt-4 text-[13px] leading-5 text-white/85">{copy}</p></div>
              </article>
            ))}
          </div>
          <div data-reveal className="mt-14 flex justify-center gap-2"><PrimaryButton>Get started</PrimaryButton><PrimaryButton ghost>Our philosophy</PrimaryButton></div>
        </div>
      </section>

      <section id="contact" className="flex min-h-[1100px] p-2 md:min-h-svh">
        <div className="relative min-h-[1084px] w-full overflow-hidden rounded-[4px] text-white md:min-h-[calc(100svh-16px)]">
          <Image data-parallax src="/option-2/hero-poster.jpg" alt="Alpine landscape" fill sizes="100vw" loading="eager" className="h-[110%]! object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,33,28,.17),rgba(32,36,24,.48))]" />
          <h2 data-reveal className="absolute left-[4%] top-[8%] max-w-[850px] text-[clamp(3.4rem,6vw,5.5rem)] font-light leading-[1.02]">Build wealth with clarity, patience, and purpose.</h2>
          <div data-reveal className="absolute bottom-[5%] left-[4%] right-[4%] grid grid-cols-2 gap-7 md:bottom-[7%] md:right-auto md:grid-cols-3 md:gap-9">
            {[['Office','Mumbai, Maharashtra','India'],['Approach','Fundamental research','Long-term ownership'],['Access','PMS and AIF','Investor portal']].map(([label,a,b], index)=><div key={label} className={`min-w-0 md:min-w-[210px] ${index===2?"col-span-2 md:col-span-1":""}`}><span className="text-[12px] uppercase">{label}</span><p className="mt-4 text-[17px] leading-7 md:mt-5 md:text-[20px] md:leading-8">{a}<br/>{b}</p></div>)}
          </div>
          <article data-reveal className="absolute left-[4%] top-[37%] flex min-h-[380px] w-[92%] flex-col justify-between rounded-[4px] bg-[linear-gradient(150deg,rgba(167,181,171,.9),rgba(70,83,39,.9))] p-7 backdrop-blur-sm md:bottom-[7%] md:left-auto md:right-[4%] md:top-auto md:min-h-[430px] md:w-[min(90%,350px)]">
            <i aria-hidden className="absolute right-3 top-3 h-3 w-3 rounded-[2px] bg-[#637d65]" />
            <h3 className="max-w-[10ch] text-[31px] font-light leading-[1.4]">Let’s start a conversation about your long-term objectives</h3>
            <p className="max-w-[30ch] text-[14px] leading-6">We would like to understand your goals before discussing our approach.</p>
          </article>
        </div>
      </section>

      <section id="testimonials" className="overflow-hidden bg-[#e5e2da] px-4 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-end justify-between"><div data-reveal><Tag>Investor perspective</Tag><h2 className="mt-9 max-w-[670px] text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.25]">Relationships built through clear thinking and candid communication.</h2></div><div className="hidden gap-2 md:flex"><ArrowButton direction="left" onClick={()=>shift(testimonialTrack,-376)} /><ArrowButton direction="right" onClick={()=>shift(testimonialTrack,376)} /></div></div>
          <div ref={testimonialTrack} data-reveal className="option-two-track mt-16 flex snap-x gap-6 overflow-x-auto pb-2">
            {testimonials.map((item)=>(
              <article key={item.quote} className={`flex min-h-[432px] w-[min(90vw,352px)] shrink-0 snap-start flex-col justify-between rounded-[5px] p-6 ${item.tone==='green'?"bg-[#637d65] text-white":"bg-[#f3f2ee]"}`}>
                <div><span className={`text-4xl font-medium ${item.tone==='green'?"text-white":"text-[#637d65]"}`}>“</span><h3 className="mt-4 text-[24px] font-light leading-[1.45]">{item.quote}</h3><p className="mt-4 text-[13px] leading-5 opacity-80">{item.copy}</p></div>
                <div className="flex items-center gap-4"><Image src={item.image} alt="" width={56} height={56} className="h-14 w-14 rounded-[3px] object-cover" /><div><strong className="block text-[15px] font-medium">{item.name}</strong><span className="text-[13px] opacity-60">{item.role}</span></div></div>
              </article>
            ))}
            <article className="relative min-h-[432px] w-[min(90vw,352px)] shrink-0 overflow-hidden rounded-[5px] text-white"><video autoPlay loop muted playsInline poster="/option-2/testimonial-video-poster.avif" className="absolute inset-0 h-full w-full object-cover"><source src="/option-2/testimonial.mp4" type="video/mp4" /></video><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><p className="absolute bottom-6 left-6 text-[15px]">A considered approach to capital.</p></article>
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-20 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1328px]">
          <div data-reveal className="mx-auto flex max-w-[650px] flex-col items-center text-center"><Tag>Frequently asked questions</Tag><h2 className="mt-9 text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.3]">Everything you need to know before beginning a conversation with Moneybee.</h2></div>
          <div data-stagger className="mt-16 space-y-2">
            {faqs.map(([question,answer],index)=>(
              <article key={question} className="rounded-[8px] bg-[#e5e2da]">
                <button type="button" aria-expanded={openFaq===index} onClick={()=>setOpenFaq(openFaq===index?null:index)} className="flex min-h-[90px] w-full items-center justify-between gap-6 p-6 text-left text-[16px] font-medium"><span>{question}</span><span className={`text-2xl font-light transition-transform duration-300 ${openFaq===index?"rotate-45":""}`}>+</span></button>
                <div className={`grid transition-[grid-template-rows] duration-500 ${openFaq===index?"grid-rows-[1fr]":"grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="max-w-[850px] px-6 pb-7 text-[15px] leading-6 text-black/65">{answer}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#292c2a] text-[#f3f2ee]">
        <div className="mx-auto flex max-w-[1296px] flex-col gap-28 px-6 pb-12 pt-24 md:px-0">
          <div data-reveal className="grid gap-16 md:grid-cols-[1.15fr_.9fr]">
            <div><Mark /><p className="mt-10 max-w-[380px] text-[15px] leading-6">Long-term investing perspectives from the Moneybee desk, shared with clarity.</p><form className="mt-6 flex max-w-[480px]" onSubmit={(event)=>event.preventDefault()}><input type="email" aria-label="Email address" placeholder="Enter your email" className="h-12 min-w-0 flex-1 bg-white/20 px-4 text-sm outline-none placeholder:text-white/65 focus:bg-white/25"/><button type="submit" aria-label="Subscribe" className="h-12 w-14 bg-[#637d65]">›</button></form><p className="mt-5 text-[11px] uppercase tracking-[.12em] text-white/45">Your information is never disclosed to third parties.</p></div>
            <div className="grid grid-cols-3 gap-8 text-sm">{[
              ["Explore",["About","Approach","Insights","Stewardship"]],
              ["Investors",["PMS","AIF","Investor login","Contact"]],
              ["Regulatory",["Disclosures","Investor charter","Grievances","SEBI SCORES"]],
            ].map(([heading,links])=><div key={heading as string}><h3 className="text-[12px] uppercase">{heading as string}</h3><div className="mt-8 space-y-4">{(links as string[]).map(link=><a key={link} href="#top" className="block text-white/80 hover:text-white">{link}</a>)}</div></div>)}</div>
          </div>
          <div data-reveal className="flex items-end justify-between"><p className="text-[clamp(3.4rem,9vw,8rem)] font-light leading-none tracking-[-.05em]">MONEYBEE®</p><a href="#top" aria-label="Back to top" className="grid h-12 w-12 place-items-center rounded-full bg-[#637d65] text-2xl">↑</a></div>
        </div>
        <div className="bg-black px-6 py-7 text-[12px] text-white/75"><div className="mx-auto flex max-w-[1296px] flex-wrap justify-between gap-5"><p>Moneybee Securities Pvt Ltd · Mumbai, Maharashtra, India</p><div className="flex gap-5"><a href="#top">Privacy</a><span className="opacity-30">|</span><a href="#top">Terms</a><span className="opacity-30">|</span><a href="#contact">Contact</a></div></div></div>
      </footer>
    </main>
  );
}
