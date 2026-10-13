/*
 * Moneybee's marks in place of Payload's (payload.config.ts
 * admin.components.graphics). The real logo files from /public, never a
 * redraw: the ink wordmark on light, the light wordmark when Payload's theme
 * is dark (admin.css swaps them), and the bee icon in the nav bar.
 */

/** The wordmark on the sign-in, forgot-password and create-account screens. */
export function Logo() {
  return (
    <span className="mb-brand">
      {/* eslint-disable-next-line @next/next/no-img-element -- Payload renders this outside next/image's loader */}
      <img className="mb-brand-ink" src="/moneybee-logo.svg" alt="Moneybee" width={220} height={96} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mb-brand-light" src="/moneybee-logo-light.svg" alt="" aria-hidden="true" width={220} height={96} />
    </span>
  );
}

/** The bee, top left of every admin screen. */
export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icon.svg" alt="Moneybee" width={26} height={26} style={{ display: "block", borderRadius: 6 }} />;
}
