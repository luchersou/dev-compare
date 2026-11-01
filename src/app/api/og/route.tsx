import { ImageResponse } from "next/og"

import { OG_SIZE, OgCard } from "@/components/og/og-card"

const MAX_NAME_LENGTH = 214 // npm's package name limit

function readName(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.slice(0, MAX_NAME_LENGTH)
}

// /api/og?a=react&b=vue  -> comparison card
// /api/og?name=react     -> package card
export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const a = readName(searchParams, "a")
  const b = readName(searchParams, "b")
  const name = readName(searchParams, "name")

  const card =
    a && b ? (
      <OgCard eyebrow="Head-to-head" title={`${a} vs ${b}`} subtitle="Which npm package should you pick?" />
    ) : name ? (
      <OgCard eyebrow="npm package" title={name} subtitle="Downloads, bundle size and GitHub activity" />
    ) : (
      <OgCard eyebrow="npm package comparison" title="Compare npm packages" />
    )

  return new ImageResponse(card, {
    ...OG_SIZE,
    headers: { "Cache-Control": "public, max-age=86400, immutable" },
  })
}
