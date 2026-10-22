import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { Badge } from "@/components/fluid/badge";
import { LinkButton } from "@/components/admin/link-button";
import { GUIDE_VIDEOS, type GuideVideo as GuideVideoEntry } from "@/lib/admin/guide-videos";
import { ROLES } from "@/lib/backend/roles";
import { JOURNEY, KEPT, NOT_CONNECTED, NOT_KEPT, ROW_KINDS, WHY_MONTHLY } from "@/lib/pages/fact-sheet-guide";
import { ANY_SECTION_NOTE, GATE_LABELS, HOME_GUIDE, type Gate, type GuideSection } from "@/lib/pages/home-guide";
import { ABOUT_GUIDE } from "@/lib/pages/about-guide";
import { CONTACT_GUIDE } from "@/lib/pages/contact-guide";
import { INVESTOR_CENTRE_GUIDE } from "@/lib/pages/investor-centre-guide";
import { AIF_GUIDE, CAREERS_GUIDE, CASE_STUDIES_GUIDE, COMPARE_GUIDE, PHILOSOPHY_GUIDE, PICKS_GUIDE } from "@/lib/pages/more-guides";
import { PMS_GUIDE } from "@/lib/pages/pms-guide";
import { monthYear, rupees } from "@/lib/site/tokens";
import { SECTION_KINDS, type SectionKind } from "@/lib/pages/sections";
import { editorHref, SITE_PAGES, type SitePage } from "@/lib/pages/site-pages";
import { PagePicker } from "./page-picker";
import { ScreenIcon } from "@/components/admin/screen-intro";
import { GROUPS, SCREENS, type ScreenKey } from "@/lib/admin/screens";
import { HOW_TO, RULES } from "@/lib/admin/guide-how-to";
import { AnnotatedShot, Marker } from "./annotated-shot";
import { GuideRail, type GuidePart } from "./guide-rail";
import { GuideVideo, WatchFirst } from "./guide-video";

/** Every screen in the Guide, in the sidebar's order. */
const SCREEN_KEYS = Object.keys(SCREENS) as ScreenKey[];

/** The start-to-finish stories recorded for Watch first. */
const WATCH_FIRST = GUIDE_VIDEOS.filter((video) => video.watchFirst);

/** The videos recorded for each screen, and for each How to, in the order they were written. */
function videosFor(field: "screens" | "howTo") {
  const found = new Map<string, GuideVideoEntry[]>();
  for (const video of GUIDE_VIDEOS) {
    for (const key of video[field] ?? []) {
      const list = found.get(key) ?? [];
      list.push(video);
      found.set(key, list);
    }
  }
  return found;
}

const SCREEN_VIDEOS = videosFor("screens");
const HOW_TO_VIDEOS = videosFor("howTo");

/*
 * /admin/guide (payload.config.ts admin.components.views.guide): how the admin
 * and the website's pages work, taught on pictures of the real screens (user,
 * 2026-10-14: "legible and detailed, where what leads, what's the purpose of
 * each section of the guide + images to show what we mean"; staff and the
 * client learn from it). One page with anchors, so each screen's How to use
 * this lands on its entry; the rail on the left says what each part is for.
 * The pictures come from scripts/guide-shots.mjs.
 */

/** The Guide's parts, in reading order, each with what it is for. */
const PARTS: readonly GuidePart[] = [
  { id: "start", title: "Start here", purpose: "What the sidebar holds and where each part leads" },
  { id: "watch", title: "Watch first", purpose: "Each kind of work, start to finish, filmed in the admin" },
  { id: "what", title: "What changes what", purpose: "Each page of the site, part by part, with where to change it" },
  { id: "screens", title: "Every screen", purpose: "What each screen is for and how to use it well" },
  { id: "how", title: "How to", purpose: "The jobs people do most, step by step" },
  { id: "fact-sheets", title: "Fact sheets, explained", purpose: "Why a new one every month, and what happens to it" },
  { id: "rules", title: "The rules", purpose: "What must never happen, and why" },
  { id: "map", title: "Where things come from", purpose: "Which screen feeds which part of the site" },
];

