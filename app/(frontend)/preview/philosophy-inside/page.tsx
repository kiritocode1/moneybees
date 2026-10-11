import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PillarsDrawnSection } from "../philosophy-3d/pillars-drawn";

/** PREVIEW ONLY. The drawn 3D pillars seen from inside the colonnade, for comparison with /preview/philosophy-drawn. */
export default function PhilosophyInsidePreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <PillarsDrawnSection view="inside" />
      <div className="h-[40svh]" />
    </main>
  );
}
