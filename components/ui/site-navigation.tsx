import type { ReactNode } from "react";
import Link from "@/components/transition/transition-link";
import OverlayMenu, { type BarItem, type MenuLink } from "./overlay-menu";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

/**
 * The two ways in, under Login in the bar and in the menu (user, 2026-10-15).
 * Client Login is the portal's sign-in page; distributors cannot sign in yet,
 * so Distributor Login opens the login cards on /investor-centre, where its
 * card asks the office for an account.
 */
const LOGIN_LINKS: MenuLink[] = [
  { label: "Client Login", href: "/portal/login" },
  { label: "Distributor Login", href: "/investor-centre#logins" },
];

/** The pages in the content plan's user-journey order. Our Team, Performance and the logins are reached from the pages themselves, not here. */
const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "PMS vs AIF", href: "/pms-vs-aif" },
  { label: "Our Philosophy", href: "/our-philosophy" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Multibagger Picks", href: "/multi-bagger-picks" },
  { label: "Contact Us", href: ENQUIRY_HREF },
  { label: "Careers", href: "/careers" },
  // Investor Centre left the bar for the Login dropdown (user, 2026-10-15); the menu and the footer are its way in.
  { label: "Investor Centre", href: "/investor-centre" },
];

/** The content plan's bar in its order, with Login set apart before Get Started. Below 900px the other pages leave the bar; the menu still lists them. Below 480px Login leaves too, and the menu's Client Login and Distributor Login are the way in. */
const barLinks: BarItem[] = [
  { label: "Home", href: "/", hideBelow: 900 },
  { label: "About Us", href: "/about", hideBelow: 900 },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "Our Philosophy", href: "/our-philosophy", hideBelow: 900 },
  { label: "Login", links: LOGIN_LINKS, kind: "login", hideBelow: 480 },
  { label: "Get Started", href: ENQUIRY_HREF, kind: "cta" },
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
      // Home to Our Philosophy in the first column, the rest in the second.
      primaryRows={6}
      secondaryLinks={LOGIN_LINKS}
      legal={legalLinks}
      panelColors={["#9D9EA1", "#000000", "#9D9EA1", "#000000"]}
      menuColor="#000000"
      togglerColor="#000000"
    >
      {children}
    </OverlayMenu>
  );
}
