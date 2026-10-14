"use client";

import Image from "next/image";
import { BODY, BUTTON, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { RESUME_HREF } from "@/lib/careers";
import { CAREERS_INTRO, CAREERS_OFFICE, CAREERS_RESUME, type CareersIntroContent, type CareersOfficeContent, type CareersResumeContent } from "@/lib/pages/careers-content";

/*
 * /careers around its job board (components/careers/careers-job-board.tsx).
 * The words are edited in /admin; "Send your resume" opens the apply form as
 * an open application (/careers/apply), so it reaches Hiring in /admin.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const PRIMARY = `${BUTTON} bg-[#F6A11A] text-black hover:bg-black hover:text-white motion-reduce:transition-none`;

/** A compact introduction keeps the job board above the workplace content. */
export function CareersIntro({ content = CAREERS_INTRO }: { content?: CareersIntroContent }) {
  return (
    <section aria-labelledby="careers-heading" className="pt-[144px] pb-10 max-md:pt-[120px] md:pb-12">
      <div className={COLUMN}>
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            {content.label ? <p className="mb-4 text-[13px] text-black/60">{content.label}</p> : null}
            <h1 id="careers-heading" className="m-0 max-w-[16ch] font-serif text-[clamp(2.8rem,4.3vw,4.5rem)] leading-[1.02] font-bold tracking-[-.025em]">
              {content.heading}
            </h1>
          </div>
          <div className="pb-1">
            {content.lead ? <p className={`${BODY} max-w-[34ch] text-black/75`}>{content.lead}</p> : null}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
              {content.buttonLabel ? <a href="#openings" className={PRIMARY}>{content.buttonLabel}</a> : null}
              {content.resumeLabel ? (
                <Link href={RESUME_HREF} className={`text-[14px] font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black ${FOCUS}`}>
                  {content.resumeLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Real office photography and team information replace unapproved culture claims. */
export function CareersOfficeSection({ content = CAREERS_OFFICE, photo }: { content?: CareersOfficeContent; photo?: { src: string; alt: string } }) {
  return (
    <section id="life" aria-labelledby="life-heading" className="scroll-mt-[120px] bg-[#F6F6F6] py-[88px] max-md:py-[64px]">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
        <figure className="m-0">
          <div className="relative aspect-[573/408] overflow-hidden bg-black/5">
            <Image src={photo?.src ?? "/people/moneybee-boardroom.jpg"} alt={photo?.alt ?? "The Moneybee team in a meeting at the office"} fill sizes="(max-width: 1024px) calc(100vw - 48px), 560px" className="object-cover" />
          </div>
          {content.caption ? <figcaption className="mt-3 text-[12px] text-black/60">{content.caption}</figcaption> : null}
        </figure>
        <div>
          <h2 id="life-heading" className={SUBHEAD}>{content.heading}</h2>
          {content.text ? <p className={`${BODY} mt-6 max-w-[30ch] text-black/75`}>{content.text}</p> : null}
          {content.detail ? <p className="mt-5 max-w-[40ch] text-[16px] leading-[1.6] text-black/65">{content.detail}</p> : null}
          {content.linkLabel && content.link ? (
            <Link href={content.link} className={`mt-8 inline-flex min-h-11 items-center text-[14px] font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black ${FOCUS}`}>
              {content.linkLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** The open application, with no invented interview stages or response promises. */
export function CareersResumeSection({ content = CAREERS_RESUME }: { content?: CareersResumeContent }) {
  return (
    <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-[120px] bg-black py-[96px] text-white max-md:py-[72px]">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20`}>
        <div>
          <h2 id="apply-heading" className="max-w-[16ch] font-serif text-[clamp(2.8rem,4.3vw,4.5rem)] leading-[1.05] font-bold tracking-[-.025em]">{content.heading}</h2>
          {content.text ? <p className="mt-6 max-w-[38ch] text-[16px] leading-[1.6] text-white/70">{content.text}</p> : null}
        </div>
        <div className="border-t border-white/25 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
          <Link href={RESUME_HREF} className={`${BUTTON} bg-[#F6A11A] text-black hover:bg-white focus-visible:outline-white motion-reduce:transition-none`}>{content.buttonLabel}</Link>
          {content.note ? <p className="mt-4 text-[13px] text-white/50">{content.note}</p> : null}
        </div>
      </div>
    </section>
  );
}
