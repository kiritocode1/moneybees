import { HeroSection } from "@/components/hero/hero-sections";
import SiteNavigation from "@/components/ui/site-navigation";

/** The antimetal-layout hero on its own. */
export default function HeroPreview() {
  return (
    <SiteNavigation>
      <main className="option-one overflow-clip bg-white text-black">
        <HeroSection />
      </main>
    </SiteNavigation>
  );
}
