/**
 * What every screen in the admin sidebar is for, and how to use it well
 * (admin-ergonomics plan, screen intros, approved 2026-10-14). `line` opens
 * the screen under its title (components/admin/screen-intro.tsx). The rest is
 * the screen's entry in Guide › Every screen (guide-legible plan, approved
 * 2026-10-14): `example` walks one real situation through the screen (user,
 * 2026-10-14: give the easy examples in each screen's how to use), and each of
 * `controls` is ringed and numbered on the screen's picture, which
 * scripts/guide-shots.mjs takes from the running admin by finding `at`.
 * `icon` names a lucide icon the intro draws. Safe on the client.
 */

/**
 * A control numbered on a screen's picture. `at` finds it on the screen:
 * `text:` and its exact words, `has:` and words it contains, `label:` and its
 * accessible name, or `css:` and a selector. ` ^ <selector>` after it rings
 * the nearest enclosing match instead, such as a whole field.
 */
export type Control = { at: string; label: string; text: string };

export type Screen = { name: string; group: Group; href: string; icon: ScreenIcon; line: string; example: string; controls: readonly Control[] };

export type Group = "Desk" | "Website" | "Publishing" | "Settings";

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
    example: "You open the admin at 9:30. Past their reply time says 3, so you click it and answer those three before anything else. Fact sheets to approve says 1: if you are compliance, that is a month waiting for your check.",
    controls: [
      { at: "has:Enquiries waiting on us", label: "The counts", text: "Each card counts work in one state. Anything above zero needs someone; click a card for its list." },
      { at: "has:Past their reply time", label: "Past their reply time", text: "Enquiries whose reply time has run out. Clear these before anything else." },
      { at: "css:a.grid", label: "Most urgent", text: "The enquiries to answer next, most urgent first. Red means the reply time has passed. Click one to open it." },
      { at: "text:All enquiries", label: "All enquiries", text: "Opens the full list on Enquiries." },
    ],
  },
  enquiries: {
    name: "Enquiries",
    group: "Desk",
    href: "/admin/inbox",
    icon: "inbox",
    line: "Every message from the Contact page and every call or email staff log. Each one's reply time starts when it arrives.",
    example: "Rohan Mehta fills in the Contact form about putting more than ₹5 crore into the PMS. He arrives as Critical, with a reply due in two hours. You take it, read the Large PMS investor playbook, send the PMS first reply template, and once a meeting is set, turn it into a deal.",
    controls: [
      { at: "has:Waiting on us", label: "Waiting on us", text: "Enquiries where Moneybee owes the next reply. Start here." },
      { at: "text:Mine", label: "Mine", text: "Only the ones you took. Take an enquiry so everyone knows it is yours." },
      { at: "text:Waiting on them", label: "Waiting on them", text: "You replied and the person has not answered yet." },
      { at: "text:Reply by", label: "Reply by", text: "When the reply is due. Replying from a template stops the clock." },
      { at: "css:tbody tr", label: "An enquiry", text: "Click it to open: read its playbook for how fast and who should answer, reply from a template, then close it or turn it into a deal." },
    ],
  },
  people: {
    name: "People",
    group: "Desk",
    href: "/admin/collections/contacts",
    icon: "people",
    line: "One row per person who has enquired or invests, with every enquiry, email and deal of theirs.",
    example: "Kavita Shah rings the office instead of writing in. Search for her first: if she enquired on the site last year, she is already here with everything she was told. If not, Create New. If the money is her family's HUF, add the HUF inside her record.",
    controls: [
      { at: "css:.search-filter__input", label: "Search", text: "Search by name, email or phone before adding anyone. The website adds people by itself when they enquire." },
      { at: "text:Create New", label: "Create New", text: "For someone who called or came in. When the money is a family's, HUF's, company's or trust's, add that inside the person." },
      { at: "css:tbody tr a", label: "A person", text: "Open them before replying, to see every enquiry, email and deal they have had." },
    ],
  },
  deals: {
    name: "Deals",
    group: "Desk",
    href: "/admin/collections/deals",
    icon: "deals",
    line: "Each prospective investment, from first contact to money in, and the stage it has reached.",
    example: "Arjun Desai has met the team and wants to put ₹1.5 crore into the AIF. Turn his enquiry into a deal, set the product to Flyingbee and the amount to ₹1.5 crore. Move it to Documents sent when the forms go out, and to Invested when the money lands.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Starts a deal by hand. Usually you start one from an enquiry with Turn into a deal, once someone is serious." },
      { at: "text:Filters", label: "Filters", text: "Filter by stage to see who is at Meeting or Documents sent." },
      { at: "css:.search-filter__input", label: "Search", text: "Find a deal by its title. Inside a deal, move the stage as it happens and fill in the product and amount, so the totals add up." },
    ],
  },
  pages: {
    name: "Pages",
    group: "Website",
    href: "/admin/website",
    icon: "pages",
    line: "Every page of the site. Edit opens it beside the live page; nothing changes on the site until you publish.",
    example: "The client wants a different line under the Home page headline. Press Edit on the Home page, click that line on the right, change the words on the left, read it on the right, then Publish changes.",
    controls: [
      { at: "text:Edit Home page", label: "Edit", text: "Opens the page with the live page beside it. Click a section on the right and its fields open on the left. Nothing changes on the site until you press Publish changes." },
      { at: "text:View Home page on the site", label: "View", text: "Opens the published page in a new tab, as visitors see it." },
    ],
  },
  team: {
    name: "Team",
    group: "Website",
    href: "/admin/collections/team-members",
    icon: "team",
    line: "The people in the Our Team carousel on the About page, in this order.",
    example: "A new analyst joins. Create New, fill in their name and role, add an upright portrait (3 wide by 4 tall), then drag their row to where they should sit in the carousel. Save, and they are on the About page.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a person to the carousel. Give their role and a portrait 3 wide by 4 tall." },
      { at: "css:tbody tr td:first-child", label: "Drag handle", text: "Drag a row by it to change the order on the About page." },
      { at: "css:tbody tr a", label: "A person", text: "Open them to change their words or portrait. Leave LinkedIn empty until the address is confirmed. Save puts it live." },
    ],
  },
  documents: {
    name: "Documents",
    group: "Website",
    href: "/admin/collections/documents",
    icon: "documents",
    line: "The cards on the Investor Centre page. A card with a PDF or web address links to it; one without says Available on request.",
    example: "Compliance approves the new PMS Disclosure Document. Open its card, drop the PDF into File, set Dated to the date on its cover, and Save. On the Investor Centre the card now opens the PDF instead of saying Available on request.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a card. Pick its group: the four groups are fixed, because the menu and footer link to them." },
      { at: "css:tbody tr td:first-child", label: "Drag handle", text: "The order here is the order on the page, within each group." },
      { at: "has:No file ^ .fluid > *", label: "File", text: "No file means the card says Available on request. Open the card, drop in the approved PDF, set its date and Save: it is live straight away." },
    ],
  },
  caseStudies: {
    name: "Case studies",
    group: "Website",
    href: "/admin/collections/case-studies",
    icon: "cases",
    line: "The companies on the Case Studies page, one section each, with five years of figures.",
    example: "Pitti Engineering's new yearly results are out. Open Pitti Engineering, update the five years of revenue, EBITDA and PAT so the newest year is last, and watch the charts redraw. Show compliance before you Save.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a company. Write its three lines in plain words." },
      { at: "css:tbody tr td:first-child", label: "Drag handle", text: "Drag to change the order of the sections on the page." },
      { at: "css:tbody tr a", label: "A company", text: "Open it to enter five years of revenue, EBITDA and PAT, oldest first; the charts redraw. Check with compliance before saving: a named stock reads as a recommendation." },
    ],
  },
  openings: {
    name: "Openings",
    group: "Website",
    href: "/admin/collections/openings",
    icon: "openings",
    line: "The roles on the Careers page. A Sample role is labelled as not a live vacancy; a Live one offers Apply.",
    example: "Moneybee is really hiring an Equity Research Analyst. Open that role, check the team, location and type, and set Kind to Live: the Careers page now shows Apply. Once the seat is filled, set it back to Sample or delete it.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a role with its team, location and type." },
      { at: "text:Kind", label: "Kind", text: "Live offers Apply. Sample is labelled as not a live vacancy. Set Live only for a real vacancy, and set it back to Sample, or delete it, once filled." },
      { at: "css:tbody tr td:first-child", label: "Drag handle", text: "Drag to change the order on the Careers page." },
    ],
  },
  officeDetails: {
    name: "Office details",
    group: "Website",
    href: "/admin/globals/site-details",
    icon: "office",
    line: "Phone, email, address and map pin, used by the footer of every page, the Contact page and Get started.",
    example: "The office moves floors. Change the address under Office, paste the Google Maps link of the new entrance to move the pin, and Save. The footer on every page, the Contact page and Get started all change at once.",
    controls: [
      { at: "text:Office", label: "Office", text: "The address and the map pin. To move the pin, paste a Google Maps link to the office." },
      { at: "text:Phone and email", label: "Phone and email", text: "Used by Get started, the Contact page and the footer." },
      { at: "text:Registrations and disclaimer", label: "Registrations and disclaimer", text: "SEBI registration numbers and the footer disclaimer. Change these only with compliance." },
      { at: "text:Save", label: "Save", text: "Puts the change live on every page at once." },
    ],
  },
  factSheets: {
    name: "Fact sheets",
    group: "Publishing",
    href: "/admin/collections/fact-sheets",
    icon: "factSheets",
    line: "Each month's returns from a fund's fact sheet. Once compliance approves, the graphs and returns on the site change.",
    example: "The August fact sheet PDF arrives in early September. Create New, pick Moneybee PMS and August, drop in the PDF, copy the returns into the grid and Send to compliance. Once compliance approves, the Home and PMS pages show August's returns.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a month: pick the fund and the month, drop in the PDF, copy the numbers in. Fact sheets, explained, below, walks through it." },
      { at: "text:Status", label: "Status", text: "Only an approved sheet changes the site, and someone other than the person who typed it approves it." },
      { at: "css:tbody tr a", label: "A month", text: "Open it to check its numbers against the PDF, or to correct a published month." },
    ],
  },
  products: {
    name: "Products",
    group: "Publishing",
    href: "/admin/collections/products",
    icon: "products",
    line: "The PMS strategy and the Flyingbee AIF. Fact sheets belong to a product, and its benchmark and its public returns switch live here.",
    example: "The AIF's benchmarking agency sends its first report. Open Flyingbee Investment Fund and turn on Show performance publicly: the AIF page starts showing returns from its approved fact sheets.",
    controls: [
      { at: "css:tbody tr a", label: "A product", text: "Open it for its benchmark and the Show performance publicly switch. Leave that off for the AIF until the benchmarking agency's report exists." },
      { at: "text:Benchmark", label: "Benchmark", text: "Change it only when the fund's documents do." },
      { at: "text:Create New", label: "Create New", text: "Only for a new fund. Never change a product's code name once it is live." },
    ],
  },
  files: {
    name: "Files",
    group: "Publishing",
    href: "/admin/collections/media",
    icon: "files",
    line: "Every PDF and picture uploaded for the site: document PDFs, portraits, fact sheets.",
    example: "A portrait needs replacing. Find the old one here by its file name, open it, upload the new picture, and write what it shows in Alt, such as Portrait of Manan Shah.",
    controls: [
      { at: "text:Bulk Upload", label: "Bulk Upload", text: "Uploads many at once. Usually you upload from the place that uses the file instead; it lands here by itself." },
      { at: "css:.search-filter__input", label: "Search", text: "Find a file by its name to replace it." },
      { at: "text:Create New", label: "Create New", text: "Every file here is public. Fill in Alt with what a picture shows, for screen readers." },
    ],
  },
  playbooks: {
    name: "Playbooks",
    group: "Settings",
    href: "/admin/collections/playbooks",
    icon: "playbooks",
    line: "What to do with each kind of enquiry: how fast to answer, who should take it, the steps, and the reply to start from.",
    example: "Investors asking to withdraw should hear back within 4 hours, from a senior person. Open the Investor withdrawal or complaint playbook, set Reply within to 4, say who takes it, and write the steps the way you would say them on the call.",
    controls: [
      { at: "css:tbody tr a", label: "A playbook", text: "Open one to change its reply time, who takes it, the steps and the reply to start from. Keep the steps short enough to follow on a call." },
      { at: "text:Reply within (hours)", label: "Reply within", text: "How fast to answer. It overrides the reply times in Enquiry settings." },
      { at: "text:Create New", label: "Create New", text: "Write one for each kind and severity that needs its own approach. When several match, the one with the lowest Order is shown." },
    ],
  },
  emailTemplates: {
    name: "Email templates",
    group: "Settings",
    href: "/admin/collections/email-templates",
    icon: "templates",
    line: "The emails staff send from an enquiry and the automatic ones. Words in double braces, like {{firstName}}, fill in when it sends.",
    example: "You want a warmer first reply for PMS enquiries. Open PMS first reply, change the words, keep {{firstName}} where the name goes, and send a test to yourself to read it on your phone before anyone uses it.",
    controls: [
      { at: "css:tbody tr a", label: "A template", text: "Open it to build the email from the blocks on the left; the preview shows computer and phone. Send a test to yourself before using it." },
      { at: "text:Purpose", label: "Purpose", text: "Staff pick a reply template on an enquiry; the automatic ones send by themselves." },
      { at: "text:Create New", label: "Create New", text: "Never promise returns: SEBI's advertising rules apply to every email." },
    ],
  },
  clientAccounts: {
    name: "Client accounts",
    group: "Settings",
    href: "/admin/collections/investors",
    icon: "clients",
    line: "Investor logins to the client portal. Moneybee creates each account; a disabled one cannot sign in.",
    example: "A new PMS client with client code MB1042 wants portal access. Create New with their name, email and MB1042. When statements go live, files named MB1042 reach only them. If they leave, disable the account rather than delete it.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Creates an investor's portal login with their client codes from the back office. Statements named with those codes reach this investor." },
      { at: "css:.search-filter__input", label: "Search", text: "Find an investor by name." },
      { at: "text:Filters", label: "Filters", text: "Find disabled accounts. Disable rather than delete when someone leaves." },
    ],
  },
  staff: {
    name: "Staff",
    group: "Settings",
    href: "/admin/collections/users",
    icon: "staff",
    line: "Everyone who signs in to this admin, and what each may do. Only an admin changes roles.",
    example: "A new operations hire starts on Monday. Create New with their work email and give them Editor only. Whoever types fact sheet numbers should not also have Compliance, so every approval is a second person.",
    controls: [
      { at: "css:tbody tr a", label: "A person", text: "Open them to change their roles. Give each person only the roles their job needs." },
      { at: "text:Roles", label: "Roles", text: "Whoever enters numbers should not also approve them; approving is compliance's role." },
      { at: "text:Create New", label: "Create New", text: "Adds someone to this admin. Remove people the day they leave." },
    ],
  },
  auditLog: {
    name: "Audit log",
    group: "Settings",
    href: "/admin/collections/audit-log",
    icon: "audit",
    line: "Every change made here: who, when, and what moved. Nobody can edit or delete it.",
    example: "The Home page headline changed and nobody remembers who did it. Filter by the Home page and you see who published the change, and when.",
    controls: [
      { at: "text:Filters", label: "Filters", text: "Filter by screen or by person to find a change." },
      { at: "text:Summary", label: "Summary", text: "What moved, in one line." },
      { at: "css:tbody tr a", label: "A change", text: "Open it for who changed what, and when. Nobody can edit or delete it, so it answers compliance's questions." },
    ],
  },
  enquirySettings: {
    name: "Enquiry settings",
    group: "Settings",
    href: "/admin/globals/crm-settings",
    icon: "settings",
    line: "The reply times the enquiry desk runs on, the acknowledgement email, and the AI switches with their thresholds. A playbook's own reply time wins.",
    example: "During results season the team cannot answer Normal enquiries within 24 hours. Change Normal to 48 and Save: new enquiries get the longer time. A playbook with its own time still wins.",
    controls: [
      { at: "has:Critical ^ .field-type", label: "Reply times", text: "How many hours each severity has. Set times the team can keep; a playbook's own time wins." },
      { at: "has:Email the visitor ^ .field-type", label: "Acknowledgement", text: "Leave it on, so visitors know their message arrived." },
      { at: "has:Read new enquiries ^ .field-type", label: "AI switches", text: "Each says what it sends and to which model. Turn one on only once AI Gateway has credits." },
      { at: "text:Save", label: "Save", text: "The new settings apply to the next enquiry." },
    ],
  },
} as const satisfies Record<string, Screen>;

