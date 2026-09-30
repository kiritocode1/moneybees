import { ImageResponse } from "next/og";

export const alt = "Moneybee: Finding value where the market is not looking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card: white field, ink wordmark, the hero line and one orange rule. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#000000",
          padding: "88px 96px",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>Moneybee</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 120, height: 8, background: "#F6A11A", marginBottom: 40 }} />
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 900 }}>
            Finding value where the market is not looking
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "rgba(0,0,0,.6)" }}>
          Small-cap PMS and Category III AIF, Mumbai
        </div>
      </div>
    ),
    size,
  );
}
