import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/use-debounce"

// ─── useDebounce ──────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("react"))
    expect(result.current).toBe("react")
  })

  it("does not update the value before the delay has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "react" },
    })

    rerender({ value: "vue" })
    act(() => jest.advanceTimersByTime(499))

    expect(result.current).toBe("react")
  })

  it("updates the value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "react" },
    })

    rerender({ value: "vue" })
    act(() => jest.advanceTimersByTime(500))

    expect(result.current).toBe("vue")
  })

  it("resets the timer on every value change — only the last value is applied", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "react" },
    })

    rerender({ value: "vue" })
    act(() => jest.advanceTimersByTime(300))

    rerender({ value: "svelte" })
    act(() => jest.advanceTimersByTime(500))

    expect(result.current).toBe("svelte")
  })

  it("respects a custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: "react" } }
    )

    rerender({ value: "vue" })
    act(() => jest.advanceTimersByTime(999))
    expect(result.current).toBe("react")

    act(() => jest.advanceTimersByTime(1))
    expect(result.current).toBe("vue")
  })
})