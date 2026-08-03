import type { Metadata } from "next";
import { Instrument_Serif, Rethink_Sans } from "next/font/google";
import "./globals.css";

// Project default body face. Individual directions may override this in their
// own layout — see app/option-N/layout.tsx.
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

export const metadata: Metadata = {
  title: {
    default: "Moneybee",
    template: "%s · Moneybee",
  },
  description: "Design directions for the Moneybee website.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rethinkSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
