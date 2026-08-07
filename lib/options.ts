export type Option = {
  /** Display number, 1-indexed. */
  n: number;
  /** Route segment under app/. */
  slug: string;
  /** Working name for the direction. */
  label: string;
  /** One line on what this direction is trying. Fill in as each takes shape. */
  note: string;
};

/**
 * The directions on offer. Each has its own route tree and is designed
 * independently — copy, structure, palette, and type may all diverge.
 * Adding a fifth is one entry here plus its app/<slug>/ folder.
 */
export const OPTIONS: Option[] = [
  {
    n: 1,
    slug: "option-1",
    label: "Option 1",
    note: "A deep-blue direction on the selected reference, carrying the pure-play PMS and AIF narrative.",
  },
  {
    n: 2,
    slug: "option-2",
    label: "Option 2",
    note: "An alpine editorial direction with olive accents, modular investment stories, and restrained GSAP motion.",
  },
  {
    n: 3,
    slug: "option-3",
    label: "Option 3",
    note: "A bright, editorial direction on the third reference: Inter Tight at scale, pastel section colour, and Webflow-faithful motion.",
  },
  {
    n: 4,
    slug: "option-4",
    label: "Option 4",
    note: "",
  },
];

export function getOption(slug: string): Option | undefined {
  return OPTIONS.find((option) => option.slug === slug);
}

/** Zero-padded numeral used in the chooser and switcher. */
export function optionNumeral(n: number): string {
  return String(n).padStart(2, "0");
}
