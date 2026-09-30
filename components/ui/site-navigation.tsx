import type { ReactNode } from "react";
import Link from "next/link";
import OverlayMenu from "./overlay-menu";

/** The content plan's pages, in its user-journey order. Insights has no page yet. */
const primaryLinks = [
  { label: "About Us", href: "/about" },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "PMS vs AIF", href: "/pms-vs-aif" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Performance", href: "/performance" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Our Team", href: "/team" },
  { label: "Investor Centre", href: "/investor-centre" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

/** The bar beside the logo: the two products, the approach, and the plan's Get Started. Below 480px the approach stays in the menu only. */
const barLinks = [
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "Our Approach", href: "/our-approach", hideOnSmall: true },
  { label: "Get Started", href: "/contact" },
];

const groupLinks = [
  { label: "Investment Banking", href: "https://moneybeeadvisors.com/" },
  { label: "Stock Broking", href: "https://moneybeesecurities.in/" },
];

/** The regulatory documents, on the investor centre's document groups (stable ids in lib/investor-centre.ts). */
const legalLinks = [
  { label: "Investor Charter", href: "/investor-centre#investor-charter" },
  { label: "Disclosures", href: "/investor-centre#disclosures" },
  { label: "Grievance Redressal", href: "/investor-centre#grievance" },
  { label: "Disclosure Document", href: "/investor-centre#disclosure-document" },
];

export default function SiteNavigation({ children }: { children: ReactNode }) {
  return (
    <OverlayMenu
      visibleLinks={barLinks}
      showClientLogin
      brand={
        <Link href="/" aria-label="Moneybee home" className="block">
          <svg
            viewBox="200 205 1455 445"
            width="160"
            height="49"
            className="block max-[600px]:h-[35px] max-[600px]:w-[115px]"
            aria-hidden="true"
          >
            <image href="/moneybee-logo.svg" width="2048" height="897" />
          </svg>
        </Link>
      }
      primaryLinks={primaryLinks}
      secondaryLinks={groupLinks}
      legal={legalLinks}
      panelColors={["#9D9EA1", "#000000", "#9D9EA1", "#000000"]}
      menuColor="#000000"
      togglerColor="#000000"
    >
      {children}
    </OverlayMenu>
  );
}
