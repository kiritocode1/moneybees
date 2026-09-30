"use client";

import { useInView } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useEffect, useId, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import {
  CONTACT_LOREM,
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
import { ENQUIRY_GLYPHS, MailIcon, PhoneIcon } from "./glyphs";

/*
 * /contact, content plan §11: the heading with the contact details and the
 * Get Started button, the office on a map, and the four enquiry options
 * shaping a simple form. The form has no backend: sending it opens a mailto
 * to info@moneybee.in with the filled fields. `?enquiry=pms` (or aif,
 * support, general) preselects an option, so product pages can link here.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const CTA = `inline-flex w-fit items-center rounded-full bg-[#F6A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[color,background-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-black hover:text-white active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;
const number = (index: number) => String(index + 1).padStart(2, "0");

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/** The heading beside the two direct lines, each with an icon that plays once in view. */
export function ContactHero() {
  const { ref, shown } = useShown<HTMLDivElement>(0.5);
  const lines = [
    { label: "Phone", value: PHONE, href: PHONE_HREF, Icon: PhoneIcon },
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, Icon: MailIcon },
  ] as const;
  return (
    <section aria-labelledby="contact-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Contact us</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="contact-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {CONTACT_PAGE.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{CONTACT_PAGE.lead}</p>
          </Rise>
          <Rise delay={0.18}>
            <a href="#enquiry" className={`mt-10 ${CTA}`}>
              Get Started
            </a>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <div ref={ref}>
            <span className={`${EYEBROW} text-black/60`}>Contact details</span>
            <ul className="mt-[14px] list-none border-t border-black p-0">
              {lines.map(({ label, value, href, Icon }, index) => (
                <li key={label} className="border-b border-black/15">
                  <a href={href} className={`group grid grid-cols-[56px_minmax(0,1fr)] items-center gap-[18px] py-[20px] text-black no-underline ${FOCUS}`}>
                    <span className="block h-[56px] w-[56px]">
                      <DelayedIcon Icon={Icon} on={shown} delay={index * 350} />
                    </span>
                    <span>
                      <span className={`${EYEBROW} block text-black/60`}>{label}</span>
                      <span className="mt-[4px] block font-serif text-[clamp(1.5rem,1.1rem+1vw,2.1rem)] leading-[1.1] break-words underline decoration-transparent decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-200 group-hover:decoration-[#F6A11A]">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </section>
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

/**
 * The enquiry section. It reads `?enquiry=` for the first choice; the
 * fallback renders the default choice so the page still prerenders.
 */
export function EnquirySection() {
  return (
    <Suspense fallback={<EnquiryBody initial={ENQUIRIES[0].id} />}>
      <EnquiryFromParams />
    </Suspense>
  );
}

function EnquiryFromParams() {
  const initial = enquiryFromParam(useSearchParams().get("enquiry")) ?? ENQUIRIES[0].id;
  return <EnquiryBody key={initial} initial={initial} />;
}

/**
 * The four enquiry options as native radios, each labelled by a drawn card;
 * the chosen one shapes the form beside it. The typed values live here, not in
 * the form, so switching option keeps the name, email and phone already typed.
 */
function EnquiryBody({ initial }: { initial: Enquiry["id"] }) {
  const [activeId, setActiveId] = useState<Enquiry["id"]>(initial);
  const [values, setValues] = useState<Record<string, string>>({});
  const active = ENQUIRIES.find((enquiry) => enquiry.id === activeId) ?? ENQUIRIES[0];
  const group = useId();
  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-black/60`}>03</span>
            <h2 id="enquiry-heading" className={`mt-[14px] ${SUBHEAD}`}>
              Enquiry Options
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CONTACT_LOREM.long}</p>
        </div>
        <div className="mt-[56px] grid grid-cols-1 gap-[2px] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="sr-only">Choose an enquiry option</legend>
            <div className="grid grid-cols-2 gap-[2px]">
              {ENQUIRIES.map((enquiry, index) => {
                const Glyph = ENQUIRY_GLYPHS[enquiry.glyph];
                const selected = enquiry.id === active.id;
                return (
                  <label
                    key={enquiry.id}
                    className={`relative flex cursor-pointer flex-col p-[24px] text-left transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-4px] has-[:focus-visible]:outline-current max-sm:p-[16px] ${selected ? "bg-black text-white" : "bg-white text-black hover:bg-white/60"}`}
                  >
                    <input type="radio" name={`${group}-enquiry`} value={enquiry.id} checked={selected} onChange={() => setActiveId(enquiry.id)} className="sr-only" />
                    <span className="flex items-center justify-between">
                      <span className={`${EYEBROW} ${selected ? "text-[#F6A11A]" : "text-black/60"}`}>{number(index)}</span>
                      <span className={`h-[12px] w-[12px] rounded-full border transition-colors duration-200 ${selected ? "border-[#F6A11A] bg-[#F6A11A]" : "border-black/40"}`} aria-hidden="true" />
                    </span>
                    <span className="mt-[16px] block h-[60px] w-[80px]">
                      <Glyph on={selected} ink={selected ? "#fff" : "#000"} />
                    </span>
                    <span className="mt-[18px] font-serif text-[clamp(1.2rem,1.05rem+.7vw,1.7rem)] leading-[1.1] max-sm:mt-[10px]">{enquiry.name}</span>
                    <span className={`mt-[8px] text-[14px] leading-[1.5] max-sm:hidden ${selected ? "text-white/65" : "text-black/60"}`}>{enquiry.text}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <EnquiryForm enquiry={active} values={values} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} />
        </div>
      </div>
    </section>
  );
}

/** The form for one option. Sending it opens the visitor's mail app with the fields filled in. */
function EnquiryForm({ enquiry, values, onChange }: { enquiry: Enquiry; values: Readonly<Record<string, string>>; onChange: (name: string, value: string) => void }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = enquiryMailto(enquiry, values);
  };
  return (
    <form onSubmit={onSubmit} aria-labelledby="enquiry-form-heading" className="bg-white p-[36px] max-[600px]:p-[22px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-black pb-[16px]">
        <h3 id="enquiry-form-heading" aria-live="polite" className="font-serif text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] leading-none">
          {enquiry.name}
        </h3>
        <span className={`${EYEBROW} shrink-0 text-black/60`}>To {EMAIL}</span>
      </div>
      <p className="mt-[14px] text-[13px] text-black/60">
        <span aria-hidden="true">*</span> required
      </p>
      <div className="mt-[14px] grid grid-cols-1 gap-x-[20px] gap-y-[18px] sm:grid-cols-2">
        {enquiry.fields.map((field) => (
          <Field key={field.name} field={field} value={values[field.name] ?? ""} onChange={(value) => onChange(field.name, value)} />
        ))}
      </div>
      <div className="mt-[28px] flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" className={`${CTA} cursor-pointer border-0`}>
          Send enquiry
        </button>
        <span className="text-[13px] text-black/60">Opens your email app with these details.</span>
      </div>
    </form>
  );
}

function Field({ field, value, onChange }: { field: EnquiryField; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const input =
    "mt-[6px] block w-full rounded-none border-0 border-b border-black/40 bg-transparent px-0 py-[8px] text-[16px] text-black outline-none transition-[border-color] duration-200 focus:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
  const wide = field.type === "textarea" ? "sm:col-span-2" : "";
  return (
    <label htmlFor={id} className={`block ${wide}`}>
      <span className={`${EYEBROW} text-black/60`}>
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="text-black">
            {" "}
            *
          </span>
        )}
      </span>
      {field.options ? (
        <select id={id} name={field.name} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${input} cursor-pointer`}>
          <option value="">Choose one</option>
          {field.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea id={id} name={field.name} rows={4} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${input} resize-y`} />
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
        />
      )}
    </label>
  );
}
