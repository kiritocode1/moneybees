import InsightCards from "@/components/insight-cards/insight-cards";

/**
 * Titles are kept identical to the source capture on purpose: the only way to
 * check fidelity is to diff this against the video frame for frame, and that
 * needs the same words in the same places. Swapping in Moneybee copy is a
 * one-line change once the interaction is signed off.
 */
export default function InsightCardsPreview() {
  return (
    <main style={{ minHeight: "100svh", background: "#28282a" }}>
      <InsightCards
        items={[
          { title: "Productive days", figure: "bars" },
          { title: "Spending patterns", figure: "pie" },
          { title: "Busiest hours", figure: "beacon" },
          { title: "Wealth comparison", figure: "wealth" },
          { title: "Research selection", figure: "research" },
          { title: "Historical picks", figure: "pyramid" },
          { title: "Business growth", figure: "growth" },
          { title: "Risk & process", figure: "risk" },
          { title: "Fund allocation", figure: "allocation" },
        ]}
      />
    </main>
  );
}
