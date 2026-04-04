import { fetchNpmPackage } from "@/services/api/npm"
import { fetchDownloads } from "@/services/api/downloads"
import { fetchBundle } from "@/services/api/bundlephobia"
import { fetchGithubRepo } from "@/services/api/github"
import { PackageDetails } from "@/types/global"
import { extractGithubRepo } from "@/lib/github"

export async function getPackageDetails(
  name: string
): Promise<PackageDetails> {
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

  return {
    name: npmData.name,
    description: npmData.description,
    version: npmData["dist-tags"]?.latest,

    downloads: downloads
    ? {
        weekly: downloads.weekly,
        monthly: downloads.monthly,
        yearly: downloads.yearly,
      }
    : undefined,

    bundle: bundle
      ? {
          size: bundle.size,
          gzip: bundle.gzip,
        }
      : undefined,

    github: github
      ? {
          stars: github.stargazers_count,
          forks: github.forks_count,
          issues: github.open_issues_count,
          url: github.html_url,
        }
      : undefined,
  }
}