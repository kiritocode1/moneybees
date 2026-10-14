/**
 * Guide › How to and Guide › The rules (guide-legible plan, approved
 * 2026-10-14). A step with a `shot` gets a picture of that screen with the
 * control it names ringed; scripts/guide-shots.mjs takes it from the running
 * admin, finding each `at` the way lib/admin/screens.ts describes. `width` is the
 * browser width the picture is taken at: 1024 keeps a list readable, 1440
 * fits a page beside its live preview. `setup` lists clicks made before the
 * picture. `frame:` before `at` looks inside the live preview. Safe on the
 * client; no imports, so the script can load it.
 */

export type Shot = { url: string; at: string | readonly string[]; width?: 1024 | 1440; setup?: readonly string[] };

export type HowStep = { text: string; shot?: Shot };

export type HowTask = { key: string; title: string; when: string; steps: readonly HowStep[] };

const HOME_EDITOR = "/admin/globals/home-page";

/** The jobs staff do most, in the order they need them. */
export const HOW_TO: readonly HowTask[] = [
  {
    key: "change-words",
    title: "Change words on a page",
    when: "A line is out of date, or the client wants it said differently.",
    steps: [
      { text: "Open Website › Pages and press Edit on the page.", shot: { url: "/admin/website", at: "text:Edit Home page" } },
      {
        text: "The live page shows on the right. Press Edit on the section's bar, or click anywhere in the section. Its fields open on the left.",
        shot: { url: HOME_EDITOR, width: 1440, at: "frame:[data-preview-bar] button" },
      },
      {
        text: "Type. The page on the right updates in about a second.",
        shot: { url: `${HOME_EDITOR}?section=0`, width: 1440, at: "css:.blocks-field textarea, .blocks-field input[type=text] ^ .field-type" },
      },
      { text: "Press Publish changes when it reads right. Until then visitors see the old words.", shot: { url: HOME_EDITOR, width: 1440, at: "text:Publish changes" } },
    ],
  },
  {
    key: "move-hide",
    title: "Move or hide a section",
    when: "A section should come earlier, or should not show for now.",
    steps: [
      { text: "Each section on the right has a bar. The arrows move it up or down; the eye hides it.", shot: { url: HOME_EDITOR, width: 1440, at: "frame:[data-preview-bar]" } },
      { text: "A hidden section stays on the right, greyed out, so you can find it. The eye shows it again." },
      { text: "Visitors see the new order only after you publish." },
    ],
  },
  {
    key: "add-section",
    title: "Add a section",
    when: "A page needs something it does not have yet.",
    steps: [
      { text: "Press Add Section under the list of sections on the left.", shot: { url: HOME_EDITOR, width: 1440, at: "text:Add Section" } },
      { text: "Pick one by its picture. It arrives with sample words.", shot: { url: HOME_EDITOR, setup: ["click text:Add Section"], at: "css:.blocks-drawer__block" } },
      { text: "Change the words, move it into place with its bar, then publish." },
    ],
  },
  {
    key: "fact-sheet",
    title: "Change the returns and the graphs",
    when: "A new month's fact sheet has arrived.",
    steps: [
      { text: "Open Publishing › Fact sheets and press Create New.", shot: { url: "/admin/collections/fact-sheets", at: "text:Create New" } },
      { text: "Pick the fund and the month, then drop in the month's fact sheet PDF.", shot: { url: "/admin/collections/fact-sheets/create", at: "has:PMS strategy" } },
      {
        text: "Copy the numbers into the grid. You can paste a whole column. A box turns amber when it moved a lot since last month: check it against the PDF.",
        shot: { url: "/admin/collections/fact-sheets/create", at: "css:table" },
      },
      {
        text: "Press Send to compliance. Someone from compliance, not you, approves it, and the graphs and returns on the site change then.",
        shot: { url: "/admin/collections/fact-sheets/create", at: "text:Send to compliance" },
      },
    ],
  },
  {
    key: "document",
    title: "Put up a document",
    when: "Compliance has approved a new or updated PDF.",
    steps: [
      { text: "Open Website › Documents and press the document, or Create New for a new one.", shot: { url: "/admin/collections/documents", at: "css:tbody tr a" } },
      { text: "Drop the approved PDF into File, or type a web address for a page on another site.", shot: { url: "/admin/collections/documents/1", at: "text:File ^ .field-type" } },
      { text: "Set the date it carries, then Save. It is on the Investor Centre page straight away.", shot: { url: "/admin/collections/documents/1", at: "text:Save" } },
    ],
  },
  {
    key: "undo",
    title: "Undo a change",
    when: "Something went live, or is about to, that should not have.",
    steps: [
      { text: "Before you publish: the status at the top says Unpublished changes, and Revert to published beside it throws the draft away.", shot: { url: HOME_EDITOR, width: 1440, at: "css:[data-mb-state]" } },
      { text: "After you publish: Versions, at the top right, lists every saved version. Open one and restore it.", shot: { url: HOME_EDITOR, width: 1440, at: "has:Versions" } },
    ],
  },
];

/** The fact sheet screen, numbered as the first three steps of its journey (lib/pages/fact-sheet-guide.ts JOURNEY). */
export const FACT_SHEET_SCREEN: Shot = {
  url: "/admin/collections/fact-sheets/create",
  at: ["label:Month before ^ div", "has:Drop the month's fact sheet here", "text:Send to compliance"],
};

/** The rules, each with the reason behind it. */
export const RULES: readonly { rule: string; why: string }[] = [
  { rule: "Your changes are a draft until you press Publish changes.", why: "So you can try words out. Visitors never see a draft." },
  { rule: "Returns come only from a fact sheet that compliance has approved. Nobody types them into a page.", why: "A wrong return on the site is a regulatory problem, so every figure needs a second pair of eyes and a PDF behind it." },
  { rule: "Words in braces, like {sinceInception}, print a figure from that fact sheet. Keep the braces.", why: "Without them the figure stays fixed and goes out of date next month." },
  { rule: "Never promise or hint at future returns.", why: "SEBI's advertising rules bar it, on the site and in every email." },
  { rule: "Every publish is kept, and any earlier version can be brought back.", why: "So a mistake costs minutes, not a rebuild." },
  {
    rule: "Documents, team members, case studies and openings have no draft: Save puts them on the site. Upload only a file compliance has approved.",
    why: "They are short records, so a draft would only add a step. That is why the check happens before you upload.",
  },
];
