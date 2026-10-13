import { JourneyBlock } from "@/components/drawing/journey-block";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { AIF_OPPORTUNITY, type OpportunityContent } from "@/lib/pages/aif-content";

/*
 * "Strategic Opportunity", from the Flyingbee deck's page 8, on study 07's
 * solid (moved here from the /about timeline): the figure walks from the
 * founder's experience, past early access, to the tax benefit at the top. The
 * plan's introduction finishes beside the heading. The words are edited in
 * /admin; the drawing has three steps.
 */
export function OpportunitySection({ content = AIF_OPPORTUNITY }: { content?: OpportunityContent }) {
  const [first, second, third] = content.steps ?? [];
  return (
    <section id="opportunity" aria-labelledby="opportunity-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
            <h2 id="opportunity-heading" className={`${content.label ? "mt-[18px] " : ""}${SUBHEAD}`}>
              {content.heading}
            </h2>
          </div>
          {content.lead ? <p className={`m-0 text-black/70 ${BODY}`}>{content.lead}</p> : null}
        </div>
        <div className="mt-[48px] lg:h-[min(600px,72svh)]">
          {first && second && third ? <JourneyBlock steps={[first, second, third]} tone="light" /> : null}
        </div>
      </div>
    </section>
  );
}
