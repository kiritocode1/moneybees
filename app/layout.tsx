import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Rethink_Sans } from "next/font/google";
import { CONTACT, REGISTRATIONS } from "@/lib/insights";
import "./globals.css";

// Project default body faces.
const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/** The small uppercase mono labels, after antimetal's .text-eyebrow. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE_URL = "https://www.moneybee.in";
const SITE_DESCRIPTION =
  "SEBI-registered portfolio manager (INP000001959) in Mumbai, investing in Indian small and mid caps through Moneybee PMS and Flyingbee, a Category III AIF.";

/** Only the production deployment is indexed; previews and local builds stay out of search. */
const indexable = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Moneybee | Small-cap PMS and Category III AIF, Mumbai",
    template: "%s | Moneybee",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Moneybee",
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    siteName: "Moneybee",
    locale: "en_IN",
    type: "website",
    url: "/",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
  },
};

/** The firm as structured data, built from the deck's contact slide (lib/insights.ts CONTACT). */
const organization = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Moneybee",
  legalName: CONTACT.company,
  url: SITE_URL,
  logo: `${SITE_URL}/moneybee-logo.svg`,
  description: SITE_DESCRIPTION,
  // The PMS registration only; the AIF number stays off structured data.
  identifier: { "@type": "PropertyValue", propertyID: "SEBI PMS registration", value: REGISTRATIONS[0][1] },
  telephone: CONTACT.phones.map((phone) => phone.replace(/\s/g, "")),
  email: CONTACT.emails.map(([, email]) => email),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${CONTACT.address[0]} ${CONTACT.address[1].replace(/, Mumbai.*$/, "")}`,
    addressLocality: "Mumbai",
    postalCode: "400013",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: "IN",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rethinkSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="option-one-shell min-h-full bg-white font-sans text-black">
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
