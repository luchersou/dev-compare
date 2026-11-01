import type { MetadataRoute } from "next"

import { POPULAR_COMPARISONS } from "@/config/popular-comparisons"
import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { SITE_URL } from "@/config/site"
import { compareHref, packageHref } from "@/lib/routes"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...POPULAR_PACKAGES.map((name) => ({
      url: `${SITE_URL}${packageHref(name)}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...POPULAR_COMPARISONS.map(({ a, b }) => ({
      // Next.js writes sitemap urls verbatim, so the query string must be XML-escaped.
      url: `${SITE_URL}${compareHref(a, b)}`.replaceAll("&", "&amp;"),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ]
}
