/**
 * @jest-environment node
 */
import { fetchGithubRepo } from "./github"

const ORIGINAL_TOKEN = process.env.GITHUB_TOKEN

function mockFetch(init: { ok: boolean; status?: number; headers?: Record<string, string>; body?: unknown }) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: init.ok,
    status: init.status ?? 200,
    headers: new Headers(init.headers),
    json: async () => init.body,
  })
  global.fetch = fetchMock
  return fetchMock
}

let warn: jest.SpyInstance

beforeEach(() => {
  jest.restoreAllMocks()
  warn = jest.spyOn(console, "warn").mockImplementation(() => {})
  jest.spyOn(console, "error").mockImplementation(() => {})
  delete process.env.GITHUB_TOKEN
})

afterAll(() => {
  process.env.GITHUB_TOKEN = ORIGINAL_TOKEN
})

describe("fetchGithubRepo", () => {
  it("returns the repo and sends no Authorization header without a token", async () => {
    const fetchMock = mockFetch({ ok: true, body: { stargazers_count: 10 } })

    await expect(fetchGithubRepo("facebook/react")).resolves.toEqual({ stargazers_count: 10 })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.github.com/repos/facebook/react")
    expect(init.headers).not.toHaveProperty("Authorization")
  })

  it("authenticates with GITHUB_TOKEN when set", async () => {
    process.env.GITHUB_TOKEN = "secret"
    const fetchMock = mockFetch({ ok: true, body: {} })

    await fetchGithubRepo("facebook/react")

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer secret")
  })

  it("returns null and hints at the token when rate limited", async () => {
    mockFetch({ ok: false, status: 403, headers: { "x-ratelimit-remaining": "0" } })

    await expect(fetchGithubRepo("facebook/react")).resolves.toBeNull()
    expect(warn.mock.calls[0][0]).toContain("set GITHUB_TOKEN")
  })

  it("returns null without the hint on other failures", async () => {
    mockFetch({ ok: false, status: 404, headers: { "x-ratelimit-remaining": "42" } })

    await expect(fetchGithubRepo("owner/missing")).resolves.toBeNull()
    expect(warn.mock.calls[0][0]).not.toContain("GITHUB_TOKEN")
  })

  it("returns null on a network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline"))

    await expect(fetchGithubRepo("facebook/react")).resolves.toBeNull()
  })
})
