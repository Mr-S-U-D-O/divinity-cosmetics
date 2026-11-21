import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Divinity Cosmetics — Facial-Grade Marula & Baobab Body Lotion (400ml)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

let chloeFontPromise: Promise<Buffer> | null = null;

function getChloeFont(): Promise<Buffer> {
  if (!chloeFontPromise) {
    chloeFontPromise = readFile(
      join(process.cwd(), "src/app/fonts/chloe/Chloe-Regular.otf")
    );
  }
  return chloeFontPromise;
}

export default async function Image() {
  const chloeFont = await getChloeFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fcfbf9",
          color: "#1a1a1a",
          padding: "54px 64px",
          border: "14px solid #1a1a1a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="#3d7b32"
                strokeWidth="2.2"
              />
              <path
                d="M18 8C13.5 13 13 21 18 28C23 21 22.5 13 18 8Z"
                fill="#3d7b32"
              />
            </svg>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#3d7b32",
              }}
            >
              Divinity Cosmetics · South Africa
            </span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              border: "2px solid #1a1a1a",
              backgroundColor: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            400ML · R400 ZAR
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontFamily: "Chloe",
              fontSize: "74px",
              lineHeight: 1.04,
              color: "#111111",
              letterSpacing: "-0.02em",
            }}
          >
            Facial-Grade Botanical Body Care.
          </div>
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#333333",
              maxWidth: "880px",
            }}
          >
            Cold-pressed Limpopo Marula &amp; wild-harvested Baobab seed oils
            for 24-hour skin barrier sealing and 90-day cellular renewal.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #1a1a1a",
            paddingTop: "24px",
            fontSize: "17px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span>24-Hour Climate Seal · Non-Evaporating</span>
          <span style={{ color: "#3d7b32" }}>
            shopdivinitycosmetics.co.za
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Chloe",
          data: chloeFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
