"use client";

import Link from "@/components/transition/transition-link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef } from "react";

export interface MenuLink {
  label: string;
  href: string;
  /** Drop this link from the bar below this width, where the bar cannot fit every link. It stays in the menu. */
  hideBelow?: 480 | 900 | 1200;
  /** "login" sets the link apart in the bar; "cta" makes it the orange button. */
  kind?: "login" | "cta";
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
  visibleLinks?: MenuLink[];
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
  "#F6A11A",
  "#000000",
  "#9D9EA1",
  "#F6A11A",
];

const SHUT = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

type Gsap = typeof import("gsap").gsap;
type Split = import("gsap/SplitText").SplitText;

/** gsap and SplitText load on the first hover, focus or press of the toggler, not with the page. */
let engine: Promise<{ gsap: Gsap; SplitText: typeof import("gsap/SplitText").SplitText }> | null = null;
function loadEngine() {
  engine ??= Promise.all([import("gsap"), import("gsap/SplitText")]).then(([core, split]) => {
    core.gsap.registerPlugin(split.SplitText);
    return { gsap: core.gsap, SplitText: split.SplitText };
  });
  return engine;
}

/** Internal routes go through next/link; hashes, mailto and other sites stay plain anchors. */
function MenuAnchor({ link, className }: { link: MenuLink; className?: string }) {
  const pathname = usePathname();
  const classes =
    [className, link.hideBelow ? `om-hide-${link.hideBelow}` : undefined, link.kind ? `om-${link.kind}` : undefined].filter(Boolean).join(" ") ||
    undefined;
  if (link.href.startsWith("/") && !link.href.startsWith("//")) {
    return (
      <Link href={link.href} className={classes} aria-current={link.href === pathname ? "page" : undefined}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={classes}>
      {link.label}
    </a>
  );
}

export default function OverlayMenu({
  logo = `${ASSET_BASE}/logo.png`,
  brand,
  children,
  socials = DEFAULT_SOCIALS,
  legal = DEFAULT_LEGAL,
  primaryLinks = DEFAULT_PRIMARY,
  secondaryLinks = DEFAULT_SECONDARY,
  panelColors = DEFAULT_PANELS,
  menuColor = "#000000",
  togglerColor = "#ffffff",
  visibleLinks = [],
}: OverlayMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const panelColorKey = panelColors.join("|");

  useEffect(() => {
    const root = rootRef.current;
    const toggler = togglerRef.current;
    if (!root || !toggler) return;

    const backdrop = root.querySelector<HTMLElement>(".om-backdrop");
    const navBgs = Array.from(root.querySelectorAll<HTMLElement>(".om-bg"));
    const navItems = root.querySelector<HTMLElement>(".om-items");
    if (!navItems || !backdrop) return;
    navItems.inert = true;
    navItems.setAttribute("aria-hidden", "true");

    let disposed = false;
    let isOpen = false;
    let gsap: Gsap | null = null;
    const splits: Split[] = [];
    let lineGroups: Element[][] = [];
    let allLines: Element[] = [];

    /** Split the links into masked lines once the engine is here. */
    const prepare = () =>
      loadEngine().then((loaded) => {
        if (disposed || gsap) return;
        gsap = loaded.gsap;
        lineGroups = [".om-socials a, .om-legal a", ".om-primary-links a", ".om-secondary-links a"].map((selector) => {
          const lines: Element[] = [];
          root.querySelectorAll(selector).forEach((node) => {
            const split = loaded.SplitText.create(node, { type: "lines", mask: "lines", linesClass: "om-line" });
            splits.push(split);
            lines.push(...split.lines);
          });
          return lines;
        });
        allLines = lineGroups.flat();
        // A menu that opened before the engine arrived already shows its links.
        gsap.set(allLines, { y: isOpen ? "0%" : "100%" });
      });

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setOpenState = (open: boolean) => {
      isOpen = open;
      root.classList.toggle("om-is-open", open);
      toggler.classList.toggle("om-open", open);
      toggler.setAttribute("aria-expanded", String(open));
      toggler.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      navItems.inert = !open;
      navItems.setAttribute("aria-hidden", String(!open));
      // The page behind the curtain leaves the tab order and the accessibility tree while it is open.
      backdrop.inert = open;
      document.body.style.overflow = open ? "hidden" : "";
    };

    /** Enter: 0.45s strong ease-out, links rising alongside the panels rather than after them. */
    const animateOpen = () => {
      if (!gsap) return;
      gsap.killTweensOf([...navBgs, navItems, ...allLines]);
      root.classList.remove("om-is-closing");
      if (reduced()) {
        gsap.set(navBgs, { scaleY: 1 });
        gsap.set(navItems, { clipPath: FULL });
        gsap.set(allLines, { y: "0%" });
        return;
      }
      gsap.to(navBgs, { scaleY: 1, duration: 0.45, stagger: 0.04, ease: "power4.out" });
      gsap.to(navItems, { clipPath: FULL, duration: 0.45, delay: 0.08, ease: "power4.out" });
      lineGroups.forEach((lines) => {
        gsap?.fromTo(lines, { y: "100%" }, { y: "0%", duration: 0.45, stagger: 0.03, delay: 0.14, ease: "power4.out" });
      });
    };

    /** Exit: faster than the enter, and the links go with the curtain instead of animating out. */
    const animateClose = () => {
      root.classList.add("om-is-closing");
      if (!gsap) {
        root.classList.remove("om-is-closing");
        return;
      }
      gsap.killTweensOf([...navBgs, navItems, ...allLines]);
      const done = () => {
        gsap?.set(allLines, { y: "100%" });
        root.classList.remove("om-is-closing");
      };
      if (reduced()) {
        gsap.set(navBgs, { scaleY: 0 });
        gsap.set(navItems, { clipPath: SHUT });
        done();
        return;
      }
      gsap.to(navItems, { clipPath: SHUT, duration: 0.26, ease: "power3.inOut" });
      gsap.to([...navBgs].reverse(), { scaleY: 0, duration: 0.28, stagger: 0.02, ease: "power3.inOut", onComplete: done });
    };

    const openMenu = () => {
      if (isOpen) return;
      setOpenState(true);
      navItems.querySelector<HTMLElement>(".om-primary-links a")?.focus({ preventScroll: true });
      if (gsap) animateOpen();
      else
        void prepare().then(() => {
          if (isOpen) animateOpen();
        });
    };

    const closeMenu = (returnFocus = false) => {
      if (!isOpen) return;
      setOpenState(false);
      animateClose();
      if (returnFocus) toggler.focus({ preventScroll: true });
    };

    const onToggle = () => (isOpen ? closeMenu() : openMenu());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) closeMenu(true);
    };
    const onIntent = () => void prepare();
    const onLinkClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("a")) closeMenu();
    };

    toggler.addEventListener("click", onToggle);
    toggler.addEventListener("pointerenter", onIntent);
    toggler.addEventListener("focus", onIntent);
    toggler.addEventListener("touchstart", onIntent, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    navItems.addEventListener("click", onLinkClick);

    return () => {
      disposed = true;
      toggler.removeEventListener("click", onToggle);
      toggler.removeEventListener("pointerenter", onIntent);
      toggler.removeEventListener("focus", onIntent);
      toggler.removeEventListener("touchstart", onIntent);
      document.removeEventListener("keydown", onKeyDown);
      navItems.removeEventListener("click", onLinkClick);
      document.body.style.overflow = "";
      backdrop.inert = false;
      gsap?.killTweensOf([...navBgs, navItems, ...allLines]);
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
        {visibleLinks.length > 0 && (
          <div className="om-visible-links">
            {visibleLinks.map((link) => (
              <MenuAnchor key={link.label} link={link} />
            ))}
          </div>
        )}
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
                <MenuAnchor key={link.label} link={link} />
              ))}
            </div>
            <div className="om-legal">
              {legal.map((link) => (
                <MenuAnchor key={link.label} link={link} />
              ))}
            </div>
          </div>
          <div className="om-items-col">
            <div className="om-primary-links" style={{ gridTemplateRows: `repeat(${Math.ceil(primaryLinks.length / 2)}, max-content)` }}>
              {primaryLinks.map((link) => (
                <MenuAnchor key={link.label} link={link} />
              ))}
            </div>
            <div className="om-secondary-links">
              {secondaryLinks.map((link) => (
                <MenuAnchor key={link.label} link={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
.om-root {
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: #000000;
  font-family: inherit;
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
  flex: none;
  min-width: 44px;
  min-height: 44px;
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
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms ease;
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
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2rem;
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
  color: #9D9EA1;
}

/* Read down the first column, then the second, matching keyboard and DOM order. */
.om-root .om-primary-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-flow: column;
  column-gap: clamp(24px, 3vw, 48px);
  row-gap: 12px;
  align-content: start;
}
.om-root .om-primary-links a {
  max-width: 100%;
  margin-bottom: 0;
  font-size: clamp(1.5rem, min(3.2vw, 5.4svh), 3.5rem);
  font-weight: 400;
}
.om-root .om-secondary-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
}

.om-root .om-secondary-links a {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: #9D9EA1;
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

.om-root .om-visible-links {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 28px;
  margin-left: auto;
  margin-right: 20px;
  pointer-events: auto;
}
.om-root .om-visible-links a {
  color: #000;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}
/* The page you are on: an orange rule under it in the bar, orange type on the curtain. */
.om-root .om-visible-links a[aria-current="page"] {
  box-shadow: inset 0 -2px 0 #F6A11A;
  padding-block: 6px;
}
.om-root .om-items a[aria-current="page"] { color: #F6A11A; }
/* Client Login sits apart from the pages, behind a hairline. */
.om-root .om-visible-links .om-login {
  padding-left: 28px;
  border-left: 1px solid rgba(0,0,0,.2);
  line-height: 1.6;
}
.om-root .om-visible-links .om-cta {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  background: #F6A11A;
  color: #000;
  font-weight: 500;
  transition: background-color 200ms ease, scale 160ms ease;
}
.om-root .om-visible-links .om-cta:hover { background: #000; color: #fff; text-decoration: none; }
.om-root .om-visible-links .om-cta:active { scale: .97; }
.om-root.om-is-open .om-visible-links { visibility: hidden; pointer-events: none; }
.om-root.om-is-open .om-brand-link { color: #fff; }
.om-root .om-logo-light,
.om-root.om-is-open .om-logo-ink { display: none; }
.om-root.om-is-open .om-logo-light { display: inline; }
.om-root.om-is-open .om-brand-tagline { color: #aaa; }
.om-root .om-nav a:focus-visible,
.om-root .om-toggler:focus-visible { outline: 2px solid #000; outline-offset: 5px; }
/* On the open curtain the ground is black, so the ring turns white. */
.om-root .om-items a:focus-visible,
.om-root.om-is-open .om-toggler:focus-visible { outline: 2px solid #fff; outline-offset: 5px; }
.om-root .om-nav a:hover { text-decoration: underline; text-underline-offset: 5px; }
@media (max-width: 1000px) {
  /* Seven links still sit in the bar down to 900px; a tighter gap keeps them clear of the logo. */
  .om-root .om-visible-links { gap: 20px; }
  .om-root .om-visible-links .om-login { padding-left: 20px; }
  .om-root .om-items { overflow-y: auto; justify-content: flex-start; padding-top: 110px; }
  .om-root .om-items-col:nth-child(2) { flex-direction: column; gap: 24px; }
  .om-root .om-secondary-links { display: block; }
  .om-root .om-primary-links { column-gap: 20px; }
  .om-root .om-primary-links a { font-size: clamp(18px, min(4.2vw, 5.2svh), 36px); min-height: 40px; }
  .om-root .om-secondary-links { display: flex; }
  .om-root .om-socials { position: static; }
}
@media (max-width: 600px) {
  .om-root .om-brand-tagline { display: none; }
  .om-root .om-nav { padding: 12px; }
  .om-root .om-logo { padding: 8px 4px; }
  .om-root .om-visible-links { gap: 14px; margin-right: 8px; }
  .om-root .om-visible-links a { font-size: 11px; white-space: nowrap; }
  .om-root .om-visible-links .om-login { padding-left: 14px; }
  .om-root .om-visible-links .om-cta { min-height: 32px; padding: 0 12px; }
  .om-root .om-toggler { padding: 12px 4px 12px 8px; }
  .om-root .om-toggler span { width: 28px; }
}
@media (max-width: 1199px) {
  .om-root .om-visible-links .om-hide-1200 { display: none; }
}
@media (max-width: 899px) {
  .om-root .om-visible-links .om-hide-900 { display: none; }
}
@media (max-width: 479px) {
  .om-root .om-visible-links .om-hide-480 { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .om-root .om-toggler span { transition: none; }
}
`;
