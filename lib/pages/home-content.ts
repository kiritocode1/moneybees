import { ENQUIRY_HREF } from "@/lib/contact-v2";
import { AIF_PRODUCT, FAQS, FOUNDER, HEADINGS, PMS_PRODUCT, WHY_MONEYBEE } from "@/lib/insights";

/*
 * What each Home section says, in the shape the Home page record in /admin
 * stores it. These are today's words: the first migration writes them, a
 * section added in /admin arrives filled with them, and the page falls back
 * to them without a database. Facts come from the decks (lib/insights.ts).
 * Words in braces are fact-sheet figures (lib/site/tokens.ts).
 */

/** A button or link. Either part empty hides it. */
export type Action = { label?: string | null; link?: string | null };

export type HeroContent = {
  heading: string;
  introduction?: string | null;
  primary?: Action;
  secondary?: Action;
  figures?: { figure: string; label: string }[] | null;
};

export type RecordContent = { eyebrow?: string | null; heading: string; lead?: string | null; more?: Action };

export type Way = { kind: "pms" | "aif"; label: string; name: string; lead?: string | null; facts?: { fact: string }[] | null; link: string };

export type TwoWaysContent = { heading: string; button: string; ways?: Way[] | null };

export type FounderContent = {
  label?: string | null;
  quote: string;
  name: string;
  credentials?: string | null;
};

/** A picture on the page: an uploaded file's address and its description. */
export type Picture = { url: string; alt: string };

export type GetStartedContent = { heading: string; linkLabel: string };

export type FaqContent = { label?: string | null; heading: string; questions?: { question: string; answer: string }[] | null };

export type TextContent = { label?: string | null; heading: string; body?: string | null; action?: Action };

export const HERO: HeroContent = {
  heading: WHY_MONEYBEE.heading,
  introduction: WHY_MONEYBEE.introduction,
  primary: { label: "Get Started", link: ENQUIRY_HREF },
  secondary: { label: "Our Philosophy", link: "/our-philosophy" },
  // The plan's key highlights that carry a figure, plus its small performance highlight.
  figures: [
    { figure: "45+", label: "Years of experience of the founder" },
    { figure: "Aug 2007", label: "PMS since" },
    { figure: "{sinceInception}", label: "A year since 2007, against {benchmarkSinceInception} for the S&P BSE 500 TRI" },
    { figure: "Small & mid", label: "The Indian companies we focus on" },
  ],
};

export const RECORD: RecordContent = {
  eyebrow: "Performance",
  heading: HEADINGS.record,
  // RECORD_LEAD (AIF presentation p12) with its figures as tokens, so it prints the same until a fact sheet replaces them.
  lead: "Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.",
  more: { label: "Performance", link: "/pms#performance" },
};

export const TWO_WAYS: TwoWaysContent = {
  heading: "Two ways to invest with us",
  button: "See the details",
  ways: [
    {
      kind: "pms",
      label: "Portfolio Management Service",
      name: PMS_PRODUCT.name,
      lead: "The stocks sit in your own demat account.",
      facts: [PMS_PRODUCT.points[1], PMS_PRODUCT.points[2], PMS_PRODUCT.points[5]].map((fact) => ({ fact })),
      link: "/pms",
    },
    {
      kind: "aif",
      label: "Category III AIF",
      name: AIF_PRODUCT.name,
      lead: AIF_PRODUCT.lead,
      facts: ["Rs. 1 crore minimum", "3 to 5 years", "At least 51% listed, up to 49% unlisted"].map((fact) => ({ fact })),
      link: "/aif",
    },
  ],
};

export const FOUNDER_WORDS: FounderContent = {
  label: "Why small caps",
  quote: FOUNDER.quote,
  name: FOUNDER.name,
  credentials: FOUNDER.role,
};

/** The founder's portrait until one is uploaded in /admin. */
export const FOUNDER_PHOTO: Picture = { url: "/people/dhiren-shah.jpg", alt: FOUNDER.name };

export const GET_STARTED: GetStartedContent = { heading: "Get Started", linkLabel: "Enquire" };

export const FAQ: FaqContent = {
  label: "FAQs",
  heading: "Questions we are often asked",
  questions: FAQS.map(([question, answer]) => ({ question, answer })),
};

export const TEXT: TextContent = { label: "", heading: "A heading for this section", body: "A paragraph or two. Leave an empty line between paragraphs.", action: {} };

/** The Home page as it stood before it was editable, top to bottom. */
export const HOME_SECTIONS = [
  { blockType: "hero", hidden: false, ...HERO },
  { blockType: "record", hidden: false, ...RECORD },
  { blockType: "twoWays", hidden: false, ...TWO_WAYS },
  { blockType: "founder", hidden: false, ...FOUNDER_WORDS },
  { blockType: "getStarted", hidden: false, ...GET_STARTED },
] as const;
