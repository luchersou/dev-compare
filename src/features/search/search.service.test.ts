import { searchPackages } from "./search.service"

// ─── searchPackages ───────────────────────────────────────────────────────────

beforeEach(() => {
  jest.resetAllMocks()
})

describe("searchPackages", () => {
  it("calls the internal search API with the encoded query", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    global.fetch = fetchMock

    await searchPackages("@types/react & more")

    expect(fetchMock).toHaveBeenCalledWith("/api/search?q=%40types%2Freact%20%26%20more")
  })

  it("returns the parsed results", async () => {
    const results = [
      { name: "react", description: "A JS library", version: "19.0.0" },
      { name: "preact", description: "Fast 3kB alternative", version: "10.0.0" },
    ]
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => results,
    } as Response)

    await expect(searchPackages("react")).resolves.toEqual(results)
  })

  it("throws with the status code when the response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response)

    await expect(searchPackages("react")).rejects.toThrow("Search failed: 503")
  })

  it("propagates network errors", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("network error"))

    await expect(searchPackages("react")).rejects.toThrow("network error")
  })
})
