import type { DailyDownloads } from "@/types/downloads"

import { fetchDownloads, fetchDownloadsByPeriod, groupByWeek, summarizeDownloads } from "./downloads"

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

describe("fetchDownloadsByPeriod", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
  })
  afterEach(() => jest.restoreAllMocks())

  it("returns the point count for the period", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ downloads: 1234 }),
    })
    global.fetch = fetchMock

    await expect(fetchDownloadsByPeriod("@scope/pkg", "last-week")).resolves.toBe(1234)
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.npmjs.org/downloads/point/last-week/%40scope%2Fpkg"
    )
  })

  it("returns null on a failed response or network error", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 })
    await expect(fetchDownloadsByPeriod("nope", "last-week")).resolves.toBeNull()

    global.fetch = jest.fn().mockRejectedValue(new Error("offline"))
    await expect(fetchDownloadsByPeriod("nope", "last-week")).resolves.toBeNull()
  })
})

describe("fetchDownloads", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {})
  })
  afterEach(() => jest.restoreAllMocks())

  it("summarizes the yearly range and builds the weekly history", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ downloads: makeDays(14) }),
    })

    await expect(fetchDownloads("react")).resolves.toEqual({
      weekly: 7,
      monthly: 14,
      yearly: 14,
      history: [
        { week: "day-0", downloads: 7 },
        { week: "day-7", downloads: 7 },
      ],
    })
  })

  it("returns null when the range is empty or the request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ downloads: [] }),
    })
    await expect(fetchDownloads("brand-new")).resolves.toBeNull()

    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })
    await expect(fetchDownloads("react")).resolves.toBeNull()
  })
})
