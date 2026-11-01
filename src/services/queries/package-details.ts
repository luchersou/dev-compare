import { notFound } from "next/navigation"
import { cache } from "react"

import { extractGithubRepo, normalizeRepositoryUrl, rawRepositoryUrl } from "@/lib/github"
import { OPTIONAL_SOURCE_TIMEOUT, withTimeout } from "@/lib/timeout"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloads } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage, fetchPublishedAt, PackageNotFoundError } from "@/services/api/npm"
import { PackageDetails } from "@/types/global"

// Wrapped in cache() so generateMetadata and the page share one call per
// request instead of resolving the package twice.
export const getPackageDetails = cache(async (name: string): Promise<PackageDetails> => {
  // Everything except GitHub only needs the package name, so start it all
  // at once; GitHub waits for the repository url from the manifest.
  const extrasPromise = Promise.all([
    withTimeout(fetchDownloads(name), OPTIONAL_SOURCE_TIMEOUT, null, `downloads ${name}`),
    withTimeout(fetchBundle(name), OPTIONAL_SOURCE_TIMEOUT, null, `bundle ${name}`),
    withTimeout(fetchPublishedAt(name), OPTIONAL_SOURCE_TIMEOUT, undefined, `publish date ${name}`),
  ])

  const npmData = await fetchNpmPackage(name)

  const repoUrl = rawRepositoryUrl(npmData.repository)
  const repoPath = extractGithubRepo(repoUrl)

  const [[downloads, bundle, publishedAt], github] = await Promise.all([
    extrasPromise,
    repoPath
      ? withTimeout(fetchGithubRepo(repoPath), OPTIONAL_SOURCE_TIMEOUT, null, `github ${repoPath}`)
      : null,
  ])

  return {
    name: npmData.name,
    description: npmData.description,
    version: npmData.version,

    license: npmData.license,
    author: typeof npmData.author === "string"
      ? npmData.author
      : npmData.author?.name,
    homepage: npmData.homepage,
    repository: normalizeRepositoryUrl(repoUrl),
    keywords: npmData.keywords,
    dependencies: npmData.dependencies,
    publishedAt,

    downloads: downloads ?? undefined,

    bundle: bundle
      ? { size: bundle.size, gzip: bundle.gzip }
      : undefined,

    github: github
      ? {
          stars: github.stargazers_count,
          forks: github.forks_count,
          issues: github.open_issues_count,
          url: github.html_url,
          lastCommit: github.pushed_at,
          contributors: undefined,
        }
      : undefined,
  }
})

// Unknown packages render the not-found page; any other failure bubbles up
// to the nearest error boundary.
export async function getPackageDetailsOrNotFound(name: string): Promise<PackageDetails> {
  try {
    return await getPackageDetails(name)
  } catch (error) {
    if (error instanceof PackageNotFoundError) notFound()
    throw error
  }
}
