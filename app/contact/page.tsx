import { ContactHero, DesksSection, GrievanceSection, GroupSection, OfficersSection } from "@/components/contact/contact-sections";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Contact" };

/**
 * /contact: how to reach us, who to write to for each business, the PMS
 * officers, the grievance path and the group's other businesses. Facts come
 * from the decks via lib/contact.ts.
 */
export default function ContactPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-black">
        <ContactHero />
        <DesksSection />
        <OfficersSection />
        <GrievanceSection />
        <GroupSection />
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
