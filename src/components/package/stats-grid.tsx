import { Container } from "@/components/layout/container"
import { formatDownloads, formatSize, formatStars } from "@/lib/utils"
import type { PackageDetails } from "@/types/global"

interface StatsGridProps {
  pkg: PackageDetails
}

interface Stat {
  label: string
  value: string
  note?: string
}

function StatGroup({ title, stats }: { title: string; stats: Stat[] }) {
  return (
    <div className="stat-group">
      <h3 className="stat-group__title">{title}</h3>
      <dl className="stat-group__list">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <dt>{stat.label}</dt>
            <dd className="num">{stat.value}</dd>
            {stat.note && <dd className="stat__note">{stat.note}</dd>}
          </div>
        ))}
      </dl>
    </div>
  )
}

export function StatsGrid({ pkg }: StatsGridProps) {
  return (
    <section className="pkg-section" aria-labelledby="stats-title">
      <Container>
        <h2 id="stats-title" className="pkg-section__title">Stats</h2>
        <div className="stats-board">
          <StatGroup
            title="Downloads"
            stats={[
              { label: "Weekly downloads", value: formatDownloads(pkg.downloads?.weekly ?? null) },
              { label: "Monthly downloads", value: formatDownloads(pkg.downloads?.monthly ?? null) },
              { label: "Yearly downloads", value: formatDownloads(pkg.downloads?.yearly ?? null) },
            ]}
          />
          <StatGroup
            title="GitHub"
            stats={[
              { label: "GitHub stars", value: pkg.github?.stars != null ? formatStars(pkg.github.stars) : "—" },
              { label: "Forks", value: formatDownloads(pkg.github?.forks ?? null) },
              { label: "Open issues", value: formatDownloads(pkg.github?.issues ?? null) },
            ]}
          />
          <StatGroup
            title="Bundle"
            stats={[
              { label: "Bundle size", value: formatSize(pkg.bundle?.size ?? null), note: "minified" },
              { label: "Gzip size", value: formatSize(pkg.bundle?.gzip ?? null) },
            ]}
          />
        </div>
      </Container>
    </section>
  )
}
