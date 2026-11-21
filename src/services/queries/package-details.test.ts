/**
 * @jest-environment node
 */
import { notFound } from "next/navigation"

import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloads } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage, fetchPublishedAt, PackageNotFoundError } from "@/services/api/npm"

import { getPackageDetails, getPackageDetailsOrNotFound } from "./package-details"

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND")
  }),
}))
jest.mock("@/services/api/bundlephobia")
jest.mock("@/services/api/downloads")
jest.mock("@/services/api/github")
jest.mock("@/services/api/npm", () => ({
  ...jest.requireActual("@/services/api/npm"),
  fetchNpmPackage: jest.fn(),
  fetchPublishedAt: jest.fn(),
}))

const npm = jest.mocked(fetchNpmPackage)
const publishedAt = jest.mocked(fetchPublishedAt)
const downloads = jest.mocked(fetchDownloads)
const bundle = jest.mocked(fetchBundle)
const github = jest.mocked(fetchGithubRepo)

// getPackageDetails is wrapped in React cache(); give each test its own name
// so a memoized result can never leak between tests.
let seq = 0
const uniqueName = () => `pkg-${++seq}`

beforeEach(() => {
  jest.clearAllMocks()
  publishedAt.mockResolvedValue("2024-05-01T00:00:00.000Z")
  downloads.mockResolvedValue({ weekly: 1, monthly: 2, yearly: 3, history: [] })
  bundle.mockResolvedValue({ size: 1000, gzip: 400 } as never)
  github.mockResolvedValue({
    stargazers_count: 50,
    forks_count: 5,
    open_issues_count: 2,
    html_url: "https://github.com/owner/repo",
    pushed_at: "2024-06-01T00:00:00.000Z",
  } as never)
})

describe("getPackageDetails", () => {
  it("merges npm, downloads, bundle and GitHub data", async () => {
    const name = uniqueName()
    npm.mockResolvedValue({
      name,
      version: "1.2.3",
      description: "desc",
      license: "MIT",
      author: { name: "Ada", email: "ada@example.com" },
      repository: { type: "git", url: "git+https://github.com/owner/repo.git" },
    })

    const details = await getPackageDetails(name)

    expect(github).toHaveBeenCalledWith("owner/repo")
    expect(details).toMatchObject({
      name,
      version: "1.2.3",
      author: "Ada",
      repository: "https://github.com/owner/repo",
      publishedAt: "2024-05-01T00:00:00.000Z",
      downloads: { weekly: 1, monthly: 2, yearly: 3 },
      bundle: { size: 1000, gzip: 400 },
      github: {
        stars: 50,
        forks: 5,
        issues: 2,
        url: "https://github.com/owner/repo",
        lastCommit: "2024-06-01T00:00:00.000Z",
      },
    })
  })

  it("keeps a string author and skips GitHub for non-GitHub repositories", async () => {
    const name = uniqueName()
    npm.mockResolvedValue({
      name,
      version: "1.0.0",
      author: "Grace <grace@example.com>",
      repository: "https://gitlab.com/owner/repo",
    })

    const details = await getPackageDetails(name)

    expect(github).not.toHaveBeenCalled()
    expect(details.author).toBe("Grace <grace@example.com>")
    expect(details.repository).toBe("https://gitlab.com/owner/repo")
    expect(details.github).toBeUndefined()
  })

  it("leaves optional sections undefined when their sources return nothing", async () => {
    const name = uniqueName()
    npm.mockResolvedValue({ name, version: "1.0.0", repository: "github:owner/repo" })
    downloads.mockResolvedValue(null)
    bundle.mockResolvedValue(null)
    github.mockResolvedValue(null)
    publishedAt.mockResolvedValue(undefined)

    const details = await getPackageDetails(name)

    expect(details.downloads).toBeUndefined()
    expect(details.bundle).toBeUndefined()
    expect(details.github).toBeUndefined()
    expect(details.publishedAt).toBeUndefined()
  })
})

describe("getPackageDetailsOrNotFound", () => {
  it("renders not-found for unknown packages", async () => {
    const name = uniqueName()
    npm.mockRejectedValue(new PackageNotFoundError(name))

    await expect(getPackageDetailsOrNotFound(name)).rejects.toThrow("NEXT_NOT_FOUND")
    expect(notFound).toHaveBeenCalled()
  })

  it("rethrows other failures for the error boundary", async () => {
    const name = uniqueName()
    npm.mockRejectedValue(new Error("registry down"))

    await expect(getPackageDetailsOrNotFound(name)).rejects.toThrow("registry down")
    expect(notFound).not.toHaveBeenCalled()
  })
})
