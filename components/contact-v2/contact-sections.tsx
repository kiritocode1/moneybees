"use client";

import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, type KeyboardEvent, Suspense, useId, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import {
  CONTACT_PAGE,
  DIRECTIONS_HREF,
  EMAIL,
  ENQUIRIES,
  type Enquiry,
  type EnquiryField,
  enquiryFromParam,
  enquiryMailto,
  MAP_EMBED,
  OFFICE,
  PHONE,
  PHONE_HREF,
} from "@/lib/contact-v2";
import { CONTACT } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * /contact, content plan §11: the page opens on the enquiry (no hero, user,
 * 2026-10-08). The form sits in a white card on the site grey, in the same
 * card language as the client sign-in and the door cards: a segmented
 * control for the four topics, outlined fields two to a row, one orange
 * action. The direct lines sit beside it. Then the office card and its map. The form
 * has no backend yet: sending it opens a mailto to info@moneybee.in with the
 * filled fields. Every enquiry link on the site lands here on the General tab
 * (ENQUIRY_HREF); `?enquiry=pms` (or aif, support) preselects another.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

/** The card every form and door on the site sits in (components/cta/door-card.tsx, components/portal/portal-frame.tsx). */
const CARD = "rounded-[20px] border border-black/[.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-16px_rgba(0,0,0,.12)]";

/** One direct line: an icon chip, what it is for, and the address or number as a link. */
function DirectLine({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href: string }) {
  return (
    <div className="flex items-start gap-[14px]">
      <span aria-hidden="true" className="mt-[2px] inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-black/[.08] bg-white">
        <Icon size={16} strokeWidth={1.5} />
      </span>
      <div className="min-w-0">
        <dt className="text-[13px] text-black/55">{label}</dt>
        <dd className="m-0 mt-[2px] text-[15px] break-words">
          <a href={href} className={`text-black no-underline transition-colors duration-200 hover:text-[#C77A00] ${FOCUS}`}>
            {value}
          </a>
        </dd>
      </div>
    </div>
  );
}

/**
 * The first section of /contact. It starts at the top of the page under the
 * absolute nav (113px, 75px on phones), so #enquiry needs no scroll margin.
 * Desktop: the heading and the direct lines on the left, the form card on the
 * right. Phones: heading, form card, then the lines, so the enquiry is always
 * the first thing after the heading.
 */
