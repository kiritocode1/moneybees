import type { CSSProperties, ReactNode } from "react";
import { Link, Section, Text } from "react-email";
import { C, FONT, MONO, TEXT } from "./frame";
import { editorBody } from "./render";

/*
 * The blocks emails are built from. Facts are label over value (after Apple's
 * receipt grid, without its pale fills, which vanish in dark mode); returns
 * follow the /pms chart (components/pms-v2/performance-chart.tsx). Anything
 * that only repeats a table in pictures carries data-skip-in-text, so the
 * plain-text version reads cleanly.
 */

/** A paragraph. */
export function P({ children, muted, small, style }: { children: ReactNode; muted?: boolean; small?: boolean; style?: CSSProperties }) {
  const size = small ? { fontSize: 12, lineHeight: "18px" } : {};
  return (
    <Text className={muted ? "mb-muted" : "mb-text"} style={{ ...TEXT, ...size, color: muted ? C.muted : C.ink, marginBottom: 16, ...style }}>
      {children}
    </Text>
  );
}

/** The words of a template or a message, already filled in. `html` is a design from the template editor. */
export type WordsValue = { text: string; html?: string | null };

/**
 * The words staff write or edit in /admin. A design from the template editor
 * goes in as its body (emails/render.ts editorBody); plain text becomes
 * paragraphs, a blank line starting a new one.
 */
export function Words({ text, html }: WordsValue) {
  if (html) return <div className="mb-words" dangerouslySetInnerHTML={{ __html: editorBody(html) }} />;
  const paragraphs = text.trim().split(/\n{2,}/).filter(Boolean);
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <P key={i}>
          {paragraph.split("\n").map((line, j) => (
            <span key={j}>
              {j ? <br /> : null}
              {line}
            </span>
          ))}
        </P>
      ))}
    </>
  );
}

/** "Dear Rohan Mehta," */
export const Salutation = ({ name }: { name: string }) => <P>Dear {name},</P>;

/** A small heading above a block: "Details you provided", "What happens next". */
export function Label({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-text" style={{ ...TEXT, fontSize: 15, fontWeight: 700, marginTop: 28, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

export type Fact = { label: string; value: ReactNode; mono?: boolean };

/** Label over value, in rows of one or two, inside a hairline box. On a phone the pairs stack. */
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
                <Text style={{ ...TEXT, wordBreak: "break-word" }}>
                  <span className="mb-muted" style={{ fontSize: 12, lineHeight: "16px", color: C.muted }}>
                    {cell.label}
                  </span>
                  <br />
                  <span className="mb-text" style={{ fontSize: 15, lineHeight: "22px", fontWeight: 600, color: C.ink, fontFamily: cell.mono ? MONO : FONT }}>
                    {cell.value}
                  </span>
                </Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** What someone wrote, quoted under a rule on the left. */
export function Quote({ children }: { children: ReactNode }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 12 }}>
      <tbody>
        <tr>
          <td className="mb-line" style={{ borderLeft: `3px solid ${C.hairline}`, padding: "2px 0 2px 16px" }}>
            <Text className="mb-text" style={{ ...TEXT, whiteSpace: "pre-line" }}>
              {children}
            </Text>
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
              <div data-skip-in-text="true" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, color: C.ink, fontFamily: FONT, fontSize: 12, lineHeight: "22px", fontWeight: 700, textAlign: "center", marginTop: 1 }}>
                {i + 1}
              </div>
            </td>
            <td style={{ verticalAlign: "top", paddingBottom: 12 }}>
              <Text className="mb-text" style={TEXT}>
                {/* The number again, hidden, so the plain-text version reads "1. ..." on one line. */}
                <span style={{ display: "none", fontSize: 0, lineHeight: 0, maxHeight: 0, overflow: "hidden", msoHide: "all" } as CSSProperties}>{`${i + 1}. `}</span>
                {item}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Bulleted lines. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td width="20" className="mb-muted" style={{ verticalAlign: "top", fontFamily: FONT, fontSize: 15, lineHeight: "24px", color: C.muted }}>
              •
            </td>
            <td style={{ verticalAlign: "top", paddingBottom: 6 }}>
              <Text className="mb-text" style={TEXT}>
                {item}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The one action, an orange pill with ink type, and its address underneath for clients that strip buttons. */
