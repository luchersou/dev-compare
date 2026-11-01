import { Container } from "@/components/layout/container"
import {
  computeVerdict,
  getBundleInsight,
  getCommunityInsight,
  getDownloadsInsight,
  getMaintenanceInsight,
  verdictSummary,
} from "@/lib/verdict"
import { PackageDetails } from "@/types/global"
import { Insight } from "@/types/verdict"

interface CompareVerdictProps {
  pkgA: PackageDetails
  pkgB: PackageDetails
}

function InsightRow({
  insight,
  pkgA,
  pkgB,
}: {
  insight: Insight
  pkgA: PackageDetails
  pkgB: PackageDetails
}) {
  const winnerName =
    insight.winner === "tie" ? "Tie" : insight.winner === "a" ? pkgA.name : pkgB.name

  return (
    <li className="verdict__row">
      <span className="verdict__category">{insight.category}</span>
      <span className={insight.winner === "tie" ? "verdict__winner" : "verdict__winner mono"}>
        {winnerName}
      </span>
      <span className="verdict__weight num">weight {insight.weight}</span>
      <p className="verdict__reason">{insight.reason}</p>
    </li>
  )
}

export function CompareVerdict({ pkgA, pkgB }: CompareVerdictProps) {
  const insights = [
    getDownloadsInsight(pkgA, pkgB),
    getCommunityInsight(pkgA, pkgB),
    getBundleInsight(pkgA, pkgB),
    getMaintenanceInsight(pkgA, pkgB),
  ].filter(Boolean) as Insight[]

  if (insights.length === 0) return null

  const { winner, scoreA, scoreB } = computeVerdict(insights)
  const summary = verdictSummary(winner, pkgA, pkgB, scoreA, scoreB)

  const winnerPkg = winner === "a" ? pkgA : winner === "b" ? pkgB : null

  return (
    <section className="band band--graphite verdict" aria-labelledby="verdict-title">
      <Container className="verdict__inner">
        <div className="verdict__lead">
          <h2 id="verdict-title" className="verdict__title">Verdict</h2>
          <p className="verdict__overall">
            <span className="verdict__label">Overall winner</span>
            <span className={winnerPkg ? "verdict__name mono" : "verdict__name"}>
              {winnerPkg ? winnerPkg.name : "Tie"}
            </span>
          </p>
          <p className="verdict__score num" aria-label={`Score ${scoreA} to ${scoreB}`}>
            <span>{pkgA.name} {scoreA}</span>
            <span>{pkgB.name} {scoreB}</span>
          </p>
          <p className="verdict__summary">{summary}</p>
        </div>

        <ol className="verdict__rows">
          {insights.map((insight) => (
            <InsightRow key={insight.category} insight={insight} pkgA={pkgA} pkgB={pkgB} />
          ))}
        </ol>
      </Container>
    </section>
  )
}
