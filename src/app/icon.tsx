import { ImageResponse } from "next/og";

import { OG_COLORS } from "@/config/brand-colors";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: OG_COLORS.background,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="2" y1="7" x2="20" y2="7" stroke={OG_COLORS.accent} stroke-width="2" stroke-linecap="round"/>
          <polyline points="15,3 20,7 15,11" stroke={OG_COLORS.accent} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

          <line x1="20" y1="15" x2="2" y2="15" stroke={OG_COLORS.accent} stroke-width="2" stroke-linecap="round"/>
          <polyline points="7,11 2,15 7,19" stroke={OG_COLORS.accent} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
    ),
    { ...size }
  );
}