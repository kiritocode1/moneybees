# Moneybee: what the site and admin need, and what to cut

Research of 12 Oct 2026. Sources: the PMS Master Circular of 16 Jul 2025 (read here, APMI copy), the AIF Master Circular of 3 Jun 2026 (agent read), and five peer sites: Marcellus, Stallion Asset, Abakkus, Carnelian and Unifi. Notes are in `research/regulation.md` and `research/peers.md`.

## Required, and missing from the site today

| Requirement | Source | Today |
|---|---|---|
| Monthly complaints data in the Annexure 7A format, published by the 7th of the next month | PMS MC 7.2.1 (p.63), Annexure 7A (p.160) | Not on the site. Investor Centre says "Available on request" |
| Investor Charter displayed on the website | PMS MC 4.4 (p.41) | "Available on request" |
| Latest Disclosure Document on the website; related-party changes uploaded within 7 days | PMS MC Annex 4B item 28, 4.7.3 | "Available on request" |
| Option to onboard directly, with no charges except statutory, stated on the website | PMS MC 2.3.2 (p.20) | Not found anywhere on the site |
| Performance net of fees, TWRR against the benchmark, "not verified by SEBI" | PMS MC 4.5.3 (p.43), 5.6 | /pms carries the deck's text, which says "not verified by the regulator" |
| No AIF past performance in marketing without the benchmarking agency's report; marketing to proposed investors only, privately | AIF MC 22.5.1, 3.2.1 | /aif shows Flyingbee's +11.08% and +23.20% against the benchmark, publicly |
| No implying past gains will repeat; no exaggeration | PMS MC Annex 2A 1.2, 1.7 | Multibagger Picks: ">2X >5X >10X >20X >100X", "Our superior gains stem from..." |
| Impersonation watch | SEBI letter via APMI (PMS MC annex 6.2) | No fraud notice. Marcellus and Unifi carry one in the footer |

## What the best peers share that we lack

- One Disclosures page grouped by PMS and AIF (Abakkus, Stallion).
- Dated monthly fact sheets per product (Stallion, Abakkus).
- Monthly investor letters (Carnelian, Abakkus).
- A fee schedule or calculator (Stallion, Abakkus, Marcellus).
- A trust block: years, clients, AUM (Unifi).

No peer has a stock-picks page, a case-study page, a standalone PMS-vs-AIF page, or a distributor door in the main face.

## Admin, done on 12 Oct

The sidebar went from 21 links in 10 groups to 14 links in 3:
- **Desk:** Today, Enquiries, People, Deals.
- **Publishing:** fact sheets, products, metrics, files.
- **Settings:** the rest.

Activities, emails, tasks, entities and the raw enquiry table are out of the sidebar. They are still reached from a person or an enquiry. The Desk links show only to roles that can open them.

## Proposed next

1. **Publishing takes the monthly duties.**
   - Fact sheets (exists).
   - Complaints data (new): the Annexure 7A form with approval by a second person. Today counts down to the 7th. The site's table and archive read from it.
   - Documents (new): charter, Disclosure Document, policies and forms, each versioned and dated. The Investor Centre lists whatever is there.
2. **Today becomes the compliance clock.** It shows complaints data due, last month's fact sheet unpublished, and a Disclosure Document older than a year.
3. **Site trims:**
   - /preview pages out of production.
   - The distributor door card off the Investor Centre.
   - The direct-onboarding line and fraud notice added.
   - "Not verified by SEBI" in the circular's own words.
4. **Email templates resume with compliance built in.** Returns blocks are PMS only. AIF figures go only to AIF holders, with the benchmarking report. Disclaimers are automatic.

## Questions

1. Should the AIF returns come off the public /aif page and go to the client portal, for holders only?
2. Multibagger Picks and Case Studies: replace them with monthly investor letters, or keep them until Moneybee's compliance officer reviews them?
3. Should Deals be replaced by a stage on the person (prospect, meeting, onboarding, invested), to keep the CRM lean?
4. /preview pages: delete them, or keep them on local machines only?
5. PMS vs AIF: keep the page (it is in the client's plan), or fold it into /pms and /aif as peers do?
