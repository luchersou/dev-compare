import type { DailyDownloads } from "@/types/downloads"

import { groupByWeek, summarizeDownloads } from "./downloads"

function makeDays(count: number): DailyDownloads[] {
  return Array.from({ length: count }, (_, i) => ({
    day: `day-${i}`,
    downloads: 1,
  }))
}

describe("summarizeDownloads", () => {
  it("sums the last 7, 30 and all days", () => {
    expect(summarizeDownloads(makeDays(365))).toEqual({
      weekly: 7,
      monthly: 30,
      yearly: 365,
    })
  })

  it("handles ranges shorter than a week", () => {
    expect(summarizeDownloads(makeDays(3))).toEqual({ weekly: 3, monthly: 3, yearly: 3 })
  })
})

describe("groupByWeek", () => {
  it("builds full weeks aligned to the latest day", () => {
    const weeks = groupByWeek(makeDays(365))

    expect(weeks).toHaveLength(52)
    expect(weeks.every((w) => w.downloads === 7)).toBe(true)
    expect(weeks.at(-1)?.week).toBe("day-358")
    expect(weeks[0].week).toBe("day-1")
  })

  it("returns an empty list when there is less than a week of data", () => {
    expect(groupByWeek(makeDays(6))).toEqual([])
  })
})
