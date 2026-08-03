"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import "./option-1.css";

const pillars = [
  ["↻", "Stability", "A steady investment discipline designed to endure changing markets."],
  ["◇", "Trust", "Clear communication and decisions that can be explained."],
  ["⌁", "Growth", "Patient ownership of businesses with room to compound."],
  ["◎", "Insight", "Independent research beyond the most widely covered names."],
] as const;

const services = [
  ["Estate & legacy planning", "01"],
  ["Portfolio management", "02"],
  ["Private investment advisory", "03"],
  ["Tax optimisation strategies", "04"],
] as const;

const metrics = [
  ["Support", "24/7", "A direct line to the team responsible for your relationship."],
  ["Confidential", "100%", "Private conversations, clear reporting and careful handling of information."],
  ["Goal", "₹1B", "A long-term ambition built on patient capital and trusted relationships."],
] as const;

const testimonials = [
  {
    name: "Family office investor",
    role: "Mumbai",
    quote: "Our clients consistently recognise us for excellence in service, innovation and results. A more perfect rating reflects the trust we have built across borders.",
  },
  {
    name: "Investment advisory client",
    role: "India",
    quote: "Moneybee takes the time to explain the decision, the risk and what would cause the view to change. That clarity matters as much as the outcome.",
  },
] as const;

function Wordmark({ light = true }: { light?: boolean }) {
  return (
    <a className={`ob-wordmark ${light ? "is-light" : ""}`} href="#top" aria-label="Moneybee home">
      Moneybee <span />
    </a>
  );
}

function CornerLink({ children, href = "#contact" }: { children: React.ReactNode; href?: string }) {
  return (
    <a className="ob-corner-link" href={href}>
      <i>↗</i>{children}
    </a>
  );
}

