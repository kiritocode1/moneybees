import type { ReactNode } from "react";
import Link from "@/components/transition/transition-link";
import OverlayMenu, { type MenuLink } from "./overlay-menu";

/** The current site's "Registration/ Log In" page. */
const CLIENT_LOGIN_URL = "https://www.moneybee.in/register.php";

/** The content plan's pages, in its user-journey order, then Insights and the investor centre. */
const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "PMS vs AIF", href: "/pms-vs-aif" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Performance", href: "/performance" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Our Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
  { label: "Insights", href: "/insights" },
  { label: "Investor Centre", href: "/investor-centre" },
];

/** The content plan's bar in its order, with Client Login set apart before Get Started. Below 1200px Insights and Investor Centre move to the menu, below 900px the other pages do, and below 480px Client Login does too. */
const barLinks: MenuLink[] = [
  { label: "Home", href: "/", hideBelow: 900 },
  { label: "About Us", href: "/about", hideBelow: 900 },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "Our Approach", href: "/our-approach", hideBelow: 900 },
  { label: "Insights", href: "/insights", hideBelow: 1200 },
  { label: "Investor Centre", href: "/investor-centre", hideBelow: 1200 },
  { label: "Client Login", href: CLIENT_LOGIN_URL, kind: "login", hideBelow: 480 },
  { label: "Get Started", href: "/contact", kind: "cta" },
];

/** Both logins, kept apart from the investor pages as the plan asks. Distributor Login has no URL yet, so it writes to the office. */
const loginLinks: MenuLink[] = [
  { label: "Client Login", href: CLIENT_LOGIN_URL },
  { label: "Distributor Login", href: "mailto:info@moneybee.in?subject=Distributor%20login" },
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
      socials={[]}
      brand={
        <Link href="/" aria-label="Moneybee home" className="block">
          <svg
            viewBox="200 205 1455 445"
            width="160"
            height="49"
            className="block max-[600px]:h-[35px] max-[600px]:w-[115px]"
            aria-hidden="true"
          >
            {/* The ink logo on the page; its white-lettered copy while the black menu curtain is open. */}
            <image className="om-logo-ink" href="/moneybee-logo.svg" width="2048" height="897" />
            <image className="om-logo-light" href="/moneybee-logo-light.svg" width="2048" height="897" />
          </svg>
        </Link>
      }
      primaryLinks={primaryLinks}
      secondaryLinks={loginLinks}
      legal={legalLinks}
      panelColors={["#9D9EA1", "#000000", "#9D9EA1", "#000000"]}
      menuColor="#000000"
      togglerColor="#000000"
    >
      {children}
    </OverlayMenu>
  );
}
