import type {
  DailyDownloads,
  NpmDownloadsRange,
  NpmDownloadsResponse,
  WeeklyDownloads,
} from "@/types/downloads"

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

export async function fetchDownloadsRange(name: string): Promise<DailyDownloads[] | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/downloads/range/last-year/${encodeURIComponent(name)}`,
      { next: { revalidate: 60 * 60 } } // Revalidate every 1 hour
    )

    if (!res.ok) {
      console.warn(`[npm] Failed download range for ${name}: ${res.status}`)
      return null
    }

    const data = (await res.json()) as NpmDownloadsRange
    return data.downloads
  } catch (error) {
    console.error(`[npm] Error fetching download range for ${name}`, error)
    return null
  }
}

function sum(days: DailyDownloads[]): number {
  return days.reduce((total, day) => total + day.downloads, 0)
}

// Same windows as the npm point endpoints: last 7, 30 and 365 days.
export function summarizeDownloads(days: DailyDownloads[]) {
  return {
    weekly: sum(days.slice(-7)),
    monthly: sum(days.slice(-30)),
    yearly: sum(days),
  }
}

// Groups daily counts into 7-day buckets aligned to the most recent day, so
// the last point is always a full week. Leftover days at the start are dropped.
export function groupByWeek(days: DailyDownloads[]): WeeklyDownloads[] {
  const weeks: WeeklyDownloads[] = []

  for (let end = days.length; end - 7 >= 0; end -= 7) {
    const chunk = days.slice(end - 7, end)
    weeks.unshift({ week: chunk[0].day, downloads: sum(chunk) })
  }

  return weeks
}

export async function fetchDownloads(name: string) {
  const days = await fetchDownloadsRange(name)
  if (!days || days.length === 0) return null

  return {
    ...summarizeDownloads(days),
    history: groupByWeek(days),
  }
}
