import Image from "next/image";
import { BODY, BUTTON, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { CAREERS, RESUME_EMAIL, RESUME_HREF } from "@/lib/careers";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const PRIMARY = `${BUTTON} bg-[#F6A11A] text-black hover:bg-black hover:text-white motion-reduce:transition-none`;

/** A compact introduction keeps the job board above the workplace content. */
export function CareersIntro() {
  return (
    <section aria-labelledby="careers-heading" className="pt-[144px] pb-10 max-md:pt-[120px] md:pb-12">
      <div className={COLUMN}>
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            <p className="mb-4 text-[13px] text-black/60">Careers at Moneybee</p>
            <h1 id="careers-heading" className="m-0 max-w-[16ch] font-serif text-[clamp(2.8rem,4.3vw,4.5rem)] leading-[1.02] font-normal tracking-[-.025em]">
              Build your career with Moneybee
            </h1>
          </div>
          <div className="pb-1">
            <p className={`${BODY} max-w-[34ch] text-black/75`}>{CAREERS.lead}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#openings" className={PRIMARY}>View roles</a>
              <a href={RESUME_HREF} className={`text-[14px] font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black ${FOCUS}`}>
                Send your resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Real office photography and team information replace unapproved culture claims. */
export function CareersOfficeSection() {
  return (
    <section id="life" aria-labelledby="life-heading" className="scroll-mt-[120px] bg-[#F6F6F6] py-[88px] max-md:py-[64px]">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
        <figure className="m-0">
          <div className="relative aspect-[573/408] overflow-hidden bg-black/5">
            <Image src="/people/moneybee-boardroom.jpg" alt="The Moneybee team in a meeting at the office" fill sizes="(max-width: 1024px) calc(100vw - 48px), 560px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-[12px] text-black/60">At our Lower Parel office</figcaption>
        </figure>
        <div>
          <h2 id="life-heading" className={SUBHEAD}>Life at Moneybee</h2>
          <p className={`${BODY} mt-6 max-w-[30ch] text-black/75`}>
            Our team works across listed and unlisted company research, portfolio management, corporate advisory and compliance.
          </p>
          <p className="mt-5 max-w-[40ch] text-[16px] leading-[1.6] text-black/65">
            Based in Lower Parel, Mumbai, Moneybee Group has been working with businesses and investors since 2004.
          </p>
          <Link href="/about#key-members" className={`mt-8 inline-flex min-h-11 items-center text-[14px] font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black ${FOCUS}`}>
            Meet the team
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The existing email application path, with no invented interview stages or response promises. */
export function CareersResumeSection() {
  return (
    <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-[120px] bg-black py-[96px] text-white max-md:py-[72px]">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20`}>
        <div>
          <h2 id="apply-heading" className="max-w-[16ch] font-serif text-[clamp(2.8rem,4.3vw,4.5rem)] leading-[1.05] font-normal tracking-[-.025em]">Tell us about yourself.</h2>
          <p className="mt-6 max-w-[38ch] text-[16px] leading-[1.6] text-white/70">
            Send your resume with a short note about your experience and the team you would like to work with.
          </p>
        </div>
        <div className="border-t border-white/25 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
          <a href={RESUME_HREF} className={`${BUTTON} bg-[#F6A11A] text-black hover:bg-white focus-visible:outline-white motion-reduce:transition-none`}>Send your resume</a>
          <a href={RESUME_HREF} className={`mt-5 block w-fit text-[15px] text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white ${FOCUS}`}>{RESUME_EMAIL}</a>
          <p className="mt-4 text-[13px] text-white/50">Opens your email app.</p>
        </div>
      </div>
    </section>
  );
}
