# File attach + library UX (research, 2026-10-16)

Status: partial (Front attachments article, Superhuman help body, Figma, Linear, Drive picker not read directly; see gaps).

## Observed (source -> fact)
- Papermark schema, raw.githubusercontent.com/mfts/papermark/main/prisma/schema/document.prisma + link.prisma + schema.prisma:
  - Document has many DocumentVersion; DocumentVersion has `isPrimary`, `fileSize`, `contentType`, `numPages`. Replace = new version, primary flag moves, document id stays.
  - Link points at documentId and carries `expiresAt`, `password`, `allowList` (emails/domains), `emailProtected`, `allowDownload`, `enableNotification`, `enableWatermark`, `isArchived`.
  - View belongs to a link and a document: `viewerEmail`, `verified`, `viewedAt`, `downloadedAt`, `isArchived`. One link per send, many views per link.
- HubSpot, knowledge.hubspot.com/documents/use-documents:
  - Library has search, owner filter, nested folders, Actions > Preview / Create link / Manage sharing / Download.
  - "Share documents with contacts via a shareable link or within an email template." Link gets recipient, "Require email address to view" toggle, "Allow download" toggle, then Copy or Compose email.
  - Template insert places a link, not an attachment; tracking in templates only works if the email-gate box is ticked.
  - Re-upload: warning "Updating the existing document may cause discrepancies in viewing data." and "the link will update to display the new content."
  - Per document: total links created, visitors, views; Visitors table with per-person Details.
  - "the document will be publicly available on the internet" for shareable links; multi-recipient sends give "Someone" notifications.
- Gmail, support.google.com/mail/answer/6584: personal limit 25 MB; over it "Gmail automatically removes the attachment and adds it as a Google Drive link"; Attach icon at bottom of compose; drag into compose; attachment name with a Close control to remove.
- Front, help.front.com/en/articles/2218: paperclip attaches from computer, Dropbox, Google Drive; templates icon inserts individual or shared templates, body stays editable. Front idea PRD-I-2662 (front.ideas.aha.io) is a request to include attachments inside templates, so templates-with-files is not a given even in Front.
- Superhuman, help.superhuman.com/hc/en-us/articles/46005568142989-Attachments (via search summary): Cmd+Shift+U opens picker or drag onto composer; files appear beneath the composer as chips; Snippets can carry attachments and CC (blog.superhuman.com/snippets).
- Notion, notion.com/help/create-links-and-backlinks: backlinks list "all the pages that link to the page you're currently on", appear near the title as "{#} backlinks", created automatically; backlinks to pages you cannot access show as "Private".

## Recommended design (inferred from the above plus Moneybee context)

### Attach control (email composer)
- One "Attach" button in the composer footer, left of Send, plus drag-and-drop over the whole composer (overlay "Drop to attach"). Keyboard shortcut optional.
- Click opens a popover, not a full modal. Tabs/sections top to bottom:
  1. Search field, focused.
  2. "Suggested for this email": set by context. Person page/enquiry reply for a prospect: Disclosure Document, Investor Charter, latest fact sheet (approved only). HR applicant email: careers/offer docs. Rule-based, labelled with why ("Latest approved fact sheet").
  3. "Recent": files this user attached in the last 30 days.
  4. "All files" link to the library in a side panel (same component as the library).
  5. "Upload new file" row at the bottom; upload goes into the library (so it is reusable) and attaches at once. Ask for nothing else except visibility, which defaults to Private (see below).
- Chip per attachment under the body: type icon or first-page thumbnail, name, size, "Remove" x. Chip also shows mode: "Attached" or "Link". Click chip = preview. Running total "6.2 MB of 40 MB".
- Limits: warn at 25 MB total (many recipients' mail servers reject), hard stop at the Resend cap (stated by lead as ~40 MB). Over limit: offer "Send as link instead" per file, as Gmail converts to a Drive link. Block executable types.
- Unapproved fact sheets (compliance pending) are listed greyed with "Awaiting compliance" and cannot be attached.

### Attachment vs link (Moneybee)
- Observed: HubSpot and Papermark both default to links for tracking; Gmail uses links only as an overflow.
- Inferred: default to attachment for the standard public documents (Disclosure Document, Investor Charter, fact sheet): they are public anyway, work offline, and recipients' compliance teams archive the email. Offer "Send as private link" for anything client-specific or PPM: expiry, email-gated, download toggle, revocable, and view log (opened, downloaded, when, email). Record opens/downloads only for links, state it in the UI ("Opens are recorded"), and keep the log out of attachments. Avoid pixel-based open tracking on plain emails. Check DPDP/consent wording with the firm; HubSpot gates with a consent line.
- A private PPM must never sit on a public Blob URL. Needs private storage and signed/ token links (Papermark does this via Link rows).

### File library
- List by default (name, type, size, visibility, used in, updated, owner), grid toggle for photos. Preview thumbnail = first page for PDFs. Rationale: mostly PDFs with names that matter; Papermark/HubSpot both lead with a list.
- Left filters: Type (PDF, image), Visibility (Public site / Private), Status (Approved, Awaiting compliance), Usage (Used, Unused), Used in (Pages, Team, Document cards, Fact sheets, Emails), Owner. Search by name. Optional folders, max one level, only if the count grows.
- Detail panel (right side, not a new page): large preview; visibility badge; "Used in" list grouped by kind with a link to each place, who and when (mirrors Notion backlinks incl. "Private" for places the viewer cannot open); "Sent in" email history (who, when, as attachment or link, opens/downloads for links); version history (current marked).
- Actions in the panel header: Send (opens composer with it attached), Make document card (pick section and title), Copy link (public files only; private ones create a tracked link), Download, Replace file, Archive/Delete. Delete is blocked or warned when "Used in" is non-empty.
- Replace: keep the same file id and URL; new upload becomes the primary version; old version stays in history and can be restored. Show a pre-confirm summary "This will change 3 places: ..." plus HubSpot-style warning that past view data covers both versions. Sent emails keep what they sent (attachment copies are immutable; links follow the new file unless the link is pinned to a version).
- Usage is computed, not typed: query media references (team, document cards, fact sheets, page blocks) and a join table for sent emails. Show counts in list rows ("3 places") with zero as "Unused".

## Reject
- A plain upload list with no usage, no preview, no sending (the "generic" version).
- Library hidden in a separate admin area that the composer cannot reach.
- Link-only default for public regulated documents (adds a dependency on a live URL).
- Public Blob URLs for client-specific or PPM files.
- Embedding files in templates silently: Front users request it, HubSpot inserts links instead; if used, show the files as visible chips on the template and each send.
- Open tracking that is not disclosed.

## Access gaps
- Front attachments article (articles/2158 or the linked one) and Front shared drafts not read; WebFetch returned only the composer page content.
- Superhuman and Notion read through search summaries, not the page bodies. Notion direct URL /help/backlinks 404; correct page is /help/create-links-and-backlinks.
- Figma component usage, Linear attachments, and Google Drive picker docs not read (budget). Drive-picker layout (Recent/Suggested/Upload tabs) is from general knowledge, not observed here.
- Papermark: schema read only, not the UI code. Resend 40 MB limit taken from the brief, not verified.
- Repo's current Payload media collection not inspected.
