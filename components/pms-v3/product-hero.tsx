import type { CSSProperties } from "react";
import Link from "@/components/transition/transition-link";
import { BUTTON, EYEBROW } from "@/components/hero/tokens";
import type { ProductHeroData } from "@/lib/pms-v3-hero";
import { ProductMark } from "./marks";

/*
 * The hero of every internal page, rebuilt from Tres Mares' strategy-page hero
 * (reference/tresmares/NOTES.md, "Product hero"): the page's mark over the
 * right 70vw at full height, the title in one or two stepped lines multiplied
 * over it, one sentence bottom-left and three to six figures along the bottom
 * edge. One template for /pms, /aif and the rest; each page brings its own
 * mark (components/pms-v3/marks.tsx), facts and actions.
 *
 * Motion is CSS, so the hero is complete in the HTML: the mark builds from
 * scale 0 over 2s after .5s, and the second title line slides into its step
 * over 2.2s after .8s, both on the source's expoInOut. Reduced motion shows
 * the resting state. Nothing locks scroll.
 */

const HERO_CSS = `
@keyframes pv3-mark { from { transform: translateX(0) scale(0) } }
@keyframes pv3-step { from { transform: translateX(-1em) } }
.pv3-mark-half { animation: pv3-mark 2s cubic-bezier(.87,0,.13,1) .5s both }
.pv3-step { animation: pv3-step 2.2s cubic-bezier(.87,0,.13,1) .8s both }
@media (prefers-reduced-motion: reduce) { .pv3-mark-half, .pv3-step { animation: none } }
`;

/**
 * The title's size in vw: the source's 8.75vw (11.2vw on a phone) unless the
 * longest line, with the second line's 1em step, would run past the right
 * edge. Instrument Serif averages about .42em a character.
 */
function titleSize(title: ProductHeroData["title"], room: number, base: number) {
  const ems = Math.max(...title.map((line, index) => line.length * 0.42 + (index ? 1 : 0)));
  return Math.min(base, room / ems).toFixed(2);
}

export default function ProductHero({ data }: { data: ProductHeroData }) {
  const titleId = `${data.mark}-hero-title`;
  const size = { "--hero-title": `${titleSize(data.title, 92, 11.2)}vw`, "--hero-title-lg": `${titleSize(data.title, 78, 8.75)}vw` } as CSSProperties;
  return (
    <section aria-labelledby={titleId} className="relative isolate overflow-hidden bg-white text-black lg:h-svh lg:min-h-[680px]">
      <style>{HERO_CSS}</style>

      {/* A band under the header on a phone. From lg, the right 70vw at full height, widened on squarer screens so the mark still fills the height. */}
      <div className="relative mt-[104px] aspect-[10/9] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-auto lg:max-w-[100vw] lg:min-w-[70vw]">
        <ProductMark kind={data.mark} className="absolute inset-0 h-full w-full overflow-visible" halfClassName="pv3-mark-half" />
      </div>

      <h1
        id={titleId}
        className="absolute top-[calc(104px+45vw)] left-6 m-0 -translate-y-1/2 font-serif text-[length:var(--hero-title)] leading-[.9] font-normal tracking-[-.02em] whitespace-nowrap mix-blend-multiply lg:top-1/2 lg:left-[19.167vw] lg:text-[length:var(--hero-title-lg)]"
        style={size}
      >
        <span className="block">{data.title[0]}</span>
        {data.title[1] ? <span className="pv3-step ml-[1em] block">{data.title[1]}</span> : null}
      </h1>

      <div className="px-6 pt-10 lg:absolute lg:bottom-[max(6.667vw,96px)] lg:left-0 lg:w-[max(18.75vw,270px)] lg:pt-0 lg:pr-0 lg:pl-[1.667vw]">
        <p className="m-0 max-w-[34ch] font-serif text-[clamp(1.25rem,.8333rem+1.0417vw,1.5rem)] leading-[1.2] text-black/80">{data.sentence}</p>
        {data.actions?.length ? (
          <div className="mt-7 flex flex-wrap gap-3 lg:mt-6">
            {data.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${BUTTON} ${action.outline ? "border border-black text-black hover:bg-black hover:text-white" : "bg-[#F6A11A] text-black hover:bg-black hover:text-white"}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-7 px-6 pt-14 pb-16 sm:grid-cols-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:justify-between lg:gap-6 lg:px-[1.667vw] lg:pt-0 lg:pb-[max(1.25vw,16px)] lg:mix-blend-multiply">
        {data.figures.map((figure) => (
          // An email address is too long for half a phone's width, so a long value takes the whole row there.
          <div key={figure.label} className={`min-w-0 ${figure.value.length > 20 ? "max-sm:col-span-2" : ""}`}>
            <dt className={`${EYEBROW} text-black/60`}>{figure.label}</dt>
            <dd className="m-0 mt-[6px] text-[14px] leading-[1.3] [overflow-wrap:anywhere] text-black">{figure.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
