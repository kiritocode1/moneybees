import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { Badge } from "@/components/fluid/badge";
import { LinkButton } from "@/components/admin/link-button";
import { ROLES } from "@/lib/backend/roles";
import { JOURNEY, KEPT, NOT_CONNECTED, NOT_KEPT, ROW_KINDS, WHY_MONTHLY } from "@/lib/pages/fact-sheet-guide";
import { ANY_SECTION_NOTE, GATE_LABELS, HOME_GUIDE, HOW_TO, RULES, type Gate, type GuideSection } from "@/lib/pages/home-guide";
import { ABOUT_GUIDE } from "@/lib/pages/about-guide";
import { CONTACT_GUIDE } from "@/lib/pages/contact-guide";
import { INVESTOR_CENTRE_GUIDE } from "@/lib/pages/investor-centre-guide";
import { AIF_GUIDE, CAREERS_GUIDE, CASE_STUDIES_GUIDE, COMPARE_GUIDE, PHILOSOPHY_GUIDE, PICKS_GUIDE } from "@/lib/pages/more-guides";
import { PMS_GUIDE } from "@/lib/pages/pms-guide";
import { monthYear } from "@/lib/site/tokens";
import { SECTION_KINDS, type SectionKind } from "@/lib/pages/sections";
import { editorHref, SITE_PAGES, type SitePage } from "@/lib/pages/site-pages";
import { PagePicker } from "./page-picker";

/*
 * /admin/guide (payload.config.ts admin.components.views.guide): how the
 * website's pages are edited, shown on pictures of the real page (user,
 * 2026-10-12: show the sections, then the editing). Four parts, as chosen on
 * 2026-10-12: what changes what, how-to steps, the rules in plain words, and
 * a map of where things come from. The Home page is the first page in it.
 */

const GATE_COLOR: Record<Gate, "orange" | "blue" | "gray"> = { compliance: "orange", factSheet: "blue", fixed: "gray" };

function Marker({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#F6A11A] text-[12px] leading-none font-semibold text-black ${className}`}>
      {n}
    </span>
  );
}

