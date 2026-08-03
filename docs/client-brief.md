# Moneybee — Client Brief (verbatim record)

> **Status:** Source document. Reproduced as received, restructured into markdown only —
> wording, ordering, and intent unchanged. Do not edit the content of this file to reflect
> our decisions; record those in [`direction.md`](./direction.md) instead.
>
> This file combines two client documents:
> 1. **Website P.O.A** — 24 Oct 2025, by Dhruv Pendse & Jay Agrawal
> 2. **Project Scope Statement** — 1 Dec 2025, by Dhruv Pendse, sponsored by Shreyam Shah

---

# Document 1 — Moneybee Advisors & Securities Website P.O.A

**Date:** 24-10-2025
**Made By:** Dhruv Pendse, Jay Agrawal
**Objective:** Clear actionables to keep in mind during the website designing process

## Points of Consideration

## Idea and Technicals

### Design

- **Visual Appeal:** Modern, clean, professional layout (not cluttered or outdated).
- **Brand Consistency:** Logo, colours, fonts match your brand identity.
- **Readability:** Easy-to-read fonts, good colour contrast, logical spacing.
- **Imagery & Graphics:** Use of original or high-quality visuals (avoid stock photo overload).
- **Creative Touch:** Subtle animations, icons, and layouts enhance, not distract.

### Technical Aspects

- **Loading speed:** Website should load in under 3 seconds. Use Google PageSpeed Insights tool
  (how to use given in Notes). LCP (Largest Contentful Paint) should be under 2.5 seconds. Speed
  optimization must be maintained after the initial launch (e.g. image compression, code minification).
- **Multi-Device View Optimization:** Should be aligned on mobile, tablet, and desktop. Text and
  buttons should adjust and remain readable.
- **Compatibility on all browsers:** Should work on Chrome, Safari, Edge, Firefox etc.
- **Search Engine Optimization (SEO):** Optimization for meta tags, page titles, alt text, clean URLs,
  sitemap (XML & HTML). Please provide a Keyword Research Report before implementing SEO.
- **Platform on which it is built:** Ask what platform it's built on (e.g. WordPress, Webflow,
  Shopify, custom code).
- **Maintenance and Addition of Elements:** Addition/deletion of data present on the website & pages
  of concern.
- **Website Backup and Recovery:** Ensure there is a backup system or version control, important in
  case the site crashes.
- **WCAG Compliance:** Makes website easy to interact with for people with disabilities.

### User Experience (UX)

- **Navigation:** Clear menu at the top, logical structure, for example — Home → About → Services → Contact.
- **Conversion Paths:** Inclusion of forms, inquiry buttons, sign-up boxes etc.
- **Contact Accessibility:** Phone, email, address, or chat available on every page (especially the footer).
- **Trust Signals:** Testimonials, certifications, reviews etc.
- **Error-Free Functionality:** All buttons, forms, and links work properly (no broken links).
- **Periodic Articles relating to topics of interest for investors:** Presenting sector-specific or
  global outlook on current trends and markets.

### Security & Ownership

- **Host Access to website:** Editing access for any changes to be made from the in-house team.
  Ensure to pass on login credentials and admin access to Moneybee team.
- **SSL Certificate:** Certifies encryption of visitor data. The URL must start with `https://`
  (not `http://`) which indicates SSL certificate is installed.
- **Maintenance POA:** Clarity on who updates plugins, security patches, and backups regularly.
- **Web Application Firewall (WAF):** Highly important that the website is WAF compliant. A WAF sits
  in front of a web application and intercepts all incoming and outgoing HTTP traffic. It uses a set
  of predefined rules or machine learning algorithms to analyse the traffic for malicious patterns,
  e.g. Cloudflare, Azure etc.

### Analytics and Performance

- **Google Analytics / GA4 Installed:** Lets you track visitor activity, sources and conversions.
- **Google Search Console Setup:** Viable to finding out SEO and indexing gaps.

---

## Comparison Chart of Methods to Build the Website

