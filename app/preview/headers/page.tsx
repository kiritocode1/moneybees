import ProductHero from "@/components/pms-v3/product-hero";
import { APPROACH_HERO, CAREERS_HERO, CASES_HERO, COMPARE_HERO, CONTACT_HERO, INVESTOR_HERO, PERFORMANCE_HERO } from "@/lib/page-heroes";
import { AIF_HERO, PMS_HERO } from "@/lib/pms-v3-hero";

/**
 * PREVIEW ONLY. Every internal page's hero on the one /pms motif, stacked for
 * review: the two approved product heroes, then each page's own mark.
 */
const HEROES = [PMS_HERO, AIF_HERO, COMPARE_HERO, APPROACH_HERO, PERFORMANCE_HERO, CASES_HERO, CAREERS_HERO, CONTACT_HERO, INVESTOR_HERO];

export default function HeadersPreview() {
  return (
    <main className="option-one bg-white text-black">
      {HEROES.map((hero) => (
        <div key={hero.mark} className="border-b border-black/10">
          <ProductHero data={hero} />
        </div>
      ))}
    </main>
  );
}
