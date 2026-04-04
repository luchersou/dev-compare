import { BundlePhobiaResponse } from "@/types/bundlephobia"

const BASE_BUNDLE = "https://bundlephobia.com/api"

export async function fetchBundle(name: string): Promise<BundlePhobiaResponse | null> {
  try {
    const res = await fetch(`${BASE_BUNDLE}/size?package=${name}`, {
      next: { revalidate: 60 * 60 }, // Revalidate every 1 hour
    })

    if (!res.ok) {
      console.warn(`[bundle] Failed for ${name}: ${res.status}`)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`[bundle] Error for ${name}`, error)
    return null
  }
}