import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { searchPackages } from "./search.service"
import { useSearch } from "./use-search"

// ─── mocks ────────────────────────────────────────────────────────────────────

jest.mock("./search.service")

const mockSearchPackages = searchPackages as jest.MockedFunction<typeof searchPackages>

// ─── useSearch ────────────────────────────────────────────────────────────────

const renderUseSearch = (query: string) => {
  // retryDelay: 0 keeps the hook's own `retry: 1` but skips the backoff wait.
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0 } },
  })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return renderHook(({ q }) => useSearch(q), { wrapper, initialProps: { q: query } })
}

beforeEach(() => {
  mockSearchPackages.mockReset()
})

describe("useSearch", () => {
  it.each(["", "re", "  re  "])("does not search for the short query %p", (query) => {
    const { result } = renderUseSearch(query)

    expect(result.current.fetchStatus).toBe("idle")
    expect(result.current.data).toBeUndefined()
    expect(mockSearchPackages).not.toHaveBeenCalled()
  })

  it("searches once the query is longer than 2 characters", async () => {
    const results = [{ name: "react", description: "A JS library", version: "19.0.0" }]
    mockSearchPackages.mockResolvedValueOnce(results)

    const { result } = renderUseSearch("rea")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(results)
    expect(mockSearchPackages).toHaveBeenCalledWith("rea")
  })

  it("starts searching when the query grows past the threshold", async () => {
    mockSearchPackages.mockResolvedValue([])

    const { result, rerender } = renderUseSearch("re")
    expect(mockSearchPackages).not.toHaveBeenCalled()

    rerender({ q: "react" })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSearchPackages).toHaveBeenCalledTimes(1)
    expect(mockSearchPackages).toHaveBeenCalledWith("react")
  })

  it("sends the trimmed query", async () => {
    mockSearchPackages.mockResolvedValueOnce([])

    const { result } = renderUseSearch("  react  ")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSearchPackages).toHaveBeenCalledWith("react")
  })

  it("shares one cache entry for queries that differ only by whitespace", async () => {
    mockSearchPackages.mockResolvedValue([])

    const { result, rerender } = renderUseSearch("react")
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender({ q: "react " })
    rerender({ q: " react" })

    expect(result.current.isSuccess).toBe(true)
    expect(mockSearchPackages).toHaveBeenCalledTimes(1)
  })

  it("retries once, then exposes the error", async () => {
    mockSearchPackages.mockRejectedValue(new Error("Search failed: 500"))

    const { result } = renderUseSearch("react")

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe("Search failed: 500")
    expect(mockSearchPackages).toHaveBeenCalledTimes(2)
  })
})
