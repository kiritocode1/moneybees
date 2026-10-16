import type { ReactElement } from "react";
import { toPlainText } from "@react-email/render";
import { render } from "react-email";

/*
 * Turns an email component into what Resend sends. Emails write links and
 * images from the site root ("/portal", "/email/logo.png"); here they become
 * absolute against the site that sent them, since an inbox has no base URL.
 */

/** The request's own origin when there is one; otherwise SITE_URL, the Vercel production address, or moneybee.in. */
export function siteOrigin(origin?: string) {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (origin ?? process.env.SITE_URL ?? (vercel ? `https://${vercel}` : "https://www.moneybee.in")).replace(/\/$/, "");
}

export type RenderedEmail = { html: string; text: string };

export async function renderEmail(email: ReactElement, origin?: string): Promise<RenderedEmail> {
  const base = siteOrigin(origin);
  const html = (await render(email))
    .replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`)
    // A link written out as text, under a button (emails/blocks.tsx Action).
    .replace(/(data-absolute-text="true">)\/(?!\/)/g, `$1${base}/`);
  // The plain text comes from the finished HTML, so its links are absolute too.
  return { html, text: toPlainText(html) };
}

/**
 * The body of words designed in the earlier block editor (@react-email/editor,
 * since removed), without that editor's own document around it, so a design
 * saved before the Emails page still sits inside the Moneybee frame. Saving
 * on the Emails page replaces it with plain words.
 */
export function editorBody(html: string) {
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  // The editor's preview line, which our frame already writes.
  return body.replace(/<div[^>]*data-skip-in-text="true"[^>]*>[\s\S]*?<\/div>\s*<\/div>/i, "").trim();
}
