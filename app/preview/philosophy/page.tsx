import ResearchSection from "@/components/fact-sections/research-section";
import PhilosophyFlythrough from "@/components/philosophy/philosophy-flythrough";
import SiteNavigation from "@/components/ui/site-navigation";

/** The philosophy fly-through on its own, running into the section that follows it on `/`. */
export default function PhilosophyPreview() {
  return (
    <SiteNavigation>
      <main className="option-one overflow-clip bg-white text-black">
        <PhilosophyFlythrough />
        <ResearchSection />
      </main>
    </SiteNavigation>
  );
}
