import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GEOPlusMarketing — AI Search Visibility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city, service } = await params;
  const displayCity = toDisplayName(city);
  const displayService = toDisplayName(service);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: "16px",
              color: "#93c5fd",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontWeight: 600,
            }}
          >
            {displayCity} — AI Search Visibility
          </div>
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Is Your {displayService}</span>
          <span>Business Visible to AI?</span>
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          80% of searchers use AI summaries. Find out if ChatGPT, Perplexity,
          and Google AI can find your business.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "40px",
            gap: "32px",
          }}
        >
          {[
            { stat: "61%", label: "CTR Drop" },
            { stat: "80%", label: "Use AI Search" },
            { stat: "$750B", label: "At Risk by 2028" },
          ].map(({ stat, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "36px", fontWeight: 800, color: "#3b82f6" }}>
                {stat}
              </span>
              <span style={{ fontSize: "14px", color: "#64748b" }}>{label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#475569",
          }}
        >
          GEOPlusMarketing.com
        </div>
      </div>
    ),
    { ...size }
  );
}
