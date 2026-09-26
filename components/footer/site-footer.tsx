import { BracketLabel } from "@/components/fact-sections/fact-section";
import { CONTACT, RECORD_METHOD, REGISTRATIONS } from "@/lib/insights";
import DotMarquee from "./dot-marquee";
import DotWordmark from "./dot-wordmark";
import MumbaiClock from "./mumbai-clock";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";
const GUTTER = "px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[22px]";

type Link = readonly [label: string, href: string];

const LABEL = "text-[11px] uppercase tracking-[.08em] text-[rgba(0,0,0,.55)]";
const LINK = `text-[16px] leading-[1.35] tracking-[-.015em] text-[#000] no-underline transition-colors duration-200 hover:text-[#F7A11A] ${FOCUS}`;

/**
 * The footer, after footer.design and Aspen Search: the brand line as a dot
 * marquee, four columns on the page's own
 * gutter, the legal lines, and United Carriers' dot-matrix wordmark to end on.
 * Everything shares one left edge. The office clock sits with the office
 * address it belongs to. Every line is either the existing footer's or the
 * decks' own (contact p17, registrations p15).
 */
export default function SiteFooter({ explore }: { explore: readonly Link[] }) {
  const columns: readonly (readonly [string, readonly Link[]])[] = [
    ["Explore", explore],
    ["Investors", [["Investor login", "https://www.moneybee.in/register.php"], ["Investor Charter", "#contact"], ["Disclosure Document", "#contact"], ["Grievance redressal", "#contact"], ["SEBI SCORES", "#contact"]]],
  ];

  return (
    <footer id="contact" className="border-t border-t-[#000] bg-white text-[#000000]">
      {/* The brand line as a marquee in orange dots, the wordmark's lattice set moving. */}
      <div className="pt-[64px] pb-[48px]">
        <DotMarquee text="Know Venture. Know Gain." />
      </div>

      {/* Four columns on the page gutter: two of links, then how to write to us and where to find us. */}
      <div className={`grid grid-cols-[1fr_1fr_1.3fr_1.3fr] gap-x-[48px] gap-y-[56px] border-t border-t-[#000] pt-[64px] pb-[72px] max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1 ${GUTTER}`}>
        {columns.map(([heading, links]) => (
          <nav key={heading} aria-label={heading}>
            <BracketLabel>{heading}</BracketLabel>
            <ul className="mt-[22px] grid list-none gap-[12px] p-0">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className={LINK}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <BracketLabel>Write to us</BracketLabel>
          <dl className="mt-[22px] grid gap-[16px]">
            {CONTACT.emails.map(([label, email]) => (
              <div key={email}>
                <dt className={LABEL}>{label}</dt>
                <dd className="mt-[4px]">
                  <a href={`mailto:${email}`} className={LINK}>
                    {email}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <address className="not-italic">
          <BracketLabel>Visit us</BracketLabel>
          <p className="mt-[22px] text-[16px] leading-[1.45] tracking-[-.015em]">
            <b className="font-[550]">{CONTACT.company}</b>
            <br />
            {CONTACT.address[0]}
            <br />
            {CONTACT.address[1]}
          </p>
          <p className="mt-[16px] flex flex-wrap gap-x-[20px] gap-y-[4px]">
            {CONTACT.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className={LINK}>
                {phone}
              </a>
            ))}
          </p>
          <div className="mt-[24px]">
            <MumbaiClock />
          </div>
        </address>
      </div>

      <div className={`border-t border-t-[rgba(0,0,0,.13)] pt-[24px] pb-[28px] text-[11px] leading-[1.6] ${GUTTER}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-[40px] gap-y-[12px] uppercase tracking-[.06em]">
          <p className="flex flex-wrap gap-x-[28px] gap-y-[4px] text-[#000]">
            {REGISTRATIONS.map(([business, number]) => (
              <span key={number}>
                {business} <span className="text-[rgba(0,0,0,.55)]">{number}</span>
              </span>
            ))}
          </p>
          <nav aria-label="Legal" className="flex gap-[22px]">
            {[["Privacy", "#top"], ["Terms", "#top"], ["Back to top", "#top"]].map(([label, href]) => (
              <a key={label} href={href} className={`text-[#000] no-underline hover:text-[#F7A11A] ${FOCUS}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-[16px] grid grid-cols-2 gap-[48px] text-[rgba(0,0,0,.6)] max-[900px]:grid-cols-1 max-[900px]:gap-[10px]">
          <p>
            Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.
          </p>
          {/* The method behind the returns shown on the page, AIF presentation p12. */}
          <p>{RECORD_METHOD}</p>
        </div>
      </div>

      <DotWordmark />
    </footer>
  );
}
