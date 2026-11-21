/**
 * @jest-environment node
 */
import { POPULAR_COMPARISONS } from "@/config/popular-comparisons"
import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { SITE_URL } from "@/config/site"

import sitemap from "./sitemap"

describe("sitemap", () => {
  it("lists the home page, every popular package and every popular comparison", () => {
    expect(sitemap()).toHaveLength(1 + POPULAR_PACKAGES.length + POPULAR_COMPARISONS.length)
    expect(sitemap()[0].url).toBe(SITE_URL)
  })

  it("XML-escapes the query string of comparison urls", () => {
    const { a, b } = POPULAR_COMPARISONS[0]
    const urls = sitemap().map((entry) => entry.url)

    expect(urls).toContain(`${SITE_URL}/compare?a=${a}&amp;b=${b}`)
    expect(urls.some((url) => /&(?!amp;)/.test(url))).toBe(false)
  })
})
