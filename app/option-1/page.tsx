"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { EASE_OUT } from "@/lib/ease";

const researchImage =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=88";

const navItems = [
  ["Philosophy", "#philosophy"],
  ["Strategies", "#strategies"],
  ["Performance", "#performance"],
  ["The firm", "#firm"],
  ["Investment desk", "#desk"],
] as const;

const principles = [
  ["01", "Fundamental research", "Understand the business before valuing the security."],
  ["02", "Independent thinking", "Conviction comes from evidence, not consensus."],
  ["03", "Long-term ownership", "Let business performance, not market noise, drive outcomes."],
  ["04", "Valuation discipline", "A good company is not a good investment at every price."],
] as const;

const products = [
  {
    number: "01",
    name: "Portfolio Management Services",
    minimum: "₹50 lakh",
    facts: [
      "Securities held in the investor’s own name",
      "Portfolio visible holding by holding",
      "Discretionary mandate with a disclosed fee structure",
      "Returns reported against a stated benchmark",
    ],
  },
  {
    number: "02",
    name: "Alternative Investment Fund",
    minimum: "₹1 crore",
    facts: [
      "Pooled structure with a defined strategy and term",
      "Governed by the fund’s placement memorandum",
      "Different fee and distribution mechanics",
      "A narrower, larger set of eligible investors",
    ],
  },
] as const;

const evidence = [
  ["1979", "A career in Indian capital markets begins"],
  ["1995", "Sun Pharmaceuticals public issue"],
  ["2004", "Moneybee Securities is established"],
  ["2008", "Sale of Zandu to Emami"],
] as const;

