import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import { Activities } from "./collections/Activities";
import { Applications } from "./collections/Applications";
import { AuditLog } from "./collections/AuditLog";
import { Contacts } from "./collections/Contacts";
import { Deals } from "./collections/Deals";
import { Emails } from "./collections/Emails";
import { EmailTemplates } from "./collections/EmailTemplates";
import { Enquiries } from "./collections/Enquiries";
import { Entities } from "./collections/Entities";
import { FactSheets } from "./collections/FactSheets";
import { Investors } from "./collections/Investors";
import { LoginChallenges } from "./collections/LoginChallenges";
import { Media } from "./collections/Media";
import { Metrics } from "./collections/Metrics";
import { Playbooks } from "./collections/Playbooks";
import { Products } from "./collections/Products";
import { Tasks } from "./collections/Tasks";
import { TeamMembers } from "./collections/TeamMembers";
import { Documents } from "./collections/Documents";
import { CaseStudies } from "./collections/CaseStudies";
import { Openings } from "./collections/Openings";
import { Users } from "./collections/Users";
import { CrmSettings } from "./globals/CrmSettings";
import { HomePage } from "./globals/HomePage";
import { PmsPage } from "./globals/PmsPage";
import { AboutPage } from "./globals/AboutPage";
import { AifPage } from "./globals/AifPage";
import { CareersPage } from "./globals/CareersPage";
import { CaseStudiesPage } from "./globals/CaseStudiesPage";
import { ContactPage } from "./globals/ContactPage";
import { OurPhilosophyPage } from "./globals/OurPhilosophyPage";
import { PicksPage } from "./globals/PicksPage";
import { PmsVsAifPage } from "./globals/PmsVsAifPage";
import { InvestorCentrePage } from "./globals/InvestorCentrePage";
import { SiteDetails } from "./globals/SiteDetails";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * The Moneybee backend (.plannotator/backend-plan/plan.md). While the platform
 * is being built it runs on Neon and Vercel Blob; before go-live the same
 * config moves to PlanetScale Postgres and S3 in Mumbai by changing the
 * connection string and the storage adapter, nothing else. Email goes out
 * through Resend once RESEND_API_KEY is set; until then Payload logs it.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    // Moneybee's name, icon and share card everywhere Payload would show its own.
    meta: {
      titleSuffix: " | Moneybee",
      description: "Moneybee's admin: enquiries, clients, fact sheets and the website.",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }],
      openGraph: { siteName: "Moneybee", title: "Moneybee admin", description: "Moneybee's admin.", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
    },
    // Our screens, built with Fluid Functionalism; record editing stays Payload's own.
    components: {
      graphics: { Logo: "/components/admin/brand#Logo", Icon: "/components/admin/brand#Icon" },
      providers: ["/components/admin/admin-provider#AdminProvider"],
      beforeNavLinks: ["/components/admin/nav-links#NavLinks"],
      views: {
        dashboard: { Component: "/components/admin/today/today-view#TodayView" },
        inbox: { Component: "/components/admin/inbox/inbox-view#InboxView", path: "/inbox", exact: true },
        enquiry: { Component: "/components/admin/inbox/enquiry-view#EnquiryView", path: "/inbox/:id" },
        hiring: { Component: "/components/admin/hiring/hiring-view#HiringView", path: "/hiring", exact: true },
        applicant: { Component: "/components/admin/hiring/applicant-view#ApplicantView", path: "/hiring/:id" },
        guide: { Component: "/components/admin/guide/guide-view#GuideView", path: "/guide", exact: true },
        website: { Component: "/components/admin/website/website-view#WebsiteView", path: "/website", exact: true },
      },
    },
  },
  // Sidebar order follows this list: Publishing (fact sheets first), then Settings.
  // The CRM and hiring collections are out of the sidebar (group: false); the Desk links reach them.
  collections: [
    FactSheets,
    Products,
    Metrics,
    Media,
    TeamMembers,
    Documents,
    CaseStudies,
    Openings,
    Playbooks,
    EmailTemplates,
    Investors,
    Users,
    AuditLog,
    Enquiries,
    Contacts,
    Entities,
    Deals,
    Activities,
    Tasks,
    Emails,
    Applications,
    LoginChallenges,
  ],
  globals: [HomePage, PmsPage, AifPage, PmsVsAifPage, OurPhilosophyPage, AboutPage, CaseStudiesPage, PicksPage, InvestorCentrePage, ContactPage, CareersPage, SiteDetails, CrmSettings],
  // The one place Payload's name appears in its interface text, and the
  // section picker on editable pages, which Payload calls blocks.
  i18n: { translations: { en: { general: { payloadSettings: "Settings" }, fields: { searchForBlock: "Search for a section" } } } },
  email: process.env.RESEND_API_KEY
    ? resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: process.env.MAIL_FROM_ADDRESS ?? "info@moneybee.in", defaultFromName: "Moneybee" })
    : undefined,
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    migrationDir: path.resolve(dirname, "migrations"),
    // Schema changes go through committed migrations, never an automatic push.
    push: false,
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Media is public, and email clients need the file's own address, not one routed through Payload.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