| Basis | Coding ($$$) — Developer Code | CMS ($$) — WordPress | Website Builders ($) — Squarespace, Wix |
| --- | --- | --- | --- |
| Freedom to develop / flexibility | High | High but will have to add additional plugins | Limited |
| a. Overall Cost<br>b. Initial Cost<br>c. Recurring Cost (Maintenance) | a. High<br>b. High<br>c. Depends on service provider | a. Moderate<br>b. Moderate<br>c. Moderate | a. Moderate<br>b. Low<br>c. High |
| Comparative Cost | Fairly high | High | No certainty. Cost can be increased by company but on the lower end |
| MoneyBee maintenance level | High | Moderate | Low |
| Security | Need to be established | Need to install plugins (developer will install) | High security provided, though could increase cost |
| Security updates / management | Manual (Developer responsibility) | Manual or paid automatic (Developer/Us) | Automatic |
| Backup | Required additionally | Need to automate backups manually | Automatic |
| DDOS Protection | Can be added | Can be added | Mostly included |
| Storage for Hosting | Cheap, but maintenance is ours | Moderate | Modest |
| Servers | Yes (Cloud) | Variable | No |
| Network Architecture | Our responsibility (dev) | Variable | Not our responsibility |
| Migration | Easy | Moderate | Difficult, many limitations |
| Templates | No | Limited | Yes |
| Speed | Variable | Moderate | High |
| Developer | Needed for every change | May be required initially | Not needed |
| User Profiles | Needs to be developed | Needs to be developed. Plugins | Pre-set roles exists |
| Performance | High, depends on development | Depends on plugins | High, already optimized |

