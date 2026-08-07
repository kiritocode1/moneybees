/* eslint-disable @next/next/no-img-element */

/**
 * The reference's five button shapes.
 *
 * Every one of them works the same way: the label is duplicated inside a
 * fixed-height, overflow-hidden wrapper, and hover slides the pair up by half
 * its height so the second copy takes the first one's place. The arrow, where
 * there is one, slides a full width sideways in its own clipped box. Nothing
 * here is decorative — the doubled markup *is* the animation, so the copies
 * must stay identical.
 *
 * Hover motion itself lives in `motion.ts` alongside the rest of the timeline
 * work, which is why these components carry classes but no handlers.
 */

type ButtonProps = {
  children: string;
  href?: string;
  className?: string;
};

/** Pill with a phone glyph. `tone` picks the reference's purple or white fill. */
export function CtaButton({
  children,
  href = "#contact",
  tone = "purple",
}: ButtonProps & { tone?: "purple" | "white" }) {
  const purple = tone === "purple";
  return (
    <a href={href} className={`cta-button w-inline-block${purple ? " is-purple" : ""}`}>
      <img src="/option-3/call.svg" loading="lazy" alt="" className="call" />
      <div className={`cta-button-text-wrap${purple ? " is-purple" : ""}`}>
        <div className="cta-button-text-group">
          <div className="button-01-text">{children}</div>
          <div className="button-01-text">{children}</div>
        </div>
      </div>
    </a>
  );
}

/** Outlined pill that fills purple on hover. `icon={false}` drops the arrow. */
export function ButtonOne({ children, href = "#contact", icon = true }: ButtonProps & { icon?: boolean }) {
  return (
    <a href={href} className="button-01 w-inline-block">
      <div className={`button-01-arrow-wrap${icon ? "" : " is-textonly"}`}>
        <div className="button-01-arrow-group">
          <img src="/option-3/arrow.svg" loading="lazy" alt="" className="button-01-arrow" />
          <img src="/option-3/arrow.svg" loading="lazy" alt="" className="button-01-arrow" />
        </div>
      </div>
      <div className="button-01-text-wrap">
        <div className="button-01-text-group">
          <div className="button-01-text">{children}</div>
          <div className="button-01-text">{children}</div>
        </div>
      </div>
    </a>
  );
}

/** Solid black pill that turns yellow on hover; the arrow inverts with it. */
export function ButtonTwo({ children, href = "#contact", icon = true }: ButtonProps & { icon?: boolean }) {
  return (
    <a href={href} className="button-02 w-inline-block">
      <div className={`button-02-arrow-wrap${icon ? "" : " is-textonly"}`}>
        <div className="button-02-arrow-group">
          <img src="/option-3/arrow.svg" loading="lazy" alt="" className="button-02-arrow" />
          <img src="/option-3/arrow-white.svg" loading="lazy" alt="" className="button-02-arrow" />
        </div>
      </div>
      <div className="button-02-text-wrap">
        <div className="button-02-text-group">
          <div className="button-01-text text-white">{children}</div>
          <div className="button-01-text">{children}</div>
        </div>
      </div>
    </a>
  );
}

/**
 * Inline text link. Lives inside a card that is itself a link, so it renders as
 * a div — an anchor here would nest interactive elements.
 */
export function ButtonThree({ children }: { children: string }) {
  return (
    <div className="button-03">
      <img src="/option-3/arrow.svg" loading="lazy" alt="" className="button-03-arrow" />
      <div className="button-01-text">{children}</div>
      <div className="button-underline" />
    </div>
  );
}

/** The compact navbar pill. */
export function ButtonFour({ children, href = "#contact" }: ButtonProps) {
  return (
    <a href={href} className="button-04 w-inline-block">
      <div className="button-04-text-wrap">
        <div className="button-04-text-group">
          <div className="button-02-text text-white">{children}</div>
          <div className="button-02-text">{children}</div>
        </div>
      </div>
    </a>
  );
}
