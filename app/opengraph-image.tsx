import { ImageResponse } from "next/og";

export const alt =
  "X9Elysium — Shopify Plus consulting for Canadian and US retailers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(5,150,105,0.10), transparent 50%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "26px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#34d399",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "9999px",
              background: "#34d399",
              boxShadow: "0 0 18px #34d399",
            }}
          />
          X9Elysium
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              fontSize: "84px",
              lineHeight: 1.05,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Shopify Plus consulting for</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #34d399 0%, #10b981 60%, #059669 100%)",
                backgroundClip: "text",
                color: "transparent",
                fontWeight: 500,
              }}
            >
              ambitious North American retailers.
            </span>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Store audits · Platform migrations · Custom apps · Unified commerce
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#737373",
            fontSize: "22px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <span>50+ stores delivered</span>
            <span style={{ color: "#404040" }}>·</span>
            <span>$12M+ GMV managed</span>
            <span style={{ color: "#404040" }}>·</span>
            <span>98% client retention</span>
          </div>
          <div style={{ color: "#34d399", fontWeight: 500 }}>
            x9elysium.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
