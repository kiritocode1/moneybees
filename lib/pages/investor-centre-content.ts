import { INVESTOR_CENTRE, INVESTOR_LOREM } from "@/lib/investor-centre";

/*
 * What each /investor-centre section says, in the shape the Investor Centre
 * page record in /admin stores it: today's words, written by the first
 * migration so the page reads the same. The login cards keep their words in
 * code, like the closing cards; the documents are a list of their own
 * (collections/Documents.ts).
 */

export type LoginsContent = { heading: string };

export type DocumentsContent = { heading: string; lead?: string | null };

export const LOGINS_SECTION: LoginsContent = { heading: INVESTOR_CENTRE.heading };

// LOREM
export const DOCUMENTS_SECTION: DocumentsContent = { heading: "Documents", lead: INVESTOR_LOREM.long };

/** /investor-centre as it stood before it was editable, top to bottom. */
export const INVESTOR_CENTRE_SECTIONS = [
  { blockType: "logins", hidden: false, ...LOGINS_SECTION },
  { blockType: "documentCards", hidden: false, ...DOCUMENTS_SECTION },
  { blockType: "closingDoors", hidden: false },
] as const;
