import type { ReactNode } from "react";
import SiteFooter from "@/components/footer/site-footer";
import { COLUMN, EYEBROW } from "@/components/hero/tokens";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

const WIDTHS = { narrow: "max-w-[460px]", form: "max-w-[640px]", wide: "max-w-[880px]" } as const;

const PORTAL_LINKS: [string, string][] = [
  ["Investor Centre", "/investor-centre"],
  ["PMS", "/pms"],
  ["AIF", "/aif"],
  ["Contact", ENQUIRY_HREF],
];

/**
 * The site's navbar and footer around a portal page, with no hero: the page
 * opens on one white card on the site's grey (user, 2026-10-08). `.fluid`
 * scopes Fluid Functionalism's tokens to the card (components/fluid/fluid.css).
 * The nav is absolute and 113px tall (75px on phones), hence the top padding.
 * Sign-in pages use the narrow card, the signed-in home the wide one, and the
 * careers apply form (app/(frontend)/careers/apply) the form width with its
 * own eyebrow (null when the form draws its own) and footer links.
 */
export function PortalFrame({
  children,
  size = "narrow",
  eyebrow = "Client portal",
  explore = PORTAL_LINKS,
}: {
  children: ReactNode;
  size?: keyof typeof WIDTHS;
  eyebrow?: string | null;
  explore?: [string, string][];
}) {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white pt-[113px] text-black max-md:pt-[75px]">
        <div className="fluid border-t border-black/10 bg-[#F6F6F6]">
            <div className={`${COLUMN} flex justify-center py-[72px] max-md:py-[32px]`}>
              <div
                className={`w-full ${WIDTHS[size]} rounded-[20px] border border-black/[.08] bg-white p-[40px] shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-16px_rgba(0,0,0,.12)] max-md:p-[24px]`}
              >
                {eyebrow ? <p className={`${EYEBROW} mb-[20px] text-black/55`}>{eyebrow}</p> : null}
                {children}
              </div>
            </div>
        </div>
      </main>
      <SiteFooter explore={explore} />
    </SiteNavigation>
  );
}
