import { POPULAR_PACKAGES } from "@/config/popular-packages"
import { extractGithubRepo, rawRepositoryUrl } from "@/lib/github"
import { OPTIONAL_SOURCE_TIMEOUT, withTimeout } from "@/lib/timeout"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloadsByPeriod } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage } from "@/services/api/npm"
import type { PackageSummary } from "@/types/global"

export async function getPackageSummary(name: string): Promise<PackageSummary> {
  // The optional sources catch their own errors and resolve to null.
  const extrasPromise = Promise.all([
    withTimeout(fetchDownloadsByPeriod(name, "last-week"), OPTIONAL_SOURCE_TIMEOUT, null),
    withTimeout(fetchBundle(name), OPTIONAL_SOURCE_TIMEOUT, null, `bundle ${name}`),
  ])

  const npmData = await fetchNpmPackage(name)
  const repoPath = extractGithubRepo(rawRepositoryUrl(npmData.repository))

  const [[downloads, bundle], github] = await Promise.all([
    extrasPromise,
    repoPath
      ? withTimeout(fetchGithubRepo(repoPath), OPTIONAL_SOURCE_TIMEOUT, null, `github ${repoPath}`)
      : null,
  ])

  return {
    name: npmData.name,
    version: npmData.version,
    description: npmData.description,
    weeklyDownloads: downloads ?? undefined,
    gzipSize: bundle?.gzip,
    stars: github?.stargazers_count,
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