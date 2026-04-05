import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PackageDetails } from "@/types/global"
import { generateIconColor } from "@/lib/utils"
import { GitCompareArrows, ExternalLink } from "lucide-react"
import Link from "next/link"

interface CompareHeaderProps {
  pkgA: PackageDetails
  pkgB: PackageDetails
}

function PackageIdentity({ pkg }: { pkg: PackageDetails }) {
  const color = generateIconColor(pkg.name)
  const initials = pkg.name.replace(/^@[^/]+\//, "").slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col items-center gap-3 text-center flex-1">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="font-mono text-lg font-semibold">{pkg.name}</span>
          <Badge variant="secondary" className="text-xs font-mono">
            v{pkg.version}
          </Badge>
        </div>

        {pkg.description && (
          <p className="text-sm text-muted-foreground max-w-[280px] line-clamp-2">
            {pkg.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 mt-1">
          {pkg.repository && (
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" asChild>
              <Link href={pkg.repository} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} />
                Repository
              </Link>
            </Button>
          )}
          {pkg.homepage && (
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" asChild>
              <Link href={pkg.homepage} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} />
                Homepage
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function CompareHeader({ pkgA, pkgB }: CompareHeaderProps) {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">

        {/* Label */}
        <div className="flex items-center justify-center gap-2">
          <GitCompareArrows size={16} className="text-muted-foreground" />
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Comparing packages
          </span>
        </div>

        {/* Packages */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          <PackageIdentity pkg={pkgA} />

          <div className="flex items-center justify-center md:mt-6">
            <span className="font-mono text-sm font-medium text-muted-foreground px-2">
              vs
            </span>
          </div>

          <PackageIdentity pkg={pkgB} />
        </div>

      </div>
    </section>
  )
}