import { ArrowUpRight, MoneybeeMark } from "@/components/moneybee-mark";

const rules = [
  ["Understand", "the business before valuing the security."],
  ["Question", "the consensus before following it."],
  ["Hold", "while the underlying business compounds."],
  ["Refuse", "even a good company at the wrong price."],
];

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-black/15 ${className}`}>{children}</div>;
}

export default function Option2() {
  return (
    <main className="bg-white text-[#171714] selection:bg-[#f6cf36]">
      <header className="sticky top-0 z-40 border-b border-black/15 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto] items-center px-5 py-4 sm:px-8 lg:grid-cols-[220px_1fr_auto] lg:px-10">
          <MoneybeeMark />
          <nav aria-label="Main navigation" className="hidden gap-8 text-xs uppercase tracking-[0.12em] lg:flex">
            <a href="#thesis">Thesis</a>
            <a href="#mandates">Mandates</a>
            <a href="#research">Research</a>
            <a href="#firm">Firm</a>
          </nav>
          <a href="#contact" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            Start a conversation <ArrowUpRight />
          </a>
        </div>
      </header>

      <section className="mx-auto grid min-h-[760px] max-w-[1600px] grid-cols-1 px-5 sm:px-8 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="hidden border-r border-black/15 py-10 pr-7 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Research file</p>
            <p className="mt-2 font-mono text-xs">MB / 1979—∞</p>
          </div>
          <div className="space-y-5 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-black/40">
            <p>Fundamental<br />Bottom-up<br />India</p>
            <p>Small steps<br />Big outcomes</p>
          </div>
        </aside>

        <div className="relative grid overflow-hidden lg:grid-cols-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.08) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="relative z-10 pb-12 pt-16 sm:pt-24 lg:col-span-10 lg:pl-12 lg:pt-28">
            <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
              <span className="size-2 bg-[#f6cf36]" /> Investment thesis / note 001
            </p>
            <h1 className="max-w-6xl text-[clamp(4.3rem,9.5vw,9.6rem)] font-medium leading-[0.84] tracking-[-0.065em]">
              Finding value
              <br />
              where the market
              <br />
              <span className="relative inline-block">
                isn&apos;t looking.
                <span aria-hidden="true" className="absolute -bottom-2 left-0 h-3 w-full -rotate-1 bg-[#f6cf36] mix-blend-multiply" />
              </span>
            </h1>
            <div className="mt-14 grid max-w-4xl gap-8 border-t border-black/20 pt-6 sm:grid-cols-2">
              <p className="max-w-lg text-base leading-relaxed text-black/65">
                Moneybee studies overlooked businesses from the ground up. We value
                evidence over attention, time over activity, and clarity over noise.
              </p>
              <div className="sm:text-right">
                <a href="#thesis" className="group inline-flex items-center gap-2 text-sm font-semibold">
                  Open the investment thesis
                  <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:col-span-2 lg:block">
            <p className="absolute right-0 top-1/2 -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-black/35">
              Observation → Understanding → Conviction
            </p>
          </div>
        </div>
      </section>

      <section id="firm" className="border-y border-black/15 bg-[#f6f5f0]">
        <div className="mx-auto grid max-w-[1600px] px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-[220px_repeat(4,1fr)] lg:px-10">
          <div className="hidden items-center border-r border-black/15 pr-7 text-[10px] uppercase tracking-[0.18em] text-black/40 lg:flex">Verified context</div>
          {[
            ["1979", "Experience in Indian capital markets begins"],
            ["2004", "Moneybee is established"],
            ["₹50L", "PMS minimum"],
            ["₹1Cr", "AIF minimum"],
          ].map(([value, label]) => (
            <Cell key={value} className="border-b py-7 sm:border-l sm:pl-6 lg:border-b-0">
              <p className="font-mono text-2xl tracking-[-0.04em]">{value}</p>
              <p className="mt-2 max-w-40 text-xs leading-relaxed text-black/50">{label}</p>
            </Cell>
          ))}
        </div>
      </section>

      <section id="thesis" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[220px_1fr]">
          <aside className="border-b border-black/15 py-10 pr-7 lg:border-b-0 lg:border-r">
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Method / 04 rules</p>
          </aside>
          <div className="py-20 lg:py-28 lg:pl-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:col-span-8 lg:text-8xl">
                A repeatable process<br />for an unrepeatable market.
              </h2>
              <p className="max-w-sm self-end text-sm leading-relaxed text-black/55 lg:col-span-4">
                Our framework is deliberately simple. The work required to apply it
                is not.
              </p>
            </div>
            <div className="mt-16 border-t border-black/20">
              {rules.map(([verb, copy], index) => (
                <article key={verb} className="group grid gap-5 border-b border-black/20 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline">
                  <span className="font-mono text-xs text-black/35">0{index + 1}</span>
                  <h3 className="text-3xl tracking-[-0.04em] sm:text-5xl">
                    <span className="font-semibold">{verb}</span>{" "}
                    <span className="text-black/40 transition-colors group-hover:text-black/70">{copy}</span>
                  </h3>
                  <span aria-hidden="true" className="hidden size-3 bg-[#f6cf36] transition-transform group-hover:rotate-45 sm:block" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="mandates" className="border-y border-black/15 bg-[#f6f5f0]">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-black/15 py-10 pr-7 lg:border-b-0 lg:border-r">
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Mandates / 02</p>
            </aside>
            <div className="grid gap-px bg-black/15 lg:grid-cols-2 lg:ml-12">
              {[
                ["PMS", "A portfolio you can see clearly.", "Separately managed", "₹50 lakh minimum"],
                ["AIF", "A concentrated expression of conviction.", "Long-term mandate", "₹1 crore minimum"],
              ].map(([short, title, meta, minimum], index) => (
                <article key={short} className="group relative min-h-[500px] bg-[#f6f5f0] p-7 sm:p-10">
                  <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
                    <span>Mandate 0{index + 1}</span><span>{meta}</span>
                  </div>
                  <p className="mt-16 text-[clamp(5rem,10vw,9rem)] font-semibold leading-none tracking-[-0.08em] text-black/10 transition-colors group-hover:text-[#f6cf36]">{short}</p>
                  <h3 className="absolute bottom-24 left-7 max-w-md text-4xl font-medium leading-tight tracking-[-0.045em] sm:left-10 sm:text-5xl">{title}</h3>
                  <div className="absolute inset-x-7 bottom-7 flex items-center justify-between border-t border-black/20 pt-4 text-xs sm:inset-x-10">
                    <span>{minimum}</span><ArrowUpRight />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[220px_1fr]">
          <aside className="border-b border-black/15 py-10 pr-7 lg:border-b-0 lg:border-r">
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Published evidence</p>
          </aside>
          <div className="py-20 lg:py-28 lg:pl-12">
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <h2 className="text-5xl font-medium tracking-[-0.055em] sm:text-7xl">From the investment desk.</h2>
              <a href="#contact" className="flex items-center gap-2 text-sm font-semibold">Read every note <ArrowUpRight /></a>
            </div>
            <div className="mt-14 grid gap-px bg-black/15 sm:grid-cols-3">
              {[
                ["01", "Investment letter", "Patience is an active decision"],
                ["02", "Sector note", "The businesses between the headlines"],
                ["03", "Risk note", "Drawdown, explained plainly"],
              ].map(([n, type, title]) => (
                <a key={n} href="#contact" className="group flex min-h-72 flex-col justify-between bg-white p-6 transition-colors hover:bg-[#f6cf36]">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-black/45"><span>{n}</span><span>{type}</span></div>
                  <h3 className="text-3xl font-medium leading-tight tracking-[-0.04em]">{title}</h3>
                  <ArrowUpRight className="self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#171714] text-white">
        <div className="mx-auto grid max-w-[1600px] px-5 sm:px-8 lg:grid-cols-[220px_1fr] lg:px-10">
          <aside className="border-b border-white/15 py-10 pr-7 lg:border-b-0 lg:border-r">
            <MoneybeeMark className="text-white" compact />
          </aside>
          <div className="py-20 lg:py-28 lg:pl-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">The next note begins with you</p>
            <h2 className="mt-8 max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Tell us what your capital needs to do—and what it cannot afford to lose.
            </h2>
            <a href="mailto:info@moneybee.in" className="mt-12 inline-flex items-center gap-3 bg-[#f6cf36] px-6 py-4 text-sm font-semibold text-black">
              Schedule a conversation <ArrowUpRight />
            </a>
            <div className="mt-24 grid gap-7 border-t border-white/15 pt-7 text-xs leading-relaxed text-white/45 sm:grid-cols-3">
              <MoneybeeMark className="text-white" />
              <p>Lower Parel, Mumbai<br />info@moneybee.in</p>
              <p>Investments in securities markets are subject to market risks. Read all related documents carefully.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
