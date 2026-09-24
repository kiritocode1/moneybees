"use client";

import Image from "next/image";
import { useRef } from "react";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";

/**
 * Who runs what for Flyingbee, after Wonder Vision's "Kind words" band: a
 * dark band, a square eyebrow, one slide per party with its logo, one plain
 * line on its job, and its name and role, the next slide peeking in at the
 * edge. Roles are AIF presentation p3; the lines restate its arrow labels.
 * Logos are each firm's own, drawn white on the band.
 */
const PARTNERS = [
  { name: "Moneybee", role: "Sponsor and Investment Manager", logo: "/moneybee-logo.svg", line: "Makes every investment decision for the fund.", width: 150 },
  { name: "Axis Trustee", role: "Trustee", logo: "/logos/axis-trustee.png", line: "Safeguards the interest of investors, independently of the manager.", width: 170 },
  { name: "Orbis", role: "Custodian and Fund Accountant", logo: "/logos/orbis.png", line: "Holds the fund's assets and keeps its accounts.", width: 64 },
  { name: "Arihant Capital", role: "Broker", logo: "/logos/arihant-capital.png", line: "Executes the fund's trades, alongside Moneybee.", width: 160 },
  { name: "CAMS", role: "Registrar and Transfer Agent", logo: "/logos/cams.svg", line: "Runs investor servicing for every unit holder.", width: 120 },
] as const;

export default function PartnersSection() {
  const track = useRef<HTMLDivElement>(null);
  const step = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.62, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="partners-heading" className="bg-[#000000] py-[110px] text-white max-[600px]:py-[72px]">
      <div className="flex items-center justify-between px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[22px]">
        <h2 id="partners-heading" className="flex items-center gap-[14px] text-[15px] font-[550] uppercase tracking-[.02em]">
          <i className="h-[14px] w-[14px] bg-white" />
          The fund&rsquo;s partners
        </h2>
        <div className="flex gap-[8px]">
          {[
            ["Previous", -1],
            ["Next", 1],
          ].map(([label, direction]) => (
            <button
              key={label}
              type="button"
              aria-label={label as string}
              onClick={() => step(direction as 1 | -1)}
              className={`grid h-[44px] w-[44px] place-items-center border border-[rgba(255,255,255,.3)] text-[18px] transition-colors hover:border-white ${FOCUS}`}
            >
              {direction === -1 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        className="option-one-track mt-[64px] flex snap-x snap-mandatory gap-[8vw] overflow-x-auto pr-[20vw] pl-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:pl-[22px]"
      >
        {PARTNERS.map((partner, index) => (
          <article key={partner.name} className="flex w-[min(62vw,820px)] shrink-0 snap-start gap-[40px] max-[600px]:w-[84vw] max-[600px]:gap-[20px]">
            <span className="grid h-[64px] w-[64px] shrink-0 place-items-center bg-white font-mono text-[13px] text-[#000000] max-[600px]:h-[44px] max-[600px]:w-[44px]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {partner.logo === "/moneybee-logo.svg" ? (
                // The wordmark file carries wide padding; this viewBox crops to the mark, as the nav does.
                <svg viewBox="200 205 1455 445" height="52" className="block w-auto brightness-0 invert" role="img" aria-label="Moneybee logo">
                  <image href="/moneybee-logo.svg" width="2048" height="897" />
                </svg>
              ) : (
                <div className="relative h-[48px]" style={{ width: partner.width }}>
                  <Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="200px" className="object-contain object-left brightness-0 invert" />
                </div>
              )}
              <p className="mt-[40px] text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.25] font-light tracking-[-.02em]">{partner.line}</p>
              <p className="mt-[36px] text-[13px] uppercase tracking-[.04em]">{partner.name}</p>
              <p className="mt-[8px] text-[15px] text-[rgba(255,255,255,.6)]">{partner.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
