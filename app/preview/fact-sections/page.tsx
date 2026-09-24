import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import RiskSection from "@/components/fact-sections/risk-section";

/**
 * PREVIEW ONLY. The four fact sections in their homepage order, with grey
 * bands standing in for the sections between them, so the scroll pattern can
 * be judged before anything joins `/`.
 */
function Band({ children }: { children: string }) {
  return <div className="grid h-[40svh] place-items-center bg-[#9D9EA1] text-[10px] uppercase tracking-[.14em]">{children}</div>;
}

export default function FactSectionsPreview() {
  return (
    <main className="option-one bg-white text-[#000000]">
      <Band>Four principles, above</Band>
      <ResearchSection />
      <PicksSection />
      <Band>About and two products</Band>
      <RiskSection />
      <Band>Quote panel</Band>
      <RecordSection />
      <Band>Chapter stack, below</Band>
    </main>
  );
}
