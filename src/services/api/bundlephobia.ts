import { BundlePhobiaResponse } from "@/types/bundlephobia"

const BASE_BUNDLE = "https://bundlephobia.com/api"

export async function fetchBundle(name: string) {
  const res = await fetch(`${BASE_BUNDLE}/size?package=${name}`)

  if (!res.ok) return null

  return (await res.json()) as BundlePhobiaResponse
}