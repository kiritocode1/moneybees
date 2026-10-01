import type { Metadata } from "next";
import { ApplySection, LifeSection } from "@/components/careers/careers-sections";
import { CultureColumns } from "@/components/careers-v3/culture-columns";
import { OpeningCards } from "@/components/careers-v3/opening-cards";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { CAREERS_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Careers at Moneybee, Mumbai",
  description:
    "Build your career with Moneybee: professionals working across investment research, portfolio management, advisory, compliance and financial services in Mumbai.",
  alternates: { canonical: "/careers" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/careers", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Careers at Moneybee, Mumbai | Moneybee", description: "Build your career with Moneybee: professionals working across investment research, portfolio management, advisory, compliance and financial services in Mumbai." },
};

/**
 * /careers, built to the Content & Visual Plan §10: the heading with both
 * CTAs, current openings, life at Moneybee, our work culture and how to
 * apply. Copy lives in lib/careers.ts; the roles and culture points are
 * placeholders until HR approves them.
 */
export default function CareersPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={CAREERS_HERO} />
        <OpeningCards />
        <LifeSection />
        <CultureColumns />
        <ApplySection />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our approach", "/our-approach"],
          ["Current openings", "#openings"],
          ["Life at Moneybee", "#life"],
          ["How to apply", "#apply"],
          ["Contact", "/contact"],
        ]}
      />
    </SiteNavigation>
  );
}
