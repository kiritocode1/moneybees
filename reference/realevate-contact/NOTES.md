# Realevate /contact (https://realevate.agency/contact)

Pinned: contact.html (SSR shell), style.min.css (178 KB compiled), realevate-app.js (285 KB).
Screenshots: rv-1440.png (1440x900, page is exactly 900 tall, no scroll), rv-390.png (390 wide, 1201 tall).
Stack: custom site, not Webflow (window.Webflow absent, so no ix2 data). GSAP, ScrollTrigger and SplitText load from /js. Font "Google Sans" 500, navy #1F2B5E (--brand-navy), muted #626C95 (--muted), white background.

## Mechanism (one sentence)
A one-screen three-column page: a giant "Contact" marquee (GSAP tween on .marquee-scroll x, about 111 px/s, 218px type) cropped along the left edge, a middle stack of "Let's talk." plus Office / WhatsApp / Phone, and a tabbed, underline-only form on the right.

## Measured (1440x900)
- Nav: About x61, logo centered (x584-857, y64), Contact x1316. 17px / 500.
- Marquee: .marquee-text 218.3px, line-height 218.3px, letter-spacing -4.37px, color navy, rows spaced 862px. It reads "Co / ntact" in the left 360px in the screenshot. x moved -15.7 to -237.7 in 2 s.
- Middle column x=570, width 303. "Let's talk." 23.7px/30.8, w400, y499. Three label/value pairs at y598, 683, 769 (85px pitch). Label 15.9px w500 navy, value 13.5px w400 muted. Email is a button that copies to the clipboard and shows an "Email Copied" chip (navy bg, white 13.5px, padding 2.7px 7.4px, opacity .2s).
- Right column x=963, width 416. Tabs (Investors / Partnership): 208x44 each, 15.9px w500, 1px rgba(31,43,94,.18) bottom rule, 2px navy underline that scales scaleX 0 to 1 from center in .5s cubic-bezier(.7,.6,0,1). Text color transition .25s, same curve. Active navy, inactive muted, hover navy.
- Fields: transparent, border-bottom only (1px rgba(31,43,94,.25)), radius 0, text 13.5px, padding 14.7px 0, row pitch 55-56px. Phone/Country and the selects sit two per row (200px each, 15px gap). Placeholder (muted) acts as the label, real labels are visually hidden. Required fields end in *. Focus sets border-bottom-color to navy, transition border-color .3s. No ring.
- Textarea 415x87, no resize. Checkbox 15px, accent navy. Consent text 11.7px muted with underlined links.
- Send button: 100x44, navy fill, white 15px, radius 0. Hover sets background-position 0 0 and navy text (a sliding fill).
- Curves in CSS: (.7,.6,0,1) for UI state, (.16,1,.3,1) and (.15,.32,.2,.99) elsewhere. Durations .2 to .5 s.
- No map, no street address. The only CTA is Send.
- Mobile 390: marquee becomes one horizontal line under the logo, "Let's talk." and the contact stack sit side by side in two columns, then full-width tabs and single-column fields (47px pitch), 40px side padding.

## Moneybee today (app/contact/page.tsx, components/contact-v2/contact-sections.tsx 299 lines, lib/contact-v2.ts 127 lines)
ContactHero (h1 "Let's Start a Conversation", Get Started, phone/email list), OfficeSection (black band, address, OSM iframe with orange marker), EnquirySection (four option cards with glyphs, per-option fields, mailto submit), LetsTalkSection. lib/contact-v2.ts already holds every required string, the four options and the map embed.

## Moneybee mapping (what changes)
Keep: copy, map, four options, mailto submit.
1. Hero: desktop three-column screen. Left: giant word (Moneybee type) in a slow GSAP marquee, about 110 px/s, static under prefers-reduced-motion. Middle: address, phone, email stack with a copy-email chip. Right: the form. The h1 "Let's Start a Conversation" stays as the real heading (Realevate hides its h1 visually).
2. Replace the four radio cards with four tabs (PMS, AIF, Investor Support, General). 2px orange #F6A11A underline, scaleX from center, .5s cubic-bezier(.7,.6,0,1). Inactive text grey #9D9EA1.
3. Underline-only fields: 1px bottom border rgba(0,0,0,.25), focus border turns black (orange also fine), .3s. Keep visible or sr-only labels, not placeholder-only.
4. Get Started as Send: orange #F6A11A solid, black text, 44px, radius 0, hover slides a black fill in and text goes white.
5. Map: Realevate has none. Keep the existing black OfficeSection below the first screen. Address block plus map will not fit one 900px screen.
Do not copy: navy palette, Google Sans, Partnership/Investors tab pair, country and budget selects (use the lakh/crore bands already in lib/contact-v2.ts).
