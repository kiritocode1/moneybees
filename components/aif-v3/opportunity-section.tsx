import { JourneyBlock } from "@/components/drawing/journey-block";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { OPPORTUNITY } from "@/lib/aif-v2";

/*
 * "Strategic Opportunity", from the Flyingbee deck's page 8, on study 07's
 * solid (moved here from the /about timeline): the figure walks from the
 * founder's experience, past early access, to the tax benefit at the top.
 */
export function OpportunitySection() {
  return (
    <section id="opportunity" aria-labelledby="opportunity-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Flyingbee</BracketLabel>
        <h2 id="opportunity-heading" className={`mt-[18px] ${SUBHEAD}`}>
          {OPPORTUNITY.heading}
        </h2>
        <div className="mt-[48px] lg:h-[min(600px,72svh)]">
          <JourneyBlock steps={OPPORTUNITY.steps} tone="light" />
        </div>
      </div>
    </section>
  );
}
