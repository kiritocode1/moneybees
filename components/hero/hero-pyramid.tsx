"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PicksFigure } from "@/components/fact-sections/picks-section";
import { PYRAMID_TIERS } from "@/components/insight-cards/moneybee-figures";

/** How long the tiers take to rise on load, and how long each tier stays lit. */
const BUILD_MS = 2400;
const TIER_MS = 2600;
/** A click holds the chosen tier this long before the loop resumes. */
const HOLD_MS = 8000;

/**
 * The multibagger picks pyramid, run on a clock for the hero. In its own
 * section scroll drives the build and the lit tier; here the tiers rise once on
 * load, then the lit tier walks from the apex down and loops. Clicking a tier
 * lights it and pauses the walk.
 */
export default function HeroPyramid() {
  const reduceMotion = useReducedMotion();
  const top = PYRAMID_TIERS.length - 1;
  const [built, setBuilt] = useState(0);
  // Reduced motion skips the build rather than setting state from the effect.
  const progress = reduceMotion ? 1 : built;
  const [selected, setSelected] = useState(top);
  const [heldUntil, setHeldUntil] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const next = Math.min((now - start) / BUILD_MS, 1);
      setBuilt(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || progress < 1) return;
    const id = window.setInterval(() => {
      if (Date.now() < heldUntil) return;
      setSelected((tier) => (tier === 0 ? top : tier - 1));
    }, TIER_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, progress, heldUntil, top]);

  return (
    <PicksFigure
      progress={progress}
      selected={selected}
      onSelect={(tier) => {
        setSelected(tier);
        setHeldUntil(Date.now() + HOLD_MS);
      }}
    />
  );
}
