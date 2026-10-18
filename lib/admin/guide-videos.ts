/**
 * The Guide's videos (guide-videos plan, approved 2026-10-17): each one a
 * piece of work filmed in the admin as the role that does it, with a caption
 * per step. scripts/guide-videos.mjs records them from the running admin,
 * after scripts/guide-demo.ts resets the demo people, and writes
 * public/admin-guide/videos/<id>.mp4, .vtt and .webp plus
 * lib/admin/guide-videos.json (length and chapter times). The Guide reads the
 * titles and places from here. Safe on the client; no imports, so the script
 * can load it.
 *
 * A step's `run` and `then` are Agent Browser commands. `run` happens as its
 * caption appears; `then` happens at the end of `hold`, as the next caption
 * appears, so a click that changes page belongs to the step it leads to. An
 * `open` path is relative to the admin's address.
 */

export type VideoRole = "sales" | "operations" | "compliance" | "hr" | "editor";

export const ROLE_NAMES: Record<VideoRole, string> = { sales: "Sales", operations: "Operations", compliance: "Compliance", hr: "HR", editor: "Editor" };

type Command = readonly string[];
export type VideoStep = { caption: string; run?: readonly Command[]; hold?: number; then?: readonly Command[] };

export type GuideVideo = {
  id: string;
  title: string;
  role: VideoRole;
  /** In the Guide's Watch first part, the start-to-finish stories. */
  watchFirst?: boolean;
  /** The Every screen entries it shows on, by lib/admin/screens.ts key. */
  screens?: readonly string[];
  /** The How to tasks it shows on, by lib/admin/guide-how-to.ts key. */
  howTo?: readonly string[];
  /** Where the recording starts. */
  start: string;
  /** Seconds in for the poster picture. */
  poster?: number;
  steps: readonly VideoStep[];
};

const hover = (selector: string): Command => ["hover", selector];
const click = (selector: string): Command => ["click", selector];
const text = (words: string, action: "hover" | "click" = "hover"): Command => ["find", "text", words, action];
const role = (kind: string, name: string, action: "hover" | "click" = "click"): Command => ["find", "role", kind, action, "--name", name];
const type = (selector: string, words: string): Command => ["type", selector, words];
const press = (key: string): Command => ["press", key];
const open = (path: string): Command => ["open", path];
const settle: readonly Command[] = [["wait", "--load", "networkidle"], ["wait", "600"]];
const toPerson: readonly Command[] = [["wait", "--url", "**/admin/people/**"], ...settle];
const card = (name: string) => `article[aria-label^='${name}']`;
const move = (name: string) => `button[aria-label='Move ${name}']`;

