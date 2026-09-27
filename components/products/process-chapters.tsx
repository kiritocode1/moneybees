import ChapterFigure from "@/components/option-one/chapter-figure";
import ChapterStack from "@/components/option-one/chapter-stack";
import { PROCESS_CHAPTERS } from "@/lib/insights";

/** Monitor, due diligence and sectors as the three orange chapter cards. Shown on the product pages. */
export default function ProcessChapters() {
  return (
    <ChapterStack
      content={{
        "The letter": PROCESS_CHAPTERS.monitor,
        "The method": PROCESS_CHAPTERS.diligence,
        "The record": PROCESS_CHAPTERS.sectors,
      }}
      figures={{
        "The letter": <ChapterFigure kind="beacon" tone="orange" />,
        "The method": <ChapterFigure kind="bars" tone="ink" />,
        "The record": <ChapterFigure kind="pie" tone="grey" />,
      }}
    />
  );
}
