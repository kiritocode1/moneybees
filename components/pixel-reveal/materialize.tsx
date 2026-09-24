"use client";

import type { ComponentProps } from "react";
import { PixelReveal } from "./pixel-reveal";

/**
 * The site's text reveal: Pixel Reveal's "materialize" preset with the brand
 * orange as the hot colour. Words rise from their line as coarse orange
 * blocks, then focus and cool into the heading's own ink.
 */
export function Materialize(props: ComponentProps<typeof PixelReveal>) {
  return <PixelReveal preset="materialize" accent="#F7A11A" {...props} />;
}
