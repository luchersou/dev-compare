import { notFound } from "next/navigation"

import { extractGithubRepo } from "@/lib/github"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchDownloads } from "@/services/api/downloads"
import { fetchGithubRepo } from "@/services/api/github"
import { fetchNpmPackage, PackageNotFoundError } from "@/services/api/npm"
import { PackageDetails } from "@/types/global"

export async function getPackageDetails(name: string): Promise<PackageDetails> {
  const npmData = await fetchNpmPackage(name)

  const [downloads, bundle] = await Promise.all([
    fetchDownloads(name),
    fetchBundle(name),
  ])

  const repoPath = extractGithubRepo(npmData.repository?.url)
  let github = null
  if (repoPath) {
    github = await fetchGithubRepo(repoPath)
  }

  const latestVersion = npmData["dist-tags"]?.latest
  const versionData = npmData.versions?.[latestVersion]

  return {
    name: npmData.name,
    description: npmData.description,
    version: latestVersion,

    license: versionData?.license,
    author: typeof versionData?.author === "string"
      ? versionData.author
      : versionData?.author?.name,
    homepage: versionData?.homepage,
    repository: npmData.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, ""),
    keywords: versionData?.keywords,
    dependencies: versionData?.dependencies,
    publishedAt: npmData.time?.[latestVersion],

    downloads: downloads
      ? { weekly: downloads.weekly, monthly: downloads.monthly, yearly: downloads.yearly }
      : undefined,

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
}
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
