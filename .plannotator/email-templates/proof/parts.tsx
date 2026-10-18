import type { CSSProperties, ReactNode } from "react";
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from "react-email";

/*
 * Proof only (.plannotator/email-templates). The Moneybee email frame and the
 * blocks every email is built from. Colours are the brand palette
 * (memory: moneybee-brand-palette); orange is an accent with ink type on it.
 * Every colour is also set for dark mode in DARK_CSS, which Apple Mail,
 * iOS Mail and Outlook for Mac apply; Gmail inverts on its own.
 */

export const C = { ink: "#272727", inkDeep: "#1C1C1C", accent: "#F6A11A", accentTint: "#FDEFE2", muted: "#5B5D61", hairline: "#E2E3E5", surface: "#F7F7F8", white: "#FFFFFF", grey: "#9EA0A4" } as const;
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Courier New', monospace";

export const ASSET = (path: string) => `img/${path}`;

const DARK_CSS = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
.mb-dark-only { display: none; max-height: 0; overflow: hidden; }
@media (prefers-color-scheme: dark) {
  .mb-body { background-color: ${C.inkDeep} !important; }
  .mb-sheet { background-color: ${C.ink} !important; border-color: #3A3A3A !important; border-top-color: ${C.accent} !important; }
  .mb-text { color: ${C.surface} !important; }
  .mb-muted { color: ${C.grey} !important; }
  .mb-line { border-color: #3A3A3A !important; }
  .mb-box { background-color: ${C.inkDeep} !important; border-color: #3A3A3A !important; }
  .mb-link { color: ${C.accent} !important; }
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
  .mb-num { padding-left: 8px !important; }
  .mb-stack-label { padding-bottom: 0 !important; }
  .mb-stack-chart { padding-left: 16px !important; padding-top: 6px !important; border-top: 0 !important; }
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

const text: CSSProperties = { margin: 0, fontFamily: FONT, color: C.ink, fontSize: 15, lineHeight: "24px" };

export type Audience = "investor" | "applicant" | "staff";

/**
 * The frame: logo with the date and reference set as on a letter, the sheet
 * with an orange rule on top, and the footer that fits who it is for.
 * `unsubscribe` is for optional mailings only; statements and notices have none.
 */
export function MoneybeeEmail({
  preview,
  eyebrow,
  title,
  children,
  audience,
  reason,
  date,
  reference,
  unsubscribe,
  complaintRoute = true,
}: {
  preview: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  audience: Audience;
  reason: string;
  date: string;
  reference?: string;
  unsubscribe?: { label: string; href: string };
  /** False on complaint letters, which set the route out in full above. */
  complaintRoute?: boolean;
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{DARK_CSS}</style>
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
                      <Img className="mb-light-only" src={ASSET("logo.png")} width="150" height="44" alt="Moneybee" style={{ display: "block" }} />
                      <div className="mb-dark-only">
                        <Img src={ASSET("logo-light.png")} width="150" height="44" alt="Moneybee" style={{ display: "block" }} />
                      </div>
                    </td>
                    <td align="right" style={{ verticalAlign: "middle" }}>
                      <Text className="mb-muted" style={{ ...text, fontSize: 12, lineHeight: "18px", color: C.muted, textAlign: "right" }}>
                        {date}
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
                <Text className="mb-muted" style={{ ...text, fontSize: 13, lineHeight: "18px", fontWeight: 600, color: C.muted, marginBottom: 8 }}>
                  {eyebrow}
                </Text>
              ) : null}
              <Text className="mb-text mb-title" style={{ ...text, fontSize: 26, lineHeight: "32px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 16 }}>
                {title}
              </Text>
              {children}
            </Section>
          </Section>
          <Footer audience={audience} reason={reason} unsubscribe={unsubscribe} complaintRoute={complaintRoute} />
        </Container>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
}

/** A paragraph of the message. The words staff edit in /admin land here. */
export function P({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: CSSProperties }) {
  return (
    <Text className={muted ? "mb-muted" : "mb-text"} style={{ ...text, color: muted ? C.muted : C.ink, marginBottom: 16, ...style }}>
      {children}
    </Text>
  );
}

/** A small heading above a block: "What you sent", "What happens next". */
export function Label({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-text" style={{ ...text, fontSize: 15, fontWeight: 700, marginTop: 28, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

export type Fact = { label: string; value: ReactNode; mono?: boolean };

/** Label over value, in rows of one or two, inside a hairline box (after Apple's receipt grid, without its fills). */
export function Facts({ rows }: { rows: Fact[][] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-line" style={{ borderCollapse: "separate", borderSpacing: 0, border: `1px solid ${C.hairline}`, borderRadius: 10, marginBottom: 8 }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                className="mb-cell mb-line"
                colSpan={row.length === 1 ? 2 : 1}
                width={row.length === 2 ? "50%" : undefined}
                style={{ padding: "12px 16px 13px", verticalAlign: "top", borderTop: i ? `1px solid ${C.hairline}` : "0", borderLeft: j ? `1px solid ${C.hairline}` : "0" }}
              >
                <Text className="mb-muted" style={{ ...text, fontSize: 12, lineHeight: "16px", color: C.muted, marginBottom: 3 }}>
                  {cell.label}
                </Text>
                <Text className="mb-text" style={{ ...text, fontSize: 15, lineHeight: "22px", fontWeight: 600, fontFamily: cell.mono ? MONO : FONT, wordBreak: "break-word" }}>
                  {cell.value}
                </Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** What they wrote, quoted under a hairline rule on the left. */
export function Quote({ children }: { children: ReactNode }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 12 }}>
      <tbody>
        <tr>
          <td className="mb-line" style={{ borderLeft: `3px solid ${C.hairline}`, padding: "2px 0 2px 16px" }}>
            <Text className="mb-text" style={{ ...text, whiteSpace: "pre-line" }}>{children}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Numbered steps, the number on an orange disc (ink on orange, 6.6:1). */
export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td width="34" style={{ verticalAlign: "top", paddingBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, color: C.ink, fontFamily: FONT, fontSize: 12, lineHeight: "22px", fontWeight: 700, textAlign: "center", marginTop: 1 }}>{i + 1}</div>
            </td>
            <td style={{ verticalAlign: "top", paddingBottom: 12 }}>
              <Text className="mb-text" style={text}>{item}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Bulleted lines, for the reasons on a staff alert. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td width="20" className="mb-muted" style={{ verticalAlign: "top", fontFamily: FONT, fontSize: 15, lineHeight: "24px", color: C.muted }}>•</td>
            <td style={{ verticalAlign: "top", paddingBottom: 6 }}>
              <Text className="mb-text" style={text}>{item}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The one action, an orange pill with ink type, and its address underneath for clients that strip buttons. */
export function Action({ href, children, showUrl = true }: { href: string; children: ReactNode; showUrl?: boolean }) {
  return (
    <Section style={{ marginTop: 28 }}>
      <table role="presentation" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: C.accent, borderRadius: 999 }}>
              <a href={href} style={{ display: "inline-block", padding: "12px 24px", fontFamily: FONT, fontSize: 15, lineHeight: "20px", fontWeight: 700, color: C.ink, textDecoration: "none", borderRadius: 999 }}>
                {children}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      {showUrl ? (
        <Text className="mb-muted" style={{ ...text, fontSize: 12, lineHeight: "18px", color: C.muted, marginTop: 10, wordBreak: "break-all" }}>
          {href}
        </Text>
      ) : null}
    </Section>
  );
}

/** The sign-in code: big, spaced, in a bordered box so it survives dark mode. */
export function Code({ value }: { value: string }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10, margin: "4px 0 12px" }}>
      <tbody>
        <tr>
          <td align="center" style={{ padding: "22px 16px" }}>
            <Text className="mb-text" style={{ ...text, fontFamily: MONO, fontSize: 34, lineHeight: "40px", fontWeight: 700, letterSpacing: "8px", textAlign: "center" }}>
              {value}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** A pale warm box for the one line that must not be missed. */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.accentTint, border: `1px solid #F7D9B5`, borderRadius: 10, marginTop: 24 }}>
      <tbody>
        <tr>
          <td style={{ padding: "14px 16px" }}>
            <Text className="mb-text" style={{ ...text, fontSize: 14, lineHeight: "22px" }}>{children}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Severity as a word on a tint, the way the admin shows it with a dot. */
export function Severity({ level, children }: { level: "critical" | "high" | "normal" | "low"; children: ReactNode }) {
  const dot = { critical: "#D92D20", high: C.accent, normal: "#2E6FD8", low: C.grey }[level];
  const word = { critical: "Critical", high: "High", normal: "Normal", low: "Low" }[level];
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10, marginBottom: 20 }}>
      <tbody>
        <tr>
          <td style={{ padding: "12px 16px" }}>
            <Text className="mb-text" style={{ ...text, fontSize: 14, lineHeight: "20px" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, backgroundColor: dot, marginRight: 8, verticalAlign: "1px" }} />
              <strong>{word}</strong>
              <span className="mb-muted" style={{ color: C.muted }}>{"  ·  "}</span>
              {children}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** The close of a letter: "Yours sincerely," then who signs and how to reach them. */
export function Signature({ closing = "Yours sincerely,", name, role, lines = [] }: { closing?: string; name: string; role?: string; lines?: string[] }) {
  return (
    <Section style={{ marginTop: 32 }}>
      <Text className="mb-text" style={{ ...text, marginBottom: 14 }}>{closing}</Text>
      <Text className="mb-text" style={{ ...text, fontWeight: 700 }}>{name}</Text>
      {role ? <Text className="mb-muted" style={{ ...text, color: C.muted }}>{role}</Text> : null}
      <Text className="mb-muted" style={{ ...text, color: C.muted }}>Moneybee Securities Pvt Ltd</Text>
      {lines.map((line) => (
        <Text key={line} className="mb-muted" style={{ ...text, color: C.muted }}>{line}</Text>
      ))}
    </Section>
  );
}

export type ReturnRow = { period: string; ours: number | null; benchmark: number | null };
const pct = (value: number | null) => (value === null ? "NA" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)}%`);

/**
 * Returns drawn the way /pms draws them (components/pms-v2/performance-chart.tsx):
 * one row per period, a thin grey benchmark bar with its value above, our bar
 * fading from pale to orange and ending in a white knob with an orange ring,
 * and a negative return running left of the zero line in grey. Table cells
 * stand in for the site's flex layout; Outlook gets solid orange for the fade.
 */
export function ReturnBars({ rows, names }: { rows: ReturnRow[]; names: { ours: string; benchmark: string } }) {
  const values = rows.flatMap((row) => [row.ours ?? 0, row.benchmark ?? 0]);
  const maxPos = Math.max(1, ...values);
  const maxNeg = Math.max(0, ...values.map((value) => -value));
  // The positive side keeps 38% free for the knob and the figure.
  const neg = Math.round((maxNeg / (maxNeg + maxPos / 0.62)) * 100);
  const width = (value: number) => Math.max(2, Math.round((value / maxPos) * 62));
  const micro: CSSProperties = { ...text, fontFamily: MONO, fontSize: 10, lineHeight: "14px", letterSpacing: "0.04em", color: C.muted };
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10 }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.period}>
            <td width="92" className="mb-line mb-stack mb-stack-label" style={{ padding: "14px 0 14px 16px", verticalAlign: "middle", borderTop: i ? `1px solid ${C.hairline}` : "0" }}>
              <Text className="mb-muted" style={{ ...micro, textTransform: "uppercase" }}>{row.period}</Text>
            </td>
            <td className="mb-line mb-stack mb-stack-chart" style={{ padding: "14px 16px 14px 0", verticalAlign: "middle", borderTop: i ? `1px solid ${C.hairline}` : "0" }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    {neg ? <td width={`${neg}%`} /> : null}
                    <td>
                      <Text className="mb-muted" style={{ ...micro, marginBottom: 3 }}>{names.benchmark} {pct(row.benchmark)}</Text>
                      {row.benchmark !== null && row.benchmark > 0 ? <div style={{ width: `${width(row.benchmark)}%`, height: 4, borderRadius: 2, backgroundColor: "#C9CBCE" }} /> : null}
                    </td>
                  </tr>
                  <tr>
                    {neg ? (
                      <td width={`${neg}%`} align="right" style={{ paddingTop: 6 }}>
                        {row.ours !== null && row.ours < 0 ? (
                          <table role="presentation" width={`${Math.round((-row.ours / maxNeg) * 100)}%`} cellPadding={0} cellSpacing={0} style={{ borderLeft: 0 }}>
                            <tbody>
                              <tr>
                                <td width="16"><Knob ring={C.grey} /></td>
                                <td style={{ height: 14, backgroundColor: "#D7D8DA" }} />
                              </tr>
                            </tbody>
                          </table>
                        ) : null}
                      </td>
                    ) : null}
                    <td className="mb-line" style={{ paddingTop: 6, borderLeft: neg ? `1px solid ${C.hairline}` : "0" }}>
                      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            {row.ours !== null && row.ours > 0 ? (
                              <>
                                <td width={`${width(row.ours)}%`} style={{ height: 14, backgroundColor: C.accent, backgroundImage: `linear-gradient(90deg, ${C.accentTint}, ${C.accent})`, borderRadius: "0 7px 7px 0" }} />
                                <td width="16" style={{ paddingLeft: 0 }}><Knob ring={C.accent} /></td>
                              </>
                            ) : null}
                            <td style={{ paddingLeft: 8 }}>
                              <Text className="mb-text" style={{ ...text, fontSize: 17, lineHeight: "20px", fontWeight: 600, whiteSpace: "nowrap", color: row.ours !== null && row.ours < 0 ? C.muted : C.ink }}>{pct(row.ours)}</Text>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Knob({ ring }: { ring: string }) {
  return <div style={{ width: 12, height: 12, borderRadius: 8, backgroundColor: C.white, border: `2px solid ${ring}` }} />;
}

/** Every period as a table, with the difference from the benchmark that SEBI asks for beside it. */
export function ReturnTable({ rows, names }: { rows: ReturnRow[]; names: { ours: string; benchmark: string } }) {
  const head: CSSProperties = { ...text, fontSize: 12, lineHeight: "16px", color: C.muted, fontWeight: 600 };
  const cell: CSSProperties = { padding: "9px 0 9px 12px", borderTop: `1px solid ${C.hairline}`, verticalAlign: "top" };
  const num: CSSProperties = { ...text, fontSize: 14, lineHeight: "20px", textAlign: "right", whiteSpace: "nowrap" };
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 16 }}>
      <tbody>
        <tr>
          <td style={{ padding: "0 12px 8px 0" }}><Text className="mb-muted" style={head}>Period</Text></td>
          <td align="right" className="mb-num" style={{ padding: "0 0 8px 12px" }}><Text className="mb-muted" style={{ ...head, textAlign: "right" }}>{names.ours}</Text></td>
          <td align="right" className="mb-num" style={{ padding: "0 0 8px 12px" }}><Text className="mb-muted" style={{ ...head, textAlign: "right" }}>{names.benchmark}</Text></td>
          <td align="right" className="mb-num" style={{ padding: "0 0 8px 12px" }}><Text className="mb-muted" style={{ ...head, textAlign: "right" }}>Difference (pts)</Text></td>
        </tr>
        {rows.map((row, i) => {
          const gap = row.ours !== null && row.benchmark !== null ? row.ours - row.benchmark : null;
          return (
            <tr key={row.period}>
              <td className="mb-line" style={{ ...cell, paddingLeft: 0 }}><Text className="mb-text" style={{ ...text, fontSize: 14, lineHeight: "20px" }}>{row.period}</Text></td>
              <td className="mb-line mb-num" style={cell}><Text className="mb-text" style={{ ...num, fontWeight: 700 }}>{pct(row.ours)}</Text></td>
              <td className="mb-line mb-num" style={cell}><Text className="mb-text" style={num}>{pct(row.benchmark)}</Text></td>
              <td className="mb-line mb-num" style={cell}><Text className="mb-muted" style={{ ...num, color: C.muted }}>{gap === null ? "NA" : `${gap >= 0 ? "+" : "−"}${Math.abs(gap).toFixed(2)}`}</Text></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Share of the portfolio by sector, as plain horizontal bars on a hairline track. */
export function Weights({ rows }: { rows: { name: string; weight: number }[] }) {
  const max = Math.max(...rows.map((row) => row.weight));
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td width="44%" style={{ padding: "7px 12px 7px 0", verticalAlign: "middle" }}>
              <Text className="mb-text" style={{ ...text, fontSize: 14, lineHeight: "20px" }}>{row.name}</Text>
            </td>
            <td style={{ padding: "7px 0", verticalAlign: "middle" }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td width={`${Math.round((row.weight / max) * 80)}%`} style={{ height: 8, borderRadius: 4, backgroundColor: C.accent }} />
                    <td style={{ paddingLeft: 10 }}>
                      <Text className="mb-text" style={{ ...text, fontSize: 14, lineHeight: "20px", fontWeight: 600, whiteSpace: "nowrap" }}>{row.weight.toFixed(2)}%</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** What is enclosed or linked, one line each, with its format. */
export function Documents({ items }: { items: { name: string; note: string; href?: string }[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-line" style={{ border: `1px solid ${C.hairline}`, borderRadius: 10 }}>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.name}>
            <td width="52" className="mb-line" style={{ padding: "12px 0 12px 16px", borderTop: i ? `1px solid ${C.hairline}` : "0", verticalAlign: "middle" }}>
              <div className="mb-box" style={{ width: 36, height: 22, borderRadius: 4, border: `1px solid ${C.hairline}`, backgroundColor: C.surface, fontFamily: MONO, fontSize: 10, lineHeight: "22px", fontWeight: 700, color: C.muted, textAlign: "center" }}>PDF</div>
            </td>
            <td className="mb-line" style={{ padding: "12px 16px 12px 12px", borderTop: i ? `1px solid ${C.hairline}` : "0", verticalAlign: "middle" }}>
              <Text className="mb-text" style={{ ...text, fontSize: 15, lineHeight: "20px", fontWeight: 600 }}>
                {item.href ? <Link className="mb-text" href={item.href} style={{ color: C.ink, textDecoration: "underline" }}>{item.name}</Link> : item.name}
              </Text>
              <Text className="mb-muted" style={{ ...text, fontSize: 12, lineHeight: "18px", color: C.muted }}>{item.note}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The disclosures that must travel with figures, set small under a hairline, never cut short. */
export function Disclosure({ title = "Important information", paragraphs }: { title?: string; paragraphs: string[] }) {
  return (
    <Section className="mb-line" style={{ marginTop: 32, borderTop: `1px solid ${C.hairline}`, paddingTop: 16 }}>
      <Text className="mb-text" style={{ ...text, fontSize: 12, lineHeight: "18px", fontWeight: 700, marginBottom: 6 }}>{title}</Text>
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} className="mb-muted" style={{ ...text, fontSize: 12, lineHeight: "18px", color: C.muted, marginBottom: 8 }}>{paragraph}</Text>
      ))}
    </Section>
  );
}

const OFFICE = "Moneybee Securities Pvt Ltd, 303, Tower A, Peninsula Business Park, G.K. Marg, Lower Parel, Mumbai 400013";

/** Who sent it, where from, how to reach us, and why this person got it. Investors also get the registrations and the grievance route. */
function Footer({ audience, reason, unsubscribe, complaintRoute }: { audience: Audience; reason: string; unsubscribe?: { label: string; href: string }; complaintRoute: boolean }) {
  const small: CSSProperties = { ...text, fontSize: 12, lineHeight: "18px", color: C.muted, marginBottom: 8 };
  const link: CSSProperties = { color: C.muted, textDecoration: "underline" };
  return (
    <Section style={{ padding: "24px 36px 0" }} className="mb-pad">
      <Text className="mb-muted" style={small}>
        {reason}
        {unsubscribe ? (
          <>
            {" "}
            <Link className="mb-muted" href={unsubscribe.href} style={link}>{unsubscribe.label}</Link>
          </>
        ) : null}
      </Text>
      {audience === "staff" ? null : (
        <Text className="mb-muted" style={small}>
          {OFFICE}. <Link className="mb-muted" href="tel:+912240302080" style={link}>022-4030 2080</Link>, <Link className="mb-muted" href="mailto:info@moneybee.in" style={link}>info@moneybee.in</Link>
        </Text>
      )}
      {audience === "investor" ? (
        <>
          <Text className="mb-muted" style={small}>SEBI registered Portfolio Manager INP000001959. Flyingbee Investment Fund, Category III AIF, IN/AIF3/24-25/1709.</Text>
          {complaintRoute ? (
          <Text className="mb-muted" style={small}>
            A complaint goes to <Link className="mb-muted" href="mailto:grievanceaif@moneybee.in" style={link}>grievanceaif@moneybee.in</Link>. If it is not resolved, you can take it to SEBI through <Link className="mb-muted" href="https://scores.sebi.gov.in" style={link}>SCORES</Link> or to <Link className="mb-muted" href="https://smartodr.in" style={link}>SMART ODR</Link>.
          </Text>
          ) : null}
        </>
      ) : null}
    </Section>
  );
}
