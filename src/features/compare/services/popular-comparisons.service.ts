import { fetchDownloads } from "@/services/api/downloads"
import { fetchBundle } from "@/services/api/bundlephobia"
import { POPULAR_COMPARISONS } from "@/config/popular-comparisons"
import { ComparisonCardData, PackageSnapshot } from "@/types/compare"

async function fetchPackageSnapshot(name: string): Promise<PackageSnapshot> {
  const [downloads, bundle] = await Promise.allSettled([
    fetchDownloads(name),
    fetchBundle(name),
  ])

  return {
    name,
    downloads:
      downloads.status === "fulfilled" ? (downloads.value?.downloads ?? null) : null,
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