export const GUIDE_VIDEOS: readonly GuideVideo[] = [
  {
    id: "first-day",
    title: "Your first day on the desk",
    role: "sales",
    watchFirst: true,
    screens: ["today"],
    start: "/admin",
    poster: 1.5,
    steps: [
      { caption: "Today is where each day starts: what is waiting on Moneybee, what is late, and your own tasks.", run: [text("Enquiries waiting on us")], hold: 4500 },
      { caption: "Each count opens its list. Anything above zero needs someone.", run: [text("Past their reply time")], hold: 3500 },
      { caption: "Below them, your own tasks for today, the overdue ones first.", run: [["scroll", "down", "420"], ["wait", "500"], text("Your tasks today")], hold: 4000 },
      { caption: "Everything else is in the menu. Desk holds the daily work: enquiries, tasks, people and deals.", run: [role("button", "Open Menu")], hold: 4000 },
      { caption: "Tasks lists everything you owe someone, grouped by when it is due.", run: [role("link", "Tasks")], hold: 4000, then: settle },
      { caption: "Press T on any screen to add a task without leaving what you are doing.", run: [press("t"), ["wait", "500"], type("input[aria-label='What to do']", "Call Rohit Kapoor back about the PMS")], hold: 4000, then: [press("Escape")] },
      { caption: "Every screen opens with a line on what it is for. How to use this brings you to its entry in the Guide.", run: [text("How to use this")], hold: 4000, then: [text("How to use this", "click"), ...settle] },
      { caption: "The Guide explains every screen, with pictures and videos like this one.", run: [["wait", "800"]], hold: 4000 },
    ],
  },
  {
    id: "enquiry-to-deal",
    title: "An enquiry, from the Contact page to a deal",
    role: "sales",
    watchFirst: true,
    screens: ["enquiries"],
    start: "/admin/inbox",
    poster: 2,
    steps: [
      { caption: "Enquiries lists every message from the Contact page, most urgent first, each with the time its reply is due.", run: [text("Rohit Kapoor")], hold: 4500, then: [text("Rohit Kapoor", "click"), ["wait", "--url", "**/admin/inbox/**"], ...settle] },
      { caption: "Opening one shows what they sent, and on the right, when the reply is due and what the playbook asks.", run: [text("Reply by")], hold: 4500 },
      { caption: "Take it, so the desk knows it is yours. The playbook's steps become your tasks.", run: [role("button", "Take it", "hover")], hold: 2500, then: [role("button", "Take it"), ...settle] },
      { caption: "Start from a template. The PMS introduction fills in the words and brings the latest fact sheet with it.", run: [role("combobox", "Start from a template"), ["wait", "400"], role("option", "PMS introduction")], hold: 4500 },
      { caption: "Here email is not connected yet, so the reply is saved on the timeline. Once it is, the button says Send reply.", run: [role("button", "Save reply without sending", "hover")], hold: 3500, then: [role("button", "Save reply without sending"), ...settle] },
      { caption: "When they are serious, turn the enquiry into a deal with the amount they mentioned.", run: [["find", "label", "Ticket size (Rs. crore)", "fill", "1.5"]], hold: 3000, then: [role("button", "Open deal"), ...settle] },
      { caption: "Their page holds everything about them: the reply, the deal and the tasks.", run: [role("link", "Open their page", "hover")], hold: 2500, then: [role("link", "Open their page"), ...toPerson] },
      { caption: "Log the call you made. No answer suggests calling again the next working day at 10:00.", run: [role("radio", "Call"), ["wait", "400"], role("radio", "No answer")], hold: 4000, then: [role("button", "Add to timeline"), ...settle] },
      { caption: "The call-back is now one of your tasks, and the call is on the timeline.", run: [text("Call again")], hold: 4500 },
    ],
  },
  {
    id: "deal-lifecycle",
    title: "A deal, from meeting to invested",
    role: "sales",
    watchFirst: true,
    screens: ["deals"],
    start: "/admin/deals",
    poster: 2.5,
    steps: [
      { caption: "Deals shows every prospective investment by stage. This is the PMS board.", hold: 3500 },
      { caption: "The line under the title adds up the open deals and counts the ones with nothing planned.", run: [text("open PMS")], hold: 3500 },
      { caption: "Ananya Bose: Rs. 2 crore, three days at Contacted, and No next step in amber.", run: [hover(card("Ananya Bose"))], hold: 4000 },
      { caption: "To move a deal, hover its card and press Move. You can also click the card and press M.", run: [click(move("Ananya Bose"))], hold: 3000 },
      { caption: "Pick the stage it has reached. Meeting asks one thing first.", run: [role("menuitemradio", "Meeting", "hover")], hold: 2000, then: [role("menuitemradio", "Meeting")] },
      { caption: "When and where. The time starts on the next working day at 11:00.", run: [click("input[placeholder^='At the office']"), type("input[placeholder^='At the office']", "At the office, Lower Parel")], hold: 2500 },
      { caption: "Leave Then write the Meeting confirmation ticked, and press Move to Meeting.", run: [role("button", "Move to Meeting", "hover")], hold: 2500, then: [role("button", "Move to Meeting"), ...toPerson] },
      { caption: "Her page opens with the Meeting confirmation written, the time and place filled in.", run: [text("Our meeting on")], hold: 4500 },
      { caption: "The meeting is in her tasks now, so the deal has a next step.", run: [text("Meeting, At the office")], hold: 3500, then: [["back"], ...settle] },
      { caption: "Back on the board, her card shows the meeting where No next step was.", run: [hover(card("Ananya Bose"))], hold: 4000 },
      { caption: "When the money lands, move her to Invested. It asks the amount and the date.", run: [click(move("Ananya Bose")), role("menuitemradio", "Invested")], hold: 3500 },
      { caption: "Operations see one more box here: Invite to the portal. Press Move to Invested.", run: [role("button", "Move to Invested", "hover")], hold: 3500, then: [role("button", "Move to Invested"), ...toPerson] },
      { caption: "For a PMS client the Welcome letter opens next, with the account date filled in.", run: [text("Welcome, PMS account opened")], hold: 4000 },
      { caption: "Every move is a line on her timeline, with who made it.", run: [["scroll", "down", "520"], ["wait", "800"], text("moved the deal to Invested")], hold: 4500 },
    ],
  },
  {
    id: "lost-deal",
    title: "When a deal is lost",
    role: "sales",
    screens: ["deals"],
    start: "/admin/deals",
    poster: 1.5,
    steps: [
      { caption: "Kunal Shah met the team, then chose another manager. His card shows the meeting still planned.", run: [hover(card("Kunal Shah"))], hold: 4000 },
      { caption: "Move the deal to Lost. It asks why.", run: [click(move("Kunal Shah")), role("menuitemradio", "Lost", "hover")], hold: 2500, then: [role("menuitemradio", "Lost")] },
      { caption: "Pick the reason, and add a line if it will help whoever talks to him next.", run: [role("combobox", "Why it was lost"), ["wait", "400"], role("option", "Went with another manager"), ["wait", "600"], click("input[placeholder^='Chose to stay']"), type("input[placeholder^='Chose to stay']", "Chose a larger PMS with a longer record")], hold: 3000 },
      { caption: "Moving to Lost closes the deal's open tasks, so nobody calls him by mistake.", run: [role("button", "Move to Lost", "hover")], hold: 3000, then: [role("button", "Move to Lost"), ...settle] },
      { caption: "Lost deals stay at the end of the board for 90 days. Click it to open.", run: [hover("[aria-label^='Lost,']")], hold: 3000, then: [click("[aria-label^='Lost,']"), ["wait", "1200"]] },
      { caption: "Each lost card keeps its reason.", run: [hover(card("Kunal Shah"))], hold: 3500, then: [click(card("Kunal Shah")), ...toPerson] },
      { caption: "On his page, the move and each closed task are on the timeline.", run: [text("moved the deal to Lost")], hold: 4500 },
    ],
  },
  {
    id: "client-account",
    title: "Opening a client's portal account",
    role: "operations",
    watchFirst: true,
    screens: ["clientAccounts"],
    start: "/admin/deals",
    poster: 2,
    steps: [
      { caption: "Deepa Iyer has invested. Operations open her portal account from her page.", run: [hover(card("Deepa Iyer"))], hold: 3500, then: [click(card("Deepa Iyer")), ...toPerson] },
      { caption: "Her Account panel says she has no account yet.", run: [text("No account yet")], hold: 3500 },
      { caption: "Invite to the portal makes the account and emails her a link to set her own password. Nobody at Moneybee sees it.", run: [role("button", "Invite to the portal", "hover")], hold: 4500, then: [role("button", "Invite to the portal"), ...settle] },
      { caption: "The link works once, for seven days. Her timeline says it went, and until when.", run: [text("The link works until")], hold: 4500 },
      { caption: "This is the email she receives.", run: [open("/admin/emails?email=portal-invitation"), ...settle, text("Set your password")], hold: 4500 },
      { caption: "Client accounts lists every account with its status and last sign-in. Hers reads Invited until she signs in.", run: [open("/admin/collections/investors"), ...settle, text("Deepa Iyer")], hold: 5000 },
    ],
  },
  {
    id: "tasks-desk",
    title: "Working your tasks",
    role: "sales",
    screens: ["tasks"],
    start: "/admin/tasks",
    poster: 1.5,
    steps: [
      { caption: "Mine shows what you owe, overdue first, then today, tomorrow and later.", run: [text("Overdue")], hold: 4000 },
      { caption: "Each task is done from its row. A call shows the number to ring.", run: [text("+919820077777")], hold: 3500 },
      { caption: "An email has Write. It opens her page on the letter, and sending it ticks the task.", run: [role("link", "Write", "hover")], hold: 4000 },
      { caption: "Tick a task when it is done.", run: [role("button", "Done: Call Priya Menon about the fees", "hover")], hold: 2000, then: [role("button", "Done: Call Priya Menon about the fees")] },
      { caption: "Then say what happened, so the next person knows. Or Undo, or add the next task.", run: [click("input[aria-label^='What happened']"), type("input[aria-label^='What happened']", "Spoke. She will decide by Friday.")], hold: 3500, then: [role("button", "Save to timeline"), ["wait", "800"]] },
      { caption: "Team shows everyone's open tasks, with who owns each.", run: [role("tab", "Team")], hold: 4000, then: settle },
      { caption: "Asked of others shows the tasks you gave someone else, and Done the last two weeks.", run: [role("tab", "Asked of others", "hover")], hold: 4000 },
    ],
  },
  {
    id: "person-page",
    title: "A person's page",
    role: "sales",
    screens: ["people"],
    start: "/admin/collections/contacts",
    poster: 3,
    steps: [
      { caption: "People lists everyone who has written in or invests. A name opens their page.", run: [text("Priya Menon")], hold: 3500, then: [text("Priya Menon", "click"), ...toPerson] },
      { caption: "Their page has everything about them. The box at the top is for writing to them or logging what happened.", run: [role("radiogroup", "What to do", "hover")], hold: 4500 },
      { caption: "Email sends any letter that can go to them: a reply on their enquiry, a client letter, or your own words.", run: [role("combobox", "Letter"), ["wait", "800"]], hold: 4000, then: [press("Escape")] },
      { caption: "Note leaves a line for whoever opens her page next.", run: [role("radio", "Note"), ["wait", "400"], click("textarea"), type("textarea", "Prefers a call after 6 pm.")], hold: 3500, then: [role("button", "Add to timeline"), ...settle] },
      { caption: "The timeline shows everything that has happened, newest first. The filters narrow it.", run: [role("radio", "Calls and meetings")], hold: 4000 },
      { caption: "On the right, one panel per decision: her tasks, enquiries, deal and account.", run: [text("Account")], hold: 4500 },
    ],
  },
  {
    id: "files",
    title: "Sending a file, and seeing where it went",
    role: "sales",
    screens: ["files"],
    start: "/admin/tasks",
    poster: 2,
    steps: [
      { caption: "Priya Menon is due the fee illustration today. Write opens her page on the letter.", run: [role("link", "Write", "hover")], hold: 3500, then: [role("link", "Write"), ...toPerson] },
      { caption: "Write your words. Dear Priya Menon and your signature are added for you.", run: [click("input[aria-label='Subject'], input[name='subject']"), type("input[aria-label='Subject'], input[name='subject']", "Your PMS fee illustration")], hold: 2500 },
      { caption: "Attach adds any file Moneybee keeps, or a new one from your computer.", run: [click("textarea"), type("textarea", "As promised, here is how the fees would work on a Rs. 1 crore portfolio."), role("button", "Attach")], hold: 4000 },
      { caption: "Pick the file. It goes with this one email only.", run: [text("PMS fee illustration", "click")], hold: 3500, then: [press("Escape")] },
      { caption: "Save it. Sending ticks the task, since this was the letter it asked for.", run: [role("button", "Save without sending", "hover")], hold: 3000, then: [role("button", "Save without sending"), ...settle] },
      { caption: "Files shows every file kept. The panel says where each is used and every email it went in.", run: [open("/admin/files"), ...settle, text("PMS fee illustration", "click"), ["wait", "800"], text("Sent with")], hold: 5500 },
    ],
  },
  {
    id: "entity",
    title: "Recording an HUF or family office",
    role: "sales",
    screens: ["people"],
    start: "/admin/inbox",
    poster: 3,
    steps: [
      { caption: "Sanjay Agarwal wrote in about Flyingbee, and said he invests as an HUF.", run: [text("Sanjay Agarwal")], hold: 3500, then: [text("Sanjay Agarwal", "click"), ["wait", "--url", "**/admin/inbox/**"], ...settle] },
      { caption: "The Person panel offers to record the HUF. Give its name as on its PAN.", run: [["scroll", "down", "700"], ["wait", "600"], click("input[placeholder$='Family HUF']"), type("input[placeholder$='Family HUF']", "Agarwal Family HUF")], hold: 4000, then: [role("button", "Add the HUF"), ...settle] },
      { caption: "Now it says he invests through the Agarwal Family HUF. Others in the family can be linked to the same one by its name.", run: [text("Agarwal Family HUF")], hold: 4500 },
      { caption: "A deal opened from here carries the HUF.", run: [["find", "label", "Ticket size (Rs. crore)", "fill", "2"]], hold: 2500, then: [role("button", "Open deal"), ...settle] },
      { caption: "On the Flyingbee board, his card shows the HUF under his name.", run: [open("/admin/deals?kind=aif"), ...settle, hover(card("Sanjay Agarwal"))], hold: 4500 },
    ],
  },
];
