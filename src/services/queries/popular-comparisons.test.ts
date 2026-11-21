/**
 * @jest-environment node
 */
import { POPULAR_COMPARISONS } from "@/config/popular-comparisons"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloadsByPeriod } from "@/services/api/downloads"

import { fetchPopularComparisons } from "./popular-comparisons"

jest.mock("@/services/api/bundlephobia")
jest.mock("@/services/api/downloads")

const downloads = jest.mocked(fetchDownloadsByPeriod)
const bundle = jest.mocked(fetchBundle)

beforeEach(() => {
  jest.clearAllMocks()
})

describe("fetchPopularComparisons", () => {
  it("returns a snapshot for both sides of every pair", async () => {
    downloads.mockImplementation(async (name) => name.length * 100)
    bundle.mockImplementation(async (name) => ({ size: 0, gzip: name.length }) as never)

    const results = await fetchPopularComparisons()

    expect(results).toHaveLength(POPULAR_COMPARISONS.length)
    const [first] = results
    expect(first.pair).toEqual(POPULAR_COMPARISONS[0])
    expect(first.a).toEqual({
      name: first.pair.a,
      downloads: first.pair.a.length * 100,
      bundleSize: first.pair.a.length,
    })
  })

  it("falls back to null per metric instead of dropping the pair", async () => {
    // Even if a source rejects instead of resolving null, the card still renders.
    downloads.mockRejectedValue(new Error("npm down"))
    bundle.mockResolvedValue(null)

    const results = await fetchPopularComparisons()

    expect(results).toHaveLength(POPULAR_COMPARISONS.length)
    for (const { a, b } of results) {
      expect(a).toMatchObject({ downloads: null, bundleSize: null })
      expect(b).toMatchObject({ downloads: null, bundleSize: null })
    }
  })
})
