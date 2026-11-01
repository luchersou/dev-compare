import { withTimeout } from "./timeout"

describe("withTimeout", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it("resolves with the promise value when it settles in time", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 1000, "fallback")).resolves.toBe("ok")
  })

  it("resolves with the fallback when the promise is too slow", async () => {
    const slow = new Promise<string>((resolve) => setTimeout(() => resolve("late"), 5000))
    const result = withTimeout(slow, 1000, "fallback")

    jest.advanceTimersByTime(1000)

    await expect(result).resolves.toBe("fallback")
  })

  it("propagates rejections that happen in time", async () => {
    await expect(withTimeout(Promise.reject(new Error("boom")), 1000, null)).rejects.toThrow("boom")
  })
})
