import { ImageResponse } from "next/og";

export const alt = "Ashitano Robotics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          color: "#111111",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, color: "#666666" }}>Ashitano Robotics, Inc.</div>
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
          Ashitano Robotics
        </div>
      </div>
    ),
    size,
  );
}
