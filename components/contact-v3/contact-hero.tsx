"use client";

import { useEffect, useId, useState } from "react";
import { hexPoints, useShown } from "@/components/about-v2/shared";
import { MailIcon, PhoneIcon } from "@/components/contact-v2/glyphs";
import { EYEBROW } from "@/components/hero/tokens";
import { CONTACT_PAGE, EMAIL, OFFICE, PHONE, PHONE_HREF } from "@/lib/contact-v2";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

/** Tres Mares' contact hero: details in three columns beside a mark-masked office photograph. */
export function ContactHero() {
  const mask = useId();
  const { ref, shown } = useShown<HTMLDListElement>(0.25);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section aria-labelledby="contact-heading" className="service-contact-hero relative overflow-hidden bg-[#F6F6F6] text-black">
      <style>{CONTACT_HERO_CSS}</style>
      <div className="service-contact-heading relative z-[1]">
        <h1 id="contact-heading" className="m-0 max-w-[9ch] font-serif text-[clamp(3.5rem,7.5vw,8rem)] leading-[.92] font-normal tracking-[-.02em]">
          {CONTACT_PAGE.heading}
        </h1>
      </div>

      <div className="service-contact-photo" aria-hidden="true">
        <svg viewBox="0 0 1000 900" className="block size-full" focusable="false">
          <defs>
            <clipPath id={mask}>
              <polygon points={hexPoints(500, 450, 448)} />
            </clipPath>
          </defs>
          <image href="/people/moneybee-boardroom.jpg" width="1000" height="900" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${mask})`} className="grayscale-[.95]" />
        </svg>
      </div>

      <dl ref={ref} className="service-contact-details relative z-[1] m-0 grid gap-8">
        <div>
          <dt className={`${EYEBROW} border-b border-[#9D9EA1]/40 pb-4 text-[#767676]`}>Office address</dt>
          <dd className="m-0 pt-5">
            <address className="not-italic">
              <span className="block font-serif text-[26px] leading-[1.1]">{OFFICE.name}</span>
              {OFFICE.lines.map((line) => <span key={line} className="mt-2 block text-[15px] leading-[1.5]">{line}</span>)}
            </address>
          </dd>
        </div>
        <div>
          <dt className={`${EYEBROW} border-b border-[#9D9EA1]/40 pb-4 text-[#767676]`}>Phone</dt>
          <dd className="m-0 pt-5">
            <span className="mb-5 block size-10"><PhoneIcon on={shown} /></span>
            <a href={PHONE_HREF} className={`inline-block text-[18px] leading-[1.3] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-black ${FOCUS}`}>{PHONE}</a>
          </dd>
        </div>
        <div>
          <dt className={`${EYEBROW} border-b border-[#9D9EA1]/40 pb-4 text-[#767676]`}>Email</dt>
          <dd className="relative m-0 pt-5">
            <span className="mb-5 block size-10"><MailIcon on={shown} /></span>
            <button type="button" onClick={copyEmail} aria-label={`Copy ${EMAIL}`} className={`cursor-pointer text-left text-[18px] leading-[1.3] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-black ${FOCUS}`}>{EMAIL}</button>
            <span role="status" className="absolute -bottom-8 left-0 text-[13px]">{copied ? "Copied" : ""}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}

const CONTACT_HERO_CSS = `
.service-contact-hero{min-height:60vw;padding:11.667vw 1.667vw 8vw;display:grid;grid-template-columns:50% 50%;grid-template-rows:auto 1fr;row-gap:16vw}
.service-contact-heading{grid-column:1;grid-row:1}
.service-contact-photo{position:absolute;right:-2vw;bottom:0;width:52vw;height:46.8vw}
.service-contact-details{grid-column:1;grid-row:2;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr);column-gap:2vw;padding-right:2vw;align-self:end}
@keyframes service-contact-title{from{clip-path:inset(0 0 100% 0);transform:translateY(32px)}to{clip-path:inset(0);transform:none}}
@keyframes service-contact-image{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0)}}
@media(prefers-reduced-motion:no-preference){.service-contact-heading{animation:service-contact-title 1s cubic-bezier(.16,1,.3,1) both}.service-contact-photo{animation:service-contact-image 1.2s cubic-bezier(.16,1,.3,1) .2s both}}
@media(max-width:1100px) and (min-width:768px){.service-contact-hero{padding-top:160px;row-gap:12vw}.service-contact-details{grid-column:1/-1;width:62%;grid-template-columns:1fr 1fr;row-gap:36px}.service-contact-details>div:first-child{grid-column:1/-1}.service-contact-photo{width:45vw;height:40.5vw}}
@media(max-width:767px){.service-contact-hero{display:flex;flex-direction:column;padding:148px 24px 64px;gap:40px}.service-contact-heading h1{font-size:62px}.service-contact-photo{position:relative;right:auto;bottom:auto;align-self:center;width:calc(100% + 48px);height:auto;aspect-ratio:10/9;margin-top:-12px}.service-contact-details{grid-template-columns:1fr 1fr;gap:36px 20px;padding:0}.service-contact-details>div:first-child{grid-column:1/-1}}
`;
