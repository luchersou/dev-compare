import { compareHref, packageHref, packageNameFromSegments } from "./routes"

describe("packageHref", () => {
  it("builds a plain package path", () => {
    expect(packageHref("react")).toBe("/package/react")
  })

  it("keeps the slash of scoped packages", () => {
    expect(packageHref("@types/node")).toBe("/package/%40types/node")
  })
})

describe("compareHref", () => {
  it("builds the compare query string", () => {
    expect(compareHref("react", "vue")).toBe("/compare?a=react&b=vue")
  })

  it("encodes scoped packages", () => {
    expect(compareHref("@tanstack/react-query", "swr")).toBe(
      "/compare?a=%40tanstack%2Freact-query&b=swr"
    )
  })
})

describe("packageNameFromSegments", () => {
  it("joins and decodes route segments", () => {
    expect(packageNameFromSegments(["%40types", "node"])).toBe("@types/node")
    expect(packageNameFromSegments(["react"])).toBe("react")
  })

  it("round-trips with packageHref", () => {
    const segments = packageHref("@types/node").replace("/package/", "").split("/")
    expect(packageNameFromSegments(segments)).toBe("@types/node")
  })
})
