import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNavigation from "@/components/ui/site-navigation";

const sections = {
  pms: { title: "Portfolio Management Services", description: "Our PMS page is being prepared. Contact the Moneybee team for product information." },
  aif: { title: "Alternative Investment Fund", description: "Our AIF page is being prepared. Contact the Moneybee team for product information." },
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
