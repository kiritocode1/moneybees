import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { AifPanel, PmsPanel } from "@/components/fact-sections/products-section";
import SiteNavigation from "@/components/ui/site-navigation";

/** Pages with real content: the two products. */
const products: Record<string, ComponentType> = { pms: PmsPanel, aif: AifPanel };

const sections = {
  pms: { title: "Portfolio Management Services", description: "" },
  aif: { title: "Alternative Investment Fund", description: "" },
  careers: { title: "Careers", description: "Our careers portal is being prepared. Contact the Moneybee team for career enquiries." },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const content = sections[section as keyof typeof sections];
  const Product = products[section];

  if (Product) {
    return (
      <SiteNavigation>
        <main className="option-one min-h-svh bg-white px-[max(32px,calc((100vw_-_1480px)/2))] pt-[180px] pb-[120px] text-black max-[600px]:px-[22px] max-[600px]:pt-[130px]">
          <div className="max-w-[1000px]">
            <Product />
            <Link
              href="/#contact"
              className="mt-[56px] inline-block bg-[#F7A11A] px-6 py-3 text-black focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Schedule a conversation
            </Link>
          </div>
        </main>
      </SiteNavigation>
    );
  }

  return (
    <SiteNavigation>
      <main className="min-h-svh bg-white px-6 pt-52 pb-24 text-black md:px-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl text-5xl md:text-7xl">{content.title}</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">{content.description}</p>
          <Link href="/#contact" className="mt-10 inline-block bg-[#F9A11B] px-6 py-3 text-black focus-visible:outline-2 focus-visible:outline-offset-4">Contact Us</Link>
        </div>
      </main>
    </SiteNavigation>
  );
}