function Wordmark() {
  return (
    <a href="#top" aria-label="Moneybee home" className="text-[18px] font-semibold tracking-[-0.055em]">
      moneybee<span className="text-[#d8aa17]">.</span>
    </a>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Rule({ light = false }: { light?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={reduceMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: reduceMotion ? 0 : 1, ease: EASE_OUT }}
      className={`h-px origin-left ${light ? "bg-white/20" : "bg-black/18"}`}
    />
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${light ? "text-white/45" : "text-black/42"}`}>
      {children}
    </p>
  );
}

function UnderlineLink({
  children,
  href,
  light = false,
}: {
  children: React.ReactNode;
  href: string;
  light?: boolean;
}) {
  return (
    <a href={href} className={`group inline-flex items-center gap-4 text-[13px] font-medium ${light ? "text-white" : "text-black"}`}>
      <span className="relative pb-1.5">
        {children}
        <span className={`absolute inset-x-0 bottom-0 h-px origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0 ${light ? "bg-white/55" : "bg-black/45"}`} />
      </span>
      <span className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1"><Arrow /></span>
    </a>
  );
}

export default function Option1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main id="top" className="option-one bg-[#f6f5f0] font-sans text-[#151512] selection:bg-[#e6bc2e]">
      <header className="relative z-50 border-b border-black/15 bg-[#f6f5f0]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE_OUT }}
          className="mx-auto flex h-[76px] max-w-[1540px] items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <Wordmark />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[12px] lg:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="relative py-2 text-black/62 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:text-black hover:after:origin-left hover:after:scale-x-100">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <a href="https://www.moneybee.in/register.php" target="_blank" rel="noreferrer" className="hidden text-[12px] text-black/58 transition-colors hover:text-black sm:block">
              Investor login
            </a>
            <a href="#conversation" className="hidden bg-[#171713] px-4 py-2.5 text-[12px] font-medium text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d8aa17] hover:text-black sm:block">
              Schedule a conversation
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center border border-black/20 lg:hidden"
            >
              <span className="relative h-3.5 w-4">
                <span className={`absolute left-0 top-0 h-px w-4 bg-black transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] h-px w-4 bg-black transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-black transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
              className="overflow-hidden border-t border-black/15 bg-[#f6f5f0] lg:hidden"
            >
              <div className="px-5 py-6 sm:px-8">
                {navItems.map(([label, href], index) => (
                  <motion.a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : index * 0.04 }}
                    className="flex items-center justify-between border-b border-black/12 py-4 text-lg"
                  >
                    {label}<span className="text-sm text-black/35">0{index + 1}</span>
                  </motion.a>
                ))}
                <a href="#conversation" onClick={() => setMenuOpen(false)} className="mt-6 flex items-center justify-between bg-black px-5 py-4 text-sm text-white">
                  Schedule a conversation <Arrow />
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="mx-auto grid min-h-[790px] max-w-[1540px] lg:grid-cols-12">
        <div className="flex flex-col justify-between px-5 py-16 sm:px-8 lg:col-span-7 lg:px-12 lg:pb-12 lg:pt-24">
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, delay: 0.1, ease: EASE_OUT }}
            >
              <Eyebrow>Moneybee Securities · Mumbai</Eyebrow>
            </motion.div>
            <h1 className="mt-10 max-w-4xl font-sans text-[clamp(3.35rem,8.4vw,8.9rem)] font-medium leading-[0.82] tracking-[-0.075em]">
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.95, delay: 0.08, ease: EASE_OUT }}
                >
                  Small steps,
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.95, delay: 0.18, ease: EASE_OUT }}
                >
                  Big Outcomes.
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.42, ease: EASE_OUT }}
              className="mt-9 max-w-xl text-[17px] leading-7 tracking-[-0.01em] text-black/62 sm:text-lg"
            >
              Finding value where the market is not looking.
            </motion.p>
          </div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.58 }}
            className="mt-20 grid gap-8 border-t border-black/18 pt-6 sm:grid-cols-2 lg:max-w-2xl"
          >
            <p className="text-[12px] leading-5 text-black/48">
              Fundamental, bottom-up research into overlooked businesses, informed by a capital-markets career that began in 1979.
            </p>
            <UnderlineLink href="#philosophy">Read our investment approach</UnderlineLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduceMotion ? 0 : 1.2, delay: 0.16, ease: EASE_OUT }}
          className="relative min-h-[520px] overflow-hidden lg:col-span-5 lg:min-h-full"
        >
          <motion.div
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.5, delay: 0.12, ease: EASE_OUT }}
            className="absolute inset-0"
          >
            <Image
              src={researchImage}
              alt="Investment documents being reviewed at a desk"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover grayscale"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/8" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/65 to-transparent p-6 pt-32 text-white sm:p-8">
            <p className="max-w-48 text-[11px] leading-5 text-white/70">Research before opinion.<br />Price before popularity.</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">01 / Approach</p>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-black/15 bg-white/45">
        <div className="mx-auto grid max-w-[1540px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {[
            ["INP000001959", "SEBI-registered portfolio manager"],
            ["NSE · BSE", "Exchange member"],
            ["CDSL", "Depository participant"],
            ["2004", "Firm established"],
          ].map(([value, label], index) => (
            <motion.div
              key={value}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: index * 0.07, ease: EASE_OUT }}
              className={`min-h-28 py-6 ${index % 2 ? "pl-5" : "pr-5"} ${index > 0 ? "lg:border-l lg:border-black/15 lg:pl-7" : ""}`}
            >
              <p className="text-[15px] font-medium tracking-[-0.025em]">{value}</p>
              <p className="mt-2 max-w-48 text-[11px] leading-4 text-black/42">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="philosophy" className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3"><Eyebrow>Investment philosophy</Eyebrow></div>
          <div className="lg:col-span-9">
            <h2 className="max-w-5xl font-sans text-[clamp(3.6rem,6.8vw,7.2rem)] font-medium leading-[0.92] tracking-[-0.065em]">
              Every investment carries risk. Managing it is our responsibility.
            </h2>
            <p className="mt-10 max-w-2xl text-base leading-7 text-black/54">
              We buy outstanding businesses at sensible prices and hold them for years. The process is simple to describe and demanding to apply.
            </p>
          </div>
        </Reveal>

        <div className="mt-24"><Rule /></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([number, title, copy], index) => (
            <motion.article
              key={number}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: index * 0.08, ease: EASE_OUT }}
              className="group flex min-h-[320px] flex-col justify-between border-b border-black/15 py-7 sm:border-r sm:px-6 lg:min-h-[370px] lg:px-7"
            >
              <div className="flex items-center justify-between text-[10px] text-black/32">
                <span>{number}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8aa17] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <h3 className="font-sans text-2xl font-medium leading-tight tracking-[-0.035em]">{title}</h3>
                <p className="mt-5 max-w-60 text-[12px] leading-5 text-black/48">{copy}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="strategies" className="border-y border-black/15 bg-[#eeede7]">
        <div className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
          <Reveal className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3"><Eyebrow>Two products</Eyebrow></div>
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl font-sans text-[clamp(3.5rem,6.5vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
                Different structures for different investors.
              </h2>
              <p className="mt-9 max-w-2xl text-sm leading-6 text-black/52">
                An investor with ₹60 lakh is eligible for one product and not the other. The distinction should be clear before a conversation begins.
              </p>
            </div>
          </Reveal>

          <div className="mt-20"><Rule /></div>
          <div>
            {products.map((product, productIndex) => (
              <motion.article
                key={product.name}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: productIndex * 0.08, ease: EASE_OUT }}
                className="group grid gap-8 border-b border-black/18 py-10 transition-colors duration-500 hover:bg-[#f6f5f0] sm:px-4 lg:grid-cols-[4rem_1.1fr_1fr_10rem] lg:items-start lg:px-6"
              >
                <span className="text-[11px] text-black/32">{product.number}</span>
                <h3 className="max-w-md font-sans text-3xl font-medium leading-[1.05] tracking-[-0.045em] sm:text-4xl">{product.name}</h3>
                <ul className="space-y-3 text-[12px] leading-5 text-black/50">
                  {product.facts.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
                <div className="lg:text-right">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">Minimum investment</p>
                  <p className="mt-2 text-xl font-medium tracking-[-0.03em]">{product.minimum}</p>
                  <span aria-hidden="true" className="mt-12 inline-block transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"><Arrow /></span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="performance" className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3"><Eyebrow>Performance</Eyebrow></div>
          <div className="lg:col-span-9">
            <h2 className="max-w-5xl font-sans text-[clamp(3.5rem,6.5vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              Returns matter. The path taken to achieve them matters too.
            </h2>
          </div>
        </Reveal>

        <Reveal className="mt-24 grid border-y border-black/18 lg:grid-cols-12" delay={0.08}>
          <div className="py-8 lg:col-span-3 lg:border-r lg:border-black/18 lg:pr-8">
            <p className="text-[12px] leading-5 text-black/50">
              Public figures appear here only after Moneybee&apos;s compliance team has reviewed and approved them.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
            {[
              ["01", "Returns against benchmark"],
              ["02", "Rolling returns"],
              ["03", "Drawdown history"],
              ["04", "Fees and TWRR methodology"],
            ].map(([number, label]) => (
              <div key={number} className="group flex min-h-52 flex-col justify-between border-t border-black/15 p-6 transition-colors duration-400 hover:bg-white sm:border-r lg:border-t-0">
                <span className="text-[10px] text-black/30">{number}</span>
                <p className="max-w-40 text-[15px] font-medium leading-5 tracking-[-0.02em]">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="mt-8 text-right" delay={0.12}>
          <UnderlineLink href="#conversation">Review the performance framework</UnderlineLink>
        </Reveal>
      </section>

      <section id="firm" className="bg-[#171713] text-white">
        <div className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
          <Reveal className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3"><Eyebrow light>The basis of credibility</Eyebrow></div>
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl font-sans text-[clamp(3.5rem,6.5vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
                A record in Indian capital markets that predates the Fund.
              </h2>
              <p className="mt-9 max-w-2xl text-sm leading-6 text-white/48">
                For a recently established AIF, investors assess the process, the people responsible for it, and whether decisions remain intelligible before and after the outcome.
              </p>
            </div>
          </Reveal>

          <div className="mt-24"><Rule light /></div>
          {evidence.map(([year, event], index) => (
            <motion.div
              key={year}
              initial={reduceMotion ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, delay: index * 0.06, ease: EASE_OUT }}
              className="group grid border-b border-white/18 py-6 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline"
            >
              <p className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{year}</p>
              <p className="mt-2 text-[13px] text-white/58 sm:mt-0">{event}</p>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-[#d8aa17] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />
            </motion.div>
          ))}
          <p className="mt-7 max-w-2xl text-[11px] leading-5 text-white/35">
            The firm&apos;s senior personnel bring fifteen, twenty and twenty-five years of experience respectively. Individual biographies and responsibilities belong on the full team page.
          </p>
        </div>
      </section>

      <section id="desk" className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3"><Eyebrow>From the investment desk</Eyebrow></div>
          <div className="lg:col-span-9">
            <h2 className="max-w-5xl font-sans text-[clamp(3.5rem,6.5vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              Published research is evidence that cannot be assembled retrospectively.
            </h2>
            <p className="mt-9 max-w-2xl text-sm leading-6 text-black/52">
              A sector note shows how the firm reasons. A quarterly letter shows how a decision was explained before its outcome was known.
            </p>
          </div>
        </Reveal>

        <div className="mt-24"><Rule /></div>
        <div className="grid lg:grid-cols-3">
          {[
            ["01", "Sector notes", "Businesses and sectors Moneybee researches directly, including smaller companies that receive limited coverage elsewhere."],
            ["02", "Market commentary", "Conditions and positioning, in the firm’s own voice, at a frequency the investment team can sustain."],
            ["03", "Investor letters", "Quarterly reasoning published where prospective investors can consider the decision and the outcome together."],
          ].map(([number, title, copy], index) => (
            <motion.article
              key={number}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: index * 0.08, ease: EASE_OUT }}
              className="group flex min-h-[330px] flex-col justify-between border-b border-black/15 py-7 lg:border-r lg:px-8"
            >
              <div className="flex justify-between text-[10px] text-black/30"><span>{number}</span><span>Published format</span></div>
              <div className="transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="font-sans text-3xl font-medium tracking-[-0.04em]">{title}</h3>
                <p className="mt-5 max-w-sm text-[12px] leading-5 text-black/48">{copy}</p>
              </div>
              <span className="self-end transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"><Arrow /></span>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="conversation" className="border-t border-black/15 bg-[#e1b526]">
        <div className="mx-auto grid max-w-[1540px] gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-32">
          <Reveal className="lg:col-span-3"><Eyebrow>A considered first step</Eyebrow></Reveal>
          <Reveal className="lg:col-span-9" delay={0.08}>
            <h2 className="max-w-5xl font-sans text-[clamp(3.5rem,6.5vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              Every meaningful investment relationship begins with a conversation.
            </h2>
            <p className="mt-8 max-w-xl text-sm leading-6 text-black/58">
              We&apos;d like to understand your objectives before discussing ours.
            </p>
            <a href="mailto:info@moneybee.in" className="group mt-12 inline-flex min-w-64 items-center justify-between bg-black px-5 py-4 text-[13px] font-medium text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black">
              Speak with our team <span className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1"><Arrow /></span>
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#f6f5f0] px-5 pb-24 pt-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1540px] gap-10 border-t border-black/18 pt-8 text-[11px] leading-5 text-black/46 sm:grid-cols-2 lg:grid-cols-4">
          <Wordmark />
          <p>Moneybee Securities Private Limited<br />303, Tower A, Peninsula Business Park<br />Lower Parel, Mumbai 400 013</p>
          <p>Stock broker · INZ000227335<br />Depository participant · IN-DP-CDSL-189-2016<br />Portfolio manager · INP000001959</p>
          <div>
            <p>Investments in securities markets are subject to market risks. Read all related documents carefully before investing.</p>
            <p className="mt-5 text-[9px] text-black/28">Research photograph by Scott Graham / Unsplash.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
