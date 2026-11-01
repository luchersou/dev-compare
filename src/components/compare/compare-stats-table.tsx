import { Check } from "lucide-react"

import { Container } from "@/components/layout/container"
import { formatDownloads, formatSize } from "@/lib/utils"
import { PackageDetails } from "@/types/global"

interface CompareStatsTableProps {
  pkgA: PackageDetails
  pkgB: PackageDetails
}

interface StatRow {
  label: string
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
    <td className={isWinner ? "cmp-cell cmp-cell--lead" : "cmp-cell"}>
      <span className="num">{value}</span>
      {isWinner && (
        <>
          <Check aria-hidden="true" />
          <span className="visually-hidden">leads</span>
        </>
      )}
    </td>
  )
}

export function CompareStatsTable({ pkgA, pkgB }: CompareStatsTableProps) {
  const rows: StatRow[] = [
    {
      label: "Weekly downloads",
      valueA: formatDownloads(pkgA.downloads?.weekly ?? null),
      valueB: formatDownloads(pkgB.downloads?.weekly ?? null),
      winner: higher(pkgA.downloads?.weekly, pkgB.downloads?.weekly),
    },
    {
      label: "Monthly downloads",
      valueA: formatDownloads(pkgA.downloads?.monthly ?? null),
      valueB: formatDownloads(pkgB.downloads?.monthly ?? null),
      winner: higher(pkgA.downloads?.monthly, pkgB.downloads?.monthly),
    },
    {
      label: "Yearly downloads",
      valueA: formatDownloads(pkgA.downloads?.yearly ?? null),
      valueB: formatDownloads(pkgB.downloads?.yearly ?? null),
      winner: higher(pkgA.downloads?.yearly, pkgB.downloads?.yearly),
    },
    {
      label: "GitHub stars",
      valueA: pkgA.github ? formatDownloads(pkgA.github.stars) : "—",
      valueB: pkgB.github ? formatDownloads(pkgB.github.stars) : "—",
      winner: higher(pkgA.github?.stars, pkgB.github?.stars),
    },
    {
      label: "Forks",
      valueA: pkgA.github ? formatDownloads(pkgA.github.forks) : "—",
      valueB: pkgB.github ? formatDownloads(pkgB.github.forks) : "—",
      winner: higher(pkgA.github?.forks, pkgB.github?.forks),
    },
    {
      label: "Open issues",
      valueA: pkgA.github ? String(pkgA.github.issues) : "—",
      valueB: pkgB.github ? String(pkgB.github.issues) : "—",
      winner: lower(pkgA.github?.issues, pkgB.github?.issues),
    },
    {
      label: "Bundle (gzip)",
      valueA: formatSize(pkgA.bundle?.gzip ?? null),
      valueB: formatSize(pkgB.bundle?.gzip ?? null),
      winner: lower(pkgA.bundle?.gzip, pkgB.bundle?.gzip),
    },
    {
      label: "License",
      valueA: pkgA.license ?? "—",
      valueB: pkgB.license ?? "—",
    },
    {
      label: "Latest release",
      valueA: pkgA.publishedAt
        ? new Date(pkgA.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
      valueB: pkgB.publishedAt
        ? new Date(pkgB.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
    },
  ]

  return (
    <section className="cmp-section" aria-labelledby="stats-title">
      <Container>
        <h2 id="stats-title" className="cmp-section__title">Stats</h2>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col" className="mono">{pkgA.name}</th>
                <th scope="col" className="mono">{pkgB.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <StatCell value={row.valueA} winner={row.winner} side="a" />
                  <StatCell value={row.valueB} winner={row.winner} side="b" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}