export default function Option1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main id="top" className="option-one ob-site">
      <section className="ob-hero">
        <Image
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=90"
          alt="Contemporary office interior"
          fill
          priority
          sizes="100vw"
        />
        <div className="ob-hero-wash" />
        <header className="ob-header">
          <Wordmark />
          <nav aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#values">Values</a>
            <a href="#clients">Clients</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="ob-header-actions">
            <a href="https://www.moneybee.in/register.php" target="_blank" rel="noreferrer">Investor login</a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span /><span />
            </button>
          </div>
        </header>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="ob-mobile-menu"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
            >
              {["Services", "Values", "Clients", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}<span>↗</span></a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="ob-hero-content">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE_OUT }}
          >
            Build, preserve, and<br />grow your wealth
          </motion.h1>
          <motion.div
            className="ob-hero-note"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.24, ease: EASE_OUT }}
          >
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=85"
              alt="Moneybee advisor"
              width={94}
              height={68}
            />
            <p>Global wealth expertise focused on disciplined, long-term outcomes.</p>
          </motion.div>
          <div className="ob-hero-meta">
            <span>Portfolio Management Services</span>
            <span>Alternative Investment Fund</span>
            <span>Mumbai, India</span>
          </div>
        </div>
        <CornerLink>Start a private conversation</CornerLink>
      </section>

      <section className="ob-strategy">
        <div className="ob-blue-glow" />
        <div className="ob-strategy-title">
          <span>Tailored financial</span>
          <div>
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=360&q=85"
              alt="Advisors in discussion"
              width={150}
              height={82}
            />
            <span>investment</span>
          </div>
          <span>strategies</span>
        </div>
        <p>We provide clarity in complex markets, balancing protection with ambition and creating a portfolio architecture shaped around your life.</p>
      </section>

      <section className="ob-pillars" aria-label="Moneybee principles">
        {pillars.map(([icon, title, copy], index) => (
          <article key={title}>
            <span className="ob-pillar-number">0{index + 1}</span>
            <i>{icon}</i>
            <div><h2>{title}</h2><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <section className="ob-case-study">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=90"
          alt="Moneybee office"
          fill
          sizes="100vw"
        />
        <div className="ob-case-wash" />
        <div className="ob-case-content">
          <h2>Case studies</h2>
          <p>A private family portfolio designed to protect liquidity while creating room for patient ownership.</p>
          <CornerLink>View the case study</CornerLink>
        </div>
        <div className="ob-case-index"><span>01</span><span>02</span><span>03</span></div>
      </section>

      <section id="services" className="ob-services">
        <div className="ob-blue-glow ob-blue-glow--services" />
        <p className="ob-side-note">For every stage of wealth, one coordinated view.</p>
        <div className="ob-services-main">
          <h2>Complete<br />financial &amp;<br />wealth advisory</h2>
          <div className="ob-services-intro">
            <p>Every relationship begins with understanding. We bring portfolio management, private investment advice and long-range planning into one clear picture.</p>
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=90"
              alt="Private client meeting"
              width={310}
              height={220}
            />
          </div>
          <div className="ob-service-list">
            {services.map(([title, number]) => (
              <a href="#contact" key={title}><span>{title}</span><i>↗</i><small>{number}</small></a>
            ))}
          </div>
        </div>
        <Image
          className="ob-services-thumb"
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=85"
          alt="Investment review"
          width={280}
          height={190}
        />
      </section>

      <section className="ob-guidance">
        <div className="ob-guidance-copy">
          <h2>Trusted financial guidance worldwide, delivering clarity with integrity and discretion.</h2>
          <a href="#contact">Meet Moneybee <span>↗</span></a>
          <dl>
            <div><dt>500K+ AUM</dt><dd>Managed through a disciplined and measured process.</dd></div>
            <div><dt>50+ Years</dt><dd>Across market cycles and capital-markets experience.</dd></div>
            <div><dt>20+ Case Studies</dt><dd>Different objectives, each treated on its own terms.</dd></div>
            <div><dt>95% Retention</dt><dd>Relationships designed to last beyond one market cycle.</dd></div>
          </dl>
        </div>
        <div className="ob-guidance-image">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1500&q=90"
            alt="Advisors reviewing a client portfolio"
            fill
            sizes="50vw"
          />
        </div>
      </section>

      <section id="values" className="ob-values">
        <div className="ob-blue-glow ob-blue-glow--values" />
        <p className="ob-values-intro">Long relationships are built through clear principles, not short-term promises.</p>
        <h2>Core values:<br />Integrity &amp; <span><Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=330&q=85" alt="Moneybee advisor" width={170} height={82} /></span><br />excellence</h2>
        <p className="ob-values-copy">These values shape our approach to wealth management and every conversation around risk, transparency and long-term outcomes.</p>
        <div className="ob-metrics">
          {metrics.map(([label, value, copy]) => (
            <div key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></div>
          ))}
        </div>
        <div className="ob-value-cards">
          <article><i>⌁</i><div><h3>Shaping financial futures</h3><p>Thoughtful structures that bring current priorities and future goals into one plan.</p></div></article>
          <article><i>♧</i><div><h3>Built on principles</h3><p>Clear reasoning, responsible stewardship and communication that earns confidence.</p></div></article>
        </div>
      </section>

      <section id="clients" className="ob-clients">
        <div className="ob-client-rings" />
        <h2>Trusted by global clients</h2>
        <div className="ob-testimonials">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name}>
              <div><span>{testimonial.name}</span><small>{testimonial.role}</small><b>★★★★★</b></div>
              <blockquote>{testimonial.quote}</blockquote>
              <p>Private wealth relationship</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ob-results">
        <Image
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2200&q=90"
          alt="Market data"
          fill
          sizes="100vw"
        />
        <div className="ob-results-wash" />
        <Image className="ob-results-image ob-results-image--left" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85" alt="Advisor working" width={380} height={240} />
        <Image className="ob-results-image ob-results-image--right" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=85" alt="Moneybee office" width={380} height={240} />
        <div className="ob-results-content"><p>Investment management that can be explained</p><h2>Results that build trust</h2><span>Disciplined decisions, open communication and a relationship designed for the long term.</span><CornerLink>Start a conversation</CornerLink></div>
      </section>

      <footer id="contact" className="ob-footer">
        <div className="ob-footer-top">
          <Wordmark light={false} />
          <p>Private investment management<br />for considered capital.</p>
          <a className="ob-footer-badge" href="mailto:info@moneybee.in">MB</a>
        </div>
        <div className="ob-footer-grid">
          <div><span>Visit</span><p>Mumbai, Maharashtra<br />India</p></div>
          <div><span>Contact</span><a href="mailto:info@moneybee.in">info@moneybee.in</a><a href="tel:+912200000000">+91 22 0000 0000</a></div>
          <div><span>Explore</span><a href="#services">Services</a><a href="#values">Our values</a><a href="#clients">Client stories</a></div>
          <div><span>Regulatory</span><a href="#contact">Investor Charter</a><a href="#contact">Disclosures</a><a href="#contact">Grievance redressal</a></div>
        </div>
        <div className="ob-footer-bottom"><p>Investments in securities are subject to market risks. Read all related documents carefully before investing.</p><div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Back to top ↑</a></div></div>
      </footer>
    </main>
  );
}
