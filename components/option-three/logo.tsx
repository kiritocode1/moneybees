/**
 * The Moneybee lockup.
 *
 * The reference ships its logo as a flat SVG: an abstract mark beside a
 * wordmark drawn as outlines. Reusing that file wholesale would leave the
 * template's name on the page, so the mark is kept as a path and the wordmark
 * is set as live text instead — which also means it renders in the page's own
 * Inter Tight rather than in someone else's outlines.
 *
 * Proportions are taken from the original 120x45 artboard so the lockup keeps
 * the same optical weight inside the 110px brand slot.
 */

const MARK = "M16.3703 21.5529C14.7684 20.1369 12.5357 19.622 10.0254 19.622V13.3594C13.2227 13.3594 17.2684 13.9881 20.5181 16.8608C21.3832 17.6255 22.1502 18.5116 22.8115 19.5248V13.3594C26.0088 13.3594 30.0545 13.9881 33.3042 16.8608C36.6243 19.7957 38.4997 24.5169 38.4997 31.358H32.237C32.237 25.619 30.6878 22.9066 29.1564 21.5529C27.568 20.1488 25.3592 19.6307 22.8745 19.6221C24.7111 22.4879 25.7135 26.3564 25.7135 31.358H19.4509C19.4509 25.619 17.9016 22.9066 16.3703 21.5529ZM10.1221 23.3467C10.0776 23.3191 10.0425 23.2974 10.0227 23.2849C10.003 23.2974 9.96784 23.3191 9.92334 23.3467C9.76083 23.4475 9.4732 23.6259 9.35071 23.7119C9.03912 23.9306 8.62274 24.2488 8.20525 24.6462C7.38211 25.4298 6.5 26.5734 6.5 27.9056C6.5 29.8138 8.07718 31.3608 10.0227 31.3608C11.9683 31.3608 13.5455 29.8138 13.5455 27.9056C13.5455 26.5734 12.6633 25.4298 11.8402 24.6462C11.4227 24.2488 11.0064 23.9306 10.6948 23.7119C10.5723 23.6259 10.2846 23.4475 10.1221 23.3467Z";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      aria-hidden="true"
      className="navbar-brand-logo"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        // The original artboard is 120x45 and the navbar is sized by it: the
        // brand's height sets the bar's height, its width sets where the menu
        // starts. "Moneybee." is two glyphs longer than the name it replaces,
        // so the lockup is scaled to fit the box rather than allowed to resize
        // it.
        width: "120px",
        height: "45px",
        color: tone === "dark" ? "var(--colors--black)" : "var(--colors--white)",
      }}
    >
      <svg
        viewBox="10 13 29 19"
        width="22"
        height="14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flex: "none" }}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={MARK} fill="var(--colors--light-purple)" />
      </svg>
      <span
        style={{
          fontSize: "19px",
          lineHeight: 1,
          fontWeight: 600,
          letterSpacing: "var(--letter-spacing--letter-spacing-2)",
        }}
      >
        Moneybee.
      </span>
    </span>
  );
}
