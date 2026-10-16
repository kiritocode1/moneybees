import type { CSSProperties, ReactNode } from "react";
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from "react-email";
import { DEFAULT_DETAILS, type SiteDetails, telHref } from "@/lib/site/details";

/*
 * The frame every Moneybee email is drawn in (plan: .plannotator/email-templates):
 * the logo with the date and reference set as on a letter, a white sheet with
 * an orange rule on top, and a footer that fits who the email is for.
 * Colours are the brand palette; orange is an accent with ink type on it,
 * never white on orange. Every colour is restated for dark mode in FRAME_CSS,
 * which Apple Mail, iOS Mail and Outlook for Mac apply; Gmail inverts on its
 * own, so every box also has a border. Links and images are written from the
 * site root ("/portal") and emails/render.ts makes them absolute.
 */

export const C = { ink: "#272727", inkDeep: "#1C1C1C", accent: "#F6A11A", accentTint: "#FDEFE2", muted: "#5B5D61", hairline: "#E2E3E5", surface: "#F7F7F8", white: "#FFFFFF", grey: "#9EA0A4" } as const;
export const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Courier New', monospace";
export const TEXT: CSSProperties = { margin: 0, fontFamily: FONT, color: C.ink, fontSize: 15, lineHeight: "24px" };

const FRAME_CSS = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
.mb-dark-only { display: none; max-height: 0; overflow: hidden; }
@media (prefers-color-scheme: dark) {
  .mb-body { background-color: ${C.inkDeep} !important; }
  .mb-sheet { background-color: ${C.ink} !important; border-color: #3A3A3A !important; border-top-color: ${C.accent} !important; }
  .mb-text { color: ${C.surface} !important; }
  .mb-muted { color: ${C.grey} !important; }
  .mb-line { border-color: #3A3A3A !important; }
  .mb-box { background-color: ${C.inkDeep} !important; border-color: #3A3A3A !important; }
  .mb-light-only { display: none !important; }
  .mb-dark-only { display: block !important; max-height: none !important; }
}
@media (max-width: 520px) {
  /* Section puts its padding on the cell inside it; the class stays on the table. */
  .mb-pad > tbody > tr > td { padding-left: 20px !important; padding-right: 20px !important; }
  .mb-cell { display: block !important; width: auto !important; border-left: 0 !important; }
  .mb-cell + .mb-cell { border-top: 1px solid ${C.hairline} !important; }
  .mb-title { font-size: 22px !important; }
  /* Return rows: the period label goes above its bars, so the bars get the full width. */
  .mb-stack { display: block !important; width: auto !important; }
  .mb-stack-label { padding-bottom: 0 !important; }
  .mb-stack-chart { padding-left: 16px !important; padding-top: 6px !important; border-top: 0 !important; }
  .mb-num { padding-left: 8px !important; }
}
@media (max-width: 360px) {
  .mb-gutter { padding-left: 6px !important; padding-right: 6px !important; }
  .mb-pad > tbody > tr > td { padding-left: 16px !important; padding-right: 16px !important; }
  .mb-num { padding-left: 6px !important; }
  .mb-num p { font-size: 13px !important; }
}
@media (prefers-color-scheme: dark) and (max-width: 520px) {
  .mb-cell + .mb-cell { border-top-color: #3A3A3A !important; }
}`;

/** Who reads it decides the footer: investors and prospects get the registrations and the complaint route. */
export type Audience = "investor" | "applicant" | "staff";

/** "16 October 2026", the date at the top of every email, in IST. */
export const letterDate = (value: Date | string = new Date()) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export type FrameProps = {
  /** The line inbox apps show after the subject. */
  preview: string;
  /** A small line above the title naming the email: "PMS enquiry". */
  eyebrow?: string;
  title: string;
  audience: Audience;
  /** Why this person got it, first line of the footer. */
  reason: string;
  reference?: string;
  /** Defaults to today. */
  date?: string;
  /** Optional mailings only; statements and notices have none. */
  unsubscribe?: { label: string; href: string };
  /** False on complaint letters, which set the route out in full. */
  complaintRoute?: boolean;
  /** Office details from /admin; the code's defaults until they are saved. */
  site?: SiteDetails;
  children: ReactNode;
};

export function MoneybeeEmail({ preview, eyebrow, title, audience, reason, reference, date, unsubscribe, complaintRoute = true, site = DEFAULT_DETAILS, children }: FrameProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{FRAME_CSS}</style>
      </Head>
      <Preview>{preview}</Preview>
      {/* React Email copies the Body's background onto a table cell it adds for Gmail, out of reach of a class, so the page colour lives on our own table. */}
      <Body style={{ margin: 0, padding: 0, backgroundColor: C.surface, fontFamily: FONT }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-body" style={{ backgroundColor: C.surface }}>
          <tbody>
            <tr>
              {/* The side gutter sits here: Container is 100% wide, and padding on it would push past a phone's width. */}
              <td className="mb-gutter" style={{ padding: "0 12px" }}>
                <Container style={{ maxWidth: 600, width: "100%", margin: "0 auto", padding: "32px 0 40px" }}>
                  <Section className="mb-sheet" style={{ backgroundColor: C.white, border: `1px solid ${C.hairline}`, borderRadius: 14, borderTop: `3px solid ${C.accent}` }}>
                    <Section className="mb-pad" style={{ padding: "26px 36px 0" }}>
                      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td style={{ verticalAlign: "middle" }}>
                              <Img className="mb-light-only" src="/email/logo.png" width="150" height="44" alt="Moneybee" style={{ display: "block" }} />
                              <div className="mb-dark-only">
                                <Img src="/email/logo-light.png" width="150" height="44" alt="Moneybee" style={{ display: "block" }} />
                              </div>
                            </td>
                            <td align="right" style={{ verticalAlign: "middle" }}>
                              <Text className="mb-muted" style={{ ...TEXT, fontSize: 12, lineHeight: "18px", color: C.muted, textAlign: "right" }}>
                                {date ?? letterDate()}
                                {reference ? (
                                  <>
                                    <br />
                                    Ref. <span style={{ fontFamily: MONO }}>{reference}</span>
                                  </>
                                ) : null}
                              </Text>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Section>
                    <Section className="mb-pad" style={{ padding: "30px 36px 36px" }}>
                      {eyebrow ? (
                        <Text className="mb-muted" style={{ ...TEXT, fontSize: 13, lineHeight: "18px", fontWeight: 600, color: C.muted, marginBottom: 8 }}>
                          {eyebrow}
                        </Text>
                      ) : null}
                      <Text className="mb-text mb-title" style={{ ...TEXT, fontSize: 26, lineHeight: "32px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 16 }}>
                        {title}
                      </Text>
                      {children}
                    </Section>
                  </Section>
                  <Footer audience={audience} reason={reason} unsubscribe={unsubscribe} complaintRoute={complaintRoute} site={site} />
                </Container>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
}

/** The grievance address from Office details' desks, else the main address. */
export const grievanceEmail = (site: SiteDetails) => site.desks.find((desk) => /grievance/i.test(desk.label))?.email ?? site.email;

/** Who sent it, where from, how to reach us, and why this person got it. Investors also get the registrations and the complaint route. */
function Footer({ audience, reason, unsubscribe, complaintRoute, site }: { audience: Audience; reason: string; unsubscribe?: { label: string; href: string }; complaintRoute: boolean; site: SiteDetails }) {
  const small: CSSProperties = { ...TEXT, fontSize: 12, lineHeight: "18px", color: C.muted, marginBottom: 8 };
  const link: CSSProperties = { color: C.muted, textDecoration: "underline" };
  const phone = site.phones[0]?.number;
  const grievance = grievanceEmail(site);
  return (
    <Section style={{ padding: "24px 36px 0" }} className="mb-pad">
      <Text className="mb-muted" style={small}>
        {reason}
        {unsubscribe ? (
          <>
            {" "}
            <Link className="mb-muted" href={unsubscribe.href} style={link}>
              {unsubscribe.label}
            </Link>
          </>
        ) : null}
      </Text>
      {audience === "staff" ? null : (
        <Text className="mb-muted" style={small}>
          {site.company}, {site.address.line1} {site.address.line2}.{" "}
          {phone ? (
            <>
              <Link className="mb-muted" href={telHref(phone)} style={link}>
                {phone}
              </Link>
              ,{" "}
            </>
          ) : null}
          <Link className="mb-muted" href={`mailto:${site.email}`} style={link}>
            {site.email}
          </Link>
        </Text>
      )}
      {audience === "investor" ? (
        <>
          <Text className="mb-muted" style={small}>
            {site.registrations.map((registration) => `${registration.business}: SEBI registration ${registration.number}.`).join(" ")}
          </Text>
          {complaintRoute ? (
            <Text className="mb-muted" style={small}>
              A complaint goes to{" "}
              <Link className="mb-muted" href={`mailto:${grievance}`} style={link}>
                {grievance}
              </Link>
              . If it is not resolved, you can take it to SEBI through{" "}
              <Link className="mb-muted" href="https://scores.sebi.gov.in" style={link}>
                SCORES
              </Link>{" "}
              or to{" "}
              <Link className="mb-muted" href="https://smartodr.in" style={link}>
                SMART ODR
              </Link>
              .
            </Text>
          ) : null}
        </>
      ) : null}
    </Section>
  );
}