export function Action({ href, children }: { href: string; children: ReactNode }) {
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
      <Text data-skip-in-text="true" className="mb-muted" style={{ ...TEXT, fontSize: 12, lineHeight: "18px", color: C.muted, marginTop: 10, wordBreak: "break-all" }}>
        <span data-absolute-text="true">{href}</span>
      </Text>
    </Section>
  );
}

/** An inline link in the body copy. */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="mb-text" href={href} style={{ color: C.ink, fontWeight: 700, textDecoration: "underline" }}>
      {children}
    </Link>
  );
}

/** A sign-in code: big, spaced, in a bordered box so it survives dark mode (after emailcn's OTP block). */
export function Code({ value }: { value: string }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10, margin: "4px 0 12px" }}>
      <tbody>
        <tr>
          <td align="center" style={{ padding: "22px 16px" }}>
            <Text className="mb-text" style={{ ...TEXT, fontFamily: MONO, fontSize: 34, lineHeight: "40px", fontWeight: 700, letterSpacing: "8px", textAlign: "center" }}>
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
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.accentTint, border: "1px solid #F7D9B5", borderRadius: 10, marginTop: 24 }}>
      <tbody>
        <tr>
          <td style={{ padding: "14px 16px" }}>
            <Text className="mb-text" style={{ ...TEXT, fontSize: 14, lineHeight: "22px" }}>
              {children}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export type SeverityLevel = "critical" | "high" | "normal" | "low";
const SEVERITY = { critical: ["#D92D20", "Critical"], high: [C.accent, "High"], normal: ["#2E6FD8", "Normal"], low: [C.grey, "Low"] } as const;

/** Severity as a word with the admin's dot colour (components/admin/severity-badge.tsx). */
export function Severity({ level, children }: { level: SeverityLevel; children: ReactNode }) {
  const [dot, word] = SEVERITY[level];
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10, marginBottom: 20 }}>
      <tbody>
        <tr>
          <td style={{ padding: "12px 16px" }}>
            <Text className="mb-text" style={{ ...TEXT, fontSize: 14, lineHeight: "20px" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, backgroundColor: dot, marginRight: 8, verticalAlign: "1px" }} />
              <strong>{word}</strong>
              <span className="mb-muted" style={{ color: C.muted }}>
                {"  ·  "}
              </span>
              {children}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** The close of a letter: "Yours sincerely," then who signs and how to reach them. */
export function Signature({ closing = "Yours sincerely,", name, role, company = "Moneybee Securities Pvt Ltd", lines = [] }: { closing?: string; name: string; role?: string; company?: string; lines?: string[] }) {
  return (
    <Section style={{ marginTop: 32 }}>
      <Text className="mb-text" style={{ ...TEXT, marginBottom: 14 }}>
        {closing}
      </Text>
      <Text className="mb-text" style={{ ...TEXT, fontWeight: 700 }}>
        {name}
      </Text>
      {role ? (
        <Text className="mb-muted" style={{ ...TEXT, color: C.muted }}>
          {role}
        </Text>
      ) : null}
      <Text className="mb-muted" style={{ ...TEXT, color: C.muted }}>
        {company}
      </Text>
      {lines.map((line) => (
        <Text key={line} className="mb-muted" style={{ ...TEXT, color: C.muted }}>
          {line}
        </Text>
      ))}
    </Section>
  );
}

export type ReturnRow = { period: string; ours: number | null; benchmark: number | null };
export type ReturnNames = { ours: string; benchmark: string };
const MINUS = "−";
/** A figure in a sentence: a true minus for a loss, no sign for a gain. */
export const signedNumber = (value: number | null | undefined) => (value === null || value === undefined ? "NA" : `${value < 0 ? MINUS : ""}${Math.abs(value).toFixed(2)}`);
export const signedPct = (value: number | null) => (value === null ? "NA" : `${value > 0 ? "+" : value < 0 ? MINUS : ""}${Math.abs(value).toFixed(2)}%`);

function Knob({ ring }: { ring: string }) {
  return <div style={{ width: 12, height: 12, borderRadius: 8, backgroundColor: C.white, border: `2px solid ${ring}` }} />;
}

