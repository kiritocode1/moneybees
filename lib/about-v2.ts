/**
 * Copy for /about, from the Content & Visual Plan §2 "About Us". Headings,
 * company information, the founder's details and the Moneybee story line are
 * the plan's wording. The page's photographs, people and timeline are in
 * lib/about-v3.ts.
 */

export const ABOUT = {
  heading: "About Moneybee Group",
  company: [
    "Moneybee Group was started in 2004 by Mr. Dhiren Shah. The Group operates across areas including portfolio management, equity broking, investment advisory and related financial services.",
    "Moneybee focuses on understanding businesses deeply and identifying opportunities that may be overlooked by the wider market.",
  ],
} as const;

export const FOUNDER = {
  /** The plan writes "Mr. Dhiren Shah"; as a name label the title is dropped. It stays inside the plan's verbatim sentences. */
  name: "Dhiren Shah",
  role: "Managing Director",
  qualifications: ["FCA", "Grad CWA", "LLB", "M.Com."],
  points: [
    "45+ years of experience in corporate advisory and wealth management.",
    "Started Moneybee Group in 2004.",
    "Experience in turnaround and growth advisory for small and medium-sized businesses.",
    "Deep understanding of multiple industries and market cycles.",
    "Experience as an advisor and investor in businesses.",
  ],
  photo: "/people/dhiren-shah.jpg",
} as const;

export const STORY = {
  heading: "Moneybee Story",
  line: "While bees convert nectar into honey, Moneybee focuses on transforming money into wealth.",
} as const;
