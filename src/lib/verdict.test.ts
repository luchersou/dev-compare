import { 
  getDownloadsInsight, 
  getCommunityInsight, 
  getMaintenanceInsight, 
  getBundleInsight, 
  verdictSummary, 
  computeVerdict 
} from "@/lib/verdict"
import type { PackageDetails } from "@/types/global"
import { Insight } from "@/types/verdict"

const makePkg = (overrides: Partial<PackageDetails> & { name: string }): PackageDetails => ({
  version: "1.0.0",
  ...overrides,
})

const makeGithub = ({ stars = 0, issues = 0 } = {}) => ({
  stars,
  forks: 0,
  issues,
  url: "https://github.com/test/repo",
})

const makeBundle = (gzip: number) => ({
  size: gzip * 2,
  gzip,
})

const makeInsight = (winner: Insight["winner"], weight: number): Insight => ({
  category: "Popularity",
  winner,
  reason: "test",
  weight,
})

const pkgA = makePkg({ name: "react" })
const pkgB = makePkg({ name: "preact" })

// ─── getDownloadsInsight ───────────────────────────────────────────────────

describe("getDownloadsInsight", () => {
  describe("when both have no data", () => {
    it("retorna null", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b" })
      expect(getDownloadsInsight(a, b)).toBeNull()
    })
  })

  describe("winner", () => {
    it("should return 'a' when 'a' has more downloads", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 1_000_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 100_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.winner).toBe("a")
			})

		it("should return 'b' when 'b' has more downloads", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 50_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 500_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.winner).toBe("b")
		})

		it("should return 'tie' when download counts are equal", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 200_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 200_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.winner).toBe("tie")
		})

		it("should return 'b' when only 'b' has download data", () => {
			const a = makePkg({ name: "a" })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 300_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.winner).toBe("b")
		})

    it("should return 'a' when only 'a' has download data", () => {
      const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 300_000, yearly: 0 } })
      const b = makePkg({ name: "b" })
      expect(getDownloadsInsight(a, b)?.winner).toBe("a")
    })
  })

  describe("reason", () => {
		it("should mention the winning package's name", () => {
			const a = makePkg({ name: "react", downloads: { weekly: 0, monthly: 1_000_000, yearly: 0 } })
			const b = makePkg({ name: "preact", downloads: { weekly: 0, monthly: 100_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.reason).toContain("react")
		})

		it("should include the popularity text when there is a difference", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 1_000_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 100_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.reason).toContain("more popular")
		})

		it("should display a tie message when download numbers are equal", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 200_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 200_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.reason).toBe("Both have similar download numbers")
		})
	})

  describe("metadata", () => {
		it("should return 'Popularity' as the category", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 1_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 2_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.category).toBe("Popularity")
		})

		it("should return a weight of 3", () => {
			const a = makePkg({ name: "a", downloads: { weekly: 0, monthly: 1_000, yearly: 0 } })
			const b = makePkg({ name: "b", downloads: { weekly: 0, monthly: 2_000, yearly: 0 } })
			expect(getDownloadsInsight(a, b)?.weight).toBe(3)
		})
	})
})

// ─── getCommunityInsight ───────────────────────────────────────────────────

