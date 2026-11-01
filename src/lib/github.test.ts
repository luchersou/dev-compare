import { extractGithubRepo, normalizeRepositoryUrl, rawRepositoryUrl } from "./github"

// ─── extractGithubRepo ────────────────────────────────────────────────────────

describe("extractGithubRepo", () => {
  it("returns null for undefined", () => {
    expect(extractGithubRepo(undefined)).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(extractGithubRepo("")).toBeNull()
  })

  it.each([
    ["https://github.com/owner/repo"],
    ["https://github.com/owner/repo.git"],
    ["git+https://github.com/owner/repo"],
    ["git+https://github.com/owner/repo.git"],
    ["git://github.com/owner/repo.git"],
    ["git+ssh://git@github.com/owner/repo.git"],
    ["git@github.com:owner/repo.git"],
    ["github:owner/repo"],
    ["owner/repo"],
  ])("extracts owner/repo from %s", (url) => {
    expect(extractGithubRepo(url)).toBe("owner/repo")
  })

  it("ignores monorepo subpaths", () => {
    expect(
      extractGithubRepo("https://github.com/TanStack/query/tree/main/packages/react-query")
    ).toBe("TanStack/query")
  })

  it("keeps dots that are part of the repo name", () => {
    expect(extractGithubRepo("https://github.com/socketio/socket.io.git")).toBe("socketio/socket.io")
    expect(extractGithubRepo("https://github.com/owner/repo.git-hooks")).toBe("owner/repo.git-hooks")
  })

  it("returns null for non-github hosts", () => {
    expect(extractGithubRepo("https://gitlab.com/owner/repo")).toBeNull()
    expect(extractGithubRepo("gitlab:owner/repo")).toBeNull()
  })
})

// ─── normalizeRepositoryUrl ───────────────────────────────────────────────────

describe("normalizeRepositoryUrl", () => {
  it("returns undefined for missing urls", () => {
    expect(normalizeRepositoryUrl(undefined)).toBeUndefined()
  })

  it("builds a canonical github link", () => {
    expect(normalizeRepositoryUrl("git+ssh://git@github.com/owner/repo.git")).toBe(
      "https://github.com/owner/repo"
    )
  })

  it("converts other git hosts to https", () => {
    expect(normalizeRepositoryUrl("git+https://gitlab.com/owner/repo.git")).toBe(
      "https://gitlab.com/owner/repo"
    )
    expect(normalizeRepositoryUrl("git@gitlab.com:owner/repo.git")).toBe(
      "https://gitlab.com/owner/repo"
    )
  })

  it("returns undefined when the url cannot be browsed", () => {
    expect(normalizeRepositoryUrl("gitlab:owner/repo")).toBeUndefined()
  })
})

// ─── rawRepositoryUrl ─────────────────────────────────────────────────────────

describe("rawRepositoryUrl", () => {
  it("accepts both string and object forms", () => {
    expect(rawRepositoryUrl("owner/repo")).toBe("owner/repo")
    expect(rawRepositoryUrl({ type: "git", url: "https://github.com/owner/repo" })).toBe(
      "https://github.com/owner/repo"
    )
    expect(rawRepositoryUrl(undefined)).toBeUndefined()
  })
})
