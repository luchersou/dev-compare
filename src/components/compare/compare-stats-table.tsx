import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageDetails } from "@/types/global"
import { formatDownloads, formatSize } from "@/lib/utils"
import {
  Download,
  Star,
  GitFork,
  CircleDot,
  Scale,
  Calendar,
  Package,
} from "lucide-react"

interface CompareStatsTableProps {
  pkgA: PackageDetails
  pkgB: PackageDetails
}

interface StatRow {
  label: string
  icon: React.ReactNode
  valueA: string
  valueB: string
  winner?: "a" | "b" | "tie"
}

function higher(valA?: number, valB?: number): "a" | "b" | "tie" | undefined {
  if (valA == null || valB == null) return undefined
  if (valA > valB) return "a"
  if (valB > valA) return "b"
  return "tie"
}

function lower(valA?: number, valB?: number): "a" | "b" | "tie" | undefined {
  if (valA == null || valB == null) return undefined
  if (valA < valB) return "a"
  if (valB < valA) return "b"
  return "tie"
}

function WinnerBadge({ winner, side }: { winner?: "a" | "b" | "tie"; side: "a" | "b" }) {
  if (!winner || winner === "tie") return null
  if (winner !== side) return null
  return (
    <span
      className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary"
      aria-label="winner"
    />
  )
}

function StatCell({
  value,
  winner,
  side,
}: {
  value: string
  winner?: "a" | "b" | "tie"
  side: "a" | "b"
}) {
  const isWinner = winner === side
  return (
    <td className="py-3 px-4 text-center">
      <span
        className={`font-mono text-sm font-medium inline-flex items-center gap-1 ${
          isWinner ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {value}
        <WinnerBadge winner={winner} side={side} />
      </span>
    </td>
  )
}

export function CompareStatsTable({ pkgA, pkgB }: CompareStatsTableProps) {
  const rows: StatRow[] = [
    {
      label: "Weekly downloads",
      icon: <Download size={13} />,
      valueA: formatDownloads(pkgA.downloads?.weekly ?? null),
      valueB: formatDownloads(pkgB.downloads?.weekly ?? null),
      winner: higher(pkgA.downloads?.weekly, pkgB.downloads?.weekly),
    },
    {
      label: "Monthly downloads",
      icon: <Download size={13} />,
      valueA: formatDownloads(pkgA.downloads?.monthly ?? null),
      valueB: formatDownloads(pkgB.downloads?.monthly ?? null),
      winner: higher(pkgA.downloads?.monthly, pkgB.downloads?.monthly),
    },
    {
      label: "Yearly downloads",
      icon: <Download size={13} />,
      valueA: formatDownloads(pkgA.downloads?.yearly ?? null),
      valueB: formatDownloads(pkgB.downloads?.yearly ?? null),
      winner: higher(pkgA.downloads?.yearly, pkgB.downloads?.yearly),
    },
    {
      label: "GitHub stars",
      icon: <Star size={13} />,
      valueA: pkgA.github ? formatDownloads(pkgA.github.stars) : "—",
      valueB: pkgB.github ? formatDownloads(pkgB.github.stars) : "—",
      winner: higher(pkgA.github?.stars, pkgB.github?.stars),
    },
    {
      label: "Forks",
      icon: <GitFork size={13} />,
      valueA: pkgA.github ? formatDownloads(pkgA.github.forks) : "—",
      valueB: pkgB.github ? formatDownloads(pkgB.github.forks) : "—",
      winner: higher(pkgA.github?.forks, pkgB.github?.forks),
    },
    {
      label: "Open issues",
      icon: <CircleDot size={13} />,
      valueA: pkgA.github ? String(pkgA.github.issues) : "—",
      valueB: pkgB.github ? String(pkgB.github.issues) : "—",
      winner: lower(pkgA.github?.issues, pkgB.github?.issues),
    },
    {
      label: "Bundle (gzip)",
      icon: <Package size={13} />,
      valueA: formatSize(pkgA.bundle?.gzip ?? null),
      valueB: formatSize(pkgB.bundle?.gzip ?? null),
      winner: lower(pkgA.bundle?.gzip, pkgB.bundle?.gzip),
    },
    {
      label: "License",
      icon: <Scale size={13} />,
      valueA: pkgA.license ?? "—",
      valueB: pkgB.license ?? "—",
    },
    {
      label: "Latest release",
      icon: <Calendar size={13} />,
      valueA: pkgA.publishedAt
        ? new Date(pkgA.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
      valueB: pkgB.publishedAt
        ? new Date(pkgB.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
    },
  ]

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground w-[40%]">
                      Metric
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-mono font-medium text-foreground">
                      {pkgA.name}
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-mono font-medium text-foreground">
                      {pkgB.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {row.icon}
                          {row.label}
                        </div>
                      </td>
                      <StatCell value={row.valueA} winner={row.winner} side="a" />
                      <StatCell value={row.valueB} winner={row.winner} side="b" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}