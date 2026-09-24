import { ArrowRight } from "reicon-react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { CONTACT, PILLARS, REGISTRATIONS } from "@/lib/insights";
import DotWordmark from "./dot-wordmark";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";
const GUTTER = "px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[22px]";

type Link = readonly [label: string, href: string];

/**
 * The footer, after footer.design: United Carriers' dot-matrix wordmark and
 * word marquee, ESR's restraint, Heron's hairline columns. White ground and
 * ink hairlines to match the evolved homepage. Every line is either the
 * existing footer's or the decks' own (contact p17, registrations p15,
 * pillars p4).
 */
export default function SiteFooter({ explore }: { explore: readonly Link[] }) {
  const columns: readonly (readonly [string, readonly Link[]])[] = [
    ["Explore", explore],
    ["Regulatory", [["Investor Charter", "#contact"], ["Disclosure Document", "#contact"], ["Grievance redressal", "#contact"], ["SEBI SCORES", "#contact"]]],
    ["Investors", [["Investor login", "https://www.moneybee.in/register.php"], ["Speak with our team", "#contact"]]],
  ];

  return (
    <footer id="contact" className="border-t border-t-[#000] bg-white text-[#000000]">
      <div className={`flex items-start justify-between gap-[32px] pt-[48px] pb-[40px] ${GUTTER}`}>
        <div>
          <svg viewBox="200 205 1455 445" width="180" height="55" className="block" aria-label="Moneybee">
            <image href="/moneybee-logo.svg" width="2048" height="897" />
          </svg>
          <p className="mt-[18px] text-[13px] tracking-[-.01em]">Know Venture. Know Gain.</p>
        </div>
        <a
          href="#contact"
          className={`group inline-flex items-center gap-[12px] text-[12px] no-underline ${FOCUS}`}
        >
          Schedule a conversation
          <i className="grid h-[44px] w-[44px] place-items-center bg-[#000] text-white not-italic transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
            <ArrowRight size={16} aria-hidden="true" />
          </i>
        </a>
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] gap-px border-y border-y-[#000] bg-[#000] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {columns.map(([heading, links]) => (
          <nav key={heading} aria-label={heading} className="bg-white p-[28px] max-[600px]:p-[22px]">
            <BracketLabel>{heading}</BracketLabel>
            <ul className="mt-[18px] grid list-none gap-[8px] p-0">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className={`text-[15px] tracking-[-.015em] text-[#000] no-underline transition-colors duration-200 hover:text-[#F7A11A] ${FOCUS}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <address className="bg-white p-[28px] not-italic max-[600px]:p-[22px]">
          <BracketLabel>Contact details</BracketLabel>
          <p className="mt-[18px] text-[15px] leading-[1.45] tracking-[-.015em]">
            <b className="font-[550]">{CONTACT.company}</b>
            <br />
            {CONTACT.address[0]}
            <br />
            {CONTACT.address[1]}
          </p>
          <p className="mt-[14px] text-[15px] tracking-[-.015em]">
            {CONTACT.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className={`mr-[18px] text-[#000] no-underline hover:text-[#F7A11A] ${FOCUS}`}>
                {phone}
              </a>
            ))}
          </p>
          <dl className="mt-[14px] grid grid-cols-[auto_1fr] gap-x-[16px] gap-y-[6px] text-[12px]">
            {CONTACT.emails.map(([label, email]) => (
              <div key={email} className="contents">
                <dt className="text-[rgba(0,0,0,.55)]">{label}</dt>
                <dd>
                  <a href={`mailto:${email}`} className={`text-[#000] no-underline hover:text-[#F7A11A] ${FOCUS}`}>
                    {email}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </address>
      </div>

      {/* United Carriers' word marquee, carrying the six pillars. Pure CSS, paused under reduced motion. */}
      <div className="overflow-hidden border-b border-b-[rgba(0,0,0,.13)] py-[22px]" aria-hidden="true">
        <div className="footer-marquee flex w-max text-[clamp(1.6rem,3vw,2.8rem)] font-light tracking-[-.04em] text-[rgba(0,0,0,.22)]">
          {[...PILLARS, ...PILLARS].map((pillar, index) => (
            <span key={index} className="flex items-center gap-[48px] pr-[48px] whitespace-nowrap">
              <span className="h-[9px] w-[9px] bg-[#F7A11A]" />
              {pillar.name}
            </span>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-[1fr_auto] items-start gap-[40px] pt-[22px] pb-[10px] text-[10px] leading-[1.55] max-[900px]:grid-cols-1 ${GUTTER}`}>
        <div className="grid gap-[10px]">
          <p className="flex flex-wrap gap-x-[28px] gap-y-[4px] uppercase tracking-[.06em] text-[#000]">
            {REGISTRATIONS.map(([business, number]) => (
              <span key={number}>
                {business} <span className="text-[rgba(0,0,0,.55)]">{number}</span>
              </span>
            ))}
          </p>
          <p className="max-w-[820px] text-[rgba(0,0,0,.6)]">
            Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.
          </p>
        </div>
        <div className="flex gap-[22px] uppercase tracking-[.06em]">
          {[["Privacy", "#top"], ["Terms", "#top"], ["Back to top", "#top"]].map(([label, href]) => (
            <a key={label} href={href} className={`text-[#000] no-underline hover:text-[#F7A11A] ${FOCUS}`}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <DotWordmark />
    </footer>
  );
}
