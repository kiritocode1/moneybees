import Link from "next/link";
import s from "./preview.module.css";

export default function PreviewFooter() {
  return (
    <footer id="footer" className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.footerIntro}>
          <Link href="/" aria-label="Moneybee home" className={s.footerLogo}>
            <svg viewBox="200 205 1455 445" width="200" height="62" aria-hidden="true">
              <image href="/moneybee-logo.svg" width="2048" height="897" />
            </svg>
          </Link>
          <h2>Talk to Moneybee.</h2>
          <Link href="/#contact" className={s.footerContact}>Contact Us</Link>
        </div>
        <nav className={s.footerLinks} aria-label="Footer navigation">
          <div><span>Investments</span><Link href="/pms">PMS</Link><Link href="/aif">AIF</Link><Link href="/#philosophy">Our Approach</Link></div>
          <div><span>Moneybee</span><Link href="/#about">About Us</Link><Link href="/careers">Careers</Link><Link href="/#contact">Contact Us</Link></div>
          <div><span>Group companies</span><a href="https://moneybeeadvisors.com/">Investment Banking</a><a href="https://moneybeesecurities.in/">Stock Broking</a><span className={s.footerLogin} aria-disabled="true">Client Login <small>Coming soon</small></span></div>
        </nav>
      </div>
      <svg viewBox="0 0 2048 1472" className={s.footerArtwork} aria-hidden="true">
        <image href="/preview/moneybee/footer-pulse.svg" width="2048" height="1472" />
      </svg>
      <div className={s.footerBottom}><span>Moneybee</span><span>Portfolio management & alternative investments</span><a href="#performance">Back to top</a></div>
    </footer>
  );
}
