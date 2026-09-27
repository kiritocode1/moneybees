import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BODY, BUTTON, COLUMN, EYEBROW, HEADING } from "@/components/hero/tokens";
import SiteFooter from "@/components/footer/site-footer";
import AifPage from "@/components/products/aif-page";
import PmsPage from "@/components/products/pms-page";
import SiteNavigation from "@/components/ui/site-navigation";

const sections = {
  pms: { title: "Portfolio Management Services" },
  aif: { title: "Alternative Investment Fund" },
  careers: { title: "Careers" },
} as const;

type Section = keyof typeof sections;
const isSection = (value: string): value is Section => value in sections;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return isSection(section) ? { title: sections[section].title } : {};
}

/** /pms and /aif are the product pages; /careers holds its place until there is content for it. */
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  if (section === "pms") return <PmsPage />;
  if (section === "aif") return <AifPage />;

  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <section className={`${COLUMN} min-h-[70svh] pt-[220px] pb-[120px] max-md:pt-[150px]`}>
          <span className={`${EYEBROW} text-black/60`}>Careers</span>
          <h1 className={`mt-[18px] ${HEADING} text-[clamp(3rem,1.6rem+4.6vw,5.4rem)]`}>Work with us</h1>
          <p className={`mt-8 max-w-[560px] text-black/70 ${BODY}`}>
            Our careers page is being prepared. Until then, write to us and tell us what you would like to work on.
          </p>
          <Link href="/#contact" className={`${BUTTON} mt-12 bg-black text-white hover:bg-black/85`}>
            Contact us
          </Link>
        </section>
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our philosophy", "/#philosophy-pillars"],
            ["Our process", "/#research"],
            ["Performance", "/#performance"],
            ["Our strategies", "/#invest"],
            ["Team", "/#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
