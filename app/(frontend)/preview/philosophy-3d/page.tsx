import PerformanceChart from "@/components/pms-v2/performance-chart";
import { Pillars3DSection } from "./pillars-3d";

/** PREVIEW ONLY. The proposed /our-approach pair: the PMS returns chart, then the rebuilt 3D pillars. */
export default function Philosophy3DPreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <Pillars3DSection />
      <div className="h-[40svh]" />
    </main>
  );
}