/** One live section: its picture with numbered parts, and the list of where each part is changed. */
function SectionGuide({ kind, hidden, guide, edit }: { kind: SectionKind; hidden: boolean; guide: GuideSection; edit: string }) {
  return (
    <article className="grid grid-cols-1 items-start gap-6 border-t py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <figure className="relative m-0 overflow-hidden rounded-lg border">
        <img src={guide.picture} alt={`The ${SECTION_KINDS[kind].name} section`} className="block h-auto w-full" />
        {/* Each number sits just outside its part's top corner, left unless the part says right. Unmeasured parts are only listed. */}
        {guide.parts.map((part, index) =>
          part.x === undefined || part.y === undefined ? null : (
            <span key={part.label} className="absolute" style={{ left: `${part.x}%`, top: `${part.y}%` }}>
              <Marker n={index + 1} className={`${part.right ? "translate-x-[25%]" : "-translate-x-[125%]"} shadow-[0_0_0_3px_white]`} />
            </span>
          ),
        )}
      </figure>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-title font-semibold text-foreground">{SECTION_KINDS[kind].name}</h3>
          {hidden ? (
            <Badge variant="dot" color="gray" size="compact">
              Hidden on the site
            </Badge>
          ) : null}
          <span className="ml-auto">
            <EditSection href={edit} />
          </span>
        </div>
        <ol className="mt-4 grid list-none gap-4 p-0">
          {guide.parts.map((part, index) => (
            <li key={part.label} className="grid grid-cols-[22px_minmax(0,1fr)] gap-3">
              <Marker n={index + 1} />
              <div>
                <p className="text-body font-medium text-foreground">{part.label}</p>
                <p className="mt-0.5 text-caption text-muted-foreground">{part.where}</p>
                {part.gate ? (
                  <Badge variant="dot" color={GATE_COLOR[part.gate]} size="compact" className="mt-1.5">
                    {GATE_LABELS[part.gate]}
                  </Badge>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        {guide.note ? <p className="mt-4 text-caption text-muted-foreground">{guide.note}</p> : null}
      </div>
    </article>
  );
}

/** One row of the map: a place in /admin, and the parts of the page it changes. */
function MapRow({ source, where, targets }: { source: string; where: string; targets: string[] }) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,14rem)_3rem_minmax(0,1fr)]">
      <div className="rounded-lg border bg-card p-3">
        <p className="text-body font-medium text-foreground">{source}</p>
        <p className="text-caption text-muted-foreground">{where}</p>
      </div>
      <svg viewBox="0 0 48 12" className="hidden h-3 w-12 text-muted-foreground md:block" aria-hidden="true">
        <path d="M0 6h44M38 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {targets.map((target) => (
          <li key={target} className="rounded-full border px-3 py-1 text-caption text-foreground">
            {target}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Rs. Mn as Indians say it: 1 is "₹10 lakh", 28.85 is "₹2.89 crore". */
const indian = (millions: number) => (millions < 10 ? `₹${+(millions * 10).toFixed(1)} lakh` : `₹${+(millions / 10).toFixed(2)} crore`);

/**
 * The worked example for "Fact sheets, explained", from the live Moneybee PMS
 * sheet: what Rs. 1 Mn grew to, over how many years, and the since-inception
 * return that is the same growth as a steady yearly rate.
 */
async function liveExample(payload: AdminViewServerProps["initPageResult"]["req"]["payload"]) {
  const { docs } = await payload.find({ collection: "fact-sheets", where: { status: { equals: "published" }, "product.slug": { equals: "moneybee-pms" } }, sort: "-asOf", depth: 1, limit: 1, overrideAccess: true });
  const sheet = docs[0];
  const product = sheet && typeof sheet.product === "object" ? sheet.product : null;
  const since = sheet?.returns?.find((row) => row.period === "SI");
  if (!sheet || !product || typeof sheet.wealth?.ours !== "number" || typeof since?.ours !== "number") return null;
  const years = Math.round((new Date(sheet.asOf).getTime() - new Date(product.inception).getTime()) / (365.25 * 24 * 3600 * 1000));
  const started = new Date(product.inception).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  return `Rs. 1 Mn (${indian(1)}) put into ${product.name} in ${started} was worth Rs. ${sheet.wealth.ours} Mn (${indian(sheet.wealth.ours)}) by ${monthYear(sheet.asOf)}, about ${years} years later. Growing ${since.ours.toFixed(2)}% every year for those ${years} years gives that same result, so the sheet's since-inception row says ${since.ours.toFixed(2)}%.`;
}

/** Each page's "what changes what", by its key in lib/pages/site-pages.ts. */
const GUIDES: Record<SitePage["key"], Partial<Record<SectionKind, GuideSection>>> = {
  home: HOME_GUIDE,
  pms: PMS_GUIDE,
  aif: AIF_GUIDE,
  "pms-vs-aif": COMPARE_GUIDE,
  "our-philosophy": PHILOSOPHY_GUIDE,
  about: ABOUT_GUIDE,
  "case-studies": CASE_STUDIES_GUIDE,
  picks: PICKS_GUIDE,
  "investor-centre": INVESTOR_CENTRE_GUIDE,
  contact: CONTACT_GUIDE,
  careers: CAREERS_GUIDE,
};

/** Opens the page's editor with this section's fields open. */
function EditSection({ href }: { href: string }) {
  return (
    <LinkButton href={href} icon="pencil" className="shrink-0">
      Edit this section
    </LinkButton>
  );
}

export async function GuideView(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req;
  const asked = (props.searchParams as Record<string, string | undefined> | undefined)?.page;
  const page = SITE_PAGES.find((p) => p.key === asked) ?? SITE_PAGES[0];
  const [record, example] = await Promise.all([payload.findGlobal({ slug: page.slug, depth: 0, overrideAccess: true }), liveExample(payload)]);
  const sections = (record.sections ?? []).map((section) => ({ kind: section.blockType, hidden: Boolean(section.hidden) }));

  return (
    <AdminView {...props} roles={ROLES}>
      {() => (
        <div className="max-w-[1100px]">
          <header className="mt-8 mb-6">
            <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Guide</h1>
            <p className="mt-1 text-body text-muted-foreground">How the website and its numbers are put together, and how to change them.</p>
            <nav className="mt-4 flex flex-wrap gap-2" aria-label="Guide">
              {[
                ["#what", "What changes what"],
                ["#how", "How to"],
                ["#fact-sheets", "Fact sheets, explained"],
                ["#rules", "The rules"],
                ["#map", "Where things come from"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="rounded-full border px-3 py-1 text-caption text-foreground no-underline hover:bg-hover">
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <section id="what" className="scroll-mt-24">
            <h2 className="text-title font-semibold text-foreground">What changes what</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <PagePicker current={page.key} />
              <LinkButton href={editorHref(page)} icon="pencil" variant="primary" size="default">
                Edit {page.name}
              </LinkButton>
            </div>
            <p className="mt-3 text-body text-muted-foreground">The page as it is live now, top to bottom. Each part is changed in the page unless it says otherwise.</p>
            {sections.map(({ kind, hidden }, index) => {
              const guide = GUIDES[page.key][kind];
              return guide ? (
                <SectionGuide key={index} kind={kind} hidden={hidden} guide={guide} edit={editorHref(page, index)} />
              ) : (
                <article key={index} className="grid grid-cols-1 items-start gap-6 border-t py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                  <img src={SECTION_KINDS[kind].picture} alt={`The ${SECTION_KINDS[kind].name} section`} className="block h-auto w-full rounded-lg border" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-title font-semibold text-foreground">{SECTION_KINDS[kind].name}</h3>
                      <span className="ml-auto">
                        <EditSection href={editorHref(page, index)} />
                      </span>
                    </div>
                    <p className="mt-2 text-caption text-muted-foreground">{ANY_SECTION_NOTE}</p>
                  </div>
                </article>
              );
            })}
          </section>

          <section id="how" className="mt-12 scroll-mt-24">
            <h2 className="text-title font-semibold text-foreground">How to</h2>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
              {HOW_TO.map((card) => (
                <div key={card.title} className="rounded-xl border bg-card p-4">
                  <h3 className="text-body font-semibold text-foreground">{card.title}</h3>
                  <ol className="mt-3 grid list-none gap-2 p-0">
                    {card.steps.map((step, index) => (
                      <li key={index} className="grid grid-cols-[22px_minmax(0,1fr)] gap-2 text-caption text-foreground">
                        <span className="text-muted-foreground tabular-nums">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <section id="fact-sheets" className="mt-12 scroll-mt-24">
            <h2 className="text-title font-semibold text-foreground">Fact sheets, explained</h2>
            <p className="mt-1 max-w-[70ch] text-body text-muted-foreground">Every number about returns on the site comes from a fact sheet. If you are new to how a fund reports, start here.</p>

            <h3 className="mt-6 text-body font-semibold text-foreground">Why there is a new one every month</h3>
            <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
              {WHY_MONTHLY.map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-4">
                  <p className="text-body font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-body font-semibold text-foreground">What the rows mean</h3>
            <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
              {ROW_KINDS.map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-4">
                  <p className="text-body font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            {example ? (
              <p className="mt-3 max-w-[80ch] rounded-xl border border-[#F6A11A]/40 bg-[#F6A11A]/5 px-4 py-3 text-body text-foreground">
                <b className="font-semibold">From the live sheet:</b> {example}
              </p>
            ) : null}

            <h3 className="mt-8 text-body font-semibold text-foreground">From the PDF to the site</h3>
            <ol className="mt-3 grid list-none gap-2 p-0">
              {JOURNEY.map((step, index) => (
                <li key={index} className="grid grid-cols-[22px_7rem_minmax(0,1fr)] items-start gap-3 rounded-lg border bg-card px-4 py-3">
                  <Marker n={index + 1} />
                  <span className="text-caption font-medium text-foreground">{step.who}</span>
                  <span className="text-caption text-muted-foreground">{step.text}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
              {(
                [
                  ["What every sheet keeps", KEPT],
                  ["What is not kept", NOT_KEPT],
                  ["Not connected yet", NOT_CONNECTED],
                ] as const
              ).map(([title, items]) => (
                <div key={title} className="rounded-xl border bg-card p-4">
                  <p className="text-body font-semibold text-foreground">{title}</p>
                  <ul className="mt-2 grid list-disc gap-1.5 pl-4">
                    {items.map((item) => (
                      <li key={item} className="text-caption text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="rules" className="mt-12 scroll-mt-24">
            <h2 className="text-title font-semibold text-foreground">The rules</h2>
            <ul className="mt-4 grid list-none gap-2 p-0">
              {RULES.map((rule) => (
                <li key={rule} className="rounded-lg border bg-card px-4 py-3 text-body text-foreground">
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section id="map" className="mt-12 scroll-mt-24">
            <h2 className="text-title font-semibold text-foreground">Where things come from</h2>
            <div className="mt-4 grid gap-3">
              <MapRow source="Each page" where="Website" targets={["Every section's words and pictures", "The order of sections", "Which sections are hidden"]} />
              <MapRow source="Fact sheets" where="Publishing, approved by compliance" targets={["The return in the top figures", "The discs", "The returns tables", "Numbers in braces", "Flyingbee returns, once shown publicly"]} />
              <MapRow source="Office details" where="Website" targets={["Phone and email in Get started", "The footer on every page", "The Contact page's details and map"]} />
              <MapRow source="Team" where="Website" targets={["The Our Team carousel on the About page"]} />
              <MapRow source="Documents" where="Website" targets={["The cards on the Investor Centre page"]} />
              <MapRow source="Case studies" where="Website" targets={["The company sections and the profit timeline on the Case Studies page"]} />
              <MapRow source="Openings" where="Website" targets={["The roles on the Careers page"]} />
              <MapRow source="Enquiry topics" where="Your web team, for now" targets={["The four Get started cards", "The four topics on the Contact form"]} />
            </div>
          </section>
        </div>
      )}
    </AdminView>
  );
}
