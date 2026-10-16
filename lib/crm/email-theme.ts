import type { EditorThemeInput } from "@react-email/editor/plugins";

/*
 * Moneybee's look for the words built in the template editor, in the React
 * Email editor's own theme format, matching the blocks in emails/ so the
 * canvas and the sent email agree.
 * Brand palette (memory: moneybee-brand-palette): ink #272727 on white,
 * orange #F6A11A only as an accent with ink type on it (white on orange
 * fails contrast), muted copy #5B5D61, hairlines #E2E3E5.
 */
export const MONEYBEE_EMAIL_THEME: EditorThemeInput = {
  extends: "basic",
  styles: {
    // Transparent and unpadded: a design goes out as the body of the Moneybee frame (emails/render.ts editorBody), which draws the sheet.
    body: { backgroundColor: "transparent", color: "#272727" },
    container: { backgroundColor: "transparent", borderRadius: 0, padding: "0" },
    h1: { color: "#272727", fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: "1.2" },
    h2: { color: "#272727", fontSize: 20, fontWeight: 700, lineHeight: "1.3" },
    h3: { color: "#272727", fontSize: 16, fontWeight: 700 },
    paragraph: { color: "#272727", fontSize: 15, lineHeight: "1.6" },
    link: { color: "#B5650F", textDecoration: "underline" },
    button: { backgroundColor: "#F6A11A", color: "#272727", borderRadius: 999, fontSize: 15, fontWeight: 600, padding: "12px 24px" },
    listItem: { color: "#272727", fontSize: 15, lineHeight: "1.6" },
  },
};
