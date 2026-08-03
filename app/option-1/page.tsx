import Image from "next/image";

const images = {
  hero: "https://images.unsplash.com/photo-1758518729711-1cbacd55efdb?auto=format&fit=crop&w=2200&q=88",
  mumbai:
    "https://images.unsplash.com/photo-1769556669252-2eadb0427cc1?auto=format&fit=crop&w=2200&q=88",
  research:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=88",
  conversation:
    "https://images.unsplash.com/photo-1532620651297-482fe21279f2?auto=format&fit=crop&w=1800&q=88",
};

const principles = [
  ["01", "Fundamental research", "Understand the business before valuing the security."],
  ["02", "Independent thinking", "Build conviction from evidence, not consensus."],
  ["03", "Long-term ownership", "Let business performance—not market noise—drive outcomes."],
  ["04", "Valuation discipline", "A good company is not a good investment at every price."],
];

const expectations = [
  ["01", "A portfolio you can understand", "Every holding should have a reason to exist—and that reason should be clear."],
  ["02", "Communication through the cycle", "Decisions are explained in favourable markets and difficult ones."],
  ["03", "Risk discussed plainly", "The possibility of loss belongs in the conversation from the beginning."],
  ["04", "Access to the people deciding", "An investment relationship should not disappear behind a support ticket."],
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#top"
      aria-label="Moneybee home"
      className={`text-[19px] font-semibold tracking-[-0.055em] ${light ? "text-white" : "text-[#181815]"}`}
    >
      moneybee<span className="text-[#e7b51a]">.</span>
    </a>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${light ? "text-white/55" : "text-black/45"}`}>
      {children}
    </p>
  );
}

function TextLink({
  children,
  href,
  light = false,
}: {
  children: React.ReactNode;
  href: string;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 border-b pb-1.5 text-[13px] font-medium ${light ? "border-white/50 text-white" : "border-black/40 text-black"}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
    </a>
  );
}

export default function Option1() {
  return (
    <main id="top" className="overflow-hidden bg-[#f4f3ee] text-[#181815] selection:bg-[#e9bc29]">
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/25 text-white">
        <div className="mx-auto flex h-20 max-w-[1560px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Wordmark light />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[12px] lg:flex">
            <a href="#approach" className="transition-opacity hover:opacity-60">Approach</a>
            <a href="#strategies" className="transition-opacity hover:opacity-60">Strategies</a>
            <a href="#performance" className="transition-opacity hover:opacity-60">Performance</a>
            <a href="#desk" className="transition-opacity hover:opacity-60">Investment desk</a>
            <a href="#firm" className="transition-opacity hover:opacity-60">The firm</a>
          </nav>
          <div className="flex items-center gap-5 text-[12px]">
            <a
              href="https://www.moneybee.in/register.php"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:block"
            >
              Investor login
            </a>
            <a href="#conversation" className="bg-[#e9bc29] px-4 py-2.5 font-semibold text-black transition-colors hover:bg-white">
              Schedule a conversation
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-[820px] bg-[#151713] text-white lg:min-h-[930px]">
        <Image
          src={images.hero}
          alt="Investment professionals reviewing research together"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,13,11,.92)_0%,rgba(12,13,11,.72)_42%,rgba(12,13,11,.16)_78%,rgba(12,13,11,.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto grid max-w-[1560px] px-5 pb-10 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pb-12">
            <div className="lg:col-span-9">
              <Eyebrow light>Portfolio management · Alternative investments</Eyebrow>
              <h1 className="mt-7 max-w-5xl font-serif text-[clamp(4.6rem,9.6vw,10rem)] leading-[0.81] tracking-[-0.055em]">
                Small steps.
                <br />
                <span className="ml-[7vw] italic">Big outcomes.</span>
              </h1>
              <div className="mt-10 grid max-w-3xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end lg:ml-[7vw]">
                <p className="max-w-lg text-[15px] leading-7 text-white/68 sm:text-base">
                  Finding value where the market is not looking—through fundamental
                  research, independent thinking and the patience to let businesses compound.
                </p>
                <TextLink href="#approach" light>Our investment approach</TextLink>
              </div>
            </div>
          </div>
          <div className="border-t border-white/25">
            <div className="mx-auto grid max-w-[1560px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
              {[
                ["Since 1979", "Experience in Indian capital markets"],
                ["Established 2004", "Moneybee Advisors & Securities"],
                ["₹50 lakh", "Minimum investment for PMS"],
                ["₹1 crore", "Minimum investment for AIF"],
              ].map(([value, label], index) => (
                <div key={value} className={`min-h-28 border-white/20 py-5 ${index > 0 ? "lg:border-l lg:pl-7" : ""} ${index % 2 ? "pl-4 sm:pl-6" : "pr-4 sm:pr-6"}`}>
                  <p className="text-lg tracking-[-0.035em]">{value}</p>
                  <p className="mt-2 max-w-48 text-[11px] leading-4 text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow>Our investment philosophy</Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <h2 className="max-w-5xl font-serif text-[clamp(3.7rem,7vw,7.8rem)] leading-[0.92] tracking-[-0.05em]">
              Patient capital for
              <span className="inline-flex items-center px-[0.15em] align-middle">
                <span className="relative h-[0.62em] w-[1.25em] overflow-hidden bg-neutral-300">
                  <Image src={images.research} alt="" fill sizes="180px" className="object-cover grayscale" />
                </span>
              </span>
              enduring businesses.
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
              <p className="max-w-sm text-sm leading-6 text-black/45">Our point of view</p>
              <p className="max-w-2xl text-lg leading-8 text-black/65">
                Markets reward patience more often than prediction. We study businesses
                from the bottom up, look beyond the most crowded parts of the market and
                invest only when quality and price meet.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid border-x border-t border-black/15 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([n, title, copy]) => (
            <article key={n} className="group flex min-h-[330px] flex-col justify-between border-b border-black/15 p-6 transition-colors hover:bg-white sm:border-r lg:min-h-[390px] lg:p-8">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-black/38">
                <span>{n}</span><span>Principle</span>
              </div>
              <div>
                <h3 className="font-serif text-3xl leading-tight tracking-[-0.035em] lg:text-4xl">{title}</h3>
                <p className="mt-5 max-w-56 text-[12px] leading-5 text-black/50">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative min-h-[620px] text-white lg:min-h-[760px]">
        <Image src={images.mumbai} alt="Modern financial district architecture in Mumbai" fill sizes="100vw" className="object-cover grayscale" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1560px] flex-col justify-between px-5 py-10 sm:px-8 lg:min-h-[760px] lg:px-12 lg:py-12">
          <div className="flex items-center justify-between">
            <Eyebrow light>Built through market cycles</Eyebrow>
            <p className="hidden text-[11px] text-white/55 sm:block">Mumbai, India</p>
          </div>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <h2 className="max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.05em] lg:col-span-9">
              Experience is what remains after the cycle turns.
            </h2>
            <div className="lg:col-span-3 lg:pb-3">
              <p className="mb-7 text-sm leading-6 text-white/65">
                A capital-markets perspective that begins in 1979. A firm established in 2004.
              </p>
              <TextLink href="#firm" light>The Moneybee story</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section id="strategies" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow>Investment strategies</Eyebrow>
            <p className="mt-6 max-w-48 text-[12px] leading-5 text-black/45">
              Two distinct structures. One research discipline.
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-[clamp(3.8rem,7vw,7.7rem)] leading-[0.9] tracking-[-0.05em]">
              The right structure begins with the right question.
            </h2>
            <div className="mt-16 border-t border-black/20">
              {[
                ["Portfolio Management Services", "A separately managed portfolio for investors who value direct ownership, transparency and a strategy shaped around long-term objectives.", "Minimum investment", "₹50 lakh"],
                ["Alternative Investment Fund", "A concentrated alternative-investment mandate for eligible investors aligned with patient, research-led capital allocation.", "Minimum investment", "₹1 crore"],
              ].map(([title, copy, label, value], index) => (
                <article key={title} className="group grid gap-7 border-b border-black/20 py-9 sm:grid-cols-[3rem_1.15fr_1fr_auto] sm:items-start">
                  <span className="text-[11px] tabular-nums text-black/35">0{index + 1}</span>
                  <h3 className="font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">{title}</h3>
                  <p className="max-w-md text-[13px] leading-6 text-black/52">{copy}</p>
                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">{label}</p>
                    <p className="mt-2 text-lg">{value}</p>
                    <span aria-hidden="true" className="mt-7 inline-block transition-transform group-hover:translate-x-1">↗</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="flex min-h-[620px] flex-col justify-between bg-white p-6 sm:p-10 lg:min-h-[760px] lg:p-14">
          <div className="flex items-start justify-between">
            <Eyebrow>Our research discipline</Eyebrow>
            <span className="text-[10px] text-black/35">01—04</span>
          </div>
          <div>
            <h2 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.045em] sm:text-7xl">
              Understand the business before valuing the security.
            </h2>
            <p className="mt-8 max-w-lg text-sm leading-6 text-black/55">
              We begin with how a company earns, reinvests and protects its capital.
              Only then do we ask what the security is worth.
            </p>
          </div>
          <TextLink href="#approach">Read our investment approach</TextLink>
        </div>
        <div className="relative min-h-[620px] lg:min-h-[760px]">
          <Image src={images.research} alt="An investment professional reviewing documents at a desk" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover grayscale" />
        </div>
      </section>

      <section id="firm" className="bg-[#171713] text-white">
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3"><Eyebrow light>What investors can expect</Eyebrow></div>
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.05em]">
                Clear thinking.
                <br />Clear communication.
              </h2>
              <p className="mt-10 max-w-xl text-sm leading-6 text-white/50">
                Confidence is not built by avoiding difficult subjects. It is built by
                discussing risk, decisions and expectations before they become questions.
              </p>
            </div>
          </div>
          <div className="mt-24 border-t border-white/20">
            {expectations.map(([n, title, copy]) => (
              <article key={n} className="grid gap-5 border-b border-white/20 py-7 sm:grid-cols-[4rem_1fr_1fr] sm:items-baseline">
                <span className="text-[11px] text-white/30">{n}</span>
                <h3 className="font-serif text-2xl tracking-[-0.025em] sm:text-3xl">{title}</h3>
                <p className="max-w-md text-[12px] leading-5 text-white/48">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="performance" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3"><Eyebrow>Performance, in context</Eyebrow></div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-[clamp(3.8rem,7vw,7.7rem)] leading-[0.9] tracking-[-0.05em]">
              Returns matter. The path taken to achieve them matters too.
            </h2>
          </div>
        </div>
        <div className="mt-20 grid border border-black/15 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Benchmark comparison", "See each strategy against the relevant benchmark, over matching periods."],
            ["Rolling returns", "Understand consistency across many starting points—not one convenient date."],
            ["Drawdown context", "See how capital behaved when markets moved against the strategy."],
            ["Fees, stated clearly", "Management fees, performance fees and methodology without fine-print surprises."],
          ].map(([title, copy], index) => (
            <article key={title} className="min-h-64 border-b border-black/15 p-6 sm:border-r lg:border-b-0 lg:min-h-72 lg:p-8">
              <span className="text-[10px] text-black/30">0{index + 1}</span>
              <h3 className="mt-16 font-serif text-2xl tracking-[-0.025em]">{title}</h3>
              <p className="mt-5 max-w-60 text-[12px] leading-5 text-black/48">{copy}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-[10px] leading-4 text-black/38">
          Performance figures will be published only after review and approval by Moneybee&apos;s compliance team.
        </p>
      </section>

      <section id="desk" className="border-y border-black/15 bg-white">
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>From the investment desk</Eyebrow>
              <h2 className="mt-6 font-serif text-5xl tracking-[-0.045em] sm:text-7xl lg:text-8xl">Our thinking, in writing.</h2>
            </div>
            <TextLink href="#desk">Visit the investment desk</TextLink>
          </div>
          <div className="mt-16 grid gap-px bg-black/15 lg:grid-cols-3">
            {[
              ["Quarterly letters", "Decisions, changes and portfolio context—written by the investment team."],
              ["Sector notes", "Original research into the businesses and industries we follow closely."],
              ["Manager commentary", "A direct account of risk, opportunity and the thinking behind each period."],
            ].map(([title, copy], index) => (
              <article key={title} className="group flex min-h-[380px] flex-col justify-between bg-white p-7 transition-colors hover:bg-[#f4f3ee] lg:p-9">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-black/35"><span>0{index + 1}</span><span>Research format</span></div>
                <div>
                  <h3 className="font-serif text-4xl leading-tight tracking-[-0.035em]">{title}</h3>
                  <p className="mt-5 max-w-sm text-[12px] leading-5 text-black/48">{copy}</p>
                </div>
                <span aria-hidden="true" className="self-end transition-transform group-hover:translate-x-1">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="conversation" className="relative min-h-[720px] text-white">
        <Image src={images.conversation} alt="Investment professionals in a considered working session" fill sizes="100vw" className="object-cover grayscale" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto flex min-h-[720px] max-w-[1560px] flex-col justify-between px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="flex justify-between"><Eyebrow light>A considered first step</Eyebrow><Wordmark light /></div>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.05em]">
                Every meaningful investment relationship begins with a conversation.
              </h2>
              <p className="mt-8 max-w-xl text-sm leading-6 text-white/60">
                We&apos;d like to understand your objectives before discussing ours.
              </p>
            </div>
            <div className="lg:col-span-3 lg:pb-2">
              <a href="mailto:info@moneybee.in" className="inline-flex w-full items-center justify-between bg-[#e9bc29] px-5 py-4 text-[13px] font-semibold text-black transition-colors hover:bg-white">
                Speak with our team <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#f4f3ee] px-5 pb-24 pt-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1560px] gap-10 border-t border-black/20 pt-8 text-[11px] leading-5 text-black/48 sm:grid-cols-2 lg:grid-cols-4">
          <Wordmark />
          <p>
            Moneybee Securities Private Limited<br />
            303, Tower A, Peninsula Business Park<br />
            Lower Parel, Mumbai 400 013
          </p>
          <p>
            Stock broker · INZ000227335<br />
            Depository participant · IN-DP-CDSL-189-2016<br />
            Portfolio manager · INP000001959
          </p>
          <div>
            <p>Investments in securities markets are subject to market risks. Read all related documents carefully before investing.</p>
            <p className="mt-5 text-[9px] text-black/30">Photography: Unsplash · Vitaly Gariev, Zoshua Colah, Scott Graham, Kaleidico</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
