/**
 * What every screen in the admin sidebar is for, and how to use it well
 * (admin-ergonomics plan, screen intros, approved 2026-10-14). `line` opens
 * the screen under its title (components/admin/screen-intro.tsx); `steps`
 * are its entry in Guide › Every screen. `icon` names a lucide icon the intro
 * draws. Safe on the client.
 */

export type Screen = { name: string; group: "Desk" | "Website" | "Publishing" | "Settings"; href: string; icon: ScreenIcon; line: string; steps: string[] };

export type ScreenIcon =
  | "today"
  | "inbox"
  | "people"
  | "deals"
  | "pages"
  | "team"
  | "documents"
  | "cases"
  | "openings"
  | "office"
  | "factSheets"
  | "products"
  | "files"
  | "playbooks"
  | "templates"
  | "clients"
  | "staff"
  | "audit"
  | "settings";

export const SCREENS = {
  today: {
    name: "Today",
    group: "Desk",
    href: "/admin",
    icon: "today",
    line: "What needs you today: enquiries waiting on Moneybee, ones past their reply time, the ones you took, and fact sheets to approve.",
    steps: ["Start each morning here.", "Work Most urgent from the top; red means the reply time has passed.", "Any number above zero is work: click it for the list."],
  },
  enquiries: {
    name: "Enquiries",
    group: "Desk",
    href: "/admin/inbox",
    icon: "inbox",
    line: "Every message from the Contact page and every call or email staff log. Each one's reply time starts when it arrives.",
    steps: [
      "Take it, so everyone knows it is yours.",
      "Read its playbook: how fast, who should answer, the steps.",
      "Reply from a template; the reply stops the clock.",
      "Close it, or turn it into a deal, when nothing is left to do.",
    ],
  },
  people: {
    name: "People",
    group: "Desk",
    href: "/admin/collections/contacts",
    icon: "people",
    line: "One row per person who has enquired or invests, with every enquiry, email and deal of theirs.",
    steps: [
      "Search by name, email or phone before adding someone; the website adds people by itself.",
      "Open a person before replying, to see what they have already been told.",
      "Add the family, HUF, company or trust when the money is not the person's own.",
    ],
  },
  deals: {
    name: "Deals",
    group: "Desk",
    href: "/admin/collections/deals",
    icon: "deals",
    line: "Each prospective investment, from first contact to money in, and the stage it has reached.",
    steps: [
      "Start one from an enquiry once someone is serious: Turn into a deal.",
      "Move the stage as it happens: Contacted, Meeting, Documents sent, Onboarding, Invested, or Lost with the reason.",
      "Fill in the product and amount, so the totals add up.",
    ],
  },
  pages: {
    name: "Pages",
    group: "Website",
    href: "/admin/website",
    icon: "pages",
    line: "Every page of the site. Edit opens it beside the live page; nothing changes on the site until you publish.",
    steps: [
      "Press Edit on the page.",
      "Click the section you want to change on the page; its fields open.",
      "Type, check it on the right, then Publish changes. Picture by picture: Guide › What changes what.",
    ],
  },
  team: {
    name: "Team",
    group: "Website",
    href: "/admin/collections/team-members",
    icon: "team",
    line: "The people in the Our Team carousel on the About page, in this order.",
    steps: ["Add a person with their role and a portrait 3 wide by 4 tall.", "Drag rows to change the order.", "Leave LinkedIn empty until the address is confirmed. Save puts it live."],
  },
  documents: {
    name: "Documents",
    group: "Website",
    href: "/admin/collections/documents",
    icon: "documents",
    line: "The cards on the Investor Centre page. A card with a PDF or web address links to it; one without says Available on request.",
    steps: [
      "Open the card.",
      "Drop in the approved PDF, or the web address for SEBI's SCORES or ODR.",
      "Set the date it carries and Save; it is live straight away. Upload only what compliance has approved.",
    ],
  },
  caseStudies: {
    name: "Case studies",
    group: "Website",
    href: "/admin/collections/case-studies",
    icon: "cases",
    line: "The companies on the Case Studies page, one section each, with five years of figures.",
    steps: [
      "Write the three lines in plain words.",
      "Enter five years of revenue, EBITDA and PAT, oldest first; the charts redraw.",
      "Check with compliance before saving: a named stock reads as a recommendation.",
    ],
  },
  openings: {
    name: "Openings",
    group: "Website",
    href: "/admin/collections/openings",
    icon: "openings",
    line: "The roles on the Careers page. A Sample role is labelled as not a live vacancy; a Live one offers Apply.",
    steps: ["Add the role, its team, location and type.", "Set Kind to Live only for a real vacancy.", "Delete it, or set it back to Sample, once filled."],
  },
  officeDetails: {
    name: "Office details",
    group: "Website",
    href: "/admin/globals/site-details",
    icon: "office",
    line: "Phone, email, address and map pin, used by the footer of every page, the Contact page and Get started.",
    steps: ["Change it here once; every page follows.", "To move the pin, paste a Google Maps link to the office.", "Save puts it live."],
  },
  factSheets: {
    name: "Fact sheets",
    group: "Publishing",
    href: "/admin/collections/fact-sheets",
    icon: "factSheets",
    line: "Each month's returns from a fund's fact sheet. Once compliance approves, the graphs and returns on the site change.",
    steps: [
      "Create New, pick the fund and the month, drop in the PDF.",
      "Copy the numbers in; amber means a big move, check it against the PDF.",
      "Send to compliance; someone else approves it. Why monthly: Guide › Fact sheets, explained.",
    ],
  },
  products: {
    name: "Products",
    group: "Publishing",
    href: "/admin/collections/products",
    icon: "products",
    line: "The PMS strategy and the Flyingbee AIF. Fact sheets belong to a product, and its benchmark and its public returns switch live here.",
    steps: [
      "Change a benchmark only when the fund's documents do.",
      "Leave Show performance publicly off for the AIF until the benchmarking agency's report exists.",
      "Never change a code name once live.",
    ],
  },
  files: {
    name: "Files",
    group: "Publishing",
    href: "/admin/collections/media",
    icon: "files",
    line: "Every PDF and picture uploaded for the site: document PDFs, portraits, fact sheets.",
    steps: [
      "Upload from the place that uses the file; it lands here by itself.",
      "Use this list to find or replace a file. Every file here is public.",
      "Fill in Alt with what a picture shows, for screen readers.",
    ],
  },
  playbooks: {
    name: "Playbooks",
    group: "Settings",
    href: "/admin/collections/playbooks",
    icon: "playbooks",
    line: "What to do with each kind of enquiry: how fast to answer, who should take it, the steps, and the reply to start from.",
    steps: [
      "Write one for each kind and severity that needs its own approach.",
      "The first match from the top is the one shown, so order matters.",
      "Keep the steps short enough to follow on a call.",
    ],
  },
  emailTemplates: {
    name: "Email templates",
    group: "Settings",
    href: "/admin/collections/email-templates",
    icon: "templates",
    line: "The emails staff send from an enquiry and the automatic ones. Words in double braces, like {{firstName}}, fill in when it sends.",
    steps: [
      "Build it from the blocks on the left; the preview shows computer and phone.",
      "Send a test to yourself before using it.",
      "Never promise returns: SEBI's advertising rules apply to every email.",
    ],
  },
  clientAccounts: {
    name: "Client accounts",
    group: "Settings",
    href: "/admin/collections/investors",
    icon: "clients",
    line: "Investor logins to the client portal. Moneybee creates each account; a disabled one cannot sign in.",
    steps: [
      "Create the account with the client codes from the back office.",
      "Statements named with those codes reach this investor.",
      "Disable rather than delete when someone leaves.",
    ],
  },
  staff: {
    name: "Staff",
    group: "Settings",
    href: "/admin/collections/users",
    icon: "staff",
    line: "Everyone who signs in to this admin, and what each may do. Only an admin changes roles.",
    steps: [
      "Give each person only the roles their job needs.",
      "Whoever enters numbers should not also approve them; that is compliance's role.",
      "Remove people the day they leave.",
    ],
  },
  auditLog: {
    name: "Audit log",
    group: "Settings",
    href: "/admin/collections/audit-log",
    icon: "audit",
    line: "Every change made here: who, when, and what moved. Nobody can edit or delete it.",
    steps: ["Filter by screen or by person to find a change.", "Use it to answer who changed something, and when, for compliance or a correction."],
  },
  enquirySettings: {
    name: "Enquiry settings",
    group: "Settings",
    href: "/admin/globals/crm-settings",
    icon: "settings",
    line: "The reply times the enquiry desk runs on, the acknowledgement email, and the AI switches with their thresholds. A playbook's own reply time wins.",
    steps: [
      "Set reply times the team can keep.",
      "Leave the acknowledgement on, so visitors know their message arrived.",
      "Turn an AI feature on only once AI Gateway has credits; each switch says what it sends and to which model.",
    ],
  },
} as const satisfies Record<string, Screen>;

export type ScreenKey = keyof typeof SCREENS;

/** The Guide's address for a screen's entry. */
export const screenGuideHref = (key: ScreenKey) => `/admin/guide#screen-${key}`;

/** The `admin.components` entry that puts a screen's intro under its title (components/admin/screen-intro.tsx). */
export const screenIntro = (screen: ScreenKey) => ({ Description: { path: "/components/admin/screen-intro#ScreenIntro", clientProps: { screen } } });