> **Foot note (client's):** Based on our preference for moderate in-house maintenance, we think the
> platform of choice should be CMS (WordPress), ensuring that security and backup plugins are
> included in the scope. Do let us know your views?

---

## Note

- A handover document with credentials (domain, hosting, CMS login, email setup).
- A brief training session for how to edit content.
- Details of backup schedule and support contact.
- Information about website maintenance (updates, renewals, security).

### Elements (SEO)

- **Meta Tags:** Tell Google what each page is about
- **Page Title:** Tells visitors what the page is about
- **Alt Text:** Describes images
- **Clean URLs:** Easy to read & keyword-rich
- **Sitemap:** Helps Google find all pages and ensures efficient indexing

### How to use Google PageSpeed Insights

- Go to <https://pagespeed.web.dev/> and enter the website's URL (e.g. `https://www.yourcompany.com`).
- The tool tests how the site loads and measures real-world performance using Google's "Core Web
  Vitals". It also gives a score from 0–100 for both mobile and desktop and a list of improvement
  suggestions (technical and design-related).

### Additional notes

- Include Google Forms in case of job applications.
- We can design website on Wix for free, however it won't be ready for launch, it would be just for
  us. We can try the same with a 1-day free trial without a credit card on Squarespace. Here we will
  implement the wireframes (skeleton of the website), establish the sitemap (floorplan for exploring
  website) and functionalities, design the mock-ups and test everything.

---

## Review of Present Websites & Execution

### A) Firm Logo — Top Left Corner — 9/10 sites

- **Information:** Readability & brand recognition. Placed usually on the top-left, it anchors the
  brand immediately and provides a universally understood, clickable link back to the homepage.

### B) Value Proposition / Headline — Hero Section — 9/10 sites

- **Information:** The investor needs to know what you do and why you are different in under 3
  seconds. The main headline and a brief sub-headline must communicate the firm's core philosophy
  (e.g. "Consistent Compounders," "Value Investing").
- **Reason:** Catches the eye and hooks the investor to further explore the offerings.
- **Execution:** Insert a high-quality picture in the hero section followed by a pre-decided
  quote/tagline on the first page, making sure that is the first thing the investor sees.

### C) Performance Tab — Primary Navigation Bar — 9/10 sites

- **Information:** For AIF/PMS, performance is one of the most important USPs. Placing it directly in
  the main menu (often as the second or third link after "Home/About Us") ensures prospective
  investors see the essential data quickly, validating the firm's credibility upfront. AUM / Key
  Figures (Trust Metrics).
- **Reason:** Social proof & authority. Displaying AUM (Assets Under Management), Years of
  Experience, or Key Return Metrics (e.g. 5-Year CAGR) immediately after the headline builds
  confidence before the user scrolls further.
- **Execution:**
  - **Returns Table vs. Benchmark:** This is the investor's first filter / core metric. It clearly
    displays the scheme's returns (1 Year, 3 Year, 5 Year, Since Inception) directly compared against
    the relevant benchmark (e.g. Nifty 500 TRI). Immediate visualization of alpha.
  - **Risk-Adjusted Ratios:** HNIs look beyond absolute returns. Displaying Sharpe Ratio (return per
    unit of risk) and other such ratios (consistency vs. benchmark) separates skilled management from
    simple market luck.
  - **Fees and Cost Structure:** Transparency & compliance. SEBI requires clear disclosure. Detailing
    the Management Fee, Performance Fee (Carry), Hurdle Rate, and High-Water Mark is essential. It
    prevents sticker shock later and builds trust.
  - **Downloadable Fact Sheet / PMS/AIF Document:** The website provides the summary, but
    advisors/investors require the official, detailed Fact Sheet or Private Placement Memorandum
    (PPM). The download button serves as a low-friction lead magnet and satisfies regulatory needs for
    providing documentation.

### D) About Us Tab — Primary Navigation Bar (often the first or second) — 9/10 sites

- **Information:** Investors want to know what this firm is before they look at "How do they
  perform?" The page anchors the firm's existence, making it a critical early-stage validation point
  in the due diligence process. Founding story/history — build a narrative. The origin story (e.g.
  "Founded in 2005 by three value investors...") builds an emotional and historical foundation for
  the firm's strategy, demonstrating longevity and conviction.
- **Reason:** HNIs are buying into a process and a belief system. These statements assure the
  investor that the firm's ethics and strategy are consistent and won't change on a whim.
- **Execution:**
  - **Placement:** Prominently featured, often immediately following the founding narrative or history.
  - **Content Focus:** This section establishes the firm's non-negotiable guiding principles.
    - **Mission:** Why the firm exists (e.g. "To generate superior risk-adjusted alpha for
      sophisticated investors through research-intensive, long-term strategies").
    - **Vision:** What the firm aspires to be (e.g. "To be the most respected wealth creator for
      India's UHNW community").
    - **Values:** How they conduct business (e.g. Integrity, Discipline, Research Excellence).
  - **Institutional Milestones & Metrics:**
    - **Regulatory Status:** Clearly stating "SEBI Registered AIF/PMS" and the registration number.
    - **Years of Operation:** Total years in the business.
    - **Key Growth Figures:** AUM size, number of investors/families served.
    - **Awards/Recognition:** Reputable industry awards or press mentions. These are authority and
      social proof metrics. They quantify the firm's success and regulatory legitimacy, which is
      vital in a heavily regulated and high-trust industry.
  - **"The Differentiator" / Investment Philosophy Summary:**
    - **Placement:** Usually the final section before a concluding CTA (Call to Action).
    - **Content Focus:** A concise, persuasive summary of how the firm invests differently. This is
      often repeated from the homepage but with more detail. For an AIF, this might explain their
      proprietary research model (e.g. "5-Factor Quant Model") or their unique asset class focus
      (e.g. "SME debt lending" or "Pre-IPO consumer brands").

### E) Team Tab — Primary Navigation Bar — 8/10 sites

- **Information:** After establishing performance and strategy, the investor wants to vet **who** is
  making the decisions.
- **Reason:** Placing it late in the main menu suggests it's the final, crucial step in the due
  diligence process. A single section on the homepage is insufficient. A full page is needed to
  provide the required professional biographies and high-quality photography.
- **Execution:**
  - **High-Quality Photography:** Prominently featured next to each member's bio. Professional,
    high-resolution, consistent styling (e.g. all studio shots, all natural light, consistent
    backdrop). Avoid low-quality headshots or informal pictures.
  - **Fund Manager / CIO Profile:** At the very top of the page, often in a larger, more distinct
    format. This profile must emphasize years of experience (especially market cycle survival),
    previous notable firms/roles (e.g. "ex-BlackRock," "ex-HDFC Securities CIO"), and their direct
    role in developing the current investment philosophy.
  - **Comprehensive Professional Bio:** A concise paragraph summarizing their career, followed by
    bullet points for key achievements — namely educational background, mandate/role, experience metrics.
  - **Supporting Team (Research, Sales, Operations):** Listed after the senior leadership, usually in
    a standardized grid format. Focuses on the depth and diversity of the team. Even supporting roles
    should be listed to show that the firm is well-staffed and compliant. Demonstrates institutional
    strength. Investors need assurance that the firm is not reliant on a single individual ("key-man
    risk") and has a robust research process.
  - **Personal Touch (optional, but effective):** Often a single, concluding sentence in the bio. A
    very brief mention of a personal interest, passion, or core belief. While optional, it can help
    make the senior team more relatable and build a stronger psychological connection with the UHNWI
    investor.

### F) Insights / Knowledge Centre / Blog Tab — Primary Navigation Bar — 8/10 sites

- **Information:** HNIs and advisors vet firms based on their research quality. A blog or insights
  section showcases the fund manager's thinking, builds long-term trust, and drives organic traffic
  via relevant keywords.
- **Reason:** The Insights page moves the investor beyond just looking at past performance and
  encourages them to invest in the future decision-making competence of the firm.

### G) Primary Call-to-Action Tab — Primary Navigation Bar / Fixed Header — 9/10 sites

- **Information:** HNIs are often busy. A sticky "Contact Us," "Book a Call," or "Invest Now" button
  (usually a distinct colour) provides an instant, ever-present entry point to the sales funnel,
  minimizing navigation steps.

### H) Login Tab — Primary Navigation Bar / Fixed Header — 10/10 sites

- **Information:** Investor login on the Alternative Investment Fund (AIF) Portal, a tool that allows
  investors to track their investments with us (Comprehensive Investment Overview, Remote Access,
  Self-Service Portal, Simplified Tracking).
- **Reason:** Security is paramount for HNIs and the login feature is SEBI mandated.
- **Execution:**
  - **Two-Factor Authentication (2FA) / OTP:** Most modern portals require an additional one-time
    password (OTP) sent to the registered mobile number or email.
  - **Clear Password Policy:** Links to "Forgot Password" and clear instructions on complexity
    requirements.
  - **Disclaimer/Warning:** A short, stark warning near the login button about phishing and
    fraudulent activity.

### I) SEBI & Statutory Disclosures — Bottom Footer — 9/10 sites

- **Information:** This is the most critical element to master for any AIF or PMS website in India.
  SEBI (Securities and Exchange Board of India) mandates extensive disclosures to ensure investor
  protection, transparency, and comparability. These disclosures are generally found in two key areas
  on the website: the footer and the performance/products pages, and through easily downloadable
  documents.
- **Reason:** Required by law. Placing it in the footer ensures legal compliance without cluttering
  the main marketing area, but keeps it easily accessible for due diligence.
- **Execution:**
  - **Legal Requirement & Accessibility:** Must be visible on every page. This is where links to the
    official Disclosure Document (for PMS) or Private Placement Memorandum (PPM) (for AIF) are hosted
    (usually at the footer).
  - **Risk Management:** The statutory warning that "Investments are subject to market risk" and that
    the regulator (SEBI) has not approved or disapproved the contents of the document must be clearly
    stated. It manages investor expectations.
  - **Accountability:** SEBI requires disclosure of the contact details (name, phone, email) of the
    Principal Officer and the Investor Relations / Grievance Redressal Officer. This is critical for
    investor complaints (often linked to the SCORES platform).
  - **Core Institutional Disclosures (Static Section):** These details establish the firm's
    legitimacy and history, usually found in the About Us page or the Disclosure Document's static
    section:
    - **SEBI Registration Status:** The firm's category (AIF Category I, II, or III, or PMS) and the
      unique SEBI registration number (e.g. `INP0000XXXXXX`).
    - **History & Background:** Details on the portfolio manager, sponsor, and directors.
    - **Financials:** Basic financial performance of the portfolio manager entity itself.
    - **Disciplinary History:** Disclosure of any penalties, pending litigation, or past proceedings
      initiated by SEBI or other regulatory authorities in the last 5 years. This builds trust by
      confronting potential issues transparently.
  - **Investment Strategy & Performance Disclosures (Dynamic Section):** Namely explicit confirmation
    that returns are calculated using the Time-Weighted Rate of Return (TWRR) method, ensuring an
    accurate measure of managerial skill; **Benchmark Comparison:** mandatory use of an appropriate,
    publicly available benchmark (e.g. Nifty 500 TRI) for performance comparison over all time
    periods; **Fee Structure & Example:** clear tabular disclosure of all costs; **Management Fees:**
    the fixed or variable percentage charged; **Performance Fees (Carry):** the percentage split, the
    Hurdle Rate (minimum return needed before a performance fee is charged), and the High-Water Mark
    (ensuring fees are only charged on new profits); **Illustrative Fee Example:** PMS firms must show
    a clear, simple example of how fees impact returns for a sample ₹50 lakh portfolio under different
    scenarios (up 20%, down 20%, unchanged); **Portfolio Disclosures:** details on diversification
    policy, concentration limits, and investment in securities of related parties.
  - **Investor Charter & Complaint Redressal:** Investor Charter & Grievance Mechanism compliant with
    SEBI norms.

---

## Finer Details

### Theme

- **Colour Palette:** Bold and minimalist black, white, yellow/orange scheme. The yellow is used as a
  powerful accent colour for key phrases, links, and calls to action.
- **Typography:** Uses a single, modern sans-serif font. The text is often large, bold, and used as
  the primary design element on the page.
- **Layout & Spacing:** Information-focused layout. It will be a standard, multi-column corporate
  grid that is focused on presenting a wide range of information (AIF & PMS services). It should feel
  established and comprehensive.
- **Imagery:** Use a mix of professional, high-quality stock photos (cityscapes, infrastructure,
  meeting rooms) and portraits of our team. The images should be clean and reinforce the
  "professional" and "human" aspects of the business.
- **Overall Psychology of the website:** "Modern but Rooted in Tradition." The theme is confident and
  sharp. It avoids the traditional "corporate". The message is that their thinking is their core
  product; it feels like a high-end, exclusive firm / a modern hedge fund.
- **Animation:** Subtle hover effects on buttons/cards, small loading animations on main CTA button,
  but **no full-page transitions** (as it slows the website down).

### Description (what to add)

#### Homepage & Navigation

Reference: <https://alphasquaregroup.com/?ref=the-capital-stack-by-fundingstack-com.ghost.io>

- **Top Navigation Bar:**
  - Logo (left-aligned). Tabs: About, Team, Strategies, Insights (to be discussed), Contact Us
  - Minimalist background (mostly white/grey with navy blue highlights)
  - Full-width banner image (abstract finance, cityscape, or digital art). Tagline, e.g.
    *"Small steps, Big Outcomes"*. Short summary e.g. *"Moneybee Securities is a multi-asset,
    multi-strategy investment manager focused on absolute returns via deep risk management"*
  - **Quick Stats:** floating bar or card style elements — "X Crore AUM", "Y Years Experience",
    "PAN India Presence"

#### About Us Page

Reference: <https://alt-alpha.com/>

Company overview (what we do, our philosophy, our accolades), story/history, founders, mission,
values, investment philosophy.

#### Teams Page

Reference: <https://www.askfinancials.com/ask-investment-managers/home>

Photo of team members in corporate attire along with a general description. Vertical corporate column
layout going with the Moneybee theme.

#### Strategies / Performance Page

Reference: <https://www.chaifetzgroup.com/?ref=the-capital-stack-by-fundingstack-com.ghost.io>

Secondary Markets, Fixed Income, Private Placements. Individual product cards for each fund (AIF &
PMS): returns chart, risk/return profile, min investment, downloadable factsheet. Add performance
metrics of the PMS and AIF (editable) — YTD, 1Y, 5Y, Since Inception views, download data button.

#### Insights Page (optional)

Research reports, economic insights, latest investing news etc.

#### Careers Page

Reference: <https://www.jpmorgan.com/>

Job openings, apply (Google Forms link), internship.

#### Login Page

Investor login on the Alternative Investment Fund (AIF) Portal, a tool that allows investors to track
their investments with us (Comprehensive Investment Overview, Remote Access, Self-Service Portal,
Simplified Tracking).

### Additional References

- **Alpha Alternatives Asset Management:** <https://alt-alpha.com/>
- **ASK Investment Managers:** <https://www.askfinancials.com/ask-investment-managers/home/>
- **Goldman Sachs (GS):** <https://www.goldmansachs.com/>
- **Chaifetz Group:** <https://www.chaifetzgroup.com/?ref=the-capital-stack-by-fundingstack-com.ghost.io>

### Notes

- Login and password for each investor as per SEBI guidelines should be made.
- Discussion on Contact Us page (**pending**).
- Discussion on Newsletter (**pending**).

---

# Document 2 — Project Scope Statement

**Date:** December 1, 2025
**Prepared For:** Moneybee Securities Pvt Ltd
**Prepared By:** Dhruv Pendse
**Project Sponsor:** Shreyam Shah

## 1. Project Goal

The primary goal of this project is to establish a world-class, high-performance digital presence
that serves as the official first point of contact for converted clients and prospective high-net-worth
investors. The website must instil a sense of trust, clear articulation about the fund's investment
philosophy, track record and corporate story. Adherence to all relevant financial marketing and
regulatory compliance standards is a must.

## 2. Key Deliverables

The final deliverable is a fully compliant, static / semi-dynamic and responsive corporate website
comprising the following functionality:

- **Core Pages:** Home, Investment Philosophy/Strategy, Team/Leadership Bios, Regulatory
  Disclosures/Disclaimer, Contact Us, Careers.
- **Responsive Design:** A single code / site designer base ensuring optimal layout, navigation and
  multi-device compatibility.
- **Lead Capture System:** Secure contact forms on the "Contact Us" page for qualified investor
  inquiries. Data captured — i.e. Name, Email, Institution, Message — will be sent to a designated
  internal email address. Look into creating an AI chat box that can connect the respective person
  for a query.
- **Compliance Framework:** Integration of a permanent, non-obtrusive compliance banner and
  dedicated, clear disclaimers/T&Cs on all relevant pages.
- **Performance & SEO:** Optimized for search engines and AI LLMs.
- **Security:** Host security and firewall should be set in place.

## 3. Project Boundaries

The following defines what is included in this project:

- **Design/Front-End:** Custom, premium design based on established brand guidelines.
- **Content:** Writing and structuring placeholder text for all core pages, pending final content
  approval by Sponsor and Compliance. (Static and dynamic data integration should be clearly defined
  with time frequency.)
- **Functionality:** Static / semi-dynamic presentation of historical performance metrics as approved
  by Compliance. Secure test form submissions for career applicants and site visitors.
- **Backend/Systems:** Deployment to a secure, high-availability hosting environment (depends on the
  website designer function chosen).
- **Regulatory:** Full review and sign-off by the company's compliance officer is required for launch.

## 4. Success Criteria

The project will be deemed successful when all the following criteria are met:

- **Compliance Approval:** 100% sign-off from the fund's compliance and legal team on all
  public-facing text, disclaimers, and data presentation.
- **Performance:** The website achieves a minimum PageSpeed Insights score of 90+ on mobile and
  desktop devices, i.e. loading speed < 3 seconds. (Add APMI website and SEBI website along with data
  analytics.)
- **Usability:** The site demonstrates zero / negligible scrolling and navigation errors on all major
  device setups, and touch target sizes are adequate for navigation.
- **Lead Capture:** The Contact Us form is fully functional, secure, and reliably delivers formatted
  inquiries to the designated internal team. (Data should be presented in the monthly meeting. Client
  and distributor should both be addressed.)
- **Management & Team Approval:** The project is completed and deployed adhering to management and
  team standards for the design and performance.

---

*— End of client documents —*
