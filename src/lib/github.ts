import type { NpmManifest } from "@/types/npm"

// Matches https, git+https, git://, git+ssh://git@ and git@github.com: forms.
const GITHUB_URL = /github\.com[/:]([\w.-]+)\/([\w.-]+)/i
// npm shorthand: "owner/repo" or "github:owner/repo".
const GITHUB_SHORTHAND = /^(?:github:)?([\w.-]+)\/([\w.-]+)$/

export function rawRepositoryUrl(repository: NpmManifest["repository"]): string | undefined {
  return typeof repository === "string" ? repository : repository?.url
}

// Returns "owner/repo" for GitHub repositories, null for anything else.
export function extractGithubRepo(url?: string): string | null {
  if (!url) return null

  const match = url.match(GITHUB_SHORTHAND) ?? url.match(GITHUB_URL)
  if (!match) return null

  return `${match[1]}/${match[2].replace(/\.git$/, "")}`
}

// Turns any repository url npm accepts into a browsable https link.
export function normalizeRepositoryUrl(url?: string): string | undefined {
  if (!url) return undefined

  const githubRepo = extractGithubRepo(url)
  if (githubRepo) return `https://github.com/${githubRepo}`

  const normalized = url
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/^ssh:\/\/git@/, "https://")
    .replace(/^git@([^:]+):/, "https://$1/")
    .replace(/\.git$/, "")

  return /^https?:\/\//.test(normalized) ? normalized : undefined
}
