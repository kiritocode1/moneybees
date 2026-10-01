"use client";

import { useInView } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, type KeyboardEvent, Suspense, useId, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import {
  ENQUIRIES,
  type Enquiry,
  type EnquiryField,
  enquiryFromParam,
  enquiryMailto,
  MAP_EMBED,
  MAP_LINK,
  OFFICE,
} from "@/lib/contact-v2";

/*
 * /contact below its hero, content plan §11: the four enquiry options as tabs
 * over an underline-only form, then the office on a map. The form has no
 * backend: sending it opens a mailto to info@moneybee.in with the filled
 * fields. `?enquiry=pms` (or aif, support, general) preselects a tab, so
 * product pages can link here.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
/** Realevate's UI-state curve, used for the tab underline, tab colour and field borders. */
const UI_EASE = "cubic-bezier(.7,.6,0,1)";

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/** The plan's four enquiry options as tabs over one form, the section under the contact hero (lib/page-heroes.ts carries the address, phone and email). */
export function EnquirySection() {
  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 gap-10 py-[120px] md:grid-cols-12 md:gap-x-6 max-md:py-[80px]`}>
        <div className="md:col-span-4">
          <BracketLabel>Get Started</BracketLabel>
          <h2 id="enquiry-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Enquiry Options
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Suspense fallback={<EnquiryTabs initial={ENQUIRIES[0].id} />}>
            <EnquiryFromParams />
          </Suspense>
        </div>
      </div>
    </section>
  );
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
    <div className="@container lg:max-w-[540px]">
      {/* Two by two until the column fits all four labels at their own widths (about 420px), then one row on a shared rule. */}
      <div role="tablist" aria-label="Enquiry options" onKeyDown={onKeyDown} className="grid grid-cols-2 @min-[27rem]:flex @min-[27rem]:justify-between @min-[27rem]:gap-x-5 @min-[27rem]:border-b @min-[27rem]:border-solid @min-[27rem]:border-black/15">
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
              className={`relative min-h-[48px] cursor-pointer border-0 border-b border-solid border-b-black/15 bg-transparent px-[4px] pb-[14px] pt-[10px] text-[14px] leading-[1.25] font-medium @min-[27rem]:flex-none @min-[27rem]:border-b-0 @min-[27rem]:px-0 @min-[27rem]:whitespace-nowrap hover:text-black ${selected ? "text-black" : "text-black/55"} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black`}
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
