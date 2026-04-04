import { NpmDownloadsResponse } from "@/types/downloads"

const BASE_URL = "https://api.npmjs.org"

type Period = "last-week" | "last-month" | "last-year"

export async function fetchDownloadsByPeriod(
  name: string,
  period: Period
): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/downloads/point/${period}/${encodeURIComponent(name)}`,
      { next: { revalidate: 60 * 60 } } // Revalidate every 1 hour
    )

    if (!res.ok) {
      console.warn(`[npm] Failed ${period} for ${name}: ${res.status}`)
      return null
    }

    const data = (await res.json()) as NpmDownloadsResponse
    return data.downloads
  } catch (error) {
    console.error(`[npm] Error fetching ${period} for ${name}`, error)
    return null
  }
}

export async function fetchDownloads(name: string) {
  const periods: Period[] = ["last-week", "last-month", "last-year"]

  const results = await Promise.all(
    periods.map((period) => fetchDownloadsByPeriod(name, period))
  )

  const [weekly, monthly, yearly] = results

  return {
    weekly: weekly ?? 0,
    monthly: monthly ?? 0,
    yearly: yearly ?? 0,
  }
}