import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import config from "@payload-config";
import { headers } from "next/headers";
import { APIError, AuthenticationError, getPayload, LockedAuth } from "payload";

/*
 * Investor sign-in for /portal (plan §4). The email and password go through
 * Payload, which counts failures and locks the account after five. Then a
 * six-digit code goes to the account's email, unless this browser passed a
 * code in the last 30 days. Payload has no second step of its own, so the
 * session token from the password check is held, encrypted, until the code
 * matches. Server actions and /api/v1 both call these functions.
 */

/** Payload's session cookie (default cookiePrefix "payload"); payload.auth reads it. */
export const SESSION_COOKIE = "payload-token";
/** Marks a browser that has passed a code. Only its hash is stored. */
export const DEVICE_COOKIE = "mb-device";

const CODE_TTL_MS = 10 * 60_000;
const CODE_ATTEMPTS = 5;
const TRUST_MS = 30 * 24 * 60 * 60_000;
const TRUSTED_DEVICES_KEPT = 5;

type Failure = { kind: "error"; message: string };

/**
 * Until the database is connected on a deployment (Neon while building,
 * PlanetScale Mumbai at go-live), sign-in answers with this instead of
 * failing, and nobody counts as signed in.
 */
const hasDatabase = () => Boolean(process.env.DATABASE_URL);
const NOT_YET: Failure = { kind: "error", message: "Client sign-in is being set up. Until it opens, write to info@moneybee.in for your statements." };

export type Session = { token: string; expires: Date };
export type StartResult = { kind: "signed-in"; session: Session } | { kind: "code-sent"; challengeId: string; sentTo: string } | Failure;
export type VerifyResult = { kind: "signed-in"; session: Session; deviceToken: string } | Failure;

const secret = () => {
  const value = process.env.PAYLOAD_SECRET;
  if (!value) throw new Error("PAYLOAD_SECRET is not set.");
  return value;
};
const digest = (value: string) => createHash("sha256").update(`${secret()}:${value}`).digest("hex");
const key = () => createHash("sha256").update(`${secret()}:portal-session`).digest();

/** AES-256-GCM, so a stolen challenge row does not hand out a session. */
function seal(text: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map((part) => part.toString("base64url")).join(".");
}

function unseal(sealed: string) {
  const [iv, tag, body] = sealed.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
}

