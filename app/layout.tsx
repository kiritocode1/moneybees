import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

// Project default body face. Individual directions may override this in their
// own layout — see app/option-N/layout.tsx.
const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink-sans",
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
      className={`${rethinkSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
