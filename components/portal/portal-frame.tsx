import type { ReactNode } from "react";
import SiteFooter from "@/components/footer/site-footer";
import { COLUMN, EYEBROW } from "@/components/hero/tokens";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

/**
 * The site's navbar and footer around a portal page, with no hero: the page
 * opens on one white card on the site's grey (user, 2026-10-08). `.fluid`
 * scopes Fluid Functionalism's tokens to the card (components/fluid/fluid.css).
 * The nav is absolute and 113px tall (75px on phones), hence the top padding.
 * `wide` is for the signed-in home; sign-in pages use the narrow card.
 */
export function PortalFrame({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white pt-[113px] text-black max-md:pt-[75px]">
        <div className="fluid border-t border-black/10 bg-[#F6F6F6]">
            <div className={`${COLUMN} flex justify-center py-[72px] max-md:py-[32px]`}>
              <div
                className={`w-full ${wide ? "max-w-[880px]" : "max-w-[460px]"} rounded-[20px] border border-black/[.08] bg-white p-[40px] shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-16px_rgba(0,0,0,.12)] max-md:p-[24px]`}
              >
                <p className={`${EYEBROW} mb-[20px] text-black/55`}>Client portal</p>
                {children}
              </div>
            </div>
        </div>
      </main>
      <SiteFooter
        explore={[
          ["Investor Centre", "/investor-centre"],
          ["PMS", "/pms"],
          ["AIF", "/aif"],
          ["Contact", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
