"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, type KeyboardEvent, Suspense, useId, useRef, useState } from "react";
import { COLUMN } from "@/components/hero/tokens";
import { ENQUIRIES, type Enquiry, type EnquiryField, enquiryFromParam, enquiryMailto } from "@/lib/contact-v2";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const UI_EASE = "cubic-bezier(.7,.6,0,1)";

/** The existing enquiry form behavior, placed below the contact hero. */
export function ContactEnquirySection() {
  return (
    <section id="enquiry" aria-label="Enquiry options" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[104px] max-md:py-[64px]`}>
        <div className="mx-auto max-w-[840px]">
          <Suspense fallback={<EnquiryTabs initial={ENQUIRIES[0].id} />}>
            <EnquiryFromParams />
          </Suspense>
        </div>
      </div>
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
    <div className="@container w-full">
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
              className={`relative min-h-[48px] cursor-pointer border-0 border-b border-solid border-b-black/15 bg-transparent px-[4px] pb-[14px] pt-[10px] text-[14px] leading-[1.25] font-medium @min-[27rem]:flex-none @min-[27rem]:border-b-0 @min-[27rem]:px-0 @min-[27rem]:whitespace-nowrap hover:text-black ${selected ? "text-black" : "text-[#767676]"} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black`}
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
      <p className="mt-[18px] text-[12px] text-[#767676]">
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
      <label htmlFor={id} className="block text-[13px] leading-[1.4] text-[#767676]">
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
