import { HeroSection, WhoWeAreSection } from "@/components/hero/hero-sections";
import SiteNavigation from "@/components/ui/site-navigation";

/** The antimetal-layout hero and "Who we are", on their own before they replace the top of `/`. */
export default function HeroPreview() {
  return (
    <SiteNavigation>
      <main className="option-one overflow-clip bg-white text-black">
        <HeroSection />
        <WhoWeAreSection />
      </main>
    </SiteNavigation>
  );
}
