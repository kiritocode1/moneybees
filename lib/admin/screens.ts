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
  | "tasks"
  | "deals"
  | "hiring"
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
    line: "What needs you today: enquiries waiting on Moneybee, ones past their reply time, the ones you took, your tasks, fact sheets to approve, and for HR new applications and interviews.",
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
    example: "Kavita Shah rings the office instead of writing in. Search for her first: if she enquired on the site last year, she is already here with everything she was told. If not, Create New. If the money is her family's HUF, open her page and Change Invests as to the HUF; her husband can be linked to the same HUF by its name.",
    controls: [
      { at: "css:.search-filter__input", label: "Search", text: "Search by name, email or phone before adding anyone. The website adds people by itself when they enquire." },
      { at: "text:Create New", label: "Create New", text: "For someone who called or came in. When the money is a family's, HUF's, company's or trust's, set Invests as on their page." },
      { at: "css:tbody tr a", label: "A person", text: "Opens their page: write to them, log a call, plan the next step, and every enquiry, email and deal they have had." },
    ],
  },
  tasks: {
    name: "Tasks",
    group: "Desk",
    href: "/admin/tasks",
    icon: "tasks",
    line: "What each of us owes someone, and when. Most are made by the work itself: a call's outcome, a playbook, a deal moving.",
    example: "Rohan Mehta does not pick up. Log the call as No answer: Call again appears here for the next working day at 10:00. Tomorrow tap his number from the row, then tick it and write what was agreed.",
    controls: [
      { at: "css:input[aria-label='What to do']", label: "Add a task", text: "What, for whom, when and who. Press T anywhere in the admin to add one without coming here." },
      { at: "css:#tasks-tab-1", label: "Team", text: "Everyone's open tasks, with who owns each. Asked of others shows the ones you gave someone." },
      { at: "has:Overdue", label: "Overdue first", text: "Then today, tomorrow and later. A call shows the number; an email has Write, and sending the letter ticks it." },
    ],
  },
  deals: {
    name: "Deals",
    group: "Desk",
    href: "/admin/deals",
    icon: "deals",
    line: "Each prospective investment, from first contact to money in, on a board by stage. Every card shows its next step, so none goes quiet.",
    example: "Arjun Desai wants to put ₹1.5 crore into Flyingbee. Turn his enquiry into a deal. When the forms go out, drag his card to Documents sent and tick what went: a call to chase the signed forms appears three working days later. When the money lands, move him to Invested with the amount and date, invite him to the portal, and the Funds received letter opens filled in.",
    controls: [
      { at: "css:#deals-kind-tab-0", label: "PMS and Flyingbee", text: "One board each. Board or List, and Everyone or one person's deals, sit beside them." },
      { at: "css:article[data-column]", label: "A deal", text: "Drag it to the stage it has reached, or click it and press M. Meeting, Documents sent, Invested and Lost ask one thing first. Click it to open the person." },
      { at: "has:No next step", label: "No next step", text: "Nothing is planned for this deal. Open the person and add a task. A card past 14 days at one stage turns amber too." },
    ],
  },
  hiring: {
    name: "Hiring",
    group: "Desk",
    href: "/admin/hiring",
    icon: "hiring",
    line: "Every application from the Careers page, by stage: New, Shortlisted, Interview, Offer, Hired, Closed. Applications delete themselves on their keep-until day.",
    example: "Priya Shah applies for Equity Research Analyst and says yes to all three must-haves. You open her, read the resume, and Shortlist. Add an interview with the invitation email, then Make an offer with the terms written in. When she accepts, Mark as hired, Close the role, and Tell the others it is filled.",
    controls: [
      { at: "css:[role=tablist]", label: "Stages", text: "One tab per stage. New is where every application arrives; work it to Shortlisted or Not taken forward." },
      { at: "text:Must-haves", label: "Must-haves", text: "How many of the role's must-haves they said yes to. Write the must-haves on the role in Openings." },
      { at: "css:tbody tr", label: "An application", text: "Click it to open: the resume, their answers, the next step, emails and the timeline." },
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
    line: "The roles on the Careers page. A Live one takes applications into Hiring; a Sample is labelled as not a live vacancy; a Closed one leaves the site.",
    example: "Moneybee is really hiring an Equity Research Analyst. Open that role, check the team, location and type, write its must-haves, and set Kind to Live: the Careers page now offers Apply, and applications arrive in Hiring. Once the seat is filled, Close the role from the hired person's screen.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Adds a role with its team, location, type and must-haves. Each must-have becomes a yes or no question on the apply form." },
      { at: "text:Kind", label: "Kind", text: "Live takes applications. Sample is labelled as not a live vacancy. Closed takes the role off the site and keeps its applications." },
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
    group: "Desk",
    href: "/admin/files",
    icon: "files",
    line: "Every PDF and picture Moneybee keeps, public and private, with where each is used and who it was sent to.",
    example: "Compliance approves a new Disclosure Document. Open Files, open the old one and Replace it: the Investor Centre card and the PMS introduction letter show the new one at once. Then Send to someone to email it to a client.",
    controls: [
      { at: "text:Upload", label: "Upload", text: "Adds a file. Choose who can see it: only the people it is sent to, or anyone, so it can go on the website." },
      { at: "css:tbody tr", label: "A file", text: "Click it to see where it is used and every email it went with, and to send or replace it." },
      { at: "css:#files-tab-4", label: "Not used", text: "Files nothing uses yet. Make a PDF into a document card, send it, or delete it." },
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
      { at: "text:Reply within (hours)", label: "Reply within", text: "How fast to answer. It overrides the reply times in Desk settings." },
      { at: "text:Create New", label: "Create New", text: "Write one for each kind and severity that needs its own approach. When several match, the one with the lowest Order is shown." },
    ],
  },
  emails: {
    name: "Emails",
    group: "Desk",
    href: "/admin/emails",
    icon: "templates",
    line: "Every email Moneybee sends, as the person receiving it sees it. Change the outlined words beside it, send a test to yourself, and send the client letters marked Send here.",
    example: "A new PMS account opened today. Open Emails, choose Welcome, PMS account opened, type the client's name under To, fill the client code and the date, read the email beside you, and Send. It goes on their timeline in People.",
    controls: [
      { at: "css:nav[aria-label='Emails']", label: "Every email", text: "Grouped by who receives it, each marked with how it goes out: Automatic, From an enquiry, From Hiring, Send here, Mailing or System." },
      { at: "has:Words, click to edit", label: "The outlined words", text: "The part you may change. The facts, the signature and the disclosures SEBI requires are drawn around them, so an edit cannot remove them." },
      { at: "text:Save words", label: "Save words", text: "Compliance or HR save the words for every email of this kind. Send a test to me first to read it on your phone." },
      { at: "text:Send to a client", label: "Send to a client", text: "For letters marked Send here: choose the person, fill the facts, read the email, then send. Words in square brackets must be replaced first." },
    ],
  },
  clientAccounts: {
    name: "Client accounts",
    group: "Settings",
    href: "/admin/collections/investors",
    icon: "clients",
    line: "Investor logins to the client portal, each with its person and when they last signed in. Invite someone from their page in People; they set their own password.",
    example: "A new PMS client wants portal access. Open them in People and choose Invite to the portal under Account: they get an email to set their own password, valid seven days, and read Invited here until they first sign in. Add their client code here, such as MB1042, so statements named MB1042 reach only them. If they leave, switch the account off rather than delete it.",
    controls: [
      { at: "text:Create New", label: "Create New", text: "Rarely needed: Invite to the portal on the person's page makes the account without anyone typing a password. Use the account here to add client codes from the back office." },
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
    name: "Desk settings",
    group: "Settings",
    href: "/admin/globals/crm-settings",
    icon: "settings",
    line: "The reply times the enquiry desk runs on, the acknowledgement emails, how long applications are kept, and the AI switches with their thresholds. A playbook's own reply time wins.",
    example: "During results season the team cannot answer Normal enquiries within 24 hours. Change Normal to 48 and Save: new enquiries get the longer time. A playbook with its own time still wins.",
    controls: [
      { at: "has:Critical ^ .field-type", label: "Reply times", text: "How many hours each severity has. Set times the team can keep; a playbook's own time wins." },
      { at: "has:Email the visitor ^ .field-type", label: "Acknowledgement", text: "Leave it on, so visitors know their message arrived." },
      { at: "has:Keep applications for ^ .field-type", label: "Keep applications", text: "How many months an application and its resume are kept before they delete themselves. Applicants agree to this when they apply. HR can change it." },
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
      { keys: ["tasks"], text: "leads to what each of us owes someone, and when. Press T anywhere to add one." },
      { keys: ["people"], text: "leads to everyone who has written in or invests, with their history." },
      { keys: ["deals"], text: "leads to the board of prospective investments, by stage, each with its next step." },
      { keys: ["hiring"], text: "leads to every application from the Careers page, for HR." },
      { keys: ["emails"], text: "leads to every email Moneybee sends, as the reader sees it." },
      { keys: ["files"], text: "leads to every PDF and picture kept, where each is used and who it was sent to." },
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
    ],
  },
  {
    group: "Settings",
    title: "how the desk runs and who may do what",
    leads: [
      { keys: ["playbooks", "enquirySettings"], text: "lead to how enquiries are answered and how long applications are kept. An email's words are changed on Desk › Emails." },
      { keys: ["clientAccounts", "staff"], text: "lead to who can sign in, to the portal and to this admin." },
      { keys: ["auditLog"], text: "leads to every change and who made it." },
    ],
  },
];
