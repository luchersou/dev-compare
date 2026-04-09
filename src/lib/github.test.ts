import { extractGithubRepo } from "./github"

// ─── extractGithubRepo ────────────────────────────────────────────────────────

describe("extractGithubRepo", () => {
  it("returns null for undefined", () => {
    expect(extractGithubRepo(undefined)).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(extractGithubRepo("")).toBeNull()
  })

  it("extracts owner/repo from a clean github url", () => {
    expect(extractGithubRepo("https://github.com/owner/repo")).toBe("owner/repo")
  })

  it("strips git+ prefix and .git suffix together", () => {
    expect(extractGithubRepo("git+https://github.com/owner/repo.git")).toBe("owner/repo")
  })

  it("strips only .git suffix when there is no git+ prefix", () => {
    expect(extractGithubRepo("https://github.com/owner/repo.git")).toBe("owner/repo")
  })

  it("strips only git+ prefix when there is no .git suffix", () => {
    expect(extractGithubRepo("git+https://github.com/owner/repo")).toBe("owner/repo")
  })

  it("mutilates a repo name that contains .git in the middle", () => {
    // documents a known limitation: .git anywhere in the string gets stripped
    expect(extractGithubRepo("https://github.com/owner/repo.git-hooks")).toBe(
      "owner/repo-hooks"
    )
  })

  it("does not strip the path for non-github urls", () => {
    // no github.com to replace — returns the full url as-is
    expect(extractGithubRepo("https://gitlab.com/owner/repo")).toBe(
      "https://gitlab.com/owner/repo"
    )
  })
})