const sameDigest = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** "r•••••@gmail.com": enough to recognise the inbox without printing the address. */
const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 1)}${"•".repeat(Math.max(1, name.length - 1))}@${domain}`;
};

type Device = { hash: string; lastUsedAt: string };
const freshDevices = (devices: readonly Device[] | null | undefined) => (devices ?? []).filter((device) => Date.now() - new Date(device.lastUsedAt).getTime() < TRUST_MS);

/** Step one: check the password. Either signs in on a trusted browser or emails a code. */
export async function startLogin(email: string, password: string, deviceToken: string | undefined): Promise<StartResult> {
  if (!hasDatabase()) return NOT_YET;
  const payload = await getPayload({ config });
  let result: Awaited<ReturnType<typeof payload.login<"investors">>>;
  try {
    result = await payload.login({ collection: "investors", data: { email: email.trim().toLowerCase(), password } });
  } catch (error) {
    if (error instanceof LockedAuth) return { kind: "error", message: "This account is locked after too many wrong passwords. Try again in 10 minutes." };
    if (error instanceof AuthenticationError) return { kind: "error", message: "That email and password don't match an investor account." };
    if (error instanceof APIError && error.status === 403) return { kind: "error", message: error.message };
    throw error;
  }
  const { token, exp, user } = result;
  if (!token || !exp || !user) throw new Error("Payload returned no session token.");
  const session = { token, expires: new Date(exp * 1000) };

  const devices = freshDevices(user.trustedDevices);
  const known = deviceToken ? devices.find((device) => sameDigest(device.hash, digest(deviceToken))) : undefined;
  if (known) {
    known.lastUsedAt = new Date().toISOString();
    await payload.update({ collection: "investors", id: user.id, data: { trustedDevices: devices }, overrideAccess: true });
    return { kind: "signed-in", session };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  // The id handed to the browser carries a random nonce, so a pending sign-in
  // cannot be found by counting row ids.
  const nonce = randomBytes(16).toString("base64url");
  const challenge = await payload.create({
    collection: "login-challenges",
    overrideAccess: true,
    data: {
      investor: user.id,
      nonceHash: digest(nonce),
      codeHash: digest(code),
      sealedToken: seal(token),
      sessionExpires: session.expires.toISOString(),
      expiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      attempts: 0,
    },
  });
  await payload.sendEmail({
    to: user.email,
    subject: `${code} is your Moneybee sign-in code`,
    text: `${code} is your code to sign in to the Moneybee investor portal. It expires in 10 minutes.\n\nIf you did not just try to sign in, change your password from the sign-in page.`,
  });
  return { kind: "code-sent", challengeId: `${challenge.id}.${nonce}`, sentTo: maskEmail(user.email) };
}

/** Step two: check the emailed code, then hand over the session and trust this browser. */
export async function verifyCode(challengeId: string, code: string): Promise<VerifyResult> {
  if (!hasDatabase()) return NOT_YET;
  const payload = await getPayload({ config });
  const [id, nonce = ""] = challengeId.split(".");
  const found = /^\d+$/.test(id) ? await payload.findByID({ collection: "login-challenges", id: Number(id), overrideAccess: true, disableErrors: true, depth: 0 }) : null;
  const challenge = found && sameDigest(digest(nonce), found.nonceHash) ? found : null;
  if (!challenge || challenge.consumedAt || new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { kind: "error", message: "This code has expired. Sign in again for a new one." };
  }
  if (challenge.attempts >= CODE_ATTEMPTS) return { kind: "error", message: "Too many wrong codes. Sign in again for a new one." };
  if (!sameDigest(digest(code.replace(/\s/g, "")), challenge.codeHash)) {
    await payload.update({ collection: "login-challenges", id: challenge.id, data: { attempts: challenge.attempts + 1 }, overrideAccess: true });
    return { kind: "error", message: "That code is not right. Use the one in the latest email from Moneybee." };
  }

  await payload.update({ collection: "login-challenges", id: challenge.id, data: { consumedAt: new Date().toISOString() }, overrideAccess: true });
  const investorId = typeof challenge.investor === "object" ? challenge.investor.id : challenge.investor;
  const investor = await payload.findByID({ collection: "investors", id: investorId, overrideAccess: true, depth: 0 });
  const deviceToken = randomBytes(32).toString("base64url");
  const devices = [...freshDevices(investor.trustedDevices).slice(-(TRUSTED_DEVICES_KEPT - 1)), { hash: digest(deviceToken), lastUsedAt: new Date().toISOString() }];
  await payload.update({ collection: "investors", id: investorId, data: { trustedDevices: devices }, overrideAccess: true });

  return { kind: "signed-in", session: { token: unseal(challenge.sealedToken), expires: new Date(challenge.sessionExpires) }, deviceToken };
}

/** Emails a set-password link. Says nothing about whether the address has an account. */
export async function requestPasswordReset(email: string, origin: string) {
  if (!hasDatabase()) return;
  const payload = await getPayload({ config });
  await payload.forgotPassword({ collection: "investors", data: { email: email.trim().toLowerCase() }, context: { origin } }).catch(() => undefined);
}

export async function resetPassword(token: string, password: string): Promise<{ kind: "done" } | Failure> {
  if (!hasDatabase()) return NOT_YET;
  const payload = await getPayload({ config });
  try {
    await payload.resetPassword({ collection: "investors", data: { token, password }, overrideAccess: true });
    return { kind: "done" };
  } catch {
    return { kind: "error", message: "This link has expired or was already used. Ask for a new one." };
  }
}

/** The investor signed in on this request, or null. */
export async function currentInvestor() {
  // Read the request first, so pages that ask stay dynamic even on a deployment without a database.
  const requestHeaders = await headers();
  if (!hasDatabase()) return null;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: requestHeaders });
  return user?.collection === "investors" ? user : null;
}
