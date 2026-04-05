import { PackageDetails } from "@/types/global"
import { formatDownloads, formatSize } from "@/lib/utils"
import type { Insight, VerdictResult, VerdictSide } from "@/types/verdict"

export function getDownloadsInsight(pkgA: PackageDetails, pkgB: PackageDetails): Insight | null {
  const a = pkgA.downloads?.monthly
  const b = pkgB.downloads?.monthly
  if (!a && !b) return null

  const winner: VerdictSide = !a ? "b" : !b ? "a" : a > b ? "a" : a < b ? "b" : "tie"
  const ratio = a && b ? Math.max(a, b) / Math.min(a, b) : null
  const ratioText = ratio ? ` — ${ratio.toFixed(0)}x more popular` : ""

  return {
    category: "Popularity",
    winner,
    reason:
      winner === "tie"
        ? "Both have similar download numbers"
        : `${winner === "a" ? pkgA.name : pkgB.name} leads with ${formatDownloads(Math.max(a ?? 0, b ?? 0))} monthly downloads${ratioText}`,
    weight: 3,
  }
}

export function getCommunityInsight(pkgA: PackageDetails, pkgB: PackageDetails): Insight | null {
  const a = pkgA.github?.stars
  const b = pkgB.github?.stars
  if (!a && !b) return null

  const winner: VerdictSide = !a ? "b" : !b ? "a" : a > b ? "a" : a < b ? "b" : "tie"
  const ratio = a && b ? Math.max(a, b) / Math.min(a, b) : null
  const ratioText = ratio && ratio > 1.5 ? ` (${ratio.toFixed(1)}x more stars)` : ""

  return {
    category: "Community",
    winner,
    reason:
      winner === "tie"
        ? "Both have similar community engagement"
        : `${winner === "a" ? pkgA.name : pkgB.name} has a larger community with ${formatDownloads(Math.max(a ?? 0, b ?? 0))} GitHub stars${ratioText}`,
    weight: 2,
  }
}

export function getBundleInsight(pkgA: PackageDetails, pkgB: PackageDetails): Insight | null {
  const a = pkgA.bundle?.gzip
  const b = pkgB.bundle?.gzip
  if (!a && !b) return null

  const winner: VerdictSide = !a ? "b" : !b ? "a" : a < b ? "a" : a > b ? "b" : "tie"
  const ratio = a && b ? Math.max(a, b) / Math.min(a, b) : null
  const ratioText = ratio && ratio > 1.5 ? ` — ${ratio.toFixed(1)}x lighter` : ""

  return {
    category: "Bundle size",
    winner,
    reason:
      winner === "tie"
        ? "Both have a similar bundle size"
        : `${winner === "a" ? pkgA.name : pkgB.name} is lighter at ${formatSize(Math.min(a ?? Infinity, b ?? Infinity))} gzipped${ratioText}`,
    weight: 2,
  }
}

export function getMaintenanceInsight(pkgA: PackageDetails, pkgB: PackageDetails): Insight | null {
  const a = pkgA.github?.issues
  const b = pkgB.github?.issues
  if (a == null && b == null) return null

  const winner: VerdictSide =
    a == null ? "b" : b == null ? "a" : a < b ? "a" : a > b ? "b" : "tie"
  const winnerIssues = winner === "a" ? a : b
  const loserIssues = winner === "a" ? b : a

  return {
    category: "Maintenance",
    winner,
    reason:
      winner === "tie"
        ? "Both projects have a similar number of open issues"
        : `${winner === "a" ? pkgA.name : pkgB.name} has fewer open issues (${winnerIssues} vs ${loserIssues})`,
    weight: 1,
  }
}

export function computeVerdict(insights: Insight[]): VerdictResult {
  let scoreA = 0
  let scoreB = 0

  for (const insight of insights) {
    if (insight.winner === "a") scoreA += insight.weight
    else if (insight.winner === "b") scoreB += insight.weight
  }

  return {
    winner: scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "tie",
    scoreA,
    scoreB,
  }
}

export function verdictSummary(
  winner: VerdictSide,
  pkgA: PackageDetails,
  pkgB: PackageDetails,
  scoreA: number,
  scoreB: number
): string {
  if (winner === "tie") {
    return `${pkgA.name} and ${pkgB.name} are neck and neck. Your choice should depend on your project's specific needs.`
  }

  const winnerPkg = winner === "a" ? pkgA : pkgB
  const loserPkg = winner === "a" ? pkgB : pkgA
  const winnerScore = winner === "a" ? scoreA : scoreB
  const loserScore = winner === "a" ? scoreB : scoreA

  if (winnerScore >= loserScore * 2) {
    return `${winnerPkg.name} is the clear choice — it leads across most categories and is the more established option for most use cases.`
  }

  return `${winnerPkg.name} has a slight edge over ${loserPkg.name}, but both are solid choices. Consider your priorities before deciding.`
}