export function EnquirySection() {
  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="bg-white pt-[113px] text-black max-md:pt-[75px]">
      <div className="border-t border-black/10 bg-[#F6F6F6]">
        <div className={`${COLUMN} grid grid-cols-1 gap-x-6 gap-y-10 pt-[64px] pb-[96px] md:grid-cols-12 md:grid-rows-[auto_1fr] max-md:pt-[36px] max-md:pb-[56px]`}>
          <div className="md:col-span-4 md:row-start-1">
            <BracketLabel>Get Started</BracketLabel>
            <h1 id="enquiry-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {CONTACT_PAGE.heading}
            </h1>
          </div>
          <div className={`${CARD} p-[32px] md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1 max-md:p-[20px]`}>
            <Suspense fallback={<EnquiryTabs initial="general" />}>
              <EnquiryFromParams />
            </Suspense>
          </div>
          <dl className="m-0 grid content-start gap-y-[20px] md:col-span-4 md:row-start-2">
            <DirectLine icon={Phone} label="Phone" value={PHONE} href={PHONE_HREF} />
            <DirectLine icon={Mail} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} />
            <p className={`${EYEBROW} mt-[12px] text-black/55`}>Flyingbee AIF desks</p>
            {CONTACT.emails.map(([label, address]) => (
              <DirectLine key={address} icon={Mail} label={label} value={address} href={`mailto:${address}`} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * The office, in the card language of the form above: an address card with
 * one orange action, Get directions, beside a street-level map in the same
 * rounded card (user, 2026-10-08, replacing the black band and its lorem).
 */
export function OfficeSection() {
  return (
    <section id="office" aria-labelledby="office-heading" className="scroll-mt-[96px] border-t border-black/10 bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 gap-[16px] py-[96px] md:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] max-md:py-[56px]`}>
        <div className={`${CARD} flex flex-col p-[40px] max-md:p-[24px]`}>
          <div className="flex items-center justify-between gap-4">
            <span aria-hidden="true" className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FDEFE2]">
              <MapPin size={20} strokeWidth={1.5} />
            </span>
            <span className={`${EYEBROW} text-black/55`}>Office</span>
          </div>
          <h2 id="office-heading" className="mt-[32px] font-serif text-[clamp(2rem,1.6rem+1vw,2.5rem)] leading-[1.05] font-normal tracking-[-.015em]">
            {OFFICE.name}
          </h2>
          <address className="mt-[12px] text-[16px] leading-[1.6] not-italic text-black/70">
            {OFFICE.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <div className="mt-auto pt-[36px]">
            <a
              href={DIRECTIONS_HREF}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center rounded-full bg-[#F6A11A] px-[26px] py-[13px] text-[15px] font-medium text-black no-underline transition-[color,background-color,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-black hover:text-white active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`}
            >
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
        </div>
        <div className={`${CARD} relative min-h-[360px] overflow-hidden md:min-h-[420px]`}>
          <iframe title="Map of Peninsula Business Park, Lower Parel, Mumbai" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
        </div>
      </div>
    </section>
  );
}

function EnquiryFromParams() {
  const initial = enquiryFromParam(useSearchParams().get("enquiry")) ?? "general";
  return <EnquiryTabs key={initial} initial={initial} />;
}

/**
 * The four topics as a segmented control over one form: a white pill slides
 * to the chosen topic. The typed values live here, not in the form, so
 * switching topic keeps the name, email and phone already typed. Arrow keys,
 * Home and End move between topics. Four in a row once the card is wide
 * enough (about 34rem), two by two below that.
 */
function EnquiryTabs({ initial }: { initial: Enquiry["id"] }) {
  const [activeId, setActiveId] = useState<Enquiry["id"]>(initial);
  const [values, setValues] = useState<Record<string, string>>({});
  const reduced = useReducedMotion();
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
    <div className="@container">
      <p id={`${base}-topic`} className="mb-[10px] text-[13px] font-medium text-black/70">
        What is it about?
      </p>
      <div
        role="tablist"
        aria-labelledby={`${base}-topic`}
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-[4px] rounded-[18px] bg-[#F1F1F2] p-[4px] @min-[34rem]:grid-cols-4 @min-[34rem]:rounded-full"
      >
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
              className={`relative min-h-[42px] cursor-pointer rounded-full border-0 bg-transparent px-[10px] text-[14px] leading-[1.2] font-medium transition-colors duration-200 ${selected ? "text-black" : "text-black/55 hover:text-black"} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black`}
            >
              {selected && (
                <motion.span
                  layoutId={`${base}-pill`}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_2px_8px_-2px_rgba(0,0,0,.08)]"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{enquiry.name}</span>
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

/**
 * Fields that sit two to a row once the card is wide enough; the rest take
 * the full width. With an odd number of them, the last one takes the full
 * width too, so no row is left half empty.
 */
const HALF = new Set(["name", "email", "phone", "amount", "city", "investor", "commitment", "client", "topic", "subject"]);

function pairedFields(fields: readonly EnquiryField[]) {
  const short = fields.filter((field) => HALF.has(field.name));
  const alone = short.length % 2 === 1 ? short[short.length - 1].name : null;
  return fields.map((field) => ({ field, half: HALF.has(field.name) && field.name !== alone }));
}

/** The form for one topic. Sending it opens the visitor's mail app with the fields filled in. */
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
      <div className="grid grid-cols-1 gap-x-[16px] gap-y-[18px] @min-[30rem]:grid-cols-2">
        {pairedFields(enquiry.fields).map(({ field, half }) => (
          <Field key={field.name} field={field} half={half} value={values[field.name] ?? ""} onChange={(value) => onChange(field.name, value)} />
        ))}
      </div>
      <button
        type="submit"
        className={`mt-[28px] inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-full border-0 bg-[#F6A11A] px-[28px] text-[15px] font-medium text-black transition-[color,background-color,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-black hover:text-white active:scale-[0.98] motion-reduce:transition-none ${FOCUS}`}
      >
        Send enquiry
      </button>
      <p className="mt-[14px] text-center text-[13px] leading-[1.5] text-black/55">
        Sending opens your email app with these details filled in, addressed to {EMAIL}. Fields marked * are required.
      </p>
    </form>
  );
}

/** The outlined control every field shares: hairline at rest, darker on hover, ink with a soft ring on focus. */
const CONTROL =
  "block w-full appearance-none rounded-[12px] border border-solid border-black/[.14] bg-white px-[14px] text-[16px] text-black outline-none transition-[border-color,box-shadow] duration-200 hover:border-black/30 focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,.07)] motion-reduce:transition-none";

function Field({ field, half, value, onChange }: { field: EnquiryField; half: boolean; value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div className={half ? "" : "@min-[30rem]:col-span-2"}>
      <label htmlFor={id} className="mb-[8px] block text-[13px] leading-[1.4] font-medium text-black/70">
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {field.options ? (
        <div className="relative">
          <select id={id} name={field.name} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${CONTROL} h-[48px] cursor-pointer pr-[42px] ${value ? "" : "text-black/45"}`}>
            <option value="">Choose one</option>
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={1.75} className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-black/55" />
        </div>
      ) : field.type === "textarea" ? (
        <textarea id={id} name={field.name} rows={4} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`${CONTROL} min-h-[128px] resize-y py-[12px]`} />
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
          className={`${CONTROL} h-[48px]`}
        />
      )}
    </div>
  );
}
