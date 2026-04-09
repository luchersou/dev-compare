import {
  generateIconColor,
  formatDownloads,
  formatSize,
  formatStars,
} from "@/lib/utils" 

// ─── generateIconColor ────────────────────────────────────────────────────────

describe("generateIconColor", () => {
  it("returns a valid hsl string", () => {
    expect(generateIconColor("react")).toMatch(/^hsl\(\d+, 65%, 45%\)$/)
  })

  it("hue is always between 0 and 359 regardless of input", () => {
    const inputs = ["a", "z", "React", "next.js", "typescript", "x".repeat(100)]
    for (const name of inputs) {
      const hue = parseInt(generateIconColor(name).match(/\d+/)![0])
      expect(hue).toBeGreaterThanOrEqual(0)
      expect(hue).toBeLessThan(360)
    }
  })

  it("is deterministic — same input always yields same color", () => {
    expect(generateIconColor("lodash")).toBe(generateIconColor("lodash"))
  })

  it("does not throw on empty string", () => {
    expect(() => generateIconColor("")).not.toThrow()
  })
})

// ─── formatDownloads ──────────────────────────────────────────────────────────

describe("formatDownloads", () => {
  it("returns an em dash for null", () => {
    expect(formatDownloads(null)).toBe("—")
  })

  it("uses M suffix only at exactly 1_000_000 — 999_999 still shows as K", () => {
    expect(formatDownloads(999_999)).toBe("1000K")
    expect(formatDownloads(1_000_000)).toBe("1.0M")
  })

  it("rounds K values without decimal places", () => {
    expect(formatDownloads(1_500)).toBe("2K")
    expect(formatDownloads(1_499)).toBe("1K")
  })

  it("returns the raw number as string below 1000", () => {
    expect(formatDownloads(0)).toBe("0")
    expect(formatDownloads(999)).toBe("999")
  })
})

// ─── formatSize ───────────────────────────────────────────────────────────────

describe("formatSize", () => {
  it("returns an em dash for null", () => {
    expect(formatSize(null)).toBe("—")
  })

  it("1023 bytes stays in the bytes branch", () => {
    expect(formatSize(1023)).toBe("1023b")
    expect(formatSize(1024)).toBe("1.0kb")
  })

  it("uses mb suffix only at exactly 1024 * 1024", () => {
    expect(formatSize(1024 * 1024 - 1)).toBe("1024.0kb")
    expect(formatSize(1024 * 1024)).toBe("1.0mb")
  })

  it("returns raw bytes with b suffix below 1024", () => {
    expect(formatSize(0)).toBe("0b")
    expect(formatSize(100)).toBe("100b")
  })
})

// ─── formatStars ──────────────────────────────────────────────────────────────

describe("formatStars", () => {
  it("switches to k suffix at exactly 1000", () => {
    expect(formatStars(999)).toBe("999")
    expect(formatStars(1_000)).toBe("1.0k")
  })

  it("preserves one decimal place for k values", () => {
    expect(formatStars(1_500)).toBe("1.5k")
    expect(formatStars(1_050)).toBe("1.1k")
  })
})