export type ScreenKey = keyof typeof SCREENS;

/** The Guide's address for a screen's entry. */
export const screenGuideHref = (key: ScreenKey) => `/admin/guide#screen-${key}`;

/** The `admin.components` entry that puts a screen's intro under its title (components/admin/screen-intro.tsx). */
export const screenIntro = (screen: ScreenKey) => ({ Description: { path: "/components/admin/screen-intro#ScreenIntro", clientProps: { screen } } });

/**
 * The sidebar's four groups, for Guide › Start here: what each is for, and
 * where each screen in it leads. Names link to the screen's entry.
 */
export const GROUPS: readonly { group: Group; title: string; leads: readonly { keys: readonly ScreenKey[]; name?: string; text: string }[] }[] = [
  {
    group: "Desk",
    title: "the daily work with people",
    leads: [
      { keys: ["today"], text: "leads to what needs you now: enquiries waiting, overdue replies, fact sheets to approve." },
      { keys: ["enquiries"], text: "leads to every message from the Contact page, each with its reply clock." },
      { keys: ["people"], text: "leads to everyone who has written in or invests, with their history." },
      { keys: ["deals"], text: "leads to each prospective investment and the stage it has reached." },
    ],
  },
  {
    group: "Website",
    title: "what visitors see on the site",
    leads: [
      { keys: ["pages"], text: "leads to all eleven pages; Edit opens one beside the live page." },
      { keys: ["team", "documents", "caseStudies", "openings"], text: "lead to lists that pages show." },
      { keys: ["officeDetails"], text: "leads to the phone, email, address and map every page uses." },
      { keys: [], name: "Guide", text: "is this page." },
    ],
  },
  {
    group: "Publishing",
    title: "the numbers and files behind the site",
    leads: [
      { keys: ["factSheets"], text: "leads to each month's returns; compliance approves them before the site changes." },
      { keys: ["products"], text: "leads to the PMS and the AIF, their benchmark and whether returns may be shown." },
      { keys: ["files"], text: "leads to every PDF and picture uploaded." },
    ],
  },
  {
    group: "Settings",
    title: "how the desk runs and who may do what",
    leads: [
      { keys: ["playbooks", "emailTemplates", "enquirySettings"], text: "lead to how enquiries are answered." },
      { keys: ["clientAccounts", "staff"], text: "lead to who can sign in, to the portal and to this admin." },
      { keys: ["auditLog"], text: "leads to every change and who made it." },
    ],
  },
];
