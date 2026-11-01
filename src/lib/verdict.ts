import { formatDownloads, formatSize } from "@/lib/utils"
import { PackageDetails } from "@/types/global"
import type { Insight, VerdictResult, VerdictSide } from "@/types/verdict"

export function getDownloadsInsight(pkgA: PackageDetails, pkgB: PackageDetails): Insight | null {
  const a = pkgA.downloads?.monthly
  const b = pkgB.downloads?.monthly
  if (!a && !b) return null

  const winner: VerdictSide = !a ? "b" : !b ? "a" : a > b ? "a" : a < b ? "b" : "tie"
  const ratio = a && b ? Math.max(a, b) / Math.min(a, b) : null
  const ratioText = ratio && ratio > 1.5 ? ` — ${ratio.toFixed(1)}x more popular` : ""

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

const DAY_MS = 24 * 60 * 60 * 1000
// Two projects touched within the same month count as equally active.
const MAINTENANCE_TIE_DAYS = 30

function lastActivity(pkg: PackageDetails): number | null {
  const date = pkg.github?.lastCommit ?? pkg.publishedAt
  if (!date) return null
  const time = new Date(date).getTime()
  return Number.isNaN(time) ? null : time
}

export function formatTimeAgo(time: number, now: number): string {
  const days = Math.max(0, Math.floor((now - time) / DAY_MS))
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`
  const years = Math.floor(days / 365)
  return years <= 1 ? "1 year ago" : `${years} years ago`
}

// Open issue counts grow with popularity (and include PRs on GitHub), so
// recent activity is a fairer maintenance signal.
export function getMaintenanceInsight(
  pkgA: PackageDetails,
  pkgB: PackageDetails,
  now: number = Date.now()
): Insight | null {
  const a = lastActivity(pkgA)
  const b = lastActivity(pkgB)
  if (a == null && b == null) return null

  const winner: VerdictSide =
    a == null ? "b"
    : b == null ? "a"
    : Math.abs(a - b) < MAINTENANCE_TIE_DAYS * DAY_MS ? "tie"
    : a > b ? "a" : "b"

  const winnerName = winner === "a" ? pkgA.name : pkgB.name
  const winnerTime = winner === "a" ? a : b
  const loserTime = winner === "a" ? b : a

  let reason: string
  if (winner === "tie") {
    reason = "Both projects have been updated recently"
  } else if (loserTime == null) {
    reason = `${winnerName} was last updated ${formatTimeAgo(winnerTime!, now)}`
  } else {
    reason = `${winnerName} was updated more recently (${formatTimeAgo(winnerTime!, now)} vs ${formatTimeAgo(loserTime, now)})`
  }

  return {
    category: "Maintenance",
    winner,
    reason,
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