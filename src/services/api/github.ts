import { GitHubRepo } from "@/types/github"

const BASE_GITHUB = "https://api.github.com"

// Unauthenticated requests are limited to 60/hour per IP, which a shared
// host like Vercel exhausts quickly. A token raises it to 5000/hour.
function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  return headers
}

export async function fetchGithubRepo(repoPath: string): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`${BASE_GITHUB}/repos/${repoPath}`, {
      headers: githubHeaders(),
      next: { revalidate: 60 * 60 }, // Revalidate every 1 hour
    })

    if (!res.ok) {
      const remaining = res.headers.get("x-ratelimit-remaining")
      const hint = remaining === "0" ? " (rate limit reached, set GITHUB_TOKEN)" : ""
      console.warn(`[github] Failed for ${repoPath}: ${res.status}${hint}`)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`[github] Error for ${repoPath}`, error)
    return null
  }
}
