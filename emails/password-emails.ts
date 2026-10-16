import type { PayloadRequest } from "payload";
import { createElement } from "react";
import { shortDateTime } from "./format";
import { renderEmail } from "./render";
import { requestOrigin, siteOf } from "./request";
import { SetPassword } from "./security";

/*
 * The HTML of Payload's forgot-password emails (collections/Investors.ts and
 * Users.ts, auth.forgotPassword.generateEmailHTML). Loaded lazily there, so
 * the Payload config does not pull email rendering into migrations and
 * scripts. Payload sends HTML only for these.
 */

type Args = { req?: PayloadRequest; token?: string; user?: { name?: string } };

export async function investorPasswordEmail({ req, token, user }: Args = {}) {
  // The origin comes from the request that asked for the reset (lib/auth/portal-actions.ts), so the link points at the site the investor is on.
  const origin = (req?.context as { origin?: string } | undefined)?.origin ?? "https://www.moneybee.in";
  const element = createElement(SetPassword, {
    name: user?.name ?? "Investor",
    who: "investor",
    href: `/portal/reset?token=${token}`,
    validFor: "30 minutes",
    requestedAt: shortDateTime(new Date()),
    ...(req?.headers ? requestOrigin(req.headers) : {}),
  });
  return (await renderEmail(element, origin)).html;
}

export async function staffPasswordEmail({ req, token, user }: Args = {}) {
  const origin = req?.headers ? siteOf(req.headers) : undefined;
  const element = createElement(SetPassword, {
    name: user?.name ?? "Moneybee staff",
    who: "staff",
    href: `/admin/reset/${token}`,
    validFor: "1 hour",
    requestedAt: shortDateTime(new Date()),
    ...(req?.headers ? requestOrigin(req.headers) : {}),
  });
  return (await renderEmail(element, origin)).html;
}
