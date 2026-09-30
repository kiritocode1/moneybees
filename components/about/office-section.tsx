import Image from "next/image";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { DashedRule } from "@/components/hero/editorial";
import { CONTACT } from "@/lib/insights";
import { GROUP_COMPANIES } from "@/lib/about";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6A11A]";

/**
 * The office, group profile p32: the address both group companies share, the
 * main line, and the boardroom photograph from moneybee.in at the size it holds.
 */
export default function OfficeSection() {
  return (
    <section aria-labelledby="office-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-[1fr_minmax(0,573px)] items-center gap-16 py-[110px] max-[900px]:grid-cols-1 max-md:py-[80px]`}>
        <div>
          <span className={`${EYEBROW} text-black/60`}>Our office</span>
          <h2 id="office-heading" className={`${SUBHEAD} mt-[14px]`}>
            Lower Parel, Mumbai
          </h2>
          <address className={`${BODY} mt-[28px] text-black/75 not-italic`}>
            {CONTACT.address[0]}
            <br />
            {CONTACT.address[1]}
          </address>
          <ul className="mt-[28px] grid list-none gap-[6px] border-t border-t-[rgba(0,0,0,.13)] p-0 pt-[18px]">
            {GROUP_COMPANIES.map((company) => (
              <li key={company} className={`${EYEBROW} text-black/60`}>
                {company}
              </li>
            ))}
          </ul>
          <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`} className={`mt-[22px] inline-block font-serif text-[clamp(1.6rem,2.2vw,2rem)] text-black no-underline hover:text-[#F6A11A] ${FOCUS}`}>
            {CONTACT.phones[0]}
          </a>
        </div>
        <div className="relative aspect-[573/408] w-full overflow-hidden bg-[#F4F3F0]">
          <Image src="/people/moneybee-boardroom.jpg" alt="The Moneybee team in the boardroom" fill sizes="(max-width: 900px) 100vw, 573px" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
