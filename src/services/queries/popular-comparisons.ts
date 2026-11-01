import { POPULAR_COMPARISONS } from "@/config/popular-comparisons"
import { OPTIONAL_SOURCE_TIMEOUT, withTimeout } from "@/lib/timeout"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloadsByPeriod } from "@/services/api/downloads"
import type { ComparisonCardData } from "@/types/compare"
import type { PackageSnapshot } from "@/types/compare"

async function fetchPackageSnapshot(name: string): Promise<PackageSnapshot> {
  const [downloads, bundle] = await Promise.allSettled([
    withTimeout(fetchDownloadsByPeriod(name, "last-week"), OPTIONAL_SOURCE_TIMEOUT, null),
    withTimeout(fetchBundle(name), OPTIONAL_SOURCE_TIMEOUT, null, `bundle ${name}`),
  ])

  return {
    name,
    downloads:
      downloads.status === "fulfilled" ? (downloads.value ?? null) : null,
    bundleSize:
      bundle.status === "fulfilled" ? (bundle.value?.gzip ?? null) : null,
  }
}

export async function fetchPopularComparisons(): Promise<ComparisonCardData[]> {
  const results = await Promise.allSettled(
    POPULAR_COMPARISONS.map(async (pair) => {
      const [a, b] = await Promise.all([
        fetchPackageSnapshot(pair.a),
        fetchPackageSnapshot(pair.b),
      ])
      return { pair, a, b } satisfies ComparisonCardData
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<ComparisonCardData> => r.status === "fulfilled")
    .map((r) => r.value)
}