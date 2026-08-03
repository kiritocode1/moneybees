"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { type ReactNode, useEffect, useId, useRef } from "react";

export interface MenuLink {
  label: string;
  href: string;
}

export interface OverlayMenuProps {
  logo?: string;
  brand?: ReactNode;
  children?: ReactNode;
  socials?: MenuLink[];
  legal?: MenuLink[];
  primaryLinks?: MenuLink[];
  secondaryLinks?: MenuLink[];
  panelColors?: [string, string, string, string];
  menuColor?: string;
  togglerColor?: string;
}

const ASSET_BASE = "https://ui.aryank.space/assets/overlay-menu";

const DEFAULT_SOCIALS: MenuLink[] = [
  { label: "LinkedIn", href: "#contact" },
  { label: "Instagram", href: "#contact" },
];

const DEFAULT_LEGAL: MenuLink[] = [
  { label: "Privacy", href: "#contact" },
  { label: "Terms", href: "#contact" },
  { label: "Disclosures", href: "#contact" },
  { label: "Investor Charter", href: "#contact" },
];

const DEFAULT_PRIMARY: MenuLink[] = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Values", href: "#values" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SECONDARY: MenuLink[] = [
  { label: "Case studies", href: "#case-studies" },
  { label: "Investor login", href: "https://www.moneybee.in/register.php" },
  { label: "PMS", href: "#services" },
  { label: "AIF", href: "#services" },
];

const DEFAULT_PANELS: [string, string, string, string] = [
  "#1b58cf",
  "#061842",
  "#123786",
  "#0d2a72",
];

