import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { extractGithubRepo, rawRepositoryUrl } from "@/lib/github"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloadsByPeriod } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage } from "@/services/api/npm"
import type { PackageSummary } from "@/types/global"


export async function getPackageSummary(name: string): Promise<PackageSummary> {
  const npmData = await fetchNpmPackage(name)
  const repoPath = extractGithubRepo(rawRepositoryUrl(npmData.repository))

  const [downloads, bundle, github] = await Promise.allSettled([
    fetchDownloadsByPeriod(name, "last-week"),
    fetchBundle(name),
    repoPath ? fetchGithubRepo(repoPath) : Promise.resolve(null),
  ])

  return {
    name: npmData.name,
    version: npmData.version,
    description: npmData.description,
    weeklyDownloads: downloads.status === "fulfilled" ? (downloads.value ?? undefined) : undefined,
    gzipSize: bundle.status === "fulfilled" ? bundle.value?.gzip : undefined,
    stars: github.status === "fulfilled" ? github.value?.stargazers_count : undefined,
  }
}

export async function fetchPopularPackages(): Promise<PackageSummary[]> {
  const results = await Promise.allSettled(
    POPULAR_PACKAGES.map((name) => getPackageSummary(name))
  )

  return results
    .filter((r): r is PromiseFulfilledResult<PackageSummary> => r.status === "fulfilled")
    .map((r) => r.value)
}