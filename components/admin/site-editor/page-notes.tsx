import { BriefcaseBusiness, Building2, ChartColumn, FileText, LockKeyhole, MessageSquareText, Users } from "lucide-react";
import { SourceNote } from "./source-note";

/*
 * The notes at the top of a section's fields (globals/pages/blocks.ts): what
 * the section shows that is edited somewhere else, with a button there. All
 * drawn by SourceNote, so they read the same.
 */

/** Investor Centre's logins: only the heading is here. */
export function LoginsNote() {
  return <SourceNote icon={LockKeyhole}>The two login cards share their words with the closing cards, so only the heading changes here.</SourceNote>;
}

/** Investor Centre's documents: the cards come from the Documents list. */
export function DocumentsNote() {
  return (
    <SourceNote icon={FileText} href="/admin/collections/documents" action="Open Documents">
      The cards, their files and dates come from <b>Documents</b>.
    </SourceNote>
  );
}

/** Contact's enquiry: the lines beside the form come from Office details; the forms are fixed. */
export function EnquiryNote() {
  return (
    <SourceNote icon={Building2} href="/admin/globals/site-details" action="Open Office details">
      Phone, email and the AIF desks come from <b>Office details</b>. The four forms stay fixed: the enquiry desk sorts by them.
    </SourceNote>
  );
}

/** Contact's office: everything in it is Office details. */
export function OfficeNote() {
  return (
    <SourceNote icon={Building2} href="/admin/globals/site-details" action="Open Office details">
      The office name, address and map pin come from <b>Office details</b>.
    </SourceNote>
  );
}

/** /aif's returns: where they come from, and the switch that keeps them off the site. */
export function AifPerformanceNote() {
  return (
    <SourceNote icon={ChartColumn} href="/admin/collections/products" action="Open Products">
      Returns come from Flyingbee&apos;s fact sheets once <b>Show performance publicly</b> is on in Products; until then, the deck&apos;s July 2026 figures. SEBI needs the benchmarking report first: tick Hide on the site until it exists.
    </SourceNote>
  );
}

/** /case-studies: the companies are their own list. */
export function CaseStudiesNote() {
  return (
    <SourceNote icon={ChartColumn} href="/admin/collections/case-studies" action="Open Case studies">
      One section per company in <b>Case studies</b>, in its order.
    </SourceNote>
  );
}

/** /careers: the roles are their own list. */
export function JobBoardNote() {
  return (
    <SourceNote icon={BriefcaseBusiness} href="/admin/collections/openings" action="Open Openings">
      The roles come from <b>Openings</b>. A Sample role is labelled as not a live vacancy.
    </SourceNote>
  );
}

/** /about's carousel: the people are their own list. */
export function TeamNote() {
  return (
    <SourceNote icon={Users} href="/admin/collections/team-members" action="Open Team">
      The people, their portraits and order come from <b>Team</b>.
    </SourceNote>
  );
}

/** The closing cards: their words are shared by every page. */
export function ClosingDoorsNote() {
  return <SourceNote icon={MessageSquareText}>Client Login and Get Started end most pages with the same words, so nothing changes here.</SourceNote>;
}
