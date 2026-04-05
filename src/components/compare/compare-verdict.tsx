import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageDetails } from "@/types/global"
import { 
	getDownloadsInsight, 
	getCommunityInsight, 
	getBundleInsight,
	getMaintenanceInsight,
	computeVerdict,
	verdictSummary,
} from "@/lib/verdict"
import {
  Trophy,
  Minus,
	Activity,
	Package,
	Star,
	Download,
} from "lucide-react"
import { generateIconColor } from "@/lib/utils"
import { Insight } from "@/types/verdict"

const categoryIcons: Record<string, React.ReactNode> = {
  Popularity: <Download size={14} />,
  Community: <Star size={14} />,
  "Bundle size": <Package size={14} />,
  Maintenance: <Activity size={14} />,
}

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
  const colorA = generateIconColor(pkgA.name)
  const colorB = generateIconColor(pkgB.name)

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {categoryIcons[insight.category]}
          <span className="font-medium">{insight.category}</span>
        </div>

        {insight.winner === "tie" ? (
          <Badge variant="outline" className="text-xs gap-1">
            <Minus size={10} />
            Tie
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-xs font-mono"
            style={{
              borderColor: insight.winner === "a" ? colorA : colorB,
              color: insight.winner === "a" ? colorA : colorB,
            }}
          >
            {insight.winner === "a" ? pkgA.name : pkgB.name}
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.reason}
      </p>
    </div>
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
  const winnerColor = winnerPkg ? generateIconColor(winnerPkg.name) : undefined

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Trophy size={15} className="text-muted-foreground" />
              <CardTitle className="text-base font-semibold">Verdict</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-0 pt-4">

            {/* Insights */}
            <div className="mb-6">
              {insights.map((insight) => (
                <InsightRow
                  key={insight.category}
                  insight={insight}
                  pkgA={pkgA}
                  pkgB={pkgB}
                />
              ))}
            </div>

            {/* Final verdict */}
            <div
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{
                backgroundColor: winnerColor
                  ? `color-mix(in oklch, ${winnerColor} 8%, transparent)`
                  : "var(--muted)",
                borderLeft: `3px solid ${winnerColor ?? "var(--border)"}`,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Overall winner
                </span>
                {winner === "tie" ? (
                  <Badge variant="secondary">Tie</Badge>
                ) : (
                  <Badge
                    className="font-mono text-xs text-white"
                    style={{ backgroundColor: winnerColor }}
                  >
                    {winnerPkg?.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary}
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </section>
  )
}