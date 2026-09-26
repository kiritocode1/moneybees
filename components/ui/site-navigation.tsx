import type { ReactNode } from "react";
import Link from "next/link";
import OverlayMenu from "./overlay-menu";

const primaryLinks = [
  { label: "About Us", href: "/#about" },
  { label: "PMS", href: "/pms" },
  { label: "AIF", href: "/aif" },
  { label: "Our Approach", href: "/#philosophy-pillars" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/#contact" },
];

const groupLinks = [
  { label: "Investment Banking", href: "https://moneybeeadvisors.com/" },
  { label: "Stock Broking", href: "https://moneybeesecurities.in/" },
];

export default function SiteNavigation({ children }: { children: ReactNode }) {
  return (
    <OverlayMenu
      visibleLinks={primaryLinks.filter((link) => ["PMS", "AIF", "Contact Us"].includes(link.label))}
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
      panelColors={["#9D9EA1", "#000000", "#9D9EA1", "#000000"]}
      menuColor="#000000"
      togglerColor="#000000"
    >
      {children}
    </OverlayMenu>
  );
}