describe("getCommunityInsight", () => {
  describe("when both have no data", () => {
    it("should return null", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b" })
      expect(getCommunityInsight(a, b)).toBeNull()
    })
  })

  describe("winner", () => {
		it("should return 'a' when a has more stars", () => {
			const a = makePkg({ name: "a", github: makeGithub({ stars: 5_000 }) })
			const b = makePkg({ name: "b", github: makeGithub({ stars: 1_000 }) })
			expect(getCommunityInsight(a, b)?.winner).toBe("a")
		})

		it("should return 'b' when b has more stars", () => {
			const a = makePkg({ name: "a", github: makeGithub({ stars: 1_000 }) })
			const b = makePkg({ name: "b", github: makeGithub({ stars: 8_000 }) })
			expect(getCommunityInsight(a, b)?.winner).toBe("b")
		})

		it("should return 'tie' when stars are equal", () => {
			const a = makePkg({ name: "a", github: makeGithub({ stars: 3_000 }) })
			const b = makePkg({ name: "b", github: makeGithub({ stars: 3_000 }) })
			expect(getCommunityInsight(a, b)?.winner).toBe("tie")
		})

		it("should return 'b' when only b has github data", () => {
			const a = makePkg({ name: "a" })
			const b = makePkg({ name: "b", github: makeGithub({ stars: 2_000 }) })
			expect(getCommunityInsight(a, b)?.winner).toBe("b")
		})

		it("should return 'a' when only a has github data", () => {
			const a = makePkg({ name: "a", github: makeGithub({ stars: 2_000 }) })
			const b = makePkg({ name: "b" })
			expect(getCommunityInsight(a, b)?.winner).toBe("a")
		})
	})

  describe("reason — texto de ratio", () => {
    it("should include ratio when difference is greater than 1.5x", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 3_000 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 1_000 }) })
      expect(getCommunityInsight(a, b)?.reason).toContain("x more stars")
    })

    it("should not include ratio when difference is exactly 1.5x", () => {
      // 1500 / 1000 = 1.5 — not > 1.5, so it should not appear
      const a = makePkg({ name: "a", github: makeGithub({ stars: 1_500 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 1_000 }) })
      expect(getCommunityInsight(a, b)?.reason).not.toContain("x more stars")
    })

    it("should not include ratio when difference is less than 1.5x", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 1_400 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 1_000 }) })
      expect(getCommunityInsight(a, b)?.reason).not.toContain("x more stars")
    })

    it("should display a tie message when stars are equal", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 2_000 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 2_000 }) })
      expect(getCommunityInsight(a, b)?.reason).toBe("Both have similar community engagement")
    })

    it("should mention the winner package name in the reason", () => {
      const a = makePkg({ name: "react", github: makeGithub({ stars: 10_000 }) })
      const b = makePkg({ name: "preact", github: makeGithub({ stars: 2_000 }) })
      expect(getCommunityInsight(a, b)?.reason).toContain("react")
    })
  })

  describe("metadata", () => {
    it("should return category 'Community'", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 100 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 200 }) })
      expect(getCommunityInsight(a, b)?.category).toBe("Community")
    })

    it("should return weight 2", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 100 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 200 }) })
      expect(getCommunityInsight(a, b)?.weight).toBe(2)
    })
  })
})

// ─── getBundleInsight ──────────────────────────────────────────────────────
 
describe("getBundleInsight", () => {
  describe("when both packages have no bundle data", () => {
    it("returns null", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b" })
      expect(getBundleInsight(a, b)).toBeNull()
    })
  })
 
  describe("winner", () => {
    it("returns 'a' when a has a smaller bundle", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(5_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(50_000) })
      expect(getBundleInsight(a, b)?.winner).toBe("a")
    })
 
    it("returns 'b' when b has a smaller bundle", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(80_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(10_000) })
      expect(getBundleInsight(a, b)?.winner).toBe("b")
    })
 
    it("returns 'tie' when both bundles are equal", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(20_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(20_000) })
      expect(getBundleInsight(a, b)?.winner).toBe("tie")
    })
 
    it("returns 'b' when only b has bundle data", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b", bundle: makeBundle(10_000) })
      expect(getBundleInsight(a, b)?.winner).toBe("b")
    })
 
    it("returns 'a' when only a has bundle data", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(10_000) })
      const b = makePkg({ name: "b" })
      expect(getBundleInsight(a, b)?.winner).toBe("a")
    })
  })
 
  describe("reason — ratio text", () => {
    it("includes ratio text when difference is greater than 1.5x", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(5_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(10_000) })
      expect(getBundleInsight(a, b)?.reason).toContain("x lighter")
    })
 
    it("does not include ratio text when difference is exactly 1.5x", () => {
      // 15_000 / 10_000 = 1.5 — not > 1.5, so ratio text must not appear
      const a = makePkg({ name: "a", bundle: makeBundle(10_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(15_000) })
      expect(getBundleInsight(a, b)?.reason).not.toContain("x lighter")
    })
 
    it("does not include ratio text when difference is less than 1.5x", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(10_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(14_000) })
      expect(getBundleInsight(a, b)?.reason).not.toContain("x lighter")
    })
 
    it("mentions the winner package name in the reason", () => {
      const a = makePkg({ name: "react", bundle: makeBundle(5_000) })
      const b = makePkg({ name: "preact", bundle: makeBundle(50_000) })
      expect(getBundleInsight(a, b)?.reason).toContain("react")
    })
 
    it("returns the tie message when bundles are equal", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(20_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(20_000) })
      expect(getBundleInsight(a, b)?.reason).toBe("Both have a similar bundle size")
    })
  })
 
  describe("metadata", () => {
    it("returns category 'Bundle size'", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(1_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(2_000) })
      expect(getBundleInsight(a, b)?.category).toBe("Bundle size")
    })
 
    it("returns weight 2", () => {
      const a = makePkg({ name: "a", bundle: makeBundle(1_000) })
      const b = makePkg({ name: "b", bundle: makeBundle(2_000) })
      expect(getBundleInsight(a, b)?.weight).toBe(2)
    })
  })
})
 
