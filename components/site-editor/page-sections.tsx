import { Fragment } from "react";
import { FounderSection as FounderProfile, StorySection } from "@/components/about-v2/about-sections";
import { ApproachWheelSection } from "@/components/aif-v3/approach-wheel";
import { KeyTermsSection } from "@/components/aif-v3/key-terms-section";
import { OpportunitySection } from "@/components/aif-v3/opportunity-section";
import { PoolingSection } from "@/components/aif-v3/pooling-section";
import { StructureSection } from "@/components/aif-v3/structure-section";
import { CriteriaLists } from "@/components/approach-v3/criteria-lists";
import { PhilosophyDiscs } from "@/components/approach-v3/philosophy-discs";
import { RiskRings } from "@/components/approach-v3/risk-rings";
import { CareersJobBoard } from "@/components/careers/careers-job-board";
import { CareersIntro, CareersOfficeSection, CareersResumeSection } from "@/components/careers/careers-page-sections";
import { CaseStudyList, TimelineSection as CaseTimeline } from "@/components/case-studies/case-study-sections";
import { ComparisonSection, ExplanationSection } from "@/components/compare/compare-sections";
import { AboutHero } from "@/components/about-v3/about-sections";
import { AreasSection } from "@/components/about-v3/areas-section";
import { RecognitionSection } from "@/components/about-v3/recognition-section";
import { TimelineSection } from "@/components/about-v3/timeline-section";
import { EnquirySection, OfficeSection } from "@/components/contact-v2/contact-sections";
import { PageEndDoors } from "@/components/cta/page-end-doors";
import FounderSection from "@/components/fact-sections/founder-section";
import PicksSection from "@/components/fact-sections/picks-section";
import TeamCarousel from "@/components/fact-sections/team-carousel";
import RecordSection from "@/components/fact-sections/record-section";
import { HeroSection } from "@/components/hero/hero-sections";
import { LoginsSection } from "@/components/investor-centre/investor-sections";
import { DocumentCards } from "@/components/investor-v3/document-cards";
import { FaqSection } from "@/components/home/faq-section";
import { GetStartedSection } from "@/components/home/get-started-section";
import { TextSection } from "@/components/home/text-section";
import { TwoWaysSection } from "@/components/home/two-ways-section";
import { AifPerformanceSection } from "@/components/performance/performance-sections";
import { WealthDiscs } from "@/components/performance-v3/wealth-discs";
import { TholosSection } from "@/components/philosophy-tholos/tholos-section";
import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PhilosophySection } from "@/components/pms-v3/philosophy";
import { PortfolioApproachSection } from "@/components/pms-v3/portfolio-stats";
import ProductHero from "@/components/pms-v3/product-hero";
import { RiskSection } from "@/components/pms-v3/risk-blocks";
import { SelectionSection } from "@/components/pms-v3/selection-lines";
import { WhySection } from "@/components/pms-v3/why-sticky";
import type { PageSection } from "@/lib/pages/load";
import { ABOUT_PHOTO, FOUNDER_PORTRAIT, type PlacedPicture } from "@/lib/pages/about-content";
import { FOUNDER_PHOTO, type Picture } from "@/lib/pages/home-content";
import type { CareerRole } from "@/lib/career-roles";
import type { CaseStudyEntry } from "@/lib/case-studies";
import type { TeamMember } from "@/lib/insights";
import type { DocumentGroup } from "@/lib/investor-centre";
import type { AifFigures } from "@/lib/site/figures";
import { fillContent, type PmsFigures } from "@/lib/site/tokens";
import type { Media } from "@/payload-types";
import { PreviewSection } from "./preview-section";

/** An uploaded portrait, or the current one when none is uploaded. */
const portrait = (photo: number | Media | null | undefined): Picture =>
  typeof photo === "object" && photo?.url ? { url: photo.url, alt: photo.alt ?? "" } : FOUNDER_PHOTO;

/** An uploaded picture with its own crop, or `fallback` when none is uploaded. */
const placed = (photo: number | Media | null | undefined, fallback: PlacedPicture): PlacedPicture =>
  typeof photo === "object" && photo?.url ? { src: photo.url, alt: photo.alt ?? "" } : fallback;

/** What a page's sections draw from besides their own words: fact sheet figures and the lists edited in /admin. */
type Sources = {
  figures: PmsFigures;
  aif?: AifFigures;
  team?: readonly TeamMember[];
  documents?: readonly DocumentGroup[];
  studies?: readonly CaseStudyEntry[];
  roles?: readonly CareerRole[];
};

