"use client";

import { useInView } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, type KeyboardEvent, Suspense, useEffect, useId, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import {
  CONTACT_PAGE,
  EMAIL,
  ENQUIRIES,
  type Enquiry,
  type EnquiryField,
  enquiryFromParam,
  enquiryMailto,
  MAP_EMBED,
  MAP_LINK,
  OFFICE,
  PHONE,
  PHONE_HREF,
} from "@/lib/contact-v2";
import { MailIcon, PhoneIcon } from "./glyphs";

/*
 * /contact, content plan §11, on realevate.agency/contact's layout
 * (reference/realevate-contact/NOTES.md). From 1024px the first screen is
 * three columns: a slow vertical "Contact" marquee, the heading over the
 * office, phone and email, and the four enquiry options as tabs over an
 * underline-only form. The form has no backend: sending it opens a mailto to
 * info@moneybee.in with the filled fields. `?enquiry=pms` (or aif, support,
 * general) preselects a tab, so product pages can link here.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
/** Realevate's UI-state curve, used for the tab underline, tab colour and field borders. */
const UI_EASE = "cubic-bezier(.7,.6,0,1)";

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/**
 * The first screen. Below 1024px the columns stack: the marquee as one
 * horizontal line, then the details, then the tabs and form.
 */
export function ContactScreen() {
  return (
    <section aria-labelledby="contact-heading" className="relative bg-white pt-[112px] text-black lg:grid lg:pt-0 lg:min-h-[max(100svh,880px)] lg:grid-cols-[minmax(220px,.62fr)_minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end">
      <Marquee />
      <ContactDetails />
      <div id="enquiry" className="scroll-mt-[96px] px-6 pt-[64px] pb-[96px] md:px-[120px] lg:pt-[168px] lg:pr-[max(64px,calc((100vw_-_1512px)/2_+_120px))] lg:pl-[24px] lg:pb-[88px]">
        <Suspense fallback={<EnquiryTabs initial={ENQUIRIES[0].id} />}>
          <EnquiryFromParams />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * The word "Contact" in orange outline, repeated along a track that moves at
 * about 110px/s (Realevate measured 111px/s). The track holds two identical
 * halves and moves by one half, so the loop has no seam. Vertical from
 * 1024px, reading bottom to top; one horizontal line below that.
 */
function Marquee() {
  const words = Array.from({ length: 3 }, (_, index) => (
    <span key={index} className="contact-marquee-word">
      Contact
    </span>
  ));
  return (
    <div aria-hidden="true" className="contact-marquee pointer-events-none relative overflow-hidden select-none lg:self-stretch">
      <div className="contact-marquee-track">
        <div className="contact-marquee-half">{words}</div>
        <div className="contact-marquee-half">{words}</div>
      </div>
      <style>{MARQUEE_CSS}</style>
    </div>
  );
}

/*
 * Instrument Serif "Contact" measures about 3.3em plus a .35em gap, so one
 * half of three words measures 1864px at 220px type (17s at about 110px/s)
 * and 1017px at 120px type (9s).
 */
const MARQUEE_CSS = `
.contact-marquee{height:132px}
.contact-marquee-track{display:flex;width:max-content;animation:contact-marquee-x 9s linear infinite}
.contact-marquee-half{display:flex;flex:none}
.contact-marquee-word{font-family:var(--font-instrument-serif),Georgia,serif;font-size:120px;line-height:1.1;padding-inline:.175em;color:transparent;-webkit-text-stroke:1.5px #F6A11A;white-space:nowrap;letter-spacing:-.02em}
@keyframes contact-marquee-x{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes contact-marquee-y{from{transform:translateY(-50%)}to{transform:translateY(0)}}
@media (min-width:1024px){
.contact-marquee{height:auto;margin-top:128px}
.contact-marquee-track{position:absolute;top:0;left:50%;margin-left:-.5em;font-size:220px;flex-direction:column;width:auto;animation:contact-marquee-y 17s linear infinite}
.contact-marquee-half{display:block;writing-mode:vertical-rl;white-space:nowrap;transform:rotate(180deg)}
.contact-marquee-word{display:inline-block;font-size:220px;line-height:1}
}
@media (prefers-reduced-motion:reduce){.contact-marquee-track{animation:none}}
`;

/** The heading over the office, phone and email. The email button copies the address and says so in a chip. */
function ContactDetails() {
  const { ref, shown } = useShown<HTMLDListElement>(0.5);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };
  const label = `${EYEBROW} text-black/55`;
  const value = "mt-[6px] block font-serif text-[clamp(1.35rem,1.1rem+.6vw,1.7rem)] leading-[1.2]";
  return (
    <div className="px-6 pt-[40px] md:px-[120px] lg:px-[24px] lg:pt-[168px] lg:pb-[88px] xl:pl-[48px]">
      <Rise>
        <h1 id="contact-heading" className={`${HEADING} max-w-[440px] text-balance`}>
          {CONTACT_PAGE.heading}
        </h1>
      </Rise>
      <Rise delay={0.08}>
        <dl ref={ref} className="m-0 mt-[48px] grid gap-[32px] lg:mt-[72px]">
          <div>
            <dt className={label}>Office address</dt>
            <dd className="m-0">
              <address className={`${value} not-italic`}>
                {OFFICE.name}
                {OFFICE.lines.map((line) => (
                  <span key={line} className="block text-[clamp(1.05rem,.95rem+.3vw,1.2rem)] leading-[1.45] text-black/70 font-sans">
                    {line}
                  </span>
                ))}
              </address>
            </dd>
          </div>
          <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-[16px]">
            <span className="row-span-2 block h-[44px] w-[44px]">
              <DelayedIcon Icon={PhoneIcon} on={shown} delay={0} />
            </span>
            <dt className={label}>Phone</dt>
            <dd className="m-0">
              <a href={PHONE_HREF} className={`${value} w-fit text-black underline decoration-transparent decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-[#F6A11A] ${FOCUS}`}>
                {PHONE}
              </a>
            </dd>
          </div>
          <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-[16px]">
            <span className="row-span-2 block h-[44px] w-[44px]">
              <DelayedIcon Icon={MailIcon} on={shown} delay={350} />
            </span>
            <dt className={label}>Email</dt>
            <dd className="relative m-0 flex flex-wrap items-center gap-x-[12px]">
              <button
                type="button"
                onClick={copy}
                aria-label={`Copy ${EMAIL}`}
                className={`${value} cursor-pointer border-0 bg-transparent p-0 text-left text-black underline decoration-transparent decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-[#F6A11A] ${FOCUS}`}
              >
                {EMAIL}
              </button>
              <span
                role="status"
                className="mt-[6px] rounded-[3px] bg-black px-[8px] py-[3px] text-[12px] leading-[1.4] text-white transition-opacity duration-200 motion-reduce:transition-none"
                style={{ opacity: copied ? 1 : 0 }}
              >
                {copied ? "Copied" : ""}
              </span>
            </dd>
          </div>
        </dl>
      </Rise>
    </div>
  );
}

function DelayedIcon({ Icon, on, delay }: { Icon: typeof PhoneIcon; on: boolean; delay: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return <Icon on={ready} />;
}

/** The office address on black beside the map; the map drops its colour to sit in the band. */
export function OfficeSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="office" aria-labelledby="office-heading" className="scroll-mt-[96px] bg-black text-white">
      <div ref={ref} className={`${COLUMN} grid grid-cols-1 items-stretch gap-12 py-[120px] md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:gap-16 max-md:py-[80px]`}>
        <div className="flex flex-col">
          <BracketLabel>Office address</BracketLabel>
          <h2 id="office-heading" className={`mt-[18px] ${SUBHEAD}`}>
            {OFFICE.name}
          </h2>
          <address className="mt-[28px] font-serif text-[clamp(1.35rem,1rem+.9vw,1.8rem)] leading-[1.3] not-italic text-white/90">
            {OFFICE.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-[24px] max-w-[440px] text-[15px] leading-[1.55] text-white/65">{OFFICE.text}</p>
          <a href={MAP_LINK} target="_blank" rel="noreferrer" className={`group mt-auto inline-flex w-fit items-center gap-[10px] pt-[36px] text-[15px] text-white no-underline transition-colors duration-200 hover:text-[#F6A11A] ${FOCUS}`}>
            <span className="h-[2px] w-[28px] bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-[4px] motion-reduce:transition-none" aria-hidden="true" />
            Open in OpenStreetMap
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
        <div className="relative min-h-[360px] overflow-hidden border border-white/15 bg-white/5 md:min-h-[440px]">
          <iframe
            title="Map of Peninsula Business Park, Lower Parel, Mumbai"
            src={MAP_EMBED}
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0 grayscale-[.85] contrast-[1.05]"
          />
          {/* A ring pulses on the office once the band is in view. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[64px] w-[64px] rounded-full border-2 border-[#F6A11A] motion-reduce:!transition-none"
            style={{ opacity: shown ? 1 : 0, transform: `translate(-50%, -62%) scale(${shown ? 1 : 2.4})`, transition: "opacity 900ms cubic-bezier(.22,1,.36,1) 300ms, transform 900ms cubic-bezier(.22,1,.36,1) 300ms" }}
          />
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 h-[64px] w-[64px] animate-[contact-pulse_2.4s_ease-out_infinite] rounded-full border border-[#F6A11A] motion-reduce:hidden" />
        </div>
      </div>
      <style>{"@keyframes contact-pulse{0%{transform:translate(-50%,-62%) scale(1);opacity:.9}100%{transform:translate(-50%,-62%) scale(2.6);opacity:0}}"}</style>
    </section>
  );
}

function EnquiryFromParams() {
  const initial = enquiryFromParam(useSearchParams().get("enquiry")) ?? ENQUIRIES[0].id;
  return <EnquiryTabs key={initial} initial={initial} />;
}

/**
 * The four enquiry options as tabs over one form. The typed values live here,
 * not in the form, so switching tab keeps the name, email and phone already
 * typed. Arrow keys, Home and End move between tabs.
 */
function EnquiryTabs({ initial }: { initial: Enquiry["id"] }) {
  const [activeId, setActiveId] = useState<Enquiry["id"]>(initial);
  const [values, setValues] = useState<Record<string, string>>({});
  const active = ENQUIRIES.find((enquiry) => enquiry.id === activeId) ?? ENQUIRIES[0];
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = ENQUIRIES.findIndex((enquiry) => enquiry.id === activeId);
    const last = ENQUIRIES.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActiveId(ENQUIRIES[next].id);
    tabs.current[next]?.focus();
  };
  return (
    <div className="lg:max-w-[540px]">
      <div role="tablist" aria-label="Enquiry options" onKeyDown={onKeyDown} className="grid grid-cols-2 sm:grid-cols-4">
        {ENQUIRIES.map((enquiry, index) => {
          const selected = enquiry.id === active.id;
          return (
            <button
              key={enquiry.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${enquiry.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(enquiry.id)}
              className={`relative min-h-[48px] cursor-pointer border-0 border-b border-solid border-b-black/15 bg-transparent px-[4px] pb-[14px] pt-[10px] text-[15px] leading-[1.25] font-medium sm:whitespace-nowrap hover:text-black ${selected ? "text-black" : "text-black/55"} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black`}
              style={{ transition: `color .25s ${UI_EASE}` }}
            >
              {enquiry.name}
              <span
                aria-hidden="true"
                className="absolute right-0 -bottom-px left-0 h-[2px] bg-[#F6A11A] motion-reduce:!transition-none"
                style={{ transform: `scaleX(${selected ? 1 : 0})`, transition: `transform .5s ${UI_EASE}` }}
              />
            </button>
          );
        })}
      </div>
      <EnquiryForm
        id={`${base}-panel`}
        labelledBy={`${base}-tab-${active.id}`}
        enquiry={active}
        values={values}
        onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
      />
    </div>
  );
}

/** Fields that sit two to a row from 640px; the rest take the full width. */
const HALF = new Set(["phone", "amount", "city", "investor", "commitment", "client", "topic"]);

/** The form for one option. Sending it opens the visitor's mail app with the fields filled in. */
function EnquiryForm({
  id,
  labelledBy,
  enquiry,
  values,
  onChange,
}: {
  id: string;
  labelledBy: string;
  enquiry: Enquiry;
  values: Readonly<Record<string, string>>;
  onChange: (name: string, value: string) => void;
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = enquiryMailto(enquiry, values);
  };
  return (
    <form id={id} role="tabpanel" aria-labelledby={labelledBy} onSubmit={onSubmit} className="mt-[28px]">
      <div className="grid grid-cols-1 gap-x-[20px] gap-y-[20px] sm:grid-cols-2">
        {enquiry.fields.map((field) => (
          <Field key={field.name} field={field} half={HALF.has(field.name)} value={values[field.name] ?? ""} onChange={(value) => onChange(field.name, value)} />
        ))}
      </div>
      <p className="mt-[18px] text-[12px] text-black/55">
        <span aria-hidden="true">*</span> required
      </p>
      <button
        type="submit"
        className={`group relative mt-[24px] inline-flex cursor-pointer items-center overflow-hidden rounded-full border-0 bg-[#F6A11A] px-[28px] py-[13px] text-[15px] font-medium text-black transition-[color,scale] duration-300 hover:text-white active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[101%] rounded-full bg-black transition-transform duration-300 group-hover:translate-y-0 motion-reduce:transition-none"
          style={{ transitionTimingFunction: UI_EASE }}
        />
        <span className="relative">Get Started</span>
      </button>
    </form>
  );
}

function Field({ field, half, value, onChange }: { field: EnquiryField; half: boolean; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const input =
    "mt-[4px] block w-full appearance-none rounded-none border-0 border-b border-solid border-b-black/25 bg-transparent px-0 py-[8px] text-[16px] text-black outline-none focus:border-b-black focus:shadow-[0_1px_0_0_#000]";
  const transition = { transition: `border-color .3s ${UI_EASE}, box-shadow .3s ${UI_EASE}` };
  return (
    <div className={half ? "" : "sm:col-span-2"}>
      <label htmlFor={id} className="block text-[13px] leading-[1.4] text-black/55">
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {field.options ? (
        <div className="relative">
          <select id={id} name={field.name} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${input} cursor-pointer pr-[24px]`} style={transition}>
            <option value="">Choose one</option>
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <svg viewBox="0 0 10 6" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-[2px] h-[6px] w-[10px]">
            <path d="M0 0h10L5 6Z" fill="#000" />
          </svg>
        </div>
      ) : field.type === "textarea" ? (
        <textarea id={id} name={field.name} rows={3} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${input} resize-none`} style={transition} />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type ?? "text"}
          required={field.required}
          autoComplete={field.autoComplete}
          inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : undefined}
          spellCheck={field.type === "email" ? false : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={input}
          style={transition}
        />
      )}
    </div>
  );
}
