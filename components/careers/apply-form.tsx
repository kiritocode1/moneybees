"use client";

import { FileText, Mail, MapPin, Phone, UploadCloud, UserRound } from "lucide-react";
import { type DragEvent, type FormEvent, useEffect, useId, useRef, useState, useTransition } from "react";
import { Button } from "@/components/fluid/button";
import { InputField, InputGroup } from "@/components/fluid/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { type ApplyResult, readResume, sendApplication } from "@/lib/hiring/apply-actions";
import { NOTICE_PERIODS } from "@/lib/hiring/stages";

/*
 * The apply form, in the Client Login card (PortalFrame, size "form"):
 * resume, your details, the role, check and send (plan
 * .plannotator/hiring-cycle/plan.md). Nothing is stored until Send; the resume
 * travels with the application. Without private file storage the resume step
 * is skipped and the role step asks for experience instead.
 */

export type ApplyRole = { id: string; title: string; team: string; location: string; employment: string; mustHaves: readonly string[] };

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const LINK = `cursor-pointer border-0 bg-transparent p-0 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground ${FOCUS}`;

type Details = { name: string; email: string; phone: string; city: string; linkedin: string };
const EMPTY: Details = { name: "", email: "", phone: "", city: "", linkedin: "" };

const kb = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function ApplyForm({
  role,
  teams,
  resumes,
  readsResume,
  keepMonths,
  fallbackEmail,
}: {
  /** The opening, or null for an open application. */
  role: ApplyRole | null;
  teams: readonly { value: string; label: string }[];
  /** False when the deployment has nowhere private to keep a resume. */
  resumes: boolean;
  /** "Read uploaded resumes" is on in Desk settings. */
  readsResume: boolean;
  /** Desk settings › Hiring: how long the application is kept, which the applicant agrees to. */
  keepMonths: number;
  /** Where a deployment without a database sends applications instead. */
  fallbackEmail: string;
}) {
  const first = resumes ? 1 : 2;
  const [step, setStep] = useState(first);
  const [file, setFile] = useState<File | null>(null);
  const [filled, setFilled] = useState(false);
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [details, setDetails] = useState(EMPTY);
  const [team, setTeam] = useState("");
  const [answers, setAnswers] = useState<("yes" | "no" | "")[]>(() => (role?.mustHaves ?? []).map(() => ""));
  const [notice, setNotice] = useState("");
  const [why, setWhy] = useState("");
  const [experience, setExperience] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<ApplyResult, { ok: true }> | null>(null);
  const [pending, startTransition] = useTransition();
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, result]);

  const STEPS = [
    ...(resumes ? [{ n: 1, label: "Resume" }] : []),
    { n: 2, label: "Your details" },
    { n: 3, label: role ? "The role" : "The team" },
    { n: 4, label: "Check and send" },
  ];

  const choose = async (picked: File | null | undefined) => {
    setError(null);
    setFilled(false);
    if (!picked) return;
    // The same check the server makes: a PDF or Word file by its first bytes, whatever its name.
    const head = new Uint8Array(await picked.slice(0, 4).arrayBuffer());
    const signature = Array.from(head, (byte) => byte.toString(16).padStart(2, "0")).join("");
    if (!["25504446", "504b0304", "d0cf11e0"].includes(signature)) return setError("Upload your resume as a PDF or Word file.");
    if (picked.size > MAX_BYTES) return setError("That file is over 4 MB. Save a smaller PDF and try again.");
    setFile(picked);
    if (!readsResume || signature !== "25504446") return;
    setReading(true);
    const form = new FormData();
    form.set("resume", picked);
    readResume(form)
      .then((read) => {
        if (!read.ok) return;
        const found = Object.fromEntries(Object.entries(read.fields).filter(([, value]) => typeof value === "string" && value.trim())) as Partial<Details>;
        setDetails((current) => ({ ...current, ...Object.fromEntries(Object.entries(found).filter(([key]) => !current[key as keyof Details])) }));
        setFilled(Object.keys(found).length > 0);
      })
      .finally(() => setReading(false));
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void choose(event.dataTransfer.files[0]);
  };

  /** What is missing on a step, in the words the field uses, or null when it is complete. */
  const missing = (n: number): string | null => {
    if (n === 2) {
      if (!details.name.trim()) return "Fill in your full name.";
      if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) return "Fill in your email address.";
      if (!details.phone.trim()) return "Fill in your phone number.";
      if (!details.city.trim()) return "Fill in the city you live in.";
    }
    if (n === 3) {
      if (!role && !team) return "Choose the team you would like to work in.";
      if (answers.some((answer) => !answer)) return "Answer yes or no to each one.";
      if (!notice) return "Choose your notice period.";
      if (!why.trim()) return "Say in a few lines why this role.";
      if (!file && !experience.trim()) return "Tell us about your experience, since there is no resume.";
    }
    return null;
  };

  const next = () => {
    const problem = missing(step);
    if (problem) return setError(problem);
    setError(null);
    setStep(step + 1);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step < 4) return next();
    if (!consent) return setError("Tick the box to let Moneybee keep your application.");
    const form = new FormData();
    form.set("role", role?.id ?? "");
    form.set("team", team);
    for (const [key, value] of Object.entries(details)) form.set(key, value);
    for (const answer of answers) form.append("must", answer);
    form.set("notice", notice);
    form.set("why", why);
    form.set("experience", experience);
    form.set("consent", "yes");
    form.set("page", `${window.location.pathname}${window.location.search}`);
    form.set("website", honeypot.current?.value ?? "");
    if (file) form.set("resume", file);
    setError(null);
    startTransition(async () => {
      const sent = await sendApplication(form);
      if (!sent.ok && sent.mailto) {
        window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(`Application: ${role?.title ?? "Open application"}`)}`;
      } else if (!sent.ok) setError(sent.error);
      else setResult(sent);
    });
  };

  if (result) {
    return (
      <div>
        <p className={`${EYEBROW} mb-[20px] text-black/55`}>Careers at Moneybee</p>
        <h1 ref={heading} tabIndex={-1} className={`${SUBHEAD} outline-none`}>
          Application sent
        </h1>
        <p className="mt-6 text-[13px] text-muted-foreground">Your reference</p>
        <p role="status" className="mt-1 font-[family-name:var(--font-geist-mono)] text-[15px] font-medium tabular-nums">
          {result.reference}
        </p>
        <p className="mt-5 text-[15px] leading-[1.6] text-foreground">
          Your application for {role?.title ?? "an open role"} is with the team. If we would like to talk, we will write to {result.email}.
          {result.acknowledged ? " A copy of your reference is on its way there." : ""}
        </p>
        <Button asChild className="mt-8 w-full">
          <Link href="/careers#openings" className="no-underline">
            Back to all roles
          </Link>
        </Button>
      </div>
    );
  }

  const stepLabel = STEPS.find(({ n }) => n === step)?.label ?? "";

  return (
    <form onSubmit={onSubmit} onInput={() => error && setError(null)} noValidate>
      <p className={`${EYEBROW} mb-[20px] text-black/55`}>{role ? `Apply · ${role.team}` : "Careers at Moneybee"}</p>
      <h1 className={SUBHEAD}>{role?.title ?? "Send your resume"}</h1>
      {role ? (
        <p className="mt-[10px] text-[15px] text-muted-foreground">
          {role.location} · {role.employment}
        </p>
      ) : null}

      <ol className="mt-8 mb-7 flex list-none gap-1.5 p-0" aria-label="Steps">
        {STEPS.map(({ n, label }, index) => (
          <li key={n} aria-current={n === step ? "step" : undefined} className={`flex-1 border-t-2 pt-2.5 text-[13px] ${n < step ? "border-[#171717] text-foreground" : n === step ? "border-[#F6A11A] font-medium text-foreground" : "border-black/10 text-muted-foreground"}`}>
            <span className={`block ${EYEBROW} text-[11px]`}>{String(index + 1).padStart(2, "0")}</span>
            <span className="max-sm:sr-only">{label}</span>
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1} className="sr-only">
        {stepLabel}
      </h2>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {step === 1 ? (
        <div>
          <p className="mb-2 text-[13px] font-medium">Your resume</p>
          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3.5">
              <FileText size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px]">{file.name}</span>
                <span className="block text-[13px] text-muted-foreground">{reading ? "Reading it…" : kb(file.size)}</span>
              </span>
              <button type="button" className={LINK} onClick={() => (setFile(null), setFilled(false))}>
                Remove
              </button>
            </div>
          ) : (
            <label
              onDragOver={(event) => (event.preventDefault(), setDragging(true))}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`block cursor-pointer rounded-[14px] border-[1.5px] border-dashed px-6 py-9 text-center text-[15px] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black ${dragging ? "border-black bg-black/[.03]" : "border-black/25 bg-[#FBFBFB] hover:border-black/40"}`}
            >
              <UploadCloud size={28} strokeWidth={1.5} aria-hidden="true" className="mx-auto mb-3" />
              Drop your resume here, or <span className="font-medium underline underline-offset-4">choose a file</span>
              <span className="mt-1.5 block text-[13px] text-muted-foreground">PDF or Word, up to 4 MB.</span>
              <input ref={fileInput} type="file" accept={ACCEPT} className="sr-only" onChange={(event) => void choose(event.target.files?.[0])} />
            </label>
          )}
          {readsResume && !file ? <p className="mt-2 text-[13px] text-muted-foreground">We read a PDF to fill in your details on the next step.</p> : null}
          {filled ? <p className="mt-2 text-[13px] text-muted-foreground">Your details are filled in on the next step. Check them before you send.</p> : null}
          {!file ? (
            <button type="button" className={`${LINK} mt-4`} onClick={() => (setError(null), setStep(2))}>
              Continue without a resume
            </button>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <InputGroup className="w-full">
          <InputField index={0} label="Full name" name="name" icon={UserRound} value={details.name} onChange={(name) => setDetails({ ...details, name })} autoComplete="name" required />
          <InputField index={1} label="Email" name="email" type="email" icon={Mail} value={details.email} onChange={(email) => setDetails({ ...details, email })} autoComplete="email" required />
          <InputField index={2} label="Phone" name="phone" type="tel" icon={Phone} value={details.phone} onChange={(phone) => setDetails({ ...details, phone })} autoComplete="tel" required />
          <InputField index={3} label="City you live in" name="city" icon={MapPin} value={details.city} onChange={(city) => setDetails({ ...details, city })} autoComplete="address-level2" required />
          <InputField index={4} label="LinkedIn profile (optional)" name="linkedin" placeholder="linkedin.com/in/your-name" value={details.linkedin} onChange={(linkedin) => setDetails({ ...details, linkedin })} autoComplete="url" />
        </InputGroup>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-6">
          {role ? null : <Choice label="Which team?" placeholder="Choose a team" options={teams} value={team} onChange={setTeam} />}
          {role?.mustHaves.length ? (
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 text-[13px] font-medium">Which of these do you have?</legend>
              <div className="border-t border-black/10">
                {role.mustHaves.map((question, index) => (
                  <YesNo key={question} question={question} value={answers[index]} onChange={(answer) => setAnswers(answers.map((current, at) => (at === index ? answer : current)))} />
                ))}
              </div>
            </fieldset>
          ) : null}
          <Choice label="Notice period" placeholder="Choose one" options={NOTICE_PERIODS} value={notice} onChange={setNotice} />
          <LongText label="Why this role?" hint="A few lines is enough." value={why} onChange={setWhy} maxLength={2000} />
          {file ? null : <LongText label="Your experience" hint="Where you have worked, what you did there, and what you studied." value={experience} onChange={setExperience} maxLength={4000} />}
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <dl className="m-0 border-t border-black/10 text-[14px]">
            {resumes ? <Summary label="Resume" onChange={() => setStep(1)}>{file?.name ?? "None"}</Summary> : null}
            <Summary label="You" onChange={() => setStep(2)}>
              {details.name}
              <br />
              {details.email}
              <br />
              {details.phone} · {details.city}
            </Summary>
            <Summary label={role ? "The role" : "The team"} onChange={() => setStep(3)}>
              {role ? null : (
                <>
                  {teams.find(({ value }) => value === team)?.label}
                  <br />
                </>
              )}
              {answers.length ? (
                <>
                  Has {answers.filter((answer) => answer === "yes").length} of the {answers.length} asked for
                  <br />
                </>
              ) : null}
              Notice: {NOTICE_PERIODS.find(({ value }) => value === notice)?.label}
            </Summary>
            <Summary label="Why this role" onChange={() => setStep(3)}>
              <span className="whitespace-pre-wrap">{why}</span>
            </Summary>
          </dl>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5]">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-[3px] h-4 w-4 shrink-0 accent-[#171717]" />
            <span>
              Moneybee may keep my application for {keepMonths} months to consider me for this and similar roles. I can ask for it to be deleted by writing to {fallbackEmail}.
            </span>
          </label>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-5 text-[14px] leading-[1.5] text-[#B42318]">
          {error}
        </p>
      ) : null}

      {step !== 1 || file ? (
        <Button type="submit" loading={pending || reading} className="mt-7 w-full">
          {step === 4 ? "Send application" : "Continue"}
        </Button>
      ) : null}
      {step > first ? (
        <button type="button" className={`${LINK} mt-5 block`} onClick={() => (setError(null), setStep(step - 1))}>
          Back
        </button>
      ) : null}
    </form>
  );
}

function Choice({ label, placeholder, options, value, onChange }: { label: string; placeholder: string; options: readonly { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <span id={id} className="text-[13px] font-medium">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger placeholder={placeholder} aria-labelledby={id} />
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={option.value} index={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** A multi-line answer, labelled like the form's other questions. */
function LongText({ label, hint, value, onChange, maxLength }: { label: string; hint: string; value: string; onChange: (value: string) => void; maxLength: number }) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        aria-describedby={`${id}-hint`}
        className="min-h-28 w-full resize-y rounded-lg border border-black/10 bg-transparent px-3 py-2.5 font-[inherit] text-[15px] leading-[1.5] text-foreground outline-none transition-[border-color,box-shadow] duration-100 hover:border-black/30 focus-visible:border-black/50 focus-visible:ring-2 focus-visible:ring-black/10"
      />
      <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

/** One must-have as a yes or no question: two radio buttons in a pill, as in the approved preview. */
function YesNo({ question, value, onChange }: { question: string; value: "yes" | "no" | ""; onChange: (value: "yes" | "no") => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/10 py-3 max-sm:flex-col max-sm:items-start max-sm:gap-2">
      <span id={id} className="text-[15px]">
        {question}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="inline-flex shrink-0 rounded-full border border-black/20 p-[2px]">
        {(["yes", "no"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            onClick={() => onChange(option)}
            className={`cursor-pointer rounded-full border-0 px-3.5 py-[5px] text-[13px] ${FOCUS} ${value === option ? "bg-[#171717] text-white" : "bg-transparent text-foreground hover:bg-black/[.05]"}`}
          >
            {option === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({ label, onChange, children }: { label: string; onChange: () => void; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)_auto] gap-3 border-b border-black/10 py-3 max-sm:grid-cols-[minmax(0,1fr)_auto]">
      <dt className="text-muted-foreground max-sm:col-span-2">{label}</dt>
      <dd className="m-0">{children}</dd>
      <button type="button" className={LINK} onClick={onChange}>
        Change
      </button>
    </div>
  );
}