/**
 * Returns the way /pms draws them: a row per period, a thin grey benchmark bar
 * with its value above, our bar fading from pale to orange and ending in a
 * white knob with an orange ring, a negative return running left of the zero
 * line in grey. Table cells stand in for the site's flex layout; Outlook gets
 * solid orange for the fade. Skipped in plain text, where ReturnTable carries the figures.
 */
export function ReturnBars({ rows, names }: { rows: ReturnRow[]; names: ReturnNames }) {
  const values = rows.flatMap((row) => [row.ours ?? 0, row.benchmark ?? 0]);
  const maxPos = Math.max(1, ...values);
  const maxNeg = Math.max(0, ...values.map((value) => -value));
  // The positive side keeps 38% free for the knob and the figure.
  const neg = Math.round((maxNeg / (maxNeg + maxPos / 0.62)) * 100);
  const width = (value: number) => Math.max(2, Math.round((value / maxPos) * 62));
  const micro: CSSProperties = { ...TEXT, fontFamily: MONO, fontSize: 10, lineHeight: "14px", letterSpacing: "0.04em", color: C.muted };
  return (
    <table data-skip-in-text="true" role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-box" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 10 }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.period}>
            <td width="92" className="mb-line mb-stack mb-stack-label" style={{ padding: "14px 0 14px 16px", verticalAlign: "middle", borderTop: i ? `1px solid ${C.hairline}` : "0" }}>
              <Text className="mb-muted" style={{ ...micro, textTransform: "uppercase" }}>
                {row.period}
              </Text>
            </td>
            <td className="mb-line mb-stack mb-stack-chart" style={{ padding: "14px 16px 14px 0", verticalAlign: "middle", borderTop: i ? `1px solid ${C.hairline}` : "0" }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    {neg ? <td width={`${neg}%`} /> : null}
                    <td>
                      <Text className="mb-muted" style={{ ...micro, marginBottom: 3 }}>
                        {names.benchmark} {signedPct(row.benchmark)}
                      </Text>
                      {row.benchmark !== null && row.benchmark > 0 ? <div style={{ width: `${width(row.benchmark)}%`, height: 4, borderRadius: 2, backgroundColor: "#C9CBCE" }} /> : null}
                    </td>
                  </tr>
                  <tr>
                    {neg ? (
                      <td width={`${neg}%`} align="right" style={{ paddingTop: 6 }}>
                        {row.ours !== null && row.ours < 0 ? (
                          <table role="presentation" width={`${Math.round((-row.ours / maxNeg) * 100)}%`} cellPadding={0} cellSpacing={0}>
                            <tbody>
                              <tr>
                                <td width="16">
                                  <Knob ring={C.grey} />
                                </td>
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
                                <td width="16">
                                  <Knob ring={C.accent} />
                                </td>
                              </>
                            ) : null}
                            <td style={{ paddingLeft: 8 }}>
                              <Text className="mb-text" style={{ ...TEXT, fontSize: 17, lineHeight: "20px", fontWeight: 600, whiteSpace: "nowrap", color: row.ours !== null && row.ours < 0 ? C.muted : C.ink }}>
                                {signedPct(row.ours)}
                              </Text>
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

/** Every period as a table, with the difference from the benchmark SEBI asks for (PMS Master Circular 5.6.4). */
export function ReturnTable({ rows, names }: { rows: ReturnRow[]; names: ReturnNames }) {
  const head: CSSProperties = { ...TEXT, fontSize: 12, lineHeight: "16px", color: C.muted, fontWeight: 600 };
  const cell: CSSProperties = { padding: "9px 0 9px 12px", borderTop: `1px solid ${C.hairline}`, verticalAlign: "top" };
  const num: CSSProperties = { ...TEXT, fontSize: 14, lineHeight: "20px", textAlign: "right", whiteSpace: "nowrap" };
  const gapOf = (row: ReturnRow) => (row.ours !== null && row.benchmark !== null ? row.ours - row.benchmark : null);
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 16 }}>
      <tbody>
        <tr>
          <td style={{ padding: "0 12px 8px 0" }}>
            <Text className="mb-muted" style={head}>
              Period
            </Text>
          </td>
          {[names.ours, names.benchmark, "Difference (pts)"].map((label) => (
            <td key={label} align="right" className="mb-num" style={{ padding: "0 0 8px 12px" }}>
              <Text className="mb-muted" style={{ ...head, textAlign: "right" }}>
                {label}
              </Text>
            </td>
          ))}
        </tr>
        {rows.map((row) => {
          const gap = gapOf(row);
          return (
            <tr key={row.period}>
              <td className="mb-line" style={{ ...cell, paddingLeft: 0 }}>
                <Text className="mb-text" style={{ ...TEXT, fontSize: 14, lineHeight: "20px" }}>
                  {row.period}
                </Text>
              </td>
              <td className="mb-line mb-num" style={cell}>
                <Text className="mb-text" style={{ ...num, fontWeight: 700 }}>
                  {signedPct(row.ours)}
                </Text>
              </td>
              <td className="mb-line mb-num" style={cell}>
                <Text className="mb-text" style={num}>
                  {signedPct(row.benchmark)}
                </Text>
              </td>
              <td className="mb-line mb-num" style={cell}>
                <Text className="mb-muted" style={{ ...num, color: C.muted }}>
                  {gap === null ? "NA" : `${gap >= 0 ? "+" : MINUS}${Math.abs(gap).toFixed(2)}`}
                </Text>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Share of the portfolio by sector, as plain horizontal bars. */
export function Weights({ rows }: { rows: { name: string; weight: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.weight));
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td width="44%" style={{ padding: "7px 12px 7px 0", verticalAlign: "middle" }}>
              <Text className="mb-text" style={{ ...TEXT, fontSize: 14, lineHeight: "20px" }}>
                {row.name}
              </Text>
            </td>
            <td style={{ padding: "7px 0", verticalAlign: "middle" }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td data-skip-in-text="true" width={`${Math.round((row.weight / max) * 80)}%`} style={{ height: 8, borderRadius: 4, backgroundColor: C.accent }} />
                    <td style={{ paddingLeft: 10 }}>
                      <Text className="mb-text" style={{ ...TEXT, fontSize: 14, lineHeight: "20px", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {row.weight.toFixed(2)}%
                      </Text>
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

export type DocumentItem = { name: string; note: string; href?: string; kind?: string };

/** What is enclosed or linked, one line each, with its format. */
export function Documents({ items }: { items: DocumentItem[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} className="mb-line" style={{ border: `1px solid ${C.hairline}`, borderRadius: 10 }}>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.name}>
            <td width="52" className="mb-line" style={{ padding: "12px 0 12px 16px", borderTop: i ? `1px solid ${C.hairline}` : "0", verticalAlign: "middle" }}>
              <div data-skip-in-text="true" className="mb-box" style={{ width: 36, height: 22, borderRadius: 4, border: `1px solid ${C.hairline}`, backgroundColor: C.surface, fontFamily: MONO, fontSize: 10, lineHeight: "22px", fontWeight: 700, color: C.muted, textAlign: "center" }}>
                {item.kind ?? "PDF"}
              </div>
            </td>
            <td className="mb-line" style={{ padding: "12px 16px 12px 12px", borderTop: i ? `1px solid ${C.hairline}` : "0", verticalAlign: "middle" }}>
              <Text style={{ ...TEXT, fontSize: 15, lineHeight: "20px", fontWeight: 600 }}>
                {item.href ? (
                  <Link className="mb-text" href={item.href} style={{ color: C.ink, textDecoration: "underline" }}>
                    {item.name}
                  </Link>
                ) : (
                  <span className="mb-text">{item.name}</span>
                )}
              </Text>
              <Text className="mb-muted" style={{ ...TEXT, fontSize: 12, lineHeight: "18px", color: C.muted }}>
                {item.note}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The disclosures that must travel with figures, set small under a rule, never shortened. */
export function Disclosure({ title = "Important information", paragraphs }: { title?: string; paragraphs: readonly string[] }) {
  return (
    <Section className="mb-line" style={{ marginTop: 32, borderTop: `1px solid ${C.hairline}`, paddingTop: 16 }}>
      <Text className="mb-text" style={{ ...TEXT, fontSize: 12, lineHeight: "18px", fontWeight: 700, marginBottom: 6 }}>
        {title}
      </Text>
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} className="mb-muted" style={{ ...TEXT, fontSize: 12, lineHeight: "18px", color: C.muted, marginBottom: 8 }}>
          {paragraph}
        </Text>
      ))}
    </Section>
  );
}
