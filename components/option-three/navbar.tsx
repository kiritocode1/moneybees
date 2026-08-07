"use client";

import { useState } from "react";
import { ButtonFour } from "./buttons";
import { Logo } from "./logo";
import { NAV_HOME, NAV_INNER, NAV_LINKS, NAV_MAIN, NAV_UTILITY } from "./content";

/**
 * The `w-` classes below are not decoration. Webflow's widget stylesheet is
 * what makes a dropdown a dropdown — `w-dropdown` establishes the positioning
 * context, `w-dropdown-list` takes the panel out of flow, `w-inline-block`
 * keeps links from stretching. Dropping them collapses the whole navbar into
 * the page flow, so they stay even though the behaviour is ours.
 */

type Item = { readonly label: string; readonly href: string };

/** A dropdown row: label plus the underline that wipes in from the left. */
function DropdownMenu({ item }: { item: Item }) {
  return (
    <a href={item.href} className="dropdown-menu w-inline-block">
      <div className="paragraph-02 text-dark-gray">{item.label}</div>
      <div className="menu-underline" />
    </a>
  );
}

function DropdownColumn({ title, items }: { title: string; items: readonly Item[] }) {
  return (
    <div className="dropdown-column">
      <div className="dropdown-menu-wrap">
        <div className="dropdown-title-wrap">
          <h6 className="paragraph-02">{title}</h6>
        </div>
        <div className="dropdown-menu-list">
          {items.map((item) => (
            <DropdownMenu key={item.label} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The three-column panel behind "Pages", reused by the mobile menu. */
function PagesPanel() {
  return (
    <nav className="nav-dropdown-list w-dropdown-list">
      <div className="dropdown-list-wrap">
        <div className="dropdown-wrap">
          <DropdownColumn title="Main" items={NAV_MAIN} />
          <DropdownColumn title="Investors" items={NAV_INNER} />
          <DropdownColumn title="Regulatory" items={NAV_UTILITY} />
        </div>
      </div>
    </nav>
  );
}

function DropdownToggle({ label }: { label: string }) {
  return (
    <div className="dropdown-toggle w-dropdown-toggle" tabIndex={0} role="button" aria-haspopup="true">
      <div className="icon w-icon-dropdown-toggle" />
      <div>{label}</div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  const brand = (
    <a href="#top" aria-label="Moneybee home" className="navbar-brand w-inline-block">
      <Logo />
    </a>
  );

  return (
    <section className="navbar">
      <div className="nav-container">
        <div className="navbar-wrap">
          <div className="navbar-desktop-wrap">
            <div className="navbar-desktop-left">
              {brand}
              <div className="nav-left-menu-wrap">
                <div className="nav-dropdown w-dropdown">
                  <DropdownToggle label="Home" />
                  <nav className="nav-dropdown-list _02 w-dropdown-list">
                    <div className="dropdown-list-wrap">
                      <div className="dropdown-wrap small">
                        <div className="dropdown-column">
                          <div className="dropdown-menu-wrap">
                            <div className="dropdown-menu-list">
                              {NAV_HOME.map((item) => (
                                <DropdownMenu key={item.label} item={item} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
                {NAV_LINKS.map((item) => (
                  <a key={item.label} href={item.href} className="nav-menu w-inline-block">
                    <div className="paragraph-02">{item.label}</div>
                    <div className="menu-underline" />
                  </a>
                ))}
                <div className="nav-divider" />
              </div>
            </div>
            <div className="navbar-desktop-right">
              <div className="nav-dropdown w-dropdown">
                <DropdownToggle label="Pages" />
                <PagesPanel />
              </div>
              <ButtonFour>Contact Us</ButtonFour>
            </div>
          </div>

          <div className={`navbar-mobile-wrap${open ? " is-open" : ""}`}>
            <div className="navbar-top-wrap">
              {brand}
              <div className="navbar-right">
                <button
                  type="button"
                  className="navbar-menu-box"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  onClick={() => setOpen((value) => !value)}
                >
                  {/* Stands in for the reference's Lottie burger, whose three
                      layers are named top, middle and bottom. */}
                  <span className="hamburger" aria-hidden="true">
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                  </span>
                </button>
              </div>
            </div>
            <div className="mobile-dropdown-wrap">
              {[{ label: "Home", href: "#top" }, ...NAV_LINKS].map((item) => (
                <div key={item.label} className="mobile-dropdown-list">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="mobile-menu paragraph-02"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
              <div className="mobile-dropdown-list pages">
                {/* The reference gives the menu's own dropdown a different
                    class from the two in the desktop bar; the panel styling
                    hangs off it. */}
                <div className="dropdown w-dropdown">
                  <DropdownToggle label="Pages" />
                  <PagesPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
