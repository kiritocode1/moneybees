import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import Link from "@/components/transition/transition-link";
import { TEXT, type TextContent } from "@/lib/pages/home-content";

/**
 * A heading and paragraphs that staff add from /admin, in the FAQ section's
 * layout: label and heading in the narrow column, the paragraphs beside them,
 * then an optional outlined button. An empty line in the text starts a new
 * paragraph.
 */
export function TextSection({ content = TEXT }: { content?: TextContent }) {
  const paragraphs = (content.body ?? "").split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const { action = {} } = content;
  return (
    <section className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-[.8fr_1.2fr] gap-12 py-[120px] max-[900px]:grid-cols-1 max-[600px]:py-[80px]`}>
        <Rise onView>
          {content.label ? <span className={`${EYEBROW} text-black/60`}>{content.label}</span> : null}
          <h2 className={`${content.label ? "mt-[18px]" : ""} ${SUBHEAD} whitespace-pre-line`}>{content.heading}</h2>
        </Rise>
        <Rise onView delay={0.08}>
          <div className="flex flex-col gap-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={`${BODY} whitespace-pre-line text-black/70`}>
                {paragraph}
              </p>
            ))}
            {action.label && action.link ? (
              <Link href={action.link} className={`${BUTTON} mt-4 w-fit border border-dashed border-black/10 text-black hover:bg-black/[.03]`}>
                {action.label}
                <CornerBrackets />
              </Link>
            ) : null}
          </div>
        </Rise>
      </div>
    </section>
  );
}