// ─── getMaintenanceInsight ─────────────────────────────────────────────────
 
describe("getMaintenanceInsight", () => {
  describe("when both packages have no issues data", () => {
    it("returns null", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b" })
      expect(getMaintenanceInsight(a, b)).toBeNull()
    })
  })
 
  describe("winner", () => {
    it("returns 'a' when a has fewer open issues", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 5 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 50 }) })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("a")
    })
 
    it("returns 'b' when b has fewer open issues", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 100 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 10 }) })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("b")
    })
 
    it("returns 'tie' when both have the same number of issues", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 10 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 10 }) })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("tie")
    })
 
    it("returns 'a' when only a has github data", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 3 }) })
      const b = makePkg({ name: "b" })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("a")
    })
 
    it("returns 'b' when only b has github data", () => {
      const a = makePkg({ name: "a" })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 3 }) })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("b")
    })
 
    it("returns 'a' when a has 0 issues and b has some", () => {
      // 0 issues is valid and should win — uses == null check, not falsy
      const a = makePkg({ name: "a", github: makeGithub({ issues: 0 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 10 }) })
      expect(getMaintenanceInsight(a, b)?.winner).toBe("a")
    })
  })
 
  describe("reason", () => {
    it("includes both issue counts in the reason", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 5 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 30 }) })
      const reason = getMaintenanceInsight(a, b)?.reason
      expect(reason).toContain("5")
      expect(reason).toContain("30")
    })
 
    it("mentions the winner package name in the reason", () => {
      const a = makePkg({ name: "react", github: makeGithub({ issues: 5 }) })
      const b = makePkg({ name: "preact", github: makeGithub({ issues: 50 }) })
      expect(getMaintenanceInsight(a, b)?.reason).toContain("react")
    })
 
    it("returns the tie message when issues are equal", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 10 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 10 }) })
      expect(getMaintenanceInsight(a, b)?.reason).toBe(
        "Both projects have a similar number of open issues"
      )
    })
  })
 
  describe("metadata", () => {
    it("returns category 'Maintenance'", () => {
      const a = makePkg({ name: "a", github: makeGithub({ issues: 1 }) })
      const b = makePkg({ name: "b", github: makeGithub({ issues: 2 }) })
      expect(getMaintenanceInsight(a, b)?.category).toBe("Maintenance")
    })
 
    it("returns weight 1", () => {
      const a = makePkg({ name: "a", github: makeGithub({ stars: 1 }) })
      const b = makePkg({ name: "b", github: makeGithub({ stars: 2 }) })
      expect(getMaintenanceInsight(a, b)?.weight).toBe(1)
    })
  })
})

// ─── computeVerdict ────────────────────────────────────────────────────────
 
