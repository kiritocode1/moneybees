import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { OptionSwitcher } from "@/components/option-switcher";
import "./option-three.css";

// The reference is set entirely in Inter Tight. `option-three.css` reads the
// family through --font-family--font, so pointing that variable at the loaded
// face is the only wiring needed.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moneybee | Research-led portfolio management",
  description:
    "Moneybee manages capital through fundamental research, valuation discipline, and long holding periods.",
};

export default function OptionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${interTight.variable} option-three bg-white text-black`}>
      {children}
      <OptionSwitcher current="option-3" />
    </div>
  );
}
