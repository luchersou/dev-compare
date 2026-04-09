/**
 * @jest-environment node
 */
import { GET } from "./route"

// ─── GET /api/search ──────────────────────────────────────────────────────────

const makeRequest = (query?: string) => {
  const url = query
    ? `http://localhost/api/search?q=${encodeURIComponent(query)}`
    : "http://localhost/api/search"
  return new Request(url)
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe("GET /api/search", () => {
  it("returns an empty array when query param is missing", async () => {
    const res = await GET(makeRequest())
    const data = await res.json()
    expect(data).toEqual([])
  })

  it("maps npm response objects to NpmSearchResult shape", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        objects: [
          { package: { name: "react", description: "A JS library", version: "18.0.0" } },
          { package: { name: "vue", description: "The progressive framework", version: "3.0.0" } },
        ],
      }),
    } as any)

    const res = await GET(makeRequest("react"))
    const data = await res.json()

    expect(data).toEqual([
      { name: "react", description: "A JS library", version: "18.0.0" },
      { name: "vue", description: "The progressive framework", version: "3.0.0" },
    ])
  })

  it("returns an empty array when the npm API responds with an error", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any)

    const res = await GET(makeRequest("react"))
    const data = await res.json()

    expect(data).toEqual([])
  })

  it("returns an empty array when fetch throws", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("network error"))

    const res = await GET(makeRequest("react"))
    const data = await res.json()

    expect(data).toEqual([])
  })
})