describe("computeVerdict", () => {
  describe("winner", () => {
    it("returns 'a' when a accumulates more weight", () => {
      const insights = [
        makeInsight("a", 3),
        makeInsight("a", 2),
        makeInsight("b", 2),
      ]
      expect(computeVerdict(insights).winner).toBe("a")
    })
 
    it("returns 'b' when b accumulates more weight", () => {
      const insights = [
        makeInsight("b", 3),
        makeInsight("b", 2),
        makeInsight("a", 1),
      ]
      expect(computeVerdict(insights).winner).toBe("b")
    })
 
    it("returns 'tie' when both scores are equal", () => {
      const insights = [
        makeInsight("a", 3),
        makeInsight("b", 3),
      ]
      expect(computeVerdict(insights).winner).toBe("tie")
    })
 
    it("returns 'tie' when insights array is empty", () => {
      expect(computeVerdict([]).winner).toBe("tie")
    })
 
    it("returns 'tie' when all insights are ties", () => {
      const insights = [
        makeInsight("tie", 3),
        makeInsight("tie", 2),
      ]
      expect(computeVerdict(insights).winner).toBe("tie")
    })
  })
 
  describe("scores", () => {
    it("accumulates scoreA correctly", () => {
      const insights = [
        makeInsight("a", 3),
        makeInsight("a", 2),
        makeInsight("b", 1),
      ]
      expect(computeVerdict(insights).scoreA).toBe(5)
    })
 
    it("accumulates scoreB correctly", () => {
      const insights = [
        makeInsight("a", 1),
        makeInsight("b", 3),
        makeInsight("b", 2),
      ]
      expect(computeVerdict(insights).scoreB).toBe(5)
    })
 
    it("does not add weight from tie insights to either score", () => {
      const insights = [
        makeInsight("tie", 3),
        makeInsight("a", 2),
      ]
      const verdict = computeVerdict(insights)
      expect(verdict.scoreA).toBe(2)
      expect(verdict.scoreB).toBe(0)
    })
 
    it("returns zero scores when insights array is empty", () => {
      const verdict = computeVerdict([])
      expect(verdict.scoreA).toBe(0)
      expect(verdict.scoreB).toBe(0)
    })
  })
})
 
// ─── verdictSummary ────────────────────────────────────────────────────────
 
describe("verdictSummary", () => {
  describe("tie", () => {
    it("includes both package names in the tie message", () => {
      const summary = verdictSummary("tie", pkgA, pkgB, 3, 3)
      expect(summary).toContain("react")
      expect(summary).toContain("preact")
    })
 
    it("returns the tie message regardless of scores", () => {
      // scores are irrelevant when winner is "tie"
      const summary = verdictSummary("tie", pkgA, pkgB, 0, 0)
      expect(summary).toContain("neck and neck")
    })
  })
 
  describe("clear choice — winnerScore >= loserScore * 2", () => {
    it("returns clear choice message when winner score is exactly 2x loser score", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 4, 2)
      expect(summary).toContain("clear choice")
    })
 
    it("returns clear choice message when winner score is more than 2x loser score", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 6, 2)
      expect(summary).toContain("clear choice")
    })
 
    it("returns clear choice message when loser score is 0", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 3, 0)
      expect(summary).toContain("clear choice")
    })
 
    it("mentions the winner package name in clear choice message", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 6, 2)
      expect(summary).toContain("react")
    })
 
    it("works correctly when 'b' is the clear winner", () => {
      const summary = verdictSummary("b", pkgA, pkgB, 2, 6)
      expect(summary).toContain("preact")
      expect(summary).toContain("clear choice")
    })
  })
 
  describe("slight edge — winnerScore < loserScore * 2", () => {
    it("returns slight edge message when winner score is just below 2x loser score", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 3, 2)
      expect(summary).toContain("slight edge")
    })
 
    it("returns slight edge message when scores are close", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 5, 4)
      expect(summary).toContain("slight edge")
    })
 
    it("includes both package names in the slight edge message", () => {
      const summary = verdictSummary("a", pkgA, pkgB, 5, 4)
      expect(summary).toContain("react")
      expect(summary).toContain("preact")
    })
 
    it("works correctly when 'b' has a slight edge", () => {
      const summary = verdictSummary("b", pkgA, pkgB, 2, 3)
      expect(summary).toContain("preact")
      expect(summary).toContain("react")
      expect(summary).toContain("slight edge")
    })
  })
})