import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ComparisonCardData } from "@/types/compare"
import { formatDownloads, formatSize } from "@/lib/utils"

function DownloadBar({
  valueA,
  valueB,
  nameA,
  nameB,
}: {
  valueA: number | null
  valueB: number | null
  nameA: string
  nameB: string
}) {
  if (!valueA && !valueB) return null

  const total = (valueA ?? 0) + (valueB ?? 0)
  const pctA = total > 0 ? Math.round(((valueA ?? 0) / total) * 100) : 50

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-[10px] w-16 truncate">{nameA}</span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground/70 rounded-full transition-all duration-500"
            style={{ width: `${pctA}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground w-8 text-right">{pctA}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-[10px] w-16 truncate">{nameB}</span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground/40 rounded-full transition-all duration-500"
            style={{ width: `${100 - pctA}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground w-8 text-right">{100 - pctA}%</span>
      </div>
    </div>
  )
}

export function ComparisonCard({ data }: { data: ComparisonCardData }) {
  const { pair, a, b } = data
  const href = `/compare?a=${pair.a}&b=${pair.b}`

  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full flex flex-col gap-0 p-5 transition-colors duration-150 group-hover:border-border group-hover:bg-accent/30">
        <CardContent className="p-0 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium bg-muted px-2 py-0.5 rounded">
              {pair.a}
            </span>
            <span className="text-xs text-muted-foreground">vs</span>
            <span className="font-mono text-sm font-medium bg-muted px-2 py-0.5 rounded">
              {pair.b}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Downloads / week</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-medium">{formatDownloads(a.downloads)}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{pair.a}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-medium">{formatDownloads(b.downloads)}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{pair.b}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Bundle size (gzip)</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-medium">{formatSize(a.bundleSize)}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{pair.a}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-medium">{formatSize(b.bundleSize)}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{pair.b}</span>
                </div>
              </div>
            </div>
          </div>

          <DownloadBar
            valueA={a.downloads}
            valueB={b.downloads}
            nameA={pair.a}
            nameB={pair.b}
          />
        </CardContent>
      </Card>
    </Link>
  )
}