/** A part's heading: its title, and the purpose line the rail shows. */
function PartHeading({ id }: { id: string }) {
  const { title, purpose } = PARTS.find((p) => p.id === id) ?? PARTS[0];
  return (
    <header>
      <h2 className="text-[28px] leading-[34px] font-semibold tracking-[-0.01em] text-foreground">{title}</h2>
      <p className="mt-1.5 text-[15px] leading-6 text-muted-foreground">{purpose}.</p>
    </header>
  );
}

const GATE_COLOR: Record<Gate, "orange" | "blue" | "gray"> = { compliance: "orange", factSheet: "blue", fixed: "gray" };

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
          <h3 className="text-[20px] leading-7 font-semibold text-foreground">{SECTION_KINDS[kind].name}</h3>
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
            <li key={part.label} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
              <Marker n={index + 1} />
              <div>
                <p className="text-[15px] leading-6 font-medium text-foreground">{part.label}</p>
                <p className="text-[15px] leading-6 text-muted-foreground">{part.where}</p>
                {part.gate ? (
                  <Badge variant="dot" color={GATE_COLOR[part.gate]} size="compact" className="mt-1.5">
                    {GATE_LABELS[part.gate]}
                  </Badge>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        {guide.note ? <p className="mt-4 text-[15px] leading-6 text-muted-foreground">{guide.note}</p> : null}
      </div>
    </article>
  );
}

