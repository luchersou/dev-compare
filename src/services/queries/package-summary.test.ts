/**
 * @jest-environment node
 */
import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloadsByPeriod } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage } from "@/services/api/npm"

import { fetchPopularPackages, getPackageSummary } from "./package-summary"

jest.mock("@/services/api/bundlephobia")
jest.mock("@/services/api/downloads")
jest.mock("@/services/api/github")
jest.mock("@/services/api/npm")

const npm = jest.mocked(fetchNpmPackage)
const downloads = jest.mocked(fetchDownloadsByPeriod)
const bundle = jest.mocked(fetchBundle)
const github = jest.mocked(fetchGithubRepo)

beforeEach(() => {
  jest.clearAllMocks()
  downloads.mockResolvedValue(9000)
  bundle.mockResolvedValue({ size: 1000, gzip: 400 } as never)
  github.mockResolvedValue({ stargazers_count: 77 } as never)
})

describe("getPackageSummary", () => {
  it("combines weekly downloads, gzip size and stars", async () => {
    npm.mockResolvedValue({
      name: "zod",
      version: "3.0.0",
      description: "schemas",
      repository: { type: "git", url: "https://github.com/colinhacks/zod" },
    })

    await expect(getPackageSummary("zod")).resolves.toEqual({
      name: "zod",
      version: "3.0.0",
      description: "schemas",
      weeklyDownloads: 9000,
      gzipSize: 400,
      stars: 77,
    })
    expect(downloads).toHaveBeenCalledWith("zod", "last-week")
    expect(github).toHaveBeenCalledWith("colinhacks/zod")
  })

  it("leaves missing optional data undefined and skips GitHub without a repo", async () => {
    npm.mockResolvedValue({ name: "x", version: "1.0.0" })
    downloads.mockResolvedValue(null)
    bundle.mockResolvedValue(null)

    const summary = await getPackageSummary("x")

    expect(github).not.toHaveBeenCalled()
    expect(summary.weeklyDownloads).toBeUndefined()
    expect(summary.gzipSize).toBeUndefined()
    expect(summary.stars).toBeUndefined()
  })
})

describe("fetchPopularPackages", () => {
  it("drops packages whose npm lookup fails and keeps the rest in order", async () => {
    const failing = POPULAR_PACKAGES[0]
    npm.mockImplementation(async (name) => {
      if (name === failing) throw new Error("registry down")
      return { name, version: "1.0.0" }
    })

    const results = await fetchPopularPackages()

    expect(results.map((r) => r.name)).toEqual(POPULAR_PACKAGES.filter((n) => n !== failing))
  })
})