/** `loginsAbove`: the page already shows the logins, so the closing cards leave Client Login out. */
function Section({ section, figures, aif, team, documents, studies, roles, loginsAbove }: { section: PageSection; loginsAbove: boolean } & Sources) {
  switch (section.blockType) {
    case "hero":
      return <HeroSection content={section} />;
    case "record":
      // The menu's Performance link lands here.
      return (
        <div id="performance">
          <RecordSection content={section} figures={figures} />
        </div>
      );
    case "twoWays":
      return <TwoWaysSection content={section} />;
    case "founder":
      return <FounderSection content={section} photo={portrait(section.photo)} />;
    case "getStarted":
      return <GetStartedSection content={section} />;
    case "faq":
      return <FaqSection content={section} />;
    case "text":
      return <TextSection content={section} />;
    case "productHero":
      return (
        <ProductHero
          data={{
            mark: section.mark,
            title: section.title2 ? [section.title1, section.title2] : [section.title1],
            sentence: section.sentence,
            actions: section.actions?.map(({ label, link, outline }) => ({ label, href: link, outline: Boolean(outline) })),
            figures: section.figures ?? [],
          }}
        />
      );
    case "pmsPerformance":
      return <PerformanceChart content={section} figures={figures} />;
    case "wealthGrowth":
      return <WealthDiscs content={section} figures={figures} />;
    case "whyPms":
      return <WhySection content={section} />;
    case "philosophy":
      return <PhilosophySection content={section} />;
    case "selection":
      return <SelectionSection content={section} />;
    case "portfolioApproach":
      return <PortfolioApproachSection content={section} />;
    case "risks":
      return <RiskSection content={section} />;
    case "closingDoors":
      return <PageEndDoors login={!loginsAbove} />;
    case "aboutHero":
      return <AboutHero content={section} photo={placed(section.photo, ABOUT_PHOTO)} />;
    case "founderProfile":
      return <FounderProfile content={section} photo={placed(section.photo, FOUNDER_PORTRAIT)} />;
    case "teamCarousel":
      return <TeamCarousel team={team} content={section} />;
    case "groupAreas":
      return <AreasSection content={section} />;
    case "recognition":
      return <RecognitionSection content={section} />;
    case "timeline":
      return <TimelineSection content={section} />;
    case "story":
      return <StorySection content={section} />;
    case "logins":
      return <LoginsSection content={section} />;
    case "documentCards":
      return <DocumentCards content={section} groups={documents} />;
    case "enquiry":
      return <EnquirySection content={section} />;
    case "office":
      return <OfficeSection />;
    case "coreDiscs":
      return <PhilosophyDiscs content={section} />;
    case "principles":
      return <TholosSection content={section} />;
    case "criteria":
      return <CriteriaLists content={section} />;
    case "riskRings":
      return <RiskRings content={section} />;
    case "comparison":
      return <ComparisonSection content={section} />;
    case "explanation":
      return <ExplanationSection content={section} />;
    case "aifPerformance":
      return <AifPerformanceSection content={section} figures={aif} />;
    case "opportunity":
      return <OpportunitySection content={section} />;
    case "pooling":
      return <PoolingSection content={section} />;
    case "structure":
      return <StructureSection content={section} />;
    case "approachWheel":
      return <ApproachWheelSection content={section} />;
    case "keyTerms":
      return <KeyTermsSection content={section} />;
    case "caseStudies":
      return <CaseStudyList studies={studies} />;
    case "caseTimeline":
      return <CaseTimeline content={section} studies={studies} />;
    case "picks":
      return <PicksSection content={section} />;
    case "careersIntro":
      return <CareersIntro content={section} />;
    case "jobBoard":
      return <CareersJobBoard content={section} roles={roles} />;
    case "careersOffice":
      return <CareersOfficeSection content={section} photo={typeof section.photo === "object" && section.photo?.url ? { src: section.photo.url, alt: section.photo.alt ?? "" } : undefined} />;
    case "careersResume":
      return <CareersResumeSection content={section} />;
  }
}

/**
 * A page's sections in the order /admin gives them, with fact-sheet figures
 * filled into the words. Hidden sections are left out, except in a draft,
 * where each section is wrapped for /admin's preview so staff can click it.
 */
export function PageSections({ sections, draft, ...sources }: { sections: PageSection[]; draft: boolean } & Sources) {
  const loginsAbove = sections.some((section) => section.blockType === "logins" && !section.hidden);
  return sections.map((section, index) => {
    const key = section.id ?? index;
    const body = <Section section={fillContent(section, sources.figures)} {...sources} loginsAbove={loginsAbove} />;
    if (!draft) return section.hidden ? null : <Fragment key={key}>{body}</Fragment>;
    return (
      <PreviewSection key={key} index={index} count={sections.length} kind={section.blockType} hidden={Boolean(section.hidden)}>
        {body}
      </PreviewSection>
    );
  });
}
