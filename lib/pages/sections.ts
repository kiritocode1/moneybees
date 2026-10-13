/**
 * The sections staff can place on an editable page, by the name they see in
 * /admin and the picture shown when choosing one. Safe on the client: the
 * admin row labels and the preview's edit bar read it too.
 */
export const SECTION_KINDS = {
  hero: { name: "Top of the page", picture: "/site-sections/hero.png" },
  record: { name: "Performance", picture: "/site-sections/record.png" },
  twoWays: { name: "Two ways to invest", picture: "/site-sections/two-ways.png" },
  founder: { name: "Founder's words", picture: "/site-sections/founder.png" },
  getStarted: { name: "Get started", picture: "/site-sections/get-started.png" },
  faq: { name: "Questions and answers", picture: "/site-sections/faq.png" },
  text: { name: "Heading and paragraph", picture: "/site-sections/text.png" },
  // Internal pages (rollout plan, 2026-10-12): the hero they open on, then /pms's sections.
  productHero: { name: "Page top", picture: "/site-sections/product-hero.png" },
  pmsPerformance: { name: "Returns chart and table", picture: "/site-sections/pms-performance.png" },
  wealthGrowth: { name: "Growth of Rs. 1 Mn", picture: "/site-sections/wealth-growth.png" },
  whyPms: { name: "Why points with drawings", picture: "/site-sections/why-pms.png" },
  philosophy: { name: "Three words and points", picture: "/site-sections/philosophy.png" },
  selection: { name: "Four selection steps", picture: "/site-sections/selection.png" },
  portfolioApproach: { name: "Portfolio rules", picture: "/site-sections/portfolio-approach.png" },
  risks: { name: "Four risks", picture: "/site-sections/risks.png" },
  closingDoors: { name: "Closing cards", picture: "/site-sections/closing-doors.png" },
  // /about.
  aboutHero: { name: "Heading, text and team photograph", picture: "/site-sections/about-hero.png" },
  founderProfile: { name: "Founder profile", picture: "/site-sections/founder-profile.png" },
  teamCarousel: { name: "Team carousel", picture: "/site-sections/team-carousel.png" },
  groupAreas: { name: "Four group areas", picture: "/site-sections/group-areas.png" },
  recognition: { name: "Rankings", picture: "/site-sections/recognition.png" },
  timeline: { name: "Timeline", picture: "/site-sections/timeline.png" },
  story: { name: "Story with drawings", picture: "/site-sections/story.png" },
  // /investor-centre and /contact.
  logins: { name: "Logins", picture: "/site-sections/logins.png" },
  documentCards: { name: "Documents", picture: "/site-sections/document-cards.png" },
  enquiry: { name: "Enquiry form", picture: "/site-sections/enquiry.png" },
  office: { name: "Office and map", picture: "/site-sections/office.png" },
  // /our-philosophy.
  coreDiscs: { name: "Three discs", picture: "/site-sections/core-discs.png" },
  principles: { name: "Six principles round the tholos", picture: "/site-sections/principles.png" },
  criteria: { name: "Two lists", picture: "/site-sections/criteria.png" },
  riskRings: { name: "Risk rings", picture: "/site-sections/risk-rings.png" },
  // /pms-vs-aif.
  comparison: { name: "PMS and AIF side by side", picture: "/site-sections/comparison.png" },
  explanation: { name: "PMS and AIF cards", picture: "/site-sections/explanation.png" },
  // /aif.
  aifPerformance: { name: "Flyingbee returns", picture: "/site-sections/aif-performance.png" },
  opportunity: { name: "Three steps up the block", picture: "/site-sections/opportunity.png" },
  pooling: { name: "Pooled fund explained", picture: "/site-sections/pooling.png" },
  structure: { name: "Fund structure", picture: "/site-sections/structure.png" },
  approachWheel: { name: "Approach wheel", picture: "/site-sections/approach-wheel.png" },
  keyTerms: { name: "Key terms", picture: "/site-sections/key-terms.png" },
  // /case-studies and /multi-bagger-picks.
  caseStudies: { name: "Case studies", picture: "/site-sections/case-studies.png" },
  caseTimeline: { name: "Profit timeline", picture: "/site-sections/case-timeline.png" },
  picks: { name: "Picks pyramid", picture: "/site-sections/picks.png" },
  // /careers.
  careersIntro: { name: "Careers heading", picture: "/site-sections/careers-intro.png" },
  jobBoard: { name: "Job board", picture: "/site-sections/job-board.png" },
  careersOffice: { name: "Office photograph and text", picture: "/site-sections/careers-office.png" },
  careersResume: { name: "Send your resume", picture: "/site-sections/careers-resume.png" },
} as const satisfies Record<string, { name: string; picture: string }>;

export type SectionKind = keyof typeof SECTION_KINDS;

export const isSectionKind = (value: unknown): value is SectionKind => typeof value === "string" && value in SECTION_KINDS;

/** What the preview's edit bar asks the admin form to do with section `index`. */
export type PreviewCommand = { source: "mb-preview"; action: "edit" | "up" | "down" | "toggle"; index: number };

export const isPreviewCommand = (value: unknown): value is PreviewCommand =>
  typeof value === "object" &&
  value !== null &&
  (value as PreviewCommand).source === "mb-preview" &&
  ["edit", "up", "down", "toggle"].includes((value as PreviewCommand).action) &&
  Number.isInteger((value as PreviewCommand).index);
