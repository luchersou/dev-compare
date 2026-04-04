import { GitHubRepo } from "@/types/github"

const BASE_GITHUB = "https://api.github.com"

export async function fetchGithubRepo(repoPath: string): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`${BASE_GITHUB}/repos/${repoPath}`, {
      next: { revalidate: 60 * 60 }, // Revalidate every 1 hour
    })

    if (!res.ok) {
      console.warn(`[github] Failed for ${repoPath}: ${res.status}`)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`[github] Error for ${repoPath}`, error)
    return null
  }
}