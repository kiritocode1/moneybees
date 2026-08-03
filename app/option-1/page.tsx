import { ArrowUpRight, MoneybeeMark } from "@/components/moneybee-mark";

const principles = [
  ["01", "Fundamental research", "Understand the business before valuing the security."],
  ["02", "Independent thinking", "Conviction comes from evidence, not consensus."],
  ["03", "Long-term ownership", "Let business performance—not market noise—drive outcomes."],
  ["04", "Valuation discipline", "A good company is not a good investment at every price."],
];

const notes = [
  ["Investment letter", "The patience premium"],
  ["Sector note", "Where the market is not looking"],
  ["Perspective", "What a drawdown reveals"],
];

function TextLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#conversation"
      className="group inline-flex items-center gap-2 border-b border-black pb-1 text-sm font-medium"
    >
      {children}
      <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Option1() {
  return (
    <main className="overflow-hidden bg-[#f8f7f2] text-[#11110f] selection:bg-[#f5c928]">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between border-b border-black/15 px-5 py-5 sm:px-8 lg:px-12">
        <MoneybeeMark />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[13px] lg:flex">
          <a href="#approach">Our approach</a>
          <a href="#strategies">Strategies</a>
          <a href="#desk">Investment desk</a>
          <a href="#firm">The firm</a>
        </nav>
        <a
          href="#conversation"
          className="rounded-full bg-[#151513] px-4 py-2.5 text-xs font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          Schedule a conversation
        </a>
      </header>

      <section className="relative mx-auto grid min-h-[780px] max-w-[1500px] grid-cols-1 px-5 pb-12 pt-16 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pb-16 lg:pt-24">
        <div className="relative z-10 lg:col-span-9">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-black/50">
            Portfolio management · Alternative investments
          </p>
          <h1 className="max-w-[1050px] font-serif text-[clamp(4.5rem,10vw,10.5rem)] leading-[0.78] tracking-[-0.055em]">
            Small steps,
            <br />
            <span className="ml-[8vw] italic">big outcomes.</span>
          </h1>
          <div className="mt-14 grid max-w-3xl gap-7 sm:grid-cols-[1fr_auto] sm:items-end lg:ml-[8vw]">
            <p className="max-w-lg text-lg leading-relaxed text-black/68 sm:text-xl">
              We find value where the market is not looking—through patient,
              bottom-up research and the discipline to think independently.
            </p>
            <TextLink>Read our investment approach</TextLink>
          </div>
        </div>

        <div aria-hidden="true" className="relative mt-16 min-h-64 lg:col-span-3 lg:mt-0">
          <div className="absolute right-[8%] top-[8%] size-48 rounded-full border border-black/15 sm:size-60" />
          <div className="absolute right-[17%] top-[20%] size-28 rotate-45 border border-black/15 bg-[#f5c928] sm:size-36" />
          <div className="absolute right-[34%] top-[38%] size-3 rounded-full bg-black" />
          <div className="absolute right-[38%] top-[41%] h-px w-40 -rotate-[24deg] bg-black/20" />
          <p className="absolute bottom-4 right-0 max-w-40 text-right text-[10px] uppercase leading-relaxed tracking-[0.16em] text-black/45">
            Patient capital.<br />Precisely placed.
          </p>
        </div>
      </section>

      <section id="firm" className="border-y border-black/15">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {[
            ["Since 1979", "Capital-markets experience"],
            ["Est. 2004", "The Moneybee firm"],
            ["₹50 lakh", "PMS minimum investment"],
            ["₹1 crore", "AIF minimum investment"],
          ].map(([value, label], index) => (
            <div
              key={value}
              className={`py-7 lg:py-9 ${index % 2 ? "pl-5" : "pr-5"} ${index > 0 ? "lg:border-l lg:border-black/15 lg:pl-7" : ""}`}
            >
              <p className="text-2xl tracking-[-0.04em] sm:text-3xl">{value}</p>
              <p className="mt-2 text-xs leading-relaxed text-black/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="approach" className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Our approach</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-black/60">
              Four principles. Applied repeatedly, across cycles, without changing
              the story to suit the market.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              Research is our edge.
              <br />
              <span className="text-black/35">Restraint is our discipline.</span>
            </h2>
          </div>
        </div>

        <div className="mt-20 grid border-t border-black/20 md:grid-cols-2">
          {principles.map(([n, title, copy], index) => (
            <article
              key={n}
              className={`group grid min-h-56 grid-cols-[3rem_1fr] gap-4 border-b border-black/20 py-7 transition-colors hover:bg-[#f5c928] sm:p-8 ${index % 2 ? "md:border-l" : ""}`}
            >
              <span className="text-xs tabular-nums text-black/40">{n}</span>
              <div className="flex flex-col justify-between">
                <h3 className="font-serif text-3xl tracking-[-0.025em] sm:text-4xl">{title}</h3>
                <p className="mt-8 max-w-sm text-sm leading-relaxed text-black/60 group-hover:text-black/75">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="strategies" className="bg-[#151513] text-[#f8f7f2]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 lg:col-span-4">Strategies</p>
            <h2 className="font-serif text-5xl leading-none tracking-[-0.035em] sm:text-7xl lg:col-span-8 lg:text-8xl">
              Two mandates.
              <br />One standard of care.
            </h2>
          </div>
          <div className="mt-20 grid gap-px bg-white/20 lg:grid-cols-2">
            {[
              ["Portfolio Management Services", "For investors seeking a separately managed portfolio with transparency into every holding.", "Minimum investment · ₹50 lakh"],
              ["Alternative Investment Fund", "A concentrated mandate for eligible investors aligned with a long-term, research-led approach.", "Minimum investment · ₹1 crore"],
            ].map(([title, copy, minimum], index) => (
              <article key={title} className="group bg-[#151513] p-7 transition-colors hover:bg-[#201f1b] sm:p-10 lg:min-h-[420px]">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-white/40">0{index + 1}</span>
                  <ArrowUpRight className="text-[#f5c928] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <h3 className="mt-20 max-w-lg font-serif text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">{title}</h3>
                <p className="mt-7 max-w-md text-sm leading-relaxed text-white/55">{copy}</p>
                <p className="mt-12 border-t border-white/15 pt-5 text-xs uppercase tracking-[0.14em] text-white/70">{minimum}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="desk" className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex items-end justify-between gap-6 border-b border-black/20 pb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">From the investment desk</p>
            <h2 className="mt-5 font-serif text-5xl tracking-[-0.035em] sm:text-7xl">Our thinking, in writing.</h2>
          </div>
          <TextLink>View all notes</TextLink>
        </div>
        <div>
          {notes.map(([type, title], index) => (
            <a key={title} href="#conversation" className="group grid items-center gap-4 border-b border-black/15 py-7 sm:grid-cols-[3rem_1fr_auto]">
              <span className="text-xs tabular-nums text-black/35">0{index + 1}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">{type}</p>
                <h3 className="mt-1 font-serif text-3xl tracking-[-0.025em] sm:text-4xl">{title}</h3>
              </div>
              <ArrowUpRight className="hidden transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
            </a>
          ))}
        </div>
      </section>

      <section id="conversation" className="bg-[#f5c928]">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
          <p className="text-xs uppercase tracking-[0.2em] lg:col-span-4">A considered first step</p>
          <div className="lg:col-span-8">
            <h2 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              Every meaningful investment relationship begins with a conversation.
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-black/65">
              We&apos;d like to understand your objectives before discussing ours.
            </p>
            <a href="mailto:info@moneybee.in" className="mt-10 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm text-white">
              Speak with our team <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#151513] px-5 pb-24 pt-12 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-10 border-t border-white/15 pt-8 text-xs text-white/45 sm:flex-row">
          <MoneybeeMark className="text-white" />
          <p className="max-w-xl leading-relaxed">
            Investments in securities markets are subject to market risks. Read all
            related documents carefully before investing.
          </p>
          <p>Lower Parel, Mumbai</p>
        </div>
      </footer>
    </main>
  );
}
