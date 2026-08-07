/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * Option three — a replica of the selected reference layout, rewritten for
 * Moneybee.
 *
 * Structure and class names follow the reference exactly so that
 * `option-three.css`, which is the reference's own stylesheet scoped to this
 * page, applies without translation. Plain `<img>` is deliberate: the vendored
 * rules size images through their wrappers, and next/image's extra element
 * would sit between the two and break that.
 *
 * Motion lives in `components/option-three/motion.ts`.
 */

import { useEffect, useRef, useState } from "react";
import { initOptionThreeMotion } from "@/components/option-three/motion";
import { Navbar } from "@/components/option-three/navbar";
import { Logo } from "@/components/option-three/logo";
import {
  ButtonOne,
  ButtonThree,
  ButtonTwo,
  CtaButton,
} from "@/components/option-three/buttons";
import {
  BRAND_LOGOS,
  FAQS,
  FEEDBACK_A,
  FEEDBACK_B,
  FOOTER_COLUMNS,
  GROWTH,
  PLANS_PERFORMANCE,
  PLANS_STANDARD,
  POSTS,
  PROJECTS,
  SERVICES,
  STATISTICS,
} from "@/components/option-three/content";

/** Pill above a section heading. */
function SectionBadge({ children, position = false }: { children: string; position?: boolean }) {
  return (
    <div className={`section-badge-wrap${position ? " position" : ""}`}>
      <div className="section-badge">
        <div className="badge-dot" />
        <div className="tagline">{children}</div>
      </div>
    </div>
  );
}

/** Heading split black/grey, the reference's signature two-tone treatment. */
function SplitHeading({ lead, tail, center = false }: { lead: string; tail: string; center?: boolean }) {
  return (
    <h2 className={`section-heading${center ? " text-center" : ""}`}>
      {lead} <span className="text-light-gray">{tail}</span>
    </h2>
  );
}

function FeedbackItem({
  item,
}: {
  item: { name: string; role: string; image: string; quote: string };
}) {
  return (
    <div className="feedback-item">
      <div className="feedback-author-wrap">
        <img src={item.image} loading="lazy" alt="" className="feedback-author-image" />
        <div className="feedback-author-info">
          <h4 className="h4">{item.name}</h4>
          <div className="paragraph-02 text-dark-gray">{item.role}</div>
        </div>
      </div>
      <div className="feedback-details">
        <h4 className="h4">{item.quote}</h4>
      </div>
    </div>
  );
}

/**
 * One marquee column.
 *
 * Two levels of repetition, both load-bearing. Each list runs its quotes twice
 * so a single list is taller than the column and the strip never empties
 * mid-travel; then the whole list is rendered twice so that moving both by
 * exactly one list height lands the duplicate where the original began, and the
 * loop has no visible seam.
 */
