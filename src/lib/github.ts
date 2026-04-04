export function extractGithubRepo(url?: string) {
  if (!url) return null
  return url
    .replace("git+", "")
    .replace(".git", "")
    .replace("https://github.com/", "")
}