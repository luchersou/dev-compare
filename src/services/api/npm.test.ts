/**
 * @jest-environment node
 */
import { fetchNpmPackage, fetchPublishedAt, PackageNotFoundError } from "./npm"

function mockFetch(response: { ok?: boolean; status?: number; body?: unknown }) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: async () => response.body,
  })
  global.fetch = fetchMock
  return fetchMock
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
})

describe("fetchNpmPackage", () => {
  it("requests the latest manifest with the name encoded", async () => {
    const fetchMock = mockFetch({ body: { name: "@tanstack/react-query", version: "5.0.0" } })

    const manifest = await fetchNpmPackage("@tanstack/react-query")

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://registry.npmjs.org/%40tanstack%2Freact-query/latest"
    )
    expect(manifest).toEqual({ name: "@tanstack/react-query", version: "5.0.0" })
  })

  it("throws PackageNotFoundError on 404", async () => {
    mockFetch({ ok: false, status: 404 })

    await expect(fetchNpmPackage("nope")).rejects.toBeInstanceOf(PackageNotFoundError)
  })

  it("throws a generic error on other failures", async () => {
    mockFetch({ ok: false, status: 503 })

    const error = await fetchNpmPackage("react").catch((e) => e)
    expect(error).not.toBeInstanceOf(PackageNotFoundError)
    expect(error.message).toContain("503")
  })
})

describe("fetchPublishedAt", () => {
  it("returns the date of the exact name match, not the first result", async () => {
    mockFetch({
      body: {
        objects: [
          { package: { name: "react-dom", date: "2024-01-01" } },
          { package: { name: "react", date: "2024-02-02" } },
        ],
      },
    })

    await expect(fetchPublishedAt("react")).resolves.toBe("2024-02-02")
  })

  it("returns undefined when the package is not in the results", async () => {
    mockFetch({ body: { objects: [{ package: { name: "react-dom", date: "2024-01-01" } }] } })

    await expect(fetchPublishedAt("react")).resolves.toBeUndefined()
  })

  it("returns undefined on a failed response or network error", async () => {
    mockFetch({ ok: false, status: 500 })
    await expect(fetchPublishedAt("react")).resolves.toBeUndefined()

    global.fetch = jest.fn().mockRejectedValue(new Error("offline"))
    await expect(fetchPublishedAt("react")).resolves.toBeUndefined()
  })
})
