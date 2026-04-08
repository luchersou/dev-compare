import { fetchNpmPackage } from "@/services/api/npm"
import { fetchDownloads } from "@/services/api/downloads"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchGithubRepo } from "@/services/api/github"
import type { PackageSummary } from "@/types/global"
import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { extractGithubRepo } from "@/lib/github"


export async function getPackageSummary(name: string): Promise<PackageSummary> {
  const npmData = await fetchNpmPackage(name)
  const repoPath = extractGithubRepo(npmData.repository?.url)

  const [downloads, bundle, github] = await Promise.allSettled([
    fetchDownloads(name),
    fetchBundle(name),
    repoPath ? fetchGithubRepo(repoPath) : Promise.resolve(null),
  ])

  return {
    name: npmData.name,
    version: npmData["dist-tags"]?.latest,
    description: npmData.description,
    weeklyDownloads: downloads.status === "fulfilled" ? downloads.value?.weekly : undefined,
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