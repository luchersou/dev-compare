import { Card, CardContent } from "@/components/ui/card"
import { formatDownloads, formatSize, formatStars } from "@/lib/utils"
import type { PackageDetails } from "@/types/global"
import {
  Download,
  Star,
  GitFork,
  CircleDot,
  FileCode,
  Zap,
} from "lucide-react"
import { Container } from "../layout/container"
import { Section } from "../layout/section"

interface StatsGridProps {
  pkg: PackageDetails
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  description?: string
}

function StatCard({ icon, label, value, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {value}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
          <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsGrid({ pkg }: StatsGridProps) {
  const stats = [
    {
      icon: <Download className="size-4" />,
      label: "Weekly downloads",
      value: formatDownloads(pkg.downloads?.weekly ?? null),
    },
    {
      icon: <Download className="size-4" />,
      label: "Monthly downloads",
      value: formatDownloads(pkg.downloads?.monthly ?? null),
    },
    {
      icon: <Download className="size-4" />,
      label: "Yearly downloads",
      value: formatDownloads(pkg.downloads?.yearly ?? null),
    },
    {
      icon: <FileCode className="size-4" />,
      label: "Bundle size",
      value: formatSize(pkg.bundle?.size ?? null),
      description: pkg.bundle ? `${formatSize(pkg.bundle.gzip)} gzipped` : undefined,
    },
    {
      icon: <Star className="size-4" />,
      label: "GitHub stars",
      value: pkg.github?.stars != null ? formatStars(pkg.github.stars) : "—",
    },
    {
      icon: <GitFork className="size-4" />,
      label: "Forks",
      value: formatDownloads(pkg.github?.forks ?? null),
    },
    {
      icon: <CircleDot className="size-4" />,
      label: "Open issues",
      value: formatDownloads(pkg.github?.issues ?? null),
    },
    {
      icon: <Zap className="size-4" />,
      label: "Gzip size",
      value: formatSize(pkg.bundle?.gzip ?? null),
    },
  ]

  return (
    <Section>
      <Container>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Stats
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </Section>
  )
}