/** One row of the map: a place in /admin, and the parts of the page it changes. */
function MapRow({ source, where, targets }: { source: string; where: string; targets: string[] }) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,14rem)_3rem_minmax(0,1fr)]">
      <div className="rounded-lg border bg-card p-3">
        <p className="text-[15px] leading-6 font-medium text-foreground">{source}</p>
        <p className="text-[14px] leading-5 text-muted-foreground">{where}</p>
      </div>
      <svg viewBox="0 0 48 12" className="hidden h-3 w-12 text-muted-foreground md:block" aria-hidden="true">
        <path d="M0 6h44M38 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {targets.map((target) => (
          <li key={target} className="rounded-full border px-3 py-1 text-[14px] leading-5 text-foreground">
            {target}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The worked example for "Fact sheets, explained", from the live Moneybee PMS
 * sheet: what Rs. 10 Lakh grew to, over how many years, and the since-inception
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
  return `${rupees(1)} put into ${product.name} in ${started} was worth ${rupees(sheet.wealth.ours)} by ${monthYear(sheet.asOf)}, about ${years} years later. Growing ${since.ours.toFixed(2)}% every year for those ${years} years gives that same result, so the sheet's since-inception row says ${since.ours.toFixed(2)}%.`;
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
        <div className="max-w-[1240px]">
          <header className="mt-8 mb-8">
            <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Guide</h1>
            <p className="mt-1 text-[15px] leading-6 text-muted-foreground">How the admin and the website fit together, and how to change them.</p>
          </header>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
            <GuideRail parts={PARTS} />

            <div className="min-w-0">
              <section id="start" className="scroll-mt-24">
                <PartHeading id="start" />
                <p className="mt-4 max-w-[70ch] text-[15px] leading-6 text-foreground">
                  Everything in the admin hangs off the sidebar on the left. It has four groups, and each does one kind of work. Every screen opens with a line saying what it is for and a How to use this button, which brings you to that screen&apos;s
                  entry under Every screen.
                </p>
                <div className="mt-8 grid grid-cols-1 items-start gap-10 md:grid-cols-[auto_minmax(0,1fr)]">
                  <AnnotatedShot id="sidebar" alt="The admin sidebar with its four groups numbered" className="md:w-[275px]" />
                  <ol className="m-0 grid list-none gap-8 p-0">
                    {GROUPS.map(({ group, title, leads }, index) => (
                      <li key={group} className="grid grid-cols-[24px_minmax(0,1fr)] gap-4">
                        <Marker n={index + 1} />
                        <div>
                          <p className="text-[17px] leading-6 font-semibold text-foreground">
                            {group}: {title}
                          </p>
                          <ul className="mt-2 grid list-none gap-1.5 p-0">
                            {leads.map((lead) => (
                              <li key={lead.text} className="text-[15px] leading-6 text-muted-foreground">
                                {lead.keys.length ? (
                                  lead.keys.map((key, n) => (
                                    <span key={key}>
                                      {n > 0 ? ", " : null}
                                      <a href={`#screen-${key}`} className="font-semibold text-foreground underline-offset-2 hover:underline">
                                        {SCREENS[key].name}
                                      </a>
                                    </span>
                                  ))
                                ) : (
                                  <b className="font-semibold text-foreground">{lead.name}</b>
                                )}{" "}
                                {lead.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {WATCH_FIRST.length ? (
                <section id="watch" className="mt-16 scroll-mt-24 border-t pt-10">
                  <PartHeading id="watch" />
                  <p className="mt-4 max-w-[70ch] text-[15px] leading-6 text-foreground">
                    Start with the story closest to the work in front of you. Every step is captioned, and the chapter list jumps to any one.
                  </p>
                  <div className="mt-5">
                    <WatchFirst videos={WATCH_FIRST} />
                  </div>
                </section>
              ) : null}

              <section id="what" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="what" />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <PagePicker current={page.key} />
                  <LinkButton href={editorHref(page)} icon="pencil" variant="primary" size="default">
                    Edit {page.name}
                  </LinkButton>
                </div>
                <p className="mt-3 max-w-[70ch] text-[15px] leading-6 text-muted-foreground">The page as it is live now, top to bottom. Each part is changed in the page unless it says otherwise.</p>
                {sections.map(({ kind, hidden }, index) => {
                  const guide = GUIDES[page.key][kind];
                  return guide ? (
                    <SectionGuide key={index} kind={kind} hidden={hidden} guide={guide} edit={editorHref(page, index)} />
                  ) : (
                    <article key={index} className="grid grid-cols-1 items-start gap-6 border-t py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                      <img src={SECTION_KINDS[kind].picture} alt={`The ${SECTION_KINDS[kind].name} section`} className="block h-auto w-full rounded-lg border" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[20px] leading-7 font-semibold text-foreground">{SECTION_KINDS[kind].name}</h3>
                          <span className="ml-auto">
                            <EditSection href={editorHref(page, index)} />
                          </span>
                        </div>
                        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{ANY_SECTION_NOTE}</p>
                      </div>
                    </article>
                  );
                })}
              </section>

              <section id="screens" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="screens" />
                {GROUPS.map(({ group, title }) => (
                  <div key={group} className="mt-10">
                    <h3 className="text-caption font-medium tracking-[.08em] text-muted-foreground uppercase">
                      {group}: {title}
                    </h3>
                    {SCREEN_KEYS.filter((key) => SCREENS[key].group === group).map((key) => {
                      const screen = SCREENS[key];
                      return (
                        <article key={key} id={`screen-${key}`} className="mt-4 scroll-mt-24 border-t pt-6 pb-4 data-[arrived]:border-t-2 data-[arrived]:border-t-[#2563EB]">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
                              <ScreenIcon screen={key} />
                            </span>
                            <h4 className="text-[20px] leading-7 font-semibold text-foreground">{screen.name}</h4>
                            <span className="text-[14px] text-muted-foreground">
                              {screen.group} › {screen.name}
                            </span>
                            <LinkButton href={screen.href} className="ml-auto">
                              Open {screen.name}
                            </LinkButton>
                          </div>
                          <p className="mt-2 max-w-[70ch] text-[15px] leading-6 text-foreground">{screen.line}</p>
                          <p className="mt-3 max-w-[80ch] rounded-xl border bg-card px-4 py-3 text-[15px] leading-6 text-muted-foreground">
                            <b className="font-semibold text-foreground">For example:</b> {screen.example}
                          </p>
                          {(SCREEN_VIDEOS.get(key) ?? []).map((video) => (
                            <GuideVideo key={video.id} video={video} className="mt-5" />
                          ))}
                          <AnnotatedShot id={`screen-${key}`} alt={`The ${screen.name} screen with its controls numbered`} className="mt-5" />
                          <ol className="mt-5 grid list-none grid-cols-1 gap-x-8 gap-y-4 p-0 xl:grid-cols-2">
                            {screen.controls.map((control, index) => (
                              <li key={control.label} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
                                <Marker n={index + 1} />
                                <div>
                                  <p className="text-[15px] leading-6 font-semibold text-foreground">{control.label}</p>
                                  <p className="text-[15px] leading-6 text-muted-foreground">{control.text}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </article>
                      );
                    })}
                  </div>
                ))}
              </section>

              <section id="how" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="how" />
                {HOW_TO.map((task) => (
                  <article key={task.key} id={`how-${task.key}`} className="mt-8 scroll-mt-24 border-t pt-6">
                    <h3 className="text-[20px] leading-7 font-semibold text-foreground">{task.title}</h3>
                    <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{task.when}</p>
                    {(HOW_TO_VIDEOS.get(task.key) ?? []).map((video) => (
                      <GuideVideo key={video.id} video={video} className="mt-5" />
                    ))}
                    <ol className="mt-5 grid list-none gap-8 p-0">
                      {task.steps.map((step, index) => (
                        <li key={index} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
                          <Marker n={index + 1} />
                          <div className="min-w-0">
                            <p className="max-w-[70ch] text-[15px] leading-6 text-foreground">{step.text}</p>
                            {step.shot ? <AnnotatedShot id={`how-${task.key}-${index + 1}`} alt={step.text} numbers={[index + 1]} className="mt-3" /> : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </section>

              <section id="fact-sheets" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="fact-sheets" />
                <p className="mt-3 max-w-[70ch] text-[15px] leading-6 text-foreground">Every number about returns on the site comes from a fact sheet. If you are new to how a fund reports, start here.</p>

                <h3 className="mt-8 text-[17px] leading-6 font-semibold text-foreground">Why there is a new one every month</h3>
                <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                  {WHY_MONTHLY.map((item) => (
                    <div key={item.title} className="rounded-xl border bg-card p-4">
                      <p className="text-[15px] leading-6 font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>

                <h3 className="mt-10 text-[17px] leading-6 font-semibold text-foreground">What the rows mean</h3>
                <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                  {ROW_KINDS.map((item) => (
                    <div key={item.title} className="rounded-xl border bg-card p-4">
                      <p className="text-[15px] leading-6 font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
                {example ? (
                  <p className="mt-3 max-w-[80ch] rounded-xl border border-[#F6A11A]/40 bg-[#F6A11A]/5 px-4 py-3 text-[15px] leading-6 text-foreground">
                    <b className="font-semibold">From the live sheet:</b> {example}
                  </p>
                ) : null}

                <h3 className="mt-10 text-[17px] leading-6 font-semibold text-foreground">From the PDF to the site</h3>
                <p className="mt-1 max-w-[70ch] text-[15px] leading-6 text-muted-foreground">Steps 1 to 3 happen on this screen.</p>
                <AnnotatedShot id="fact-sheet-screen" alt="The fact sheet screen with its first three steps numbered" className="mt-4" />
                <ol className="mt-5 grid list-none gap-2 p-0">
                  {JOURNEY.map((step, index) => (
                    <li key={index} className="grid grid-cols-[24px_7rem_minmax(0,1fr)] items-start gap-3 rounded-lg border bg-card px-4 py-3">
                      <Marker n={index + 1} />
                      <span className="text-[15px] leading-6 font-medium text-foreground">{step.who}</span>
                      <span className="text-[15px] leading-6 text-muted-foreground">{step.text}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 grid grid-cols-1 gap-3 xl:grid-cols-3">
                  {(
                    [
                      ["What every sheet keeps", KEPT],
                      ["What is not kept", NOT_KEPT],
                      ["Not connected yet", NOT_CONNECTED],
                    ] as const
                  ).map(([title, items]) => (
                    <div key={title} className="rounded-xl border bg-card p-4">
                      <p className="text-[15px] leading-6 font-semibold text-foreground">{title}</p>
                      <ul className="mt-2 grid list-disc gap-1.5 pl-4">
                        {items.map((item) => (
                          <li key={item} className="text-[15px] leading-6 text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="rules" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="rules" />
                <ol className="mt-5 grid list-none gap-3 p-0">
                  {RULES.map(({ rule, why }, index) => (
                    <li key={rule} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 rounded-xl border bg-card px-4 py-4">
                      <Marker n={index + 1} />
                      <div>
                        <p className="text-[15px] leading-6 font-medium text-foreground">{rule}</p>
                        <p className="mt-1 text-[15px] leading-6 text-muted-foreground">Why: {why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="map" className="mt-16 scroll-mt-24 border-t pt-10">
                <PartHeading id="map" />
                <div className="mt-5 grid gap-3">
                  <MapRow source="Each page" where="Website › Pages" targets={["Every section's words and pictures", "The order of sections", "Which sections are hidden"]} />
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
          </div>
        </div>
      )}
    </AdminView>
  );
}
