import { COLUMN, HEADING, SUBHEAD } from "@/components/hero/editorial";
import CardScroll from "@/components/motion/card-scroll";
import LitRows from "@/components/motion/lit-rows";
import PortfolioStack from "@/components/motion/portfolio-sheets";
import { STRUCTURE } from "@/lib/aif-v2";
import { AIF_NAMES, AIF_ROWS, PMS_NAMES, PMS_ROWS } from "@/lib/performance";

/**
 * PREVIEW ONLY. The three motion components from the approved section plan
 * (.plannotator/section-plan/plan.md), running on real data before any page
 * uses them.
 */

/** A section heading, the plan's own words. */
function Lead({ first }: { first: string }) {
  return <h2 className={SUBHEAD}>{first}</h2>;
}

/** The kobbe figure panel: grey fill, hairline ring, faded foot. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-12 overflow-hidden rounded-[10px] bg-[#F6F6F6] px-[clamp(20px,6vw,96px)] py-[clamp(32px,5vw,72px)] ring-1 ring-black/[.06]">
      {children}
    </div>
  );
}

export default function MotionPreview() {
  return (
    <main className="bg-white text-black">
      <div className={`${COLUMN} pt-[200px]`}>
        <h1 className={HEADING}>Motion components</h1>
      </div>

      <section className={`${COLUMN} pt-[128px]`}>
        <Lead first="Portfolio Approach" />
        <Panel>
          <div>
            <PortfolioStack />
          </div>
        </Panel>
      </section>


      <section className={`${COLUMN} pt-[128px]`}>
        <Lead first="PMS Performance" />
        <div className="mt-12">
          <LitRows rows={PMS_ROWS} names={PMS_NAMES} />
        </div>
      </section>

      <section className={`${COLUMN} pt-[128px]`}>
        <Lead first="AIF Performance" />
        <div className="mt-12">
          <LitRows rows={AIF_ROWS} names={AIF_NAMES} />
        </div>
      </section>

      <section className="pt-[128px]">
        <div className={COLUMN}>
          <Lead first="Flyingbee Structure" />
        </div>
        <div className="mt-12">
          <CardScroll
            label="Flyingbee structure"
            cards={[
              {
                key: "investors",
                tone: "light",
                place: "md:col-[1/3] md:row-[1/3]",
                children: <CardText n="01" title={STRUCTURE.chain[0]} text="AIF investors receive units of the fund." />,
              },
              {
                key: "fund",
                tone: "black",
                place: "md:col-[2/3] md:row-[1/3]",
                children: (
                  <CardText n="02" title={STRUCTURE.chain[1]} text="A Category III AIF managed by Moneybee.">
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {STRUCTURE.parties.map((party) => (
                        <li key={party} className="rounded-full border border-white/25 px-3 py-1 text-[13px]">
                          {party}
                        </li>
                      ))}
                    </ul>
                  </CardText>
                ),
              },
              {
                key: "manager",
                tone: "orange",
                place: "md:col-[1/2] md:row-[2/3]",
                children: <CardText n="03" title={STRUCTURE.chain[2]} />,
              },
            ]}
          />
        </div>
      </section>
      <div className="h-[60svh]" />
    </main>
  );
}

function CardText({ n, title, text, children }: { n: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05]">{title}</h2>
        {text && <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.5] opacity-70">{text}</p>}
        {children}
      </div>
      <span className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none opacity-20">{n}</span>
    </div>
  );
}
