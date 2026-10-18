# Compact careers job board

## Outcome
Replaced the five large team enquiry rows with searchable role results, a team filter, five-item pagination and native modal role details. Removed the oversized team photo from the introduction. Workplace and resume content remain below the board. No new dependencies.

Roles in lib/career-roles.ts are presentation samples, not approved vacancies. The board and details both disclose this. Email links are enquiries, not assertions of live hiring.

## Verification
- TypeScript noEmit passed after implementation.
- ESLint passed for all changed careers files.
- git diff --check passed.
- Desktop screenshot at 1440px; browser flow checks at 768px, 390px and 320px.
- Keyword search, case and surrounding whitespace, team filtering, combined empty results, reset, next/previous and filter changes from the second page passed.
- Enter opens details, Tab/Shift+Tab reaches the modal controls, Escape and Close restore focus to the role button.
- Native modal excludes background controls. Chromium can move focus to browser chrome when tabbing past the last control; no custom keyboard trap was added to override native dialog behavior.
- Modal has independent vertical scrolling and fits the narrow viewport without horizontal overflow.
- Axe: main content 30 passes, zero violations; open desktop dialog 22 passes, zero violations.
- No runtime errors observed. Reduced-motion preference exercised.

## Capacity proof
A temporary isolated preview rendered the same CareersJobBoard with 103 sample records. It was removed after testing.
- First page: five rows, 1–5 of 103, board height 812.30px.
- Navigated through all 21 pages. Last page: three rows, 101–103 of 103, board height 642.30px.
- Searching from the last page for capacity-102 returned one result on the first page.
- Adding records increases page count, not rendered list length.

The client filters the supplied array. Server-side search/pagination is not implemented, and backend performance for a large remote dataset is not claimed. No email sent. No real recruitment backend connected.

## Evidence
- desktop.png
- board-390.png
- details-desktop.png
- details-320.png
- empty-state.png
- browser-checks.json
- capacity-check.json
- a11y.json

URL: https://moneybees.localhost:1355/careers
