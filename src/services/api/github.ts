import { GitHubRepo } from "@/types/github"

const BASE_GITHUB = "https://api.github.com"

export async function fetchGithubRepo(repoPath: string) {
  const res = await fetch(`${BASE_GITHUB}/repos/${repoPath}`)

  if (!res.ok) return null

  return (await res.json()) as GitHubRepo
}