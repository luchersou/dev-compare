import { ImageResponse } from "next/og"

import { OG_SIZE, OgCard } from "@/components/og/og-card"

export const alt = "DevCompare — Compare npm packages side by side"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="npm package comparison" title="Compare npm packages" subtitle="Side by side, with a verdict." />,
    size
  )
}