function FeedbackColumn({
  items,
  variant,
}: {
  items: { name: string; role: string; image: string; quote: string }[];
  variant: "_01" | "_03";
}) {
  const list = variant === "_01" ? "_01" : "_02";
  return (
    <div className={`feedback-column ${variant}`}>
      <div className="feedback-marquee-wrap">
        {[0, 1].map((copy) => (
          <div key={copy} className={`feedback-list ${list}`}>
            {[...items, ...items].map((item, index) => (
              <FeedbackItem key={`${copy}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </div>
      <div className="feedback-shadow-top" />
      <div className="feedback-shadow-bottom" />
    </div>
  );
}

/** Slot-machine digit pair. Ten numerals per strip, one line visible. */
function Statistic({ upper, lower, suffix, label }: { upper: string; lower: string; suffix: string; label: string }) {
  return (
    <div className="feedback-statistics-list">
      <div className="statistics-number-wrap">
        <div className="statistics-number-box upper">
          {[...upper].map((digit, index) => (
            <h2 key={index} className="h2">
              {digit}
            </h2>
          ))}
        </div>
        <div className="statistics-number-box lower">
          {[...lower].map((digit, index) => (
            <h2 key={index} className="h2">
              {digit}
            </h2>
          ))}
        </div>
        <h2 className="h2">{suffix}</h2>
      </div>
      <div className="paragraph-02 text-dark-gray">{label}</div>
    </div>
  );
}

/**
 * A row that animates open to the height of its own answer.
 *
 * The reference animates to `height: auto`, which its engine resolves to a
 * pixel value at runtime. Measuring the answer and setting that number does the
 * same thing, and leaves the transition on the CSS `ease` curve the source uses.
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = answerRef.current;
    if (!element) return;
    const sync = () => setHeight(open ? element.scrollHeight : 0);
    sync();
    if (!open) return;
    // An open row has a fixed height, so it has to be re-measured if the answer
    // reflows underneath it — on resize, or when the font finally swaps in.
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div className={`faq-item${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="faq-question-wrap"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <div className="text-style-h3 faq-question">{question}</div>
        <div className="faq-arrow-block">
          <div className="arrow-horizontal-line" />
          <div className="arrow-vertical-line" />
        </div>
      </button>
      <div className="faq-answer-wrap" style={{ height }}>
        <div ref={answerRef}>
          <div className="paragraph-02 faq-answer">{answer}</div>
        </div>
      </div>
    </div>
  );
}

function PlanList({
  plans,
  hidden,
}: {
  plans: typeof PLANS_STANDARD;
  hidden: boolean;
}) {
  return (
    <div className={`plan-list${hidden ? " is-hidden" : ""}`}>
      {plans.map((plan, index) => (
        <div
          key={plan.title}
          className={`plan-item${plan.featured ? " card-02" : ""}${index === 2 ? " _03" : ""}`}
        >
          <div className="plan-top-wrap">
            <div className="plan-info-wrap">
              <img loading="lazy" src={plan.icon} alt="" className="plan-icon" />
              <div className={`plan-badge${plan.featured ? " _02" : ""}`}>
                <div className="tagline text-center">{plan.badge}</div>
              </div>
            </div>
            <div className="plan-text-wrap">
              <h3>{plan.title}</h3>
              <div className="paragraph-02 text-dark-gray">{plan.copy}</div>
            </div>
            <div className="plan-price-wrap">
              <h2>{plan.price}</h2>
              <div className="paragraph-02 plan-duration">{plan.duration}</div>
            </div>
          </div>
          <div className="plan-bottom-wrap">
            <h2 className="h5">What is included:</h2>
            <div className="plan-features-wrap">
              {plan.features.map((feature) => (
                <div key={feature} className="plan-features-list">
                  <img loading="lazy" src="/option-3/tick-circle.svg" alt="" className="plan-check" />
                  <div className="paragraph-02 text-dark-gray">{feature}</div>
                </div>
              ))}
            </div>
            <div className="plan-button-wrap">
              {/* The emphasised card gets the solid button, as in the reference. */}
              {plan.featured ? (
                <ButtonTwo icon={false}>Start a conversation</ButtonTwo>
              ) : (
                <ButtonOne icon={false}>Start a conversation</ButtonOne>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Option3() {
  const root = useRef<HTMLDivElement>(null);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // `?motion=off` renders the resting layout with no transforms applied,
    // which is what the layout comparison against the reference reads.
    if (new URLSearchParams(window.location.search).get("motion") === "off") return;
    return initOptionThreeMotion(scope);
  }, []);

  return (
    <div ref={root} className="page-wrapper" id="top">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <Navbar />
        <div className="hero-wrap">
          <div className="container hero-container">
            <div className="hero-main-wrap">
              <div className="hero-content-wrap">
                <div className="hero-header-wrap">
                  <div className="badge">
                    <img src="/option-3/magic-wand.svg" loading="lazy" alt="" className="badge-icon" />
                    <div className="tagline">Portfolio Management &amp; AIF</div>
                  </div>
                  <div className="hero-text-wrap">
                    <div className="hero-heading-wrap">
                      <h1 className="home-hero-heading">
                        We help long-term investors grow with{" "}
                        <span className="text-light-gray">research the market overlooks</span>
                      </h1>
                    </div>
                    <div className="hero-subtitle-wrap">
                      <div className="paragraph-01 text-dark-gray">
                        Moneybee manages capital through fundamental research, valuation discipline,
                        and the patience to let a sound thesis compound.
                      </div>
                    </div>
                  </div>
                  <div className="hero-button-wrap">
                    <CtaButton>Book a Consultation</CtaButton>
                    <ButtonOne href="#strategies">Our Strategies</ButtonOne>
                  </div>
                </div>
              </div>
              <div className="hero-image-wrap">
                <img
                  src="/option-3/hero-image.avif"
                  loading="eager"
                  alt="Two investors reviewing a portfolio together"
                  className="fit-cover hero-image"
                />
                <div className="hero-image-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Brands */}
      <section className="brands is-spaced">
        <div className="container">
          <div className="brands-wrap">
            <div className="section-header-wrap center">
              <div className="section-header-content">
                <div className="section-heading-wrap">
                  <div className="text-style-h5">
                    Registered, audited, and settled through India&rsquo;s market infrastructure
                  </div>
                </div>
              </div>
            </div>
            <div className="brands-main-wrap">
              <div className="brands-marquee">
                {[0, 1].map((copy) => (
                  <div key={copy} className="brands-list">
                    {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, index) => (
                      <img
                        key={`${copy}-${index}`}
                        src={logo}
                        loading="lazy"
                        alt=""
                        className="brand"
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="brand-left-shadow" />
              <div className="brand-right-shadow" />
            </div>
            <div className="divider is-bottom" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section className="services" id="strategies">
        <div className="container">
          <div className="services-wrap">
            <div className="section-header-wrap">
              <div className="section-header-left">
                <SectionBadge>What we do</SectionBadge>
                <div className="section-heading-wrap">
                  <SplitHeading
                    lead="How we put capital to work"
                    tail="with discipline and care"
                  />
                </div>
              </div>
              <div className="section-header-right">
                <div className="paragraph-02 text-dark-gray">
                  Three ways to work with the same research. The mandate changes; the process behind
                  it does not.
                </div>
              </div>
            </div>
            <div className="services-main-wrap">
              {SERVICES.map((service, index) => (
                <div
                  key={service.title}
                  className={`services-card${index === 1 ? " _02" : index === 2 ? " _03" : ""}`}
                >
                  <img src={service.icon} loading="lazy" alt="" className="services-icon" />
                  <div className="services-details">
                    <div className="services-text-wrap">
                      <div className="text-style-h3">{service.title}</div>
                      <div className="paragraph-02 black-text-70">{service.copy}</div>
                    </div>
                    <div className="services-tag-wrap">
                      {service.tags.map((tag) => (
                        <div key={tag} className="services-tag">
                          <div className="tagline">{tag}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="about-01" id="approach">
        <div className="container">
          <div className="about-01-wrap">
            <div className="about-01-header-wrap">
              <div className="section-heading-wrap">
                <SectionBadge position>(Our practice)</SectionBadge>
                <h2 className="section-heading about-01-heading">
                  <span className="about-text-space">We look</span> where institutional research
                  arrives last, and we stay long enough for the business rather than the market to
                  decide the outcome. Every mandate begins with your objectives
                  <span className="text-light-gray">
                    {" "}
                    &mdash; your horizon, your other assets, and what you would find hard to live
                    through &mdash; before a single position is discussed.
                  </span>
                </h2>
              </div>
            </div>
            <div className="about-01-main-wrap">
              <div className="about-01-left">
                <div className="about-01-video-wrap">
                  <div className="image-wrap">
                    <img
                      src="/option-3/about-image-01.avif"
                      loading="lazy"
                      alt="The Moneybee research desk"
                      className="fit-cover"
                    />
                  </div>
                </div>
                <div className="about-01-details">
                  <div className="about-01-text-wrap">
                    <div className="paragraph-02 text-dark-gray">
                      Moneybee is a Mumbai-based investment practice with decades of capital-markets
                      experience behind it. Our strength is bottom-up research into businesses that
                      are too small, too dull, or too early to attract a crowd, which is usually
                      where the mispricing sits.
                    </div>
                    <div className="paragraph-02 text-dark-gray">
                      We hold a focused portfolio because a focused portfolio can be explained.
                      Every position has a thesis, a price we were willing to pay, and a reason to
                      remain.
                    </div>
                  </div>
                  <div className="about-01-button-wrap">
                    <ButtonTwo href="#research">More about Moneybee</ButtonTwo>
                  </div>
                </div>
              </div>
              <div className="about-01-right">
                <div className="about-01-image-wrap">
                  <div className="image-wrap">
                    <img
                      src="/option-3/about-image-02.avif"
                      loading="lazy"
                      alt="An investor meeting in progress"
                      className="fit-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Research */}
      <section className="project-01" id="research">
        <div className="container">
          <div className="section-header-wrap">
            <div className="section-header-left">
              <SectionBadge>Selected research</SectionBadge>
              <div className="section-heading-wrap">
                <SplitHeading
                  lead="A record of ideas found"
                  tail="before the market noticed"
                />
              </div>
            </div>
            <div className="section-header-right">
              <div className="paragraph-02 text-dark-gray">
                Past positions, described as we described them at the time. Holdings shown are
                illustrative and are not a recommendation.
              </div>
            </div>
          </div>
        </div>
        <div className="project-01-list-wrap">
          {PROJECTS.map((project, index) => (
            <div key={project.title} className={`project-01-list${index === 1 ? " _02" : ""}`}>
              <div className="container">
                <a href="#insights" className="project-01-link w-inline-block">
                  <div className="project-01-item">
                    <div className="project-01-left">
                      <div className="text-style-h4">{project.index}</div>
                      <div className="project-01-details">
                        <div className="project-01-text-wrap">
                          <div className="text-style-h3">{project.title}</div>
                          <div className="paragraph-02 text-dark-gray">{project.copy}</div>
                        </div>
                        <ButtonThree>Read the note</ButtonThree>
                      </div>
                    </div>
                    <div className="project-01-right">
                      <div className="project-01-info-wrap">
                        <div className="project-01-tag-wrap">
                          {project.tags.map((tag) => (
                            <div key={tag} className="project-01-tag">
                              <div className="tagline">{tag}</div>
                            </div>
                          ))}
                        </div>
                        <div className="project-01-year">
                          <div className="tagline">&copy;</div>
                          <div className="tagline">{project.year}</div>
                        </div>
                      </div>
                      <div className="project-01-image-wrap">
                        {project.images.map((image, imageIndex) => (
                          <div
                            key={image}
                            className={`project-01-thumbnail-wrap${
                              imageIndex === 1 ? " _02" : imageIndex === 2 ? " _03" : ""
                            }`}
                          >
                            <div className="image-wrap">
                              <img src={image} loading="lazy" alt="" className="fit-cover" />
                            </div>
                            <div className="project-arrow small">
                              <img src="/option-3/arrow-plan.svg" loading="lazy" alt="" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        <a href="#insights" className="project-large-link w-inline-block">
          <div className="project-link-arrow-block">
            <div className="project-link-arrow-group">
              <img src="/option-3/arrow-project.svg" loading="lazy" alt="" className="project-link-arrow" />
              <img src="/option-3/arrow-project.svg" loading="lazy" alt="" className="project-link-arrow" />
            </div>
          </div>
          <div className="project-link-text-wrap">
            <div className="project-link-text-group">
              <div className="text-style-h1 project-link-title">Read All Research</div>
              <div className="text-style-h1 project-link-title">Read All Research</div>
            </div>
          </div>
        </a>
      </section>

      {/* -------------------------------------------------------------- Growth */}
      <section className="growth">
        <div className="container">
          <div className="growth-wrap">
            <div className="section-header-wrap center">
              <div className="section-header-content">
                <SectionBadge>Where returns come from</SectionBadge>
                <div className="section-heading-wrap space">
                  <SplitHeading lead="A consistent process" tail="across market cycles" center />
                </div>
                <div className="section-subtitle-wrap">
                  <div className="paragraph-02 text-center text-dark-gray">
                    Returns follow from decisions, and decisions follow from a process. Ours has
                    three parts, applied in the same order to every position we take, in every kind
                    of market.
                  </div>
                </div>
              </div>
            </div>
            <div className="growth-main-wrap">
              <div className="growth-circle-wrap">
                {/* Intrinsic dimensions are required here, not optional. The ring
                    is sized `width: 100%` with automatic height, so until the
                    file loads the element is zero-high — and a zero-high lazy
                    image never comes near enough to the viewport to start
                    loading. Declaring the ratio breaks that deadlock and
                    reserves the space besides. */}
                <img
                  src="/option-3/circle.avif"
                  width={1174}
                  height={1148}
                  loading="lazy"
                  alt=""
                  className="growth-circle"
                />
                <div className="circle-text-wrap">
                  <div className="text-style-h2 circle-text">
                    Investment
                    <br />
                    Process
                  </div>
                </div>
              </div>
              <div className="growth-list-wrap">
                {GROWTH.map((item, index) => (
                  <div key={item.title} className="growth-list">
                    <div className={`growth-icon-block${index === 1 ? " button-02-text-group" : ""}`}>
                      <img src={item.icon} loading="lazy" alt="" className="growth-icon" />
                    </div>
                    <div className={`growth-details${index === 1 ? " _02" : ""}`}>
                      <div
                        className={`growth-badge-wrap${index === 1 ? " _02" : index === 2 ? " _03" : ""}`}
                      >
                        <div className="tagline text-center">{item.badge}</div>
                      </div>
                      <div className="growth-text-wrap">
                        <div className="text-style-h3">{item.title}</div>
                        <div className="paragraph-02 text-dark-gray">{item.copy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Feedback */}
      <section className="feedback">
        <div className="container">
          <div className="feedback-wrap">
            <div className="section-header-wrap center">
              <div className="section-header-content medium">
                <SectionBadge>Investor perspective</SectionBadge>
                <div className="section-heading-wrap space">
                  <SplitHeading
                    lead="Trusted by families and institutions"
                    tail="through more than one cycle"
                    center
                  />
                </div>
              </div>
            </div>
            <div className="feedback-main-wrap">
              <FeedbackColumn items={FEEDBACK_A} variant="_01" />
              <div className="feedback-column">
                <div className="ceo-wrap">
                  <div className="ceo-image-wrap">
                    <img src="/option-3/ceo-image.avif" loading="lazy" alt="" className="ceo-image" />
                    <div className="ceo-image-shadow" />
                  </div>
                  <div className="ceo-text-wrap">
                    <h4 className="h4 text-center">
                      &ldquo;We would rather be judged on the quality of our reasoning than on any
                      single year. Explain the decision, and the returns can look after
                      themselves.&rdquo;
                    </h4>
                  </div>
                  <div className="feedback-statistics-wrap">
                    {STATISTICS.map((stat) => (
                      <Statistic key={stat.label} {...stat} />
                    ))}
                  </div>
                  <div className="ceo-badge">
                    <div className="tagline text-center">CIO of Moneybee</div>
                  </div>
                </div>
              </div>
              <FeedbackColumn items={FEEDBACK_B} variant="_03" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Pricing */}
      <section className="pricing-01" id="mandates">
        <div className="container">
          <div className="pricing-01-wrap">
            <div className="section-header-wrap">
              <div className="section-header-left">
                <SectionBadge>Mandates</SectionBadge>
                <div className="section-heading-wrap">
                  <SplitHeading lead="Structures built around" tail="objectives, not products" />
                </div>
              </div>
              <div className="section-header-right">
                <div className="paragraph-02 text-dark-gray">
                  Minimums are set by regulation. Everything above them is a conversation about what
                  you are trying to achieve.
                </div>
              </div>
            </div>
            <div className="pricing-01-main-wrap">
              <div className="plan-switch-wrap">
                <div className={`tagline month${yearly ? "" : " is-active"}`}>Fixed fee</div>
                <button
                  type="button"
                  className={`plan-switch${yearly ? " is-yearly" : ""}`}
                  role="switch"
                  aria-checked={yearly}
                  aria-label="Switch between fixed fee and performance-linked structures"
                  onClick={() => setYearly((value) => !value)}
                >
                  <div className="switch-ball" />
                </button>
                <div className={`tagline year${yearly ? " is-active" : ""}`}>Performance linked</div>
              </div>
              <div className="plan-wrap">
                <PlanList plans={PLANS_STANDARD} hidden={yearly} />
                <PlanList plans={PLANS_PERFORMANCE} hidden={!yearly} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="faq-wrap">
            <div className="section-header-wrap center">
              <div className="section-header-content small">
                <SectionBadge>Investor questions</SectionBadge>
                <div className="section-heading-wrap space">
                  <h2 className="h2 text-center">Got questions?</h2>
                </div>
                <div className="section-subtitle-wrap">
                  <div className="paragraph-02 text-dark-gray text-center">
                    The things investors ask before they place a mandate, answered plainly. Anything
                    not covered here is worth a conversation.
                  </div>
                </div>
              </div>
            </div>
            <div className="faq-main-wrap">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Blog */}
      <section className="blog-01" id="insights">
        <div className="container">
          <div className="blog-01-wrap">
            <div className="section-header-wrap">
              <div className="section-header-left large">
                <SectionBadge>From the investment desk</SectionBadge>
                <div className="section-heading-wrap">
                  <SplitHeading lead="Notes from the desk" tail="on markets and businesses" />
                </div>
              </div>
              <div className="section-header-right">
                <div className="section-subtitle-wrap space">
                  <div className="paragraph-02 text-dark-gray">
                    What we are reading, what we are questioning, and what we have changed our mind
                    about.
                  </div>
                </div>
                <div className="section-button-right">
                  <ButtonTwo href="#insights">Read all notes</ButtonTwo>
                </div>
              </div>
            </div>
            <div className="blog-01-main-wrap">
              <div className="blog-collection-list">
                {POSTS.map((post) => (
                  <div key={post.title}>
                    <a href="#insights" className="blog-link w-inline-block">
                      <div className="blog-01-card">
                        <div className="blog-01-image-wrap">
                          <div className="image-wrap">
                            <img src={post.image} loading="lazy" alt="" className="fit-cover" />
                          </div>
                        </div>
                        <div className="blog-01-details">
                          <div className="blog-01-text-wrap">
                            <div className="paragraph-02 text-dark-gray">{post.date}</div>
                            <div className="text-style-h4 blog-title">{post.title}</div>
                          </div>
                          <ButtonThree>Read more</ButtonThree>
                        </div>
                        <div className="blog-tag" style={{ backgroundColor: post.tone }}>
                          <div className="tagline text-center">{post.tag}</div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="cta" id="contact">
        <div className="container">
          <div className="cta-wrap">
            <div className="badge">
              <img src="/option-3/magic-wand.svg" loading="lazy" alt="" className="badge-icon" />
              <div className="tagline">Portfolio Management &amp; AIF</div>
            </div>
            <div className="cta-text-wrap">
              <div className="section-heading-wrap">
                <h1 className="text-center">Begin with a conversation, not a product</h1>
              </div>
              <div className="section-subtitle-wrap">
                <div className="paragraph-01 cta-subtitle">
                  We would like to understand your objectives before discussing ours. No allocation
                  is discussed in a first meeting.
                </div>
              </div>
            </div>
            <div className="cta-button-wrap">
              <CtaButton tone="white">Book a Consultation</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Footer */}
      <section className="footer">
        <div className="container">
          <div className="footer-wrap">
            <div className="footer-main-wrap">
              <div className="footer-left">
                <div className="footer-details">
                  <a href="#top" aria-label="Moneybee home" className="footer-brand w-inline-block">
                    <Logo tone="light" />
                  </a>
                  <div className="paragraph-02 text-light-gray">
                    Moneybee Securities Pvt Ltd. Portfolio Management Services, Alternative
                    Investment Fund, and Investment Advisory. Mumbai, India.
                  </div>
                </div>
                <div className="footer-newsletter-wrap">
                  <div className="text-style-h4 menu-title">
                    Quarterly letters from the investment desk
                  </div>
                  <div className="newsletter-form-block">
                    <form onSubmit={(event) => event.preventDefault()}>
                      <div className="newsletter-form-group">
                        <input
                          className="newsletter-input-filed w-input"
                          maxLength={256}
                          name="email"
                          placeholder="Enter email"
                          type="email"
                          aria-label="Email address"
                          required
                        />
                        <input type="submit" className="newsletter-submit-button w-button" value="Subscribe" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="footer-right">
                {FOOTER_COLUMNS.map((column, index) => (
                  <div key={column.title} className="footer-menu-column">
                    {/* The reference tags only the first of these as a heading. */}
                    <div className={`${index === 0 ? "h4" : "text-style-h4"} menu-title`}>
                      {column.title}
                    </div>
                    <div className="footer-menu-list">
                      {column.links.map((link) => (
                        <a key={link.label} href={link.href} className="footer-menu">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-copyright-wrap">
              <div className="paragraph-02 copyright-text">
                &copy; 2026 Moneybee Securities Pvt Ltd. All rights reserved.
              </div>
              <div className="paragraph-02 copyright-text">
                Investments are subject to market risk. Read all documents carefully.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