export default function OverlayMenu({
  logo = `${ASSET_BASE}/logo.png`,
  brand,
  children,
  socials = DEFAULT_SOCIALS,
  legal = DEFAULT_LEGAL,
  primaryLinks = DEFAULT_PRIMARY,
  secondaryLinks = DEFAULT_SECONDARY,
  panelColors = DEFAULT_PANELS,
  menuColor = "#081f57",
  togglerColor = "#ffffff",
}: OverlayMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const panelColorKey = panelColors.join("|");

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const root = rootRef.current;
    const toggler = togglerRef.current;
    if (!root || !toggler) return;

    const navBgs = root.querySelectorAll<HTMLElement>(".om-bg");
    const navItems = root.querySelector<HTMLElement>(".om-items");
    const menuLinks = root.querySelectorAll<HTMLAnchorElement>(".om-items a");
    if (!navItems) return;
    navItems.inert = true;
    navItems.setAttribute("aria-hidden", "true");

    const splits: SplitText[] = [];
    const groupSelectors = [
      ".om-socials a, .om-legal a",
      ".om-primary-links a",
      ".om-secondary-links a",
    ];

    const lineGroups = groupSelectors.map((selector) => {
      const lines: Element[] = [];
      root.querySelectorAll(selector).forEach((node) => {
        const split = SplitText.create(node, {
          type: "lines",
          mask: "lines",
          linesClass: "om-line",
        });
        splits.push(split);
        lines.push(...split.lines);
      });
      return lines;
    });

    const allLines = lineGroups.flat();
    gsap.set(allLines, { y: "100%" });

    let isOpen = false;
    let isAnimating = false;

    const setOpenState = (open: boolean) => {
      isOpen = open;
      root.classList.toggle("om-is-open", open);
      toggler.classList.toggle("om-open", open);
      toggler.setAttribute("aria-expanded", String(open));
      toggler.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      navItems.inert = !open;
      navItems.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        isAnimating = false;
      },
      onReverseComplete: () => {
        gsap.set(allLines, { y: "100%" });
        root.classList.remove("om-is-closing");
        isAnimating = false;
      },
    });

    tl.to(navBgs, {
      scaleY: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.inOut",
    });
    tl.to(
      navItems,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.75,
        ease: "power3.inOut",
      },
      "-=0.6",
    );

    const animateLinksIn = () => {
      lineGroups.forEach((lines) => {
        gsap.fromTo(
          lines,
          { y: "100%" },
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.85,
          },
        );
      });
    };

    const openMenu = () => {
      if (isAnimating || isOpen) return;
      isAnimating = true;
      setOpenState(true);
      tl.play();
      animateLinksIn();
    };

    const closeMenu = () => {
      if (isAnimating || !isOpen) return;
      isAnimating = true;
      root.classList.add("om-is-closing");
      setOpenState(false);
      tl.reverse();
    };

    const onToggle = () => {
      if (isOpen) closeMenu();
      else openMenu();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    toggler.addEventListener("click", onToggle);
    document.addEventListener("keydown", onKeyDown);
    menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      toggler.removeEventListener("click", onToggle);
      document.removeEventListener("keydown", onKeyDown);
      menuLinks.forEach((link) => link.removeEventListener("click", closeMenu));
      document.body.style.overflow = "";
      tl.kill();
      for (const split of splits) split.revert();
    };
  }, [panelColorKey, menuColor]);

  return (
    <div className="om-root" ref={rootRef}>
      <style>{styles}</style>

      <div className="om-backdrop">{children}</div>

      <nav className="om-nav" aria-label="Site navigation">
        <div className="om-logo">
          {brand ?? (
            <a href="#top">
              {/* The registry API retains its original image-logo fallback. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" />
            </a>
          )}
        </div>
        <button
          type="button"
          className="om-toggler"
          ref={togglerRef}
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls={menuId}
          style={{ ["--om-toggler" as string]: togglerColor }}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className="om-content">
        {panelColors.map((color, index) => (
          <div
            key={`panel-${index}`}
            className="om-bg"
            style={{ backgroundColor: color }}
          />
        ))}

        <div id={menuId} className="om-items" style={{ backgroundColor: menuColor }}>
          <div className="om-items-col">
            <div className="om-socials">
              {socials.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
            <div className="om-legal">
              {legal.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>
          <div className="om-items-col">
            <div className="om-primary-links">
              {primaryLinks.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
            <div className="om-secondary-links">
              {secondaryLinks.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap");

.om-root {
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: #141414;
  font-family: "Onest", sans-serif;
}

.om-root .om-backdrop {
  position: relative;
  z-index: 0;
}

.om-root .om-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  z-index: 72;
  pointer-events: none;
}

.om-root .om-logo,
.om-root .om-toggler {
  pointer-events: auto;
}

.om-root .om-logo {
  padding: 1rem;
  cursor: pointer;
}

.om-root .om-logo img {
  width: 40px;
  height: 40px;
  display: block;
}

.om-root .om-toggler {
  padding: 1rem;
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.om-root .om-toggler span {
  width: 40px;
  height: 2px;
  background-color: var(--om-toggler, #fff);
  transition: all 0.4s ease;
}

.om-root .om-toggler.om-open span:first-child {
  transform: translateY(3.5px) rotate(45deg) scaleX(0.75);
}

.om-root .om-toggler.om-open span:nth-child(2) {
  transform: translateY(-3.5px) rotate(-45deg) scaleX(0.75);
}

.om-root .om-content {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100svh;
  pointer-events: none;
  z-index: 70;
}

.om-root.om-is-open .om-content,
.om-root.om-is-closing .om-content {
  pointer-events: auto;
}

.om-root .om-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transform: scaleY(0);
  transform-origin: top;
  will-change: transform;
  pointer-events: none;
}

.om-root .om-items {
  height: 100%;
  display: flex;
  gap: 2rem;
  padding: clamp(7rem, 10vw, 11rem) clamp(2rem, 8vw, 9rem) clamp(3rem, 6vw, 7rem);
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
  will-change: clip-path;
}

.om-root .om-items-col:nth-child(1) {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
}

.om-root .om-items-col:nth-child(2) {
  flex: 4;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

.om-root .om-items a {
  width: fit-content;
  text-decoration: none;
  color: #fff;
  display: block;
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin-bottom: 0.5rem;
}

.om-root .om-socials a {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
}

.om-root .om-legal a {
  font-size: 0.9rem;
  color: #6f8cc9;
}

.om-root .om-primary-links a {
  font-size: clamp(2.8rem, 5.2vw, 5.7rem);
  font-weight: 400;
}

.om-root .om-secondary-links a {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: #9eb9ef;
}

.om-root .om-content a .om-line {
  position: relative;
  will-change: transform;
}

@media (max-width: 1000px) {
  .om-root .om-items {
    flex-direction: column;
    justify-content: center;
    padding: 6rem 2rem 2rem;
  }

  .om-root .om-legal,
  .om-root .om-secondary-links {
    display: none;
  }

  .om-root .om-items-col:nth-child(1),
  .om-root .om-items-col:nth-child(2) {
    flex: none;
  }

  .om-root .om-socials {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    left: 5rem;
    display: flex;
    gap: 1.25rem;
  }

  .om-root .om-primary-links a {
    font-size: clamp(2.7rem, 12vw, 4.8rem);
  }
}
`;
