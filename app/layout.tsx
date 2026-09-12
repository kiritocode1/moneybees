import type { Metadata } from "next";
import { Instrument_Serif, Rethink_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Moneybee | Investment Management",
    template: "%s · Moneybee",
  },
  description: "Moneybee Portfolio Management Services and Alternative Investment Fund.",
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
      <body className="option-one-shell min-h-full bg-white font-sans text-black">
        {children}
      </body>
    </html>
  );
}
